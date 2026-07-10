import type { Meta, StoryObj } from '@storybook/react-vite';
import { CountType } from '../../../models/consts/count-type';
import ServiceIcon from './index';

const meta = {
  title: 'atoms/ServiceIcon',
  component: ServiceIcon,
} satisfies Meta<typeof ServiceIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Twitter: Story = {
  args: { type: CountType.Twitter },
};

export const Facebook: Story = {
  args: { type: CountType.Facebook },
};

export const HatenaBookmark: Story = {
  args: { type: CountType.HatenaBookmark },
};
