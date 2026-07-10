import type { Meta, StoryObj } from '@storybook/react-vite';
import CountUp from './index';

const meta = {
  title: 'atoms/CountUpAnimation',
  component: CountUp,
} satisfies Meta<typeof CountUp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    start: 100.0,
    end: 200.0,
    children: (count: number) => <div>{count}</div>,
  },
};
