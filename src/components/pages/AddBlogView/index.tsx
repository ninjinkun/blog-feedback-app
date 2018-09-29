import * as React from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import { Dispatch } from 'redux';
import MDSpinner from 'react-md-spinner';
import { BrowserRouter, Route, Link, Redirect, match as matchParam, withRouter, RouteComponentProps } from 'react-router-dom';
import { fetchBlog } from './../../../models/feed-fetcher';
import { BlogRepository } from '../../../models/repositories';
import Wrapper from '../../atoms/Wrapper/index';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/states/app-state';
import { addBlog } from '../../../redux/actions/add-blog-action';

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
        {this.state.loading ? <Wrapper><MDSpinner /></Wrapper> : null}
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
    const blogResponse = await fetchBlog(blogURL);
    if (blogResponse) {
      BlogRepository.saveBlog(
        user.uid,
        blogResponse.url,
        blogResponse.title,
        blogResponse.feedUrl,
        blogResponse.feedType
      );
      this.setState({ loading: false });
      this.props.history.push(`/blogs/${encodeURIComponent(blogResponse.url)}`);
    } else {
      // show error
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  'blog': state.addBlog
});

function mapDispatchToProps(dispatch: Dispatch<AppState>) {
  return {
    addBlog: (auth: firebase.auth.Auth, blogURL: string) => addBlog(auth, blogURL)(dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddBlogView);