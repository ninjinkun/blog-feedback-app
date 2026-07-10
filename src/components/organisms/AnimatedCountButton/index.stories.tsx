import type { Meta, StoryObj } from '@storybook/react-vite';
import { CountType } from '../../../models/consts/count-type';
import AnimatedCountButton from './index';

const meta = {
  title: 'organisms/AnimatedCountButton',
  component: AnimatedCountButton,
} satisfies Meta<typeof AnimatedCountButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotAnimate: Story = {
  args: { type: CountType.Twitter, animate: false, count: 0 },
};

export const Animate: Story = {
  args: { type: CountType.HatenaBookmark, animate: true, count: 100 },
};
