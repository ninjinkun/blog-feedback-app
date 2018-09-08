import * as React from 'react';
import styled from 'styled-components';
import * as properties from '../../properties';

const Base = styled.button`
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
  transition: ${properties.fadeAnimation}};
  &:hover {
    opacity: ${properties.hoverFeedbackOpacity};
  }  
`;

export const Button = Base.extend`
  background-color: inherit;
  border: ${properties.border};
  color: ${properties.colors.gray};
`;

export const PrimaryButton = Base.extend`
  background-color: ${properties.colors.primary};
  color: ${properties.colors.white};
`;

export const WarningButton = Base.extend`
  background-color: ${properties.colors.warning};
  color: ${properties.colors.white};
`;

export default Button;
