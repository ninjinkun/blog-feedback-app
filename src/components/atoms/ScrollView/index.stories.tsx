import type { Meta, StoryObj } from '@storybook/react-vite';
import ScrollView from './index';

const meta = {
  title: 'atoms/ScrollView',
  component: ScrollView,
} satisfies Meta<typeof ScrollView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollView>
      {[...Array(1000).keys()].map((i) => (
        <span key={i}>{i}</span>
      ))}
    </ScrollView>
  ),
};
