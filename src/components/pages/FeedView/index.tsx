import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components';
import * as firebase from 'firebase';

import { ItemResponse } from '../../../models/responses';
import { CountEntity } from '../../../models/entities';
import ScrollView from '../../atoms/ScrollView/index';
import { CountType } from '../../../consts/count-type';
import EntryCell from '../../organisms/EntryCell/index';
import { AppState } from '../../../redux/states/app-state';
import { feedBlogURLChange, fetchFirebaseFeed, fetchOnlineFeed, feedBlogURLClear } from '../../../redux/actions/feed-action';
import { FeedsState } from '../../../redux/states/feeds-state';
import { colorsValue } from '../../properties';

type StateProps = {
  feeds: FeedsState;
};

type DispatchProps = {
  feedBlogURLClear: () => any;
  feedBlogURLChange: (blogURL: string) => any;
  fetchFirebaseFeed: (auth: firebase.auth.Auth, blogURL: string) => any;
  fetchOnlineFeed: (auth: firebase.auth.Auth, blogURL: string) => any;
};

type Props = { url: string } & StateProps & DispatchProps;

class FeedView extends React.Component<Props> {
  componentDidMount() {
    const blogURL = this.props.url;
    this.props.feedBlogURLChange(blogURL);
    this.props.fetchFirebaseFeed(firebase.auth(), blogURL);
    this.props.fetchOnlineFeed(firebase.auth(), blogURL);
  }
  componentWillUnmount() {
    this.props.feedBlogURLClear();
  }
  render() {
    const { feeds, url } = this.props;
    const feed = feeds.feeds[url];

    if ((!feed || feed.loading) && !(feed && feed.fethcedEntities || feed && feed.firebaseEntities)) {
      return (<ScrollView><ActivityIndicator size="large" /></ScrollView>);
    } else {
      const { firebaseEntities, fethcedEntities, fetchedCounts } = feed;
      const entities = fethcedEntities && fethcedEntities.length ? fethcedEntities :
        firebaseEntities && firebaseEntities.length ? firebaseEntities : [];

      let facebookMap: Map<string, number> | undefined;
      let hatenaBookmarkMap: Map<string, number> | undefined;
      if (fetchedCounts && fetchedCounts.length) {
        const facebookCounts = fetchedCounts.filter(c => c.type === CountType.Facebook);
        if (facebookCounts.length) {
          facebookMap = new Map<string, number>(facebookCounts.map(c => [c.url, c.count] as [string, number]));
        }
        const hatenaBookmarkCounts = fetchedCounts.filter(c => c.type === CountType.HatenaBookmark);
        if (hatenaBookmarkCounts.length) {
          hatenaBookmarkMap = new Map<string, number>(hatenaBookmarkCounts.map(c => [c.url, c.count] as [string, number]));
        }
      } 
      
      if (firebaseEntities) {
        if (!facebookMap) {
          const facebookCounts = firebaseEntities.filter(i => i.counts && i.counts[CountType.Facebook]);
          if (facebookCounts.length) {
            facebookMap = new Map<string, number>(facebookCounts.map(i => [i.url, i.counts[CountType.Facebook].count] as [string, number]));
          }
        }
        if (!hatenaBookmarkMap) {
          const hanteaBookmarkCounts = firebaseEntities.filter(i => i.counts && i.counts[CountType.HatenaBookmark]);
          if (hanteaBookmarkCounts.length) {
            hatenaBookmarkMap = new Map<string, number>(hanteaBookmarkCounts.map(i => [i.url, i.counts[CountType.HatenaBookmark].count] as [string, number]));
          }
        }
      }

      return (
        <StyledScrollView>
          {entities.map(
            (item: ItemResponse) =>
              <EntryCell
                key={item.url}
                title={item.title}
                favicon={`http://www.google.com/s2/favicons?domain=${item.url}`}
                counts={[
                  { type: CountType.Twitter, count: 0 },
                  { type: CountType.Facebook, count: facebookMap && facebookMap.get(item.url) || 0 },
                  { type: CountType.HatenaBookmark, count: hatenaBookmarkMap && hatenaBookmarkMap.get(item.url) || 0 }
                ]}
                url={item.url}
              />
          )}
        </StyledScrollView>);
    }
  }
}

const StyledScrollView = styled(ScrollView)`
  background-color: ${colorsValue.grayPale};
`;

const mapStateToProps = (state: AppState) => ({
  feeds: state.feeds
});

function mapDispatchToProps(dispatch: Dispatch<AppState>) {
  return {
    feedBlogURLClear: () => dispatch(feedBlogURLClear()),
    feedBlogURLChange: (blogURL: string) => dispatch(feedBlogURLChange(blogURL)),
    fetchFirebaseFeed: (auth: firebase.auth.Auth, blogURL: string) => fetchFirebaseFeed(auth, blogURL)(dispatch),
    fetchOnlineFeed: (auth: firebase.auth.Auth, blogURL: string) => fetchOnlineFeed(auth, blogURL)(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedView);