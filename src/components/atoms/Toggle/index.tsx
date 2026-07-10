import React from 'react';
import styled from 'styled-components';
import { colorsBlanding, colorsValue } from '../../properties';

type Props = {
  id?: string;
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Toggle: React.FC<Props> = ({ className, ...inputProps }) => (
  <Label className={className}>
    <Input type="checkbox" {...inputProps} />
    <Slider />
  </Label>
);

export default Toggle;

const Label = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  flex: none;
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${colorsValue.grayLight};
  border-radius: 12px;
  transition: background-color 0.2s ease-out;

  &::before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: 2px;
    top: 2px;
    background-color: ${colorsValue.white};
    border-radius: 50%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s ease-out;
  }
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + ${Slider} {
    background-color: ${colorsBlanding.accent};
  }

  &:checked + ${Slider}::before {
    transform: translateX(26px);
  }
`;

export { Toggle };
