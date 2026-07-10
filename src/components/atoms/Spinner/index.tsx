import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colorsBlanding } from '../../properties';

type Props = {
  size?: number;
  singleColor?: string;
  className?: string;
};

const Spinner: React.FC<Props> = ({ size = 20, singleColor = colorsBlanding.accent, className }) => (
  <Circle className={className} $size={size} $color={singleColor} />
);

export default Spinner;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Circle = styled.div<{ $size: number; $color: string }>`
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border: 2px solid ${(props) => props.$color};
  border-top-color: transparent;
  border-radius: 50%;
  box-sizing: border-box;
  flex: none;
  animation: ${rotate} 0.8s linear infinite;
`;
