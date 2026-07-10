import type { Meta, StoryObj } from '@storybook/react-vite';
import WelcomePage from './index';

const meta = {
  title: 'pages/WelcomePage',
  component: WelcomePage,
} satisfies Meta<typeof WelcomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
