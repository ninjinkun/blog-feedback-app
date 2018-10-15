import * as React from 'react';
import styled from 'styled-components';
import MDSpinner, { MDSpinnerProps } from 'react-md-spinner';
import { colorsBlanding } from '../../properties';

const Spinner = styled(MDSpinner)`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
`;

const ColoredSpinner: React.SFC<MDSpinnerProps> = (...props) => 
  <Spinner singleColor={colorsBlanding.accent} {...props} />;

export default ColoredSpinner;