import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import styled from 'styled-components';
import { addBlog, AddBlogActions, addBlogInitialize } from '../../../redux/actions/add-blog-action';
import { AddBlogState } from '../../../redux/states/add-blog-state';
import { AppState } from '../../../redux/states/app-state';
import { BlogState } from '../../../redux/states/blog-state';
import Button from '../../atoms/Button/index';
import Wrapper from '../../atoms/Wrapper/index';
import AddBlogForm from '../../organisms/AddBlogForm/index';
import * as properties from '../../properties';
import PageLayout from '../../templates/PageLayout/index';

type StateProps = {
  addBlogState: AddBlogState;
  blogState: BlogState;
};

type DispatchProps = {
  addBlog: (...props: Parameters<typeof addBlog>) => void;
  addBlogInitialize: () => void;
};

type OwnProps = {};
type Props = StateProps & DispatchProps & RouteComponentProps<OwnProps>;

type States = {
  fillInURL?: string;
};

const AddBlogView: React.FC<Props> = ({ addBlogInitialize, addBlog, addBlogState, blogState }) => {
  const [state, setState] = useState<States>({});
  useEffect(() => {
    return () => {
      addBlogInitialize();
    };
  }, [addBlogInitialize]);

  const handleSubmit = (url: string, reportMailEnabled: boolean) => {
    addBlog(firebase.auth(), url, reportMailEnabled);
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

function mapStateToProps(state: AppState): StateProps {
  return {
    addBlogState: state.addBlog,
    blogState: state.blog,
  };
}

type TD = ThunkDispatch<AppState, undefined, AddBlogActions>;
function mapDispatchToProps(dispatch: TD & Dispatch<AddBlogActions>): DispatchProps {
  return {
    addBlog: (...props) => dispatch(addBlog(...props)),
    addBlogInitialize: () => dispatch(addBlogInitialize()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddBlogView);
