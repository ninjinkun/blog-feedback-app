import * as React from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import BlogCell from '../../organisms/BlogCell/index';
import ScrollView from '../../atoms/ScrollView/index';
import { AppState } from '../../../redux/states/app-state';
import { BlogState } from '../../../redux/states/blog-state';
import { connect } from 'react-redux';
import { fetchBlogs, BlogActions } from '../../../redux/actions/blog-action';
import { Button } from '../../atoms/Button/index';
import LoadingView from '../../molecules/LoadingView/index';
import Wrapper from '../../atoms/Wrapper/index';
import { ThunkDispatch } from 'redux-thunk';
import PageLayout from '../../templates/PageLayout/index';
import { RouteComponentProps } from 'react-router';
import SettingCell from '../../organisms/SettingCell/index';
import { Link } from 'react-router-dom';
import { signOut } from '../../../redux/actions/user-action';

type StateProps = {
  blog: BlogState;
};

type DispatchProps = {
  fetchBlogs: (auth: firebase.auth.Auth) => any;
  signOut: (auth: firebase.auth.Auth) => any;
};

type Props = StateProps & DispatchProps & RouteComponentProps;

class SettingsPage extends React.PureComponent<Props, {}> {
  constructor(props: any) {
    super(props);
    this.signOut = this.signOut.bind(this);
  }
  componentDidMount() {
    this.fetchBlogs();
  }

  fetchBlogs() {
    this.props.fetchBlogs(firebase.auth());
  }

  signOut() {
    this.props.signOut(firebase.auth())
  }

  render() {
    const { history } = this.props;
    const { blogs, loading } = this.props.blog;

    const content = () => {
      if (blogs && blogs.length) {
        return (
          <StyledScrollView>
            <SettingCell><Button onClick={this.signOut}>ログアウト</Button></SettingCell>
            {blogs.map((blog) => (
              <Link to={`/settings/${encodeURIComponent(blog.url)}`} key={blog.url}>
                <BlogCell
                  title={blog.title}
                  favicon={`https://www.google.com/s2/favicons?domain=${blog.url}`}
                />
              </Link>
            ))}
          </StyledScrollView>
        );
      } else if (loading) {
        return (<LoadingView />);
      }
    };

    return (
      <PageLayout header={{
        title: '設定',
        backButtonLink: '/',
      }}>
        {content()}
      </PageLayout>
    )
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  blog: state.blog
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, undefined, BlogActions>): DispatchProps => ({
  fetchBlogs: (auth) => dispatch(fetchBlogs(auth)),
  signOut: (auth) => dispatch(signOut(auth)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);

const StyledScrollView = styled(ScrollView)`
  background-color: white;
  min-height: 100%;
`;
