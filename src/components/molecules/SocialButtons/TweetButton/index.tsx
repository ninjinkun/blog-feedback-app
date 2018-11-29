import React from 'react';
import { MdTransferWithinAStation } from 'react-icons/md';

interface Window {
  twttr: any;
}
declare const window: Window;

type Props = {
  text?: string;
  url: string;
};

export default class TweetButton extends React.PureComponent<Props> {
  componentDidMount() {
    window.twttr.widgets.load(this.refs.tweetButton);
  }

  render() {
    const { text, url } = this.props;
    return (
      <a
        // tslint:disable-next-line:jsx-no-string-ref
        ref="tweetButton"
        href="https://twitter.com/share"
        className="twitter-share-button"
        data-text={text}
        data-url={url}
        data-show-count="false"
      />
    );
  }
}