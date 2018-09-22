import * as React from 'react';
import styled, { keyframes, SimpleInterpolation } from 'styled-components';
import * as properties from '../../properties';
import Button from '../../atoms/Button';
import ServiceIcon from '../../atoms/ServiceIcon';
import { CountType } from '../../../consts/count-type';

type Props = {
    type: CountType;
    count?: Number;
};

const CountButton = ({...props}: Props) => (
    <StyledButton {...props}>
        <ServiceIcon type={props.type} />
        <CuontLabel>{props.count}</CuontLabel>
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