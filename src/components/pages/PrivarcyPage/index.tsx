import React from 'react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import Anker from '../../atoms/Anker/index';
import ScrollView from '../../atoms/ScrollView/index';
import Wrapper from '../../atoms/Wrapper/index';
import * as properties from '../../properties';
import PageLayout from '../../templates/PageLayout/index';

const PrivacyPage: React.FunctionComponent<RouteComponentProps> = () => (
  <PageLayout header={{ title: 'プライバシーポリシー' }}>
    <StyledScrollView>
      <ContentWrapper>
        <Paragraph>
          @ninjinkun (<Anker href="https://twitter.com/ninjinkun">https://twitter.com/ninjinkun</Anker>)
          （以下「サービス提供者」といいます。）は、サービス提供者の提供するサービス（以下「本サービス」といいます。）における、ユーザーについての個人情報を含む利用者情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。
        </Paragraph>

        <Title>1.収集する利用者情報及び収集方法</Title>
        <Paragraph>
          本ポリシーにおいて、「利用者情報」とは、ユーザーの識別に係る情報、通信サービス上の行動履歴、その他ユーザーのスマートフォン、PC等の端末においてユーザーまたはユーザーの端末に関連して生成または蓄積された情報であって、本ポリシーに基づきサービス提供者が収集するものを意味するものとします。
        </Paragraph>
        <Paragraph>
          本サービスにおいてサービス提供者が収集する利用者情報は、その収集方法に応じて、以下のようなものとなります。
          <OrderedList>
            　
            <DecimalList>
              ユーザーが本サービスの利用において、他のサービスと連携を許可することにより、当該他のサービスからご提供いただく情報
              <Paragraph>
                ユーザーが、本サービスを利用するにあたり、ソーシャルネットワークサービス等の外部サービスとの連携を許可した場合には、その許可の際にご同意いただいた内容に基づき、以下の情報を当該外部サービスから収集します。
                <UnorderedList>
                  <List>当該外部サービスでユーザーが利用するID</List>
                  <List>当該外部サービスでユーザーが利用するメールアドレス</List>
                  <List>その他当該外部サービスのプライバシー設定によりユーザーが連携先に開示を認めた情報</List>
                </UnorderedList>
              </Paragraph>
            </DecimalList>
            <DecimalList>
              ユーザーが本サービスを利用するにあたって、サービス提供者が収集する情報
              <Paragraph>
                サービス提供者は、本サービスへのアクセス状況やそのご利用方法に関する情報を収集することがあります。これには以下の情報が含まれます。
                <UnorderedList>
                  <List>ログ情報</List>
                  <List>Cookie及び匿名ID</List>
                </UnorderedList>
              </Paragraph>
            </DecimalList>
          </OrderedList>
        </Paragraph>

        <Title>2.利用目的</Title>
        <OrderedList>
          <DecimalList>
            利用者情報は、2-2に定めるとおり本サービスの提供のために利用されるほか、2-3に定めるとおり、その他の目的にも利用される場合があります。
          </DecimalList>
          <DecimalList>
            本サービスのサービス提供にかかわる利用者情報の具体的な利用目的は以下のとおりです。
            <OrderedList>
              　
              <RomanList>
                本サービスに関する登録の受付、本人確認、利用料金の計算等本サービスの提供、維持、保護及び改善のため
              </RomanList>
              　<RomanList>本サービスに関するご案内、お問い合せ等への対応のため</RomanList>
              <RomanList>
                本サービスに関するサービス提供者の規約、ポリシー等（以下「規約等」といいます。）に違反する行為に対する対応のため
              </RomanList>
              　<RomanList>本サービスに関する規約等の変更などを通知するため</RomanList>　
              <RomanList>上記の利用目的に付随する利用目的のため</RomanList>
            </OrderedList>
          </DecimalList>
          <DecimalList>
            上記2-2以外の利用目的は以下のとおりです。
            <Paragraph>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>利用目的</TableHeader>
                    <TableHeader>対応する利用者情報の項目</TableHeader>
                  </tr>
                </thead>
                <tr>
                  <TableData>
                    サービス提供者のサービスに関連して、個人を識別できない形式に加工した統計データを作成するため
                  </TableData>
                  <TableData>
                    <UnorderedList>
                      <List>ログ情報</List>
                      <List>Cookie及び匿名ID</List>
                    </UnorderedList>
                  </TableData>
                </tr>
              </Table>
            </Paragraph>
          </DecimalList>
        </OrderedList>

        <Title>3.利用中止要請の方法</Title>
        <Paragraph>
          ユーザーは、本サービスの所定の設定を行うことにより、利用者情報の全部または一部についてその利用の停止を求めることができ、この場合、サービス提供者は速やかに、サービス提供者の定めるところに従い、その利用を停止します。なお利用者情報の項目によっては、その収集または利用が本サービスの前提となるため、サービス提供者所定の方法により本サービスを退会した場合に限り、サービス提供者はその収集を停止します。
        </Paragraph>

        <Title>4.外部送信、第三者提供、情報収集モジュールの有無</Title>
        <Paragraph>
          サービス品質向上の目的で利用者情報を分析するため、本サービスには以下の情報収集モジュールが組み込まれています。これに伴い、以下のとおり情報収集モジュール提供者への利用者情報の提供を行います。
        </Paragraph>
        <Paragraph>
          <Table>
            <tr>
              <TableData>情報収集モジュールの名称</TableData>
              <TableData>Google Analytics</TableData>
            </tr>
            <tr>
              <TableData>情報収集モジュールの提供者</TableData>
              <TableData>Google Inc.</TableData>
            </tr>
            <tr>
              <TableData>提供される利用者情報の項目</TableData>
              <TableData>
                以下の情報がユーザー個人が特定されない統計データとして送信されます。
                <UnorderedList>
                  <List>本サービスのご利用状況（本サービス訪問回数、滞在時間、閲覧ページ数、画面遷移等）</List>
                  <List>
                    ご利用端末・ブラウザの情報（端末の設定言語、地域、機種名、OS、ブラウザバージョン、プロバイダ等
                  </List>
                </UnorderedList>
              </TableData>
            </tr>
            <tr>
              <TableData>提供の手段・方法</TableData>
              <TableData>GoogleAnalyticsモジュール</TableData>
            </tr>
            <tr>
              <TableData>上記提供者における利用目的</TableData>
              <TableData>
                サービス品質向上のために役立つ情報を記憶し、本サービスを最適な状態で利用していただく目的のみで使用します。
              </TableData>
            </tr>
            <tr>
              <TableData>上記提供者における第三者提供の有無</TableData>
              <TableData>Google Analyticsのプライバシーポリシーに従います。</TableData>
            </tr>
            <tr>
              <TableData>提供の無効化 (オプトアウト)</TableData>
              <TableData>
                デスクトップ向けブラウザをご利用の場合はGoogleが提供するオプトアプトアウドオン (
                <Anker href="https://tools.google.com/dlpage/gaoptout">https://tools.google.com/dlpage/gaoptout</Anker>)
                を導入する事で無効化が可能です。
              </TableData>
            </tr>
            <tr>
              <TableData>上記提供者のプライバシーポリシーのURL</TableData>
              <TableData>
                <Anker href="https://policies.google.com/privacy?hl=ja">
                  https://policies.google.com/privacy?hl=ja
                </Anker>
              </TableData>
            </tr>
          </Table>
        </Paragraph>

        <Title>5.第三者提供</Title>
        <Paragraph>
          サービス提供者は、利用者情報のうち、個人情報については、個人情報保護法その他の法令に基づき開示が認められる場合を除くほか、あらかじめユーザーの同意を得ないで、第三者に提供しません。但し、次に掲げる場合はこの限りではありません。
        </Paragraph>
        <OrderedList>
          <DecimalList>
            サービス提供者が利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合
          </DecimalList>
          <DecimalList>合併その他の事由による事業の承継に伴って個人情報が提供される場合</DecimalList>
          <DecimalList>第4項の定めに従って、情報収集モジュール提供者へ個人情報が提供される場合</DecimalList>
          <DecimalList>
            国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、ユーザーの同意を得ることによって当該事務の遂行に支障を及ぼすおそれがある場合
          </DecimalList>
          <DecimalList>その他、個人情報保護法その他の法令で認められる場合</DecimalList>
        </OrderedList>

        <Title>6.共同利用</Title>
        <Paragraph>サービス提供者は、以下のとおりユーザーの個人情報を共同利用します。</Paragraph>
        <OrderedList>
          <DecimalList>共同して利用される個人情報の項目 </DecimalList>
          <DecimalList>共同して利用する者の範囲</DecimalList>
          <DecimalList>共同して利用する者の利用目的 </DecimalList>
          <DecimalList>利用者情報の管理について責任を有する者の氏名または名称 </DecimalList>
        </OrderedList>

        <Title>7.個人情報の開示</Title>
        <Paragraph>
          サービス提供者は、ユーザーから、個人情報保護法の定めに基づき個人情報の開示を求められたときは、ユーザーご本人からのご請求であることを確認の上で、ユーザーに対し、遅滞なく開示を行います（当該個人情報が存在しないときにはその旨を通知いたします）。但し、個人情報保護法その他の法令により、サービス提供者が開示の義務を負わない場合は、この限りではありません。なお、個人情報の開示につきましては、手数料（1件あたり1,000円）を頂戴しておりますので、あらかじめ御了承ください。
        </Paragraph>

        <Title>8.個人情報の訂正及び利用停止等</Title>
        <OrderedList>
          <DecimalList>
            サービス提供者は、ユーザーから、⑴個人情報が真実でないという理由によって個人情報保護法の定めに基づきその内容の訂正を求められた場合、及び⑵あらかじめ公表された利用目的の範囲を超えて取り扱われているという理由または偽りその他不正の手段により収集されたものであるという理由により、個人情報保護法の定めに基づきその利用の停止を求められた場合には、ユーザーご本人からのご請求であることを確認の上で遅滞なく必要な調査を行い、その結果に基づき、個人情報の内容の訂正または利用停止を行い、その旨をユーザーに通知します。なお、合理的な理由に基づいて訂正または利用停止を行わない旨の決定をしたときは、ユーザーに対しその旨を通知いたします。
          </DecimalList>
          <DecimalList>
            サービス提供者は、ユーザーから、ユーザーの個人情報について消去を求められた場合、サービス提供者が当該請求に応じる必要があると判断した場合は、ユーザーご本人からのご請求であることを確認の上で、個人情報の消去を行い、その旨をユーザーに通知します。
          </DecimalList>
          <DecimalList>
            個人情報保護法その他の法令により、サービス提供者が訂正等または利用停止等の義務を負わない場合は、前2項の規定は適用されません。
          </DecimalList>
        </OrderedList>

        <Title>9.お問い合わせ窓口</Title>
        <Paragraph>
          ご意見、ご質問、苦情のお申出その他利用者情報の取扱いに関するお問い合わせは、下記の窓口までお願い致します。
        </Paragraph>
        <UnorderedList>
          <List>
            mail: <Anker href="mail:ninjinkun+feedback@gmail.com">ninjinkun+feedback@gmail.com</Anker>
          </List>
        </UnorderedList>

        <Title>10.プライバシーポリシーの変更手続</Title>
        <Paragraph>
          サービス提供者は、利用者情報の取扱いに関する運用状況を適宜見直し、継続的な改善に努めるものとし、必要に応じて、本ポリシーを変更することがあります。変更した場合には、本サイトに掲示する方法でユーザーに通知いたします。但し、法令上ユーザーの同意が必要となるような内容の変更の場合は、サービス提供者所定の方法でユーザーの同意を得るものとします。
        </Paragraph>
      </ContentWrapper>
    </StyledScrollView>
  </PageLayout>
);

export default PrivacyPage;

const StyledScrollView = styled(ScrollView)`
  background-color: white;
  min-height: 100%;
`;

const ContentWrapper = styled(Wrapper)`
  padding: 16px;
  line-height: 1.14em;
`;

const Title = styled.h2`
  font-size: ${properties.fontSizes.l};
`;

const Paragraph = styled.p`
  font-size: ${properties.fontSizes.s};
`;

const UnorderedList = styled.ul`
  padding-inline-start: 1.5em;
  margin: 0;
`;

const OrderedList = styled.ol`
  padding-inline-start: 1.5em;
  margin: 0;
`;

const List = styled.li`
  font-size: ${properties.fontSizes.s};
  margin: 0.5em 0;
`;

const DecimalList = styled(List)`
  list-style-type: decimal;
`;

const RomanList = styled(List)`
  list-style-type: lower-roman;
`;

const Table = styled.table`
  border: ${properties.border};
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border: ${properties.border};
  padding: 0.5em;
`;

const TableData = styled.td`
  border: ${properties.border};
  padding: 0.5em;
`;
