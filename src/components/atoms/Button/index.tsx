import * as React from 'react';
import styled from 'styled-components';
import * as properties from '../../properties';

const baseStyle = `
  border-radius: 4px;
  border-width: 0;
  display: flex;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1;
  padding: 0.8rem;
  text-decoration: none;
  align-items: center;
  cursor: pointer;
  border-radius; 4px;
  transition: ${properties.fadeAnimation}};
  &:hover {
    opacity: ${properties.hoverFeedbackOpacity};
  }  
`;

const ButtonBase = styled.button`${baseStyle}`;
const InputBase = styled.input`${baseStyle}`;

const buttonStyle = `
  background-color: inherit;
  border: ${properties.border};
  color: ${properties.colors.gray};
`;

export const Button = styled(ButtonBase)`${buttonStyle}`;
export const Input = styled(InputBase)`${buttonStyle}`;

const primaryButtonStyle = `
  background-color: ${properties.colors.primary};
  color: ${properties.colors.white};
`;

export const PrimaryButton = styled(ButtonBase)`${primaryButtonStyle}`;
export const PrimaryInput = styled(InputBase)`${primaryButtonStyle}`;

const warningButtonStyle = `
  background-color: ${properties.colors.warning};
  color: ${properties.colors.white};
`;

export const WarningButton = styled(ButtonBase)`${warningButtonStyle}`;
export const WarningInput = styled(InputBase)`${warningButtonStyle}`;

export default Button;
