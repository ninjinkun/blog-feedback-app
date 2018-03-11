import React from 'react'
import { Image, StyleSheet, Text, View, Button, TouchableHighlight, Linking, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import firebase from 'firebase'
import firestore from 'firebase/firestore'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { BlogResponse, ItemResponse, CountResponse, COUNT_TYPE_FACEBOOK, COUNT_TYPE_HATENA_BOOKMARK } from './responses';
import Crawler from './crawler'
import { Repository, UserRepository, BlogRepository, ItemRepository, CountRepository } from './repositories'

const config = {
  apiKey: "AIzaSyBxWFRf0NnBcC8Uf9JJggjkOlaGGAdZwvE",
  authDomain: "feedback-5e26f.firebaseapp.com",
  databaseURL: "https://feedback-5e26f.firebaseio.com",
  projectId: "feedback-5e26f",
  storageBucket: "feedback-5e26f.appspot.com",
  messagingSenderId: "844615095944"
};
firebase.initializeApp(config);
const db = firebase.firestore();
db.enablePersistence();

// Components
const Card = ({ children }) => <View style={styles.card}>{children}</View>
const Title = ({ children }) => <Text style={styles.title}>{children}</Text>
const App = () => (
  <Card>
    <Header />
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    <FeedView />
  </Card>
)

// Styles
const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  header: {
    position: "fixed",
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
})

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

class BlogView extends View {
  render() {
    return (
      <View>
        <Image src="" /><Text>{this.props.title}</Text>
      </View>
    )
  }
}

class FeedItemView extends View {
  render() {
    return (
      <View>
        <TouchableOpacity>
          <Text accessibilityRole="link"
            href={this.props.link}>{this.props.title}</Text>
        </TouchableOpacity>
        <View style={styles.buttons}>
          <CountButton image={require('./twitter-icon.png')} count={0} />
          <CountButton image={require('./facebook-icon.png')} count={this.props.facebook_count} />
          <CountButton image={require('./hatenabookmark-icon.png')} count={this.props.hatena_bookmark_count} />
        </View>
      </View>
    )
  }
}

const CountButton = ({ count, image }) => (
  <TouchableHighlight style={styles.button}>
    <View style={styles.buttonContent}>
      <Image source={image} style={styles.image} />
      <Text>{count}</Text>
    </View>
  </TouchableHighlight>
)

class FeedView extends View {
  constructor(props) {
    super(props);
    this.state = { items: [], counts: [], user: null };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ 'user': user });
      if (!user) { 
        return 
      } else {
//        this.fetchFeeds();
        this.fetchDB();
      }
    })
  }

  async fetchFeeds() {
    const [fetchBlog, fetchFeed, fetchCount] = Crawler.crawl('http://ninjinkun.hatenablog.com/');

    let blogResponse;
    {
      blogResponse = await fetchBlog;
      new BlogRepository().setBlog({ 
        userId: firebase.auth().currentUser.uid, 
        blogUrl:  blogResponse.url, 
        blogTitle: blogResponse.title, 
        feedUrl: blogResponse.feedUrl, 
        feedType: blogResponse.feedType 
      });
      this.setState({ title: blogResponse.title })
    }

    {
      const feedItemsResponse = await fetchFeed;
      this.setState({ 'items': feedItemsResponse })    
      
      const batch = new Repository().db.batch();              
      feedItemsResponse.forEach(item => {
        new ItemRepository().setItemBatch({
          batch: batch, 
          userId: firebase.auth().currentUser.uid, 
          blogUrl: blogResponse.url, 
          itemUrl: item.url, 
          itemTitle: item.title, 
          published: item.published
        });                
      });
      batch.commit();  
    }

    {
      const countsResponse = await fetchCount;
      this.setState({ 'counts': countsResponse });
      
      const batch = new Repository().db.batch();
      countsResponse.filter((count) => count && count.count > 0).forEach(count => {
        new CountRepository().addCountBatch({ batch: batch, userId: firebase.auth().currentUser.uid, blogUrl: blogResponse.url, countUrl: count.url, countType: count.type, count: count.count });
      });
      batch.commit();
    }
  }

  async fetchDB() {
    const blogUrl = 'http://ninjinkun.hatenablog.com/';
    const blogEntity = await new BlogRepository().getBlog({ userId: firebase.auth().currentUser.uid, blogUrl: blogUrl} );
    this.setState({ title: blogEntity.data().title })    
    
    const itemEntities = await new ItemRepository().getItems({ userId: firebase.auth().currentUser.uid, blogUrl: blogUrl });
    this.setState({ items: itemEntities });
    
    const counts = await Promise.all(
      [].concat.apply([], [COUNT_TYPE_FACEBOOK, COUNT_TYPE_HATENA_BOOKMARK].map(type => 
        itemEntities.map((item) => new CountRepository().getLatestCount({ userId: firebase.auth().currentUser.uid, blogUrl: blogUrl, itemUrl: item.url, countType: type }))
      ))
    );
    this.setState({ counts: counts.filter((i) => i) });
  }

  render() {
    if (this.state.items.length) {
      const counts = [].concat.apply([], this.state.counts);

      const facebookMap = new Map(counts.filter((c) => c.type === COUNT_TYPE_FACEBOOK).map(i => [i.url, i.count]));
      const hatenaBookmarkMap = new Map(counts.filter((c) => c.type === COUNT_TYPE_HATENA_BOOKMARK).map((i) => [i.url, i.count]));

      return (<ScrollView style={styles.feedContainer}>
      {this.state.items.map(
        (item) => <FeedItemView
          title={item.title}
          link={item.url}
          facebook_count={facebookMap.get(item.url) || 0}
          hatena_bookmark_count={hatenaBookmarkMap.get(item.url) || 0}
          key={item.url}
      />)}
      </ScrollView>);   
    } else {
      return (<View style={styles.activityIndicatorContainer}><ActivityIndicator size="large" /></View>);
    }
  }
}
