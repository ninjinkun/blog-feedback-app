import * as React from 'react';
import { TextProperties, Image, StyleSheet, 
  Text, View, Button, TouchableHighlight, Linking, 
  TouchableOpacity, ScrollView, ActivityIndicator, ViewProperties } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { BlogResponse, ItemResponse, CountResponse, 
  COUNT_TYPE_FACEBOOK, COUNT_TYPE_HATENA_BOOKMARK } from './responses';
import Crawler from './crawler';
import { Repository, UserRepository, BlogRepository, ItemRepository, CountRepository } from './repositories';
import { ItemEntity, CountEntity } from './entities';

const config = {
  apiKey: 'AIzaSyBxWFRf0NnBcC8Uf9JJggjkOlaGGAdZwvE',
  authDomain: 'feedback-5e26f.firebaseapp.com',
  databaseURL: 'https://feedback-5e26f.firebaseio.com',
  projectId: 'feedback-5e26f',
  storageBucket: 'feedback-5e26f.appspot.com',
  messagingSenderId: '844615095944'
};
firebase.initializeApp(config);

const db: firebase.firestore.Firestore = firebase.firestore();
db.enablePersistence();

// Styles
const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  header: {
    position: 'fixed',
    top: 0,
    height: 44
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  image: {
    height: 16,
    width: 16,
    marginVertical: 10
  },
  button: {
    flexGrow: 1,
    flexDirection: 'row'
  },
  buttonContent: {
    flexDirection: 'row'
  },
  buttons: {
    flexDirection: 'row'
  },
  activityIndicatorContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  feedContainer: {
    flexGrow: 1,
    height: 500
  }
} as any);

// Components
const Card = ({ children }: { children: any }) => <View style={styles.card}>{children}</View>;
const Title = ({ children }: { children: string }) => <Text style={styles.title}>{children}</Text>;
const App = () => (
  <Card>
    <Header />
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    <FeedView />
  </Card>
);

export default App;

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/signedIn',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ]
};

const Header = () => (
  <View style={styles.header}>
    <Title>BlogFeedback</Title>
  </View>
);

class BlogView extends React.Component<{title: string}> {
  render() {
    return (
      <View>
        <Image source={{uri: ''}}/><Text>{this.props.title}</Text>
      </View>
    );
  }
}

class FeedItemView extends React.Component<{link: string, title: string, facebookCount: number, hatenaBookmarkCount: number}> {
  render() {
    return (
      <View>
        <TouchableOpacity>
          <Text accessibilityRole="link" href={this.props.link}>{this.props.title}</Text>
        </TouchableOpacity>
        <View style={styles.buttons}>
          <CountButton image={require('./twitter-icon.png')} count={0} />
          <CountButton image={require('./facebook-icon.png')} count={this.props.facebookCount} />
          <CountButton image={require('./hatenabookmark-icon.png')} count={this.props.hatenaBookmarkCount} />
        </View>
      </View>
    );
  }
}

const CountButton = ({ count, image }: { count: number, image: string }) => (
  <TouchableHighlight style={styles.button}>
    <View style={styles.buttonContent}>
      <Image source={{uri: image}} style={styles.image} />
      <Text>{count}</Text>
    </View>
  </TouchableHighlight>
);

class FeedView extends React.Component<{}, { title: string, items: ItemResponse[]|ItemEntity[], counts: CountResponse[]|CountEntity[], user?: firebase.User  }> {
  constructor() {
    super({});
    this.state = { title: '', items: [], counts: []};
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ 'user': user! });
      if (!user) { 
        return; 
      } else {
//        this.fetchFeeds();
        this.fetchDB();
      }
    });
  }

  async fetchFeeds() {
    const [fetchBlog, fetchFeed, fetchCount] = Crawler.crawl('http://ninjinkun.hatenablog.com/');
    const user = firebase.auth().currentUser!;
    let blogResponse: BlogResponse;
    {
      blogResponse = await fetchBlog;
      new BlogRepository().setBlog(
        user.uid, 
        blogResponse.url, 
        blogResponse.title, 
        blogResponse.feedUrl, 
        blogResponse.feedType 
      );
      this.setState({ title: blogResponse.title });
    }

    {
      const feedItemsResponse = await fetchFeed;
      this.setState({ 'items': feedItemsResponse });   
      
      const batch = new Repository().db.batch();              
      feedItemsResponse.forEach((item: ItemResponse) => {
        new ItemRepository().setItemBatch(
          batch, 
          user.uid, 
          blogResponse.url, 
          item.url, 
          item.title, 
          item.published
        );                
      });
      batch.commit();  
    }

    {
      const countsResponse = await fetchCount;
      this.setState({ 'counts': countsResponse });
      
      const batch = new Repository().db.batch();
      countsResponse.filter((count: CountResponse) => count && count.count > 0).forEach(count => {
        new CountRepository().addCountBatch(batch, user.uid, blogResponse.url, count.url, count.type, count.count);
      });
      batch.commit();
    }
  }

  async fetchDB() {
    const blogUrl = 'http://ninjinkun.hatenablog.com/';
    const user = firebase.auth().currentUser!;
    
    const blogEntity = await new BlogRepository().getBlog(user.uid, blogUrl);
    this.setState({ title: blogEntity.data()!.title });
    
    const itemEntities = await new ItemRepository().getItems(user.uid, blogUrl);
    this.setState({ items: itemEntities });
    
    const counts = await (Promise.all(
      [].concat.apply([], [COUNT_TYPE_FACEBOOK, COUNT_TYPE_HATENA_BOOKMARK].map(type => 
        itemEntities.map((item) => new CountRepository().getLatestCount(user.uid, blogUrl, item.url, type))
      )) as Promise<CountEntity>[]
    ));
    this.setState({ counts: counts.filter((i) => i) });
  }

  render() {
    if (this.state.items.length) {
      const counts = [].concat.apply([], this.state.counts);

      const facebookMap = new Map<string, number>(counts.filter((c: CountResponse) => c.type === COUNT_TYPE_FACEBOOK).map((i: CountResponse) => [i.url, i.count]));
      const hatenaBookmarkMap = new Map<string, number>(counts.filter((c: CountResponse) => c.type === COUNT_TYPE_HATENA_BOOKMARK).map((i: CountResponse) => [i.url, i.count]));

      return (
      <ScrollView style={styles.feedContainer}>
        {this.state.items.map(
          (item: ItemResponse) => 
            <FeedItemView
              title={item.title}
              link={item.url}
              facebookCount={facebookMap.get(item.url) || 0}
              hatenaBookmarkCount={hatenaBookmarkMap.get(item.url) || 0}
              key={item.url} 
            />
        )}
      </ScrollView>);   
    } else {
      return (<View style={styles.activityIndicatorContainer}><ActivityIndicator size="large" /></View>);
    }
  }
}
