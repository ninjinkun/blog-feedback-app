import * as React from 'react';
import styled from 'styled-components';

import Spinner from '../../atoms/Spinner/index';
import Wrapper from '../../atoms/Wrapper/index';

const LoadingView: React.FunctionComponent = (...props) => (
  <SpinnerContainer {...props}>
    <Spinner />
  </SpinnerContainer>
);
export default LoadingView;

const SpinnerContainer = styled(Wrapper)`
  width: 100%;
  height: 100%;
  align-items: center;
  padding-top: 16px;
`;
