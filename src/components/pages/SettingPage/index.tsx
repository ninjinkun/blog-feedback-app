import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import styled from 'styled-components';
import { CountType } from '../../../consts/count-type';
import { deleteBlog, DeleteBlogActions, deleteBlogReset } from '../../../redux/actions/delete-blog-action';
import { FeedFirebaseActions, fetchFirebaseBlog } from '../../../redux/actions/feed-action';
import { saveSetting, SettingActions } from '../../../redux/actions/setting-action';
import { AppState } from '../../../redux/states/app-state';
import { DeleteBlogState } from '../../../redux/states/delete-blog-state';
import { FeedState } from '../../../redux/states/feed-state';
import { WarningButton } from '../../atoms/Button/index';
import Favicon from '../../atoms/Favicon/index';
import ScrollView from '../../atoms/ScrollView/index';
import Spinner from '../../atoms/Spinner/index';
import Wrapper from '../../atoms/Wrapper/index';
import LoadingView from '../../molecules/LoadingView/index';
import SettingCell from '../../organisms/SettingCell/index';
import SectionHeader from '../../organisms/SettingSectionHeader/index';
import * as properties from '../../properties';
import PageLayout from '../../templates/PageLayout/index';

type StateProps = {
  feedState: FeedState;
  deleteBlogState: DeleteBlogState;
};

type DispatchProps = {
  fetchFirebaseBlog: (...props: Parameters<typeof fetchFirebaseBlog>) => void;
  deleteBlog: (...props: Parameters<typeof deleteBlog>) => void;
  deleteBlogReset: () => void;
  saveSetting: (...props: Parameters<typeof saveSetting>) => void;
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

  enableCountType(enabled: boolean, type: CountType) {
    const blogURL = decodeURIComponent(this.props.match.params.blogURL);
    const { feedState } = this.props;
    if (feedState && feedState.title && feedState.services) {
      feedState.services[type] = enabled;
      const { twitter, facebook, hatenabookmark, hatenastar, pocket } = feedState.services;
      this.props.saveSetting(firebase.auth(), blogURL, twitter, facebook, hatenabookmark, hatenastar, pocket || true);
    }
  }

  render() {
    const { feedState, deleteBlogState } = this.props;
    if (deleteBlogState.finished) {
      return <Redirect to={'/settings'} />;
    } else {
      return (
        <PageLayout
          header={{
            title: `${(feedState && feedState.title) || 'ブログ'}の設定`,
            backButtonLink: '/settings',
          }}
        >
          {feedState && feedState.title && feedState.services ? (
            <StyledScrollView>
              <SectionHeader>集計するサービス</SectionHeader>
              <SettingCell
                title="Twitter（Twitterはシェア数を集計するAPIがないため、現在シェア数は表示されません）"
                LeftIcon={<Favicon src={require('../../../assets/images/twitter-icon.png')} />}
                RightIcon={
                  <CheckBox
                    type="checkbox"
                    defaultChecked={feedState && feedState.services && feedState.services.twitter}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      this.enableCountType((e.target as HTMLInputElement).checked, CountType.Twitter)
                    }
                  />
                }
              />
              <SettingCell
                title="Facebook"
                LeftIcon={<Favicon src={require('../../../assets/images/facebook-icon.png')} />}
                RightIcon={
                  <CheckBox
                    type="checkbox"
                    defaultChecked={feedState && feedState.services && feedState.services.facebook}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      this.enableCountType((e.target as HTMLInputElement).checked, CountType.Facebook)
                    }
                  />
                }
              />
              <SettingCell
                title="はてなブックマーク"
                LeftIcon={<Favicon src={require('../../../assets/images/hatenabookmark-icon.png')} />}
                RightIcon={
                  <CheckBox
                    type="checkbox"
                    defaultChecked={feedState && feedState.services && feedState.services.hatenabookmark}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      this.enableCountType((e.target as HTMLInputElement).checked, CountType.HatenaBookmark)
                    }
                  />
                }
              />
              <SettingCell
                title="はてなスター"
                LeftIcon={<Favicon src={require('../../../assets/images/hatenastar-icon.png')} />}
                RightIcon={
                  <CheckBox
                    type="checkbox"
                    defaultChecked={feedState && feedState.services && feedState.services.hatenastar}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      this.enableCountType((e.target as HTMLInputElement).checked, CountType.HatenaStar)
                    }
                  />
                }
              />
              <SettingCell
                title="Pocket"
                LeftIcon={<Favicon src={require('../../../assets/images/pocket-icon.png')} />}
                RightIcon={
                  <CheckBox
                    type="checkbox"
                    defaultChecked={feedState && feedState.services && feedState.services.pocket}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      this.enableCountType((e.target as HTMLInputElement).checked, CountType.Pocket)
                    }
                  />
                }
              />
              <SectionHeader />
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
          ) : (
            <LoadingView />
          )}
        </PageLayout>
      );
    }
  }
}

const CheckBox = styled.input`
  width: 16px;
  height: 16px;
`;

const StyledScrollView = styled(ScrollView)`
  background-color: ${properties.colors.white};
  min-height: 100%;
`;

const DeleteWrapper = styled(Wrapper)`
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const StyledWarningButton = styled(WarningButton)`
  width: 100%;
  justify-content: center;
`;

const SpinnerWrapper = styled(Wrapper)`
  margin: 16px;
`;

function mapStateToProps(state: AppState, ownProps: OwnProps): StateProps {
  return {
    feedState: state.feeds.feeds[decodeURIComponent(ownProps.match.params.blogURL)],
    deleteBlogState: state.deleteBlog,
  };
}

type TD = ThunkDispatch<AppState, undefined, FeedFirebaseActions | DeleteBlogActions | SettingActions>;
function mapDispatchToProps(dispatch: TD & Dispatch<DeleteBlogActions>): DispatchProps {
  return {
    fetchFirebaseBlog: (...props) => dispatch(fetchFirebaseBlog(...props)),
    deleteBlog: (...props) => dispatch(deleteBlog(...props)),
    deleteBlogReset: () => dispatch(deleteBlogReset()),
    saveSetting: (...props) => dispatch(saveSetting(...props)),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SettingPage)
);
