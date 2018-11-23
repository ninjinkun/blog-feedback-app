import React from 'react';
import styled from 'styled-components';
import * as properties from '../../properties';

type Props = {
  title?: string;
};

const SettingCell: React.FunctionComponent<Props> = ({ title, children, ...props }) => (
  <CellWrapper>
    <ContentWrapper>
      <Title>{title}</Title>
      {children}
    </ContentWrapper>
    <Underline />
  </CellWrapper>
);

export default SettingCell;

const CellWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${properties.baseMargin};
  background-color: ${properties.colors.white};
  margin: 0;
  padding: 16px 8px 0px 8px;
  transition: ${properties.hoverAnimation};
  &:hover {
    background-color: ${properties.colors.hover};
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

const Title = styled.h3`
  font-size: ${properties.fontSizes.m};
  margin: 0 8px 8px 8px;
`;

const Underline = styled.span`
  border-bottom: ${properties.border};
  margin: 8px 0 0 ${8 + 16}px;
`;
