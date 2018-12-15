import { firestore } from 'firebase/app';
import { CountType } from '../consts/count-type';
import { ItemEntity } from '../models/entities';
import { CountResponse, ItemResponse } from '../models/responses';
import { createSaveEntities } from '../models/save-count-response';

const firebaseEntities: ItemEntity[] = [
  {
    title: 'Ikyu Frontend Meetupを開催しました',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/14/154352',
    published: new firestore.Timestamp(1544769832, 0),
    counts: {
      facebook: { count: 4, timestamp: new firestore.Timestamp(1544787808, 337000000) },
      hatenabookmark: { count: 18, timestamp: new firestore.Timestamp(1544787808, 337000000) },
    },
    prevCounts: {
      facebook: { count: 3, timestamp: new firestore.Timestamp(1544787295, 410000000) },
      hatenabookmark: { count: 4, timestamp: new firestore.Timestamp(1544775366, 395000000) },
    },
  },
  {
    title: '一休レストランの店舗ページをSPA化して Fastly で段階的リリースした話',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/13/143157',
    published: new firestore.Timestamp(1544679117, 0),
    counts: {
      facebook: { count: 26, timestamp: new firestore.Timestamp(1544775366, 395000000) },
      hatenabookmark: { count: 27, timestamp: new firestore.Timestamp(1544775366, 395000000) },
    },
    prevCounts: {
      facebook: { count: 26, timestamp: new firestore.Timestamp(1544766731, 388000000) },
      hatenabookmark: { count: 26, timestamp: new firestore.Timestamp(1544766731, 388000000) },
    },
  },
  {
    title: '一休のUI/UXデザイナーとして私がやっている4つのこと',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/11/100824',
    published: new firestore.Timestamp(1544490504, 0),
    counts: { facebook: { count: 7, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
    prevCounts: { facebook: { count: 7, timestamp: new firestore.Timestamp(1544775366, 395000000) } },
  },
  {
    title: 'Storybook を自作して「フロントエンドビルドが遅い問題」に立ち向かう',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/10/160505',
    published: new firestore.Timestamp(1544425505, 0),
    counts: {
      facebook: { count: 1, timestamp: new firestore.Timestamp(1544708405, 836000000) },
      hatenabookmark: { count: 19, timestamp: new firestore.Timestamp(1544708405, 836000000) },
    },
    prevCounts: {
      facebook: { count: 1, timestamp: new firestore.Timestamp(1544708405, 836000000) },
      hatenabookmark: { count: 19, timestamp: new firestore.Timestamp(1544694255, 796000000) },
    },
  },
  {
    title: 'Rundeck in practice [運用編]',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/09/105004',
    published: new firestore.Timestamp(1544320204, 0),
    counts: { hatenabookmark: { count: 1, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
    prevCounts: { hatenabookmark: { count: 1, timestamp: new firestore.Timestamp(1544775366, 395000000) } },
  },
  {
    title: 'ネット断食におすすめ！日帰り温泉・サウナも楽しめるSPA15選',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/07/115000',
    published: new firestore.Timestamp(1544151000, 0),
    counts: {
      facebook: { count: 17, timestamp: new firestore.Timestamp(1544708405, 836000000) },
      hatenabookmark: { count: 24, timestamp: new firestore.Timestamp(1544708405, 836000000) },
    },
    prevCounts: {
      facebook: { count: 17, timestamp: new firestore.Timestamp(1544708405, 836000000) },
      hatenabookmark: { count: 24, timestamp: new firestore.Timestamp(1544694255, 796000000) },
    },
  },
  {
    title: 'Rundeck in practice [導入編] ',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/06/084442',
    published: new firestore.Timestamp(1544053482, 0),
    counts: { hatenabookmark: { count: 4, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
    prevCounts: { hatenabookmark: { count: 4, timestamp: new firestore.Timestamp(1544775366, 395000000) } },
  },
  {
    title: 'Amazon Connect の導入と自社システムを連携した話',
    url: 'https://user-first.ikyu.co.jp/entry/amazon-connect',
    published: new firestore.Timestamp(1543935600, 0),
    counts: {
      facebook: { count: 42, timestamp: new firestore.Timestamp(1544708405, 836000000) },
      hatenabookmark: { count: 51, timestamp: new firestore.Timestamp(1544708405, 836000000) },
    },
    prevCounts: {
      facebook: { count: 1, timestamp: new firestore.Timestamp(1544011993, 824000000) },
      hatenabookmark: { count: 51, timestamp: new firestore.Timestamp(1544337931, 636000000) },
    },
  },
  {
    title: 'サードパーティJavaScriptの最適化',
    url: 'https://user-first.ikyu.co.jp/entry/3rd-party-js',
    published: new firestore.Timestamp(1543849200, 0),
    counts: {
      facebook: { count: 13, timestamp: new firestore.Timestamp(1544708405, 836000000) },
      hatenabookmark: { count: 58, timestamp: new firestore.Timestamp(1544708405, 836000000) },
    },
    prevCounts: {
      facebook: { count: 9, timestamp: new firestore.Timestamp(1544011993, 824000000) },
      hatenabookmark: { count: 58, timestamp: new firestore.Timestamp(1544571040, 5000000) },
    },
  },
  {
    title: 'VueコンポーネントのState管理を考える',
    url: 'https://user-first.ikyu.co.jp/entry/design-of-vue-and-vuex',
    published: new firestore.Timestamp(1543762800, 0),
    counts: {
      facebook: { count: 1, timestamp: new firestore.Timestamp(1543976332, 44000000) },
      hatenabookmark: { count: 21, timestamp: new firestore.Timestamp(1544677061, 384000000) },
    },
    prevCounts: {
      facebook: { count: 1, timestamp: new firestore.Timestamp(1543976332, 44000000) },
      hatenabookmark: { count: 20, timestamp: new firestore.Timestamp(1543976332, 44000000) },
    },
  },
  {
    title: 'SVGスプライトアイコンの作り方・使い方',
    url: 'https://user-first.ikyu.co.jp/entry/svg-sprite',
    published: new firestore.Timestamp(1543676400, 0),
    counts: {
      facebook: { count: 2, timestamp: new firestore.Timestamp(1544003285, 901000000) },
      hatenabookmark: { count: 36, timestamp: new firestore.Timestamp(1544003285, 901000000) },
    },
    prevCounts: {
      facebook: { count: 2, timestamp: new firestore.Timestamp(1543999456, 649000000) },
      hatenabookmark: { count: 35, timestamp: new firestore.Timestamp(1543999456, 649000000) },
    },
  },
  {
    title: 'Chrome Dev Summit 2018に参加しました！',
    url: 'https://user-first.ikyu.co.jp/entry/chrome-dev-summit2018-report',
    published: new firestore.Timestamp(1543622400, 0),
    counts: {
      facebook: { count: 17, timestamp: new firestore.Timestamp(1544787295, 410000000) },
      hatenabookmark: { count: 47, timestamp: new firestore.Timestamp(1544787295, 410000000) },
    },
    prevCounts: {
      facebook: { count: 17, timestamp: new firestore.Timestamp(1544708405, 836000000) },
      hatenabookmark: { count: 46, timestamp: new firestore.Timestamp(1544708405, 836000000) },
    },
  },
  {
    title: 'イベント開催のお知らせ ~12/12(水) Ikyu Frontend Meetup~',
    url: 'https://user-first.ikyu.co.jp/entry/2018/11/27/131131',
    published: new firestore.Timestamp(1543291891, 0),
    counts: { hatenabookmark: { count: 13, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
    prevCounts: { hatenabookmark: { count: 13, timestamp: new firestore.Timestamp(1544775366, 395000000) } },
  },
  {
    title: 'インフラエンジニアからSREへ  ～クラウドとSaaS活用が変えるサービス運用のお仕事～',
    url: 'https://user-first.ikyu.co.jp/entry/2018/11/20/090827',
    published: new firestore.Timestamp(1542672507, 0),
    counts: {
      facebook: { count: 38, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 200, timestamp: new firestore.Timestamp(1544063130, 996000000) },
    },
    prevCounts: {
      facebook: { count: 38, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 199, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
  },
  {
    title: '一休.comレストランのスマートフォン検索ページがSPAになりました',
    url: 'https://user-first.ikyu.co.jp/entry/2018/10/09/080000',
    published: new firestore.Timestamp(1539039600, 0),
    counts: {
      facebook: { count: 67, timestamp: new firestore.Timestamp(1544708405, 836000000) },
      hatenabookmark: { count: 392, timestamp: new firestore.Timestamp(1544708405, 836000000) },
    },
    prevCounts: {
      facebook: { count: 66, timestamp: new firestore.Timestamp(1543988677, 594000000) },
      hatenabookmark: { count: 392, timestamp: new firestore.Timestamp(1544677061, 384000000) },
    },
  },
  {
    title: '一休.comスマホサイトのパフォーマンス改善（サーバサイドとQAとリリース編）',
    url: 'https://user-first.ikyu.co.jp/entry/2018/09/22/090000',
    published: new firestore.Timestamp(1537574400, 0),
    counts: {
      facebook: { count: 36, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 155, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
    prevCounts: {
      facebook: { count: 36, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 155, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
  },
  {
    title: '一休.comスマホサイトのパフォーマンス改善（CSS・その他細かいチューニング編）',
    url: 'https://user-first.ikyu.co.jp/entry/2018/09/21/090000',
    published: new firestore.Timestamp(1537488000, 0),
    counts: {
      facebook: { count: 5, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 53, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
    prevCounts: {
      facebook: { count: 5, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 53, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
  },
  {
    title: '一休.comスマホサイトのパフォーマンス改善（JavaScript編）',
    url: 'https://user-first.ikyu.co.jp/entry/2018/09/20/090000',
    published: new firestore.Timestamp(1537401600, 0),
    counts: {
      facebook: { count: 27, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 249, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
    prevCounts: {
      facebook: { count: 27, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 249, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
  },
  {
    title: '一休.comスマホサイトのパフォーマンス改善（概要編）',
    url: 'https://user-first.ikyu.co.jp/entry/2018/09/19/090000',
    published: new firestore.Timestamp(1537315200, 0),
    counts: {
      facebook: { count: 46, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 34, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
    prevCounts: {
      facebook: { count: 46, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 34, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
  },
  {
    title: 'エンジニア/デザイナー向けの会社紹介資料を公開しました',
    url: 'https://user-first.ikyu.co.jp/entry/2018/09/05/194427',
    published: new firestore.Timestamp(1536144267, 0),
    counts: {
      facebook: { count: 2, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 54, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
    prevCounts: {
      facebook: { count: 2, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 54, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
  },
  {
    title: '一休レストランPython移行の進捗',
    url: 'https://user-first.ikyu.co.jp/entry/restaurant2',
    published: new firestore.Timestamp(1534233324, 0),
    counts: {
      facebook: { count: 41, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 433, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
    prevCounts: {
      facebook: { count: 41, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 433, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
  },
  {
    title: '一休のSQL Server AWS移行事例（後編）',
    url: 'https://user-first.ikyu.co.jp/entry/sql-server-aws-2',
    published: new firestore.Timestamp(1532583460, 0),
    counts: {
      facebook: { count: 6, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 33, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
    prevCounts: {
      facebook: { count: 6, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 33, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
  },
  {
    title: '一休のSQL Server AWS移行事例（前編）',
    url: 'https://user-first.ikyu.co.jp/entry/sql-server-aws-1',
    published: new firestore.Timestamp(1532583289, 0),
    counts: {
      facebook: { count: 79, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 215, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
    prevCounts: {
      facebook: { count: 79, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 215, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
  },
  {
    title: ' imgix導入で画像最適化とサイトスピードを改善した話',
    url: 'https://user-first.ikyu.co.jp/entry/2018/07/02/070000',
    published: new firestore.Timestamp(1530482400, 0),
    counts: {
      facebook: { count: 5, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 74, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
    prevCounts: {
      facebook: { count: 5, timestamp: new firestore.Timestamp(1543650266, 679000000) },
      hatenabookmark: { count: 74, timestamp: new firestore.Timestamp(1543650266, 679000000) },
    },
  },
  {
    title: '一休のETL処理をAirflowで再構築しました',
    url: 'https://user-first.ikyu.co.jp/entry/2018/06/25/115452',
    published: new firestore.Timestamp(1529895292, 0),
    counts: { hatenabookmark: { count: 77, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
    prevCounts: { hatenabookmark: { count: 77, timestamp: new firestore.Timestamp(1544775366, 395000000) } },
  },
  {
    title: 'Send With Confidence Tour で一休.com の事例を話してきました',
    url: 'https://user-first.ikyu.co.jp/entry/2018/06/06/142759',
    published: new firestore.Timestamp(1528262879, 0),
    counts: { hatenabookmark: { count: 20, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
    prevCounts: { hatenabookmark: { count: 20, timestamp: new firestore.Timestamp(1544775366, 395000000) } },
  },
  {
    title: 'Renovateによるnpmパッケージ定期更新',
    url: 'https://user-first.ikyu.co.jp/entry/2018/05/07/193755',
    published: new firestore.Timestamp(1525689475, 0),
    counts: { hatenabookmark: { count: 13, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
    prevCounts: { hatenabookmark: { count: 13, timestamp: new firestore.Timestamp(1544775366, 395000000) } },
  },
  {
    title: '一休レストランの事業領域を理解するのに役だった本3冊',
    url: 'https://user-first.ikyu.co.jp/entry/restaurant-books',
    published: new firestore.Timestamp(1517209844, 0),
    counts: { hatenabookmark: { count: 1, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
    prevCounts: { hatenabookmark: { count: 1, timestamp: new firestore.Timestamp(1544775366, 395000000) } },
  },
  {
    title: ' iOSとAndroidの段階的リリース機能を比較する',
    url: 'https://user-first.ikyu.co.jp/entry/ios-phased-releases',
    published: new firestore.Timestamp(1514183649, 0),
    counts: { hatenabookmark: { count: 19, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
    prevCounts: { hatenabookmark: { count: 19, timestamp: new firestore.Timestamp(1544775366, 395000000) } },
  },
  {
    title: '一休における開発組織の変遷（目的型組織への移行）',
    url: 'https://user-first.ikyu.co.jp/entry/2017/12/24/180309',
    published: new firestore.Timestamp(1514106189, 0),
    counts: {},
    prevCounts: {},
  },
  {
    title: '一休.comスマホ版予約入力画面リニューアルの舞台裏',
    url: 'https://user-first.ikyu.co.jp/entry/2017/12/23/100504',
    published: new firestore.Timestamp(1513991104, 0),
    counts: {},
    prevCounts: {},
  },
  {
    title: 'KMLを元にしたSolrの空間検索に挑戦',
    url: 'https://user-first.ikyu.co.jp/entry/solr-spatial-search',
    published: new firestore.Timestamp(1513929330, 0),
    counts: { hatenabookmark: { count: 40, timestamp: new firestore.Timestamp(1544677061, 384000000) } },
    prevCounts: { hatenabookmark: { count: 40, timestamp: new firestore.Timestamp(1544610394, 1000000) } },
  },
  {
    title: 'Dev旅のススメ。オフサイト・開発合宿におすすめな宿3選',
    url: 'https://user-first.ikyu.co.jp/entry/2017/12/21/185817',
    published: new firestore.Timestamp(1513850297, 0),
    counts: { hatenabookmark: { count: 1, timestamp: new firestore.Timestamp(1544484751, 511000000) } },
    prevCounts: { hatenabookmark: { count: 1, timestamp: new firestore.Timestamp(1544461020, 92000000) } },
  },
  {
    title: 'データ分析基盤、その後',
    url: 'https://user-first.ikyu.co.jp/entry/2017/12/21/011132',
    published: new firestore.Timestamp(1513786292, 0),
    counts: {},
    prevCounts: {},
  },
  {
    title: '一休.comレストラン アプリのローンチと2度のメジャーアップデートを通して、デザイナーとして学んだこと',
    url: 'https://user-first.ikyu.co.jp/entry/2017/12/18/153721',
    published: new firestore.Timestamp(1513579041, 0),
    counts: { hatenabookmark: { count: 2, timestamp: new firestore.Timestamp(1544269095, 234000000) } },
    prevCounts: { hatenabookmark: { count: 2, timestamp: new firestore.Timestamp(1544232856, 142000000) } },
  },
  {
    title: 'あえてテクニカルなコーディングをしないという選択肢',
    url: 'https://user-first.ikyu.co.jp/entry/2017/12/17/080000',
    published: new firestore.Timestamp(1513465200, 0),
    counts: {},
    prevCounts: {},
  },
  {
    title: 'レストランアプリのアイコンをクリスマス仕様にした話',
    url: 'https://user-first.ikyu.co.jp/entry/2017/12/15/152515',
    published: new firestore.Timestamp(1513319115, 0),
    counts: {},
    prevCounts: {},
  },
  {
    title: 'データの民主化とオープンソースソフトウェアと SQL Server',
    url: 'https://user-first.ikyu.co.jp/entry/2017/12/14/101956',
    published: new firestore.Timestamp(1513214396, 0),
    counts: { hatenabookmark: { count: 7, timestamp: new firestore.Timestamp(1543930239, 743000000) } },
    prevCounts: { hatenabookmark: { count: 7, timestamp: new firestore.Timestamp(1543927321, 803000000) } },
  },
  {
    title: 'データエンジニアとデータの民主化 〜脱・神 Excel 〜',
    url: 'https://user-first.ikyu.co.jp/entry/2017/12/13/101559',
    published: new firestore.Timestamp(1513127759, 0),
    counts: { hatenabookmark: { count: 65, timestamp: new firestore.Timestamp(1543845056, 170000000) } },
    prevCounts: { hatenabookmark: { count: 65, timestamp: new firestore.Timestamp(1543842599, 829000000) } },
  },
  {
    title: '一休.com で 1 年半の間に取り組んできた改善内容について',
    url: 'https://user-first.ikyu.co.jp/entry/2017/12/08/110000',
    published: new firestore.Timestamp(1512698400, 0),
    counts: { hatenabookmark: { count: 302, timestamp: new firestore.Timestamp(1543739399, 950000000) } },
    prevCounts: { hatenabookmark: { count: 302, timestamp: new firestore.Timestamp(1543734794, 674000000) } },
  },
  {
    title: 'GoとSQL Server',
    url: 'https://user-first.ikyu.co.jp/entry/2017/12/07/180000',
    published: new firestore.Timestamp(1512637200, 0),
    counts: { hatenabookmark: { count: 3, timestamp: new firestore.Timestamp(1543674764, 870000000) } },
    prevCounts: { hatenabookmark: { count: 3, timestamp: new firestore.Timestamp(1543668510, 590000000) } },
  },
];

const feedItemResponse: ItemResponse[] = [
  {
    title: 'Ikyu Frontend Meetupを開催しました',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/14/154352',
    published: new Date('2018-12-14T06:43:52.000Z'),
  },
  {
    title: '一休レストランの店舗ページをSPA化して Fastly で段階的リリースした話',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/13/143157',
    published: new Date('2018-12-13T05:31:57.000Z'),
  },
  {
    title: '一休のUI/UXデザイナーとして私がやっている4つのこと',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/11/100824',
    published: new Date('2018-12-11T01:08:24.000Z'),
  },
  {
    title: 'Storybook を自作して「フロントエンドビルドが遅い問題」に立ち向かう',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/10/160505',
    published: new Date('2018-12-10T07:05:05.000Z'),
  },
  {
    title: 'Rundeck in practice [運用編]',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/09/105004',
    published: new Date('2018-12-09T01:50:04.000Z'),
  },
  {
    title: 'ネット断食におすすめ！日帰り温泉・サウナも楽しめるSPA15選',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/07/115000',
    published: new Date('2018-12-07T02:50:00.000Z'),
  },
  {
    title: 'Rundeck in practice [導入編] ',
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/06/084442',
    published: new Date('2018-12-05T23:44:42.000Z'),
  },
  {
    title: 'Amazon Connect の導入と自社システムを連携した話',
    url: 'https://user-first.ikyu.co.jp/entry/amazon-connect',
    published: new Date('2018-12-04T15:00:00.000Z'),
  },
  {
    title: 'サードパーティJavaScriptの最適化',
    url: 'https://user-first.ikyu.co.jp/entry/3rd-party-js',
    published: new Date('2018-12-03T15:00:00.000Z'),
  },
  {
    title: 'VueコンポーネントのState管理を考える',
    url: 'https://user-first.ikyu.co.jp/entry/design-of-vue-and-vuex',
    published: new Date('2018-12-02T15:00:00.000Z'),
  },
  {
    title: 'SVGスプライトアイコンの作り方・使い方',
    url: 'https://user-first.ikyu.co.jp/entry/svg-sprite',
    published: new Date('2018-12-01T15:00:00.000Z'),
  },
  {
    title: 'Chrome Dev Summit 2018に参加しました！',
    url: 'https://user-first.ikyu.co.jp/entry/chrome-dev-summit2018-report',
    published: new Date('2018-12-01T00:00:00.000Z'),
  },
  {
    title: 'イベント開催のお知らせ ~12/12(水) Ikyu Frontend Meetup~',
    url: 'https://user-first.ikyu.co.jp/entry/2018/11/27/131131',
    published: new Date('2018-11-27T04:11:31.000Z'),
  },
  {
    title: 'インフラエンジニアからSREへ  ～クラウドとSaaS活用が変えるサービス運用のお仕事～',
    url: 'https://user-first.ikyu.co.jp/entry/2018/11/20/090827',
    published: new Date('2018-11-20T00:08:27.000Z'),
  },
  {
    title: '一休.comレストランのスマートフォン検索ページがSPAになりました',
    url: 'https://user-first.ikyu.co.jp/entry/2018/10/09/080000',
    published: new Date('2018-10-08T23:00:00.000Z'),
  },
  {
    title: '一休.comスマホサイトのパフォーマンス改善（サーバサイドとQAとリリース編）',
    url: 'https://user-first.ikyu.co.jp/entry/2018/09/22/090000',
    published: new Date('2018-09-22T00:00:00.000Z'),
  },
  {
    title: '一休.comスマホサイトのパフォーマンス改善（CSS・その他細かいチューニング編）',
    url: 'https://user-first.ikyu.co.jp/entry/2018/09/21/090000',
    published: new Date('2018-09-21T00:00:00.000Z'),
  },
  {
    title: '一休.comスマホサイトのパフォーマンス改善（JavaScript編）',
    url: 'https://user-first.ikyu.co.jp/entry/2018/09/20/090000',
    published: new Date('2018-09-20T00:00:00.000Z'),
  },
  {
    title: '一休.comスマホサイトのパフォーマンス改善（概要編）',
    url: 'https://user-first.ikyu.co.jp/entry/2018/09/19/090000',
    published: new Date('2018-09-19T00:00:00.000Z'),
  },
  {
    title: 'エンジニア/デザイナー向けの会社紹介資料を公開しました',
    url: 'https://user-first.ikyu.co.jp/entry/2018/09/05/194427',
    published: new Date('2018-09-05T10:44:27.000Z'),
  },
  {
    title: '一休レストランPython移行の進捗',
    url: 'https://user-first.ikyu.co.jp/entry/restaurant2',
    published: new Date('2018-08-14T07:55:24.000Z'),
  },
  {
    title: '一休のSQL Server AWS移行事例（後編）',
    url: 'https://user-first.ikyu.co.jp/entry/sql-server-aws-2',
    published: new Date('2018-07-26T05:37:40.000Z'),
  },
  {
    title: '一休のSQL Server AWS移行事例（前編）',
    url: 'https://user-first.ikyu.co.jp/entry/sql-server-aws-1',
    published: new Date('2018-07-26T05:34:49.000Z'),
  },
  {
    title: ' imgix導入で画像最適化とサイトスピードを改善した話',
    url: 'https://user-first.ikyu.co.jp/entry/2018/07/02/070000',
    published: new Date('2018-07-01T22:00:00.000Z'),
  },
  {
    title: '一休のETL処理をAirflowで再構築しました',
    url: 'https://user-first.ikyu.co.jp/entry/2018/06/25/115452',
    published: new Date('2018-06-25T02:54:52.000Z'),
  },
  {
    title: 'Send With Confidence Tour で一休.com の事例を話してきました',
    url: 'https://user-first.ikyu.co.jp/entry/2018/06/06/142759',
    published: new Date('2018-06-06T05:27:59.000Z'),
  },
  {
    title: 'Renovateによるnpmパッケージ定期更新',
    url: 'https://user-first.ikyu.co.jp/entry/2018/05/07/193755',
    published: new Date('2018-05-07T10:37:55.000Z'),
  },
  {
    title: '一休レストランの事業領域を理解するのに役だった本3冊',
    url: 'https://user-first.ikyu.co.jp/entry/restaurant-books',
    published: new Date('2018-01-29T07:10:44.000Z'),
  },
  {
    title: ' iOSとAndroidの段階的リリース機能を比較する',
    url: 'https://user-first.ikyu.co.jp/entry/ios-phased-releases',
    published: new Date('2017-12-25T06:34:09.000Z'),
  },
  {
    title: '一休における開発組織の変遷（目的型組織への移行）',
    url: 'https://user-first.ikyu.co.jp/entry/2017/12/24/180309',
    published: new Date('2017-12-24T09:03:09.000Z'),
  },
];

const countsReponse: CountResponse[] = [
  { url: 'https://user-first.ikyu.co.jp/entry/2017/12/24/180309', count: 0, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/05/07/193755', count: 13, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/06/06/142759', count: 20, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/06/25/115452', count: 77, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/07/02/070000', count: 74, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/09/05/194427', count: 54, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/09/19/090000', count: 34, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/09/20/090000', count: 249, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/09/21/090000', count: 53, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/09/22/090000', count: 155, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/10/09/080000', count: 392, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/11/20/090827', count: 200, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/11/27/131131', count: 13, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/06/084442', count: 4, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/07/115000', count: 24, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/09/105004', count: 1, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/10/160505', count: 19, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/11/100824', count: 0, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/13/143157', count: 27, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/14/154352', count: 18, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/3rd-party-js', count: 58, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/amazon-connect', count: 51, type: 'hatenabookmark' as CountType },
  {
    url: 'https://user-first.ikyu.co.jp/entry/chrome-dev-summit2018-report',
    count: 47,
    type: 'hatenabookmark' as CountType,
  },
  { url: 'https://user-first.ikyu.co.jp/entry/design-of-vue-and-vuex', count: 21, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/ios-phased-releases', count: 19, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/restaurant-books', count: 1, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/restaurant2', count: 433, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/sql-server-aws-1', count: 215, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/sql-server-aws-2', count: 33, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/svg-sprite', count: 36, type: 'hatenabookmark' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/14/154352', count: 4, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/13/143157', count: 26, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/11/100824', count: 7, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/10/160505', count: 1, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/09/105004', count: 0, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/07/115000', count: 17, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/12/06/084442', count: 0, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/amazon-connect', count: 42, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/3rd-party-js', count: 13, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/design-of-vue-and-vuex', count: 1, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/svg-sprite', count: 2, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/chrome-dev-summit2018-report', count: 17, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/11/27/131131', count: 0, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/11/20/090827', count: 38, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/10/09/080000', count: 67, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/09/22/090000', count: 36, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/09/21/090000', count: 5, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/09/20/090000', count: 27, type: 'facebook' as CountType },
  { url: 'https://user-first.ikyu.co.jp/entry/2018/09/19/090000', count: 46, type: 'facebook' as CountType },
];

const result = [
  {
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/11/100824',
    title: '一休のUI/UXデザイナーとして私がやっている4つのこと',
    published: new Date('2018-12-11T01:08:24.000Z'),
    itemCounts: { facebook: { count: 7, timestamp: { _methodName: 'FieldValue.serverTimestamp' } } },
    prevCounts: { facebook: { count: 7, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
  },
  {
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/09/105004',
    title: 'Rundeck in practice [運用編]',
    published: new Date('2018-12-09T01:50:04.000Z'),
    itemCounts: { hatenabookmark: { count: 1, timestamp: { _methodName: 'FieldValue.serverTimestamp' } } },
    prevCounts: { hatenabookmark: { count: 1, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
  },
  {
    url: 'https://user-first.ikyu.co.jp/entry/2018/12/06/084442',
    title: 'Rundeck in practice [導入編] ',
    published: new Date('2018-12-05T23:44:42.000Z'),
    itemCounts: { hatenabookmark: { count: 4, timestamp: { _methodName: 'FieldValue.serverTimestamp' } } },
    prevCounts: { hatenabookmark: { count: 4, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
  },
  {
    url: 'https://user-first.ikyu.co.jp/entry/2018/11/27/131131',
    title: 'イベント開催のお知らせ ~12/12(水) Ikyu Frontend Meetup~',
    published: new Date('2018-11-27T04:11:31.000Z'),
    itemCounts: { hatenabookmark: { count: 13, timestamp: { _methodName: 'FieldValue.serverTimestamp' } } },
    prevCounts: { hatenabookmark: { count: 13, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
  },
  {
    url: 'https://user-first.ikyu.co.jp/entry/2018/06/25/115452',
    title: '一休のETL処理をAirflowで再構築しました',
    published: new Date('2018-06-25T02:54:52.000Z'),
    itemCounts: { hatenabookmark: { count: 77, timestamp: { _methodName: 'FieldValue.serverTimestamp' } } },
    prevCounts: { hatenabookmark: { count: 77, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
  },
  {
    url: 'https://user-first.ikyu.co.jp/entry/2018/06/06/142759',
    title: 'Send With Confidence Tour で一休.com の事例を話してきました',
    published: new Date('2018-06-06T05:27:59.000Z'),
    itemCounts: { hatenabookmark: { count: 20, timestamp: { _methodName: 'FieldValue.serverTimestamp' } } },
    prevCounts: { hatenabookmark: { count: 20, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
  },
  {
    url: 'https://user-first.ikyu.co.jp/entry/2018/05/07/193755',
    title: 'Renovateによるnpmパッケージ定期更新',
    published: new Date('2018-05-07T10:37:55.000Z'),
    itemCounts: { hatenabookmark: { count: 13, timestamp: { _methodName: 'FieldValue.serverTimestamp' } } },
    prevCounts: { hatenabookmark: { count: 13, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
  },
  {
    url: 'https://user-first.ikyu.co.jp/entry/restaurant-books',
    title: '一休レストランの事業領域を理解するのに役だった本3冊',
    published: new Date('2018-01-29T07:10:44.000Z'),
    itemCounts: { hatenabookmark: { count: 1, timestamp: { _methodName: 'FieldValue.serverTimestamp' } } },
    prevCounts: { hatenabookmark: { count: 1, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
  },
  {
    url: 'https://user-first.ikyu.co.jp/entry/ios-phased-releases',
    title: ' iOSとAndroidの段階的リリース機能を比較する',
    published: new Date('2017-12-25T06:34:09.000Z'),
    itemCounts: { hatenabookmark: { count: 19, timestamp: { _methodName: 'FieldValue.serverTimestamp' } } },
    prevCounts: { hatenabookmark: { count: 19, timestamp: new firestore.Timestamp(1544787974, 176000000) } },
  },
  {
    url: 'https://user-first.ikyu.co.jp/entry/2017/12/24/180309',
    title: '一休における開発組織の変遷（目的型組織への移行）',
    published: new Date('2017-12-24T09:03:09.000Z'),
    itemCounts: {},
    prevCounts: {},
  },
];

describe('create save entities', () => {
  it('equeal', () => {
    expect(createSaveEntities(firebaseEntities, feedItemResponse, countsReponse)).toEqual(result);
  });
});
