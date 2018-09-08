import React from 'react';
import Favicon from './index';
import { storiesOf, Story } from '@storybook/react';

const favicon: string = 'https://cdn.image.st-hatena.com/image/favicon/a6840b49a29b5d04ac068e459e7ddc8676bdc3db/version=1/https%3A%2F%2Fcdn.user.blog.st-hatena.com%2Fcustom_blog_icon%2F115833353%2F1514258254698267';

storiesOf('atoms/Favicon', module)
  .add('デフォルト', () => <Favicon src={favicon} />);
