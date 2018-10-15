import * as React from 'react';
import styled from 'styled-components';
import * as properties from '../../properties';

const SmartphoneLayout: React.SFC<{}> = ({children, ...props}) => (
  <Layout>
    <Content {...props}>{children}</Content>
  </Layout>
);

export default SmartphoneLayout;

const Content = styled.div`
  max-width: 600px;
  width: 100%;
  min-height: 100vh;  
  flex-shrink: 0;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  border-left: solid 1px ${properties.colorsValue.grayLight};
  border-right: solid 1px ${properties.colorsValue.grayLight};
`;

const Layout = styled.div`
  background: ${properties.colorsValue.grayPale};
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  width: 100%;
  min-height: 100vh;  
`;