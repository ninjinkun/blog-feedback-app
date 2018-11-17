import * as React from 'react';
import styled, { keyframes, SimpleInterpolation } from 'styled-components';
import * as properties from '../../properties';
import Button, { Anker } from '../../atoms/Button';
import ServiceIcon from '../../atoms/ServiceIcon';
import { CountType } from '../../../consts/count-type';

type Props = {
    href?: string;
    type: CountType;
    count?: Number;
};

const CountButton: React.SFC<Props> = ({count, type, children, href, ...props}) => (
    <StyledButton href={href} {...props}>
        <ServiceIcon type={type} />
        <CuontLabel>{count}</CuontLabel>
        {children}
    </StyledButton>
);

export default CountButton;

const StyledButton = styled(Anker)`
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
