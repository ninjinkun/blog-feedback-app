import React, { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';
import Wrapper from '../../atoms/Wrapper/index';
import PlainCell from '../../molecules/PlainCell/index';
import * as properties from '../../properties';

type Props = {
  LeftIcon?: ReactElement<{}>;
  RightIcon?: ReactElement<{}>;
  title: string;
  description?: ReactElement<{}>;
};

const SettingCell: React.FunctionComponent<Props> = ({ LeftIcon, RightIcon, title, description, ...props }) => (
  <PlainCell>
    <CountentWrapper>
      <Left>
        {LeftIcon}
        <TitleWrapper>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </TitleWrapper>
      </Left>
      <Right>{RightIcon}</Right>
    </CountentWrapper>
  </PlainCell>
);

export default SettingCell;

const Title = styled.h3`
  font-size: ${properties.fontSizes.m};
  margin: 0 8px 8px 0px;
`;

const CountentWrapper = styled(Wrapper)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const Left = styled(Wrapper)`
  flex-direction: row;
`;

const Right = styled(Wrapper)`
  flex-direction: row;
`;

const TitleWrapper = styled.div`
  flex-direction: row;
  margin-left: 8px;
`;

const Description = styled.div`
  font-size: ${properties.fontSizes.s};
  margin: 0;
`;
