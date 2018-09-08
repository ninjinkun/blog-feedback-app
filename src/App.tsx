import * as React from 'react';
import {
  ActivityIndicator
} from 'react-native';
import styled from 'styled-components';
import { BrowserRouter, Route, Link, Redirect, match as matchParam, withRouter, RouteComponentProps } from 'react-router-dom';
import * as firebase from 'firebase';
import { BlogRepository } from './models/repositories';
import { StyledFirebaseAuth } from 'react-firebaseui';
import FeedView from './FeedView';
import { BlogEntity } from './models/entities';
import * as H from 'history';
import { fetchBlog } from './models/feed-fetcher';
import {
  BlogResponse
} from './models/responses';
import Header from './components/organisms/Header/index';
import BlogCell from './components/organisms/BlogCell/index';
import ScrollView from './components/atoms/ScrollView/index';

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

// Components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

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
  <Wrapper>
    <Header title={'BlogFeedback'} />
    <BlogView />
  </Wrapper>
);

const StyledHeader = styled(Header)`
  position: fixed;  
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderWrapper = styled.div`
  z-index: 100;
  position: relative;  
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderSpacer = styled.div`
  min-height: 64px;
  width: 100%;
`;

const Feed = ({ match, ...props }: { match: matchParam<{ url: string }> } & RouteComponentProps<{}>) => (
  <Wrapper>
    <HeaderWrapper>
      <StyledHeader
        title={'BlogFeedback'}
        onBackButtonClick={() => {
          props.history.push('/blogs/');
        }}
      />
    </HeaderWrapper>
    <HeaderSpacer />
    <FeedView url={decodeURIComponent(match.params.url)} />
  </Wrapper>
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

class AddBlogView extends React.Component<{} & RouteComponentProps<{}>, { url: string, loading: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { url: '', loading: false };
  }

  render() {
    return (
      <Wrapper>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <label>
            Blog URL:
            <input type="text" value={this.state.url} onChange={(e) => { this.setState({ url: e.target.value }); }} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        {this.state.loading ? <Wrapper><ActivityIndicator size="large" /></Wrapper> : null}
      </Wrapper>
    );
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.addBlog(this.state.url);
  }

  async addBlog(blogURL: string) {
    this.setState({ loading: true });
    const user = firebase.auth().currentUser;
    if (!user) {
      return;
    }
    const blogResponse: BlogResponse = await fetchBlog(blogURL);
    new BlogRepository().setBlog(
      user.uid,
      blogResponse.url,
      blogResponse.title,
      blogResponse.feedUrl,
      blogResponse.feedType
    );
    this.setState({ loading: false });
    this.props.history.push(`/blogs/${encodeURIComponent(blogResponse.url)}`);
  }
}

class BlogView extends React.Component<{}, { user?: firebase.User, blogs: BlogEntity[] }> {
  constructor(props: any) {
    super(props);
    this.state = { blogs: [] };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user });
        this.fetchBlogs();
      }
    });
  }
  async fetchBlogs() {
    const user = firebase.auth().currentUser;
    if (user) {
      const blogs = await new BlogRepository().getBlogs(user.uid);
      this.setState({ blogs: blogs });
    }
  }

  render() {
    if (this.state.blogs && this.state.blogs.length) {
      return this.state.blogs.map((blog) => (
        <a href={`/blogs/${encodeURIComponent(blog.url)}`} key={blog.url}>
          <BlogCell 
            title={blog.title} 
            favicon={`http://www.google.com/s2/favicons?domain=${blog.url}`} 
          />
        </a>
      ));
    } else {
      return (<ScrollView><ActivityIndicator size="large" /></ScrollView>);
    }
  }
}
