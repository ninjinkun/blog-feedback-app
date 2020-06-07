import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { RouteComponentProps } from 'react-router';
import { CountType } from '../../../models/consts/count-type';
import { CountEntity, ItemEntity } from '../../../models/entities';
import { CountResponse, ItemResponse } from '../../../models/responses';
import { AppState } from '../../../redux/app-reducer';
import { FeedState } from '../../../redux/slices/feeds';
import ScrollView from '../../atoms/ScrollView/index';
import LoadingView from '../../molecules/LoadingView/index';
import EntryCell, { Count } from '../../organisms/EntryCell/index';
import { colorsValue } from '../../properties';
import PageLayout from '../../templates/PageLayout/index';
import { feedsSlice } from '../../../redux/slices/feeds';

type CountMap = Map<string, number>;
type AnimateMap = Map<string, boolean>;

const FeedPage: React.FC<RouteComponentProps<{ blogURL: string }>> = (props) => {
  const blogURL = decodeURIComponent(props.match.params.blogURL);
  const feed = useSelector<AppState, FeedState>((state) => state.feeds.feeds?.[blogURL])
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(feedsSlice.actions.changeBlogURL(blogURL));
    dispatch(feedsSlice.actions.startFetchAndSave({ auth: firebase.auth(), blogURL }));
    return () => {
      dispatch(feedsSlice.actions.clearBlogURL());
    };
  }, [dispatch]);

  return (
    <PageLayout
      header={{
        title: (feed && feed.title) || '',
        loading: feed && feed.loadingRatio > 0 && feed.loadingRatio < 100,
        loadingRatio: feed && feed.loadingRatio,
        loadingLabel: feed && feed.loadingLabel,
        backButtonLink: '/blogs',
      }}
    >
      {(() => {
        if ((!feed || feed.loading) && !((feed && feed.fethcedEntities) || (feed && feed.firebaseEntities))) {
          return <LoadingView />;
        } else {
          const {
            firebaseEntities,
            fethcedEntities,
            fetchedCountJsoonCounts,
            fetchedHatenaBookmarkCounts,
            fetchedHatenaStarCounts,
            fetchedFacebookCounts,
            fetchedPocketCounts,
          } = feed;

          const [countjsoonMap, countjoonAnimateMap] = stateToViewData(
            fetchedCountJsoonCounts,
            firebaseEntities,
            CountType.CountJsoon
          );
          const [hatenabookmarkMap, hatenabookmarkAnimateMap] = stateToViewData(
            fetchedHatenaBookmarkCounts,
            firebaseEntities,
            CountType.HatenaBookmark
          );
          const [hatenastarMap, hatenastarAnimateMap] = stateToViewData(
            fetchedHatenaStarCounts,
            firebaseEntities,
            CountType.HatenaStar
          );
          const [facebookMap, facebookAnimateMap] = stateToViewData(
            fetchedFacebookCounts,
            firebaseEntities,
            CountType.Facebook
          );
          const [pocketMap, pocketAnimateMap] = stateToViewData(
            fetchedPocketCounts,
            firebaseEntities,
            CountType.Pocket
          );

          const items: Array<ItemResponse | ItemEntity> =
            fethcedEntities && fethcedEntities.length
              ? fethcedEntities
              : firebaseEntities && firebaseEntities.length
              ? firebaseEntities
              : [];

          return (
            <StyledScrollView>
              {items.map((item) => (
                <EntryCell
                  key={item.url}
                  title={item.title}
                  favicon={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(blogURL)}`}
                  counts={(() => {
                    const counts: Count[] = [];
                    if (feed.services && feed.services.twitter && !feed.services.countjsoon) {
                      counts.push({ type: CountType.Twitter, count: undefined, animate: false });
                    }
                    if (feed.services && feed.services.countjsoon) {
                      counts.push({
                        type: CountType.CountJsoon,
                        count: countjsoonMap.get(item.url) || 0,
                        animate: !!(countjoonAnimateMap && countjoonAnimateMap.get(item.url)),
                      });
                    }
                    if (feed.services && feed.services.facebook) {
                      counts.push({
                        type: CountType.Facebook,
                        count: facebookMap.get(item.url) || 0,
                        animate: !!(facebookAnimateMap && facebookAnimateMap.get(item.url)),
                      });
                    }
                    if (feed.services && feed.services.hatenabookmark) {
                      counts.push({
                        type: CountType.HatenaBookmark,
                        count: hatenabookmarkMap.get(item.url) || 0,
                        animate: !!(hatenabookmarkAnimateMap && hatenabookmarkAnimateMap.get(item.url)),
                      });
                    }
                    if (feed.services && feed.services.hatenastar) {
                      counts.push({
                        type: CountType.HatenaStar,
                        count: hatenastarMap.get(item.url) || 0,
                        animate: !!(hatenastarAnimateMap && hatenastarAnimateMap.get(item.url)),
                      });
                    }
                    if (feed.services && feed.services.pocket) {
                      counts.push({
                        type: CountType.Pocket,
                        count: pocketMap.get(item.url) || 0,
                        animate: !!(pocketAnimateMap && pocketAnimateMap.get(item.url)),
                      });
                    }
                    return counts;
                  })()}
                  url={item.url}
                />
              ))}
            </StyledScrollView>
          );
        }
      })()}
    </PageLayout>
  );
};

function stateToViewData(
  fetchedCounts: CountResponse[] | undefined,
  firebaseEntities: ItemEntity[] | undefined,
  countType: CountType
): [CountMap, AnimateMap] {
  const filteredFetchedCounts: CountResponse[] =
    (fetchedCounts && fetchedCounts.filter(({ type }) => type === countType)) || [];
  const fetchedMap: CountMap = new Map(filteredFetchedCounts.map(({ url, count }) => [url, count] as [string, number]));

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

const StyledScrollView = styled(ScrollView)`
  background-color: ${colorsValue.grayPale};
  min-height: 100%;
`;

export default FeedPage;
