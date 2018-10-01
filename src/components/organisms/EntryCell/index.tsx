import * as React from 'react';
import styled from 'styled-components';
import * as properties from '../../properties';
import CountButton from '../../molecules/CountButton/index';
import { CountType } from '../../../consts/count-type';
import Favicon from '../../atoms/Favicon/index';
import Twincle from '../../atoms/Twincle/index';

type Count = {
    type: CountType;
    count?: number;
};

type Props = {
    favicon: string;
    title: string;
    counts: Count[];
    url: string;
    animate?: boolean;    
};

const EntryCell: React.SFC<Props> = ({favicon, title, animate, counts, url, ...props}) => (
    <AnkerWrapper {...props} href={url}>
        <Favicon src={favicon}/>
        <ContentWrapper>
            <Title>{title}</Title>
            <ButtonWrapper>
                {counts.map(count => 
                    <StyledTwincle animate={animate} key={count.type} >
                        <StyledCountButton type={count.type} count={count.count} />
                    </StyledTwincle>
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
    margin: 8px 16px;
    box-shadow: 0px 0px 0.5px 0.5px #ddd;
&:first-child {
    margin: 16px 16px 8px 16px;
}
&:last-child {
    margin: 8px 16px 16px 16px;
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

const StyledTwincle = styled(Twincle)`
  display: flex;
  position: relative;
  flex-grow: 1;
`;

const StyledCountButton = styled(CountButton)`
  position: relative;
  margin: 0.2rem;
  flex-grow: 1;
`;