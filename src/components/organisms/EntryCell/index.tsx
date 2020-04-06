import React from 'react';
import styled from 'styled-components';
import { CountType, toServiceURL } from '../../../models/consts/count-type';
import Favicon from '../../atoms/Favicon/index';
import * as properties from '../../properties';
import AnimatedCountButton from '../AnimatedCountButton/index';

export type Count = {
  type: CountType;
  count?: number;
  animate: boolean;
};

type Props = {
  favicon: string;
  title: string;
  counts: Count[];
  url: string;
};

const EntryCell: React.FunctionComponent<Props> = ({ favicon, title, counts, url, ...props }) => (
  <AnkerWrapper {...props} href={url} target="_blank" rel="noopener">
    <Favicon src={favicon} />
    <ContentWrapper>
      <Title>{title}</Title>
      <ButtonWrapper>
        {counts.map((count) => (
          <AnimatedCountButton
            animate={count.animate}
            key={count.type}
            type={count.type}
            count={count.count}
            href={toServiceURL(count.type, url) || ''}
            target={'_blank'}
          />
        ))}
      </ButtonWrapper>
    </ContentWrapper>
  </AnkerWrapper>
);

export default EntryCell;

const AnkerWrapper = styled.a`
  display: flex;
  flex-direction: row;
  padding: 8px;
  background: ${properties.colorsValue.white};
  border: ${properties.border};
  margin: 6px 12px;
  box-sizing: border-box;
  box-shadow: 0 0 1px 0 #e1e1e1;
  &:first-child {
    margin: 12px 12px 6px 12px;
  }
  &:last-child {
    margin: 6px 12px 12px 12px;
  }
  transition: ${properties.hoverAnimation};
  &:hover {
    background-color: ${properties.colors.hover};
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.h3`
  font-size: ${properties.fontSizes.m};
  margin: 0 8px 8px 8px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: stretch;
  flex-wrap: wrap;
`;
