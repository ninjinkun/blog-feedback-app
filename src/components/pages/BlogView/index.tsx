import * as React from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import MDSpinner from 'react-md-spinner';
import { Link } from 'react-router-dom';
import { BlogRepository } from '../../../models/repositories';
import { BlogEntity } from '../../../models/entities';
import BlogCell from '../../organisms/BlogCell/index';
import ScrollView from '../../atoms/ScrollView/index';
import { AppState } from '../../../redux/states/app-state';
import { BlogState } from '../../../redux/states/blog-state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchBlogsAsyncAction } from '../../../redux/actions/blog-action';

type Props = {
  blog: BlogState;
  fetchBlogs: (userId: string) => any;
};

class BlogView extends React.Component<Props, { user?: firebase.User }> {
  constructor(props: any) {
    super(props);
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
      this.props.fetchBlogs(user.uid);
    }
  }

  render() {
    const { blogs } = this.props.blog;
    if (blogs && blogs.length) {
      return blogs.map((blog) => (
        <Link to={`/blogs/${encodeURIComponent(blog.url)}`} key={blog.url}>
          <BlogCell
            title={blog.title}
            favicon={`http://www.google.com/s2/favicons?domain=${blog.url}`}
          />
        </Link>
      ));
    } else {
      return (<ScrollView><Spinner singleColor={'blue'} /></ScrollView>);
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  'blog': state.blog
});

function mapDispatchToProps(dispatch: Dispatch<AppState>) {
  return {
    fetchBlogs: (userId: string) => fetchBlogsAsyncAction(userId)(dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogView);

const Spinner = styled(MDSpinner)`
  width: 100%;
  height: 100%;
  position: relative;
`;
