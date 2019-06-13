import React from 'react';
import MDSpinner from 'react-md-spinner';
import styled from 'styled-components';
import { colorsBlanding } from '../../properties';

const Spinner = styled(MDSpinner)`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
`;

const ColoredSpinner: React.FunctionComponent<MDSpinner['props']> = (...props) => (
  <Spinner singleColor={colorsBlanding.accent} {...props} />
);

export default ColoredSpinner;
