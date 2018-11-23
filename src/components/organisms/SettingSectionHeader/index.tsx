import React from 'react';
import styled from 'styled-components';
import * as properties from '../../properties';

const SectionHeader = styled.div`
  display: flex;
  width: 100%;
  padding: 25px 16px 8px 8px;
  font-weight: ${properties.fontWeights.bold};
  font-size: ${properties.fontSizes.s};
  color: ${properties.colors.gray};
  background-color: ${properties.colors.grayPale};
  border-top: 1px solid ${properties.colors.grayLight};
  border-bottom: 1px solid ${properties.colors.grayLight};
  position: relative;
  top: -1px;
`;

export default SectionHeader;
