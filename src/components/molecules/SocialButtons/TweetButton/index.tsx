import React from 'react';

interface Window {
  twttr: any;
}
declare const window: Window;

type Props = {
  text?: string;
  url: string;
};

export default class TweetButton extends React.PureComponent<Props> {
  tweetButtonRef: any = null;

  constructor(props: any) {
    super(props);
    this.setTeetButtonRef = this.setTeetButtonRef.bind(this);
  }

  setTeetButtonRef(element: HTMLAnchorElement) {
    this.tweetButtonRef = element;
  }

  componentDidMount() {
    if (window && window.twttr) {
      window.twttr.widgets.load(this.tweetButtonRef);
    }
  }

  render() {
    const { text, url } = this.props;
    return (
      <a
        // tslint:disable-next-line:jsx-no-string-ref
        ref={this.setTeetButtonRef}
        href="https://twitter.com/share"
        className="twitter-share-button"
        data-text={text}
        data-url={url}
        data-show-count="false"
      />
    );
  }
}
