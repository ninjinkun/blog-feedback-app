import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import AddBlogForm from './index';

const handleSubmit = (url: string, enabled: boolean) => action(`submit ${url} ${enabled}`)();

storiesOf('organisms/AddBlogForm', module)
  .add('default', () => <AddBlogForm handleSubmit={handleSubmit} loading={false} />)
  .add('loading', () => <AddBlogForm handleSubmit={handleSubmit} loading={true} />)
  .add('error', () => <AddBlogForm handleSubmit={handleSubmit} loading={false} errorMessage={'Blog not found'} />);
