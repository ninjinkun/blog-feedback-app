import React, { useState } from 'react';
import { MdError } from 'react-icons/md';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import styled from 'styled-components';
import { PrimaryButton } from '../../atoms/Button';
import Spinner from '../../atoms/Spinner/index';
import Wrapper from '../../atoms/Wrapper/index';
import * as properties from '../../properties';

type Props = {
  handleSubmit: (url: string, reportMailEnabled: boolean) => any;
  loading: boolean;
  errorMessage?: string;
  url?: string;
  clearURL?: () => void;
};

type States = {
  url: string;
  reportMailEnabled: boolean;
};

const AddBlogForm: React.FC<Props> = props => {
  const [inputURL, setInputURL] = useState<string>('');
  const [reportMailEnabled, setReportMailEnabled] = useState<boolean>(false);
  const { loading, errorMessage, url, clearURL } = props;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.handleSubmit(url || inputURL, reportMailEnabled);
  };

  return (
    <StyledWrapper>
      <StyledForm onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        <StyledLabel>
          <Text>ブログのURLを入力してください</Text>
          <URLField
            type="url"
            value={url || inputURL}
            placeholder={'https://exampleblog.com/'}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              if (clearURL) {
                clearURL();
              }
              setInputURL((e.target as HTMLInputElement).value);
            }}
          />
        </StyledLabel>
        <ReportMailWrapper>
          <ReportMailLabel htmlFor="report-mail">
            <ReprotMailTitle>デイリーレポートメールを購読する (α版)</ReprotMailTitle>
            <ReprotMailDescription>
              毎朝シェア数が増加しているとメールが届きます。
              <br />
              この設定はブログの設定画面から変更できます。
            </ReprotMailDescription>
          </ReportMailLabel>
          <Switch
            id="report-mail"
            type="checkbox"
            defaultChecked={false}
            icons={false}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setReportMailEnabled((e.target as HTMLInputElement).checked)
            }
          />
        </ReportMailWrapper>
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
};

export default AddBlogForm;

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
  font-size: ${properties.fontSizes.s};
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
  font-size: ${properties.fontSizes.m};
  border: 1px solid ${properties.colors.grayLight};
  border-radius: 4px;
`;

const ReportMailWrapper = styled(Wrapper)`
  flex-direction: row;
  border: 1px solid ${properties.colors.grayLight};
  padding: 8px;
  border-radius: 4px;
  align-items: center;
  margin-bottom: 16px;
`;

const ReportMailLabel = styled.label`
  display: flex;
  flex-direction: column;
`;

const ReprotMailTitle = styled.span`
  font-size: ${properties.fontSizes.s};
  font-weight: ${properties.fontWeights.bold};
`;

const ReprotMailDescription = styled.p`
  font-size: ${properties.fontSizes.xs};
  margin: 4px 0;
`;

const Switch = styled(Toggle)`
  margin-left: 12px;
`;
