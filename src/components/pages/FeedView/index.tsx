import * as React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { ItemResponse, CountResponse } from '../../../models/responses';
import { ItemEntity, CountEntity } from '../../../models/entities';
import ScrollView from '../../atoms/ScrollView/index';
import { CountType } from '../../../consts/count-type';
import EntryCell from '../../organisms/EntryCell/index';
import Wrapper from '../../atoms/Wrapper/index';
import { AppState } from '../../../redux/states/app-state';
import { feedBlogURLChange, fetchFirebaseFeed, fetchOnlineFeed, feedBlogURLClear, ItemEntitiesFunction, FeedActions } from '../../../redux/actions/feed-action';
import { FeedState } from '../../../redux/states/feed-state';
import { colorsValue } from '../../properties';
import LoadingView from '../../molecules/LoadingView/index';
import { ThunkDispatch } from 'redux-thunk';

type StateProps = {
  feed: FeedState;
};

type DispatchProps = {
  feedBlogURLClear: () => any;
  feedBlogURLChange: (blogURL: string) => any;
  fetchFirebaseFeed: (auth: firebase.auth.Auth, blogURL: string) => any;
  fetchOnlineFeed: (auth: firebase.auth.Auth, blogURL: string, getItemEntities: ItemEntitiesFunction) => any;
};

type OwnProps = { url: string };

type Props = OwnProps & StateProps & DispatchProps;

type CountMap = Map<string, number>;
type AnimateMap = Map<string, boolean>;

class FeedView extends React.PureComponent<Props> {
  componentDidMount() {
    const blogURL = this.props.url;
    this.props.feedBlogURLChange(blogURL);
    this.props.fetchFirebaseFeed(firebase.auth(), blogURL);

    this.getItemEntities = this.getItemEntities.bind(this);
    this.props.fetchOnlineFeed(firebase.auth(), blogURL, this.getItemEntities);
  }

  getItemEntities(): ItemEntity[] {
    const { feed } = this.props;
    return feed && feed.firebaseEntities ? feed.firebaseEntities : [];
  }

  componentWillUnmount() {
    this.props.feedBlogURLClear();
  }

  render() {
    const { feed, url } = this.props;
    if ((!feed || feed.loading) && !(feed && feed.fethcedEntities || feed && feed.firebaseEntities)) {
      return (<LoadingView />);
    } else {
      const { firebaseEntities, fethcedEntities, fetchedCounts } = feed;

      const [facebookMap, facebookAnimateMap] = this.stateToViewData(fetchedCounts, firebaseEntities, CountType.Facebook);
      const [hatenabookmarkMap, hatenabookmarkAnimateMap] = this.stateToViewData(fetchedCounts, firebaseEntities, CountType.HatenaBookmark);

      const items: (ItemResponse | ItemEntity)[] = fethcedEntities && fethcedEntities.length ? fethcedEntities : firebaseEntities && firebaseEntities.length ? firebaseEntities : [];
      return (
        <StyledScrollView>
          {items
            .map(item =>
              <EntryCell
                key={item.url}
                title={item.title}
                favicon={`https://www.google.com/s2/favicons?domain=${item.url}`}
                counts={[
                  { type: CountType.Twitter, count: 0, animate: false },
                  { type: CountType.Facebook, count: facebookMap.get(item.url) || 0, animate: !!(facebookAnimateMap && facebookAnimateMap.get(item.url)) },
                  { type: CountType.HatenaBookmark, count: hatenabookmarkMap.get(item.url) || 0, animate: !!(hatenabookmarkAnimateMap && hatenabookmarkAnimateMap.get(item.url)) }
                ]}
                url={item.url}
              />
            )}
        </StyledScrollView>);
    }
  }

  stateToViewData(fetchedCounts: CountResponse[] | undefined, firebaseEntities: ItemEntity[] | undefined, countType: CountType): [CountMap, AnimateMap] {
    const filteredFetchedCounts: CountResponse[] = fetchedCounts && fetchedCounts.filter(
      ({ type }) => type === countType
    ) || [];
    const fetchedMap: CountMap = new Map(filteredFetchedCounts.map(
      ({ url, count }) => [url, count] as [string, number]
    ));

    const filteredFirebaseCounts = firebaseEntities && firebaseEntities.filter(
      ({ counts }) => counts && counts[countType]
    ) || [];
    const firebaseMap: CountMap = new Map(filteredFirebaseCounts.map(
      ({ url, counts }) => [url, counts[countType].count] as [string, number]
    ));
    const countsMap: CountMap = new Map([...firebaseMap, ...fetchedMap]);

    const prevFirebaseCounts = filteredFirebaseCounts.filter(
      ({ prevCounts }) => prevCounts && prevCounts[countType]
    );
    const prevFirebaseMap: Map<string, CountEntity> = new Map(prevFirebaseCounts.map(
      ({ url, prevCounts }) => [url, prevCounts[countType]] as [string, CountEntity]
    ));
    const animateMap: AnimateMap = new Map(filteredFetchedCounts.map(({ url, count }) => {
      const prevCount = prevFirebaseMap.get(url);
      const animate = !prevCount && count > 0 || 
        prevCount && count > prevCount.count;
      return [url, animate] as [string, boolean];
    }));

    return [countsMap, animateMap];
  }
}

const StyledScrollView = styled(ScrollView)`
  background-color: ${colorsValue.grayPale};
  min-height: 100%;
`;

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => ({
  feed: state.feeds.feeds[ownProps.url],
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, undefined, FeedActions>): DispatchProps => ({
  feedBlogURLClear: () => dispatch(feedBlogURLClear()),
  feedBlogURLChange: (url) => dispatch(feedBlogURLChange(url)),
  fetchFirebaseFeed: (auth, blogURL) => dispatch(fetchFirebaseFeed(auth, blogURL)),
  fetchOnlineFeed: (auth, blogURL, getItemEntities) => dispatch(fetchOnlineFeed(auth, blogURL, getItemEntities)),  
  });

export default connect(mapStateToProps, mapDispatchToProps)(FeedView);