import * as firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import { RouteComponentProps, withRouter } from 'react-router';
import { CountType } from '../../../consts/count-type';
import { CountEntity, ItemEntity } from '../../../models/entities';
import { CountResponse, ItemResponse } from '../../../models/responses';
import { FeedActions, feedBlogURLChange, feedBlogURLClear, fetchFeed } from '../../../redux/actions/feed-action';
import { AppState } from '../../../redux/states/app-state';
import { FeedState } from '../../../redux/states/feed-state';
import ScrollView from '../../atoms/ScrollView/index';
import Wrapper from '../../atoms/Wrapper/index';
import LoadingView from '../../molecules/LoadingView/index';
import EntryCell from '../../organisms/EntryCell/index';
import { colorsValue } from '../../properties';
import PageLayout from '../../templates/PageLayout/index';

type StateProps = {
  feed: FeedState;
};

type DispatchProps = {
  feedBlogURLClear: () => void;
  feedBlogURLChange: (blogURL: string) => void;
  fetchFeed: (auth: firebase.auth.Auth, blogURL: string) => void;
};

type OwnProps = RouteComponentProps<{ blogURL: string }>;

type Props = OwnProps & StateProps & DispatchProps;

type CountMap = Map<string, number>;
type AnimateMap = Map<string, boolean>;

class EntriesPage extends React.PureComponent<Props> {
  componentDidMount() {
    const blogURL = decodeURIComponent(this.props.match.params.blogURL);
    this.props.feedBlogURLChange(blogURL);
    this.props.fetchFeed(firebase.auth(), blogURL);
  }

  componentWillUnmount() {
    this.props.feedBlogURLClear();
  }

  render() {
    const { blogURL } = this.props.match.params;
    const { feed, history } = this.props;
    return (
      <PageLayout
        header={{
          title: (feed && feed.title) || '',
          loading: feed && feed.loadingRatio > 0 && feed.loadingRatio < 100,
          loadingRatio: feed && feed.loadingRatio,
          loadingLabel: feed && feed.loadingLabel,
          backButtonLink: '/blogs/',
        }}
      >
        {(() => {
          if ((!feed || feed.loading) && !((feed && feed.fethcedEntities) || (feed && feed.firebaseEntities))) {
            return <LoadingView />;
          } else {
            const { firebaseEntities, fethcedEntities, fetchedHatenaBookmarkCounts, fetchedFacebookCounts } = feed;

            const [hatenabookmarkMap, hatenabookmarkAnimateMap] = this.stateToViewData(
              fetchedHatenaBookmarkCounts,
              firebaseEntities,
              CountType.HatenaBookmark
            );
            const [facebookMap, facebookAnimateMap] = this.stateToViewData(
              fetchedFacebookCounts,
              firebaseEntities,
              CountType.Facebook
            );

            const items: Array<ItemResponse | ItemEntity> =
              fethcedEntities && fethcedEntities.length
                ? fethcedEntities
                : firebaseEntities && firebaseEntities.length
                ? firebaseEntities
                : [];
            return (
              <StyledScrollView>
                {items.map(item => (
                  <EntryCell
                    key={item.url}
                    title={item.title}
                    favicon={`https://www.google.com/s2/favicons?domain=${blogURL}`}
                    counts={[
                      { type: CountType.Twitter, count: 0, animate: false },
                      {
                        type: CountType.Facebook,
                        count: facebookMap.get(item.url) || 0,
                        animate: !!(facebookAnimateMap && facebookAnimateMap.get(item.url)),
                      },
                      {
                        type: CountType.HatenaBookmark,
                        count: hatenabookmarkMap.get(item.url) || 0,
                        animate: !!(hatenabookmarkAnimateMap && hatenabookmarkAnimateMap.get(item.url)),
                      },
                    ]}
                    url={item.url}
                  />
                ))}
              </StyledScrollView>
            );
          }
        })()}
      </PageLayout>
    );
  }

  stateToViewData(
    fetchedCounts: CountResponse[] | undefined,
    firebaseEntities: ItemEntity[] | undefined,
    countType: CountType
  ): [CountMap, AnimateMap] {
    const filteredFetchedCounts: CountResponse[] =
      (fetchedCounts && fetchedCounts.filter(({ type }) => type === countType)) || [];
    const fetchedMap: CountMap = new Map(
      filteredFetchedCounts.map(({ url, count }) => [url, count] as [string, number])
    );

    const filteredFirebaseCounts =
      (firebaseEntities && firebaseEntities.filter(({ counts }) => counts && counts[countType])) || [];
    const firebaseMap: CountMap = new Map(
      filteredFirebaseCounts.map(({ url, counts }) => [url, counts[countType].count] as [string, number])
    );
    const countsMap: CountMap = new Map([...firebaseMap, ...fetchedMap]);

    const prevFirebaseCounts = filteredFirebaseCounts.filter(({ prevCounts }) => prevCounts && prevCounts[countType]);
    const prevFirebaseMap: Map<string, CountEntity> = new Map(
      prevFirebaseCounts.map(({ url, prevCounts }) => [url, prevCounts[countType]] as [string, CountEntity])
    );
    const animateMap: AnimateMap = new Map(
      filteredFetchedCounts.map(({ url, count }) => {
        const prevCount = prevFirebaseMap.get(url);
        const animate = (!prevCount && count > 0) || (prevCount && count > prevCount.count);
        return [url, animate] as [string, boolean];
      })
    );

    return [countsMap, animateMap];
  }
}

const StyledScrollView = styled(ScrollView)`
  background-color: ${colorsValue.grayPale};
  min-height: 100%;
`;

function mapStateToProps(state: AppState, ownProps: OwnProps): StateProps {
  return {
    feed: state.feeds.feeds[decodeURIComponent(ownProps.match.params.blogURL)],
  };
}

function mapDispatchToProps(dispatch: Dispatch<FeedActions>): DispatchProps {
  return {
    feedBlogURLClear: () => dispatch(feedBlogURLClear()),
    feedBlogURLChange: url => dispatch(feedBlogURLChange(url)),
    fetchFeed: (auth, blogURL) => dispatch(fetchFeed(blogURL, auth)),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EntriesPage)
);
