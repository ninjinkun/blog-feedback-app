
import * as React from 'react';
import styled from 'styled-components';
import * as properties from '../../properties';
import CountType from '../../../consts/count-type';

type Props = {
    type: CountType;
};

const ServiceIcon = ({...props}: Props) => {
    switch (props.type) {
        case CountType.Twitter:
            return <TwitterIcon {...props}/>;
        case CountType.Facebook:
            return <FacebookIcon {...props}/>;
        case CountType.HatenaBookmark:
            return <HatenaBookmarkIcon {...props}/>;
        default:
            return null;
    }
};

export default ServiceIcon;

export const TwitterIcon = ({...props}) => <Img src={require('../../../assets/images/twitter-icon.png')} {...props} />;
export const FacebookIcon = ({...props}) => <Img src={require('../../../assets/images/facebook-icon.png')} {...props} />;
export const HatenaBookmarkIcon = ({...props}) => <Img src={require('../../../assets/images/hatenabookmark-icon.png')}  {...props} />;

const Img = styled.img`
width: 24px;
height: 24px;
`;
