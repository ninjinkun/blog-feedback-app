import * as React from 'react';
import {
    ActivityIndicator
} from 'react-native';
import styled from 'styled-components';
import * as firebase from 'firebase';
import { StyledFirebaseAuth } from 'react-firebaseui';
import {
    BlogResponse, ItemResponse, CountResponse
} from './models/responses';
import { crawl } from './models/crawler';
import {
    Repository, UserRepository, BlogRepository,
    ItemRepository, CountRepository
} from './models/repositories';
import { ItemEntity, CountEntity } from './models/entities';
import ScrollView from './components/atoms/ScrollView/index';
import CountType from './consts/count-type';
import BlogCell from './components/organisms/EntryCell/index';

class FeedView extends React.Component<{ url: string }, { title?: string, items?: ItemResponse[] | ItemEntity[], counts?: CountResponse[] | CountEntity[], user?: firebase.User }> {
    constructor(props: any) {
        super(props);
        this.state = { title: '', items: [], counts: [] };
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                return;
            } else {
                this.setState({ user: user });
                this.fetchFeeds(this.props.url);
                this.fetchDB(this.props.url);
            }
        });
    }

    async fetchFeeds(blogUrl: string) {
        const [fetchBlog, fetchFeed, fetchCount] = crawl(blogUrl);
        const user = firebase.auth().currentUser;
        if (!user) {
            return;
        }
        let blogResponse: BlogResponse;
        {
            blogResponse = await fetchBlog;
            new BlogRepository().setBlog(
                user.uid,
                blogResponse.url,
                blogResponse.title,
                blogResponse.feedUrl,
                blogResponse.feedType
            );
            this.setState({ title: blogResponse.title });
        }

        {
            const feedItemsResponse = await fetchFeed;
            this.setState({ 'items': feedItemsResponse });

            const batch = new Repository().db.batch();
            feedItemsResponse.forEach((item: ItemResponse) => {
                new ItemRepository().setItemBatch(
                    batch,
                    user.uid,
                    blogResponse.url,
                    item.url,
                    item.title,
                    item.published
                );
            });
            batch.commit();
        }

        {
            const countsResponse = await fetchCount;
            this.setState({ 'counts': countsResponse });

            const batch = new Repository().db.batch();
            countsResponse.filter((count: CountResponse) => count && count.count > 0).forEach((count: CountResponse) => {
                new CountRepository().addCountBatch(batch, user.uid, blogResponse.url, count.url, count.type, count.count);
            });
            batch.commit();
        }
    }

    async fetchDB(blogUrl: string) {
        const user = firebase.auth().currentUser;
        if (!user) {
            return;
        }

        const blogEntity = await new BlogRepository().getBlog(user.uid, blogUrl);
        this.setState({ title: blogEntity.data()!.title });

        const itemEntities = await new ItemRepository().getItems(user.uid, blogUrl);
        this.setState({ items: itemEntities });

        const counts = await (Promise.all(
            [].concat.apply([], [CountType.Facebook, CountType.HatenaBookmark].map(type =>
                itemEntities.map((item) => new CountRepository().getLatestCount(user.uid, blogUrl, item.url, type))
            )) as Promise<CountEntity>[]
        ));
        this.setState({ counts: counts.filter((i) => i) });
    }

    render() {
        if (this.state.items && this.state.items.length) {
            const counts = [].concat.apply([], this.state.counts);

            const facebookMap = new Map<string, number>(counts.filter((c: CountResponse) => c.type === CountType.Facebook).map((i: CountResponse) => [i.url, i.count]));
            const hatenaBookmarkMap = new Map<string, number>(counts.filter((c: CountResponse) => c.type === CountType.HatenaBookmark).map((i: CountResponse) => [i.url, i.count]));

            return (
                <ScrollView>
                    {this.state.items.map(
                        (item: ItemResponse) =>
                            <a href={item.url} key={item.url}>
                                <BlogCell
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
        } else {
            return (<ScrollView><ActivityIndicator size="large" /></ScrollView>);
        }
    }
}

export default FeedView;