import * as React from 'react';
import {
  TextProperties, Image, StyleSheet,
  Text, View, Button, TouchableHighlight, Linking,
  TouchableOpacity, ScrollView, ActivityIndicator, ViewProperties
} from 'react-native';
import * as firebase from 'firebase';
import { StyledFirebaseAuth } from 'react-firebaseui';
import {
  BlogResponse, ItemResponse, CountResponse, CountType
} from './responses';
import { crawl } from './crawler';
import { Repository, UserRepository, BlogRepository, ItemRepository, CountRepository } from './repositories';
import { ItemEntity, CountEntity } from './entities';
// Styles
const styles = StyleSheet.create<any>({
    image: {
        height: 16,
        width: 16,
        marginVertical: 10
    },
    button: {
        flexGrow: 1,
        flexDirection: 'row'
    },
    buttonContent: {
        flexDirection: 'row'
    },
    buttons: {
        flexDirection: 'row'
    },
    activityIndicatorContainer: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    feedContainer: {
        flexGrow: 1,
        height: 500
    }
});

class FeedItemView extends React.Component<{ link: string, title: string, facebookCount: number, hatenaBookmarkCount: number }> {
    render() {
        return (
            <View>
                <TouchableOpacity>
                    <Text accessibilityRole="link" href={this.props.link}>{this.props.title}</Text>
                </TouchableOpacity>
                <View style={styles.buttons}>
                    <CountButton image={require('./twitter-icon.png')} count={0} />
                    <CountButton image={require('./facebook-icon.png')} count={this.props.facebookCount} />
                    <CountButton image={require('./hatenabookmark-icon.png')} count={this.props.hatenaBookmarkCount} />
                </View>
            </View>
        );
    }
}

const CountButton = ({ count, image }: { count: number, image: string }) => (
    <TouchableHighlight style={styles.button}>
        <View style={styles.buttonContent}>
            <Image source={{ uri: image }} style={styles.image} />
            <Text>{count}</Text>
        </View>
    </TouchableHighlight>
);

class FeedView extends React.Component<{url: string}, { title?: string, items?: ItemResponse[] | ItemEntity[], counts?: CountResponse[] | CountEntity[], user?: firebase.User }> {
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
                <ScrollView style={styles.feedContainer}>
                    {this.state.items.map(
                        (item: ItemResponse) =>
                            <FeedItemView
                                title={item.title}
                                link={item.url}
                                facebookCount={facebookMap.get(item.url) || 0}
                                hatenaBookmarkCount={hatenaBookmarkMap.get(item.url) || 0}
                                key={item.url}
                            />
                    )}
                </ScrollView>);
        } else {
            return (<View style={styles.activityIndicatorContainer}><ActivityIndicator size="large" /></View>);
        }
    }
}

export default FeedView;