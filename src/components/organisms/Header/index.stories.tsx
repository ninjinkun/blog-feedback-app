import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router';
import Header from './index';

const meta = {
  title: 'organisms/Header',
  component: Header,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'BlogFeedback' },
};

export const LongTitle: Story = {
  args: {
    title: 'BlogFeedback BlogFeedback BlogFeedback BlogFeedback',
    addButtonLink: '/',
    backButtonLink: '/',
  },
};
