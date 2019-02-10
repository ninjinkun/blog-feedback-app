import React from 'react';
import { animated, useSpring } from 'react-spring';

type ChildRenderer = (count: number) => React.ReactNode;

type Props = {
  start: number;
  end: number;
  children: ChildRenderer;
};

const CountUp: React.FunctionComponent<Props> = ({ children, start, end, ...props }) => {
  const style = useSpring<{ value: number }>({
    from: { value: start },
    value: end,
    config: { duration: 1000, easing: t => t },
  });
  return <animated.div>{children && children(style.value.interpolate(v => Math.round(v)))}</animated.div>;
};

export default CountUp;
