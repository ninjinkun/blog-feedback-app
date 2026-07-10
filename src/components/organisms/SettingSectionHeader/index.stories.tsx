import type { Meta, StoryObj } from '@storybook/react-vite';
import SettingSectionHeader from './index';

const meta = {
  title: 'organisms/SettingSectionHeader',
  component: SettingSectionHeader,
} satisfies Meta<typeof SettingSectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SettingSectionHeader>Blog Settings</SettingSectionHeader>,
};
