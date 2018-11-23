import * as React from 'react';
import styled from 'styled-components';
import Wrapper from '../../atoms/Wrapper/index';
import Header, { HeaderProps } from '../../organisms/Header/index';

type Props = { header: HeaderProps };

const PageLayout: React.SFC<Props> = ({ children, header, ...props }) => {
  return (
    <BodyWrapper {...props}>
      <HeaderWrapper>
        <FixedHeader {...header} />
      </HeaderWrapper>
      <HeaderSpacer />
      {children}
    </BodyWrapper>
  );
};

export default PageLayout;

const BodyWrapper = styled(Wrapper)`
  min-height: 100vh;
`;

const FixedHeader = styled(Header)`
  position: fixed;
  width: 100%;
  display: flex;
  flex-direction: column;
  left: 0;
  right: 0;
`;

const HeaderWrapper = styled(Wrapper)`
  z-index: 100;
  position: relative;
  width: 100%;
  align-items: center;
`;

const HeaderSpacer = styled.div`
  min-height: 64px;
  width: 100%;
`;
