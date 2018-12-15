import React from 'react';
import styled from 'styled-components';
import { CountType } from '../../../consts/count-type';
import Button from '../../atoms/Button';
import ServiceIcon from '../../atoms/ServiceIcon';
import * as properties from '../../properties';

type Props = {
  href?: string;
  type: CountType;
  count?: number;
};

const CountButton: React.FunctionComponent<Props> = ({ count, type, children, href, ...props }) => (
  <StyledButton href={href} {...props} as="a">
    <ServiceIcon type={type} />
    {count !== undefined ? <CuontLabel>{count}</CuontLabel> : <UndefinedCuontLabel>-</UndefinedCuontLabel>}
    {children}
  </StyledButton>
);

export default CountButton;

const StyledButton = styled(Button)`
  padding: 0.2rem;
  font-size: ${properties.fontSizes.s};
  background: linear-gradient(${properties.colorsValue.grayPale}, #eee);
  border: 1px solid #ccc;
  color: ${properties.colorsValue.grayDark};
`;

const CuontLabel = styled.span`
  margin-left: 0.2rem;
  border-radius: 8px;
  width: 100%;
`;

const UndefinedCuontLabel = styled(CuontLabel)`
  color: ${properties.colors.gray};
`;
