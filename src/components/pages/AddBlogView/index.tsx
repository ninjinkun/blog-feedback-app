import * as React from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Dispatch, bindActionCreators } from 'redux';
import { BrowserRouter, Route, Link, Redirect, match as matchParam, withRouter, RouteComponentProps } from 'react-router-dom';
import Wrapper from '../../atoms/Wrapper/index';
import AddBlogForm from '../../organisms/AddBlogForm/index';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/states/app-state';
import { addBlog, addBlogInitialize, AddBlogThunkAction, AddBlogInitializeAction } from '../../../redux/actions/add-blog-action';
import { AddBlogState } from '../../../redux/states/add-blog-state';

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
    const { loading, error, finished, blogURL } = this.props.addBlogState;
    if (finished && blogURL) {
      return (<Redirect to={`/blogs/${encodeURIComponent(blogURL)}`} />);
    } else {
      return (
        <FormWrapper>
          <AddBlogForm  
            handleSubmit={(e) => this.handleSubmit(e)} 
            loading={loading}
            errorMessage={error && error.message}
          />
        </FormWrapper>
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
  addBlogState: state.addBlog
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps =>
  bindActionCreators({ addBlog, addBlogInitialize }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AddBlogView);