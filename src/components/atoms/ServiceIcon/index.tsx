import React from 'react';
import styled from 'styled-components';
import { CountType } from './../../../models/consts/count-type';

type Props = {
  type: CountType;
};

const ServiceIcon = ({ ...props }: Props) => {
  switch (props.type) {
    case CountType.Twitter:
      return <TwitterIcon {...props} />;
    case CountType.CountJsoon:
      return <TwitterIcon {...props} />;
    case CountType.Facebook:
      return <FacebookIcon {...props} />;
    case CountType.HatenaBookmark:
      return <HatenaBookmarkIcon {...props} />;
    case CountType.HatenaStar:
      return <HatenaStarIcon {...props} />;
    case CountType.Pocket:
      return <PocketIcon {...props} />;
    default:
      return null;
  }
};

export default ServiceIcon;

export const TwitterIcon = ({ ...props }) => <Img src="/images/twitter-icon.png" {...props} />;
export const FacebookIcon = ({ ...props }) => <Img src="/images/facebook-icon.png" {...props} />;
export const HatenaBookmarkIcon = ({ ...props }) => <Img src="/images/hatenabookmark-icon.png" {...props} />;
export const HatenaStarIcon = ({ ...props }) => <Img src="/images/hatenastar-icon.png" {...props} />;
export const PocketIcon = ({ ...props }) => <Img src="/images/pocket-icon.png" {...props} />;

const Img = styled.img`
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
`;
