import type { Meta, StoryObj } from '@storybook/react-vite';
import styled from 'styled-components';
import Twincle from './index';

const Content = styled.div`
  width: 200px;
  height: 30px;
  background: #373737;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 5px 15px 0px;
`;

const meta = {
  title: 'atoms/TwincleAnimation',
  component: Twincle,
} satisfies Meta<typeof Twincle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Animate: Story = {
  args: { animate: true, children: <Content /> },
};

export const NoAnimate: Story = {
  args: { animate: false, children: <Content /> },
};
