import React, { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';
import Wrapper from '../../atoms/Wrapper/index';
import PlainCell from '../../molecules/PlainCell/index';
import * as properties from '../../properties';

type Props = {
  LeftIcon?: ReactElement<{}>;
  RightIcon?: ReactElement<{}>;
  title: string;
};

const SettingCell: React.FunctionComponent<Props> = ({ LeftIcon, RightIcon, title, ...props }) => (
  <PlainCell>
    <CountentWrapper>
      <Left>
        {LeftIcon}
        <Title>{title}</Title>
      </Left>
      <Right>{RightIcon}</Right>
    </CountentWrapper>
  </PlainCell>
);

export default SettingCell;

const Title = styled.h3`
  font-size: ${properties.fontSizes.m};
  margin: 0 8px 8px 8px;
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
