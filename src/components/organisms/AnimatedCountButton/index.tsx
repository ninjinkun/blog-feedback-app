import React from 'react';
import styled from 'styled-components';

import { CountType } from '../../../consts/count-type';
import CountUpAnimation from '../../atoms/CountUpAnimation/index';
import TwincleAnimation from '../../atoms/TwincleAnimation/index';
import CountButton from '../../molecules/CountButton/index';

type Props = {
  animate: boolean;
  type: CountType;
  count: number;
  href?: string;
  target?: string;
};

export default class AnimatedCountButton extends React.PureComponent<Props> {
  prevCount?: number;

  render() {
    const { animate, type, count, href, target } = this.props;
    const res = (
      <StyledTwincleAnimation animate={animate} key={type}>
        <CountUpAnimation start={animate && this.prevCount ? this.prevCount : count} end={count}>
          {value => <StyledCountButton type={type} count={value} href={href} target={target} />}
        </CountUpAnimation>
      </StyledTwincleAnimation>
    );
    this.prevCount = count;
    return res;
  }
}

const StyledTwincleAnimation = styled(TwincleAnimation)`
  display: flex;
  position: relative;
  flex-grow: 1;
`;

const StyledCountButton = styled(CountButton)`
  position: relative;
  margin: 0.2rem;
  flex-grow: 1;
`;
