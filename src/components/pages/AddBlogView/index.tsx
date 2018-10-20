import * as React from 'react';
import styled from 'styled-components';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Dispatch } from 'redux';
import { BrowserRouter, Route, Link, Redirect, match as matchParam, withRouter, RouteComponentProps } from 'react-router-dom';
import { fetchBlog } from './../../../models/feed-fetcher';
import Wrapper from '../../atoms/Wrapper/index';
import Spinner from '../../atoms/Spinner/index';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/states/app-state';
import { addBlog } from '../../../redux/actions/add-blog-action';
import { AddBlogState } from '../../../redux/states/add-blog-state';

type StateProps = {
  addBlogState: AddBlogState;
};

type DispatchProps = {
  addBlog: (auth: firebase.auth.Auth, blogURL: string) => any;
};

class AddBlogView extends React.Component<StateProps & DispatchProps & RouteComponentProps<{}>, { url: string }> {
  constructor(props: any) {
    super(props);
    this.state = { url: '' };
  }

  render() {
    const { loading, error, finished, blogURL } = this.props.addBlogState;
    if (finished && blogURL) {
      return (<Redirect to={`/blogs/${encodeURIComponent(blogURL)}`} />);
    } else {
      return (
        <Wrapper>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <label>
              Blog URL:
              <input type="url" value={this.state.url} onChange={(e) => { this.setState({ url: e.target.value }); }} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          {loading ? <Wrapper><Spinner /></Wrapper> : null}
          {error ? <Wrapper>{error.message}</Wrapper> : null}
        </Wrapper>
      );
    }
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.props.addBlog(firebase.auth(), this.state.url);
  }
}

const mapStateToProps = (state: AppState) => ({
  'addBlogState': state.addBlog
});

function mapDispatchToProps(dispatch: Dispatch<AppState>) {
  return {
    addBlog: (auth: firebase.auth.Auth, blogURL: string) => addBlog(auth, blogURL)(dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddBlogView);