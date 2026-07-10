import React from 'react';
import { animated, useSpring } from '@react-spring/web';

type ChildRenderer = (count: number) => React.ReactNode;

type Props = {
  start: number;
  end: number;
  children: ChildRenderer;
};

const CountUp: React.FunctionComponent<Props> = ({ children, start, end }) => {
  const { value } = useSpring({
    from: { value: start },
    value: end,
    config: { duration: 500, easing: (t: number) => t },
  });
  return <animated.div>{children && children(value.to((v) => Math.round(v)) as unknown as number)}</animated.div>;
};

export default CountUp;
