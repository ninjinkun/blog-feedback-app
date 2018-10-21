import * as React from 'react';
import styled from 'styled-components';
import Wrapper from '../../atoms/Wrapper/index';
import Spinner from '../../atoms/Spinner/index';
import * as properties from '../../properties';
import { PrimaryInput } from '../../atoms/Button';
import { MdError } from 'react-icons/md';

type Props = {
  handleSubmit: (url: string) => any;
  loading: boolean;
  errorMessage?: string;
};

type States = {
  url: string
};

export default class AddBlogForm extends React.PureComponent<Props, States> {
  constructor(props: any) {
    super(props);
    this.state = { url: '' };
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.props.handleSubmit(this.state.url);
  }

  render() {
    const { loading, errorMessage } = this.props;
    return (
      <StyledWrapper>
        <StyledForm onSubmit={(e) => this.handleSubmit(e)}>
          <StyledLabel>
              <Text>Enter Blog URL</Text>
              <URLField 
                type="url" 
                value={this.state.url} 
                placeholder={'https://exampleblog.com/'}
                onChange={(e) => { this.setState({ url: e.target.value }); }} 
              />
          </StyledLabel>
          <PrimaryInput type="submit" value="Add blog" />
        </StyledForm>
        {errorMessage ? <ErrorWrapper><ErrorIcon size={20} />  {errorMessage}</ErrorWrapper> : null}
        {loading ? <SpinnerWrapper><Spinner /></SpinnerWrapper> : null}
      </StyledWrapper>
    );
  }
}

const StyledWrapper = styled(Wrapper)`
  background-color: ${properties.colors.grayPale};
  align-items: center;
  padding: 16px;  
`;

const Text = styled.p`
  font-size: ${properties.fontSizes.m};
  margin: 16px;
`;

const SpinnerWrapper = styled(Wrapper)`
  margin: 16px;
`;

const ErrorIcon = styled(MdError)`
  color: ${properties.colors.red};
  margin-right: 4px;
`;

const ErrorWrapper = styled(Wrapper)`
  flex-direction: row;
  margin: 16px;
  background: #ffecec;
  border:1px solid #f5aca6;
  border-radius:4px;
  padding:8px;
  color: ${properties.colors.grayDark};
  align-items: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const URLField = styled.input`
  margin: 16px; 
  padding: 4px;
  width: 100%;
  display: inline-block;
  box-sizing: border-box;
  font-size: 1rem;
  border:1px solid ${properties.colors.grayLight};
  border-radius: 4px;
`;
