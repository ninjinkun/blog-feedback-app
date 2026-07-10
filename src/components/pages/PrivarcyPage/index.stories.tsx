import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router';
import PrivacyPage from './index';

const meta = {
  title: 'pages/PrivacyPage',
  component: PrivacyPage,
} satisfies Meta<typeof PrivacyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <MemoryRouter>
      <PrivacyPage />
    </MemoryRouter>
  ),
};
