import React from 'react';
import styled from 'styled-components';
import Wrapper from '../../atoms/Wrapper/index';
import FacebookButton from '../../molecules/SocialButtons/FacebookButton/index';
import HatenaBookmarkButton from '../../molecules/SocialButtons/HatenaBookmarkButton/index';
import TweetButton from '../../molecules/SocialButtons/TweetButton/index';

const SocialButtons: React.FunctionComponent = ({ ...props }) => (
  <SocialButtonsWrapper {...props}>
    <ButtonWrapper>
      <TweetButton url="https://blog-feedback.app/" />
    </ButtonWrapper>
    <ButtonWrapper>
      <FacebookButton url="https://blog-feedback.app/" />
    </ButtonWrapper>
    <ButtonWrapper>
      <HatenaBookmarkButton url="https://blog-feedback.app/" />
    </ButtonWrapper>
  </SocialButtonsWrapper>
);

export default SocialButtons;

const SocialButtonsWrapper = styled(Wrapper)`
  flex-direction: row;
  justify-content: center;
`;

const ButtonWrapper = styled(Wrapper)`
  margin: 0 4px;
`;
