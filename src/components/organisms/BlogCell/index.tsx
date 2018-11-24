import React from 'react';
import styled from 'styled-components';
import Favicon from '../../atoms/Favicon/index';
import PlainCell from '../../molecules/PlainCell/index';
import * as properties from '../../properties';

type Props = {
  favicon: string;
  title: string;
};

const BlogCell = ({ favicon, title, ...props }: Props) => (
  <PlainCell {...props}>
    <Favicon src={favicon} />
    <Title>{title}</Title>
  </PlainCell>
);

export default BlogCell;

const Title = styled.h3`
  font-size: ${properties.fontSizes.m};
  margin: 0 8px 8px 8px;
`;
