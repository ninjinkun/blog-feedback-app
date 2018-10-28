import * as React from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Dispatch } from 'redux';
import { BrowserRouter, Route, Link, Redirect, match as matchParam, withRouter, RouteComponentProps } from 'react-router-dom';
import Wrapper from '../../atoms/Wrapper/index';
import AddBlogForm from '../../organisms/AddBlogForm/index';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/states/app-state';
import { addBlog, addBlogInitialize } from '../../../redux/actions/add-blog-action';
import { AddBlogState } from '../../../redux/states/add-blog-state';

type StateProps = {
  addBlogState: AddBlogState;
};

type DispatchProps = {
  addBlog: (auth: firebase.auth.Auth, blogURL: string) => any;
  addBlogInitialize: () => any;
};
type Props = StateProps & DispatchProps & RouteComponentProps<{}>;

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

const mapStateToProps = (state: AppState) => ({
  'addBlogState': state.addBlog
});

function mapDispatchToProps(dispatch: Dispatch<AppState>) {
  return {
    addBlog: (auth: firebase.auth.Auth, blogURL: string) => addBlog(auth, blogURL)(dispatch),
    addBlogInitialize: () => dispatch(addBlogInitialize()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddBlogView);