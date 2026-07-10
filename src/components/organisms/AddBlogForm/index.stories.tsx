import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import AddBlogForm from './index';

const handleSubmit = (url: string, enabled: boolean) => action(`submit ${url} ${enabled}`)();

const meta = {
  title: 'organisms/AddBlogForm',
  component: AddBlogForm,
} satisfies Meta<typeof AddBlogForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { handleSubmit, loading: false },
};

export const Loading: Story = {
  args: { handleSubmit, loading: true },
};

export const Error: Story = {
  args: { handleSubmit, loading: false, errorMessage: 'Blog not found' },
};
