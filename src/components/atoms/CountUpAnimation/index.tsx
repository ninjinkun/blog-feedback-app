import React from 'react';
import { Spring } from 'react-spring';

type ChildRenderer = (count: number) => React.ReactNode;

type Props = {
  start: number;
  end: number;
  children: ChildRenderer;
};

const CountUp: React.FunctionComponent<Props> = ({ children, start, end, ...props }) => (
  <Spring from={{ value: start }} to={{ value: end }} config={{ duration: 3000, easing: t => t }}>
    {({ value }: any) => children && children(Math.round(value))}
  </Spring>
);

export default CountUp;
