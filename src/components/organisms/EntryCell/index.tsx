import * as React from 'react';
import styled from 'styled-components';
import * as properties from '../../properties';
import { CountType, toServiceURL } from '../../../consts/count-type';
import Favicon from '../../atoms/Favicon/index';
import AnimatedCountButton from '../AnimatedCountButton/index';

type Count = {
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

const EntryCell: React.SFC<Props> = ({ favicon, title, counts, url, ...props }) => (
  <AnkerWrapper {...props} href={url}>
    <Favicon src={favicon} />
    <ContentWrapper>
      <Title>{title}</Title>
      <ButtonWrapper>
        {counts.map(count =>
          <AnimatedCountButton 
            animate={count.animate} 
            key={count.type} 
            type={count.type} 
            count={count.count || 0} 
            onClick={ (e) =>  {
              e.preventDefault();
              const location = toServiceURL(count.type, url);
              if (location) {
                window.location.href = location;
              }
            }}
          />
        )}
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
`;
