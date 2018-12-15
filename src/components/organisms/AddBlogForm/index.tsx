import React from 'react';
import { MdError } from 'react-icons/md';
import styled from 'styled-components';
import { PrimaryButton } from '../../atoms/Button';
import Spinner from '../../atoms/Spinner/index';
import Wrapper from '../../atoms/Wrapper/index';
import * as properties from '../../properties';

type Props = {
  handleSubmit: (url: string) => any;
  loading: boolean;
  errorMessage?: string;
  url?: string;
  clearURL?: () => void;
};

type States = {
  url: string;
};

export default class AddBlogForm extends React.PureComponent<Props, States> {
  constructor(props: any) {
    super(props);
    this.state = { url: '' };
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const { url } = this.props;
    event.preventDefault();
    this.props.handleSubmit(url || this.state.url);
  }

  render() {
    const { loading, errorMessage, url, clearURL } = this.props;
    return (
      <StyledWrapper>
        <StyledForm onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e)}>
          <StyledLabel>
            <Text>ブログのURLを入力してください</Text>
            <URLField
              type="url"
              value={url || this.state.url}
              placeholder={'https://exampleblog.com/'}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                if (clearURL) {
                  clearURL();
                }
                this.setState({ url: (e.target as HTMLInputElement).value });
              }}
            />
          </StyledLabel>
          <PrimaryButton type="submit" value="ブログを追加" as="input" />
        </StyledForm>
        {errorMessage ? (
          <ErrorWrapper>
            <ErrorIcon size={20} /> {errorMessage}
          </ErrorWrapper>
        ) : null}
        {loading ? (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        ) : null}
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
  border: 1px solid #f5aca6;
  border-radius: 4px;
  padding: 8px;
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
  padding: 8px;
  width: 100%;
  display: inline-block;
  box-sizing: border-box;
  font-size: 1rem;
  border: 1px solid ${properties.colors.grayLight};
  border-radius: 4px;
`;
