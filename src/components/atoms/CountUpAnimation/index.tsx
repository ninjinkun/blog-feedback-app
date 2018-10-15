import * as React from 'react';
import { Spring } from 'react-spring';
import { Easing } from 'react-spring/dist/addons';

type ChildRenderer = (count: number) => React.ReactNode;

type Props = {
  start: number,
  end: number,
  children: ChildRenderer,
};

const CountUp: React.SFC<Props> = ({children, start, end, ...props}) => (
  <Spring from={{value: start}} to={{value: end}} config={{ duration: 3000, easing: Easing.liner }}>
    {({value}) => children && children(Math.round(value))}
  </Spring>
);

export default CountUp;