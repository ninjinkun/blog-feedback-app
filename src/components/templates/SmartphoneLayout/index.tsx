import * as React from 'react';
import styled from 'styled-components';
import * as properties from '../../properties';

const SmartphoneLayout: React.SFC<{}> = ({children, ...props}) => (
  <Background>
    <Content>{children}</Content>
  </Background>
);

export default SmartphoneLayout;

const Content = styled.div`
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  border-left: solid 1px ${properties.colorsValue.grayLight};
  border-right: solid 1px ${properties.colorsValue.grayLight};
`;

const Background = styled.div`
  background: ${properties.colorsValue.grayPale};
  width: 100%;
  min-height: 100vh;  
`;