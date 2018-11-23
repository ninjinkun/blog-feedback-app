import React from 'react';
import styled, { keyframes } from 'styled-components';

type Props = {
  animate?: boolean;
  twincleNum?: number;
};

const TwincleAnimation: React.FunctionComponent<Props> = ({ children, animate, twincleNum = 8, ...props }) => (
  <Wrapper {...props}>
    {animate ? [...Array(twincleNum).keys()].map(i => <AnimatedSpark key={i} />) : undefined}
    {children}
  </Wrapper>
);

export default TwincleAnimation;

const AnimatedSpark: React.FunctionComponent<{}> = props => {
  const [top, left] = [randomInt(0, 100), randomInt(0, 100)];
  const [toTranlateX, toTranslateY] = [randomInt(-10, 10), randomInt(-10, 10)];
  const rotate360 = keyframes`
    0% {
      transform: translate3d(0, 0, 0) rotate(0deg);
      opacity: 0;
    }
    30% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    30% {
      opacity: 1;
    }
    100% {
      transform: translate3d(${toTranlateX}px, ${toTranslateY}px, 0) rotate(${randomInt(180, 360)}deg);
      opacity: 0;
    }
  `;
  const StyledSpark = styled(Spark)`
    top: ${top}%;
    left: ${left}%;
    position: absolute;
    will-change: transform;
    animation: ${rotate360} ${randomFloat(1, 2)}s linear infinite;
    z-index: 100;
    height: 24px;
    width: 24px;
    pointer-events: none;
    margin: -9px -9px 0 0;
  `;
  return <StyledSpark {...props} />;
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

const Spark = (props: any) => <img src={require('../../../assets/images/twincle-perticle.svg')} {...props} />;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;
