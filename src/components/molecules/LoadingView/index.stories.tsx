import type { Meta, StoryObj } from '@storybook/react-vite';
import LoadingView from './index';

const meta = {
  title: 'molecules/LoadingView',
  component: LoadingView,
} satisfies Meta<typeof LoadingView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
