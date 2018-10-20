import * as React from 'react';
import styled from 'styled-components';
import * as properties from '../../properties';
import { MdArrowBack, MdAdd } from 'react-icons/md';
import HeaderLoadingIndicator from '../../molecules/HeaderLoadingIndicator/index';

type HeaderProps = {
    title: string;
    loadingLabel?: string;
    loadingRatio?: number;
    loading?: boolean;
    onHeaderClick?: React.MouseEventHandler;
    onBackButtonClick?: React.MouseEventHandler;
    onAddButtonClick?: React.MouseEventHandler;
};

const Header = ({...props}: HeaderProps) => (
    <HeaderLayout onClick={props.onHeaderClick} {...props}>
        <HeaderLoadingIndicator 
            ratio={props.loadingRatio} 
            label={props.loadingLabel} 
            loading={props.loading ? props.loading : false}
        />
        <HeaderContent>
            {!!props.onBackButtonClick ? <BackButton size={28} onClick={props.onBackButtonClick}/> : <Spacer />}
            <TitleLayout><Title>{props.title}</Title></TitleLayout>
            {!!props.onAddButtonClick ? <AddButton size={28} onClick={props.onAddButtonClick}/> : <Spacer />}
        </HeaderContent>
        <UnderLine />
    </HeaderLayout>
);

export default Header;

const HeaderLayout = styled.header`
font-family: ${properties.fontFamily};
height: ${properties.headerHeight};
display: flex;
flex-direction: column;
border-width: 0;
background-color: ${properties.colorsBlanding.accent};
color: white;
`;

const HeaderContent = styled.div`
display: flex;
flex-direction: row;
box-sizing: border-box;
flex-basis: 100%;
align-items: center;
margin-left: auto;
margin-right: auto;
width: 100%;
max-width: 600px;
`;

const TitleLayout = styled.div`
justify-content: center;
display: flex;
box-pack: center;
box-sizing: border-box;
width: 100%;
`;

const Title = styled.div`
font-size: 1.25rem;
font-weight: bold;
white-space: nowrap;
max-width: 100%;
`;

const BackButton = styled(MdArrowBack)`
cursor: pointer;
padding: 8px;
`;

const AddButton = styled(MdAdd)`
cursor: pointer;
padding: 8px;
`;

const Spacer = styled.div`
  width: 28px;
  padding: 8px;
`;

const UnderLine = styled.div`
background-color: rgba(0, 0, 0, 0.298039);
display: flex;
height: ${properties.lineWidth};
flex-basis: ${properties.lineWidth};;
`;
