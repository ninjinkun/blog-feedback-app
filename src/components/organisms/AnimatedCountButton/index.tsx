import * as React from 'react';
import styled from 'styled-components';

import CountButton from '../../molecules/CountButton/index';
import { CountType } from '../../../consts/count-type';
import TwincleAnimation from '../../atoms/TwincleAnimation/index';
import CountUpAnimation from '../../atoms/CountUpAnimation/index';

type Props = {
  animate: boolean,
  type: CountType,
  count: number,
  onClick?: React.MouseEventHandler;
};

export default class AnimatedCountButton extends React.PureComponent<Props> {
  prevCount?: number;

  render() {
    const { animate, type, count, onClick } = this.props;
    const { prevCount } = this;
    const res = (
      <StyledTwincleAnimation animate={animate} key={type} >
        <CountUpAnimation start={animate && prevCount ? prevCount : count} end={count}>
          {(value) => <StyledCountButton type={type} count={value} onClick={onClick} />}
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