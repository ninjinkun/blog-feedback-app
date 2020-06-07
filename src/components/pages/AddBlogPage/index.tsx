import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { AddBlogState, addBlogSlice, addBlog } from '../../../redux/states/add-blog-state';
import { AppState } from '../../../redux/states/app-state';
import { BlogState } from '../../../redux/states/blog-state';
import Button from '../../atoms/Button/index';
import Wrapper from '../../atoms/Wrapper/index';
import AddBlogForm from '../../organisms/AddBlogForm/index';
import * as properties from '../../properties';
import PageLayout from '../../templates/PageLayout/index';

type States = {
  fillInURL?: string;
};

const AddBlogPage: React.FC<RouteComponentProps> = () => {
  const [state, setState] = useState<States>({});
  const addBlogState = useSelector<AppState, AddBlogState>(state => state.addBlog);
  const blogState = useSelector<AppState, BlogState>(state => state.blog);
  const dispatch = useDispatch();
  
  useEffect(() => {
    return () => {
      dispatch(addBlogSlice.actions.reset())
    };
  }, [dispatch]);

  const handleSubmit = (url: string, reportMailEnabled: boolean) => {
    dispatch(addBlog(firebase.auth(), url, reportMailEnabled));
  };

  const fillIn = (url: string) => {
    setState({ fillInURL: url });
  };

  const clearURL = () => {
    setState({ fillInURL: undefined });
  };

  const { loading, error, finished, blogURL } = addBlogState;
  const { blogs } = blogState;
  if (finished && blogURL) {
    return <Redirect to={`/blogs/${encodeURIComponent(blogURL)}`} />;
  } else {
    return (
      <PageLayout
        header={{
          title: 'ブログを追加する',
          backButtonLink: '/blogs',
        }}
      >
        <FormWrapper>
          <AddBlogForm
            handleSubmit={(url, reportMailEnabled) => handleSubmit(url, reportMailEnabled)}
            loading={loading}
            errorMessage={
              error && `${error.message}（エラーが続く場合はRSSのURLを直接入力するとうまくいくことがあります）`
            }
            url={state.fillInURL}
            clearURL={() => clearURL()}
          />
        </FormWrapper>
        {!(blogs !== undefined && blogs.length) && (
          <SuggestionWrapper>
            <SuggestionContentWrapper>
              <SuggestionText>まず試してみたい場合は、以下からおすすめブログのURLを入力できます</SuggestionText>
              <SeggestionButton onClick={() => fillIn('https://user-first.ikyu.co.jp/')}>
                一休.com Developers Blog
              </SeggestionButton>
              <SeggestionButton onClick={() => fillIn('https://ninjinkun.hatenablog.com/')}>
                ninjinkun's diary
              </SeggestionButton>
            </SuggestionContentWrapper>
          </SuggestionWrapper>
        )}
      </PageLayout>
    );
  }
};

const FormWrapper = styled(Wrapper)`
  margin-top: 20vh;
`;

const SuggestionWrapper = styled(Wrapper)`
  align-items: center;
`;

const SuggestionContentWrapper = styled(Wrapper)`
  align-items: center;
  margin: 16px;
  padding: 16px;
  border: 1px dashed ${properties.colors.gray};
  border-radius: 4px;
  width: fit-content;
`;

const SuggestionText = styled.p`
  font-size: ${properties.fontSizes.s};
  margin-top: 0;
`;

const SeggestionButton = styled(Button)`
  margin: 4px;
`;

export default AddBlogPage;
