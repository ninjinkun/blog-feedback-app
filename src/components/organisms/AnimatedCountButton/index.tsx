import React, { useState } from 'react';
import styled from 'styled-components';

import { CountType } from '../../../models/consts/count-type';
import CountUpAnimation from '../../atoms/CountUpAnimation/index';
import TwincleAnimation from '../../atoms/TwincleAnimation/index';
import CountButton from '../../molecules/CountButton/index';

type Props = {
  animate: boolean;
  type: CountType;
  count?: number;
  href?: string;
  target?: string;
};

type States = {
  prevCount?: number;
};

const AnimatedCountButton: React.FC<Props> = props => {
  const [state, setState] = useState<States>({});
  const { animate, type, count, href, target } = props;
  const { prevCount } = state;

  if (count !== undefined) {
    if (prevCount !== count) {
      setState({ prevCount: count });
    }
    return (
      <StyledTwincleAnimation animate={animate} key={type}>
        <CountUpAnimation start={animate && prevCount ? prevCount : count} end={count}>
          {value => <StyledCountButton type={type} count={value} href={href} target={target} />}
        </CountUpAnimation>
      </StyledTwincleAnimation>
    );
  } else {
    return <StyledCountButton type={type} href={href} target={target} />;
  }
};

export default AnimatedCountButton;

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
