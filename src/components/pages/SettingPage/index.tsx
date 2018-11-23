import * as firebase from 'firebase/app';
import 'firebase/auth';
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import styled from 'styled-components';
import { deleteBlog, DeleteBlogActions, deleteBlogReset } from '../../../redux/actions/delete-blog-action';
import { FeedActions, FeedFirebaseActions, fetchFirebaseBlog } from '../../../redux/actions/feed-action';
import { AppState } from '../../../redux/states/app-state';
import { DeleteBlogState } from '../../../redux/states/delete-blog-state';
import { FeedState } from '../../../redux/states/feed-state';
import { UserState } from '../../../redux/states/user-state';
import { WarningButton } from '../../atoms/Button/index';
import ScrollView from '../../atoms/ScrollView/index';
import Spinner from '../../atoms/Spinner/index';
import Wrapper from '../../atoms/Wrapper/index';
import * as properties from '../../properties';
import PageLayout from '../../templates/PageLayout/index';

type StateProps = {
  feedState: FeedState;
  deleteBlogState: DeleteBlogState;
  userState: UserState;
};

type DispatchProps = {
  fetchFirebaseBlog: (auth: firebase.auth.Auth, blogURL: string) => void;
  deleteBlog: (auth: firebase.auth.Auth, blogURL: string) => void;
  deleteBlogReset: () => void;
};

type OwnProps = RouteComponentProps<{ blogURL: string }>;

type Props = OwnProps & StateProps & DispatchProps;

class SettingPage extends React.PureComponent<Props, {}> {
  constructor(props: any) {
    super(props);
    this.deleteBlog = this.deleteBlog.bind(this);
  }

  componentDidMount() {
    const blogURL = decodeURIComponent(this.props.match.params.blogURL);
    this.props.deleteBlogReset();
    this.props.fetchFirebaseBlog(firebase.auth(), blogURL);
  }

  deleteBlog() {
    const blogURL = decodeURIComponent(this.props.match.params.blogURL);
    this.props.deleteBlog(firebase.auth(), blogURL);
  }

  render() {
    const { history, feedState, deleteBlogState, userState } = this.props;
    console.log(deleteBlogState);
    if (deleteBlogState.finished) {
      return <Redirect to={'/settings'} />;
    } else {
      return (
        <PageLayout
          header={{
            title: `${(feedState && feedState.title) || 'ブログ'}の設定`,
            backButtonLink: '/settings/',
          }}
        >
          <StyledScrollView>
            <DeleteWrapper>
              <StyledWarningButton onClick={this.deleteBlog}>
                {`${(feedState && feedState.title) || 'ブログ'}`}を削除
              </StyledWarningButton>
              {deleteBlogState.loading ? (
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
              ) : (
                undefined
              )}
            </DeleteWrapper>
          </StyledScrollView>
        </PageLayout>
      );
    }
  }
}

const StyledScrollView = styled(ScrollView)`
  padding: 16px;
  background-color: ${properties.colors.white};
  min-height: 100%;
`;

const DeleteWrapper = styled(Wrapper)`
  justify-content: center;
  width: 100%;
  align-items: center;
`;

const StyledWarningButton = styled(WarningButton)`
  width: 100%;
  justify-content: center;
`;

const SpinnerWrapper = styled(Wrapper)`
  margin: 16px;
`;

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => ({
  feedState: state.feeds.feeds[decodeURIComponent(ownProps.match.params.blogURL)],
  deleteBlogState: state.deleteBlog,
  userState: state.user,
});

type TD = ThunkDispatch<AppState, undefined, FeedFirebaseActions | DeleteBlogActions>;

const mapDispatchToProps = (dispatch: TD | Dispatch<DeleteBlogActions>): DispatchProps => ({
  fetchFirebaseBlog: (auth, blogURL) => (dispatch as TD)(fetchFirebaseBlog(auth, blogURL)),
  deleteBlog: (auth, blogURL) => (dispatch as TD)(deleteBlog(auth, blogURL)),
  deleteBlogReset: () => dispatch(deleteBlogReset()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SettingPage)
);
