import React from 'react';
import AddBlogForm from './index';
import { storiesOf, Story } from '@storybook/react';
import { CountType } from '../../../consts/count-type';
import { action } from '@storybook/addon-actions';

const handleSubmit = (url: string) => action(`submit ${url}`)();

storiesOf('organisms/AddBlogForm', module)
.add('default', () => <AddBlogForm handleSubmit={handleSubmit} loading={false}/>)
.add('loading', () => <AddBlogForm handleSubmit={handleSubmit} loading={true}/>)
.add('error', () => <AddBlogForm handleSubmit={handleSubmit} loading={false} errorMessage={'Blog not found'} />);
