import React from 'react';
import { CountType, toServiceURL } from '../../../../models/consts/count-type';

type Props = {
  url: string;
};

const HatenaBookmarkButton: React.FunctionComponent<Props> = ({ url }) => (
  <a
    href={`${toServiceURL(CountType.HatenaBookmark, url)}`}
    className="hatena-bookmark-button"
    data-hatena-bookmark-layout="basic-counter"
    title="このエントリーをはてなブックマークに追加"
  >
    <img
      src="https://b.st-hatena.com/images/entry-button/button-only@2x.png"
      alt="このエントリーをはてなブックマークに追加"
      width="20"
      height="20"
    />
  </a>
);

export default HatenaBookmarkButton;
