import React from 'react';
import { animated, useSpring } from 'react-spring';

type ChildRenderer = (count: number) => React.ReactNode;

type Props = {
  start: number;
  end: number;
  children: ChildRenderer;
};

const CountUp: React.FunctionComponent<Props> = ({ children, start, end, ...props }) => (
  <animated.div
    style={useSpring({ from: { value: start }, to: { value: end }, config: { duration: 3000, easing: t => t } })}
  >
    {({ value }: any) => children && children(Math.round(value))}
  </animated.div>
);

export default CountUp;
