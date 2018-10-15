import * as React from 'react';
import BlogCell from './index';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { CountType } from '../../../consts/count-type';
import styled from 'styled-components';

const counts = [
    { type: CountType.Twitter, count: undefined },
    { type: CountType.Facebook, count: 100 },
    { type: CountType.HatenaBookmark, count: 1000 }
];

const favicon: string = 'https://cdn.image.st-hatena.com/image/favicon/a6840b49a29b5d04ac068e459e7ddc8676bdc3db/version=1/https%3A%2F%2Fcdn.user.blog.st-hatena.com%2Fcustom_blog_icon%2F115833353%2F1514258254698267';

const Background = styled.div`
    height: 100%;
    width: 100%;
`;

storiesOf('organisms/BlogCell', module)
    .add('default', () => <Background><BlogCell favicon={favicon} title={'一休.com Developers Blog'} /></Background>);
