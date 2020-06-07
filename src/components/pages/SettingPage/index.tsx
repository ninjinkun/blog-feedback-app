import firebase from 'firebase/app';
import 'firebase/auth';
import { clone } from 'lodash';
import React, { useEffect } from 'react';
import { MdMailOutline } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import styled from 'styled-components';
import { CountType } from '../../../models/consts/count-type';
import { AppState } from '../../../redux/slices/app-state';
import { DeleteBlogState, deleteBlogSlice, deleteBlog } from '../../../redux/slices/delete-blog-state';
import { FeedState } from '../../../redux/slices/feeds-state';
import Anker from '../../atoms/Anker/index';
import Button, { WarningButton } from '../../atoms/Button/index';
import Favicon from '../../atoms/Favicon/index';
import ScrollView from '../../atoms/ScrollView/index';
import Spinner from '../../atoms/Spinner/index';
import Wrapper from '../../atoms/Wrapper/index';
import LoadingView from '../../molecules/LoadingView/index';
import SettingCell from '../../organisms/SettingCell/index';
import SectionHeader from '../../organisms/SettingSectionHeader/index';
import * as properties from '../../properties';
import PageLayout from '../../templates/PageLayout/index';
import { UserState, fetchUser } from '../../../redux/slices/user-state';
import { fetchFirebaseBlog } from '../../../redux/slices/feeds-state';
import { SettingState, saveSetting, sendTestReportMail } from '../../../redux/slices/settings-state';


type Props = RouteComponentProps<{ blogURL: string }>;

