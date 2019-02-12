import React, { useState } from 'react';
import MDSpinner from 'react-md-spinner';
import { animated, useSpring, useTransition } from 'react-spring';
import styled from 'styled-components';
import * as properties from '../../properties';

type Props = {
  ratio?: number;
  label?: string;
  loading: boolean;
};

type States = {
  prevLabel?: string;
  frameToggle: boolean;
};

const HeaderLoadingIndicator: React.FC<Props> = ({ loading, label, ratio, ...props }) => {
  const [prevLabel, setPrevLabel] = useState<string | undefined>(undefined);

  if (label !== prevLabel) {
    setPrevLabel(label);
  }
  const spring = useSpring({
    backgroundColor: loading ? properties.colorsValue.grayDark : properties.colorsBlanding.accent,
  });
  const trans = useTransition([label, prevLabel], t => t || '', {
    from: { opacity: 0, transform: `translate3d(0, -100%, 0)` },
    enter: { opacity: 1, transform: `translate3d(0, 0, 0)` },
    // tslint:disable-next-line:jsx-alignment
    leave: { opacity: 0, transform: `translate3d(0, 100%, 0)` },
  });
  return (
    <animated.div style={spring} {...props}>
      <Wrapper>
        <Content>
          <SpinnerWrapper>{loading ? <Spinner size={12} singleColor={'white'} /> : undefined}</SpinnerWrapper>
          <LabelWrapper>
            {trans.map(({ item, props, key }) => (
              <Label style={props} key={key}>
                {item}
              </Label>
            ))}
          </LabelWrapper>
          {loading ? (
            <Ratio>
              <span>{`${ratio}%`}</span>
            </Ratio>
          ) : null}
        </Content>
      </Wrapper>
    </animated.div>
  );
};

export default HeaderLoadingIndicator;

const Content = styled.div`
  display: grid;
  grid-template-columns: 40px 4fr 40px;
  grid-template-areas: 'spinner label ratio';
  width: 100%;
  height: 100%;
  max-width: 600px;
  overflow: hidden;
  min-height: 20px;
  margin-left: auto;
  margin-right: auto;
`;

const Wrapper = styled.div`
  width: 100%;
  color: white;
  will-change: opacity;
`;

const SpinnerWrapper = styled.div`
  grid-area: spinner;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 4px;
`;

const Spinner = styled(MDSpinner)``;

const LabelWrapper = styled.div`
  grid-area: label;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Label = styled(animated.div)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  will-change: transform, opacity;
  overflow: hidden;
  font-size: ${properties.fontSizes.s};
`;

const Ratio = styled.div`
  display: flex;
  font-size: ${properties.fontSizes.s};
  grid-area: ratio;
  margin-right: 4px;
  justify-content: flex-end;
  align-items: center;
`;
