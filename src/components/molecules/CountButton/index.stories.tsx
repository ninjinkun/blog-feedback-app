import type { Meta, StoryObj } from '@storybook/react-vite';
import { CountType } from '../../../models/consts/count-type';
import CountButton from './index';

const meta = {
  title: 'molecules/CountButton',
  component: CountButton,
} satisfies Meta<typeof CountButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Twitter: Story = {
  args: { type: CountType.Twitter },
};

export const Facebook: Story = {
  args: { type: CountType.Facebook, count: 0 },
};

export const HatenaBookmark: Story = {
  args: { type: CountType.HatenaBookmark, count: 1000 },
};
