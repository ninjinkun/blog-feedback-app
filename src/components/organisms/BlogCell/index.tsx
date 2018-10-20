import * as React from 'react';
import styled from 'styled-components';
import * as properties from '../../properties';
import Favicon from '../../atoms/Favicon/index';
import { Link } from 'react-router-dom';
import { LocationDescriptor } from 'history';

type Props = {
    favicon: string;
    title: string;
    to: LocationDescriptor;
};

const BlogCell = ({to, favicon, title, ...props}: Props) => (
  <LinkWrapper to={to} {...props}>
    <ContentWrapper>
      <Favicon src={favicon}/>
      <Title>{title}</Title>
    </ContentWrapper>
    <Underline />
  </LinkWrapper>
);

export default BlogCell;

const LinkWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: ${properties.baseMargin};  
  background-color: white;
  margin: 0;
  padding: 16px 8px 0px 8px;
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