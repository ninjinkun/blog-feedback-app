import React from 'react';
import styled from 'styled-components';
import Anker from '../../atoms/Anker/index';
import { PrimaryButton } from '../../atoms/Button/index';
import ScrollView from '../../atoms/ScrollView/index';
import Wrapper from '../../atoms/Wrapper/index';
import * as properties from '../../properties';
import PageLayout from '../../templates/PageLayout/index';

const WelcomePage = () => (
  <PageLayout
    header={{
      title: 'BlogFeedback',
    }}
  >
    <StyledScrollView>
      <BodyWrapper>
        <Title>BlogFeedbackへようこそ！</Title>
        <MessageWrapper>
          <Text>BlogFeedbackはブログのソーシャルボタンの数を集計し、反響を確認できるサービスです。</Text>
        </MessageWrapper>
        <ImageWrapper>
          <DemoVideo
            src="https://player.vimeo.com/video/306609900?autoplay=1&loop=1&muted=1"
            width="270"
            height="584"
            frameBorder={0}
            allowFullScreen={true}
          />
        </ImageWrapper>
        <SigninButtonWrapper>
          <PrimaryButton as="a" href="/signin">
            ユーザー登録 / ログインへ進む（無料）
          </PrimaryButton>
        </SigninButtonWrapper>
        <TermAndPrivacyWrapper>
          <Anker href="/term" target="_blank">
            利用規約
          </Anker>
          <Slash>/</Slash>
          <Anker href="/privacy" target="_blank">
            プライバシーポリシー
          </Anker>
        </TermAndPrivacyWrapper>
        <TermAndPrivacyWrapper>
          <Anker href="https://github.com/ninjinkun/blog-feedback-app" target="_blank">
            GitHub
          </Anker>
        </TermAndPrivacyWrapper>
      </BodyWrapper>
    </StyledScrollView>
  </PageLayout>
);

export default WelcomePage;

const StyledScrollView = styled(ScrollView)`
  padding: 16px;
  min-height: 100%;
`;

const Title = styled.h2`
  color: ${properties.colors.grayDark};
  font-size: ${properties.fontSizes.xl};
`;

const BodyWrapper = styled(Wrapper)`
  font-size: ${properties.fontSizes.m};
  align-items: center;
`;

const MessageWrapper = styled(Wrapper)`
  color: ${properties.colors.grayDark};
  font-size: ${properties.fontSizes.m};
  max-width: 30em;
  line-height: 1.5em;
`;

const ImageWrapper = styled(Wrapper)`
  margin: 24px 16px 16px 16px;
`;

const DemoVideo = styled.iframe`
  width: 270px;
  height: 584px;
  box-shadow: 0 0 4px 0 ${properties.colors.grayLight};
`;

const SigninButtonWrapper = styled(Wrapper)`
  justify-content: center;
  margin: 24px 16px 12px 16px;
`;

const TermAndPrivacyWrapper = styled(Wrapper)`
  flex-direction: row;
  margin: 8px 0 8px 0;
  font-size: ${properties.fontSizes.s};
`;

const Slash = styled.p`
  margin: 0 0.3em 0 0.3em;
`;

const Text = styled.p`
  font-size: ${properties.fontSizes.s};
  color: ${properties.colors.grayDark};
  line-height: 1.4em;
  margin: 0.5em 0;
`;
