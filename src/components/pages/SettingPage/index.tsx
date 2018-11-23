import * as React from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { WarningButton } from '../../atoms/Button/index';
import PageLayout from '../../templates/PageLayout/index';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';
import { AppState } from '../../../redux/states/app-state';
import { FeedState } from '../../../redux/states/feed-state';
import { FeedActions, fetchFirebaseBlog, FeedFirebaseActions } from '../../../redux/actions/feed-action';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { deleteBlog, deleteBlogReset, DeleteBlogActions } from '../../../redux/actions/delete-blog-action';
import { DeleteBlogState } from '../../../redux/states/delete-blog-state';
import { Dispatch } from 'redux';
import Spinner from '../../atoms/Spinner/index';
import Wrapper from '../../atoms/Wrapper/index';
import * as properties from '../../properties';
import ScrollView from '../../atoms/ScrollView/index';

type StateProps = {
  feedState: FeedState;
  deleteBlogState: DeleteBlogState;
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
    this.props.deleteBlog(firebase.auth(), blogURL)
  }

  render() {
    const { history, feedState, deleteBlogState } = this.props;
    console.log(deleteBlogState);
    if (deleteBlogState.finished) {
      return (<Redirect to={'/settings'} />)
    } else {
      return (
        <PageLayout header={{
          title: `${feedState && feedState.title || 'ブログ'}の設定`,
          backButtonLink: '/settings/',
        }}>
          <StyledScrollView>
            <DeleteWrapper>
              <StyledWarningButton onClick={this.deleteBlog}>{`${feedState && feedState.title || 'ブログ'}`}を削除</StyledWarningButton>
            {deleteBlogState.loading ? <SpinnerWrapper><Spinner /></SpinnerWrapper> : undefined}
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
  deleteBlogState: state.deleteBlog
});

type TD = ThunkDispatch<AppState, undefined, FeedFirebaseActions | DeleteBlogActions>;

const mapDispatchToProps = (dispatch: TD | Dispatch<DeleteBlogActions>): DispatchProps => ({
  fetchFirebaseBlog: (auth, blogURL) => (dispatch as TD)(fetchFirebaseBlog(auth, blogURL)),
  deleteBlog: (auth, blogURL) => (dispatch as TD)(deleteBlog(auth, blogURL)),
  deleteBlogReset: () => dispatch(deleteBlogReset()),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingPage));
