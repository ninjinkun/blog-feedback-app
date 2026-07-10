import type { Meta, StoryObj } from '@storybook/react-vite';
import PlainCell from './index';

const meta = {
  title: 'molecules/PlainCell',
  component: PlainCell,
} satisfies Meta<typeof PlainCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <PlainCell>
      <div>PlainCell</div>
    </PlainCell>
  ),
};
