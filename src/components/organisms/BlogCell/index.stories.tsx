import { storiesOf } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';
import BlogCell from './index';

const favicon: string =
  'https://cdn.image.st-hatena.com/image/favicon/a6840b49a29b5d04ac068e459e7ddc8676bdc3db/version=1/https%3A%2F%2Fcdn.user.blog.st-hatena.com%2Fcustom_blog_icon%2F115833353%2F1514258254698267';

const Background = styled.div`
  height: 100%;
  width: 100%;
`;

storiesOf('organisms/BlogCell', module).add('default', () => (
  <Background>
    <BlogCell favicon={favicon} title={'一休.com Developers Blog'} />
  </Background>
));
