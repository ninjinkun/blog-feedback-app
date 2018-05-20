import * as React from 'react';
import {
  TextProperties, Image, StyleSheet,
  Text, View, Button, TouchableHighlight, TextInput,
  TouchableOpacity, ScrollView, ActivityIndicator, ViewProperties
} from 'react-native';
import { BrowserRouter, Route, Link, Redirect, match as matchParam, withRouter, RouteComponentProps } from 'react-router-dom';
import * as firebase from 'firebase';
import { BlogRepository } from './repositories';
import { StyledFirebaseAuth } from 'react-firebaseui';
import FeedView from './FeedView';
import { BlogEntity } from './entities';
import * as H from 'history';

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
const styles = StyleSheet.create<any>({
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
  }
});

// Components
const Wrapper = ({ children }: { children: JSX.Element | JSX.Element[] }) => <View style={styles.card}>{children}</View>;
const Title = ({ children }: { children: string }) => <Text style={styles.title}>{children}</Text>;

class Login extends React.Component<{}, { user?: firebase.User }> {

  constructor(props: any) {
    super(props);
    this.state = { user: undefined };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ 'user': user! });
    });
  }

  render() {
    if (this.state.user) {
      return (
        <Redirect from="/" to="/blogs" />
      );
    } else {
      return (
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      );
    }
  }
}

const App = () => (
  <BrowserRouter>
    <Wrapper>
      <Route exact={true} path="/" component={Login} />
      <Route exact={true} path="/blogs" component={Blog} />
      <Route exact={true} path="/add" component={AddBlogView} />
      <Route exact={true} path="/blogs/:url" component={Feed} />
    </Wrapper>
  </BrowserRouter>
);
export default App;

const Blog = () => (
  <View>
    <HeaderWithRouter title={'BlogFeedback'} />
    <BlogView />
  </View>
);

const Feed = ({ match }: { match: matchParam<{ url: string }> }) => (
  <View>
    <HeaderWithRouter title={'BlogFeedback'} />
    <FeedView url={decodeURIComponent(match.params.url)} />
  </View>
);

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

class Header extends React.Component<{ title: string } & RouteComponentProps<{}>> {
  render() {
    return (
      <View style={styles.header}>
        <Link to="/"><Title>{this.props.title}</Title></Link>
        <Button title="+" onPress={() => { this.props.history.push('/add'); }} />
      </View>
    );
  }
}

const HeaderWithRouter = withRouter(Header);

class AddBlogView extends React.Component {
  // render() {
  //   return (
  //     <View>
  //       <TextInput onEndEditing={(event : { nativeEvent: any }) => {
  //         const text: string = event.nativeEvent
  //       }} />
  //     </View>
  //   );
  // }
  // addBlog(text: string) {
    
  // }
}

class BlogView extends React.Component<{}, { user?: firebase.User, blogs: BlogEntity[] }> {
  constructor(props: any) {
    super(props);
    this.state = { blogs: [] };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        return;
      } else {
        this.setState({ user: user });
        this.fetchBlogs();
      }
    });
  }
  async fetchBlogs() {
    const user = firebase.auth().currentUser;
    if (!user) {
      return;
    }
    const blogs = await new BlogRepository().getBlogs(user.uid);
    this.setState({ blogs: blogs });
  }

  render() {
    if (this.state.blogs && this.state.blogs.length) {
      return this.state.blogs.map((blog) => <BlogItemView title={blog.title} url={blog.url} key={blog.url} />);
    } else {
      return (<View style={styles.activityIndicatorContainer}><ActivityIndicator size="large" /></View>);
    }
  }
}

class BlogItemView extends React.Component<{ title: string, url: string }> {
  render() {
    return (
      <View>
        <Link to={`/blogs/${encodeURIComponent(this.props.url)}`} ><Image source={{ uri: `http://www.google.com/s2/favicons?domain=${this.props.url}` }} /><Text>{this.props.title}</Text></Link>
      </View>
    );
  }
}
