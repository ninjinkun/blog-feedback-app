import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux/hooks';
import { Navigate } from 'react-router';
import styled from 'styled-components';
import { AddBlogState, addBlogSlice, addBlog } from '../../../redux/slices/add-blog';
import { AppState } from '../../../redux/app-reducer';
import { BlogState } from '../../../redux/slices/blog';
import Button from '../../atoms/Button/index';
import Wrapper from '../../atoms/Wrapper/index';
import AddBlogForm from '../../organisms/AddBlogForm/index';
import * as properties from '../../properties';
import PageLayout from '../../templates/PageLayout/index';

type States = {
  fillInURL?: string;
};

const AddBlogPage: React.FC = () => {
  const [state, setState] = useState<States>({});
  const addBlogState = useSelector<AppState, AddBlogState>((state) => state.addBlog);
  const blogState = useSelector<AppState, BlogState>((state) => state.blog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(addBlogSlice.actions.reset());
    };
  }, [dispatch]);

  const handleSubmit = (url: string, reportMailEnabled: boolean) => {
    dispatch(addBlog(getAuth(), url, reportMailEnabled));
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
    return <Navigate to={`/blogs/${encodeURIComponent(blogURL)}`} replace />;
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
