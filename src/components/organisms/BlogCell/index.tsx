import * as React from 'react';
import styled from 'styled-components';
import * as properties from '../../properties';
import Favicon from '../../atoms/Favicon/index';

type Props = {
    favicon: string;
    title: string;
};

const BlogCell = ({...props}: Props) => (
  <Wrapper>
    <ContentWrapper {...props}>
      <Favicon src={props.favicon}/>
      <Title>{props.title}</Title>
    </ContentWrapper>
    <Underline />
  </Wrapper>
);

export default BlogCell;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${properties.baseMargin};  
  background-color: white;
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
  margin-top: 8px;
  margin-left: ${8 + 16}px;
`;