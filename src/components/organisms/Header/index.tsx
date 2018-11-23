import * as React from 'react';
import styled from 'styled-components';
import * as properties from '../../properties';
import { MdArrowBack, MdAdd, MdSettings } from 'react-icons/md';
import { FiPlus } from 'react-icons/fi';

import HeaderLoadingIndicator from '../../molecules/HeaderLoadingIndicator/index';
import { Link } from 'react-router-dom';

export type HeaderProps = {
  title: string;
  loadingLabel?: string;
  loadingRatio?: number;
  loading?: boolean;
  backButtonLink?: string;
  addButtonLink?: string;
  settingButtonLink?: string;
};

const Header = ({ backButtonLink, addButtonLink, settingButtonLink, loadingRatio, loadingLabel, loading, title, ...props }: HeaderProps) => (
  <HeaderLayout {...props}>
    <HeaderLoadingIndicator
      ratio={loadingRatio}
      label={loadingLabel}
      loading={!!loading}
    />
    <HeaderContent>
      {backButtonLink ? <StyledLink to={backButtonLink}><BackButton size={24} /></StyledLink> :
        settingButtonLink ? <StyledLink to={settingButtonLink}><SettingsButton size={22} /></StyledLink> : <Spacer />}
      <TitleLayout><Title>{title}</Title></TitleLayout>
      {addButtonLink ? <StyledLink to={addButtonLink}><AddButton size={24} /></StyledLink> : <Spacer />}
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
  flex: 1 1 auto;
  overflow: hidden;
`;

const Title = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
`;

const StyledLink = styled(Link)`
  display: flex;
  width: 40px;
  color: white;
  align-items: center;
  &:link {
      color: white;
  }
  &:visited {
      color: white;
  }
`;

const BackButton = styled(MdArrowBack)`
  cursor: pointer;
  padding: 8px;
  flex: 0 0 auto;
`;

const AddButton = styled(FiPlus)`
  cursor: pointer;
  padding: 8px;
  flex: 0 0 auto;
`;

const SettingsButton = styled(MdSettings)`
  cursor: pointer;
  padding: 8px;
  flex: 0 0 auto;
`;

const Spacer = styled.div`
  width: 40px;
  padding: 8px;
`;

const UnderLine = styled.div`
  background-color: rgba(0, 0, 0, 0.298039);
  display: flex;
  height: ${properties.lineWidth};
  flex-basis: ${properties.lineWidth};;
`;
