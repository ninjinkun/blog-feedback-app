import type { Meta, StoryObj } from '@storybook/react-vite';
import Spinner from './index';

const meta = {
  title: 'atoms/Spinner',
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
