import type { Meta, StoryObj } from '@storybook/react-vite';
import Favicon from './index';

const favicon: string =
  'https://cdn.image.st-hatena.com/image/favicon/a6840b49a29b5d04ac068e459e7ddc8676bdc3db/version=1/https%3A%2F%2Fcdn.user.blog.st-hatena.com%2Fcustom_blog_icon%2F115833353%2F1514258254698267';

const meta = {
  title: 'atoms/Favicon',
  component: Favicon,
} satisfies Meta<typeof Favicon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Favicon src={favicon} />,
};
