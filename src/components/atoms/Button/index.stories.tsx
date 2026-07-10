import type { Meta, StoryObj } from '@storybook/react-vite';
import Button, { PrimaryButton, WarningButton } from './index';

const meta = {
  title: 'atoms/Button',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Button>デフォルト</Button>,
};

export const Primary: Story = {
  render: () => <PrimaryButton>プライマリ</PrimaryButton>,
};

export const Warning: Story = {
  render: () => <WarningButton>警告</WarningButton>,
};
