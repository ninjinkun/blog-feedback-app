import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router';
import TermPage from './index';

const meta = {
  title: 'pages/TermPage',
  component: TermPage,
} satisfies Meta<typeof TermPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <MemoryRouter>
      <TermPage />
    </MemoryRouter>
  ),
};
