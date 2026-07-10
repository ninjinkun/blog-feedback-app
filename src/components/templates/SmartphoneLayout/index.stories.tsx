import type { Meta, StoryObj } from '@storybook/react-vite';
import SmartphoneLayout from './index';

const meta = {
  title: 'templates/SmartphoneLayout',
  component: SmartphoneLayout,
} satisfies Meta<typeof SmartphoneLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SmartphoneLayout>brabrabra</SmartphoneLayout>,
};
