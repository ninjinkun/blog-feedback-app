import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import HeaederLoadingIndicator from './index';

type Item = {
  label: string;
  ratio: number;
  loading: boolean;
};

const initialItems = [
  {
    label: '',
    ratio: 0,
    loading: false,
  },
  {
    label: 'はてなブックマークを読み込んでいます',
    ratio: 20,
    loading: true,
  },
  {
    label: 'Facebookを読み込んでいます',
    ratio: 50,
    loading: true,
  },
  {
    label: 'Pocketを読み込んでいます',
    ratio: 80,
    loading: true,
  },
  {
    label: '',
    ratio: 100,
    loading: false,
  },
];

const Test: React.FC = (props) => {
  const [index, setIndex] = useState<number>(0);
  const [item, setItems] = useState<Item>(initialItems[index]);

  const clickButton = () => {
    setIndex(index === initialItems.length - 1 ? 0 : index + 1);
    setItems(initialItems[index]);
  };

  return (
    <Wrapper onClick={clickButton}>
      <HeaederLoadingIndicator ratio={item.ratio} label={item.label} loading={item.loading} />
    </Wrapper>
  );
};

storiesOf('molecules/HeaederLoadingIndicator', module).add('default', () => <Test />);

const Wrapper = styled.div`
  width: 100%;
`;