const SettingPage: React.FC<Props> = (props) => {
  const blogURL = decodeURIComponent(props.match.params.blogURL);

  const userState = useSelector<AppState, UserState>((state) => state.user);
  const feedState = useSelector<AppState, FeedState>((state) => state.feeds.feeds[blogURL]);
  const settingState = useSelector<AppState, SettingState>(state => state.settings.settings[blogURL]);
  const deleteBlogState = useSelector<AppState, DeleteBlogState>((state) => state.deleteBlog);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(deleteBlogSlice.actions.reset());
    dispatch(fetchFirebaseBlog(firebase.auth(), blogURL));
    dispatch(fetchUser(firebase.auth()));
    return () => undefined;
  }, [dispatch]);

  const saveSettings = (
    sendReport: boolean,
    twitter: boolean,
    countjsoon: boolean,
    facebook: boolean,
    hatenabookmark: boolean,
    hatenastar: boolean,
    pocket: boolean
  ) => {
    dispatch(saveSetting(
      firebase.auth(),
      blogURL,
      sendReport,
      twitter,
      countjsoon,
      facebook,
      hatenabookmark,
      hatenastar,
      pocket
    ));
  };

  const enableSendReport = (enabled: boolean) => {
    if (feedState && feedState.services) {
      const { twitter, countjsoon, facebook, hatenabookmark, hatenastar, pocket } = feedState.services;
      saveSettings(enabled, twitter, countjsoon, facebook, hatenabookmark, hatenastar, pocket || true);
    }
  };

  const enableCountType = (enabled: boolean, type: CountType) => {
    if (feedState && feedState.services) {
      const services = clone(feedState.services);
      if (type) {
        services[type] = enabled;
      }
      const { twitter, countjsoon, facebook, hatenabookmark, hatenastar, pocket } = services;
      saveSettings(
        feedState.sendReport || false,
        twitter,
        countjsoon,
        facebook,
        hatenabookmark,
        hatenastar,
        pocket || true
      );
    }
  };

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
              title="Twitter"
              description={<Description>Count APIが廃止されたため、現在シェア数は表示されません。</Description>}
              LeftIcon={<Favicon src={require('../../../assets/images/twitter-icon.png')} />}
              RightIcon={
                <Toggle
                  type="checkbox"
                  icons={false}
                  defaultChecked={feedState && feedState.services && feedState.services.twitter}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    enableCountType((e.target as HTMLInputElement).checked, CountType.Twitter)
                  }
                />
              }
            />
            <SettingCell
              title="count.jsoon"
              description={
                <Description>
                  <Anker href="https://jsoon.digitiminimi.com/" target="_blank" rel="noopener">
                    count.jsoon
                  </Anker>
                  は(株)ディジティ・ミニミが提供する廃止されたTwitter Count APIの互換APIです。
                  <Anker href="https://jsoon.digitiminimi.com/" target="_blank" rel="noopener">
                    count.jsoon
                  </Anker>
                  のサイトからブログのURLを登録するとBlogFeedbackにもTwitterのシェア数が表示されます。
                </Description>
              }
              LeftIcon={<Favicon src="/images/twitter-icon.png" />}
              RightIcon={
                <Toggle
                  type="checkbox"
                  icons={false}
                  defaultChecked={feedState && feedState.services && feedState.services.countjsoon}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    enableCountType((e.target as HTMLInputElement).checked, CountType.CountJsoon)
                  }
                />
              }
            />
            <SettingCell
              title="Facebook"
              LeftIcon={<Favicon src="/images/facebook-icon.png" />}
              RightIcon={
                <Toggle
                  type="checkbox"
                  icons={false}
                  defaultChecked={feedState && feedState.services && feedState.services.facebook}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    enableCountType((e.target as HTMLInputElement).checked, CountType.Facebook)
                  }
                />
              }
            />
            <SettingCell
              title="はてなブックマーク"
              LeftIcon={<Favicon src="/images/hatenabookmark-icon.png" />}
              RightIcon={
                <Toggle
                  type="checkbox"
                  icons={false}
                  defaultChecked={feedState && feedState.services && feedState.services.hatenabookmark}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    enableCountType((e.target as HTMLInputElement).checked, CountType.HatenaBookmark)
                  }
                />
              }
            />
            <SettingCell
              title="はてなスター"
              LeftIcon={<Favicon src="/images/hatenastar-icon.png" />}
              RightIcon={
                <Toggle
                  type="checkbox"
                  icons={false}
                  defaultChecked={feedState && feedState.services && feedState.services.hatenastar}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    enableCountType((e.target as HTMLInputElement).checked, CountType.HatenaStar)
                  }
                />
              }
            />
            <SettingCell
              title="Pocket"
              LeftIcon={<Favicon src="/images/pocket-icon.png" />}
              RightIcon={
                <Toggle
                  type="checkbox"
                  icons={false}
                  defaultChecked={feedState && feedState.services && feedState.services.pocket}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    enableCountType((e.target as HTMLInputElement).checked, CountType.Pocket)
                  }
                />
              }
            />
            <SectionHeader />
            <SettingCell
              title="デイリーレポートメールを購読する"
              description={
                <Description>
                  毎朝シェア数が増加していると更新レポートが
                  {(userState.user && userState.user.email) || 'メールアドレス'}
                  に送られます（この機能はα版です）。
                  <SendMailButtonWrapper>
                    <Button onClick={() => dispatch(sendTestReportMail(blogURL))}>テストメールを送る</Button>
                    {settingState && settingState.loading ? (
                      <SpinnerWrapper>
                        <Spinner />
                      </SpinnerWrapper>
                    ) : undefined}
                  </SendMailButtonWrapper>
                </Description>
              }
              LeftIcon={<MdMailOutline size="16" />}
              RightIcon={
                <Toggle
                  type="checkbox"
                  defaultChecked={feedState && feedState.sendReport}
                  icons={false}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    enableSendReport((e.target as HTMLInputElement).checked)
                  }
                />
              }
            />
            <SectionHeader />
            <DeleteWrapper>
              <StyledWarningButton onClick={() => dispatch(deleteBlog(firebase.auth(), blogURL))}>
                {`${(feedState && feedState.title) || 'ブログ'}`}を削除
              </StyledWarningButton>
              {deleteBlogState.loading ? (
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
              ) : undefined}
            </DeleteWrapper>
          </StyledScrollView>
        ) : (
          <LoadingView />
        )}
      </PageLayout>
    );
  }
};

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

const Description = styled.p`
  margin: 0;
  line-height: ${properties.fontSizes.l};
`;

const SendMailButtonWrapper = styled(Wrapper)`
  align-items: center;
  margin: 8px;
`;

export default SettingPage;
