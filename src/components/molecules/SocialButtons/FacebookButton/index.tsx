import React from 'react';

interface Window {
  FB: any;
}
declare const window: Window;

type Props = {
  url: string;
};

export default class FacebookButton extends React.PureComponent<Props> {
  componentDidMount() {
    window.FB.XFBML.parse();
  }

  render() {
    const { url } = this.props;
    return (
      <div
        className="fb-share-button"
        data-href={url}
        data-layout="button_count"
        data-size="small"
        data-mobile-iframe="true"
      >
        <a
          target="_blank"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&amp;src=sdkpreparse`}
          className="fb-xfbml-parse-ignore"
        >
          シェア
        </a>
      </div>
    );
  }
}
