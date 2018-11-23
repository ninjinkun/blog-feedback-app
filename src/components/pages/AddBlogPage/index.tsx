import * as firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import {
  addBlog,
  AddBlogActions,
  addBlogInitialize,
  AddBlogInitializeAction,
  AddBlogThunkAction,
} from '../../../redux/actions/add-blog-action';
import { AddBlogState } from '../../../redux/states/add-blog-state';
import { AppState } from '../../../redux/states/app-state';
import Wrapper from '../../atoms/Wrapper/index';
import AddBlogForm from '../../organisms/AddBlogForm/index';
import PageLayout from '../../templates/PageLayout/index';

type StateProps = {
  addBlogState: AddBlogState;
};

type DispatchProps = {
  addBlog: (auth: firebase.auth.Auth, blogURL: string) => AddBlogThunkAction;
  addBlogInitialize: () => AddBlogInitializeAction;
};

type OwnProps = {};
type Props = StateProps & DispatchProps & RouteComponentProps<OwnProps>;

class AddBlogView extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.addBlogInitialize();
  }

  render() {
    const { history, addBlogState } = this.props;
    const { loading, error, finished, blogURL } = addBlogState;
    if (finished && blogURL) {
      return <Redirect to={`/blogs/${encodeURIComponent(blogURL)}`} />;
    } else {
      return (
        <PageLayout
          header={{
            title: 'ブログを追加する',
            backButtonLink: '/blogs/',
          }}
        >
          <FormWrapper>
            <AddBlogForm
              handleSubmit={e => this.handleSubmit(e)}
              loading={loading}
              errorMessage={error && error.message}
            />
          </FormWrapper>
        </PageLayout>
      );
    }
  }

  handleSubmit(url: string) {
    this.props.addBlog(firebase.auth(), url);
  }
}

const FormWrapper = styled(Wrapper)`
  margin-top: 25vh;
`;

const mapStateToProps = (state: AppState): StateProps => ({
  addBlogState: state.addBlog,
});

const mapDispatchToProps = (dispatch: Dispatch<AddBlogActions>): DispatchProps =>
  bindActionCreators({ addBlog, addBlogInitialize }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddBlogView);
