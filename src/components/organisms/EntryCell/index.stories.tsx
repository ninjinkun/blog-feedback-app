import type { Meta, StoryObj } from '@storybook/react-vite';
import styled from 'styled-components';
import { CountType } from '../../../models/consts/count-type';
import EntryCell from './index';

const counts = [
  { type: CountType.Twitter, count: undefined, animate: false },
  { type: CountType.Facebook, count: 100, animate: true },
  { type: CountType.HatenaBookmark, count: 1000, animate: false },
];

const favicon: string =
  'https://cdn.image.st-hatena.com/image/favicon/a6840b49a29b5d04ac068e459e7ddc8676bdc3db/version=1/https%3A%2F%2Fcdn.user.blog.st-hatena.com%2Fcustom_blog_icon%2F115833353%2F1514258254698267';

const Background = styled.div`
  background-color: #eee;
  height: 100%;
  width: 100%;
`;

const meta = {
  title: 'organisms/EntryCell',
  component: EntryCell,
  decorators: [
    (Story) => (
      <Background>
        <Story />
      </Background>
    ),
  ],
} satisfies Meta<typeof EntryCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { favicon, title: '一休のDB移行', counts, url: '' },
};

export const Animate: Story = {
  args: { favicon, title: '一休のDB移行', counts, url: '' },
};
