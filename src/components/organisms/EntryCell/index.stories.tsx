import * as React from 'react';
import EntryCell from './index';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { CountType } from '../../../consts/count-type';
import styled from 'styled-components';

const counts = [
    { type: CountType.Twitter, count: 0, animate: false },
    { type: CountType.Facebook, count: 100, animate: true },
    { type: CountType.HatenaBookmark, count: 1000, animate: false }
];

const favicon: string = 'https://cdn.image.st-hatena.com/image/favicon/a6840b49a29b5d04ac068e459e7ddc8676bdc3db/version=1/https%3A%2F%2Fcdn.user.blog.st-hatena.com%2Fcustom_blog_icon%2F115833353%2F1514258254698267';

const Background = styled.div`
    background-color: #eee;
    height: 100%;
    width: 100%;
`;

storiesOf('organisms/EntryCell', module)
    .add('default', () => <Background><EntryCell favicon={favicon} title={'一休のDB移行'} counts={counts} url={''} /></Background>)
    .add('animate', () => <Background><EntryCell favicon={favicon} title={'一休のDB移行'} counts={counts} url={''} /></Background>);
