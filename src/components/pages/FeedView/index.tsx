import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {  ActivityIndicator } from 'react-native';
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
      const { firebaseEntities, firebaseCounts, fethcedEntities, fetchedCounts } = feed;
      const entities = fethcedEntities && fethcedEntities.length ? fethcedEntities :
      firebaseEntities && firebaseEntities.length ? firebaseEntities : [];
      const countEntiries = fetchedCounts && fetchedCounts.length ? fetchedCounts :
      firebaseCounts && firebaseCounts.length ? firebaseCounts : [];

      const facebookMap = new Map<string, number>(countEntiries.filter((c: CountEntity) => c.type === CountType.Facebook).map((i: CountEntity) => [i.url, i.count] as [string, number]));
      const hatenaBookmarkMap = new Map<string, number>(countEntiries.filter((c: CountEntity) => c.type === CountType.HatenaBookmark).map((i: CountEntity) => [i.url, i.count] as [string, number]));

      return (
        <ScrollView>
          {entities.map(
            (item: ItemResponse) =>
              <a href={item.url} key={item.url}>
                <EntryCell
                  title={item.title}
                  favicon={`http://www.google.com/s2/favicons?domain=${item.url}`}
                  counts={[
                    { type: CountType.Twitter, count: 0 },
                    { type: CountType.Facebook, count: facebookMap.get(item.url) || 0 },
                    { type: CountType.HatenaBookmark, count: hatenaBookmarkMap.get(item.url) || 0 }
                  ]}
                />
              </a>
          )}
        </ScrollView>);
    }
  }
}

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