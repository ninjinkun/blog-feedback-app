import * as React from 'react';
import Header from '../../organisms/Header/index';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/states/app-state';
import { FeedsState } from '../../../redux/states/feeds-state';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

const mapStateToProps = (state: AppState) => ({
  state: state.feeds
});

type Props = {
  state: FeedsState;
};

export default withRouter(connect(mapStateToProps)(({ ...props }: RouteComponentProps<{}> & Props) => {
  const { currentBlogURL, feeds } = props.state;
  if (currentBlogURL && feeds[currentBlogURL]) {
    const feed = feeds[currentBlogURL];

    return (
      <StyledHeader
        title={feed.title || ''}
        loading={(feed.crowlingRatio > 0 && feed.crowlingRatio < 100)}
        loadingRatio={feed.crowlingRatio}
        loadingLabel={feed.crowlingLabel}
        onBackButtonClick={() => { props.history.push(`/blogs/`); }}
      />
    );
  } else {
    return (
      <StyledHeader
        title={'BlogFeedback'}
        onAddButtonClick={() => { props.history.push(`/add`); }}
      />
    );
  }
}));

const StyledHeader = styled(Header)`
      position: fixed;
      width: 100%;
      display: flex;
      flex-direction: column;
    `;
