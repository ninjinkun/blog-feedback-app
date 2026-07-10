import React from 'react';
import styled from 'styled-components';
import Anker from '../../atoms/Anker/index';
import ScrollView from '../../atoms/ScrollView/index';
import Wrapper from '../../atoms/Wrapper/index';
import * as properties from '../../properties';
import PageLayout from '../../templates/PageLayout/index';

const TermPage: React.FunctionComponent = () => (
  <PageLayout header={{ title: 'サービス利用規約' }}>
    <StyledScrollView>
      <ContentWrapper>
        <Paragraph>
          本利用規約（以下「本規約」と言います。）には、本サービスの提供条件及びサービス提供者と登録ユーザーの皆様との間の権利義務関係が定められています。本サービスの利用に際しては、本規約の全文をお読みいただいたうえで、本規約に同意いただく必要があります。
        </Paragraph>
        <Title>第1条（適用）</Title>
        <OrderedList>
          <DecimalList>
            本規約は、本サービスの提供条件及び本サービスの利用に関するサービス提供者と登録ユーザーとの間の権利義務関係を定めることを目的とし、登録ユーザーとサービス提供者との間の本サービスの利用に関わる一切の関係に適用されます。
          </DecimalList>
          <DecimalList>
            本規約の内容と、前項のルールその他の本規約外における本サービスの説明等とが異なる場合は、本規約の規定が優先して適用されるものとします。
          </DecimalList>
        </OrderedList>

        <Title>第2条（定義）</Title>
        <Paragraph>本規約において使用する以下の用語は、各々以下に定める意味を有するものとします。</Paragraph>
        <OrderedList>
          <DecimalList>
            「サービス利用契約」とは、本規約及びサービス提供者と登録ユーザーの間で締結する、本サービスの利用契約を意味します。
          </DecimalList>
          <DecimalList>
            「知的財産権」とは、著作権、特許権、実用新案権、意匠権、商標権その他の知的財産権（それらの権利を取得し、またはそれらの権利につき登録等を出願する権利を含みます。）を意味します。
          </DecimalList>
          <DecimalList>
            「投稿データ」とは、登録ユーザーが本サービスを利用して投稿その他送信するコンテンツ（文章、画像、動画その他のデータを含みますがこれらに限りません。）を意味します。
          </DecimalList>
          <DecimalList>
            「サービス提供者」とは、@ninjinkun (
            <Anker href="https://twitter.com/ninjinkun">https://twitter.com/ninjinkun</Anker>) を意味します。
          </DecimalList>
          <DecimalList>
            「サービス提供者ウェブサイト」とは、そのドメインが「
            <Anker href="https://blog-feedback.app">https://blog-feedback.app</Anker>
            」である、サービス提供者が運営するウェブサイト（理由の如何を問わず、サービス提供者のウェブサイトのドメインまたは内容が変更された場合は、当該変更後のウェブサイトを含みます。）を意味します。
          </DecimalList>
          <DecimalList>
            「登録ユーザー」とは、第3条（登録）に基づいて本サービスの利用者としての登録がなされた個人または法人を意味します。
          </DecimalList>
          <DecimalList>
            「本サービス」とは、サービス提供者が提供するBlogFeedbackという名称のサービス（理由の如何を問わずサービスの名称または内容が変更された場合は、当該変更後のサービスを含みます。）を意味します。
          </DecimalList>
        </OrderedList>

        <Title>第3条（登録）</Title>
        <OrderedList>
          <DecimalList>
            本サービスの利用を希望する者（以下「登録希望者」といいます。）は、本規約を遵守することに同意し、かつサービス提供者の定める一定の情報（以下「登録事項」といいます。）をサービス提供者の定める方法でサービス提供者に提供することにより、サービス提供者に対し、本サービスの利用の登録を申請することができます。
          </DecimalList>
          <DecimalList>
            サービス提供者は、サービス提供者の基準に従って、第１項に基づいて登録申請を行った登録希望者（以下「登録申請者」といいます。）の登録の可否を判断し、サービス提供者が登録を認める場合にはその旨を登録申請者に通知します。登録申請者の登録ユーザーとしての登録は、サービス提供者が本項の通知を行ったことをもって完了したものとします。
          </DecimalList>
          <DecimalList>
            前項に定める登録の完了時に、サービス利用契約が登録ユーザーとサービス提供者の間に成立し、登録ユーザーは本サービスを本規約に従い利用することができるようになります。
          </DecimalList>
          <DecimalList>
            サービス提供者は、登録申請者が、以下の各号のいずれかの事由に該当する場合は、登録及び再登録を拒否することがあり、またその理由について一切開示義務を負いません。
          </DecimalList>
          <OrderedList>
            <RomanList>
              サービス提供者に提供した登録事項の全部または一部につき虚偽、誤記または記載漏れがあった場合
            </RomanList>
            <RomanList>
              未成年者、成年被後見人、被保佐人または被補助人のいずれかであり、法定代理人、後見人、保佐人または補助人の同意等を得ていなかった場合
            </RomanList>
            <RomanList>
              反社会的勢力等（暴力団、暴力団員、右翼団体、反社会的勢力、その他これに準ずる者を意味します。以下同じ。）である、または資金提供その他を通じて反社会的勢力等の維持、運営もしくは経営に協力もしくは関与する等反社会的勢力等との何らかの交流もしくは関与を行っているとサービス提供者が判断した場合
            </RomanList>
            <RomanList>
              登録希望者が過去サービス提供者との契約に違反した者またはその関係者であるとサービス提供者が判断した場合
            </RomanList>
            <RomanList>第10条に定める措置を受けたことがある場合</RomanList>
            <RomanList>その他、サービス提供者が登録を適当でないと判断した場合</RomanList>
          </OrderedList>
        </OrderedList>

        <Title>第4条（登録事項の変更）</Title>
        <Paragraph>
          登録ユーザーは、登録事項に変更があった場合、サービス提供者の定める方法により当該変更事項を遅滞なくサービス提供者に通知するものとします。
        </Paragraph>

        <Title>第5条（パスワード及びユーザーIDの管理）</Title>
        <OrderedList>
          <DecimalList>
            登録ユーザーは、自己の責任において、本サービスに関するパスワード及びユーザーIDを適切に管理及び保管するものとし、これを第三者に利用させ、または貸与、譲渡、名義変更、売買等をしてはならないものとします。
          </DecimalList>
          <DecimalList>
            パスワードまたはユーザーIDの管理不十分、使用上の過誤、第三者の使用等によって生じた損害に関する責任は登録ユーザーが負うものとし、サービス提供者は一切の責任を負いません。
          </DecimalList>
        </OrderedList>

        <Title>第6条（禁止事項）</Title>
        <Paragraph>
          登録ユーザーは、本サービスの利用にあたり、以下の各号のいずれかに該当する行為または該当するとサービス提供者が判断する行為をしてはなりません。
        </Paragraph>
        <OrderedList>
          <DecimalList>法令に違反する行為または犯罪行為に関連する行為</DecimalList>
          <DecimalList>
            サービス提供者、本サービスの他の利用者またはその他の第三者に対する詐欺または脅迫行為
          </DecimalList>
          <DecimalList>公序良俗に反する行為</DecimalList>
          <DecimalList>
            サービス提供者、本サービスの他の利用者またはその他の第三者の知的財産権、肖像権、プライバシーの権利、名誉、その他の権利または利益を侵害する行為
          </DecimalList>
          <DecimalList>
            本サービスを通じ、以下に該当し、または該当するとサービス提供者が判断する情報をサービス提供者または本サービスの他の利用者に送信すること
          </DecimalList>
          <UnorderedList>
            <List>過度に暴力的または残虐な表現を含む情報</List>
            <List>コンピューター・ウィルスその他の有害なコンピューター・プログラムを含む情報</List>
            <List>
              サービス提供者、本サービスの他の利用者またはその他の第三者の名誉または信用を毀損する表現を含む情報
            </List>
            <List>過度にわいせつな表現を含む情報</List>
            <List>差別を助長する表現を含む情報</List>
            <List>自殺、自傷行為を助長する表現を含む情報</List>
            <List>薬物の不適切な利用を助長する表現を含む情報</List>
            <List>反社会的な表現を含む情報</List>
            <List>チェーンメール等の第三者への情報の拡散を求める情報</List>
            <List>他人に不快感を与える表現を含む情報</List>
            <List>面識のない異性との出会いを目的とした情報</List>
          </UnorderedList>
          <DecimalList>本サービスのネットワークまたはシステム等に過度な負荷をかける行為</DecimalList>
          <DecimalList>本サービスの運営を妨害するおそれのある行為</DecimalList>
          <DecimalList>
            サービス提供者のネットワークまたはシステム等に不正にアクセスし、または不正なアクセスを試みる行為
          </DecimalList>
          <DecimalList>第三者に成りすます行為</DecimalList>
          <DecimalList>本サービスの他の利用者のIDまたはパスワードを利用する行為</DecimalList>
          <DecimalList>サービス提供者が事前に許諾しない本サービス上での宣伝、広告、勧誘、または営業行為</DecimalList>
          <DecimalList>本サービスの他の利用者の情報の収集</DecimalList>
          <DecimalList>
            サービス提供者、本サービスの他の利用者またはその他の第三者に不利益、損害、不快感を与える行為
          </DecimalList>
          <DecimalList>反社会的勢力等への利益供与</DecimalList>
          <DecimalList>面識のない異性との出会いを目的とした行為</DecimalList>
          <DecimalList>前各号の行為を直接または間接に惹起し、または容易にする行為</DecimalList>
          <DecimalList>その他、サービス提供者が不適切と判断する行為</DecimalList>
        </OrderedList>

        <Title>第7条（本サービスの停止等）</Title>
        <OrderedList>
          <DecimalList>
            サービス提供者は、以下のいずれかに該当する場合には、登録ユーザーに事前に通知することなく、本サービスの全部または一部の提供を停止または中断することができるものとします。
          </DecimalList>
          <OrderedList>
            <RomanList>本サービスに係るコンピューター・システムの点検または保守作業を緊急に行う場合</RomanList>
            <RomanList>コンピューター、通信回線等が事故により停止した場合</RomanList>
            <RomanList>
              地震、落雷、火災、風水害、停電、天災地変などの不可抗力により本サービスの運営ができなくなった場合
            </RomanList>
            <RomanList>その他、サービス提供者が停止または中断を必要と判断した場合</RomanList>
          </OrderedList>
          <DecimalList>
            サービス提供者は、本条に基づきサービス提供者が行った措置に基づき登録ユーザーに生じた損害について一切の責任を負いません。
          </DecimalList>
        </OrderedList>

        <Title>第8条（権利帰属）</Title>
        <OrderedList>
          <DecimalList>
            サービス提供者ウェブサイト及び本サービスに関する知的財産権は全てサービス提供者またはサービス提供者にライセンスを許諾している者に帰属しており、本規約に基づく本サービスの利用許諾は、サービス提供者ウェブサイトまたは本サービスに関するサービス提供者またはサービス提供者にライセンスを許諾している者の知的財産権の使用許諾を意味するものではありません。
          </DecimalList>
          <DecimalList>
            登録ユーザーは、投稿データについて、自らが投稿その他送信することについての適法な権利を有していること、及び投稿データが第三者の権利を侵害していないことについて、サービス提供者に対し表明し、保証するものとします。
          </DecimalList>
          <DecimalList>
            登録ユーザーは、投稿データについて、サービス提供者に対し、世界的、非独占的、無償、サブライセンス可能かつ譲渡可能な使用、複製、配布、派生著作物の作成、表示及び実行に関するライセンスを付与します。また、他の登録ユーザーに対しても、本サービスを利用して登録ユーザーが投稿その他送信した投稿データの使用、複製、配布、派生著作物を作成、表示及び実行することについての非独占的なライセンスを付与します。
          </DecimalList>
          <DecimalList>
            登録ユーザーは、サービス提供者及びサービス提供者から権利を承継しまたは許諾された者に対して著作者人格権を行使しないことに同意するものとします。
          </DecimalList>
        </OrderedList>

        <Title>第9条（登録抹消等）</Title>
        <OrderedList>
          <DecimalList>
            サービス提供者は、登録ユーザーが、以下の各号のいずれかの事由に該当する場合は、事前に通知または催告することなく、投稿データを削除しもしくは当該登録ユーザーについて本サービスの利用を一時的に停止し、または登録ユーザーとしての登録を抹消、もしくはサービス利用契約を解除することができます。
          </DecimalList>
          <OrderedList>
            <RomanList>本規約のいずれかの条項に違反した場合</RomanList>
            <RomanList>登録事項に虚偽の事実があることが判明した場合</RomanList>
            <RomanList>
              支払停止もしくは支払不能となり、または破産手続開始、民事再生手続開始、会社更生手続開始、特別清算開始もしくはこれらに類する手続の開始の申立てがあった場合
            </RomanList>
            <RomanList>6ヶ月以上本サービスの利用がない場合</RomanList>
            <RomanList>
              サービス提供者からの問いあわせその他の回答を求める連絡に対して30日間以上応答がない場合
            </RomanList>
            <RomanList>第3条第4項各号に該当する場合</RomanList>
            <RomanList>
              その他、サービス提供者が本サービスの利用、登録ユーザーとしての登録、またはサービス利用契約の継続を適当でないと判断した場合
            </RomanList>
          </OrderedList>
          <DecimalList>
            2.
            前項各号のいずれかの事由に該当した場合、登録ユーザーは、サービス提供者に対して負っている債務の一切について当然に期限の利益を失い、直ちにサービス提供者に対して全ての債務の支払を行わなければなりません。
          </DecimalList>
          <DecimalList>
            3.
            サービス提供者は、本条に基づきサービス提供者が行った行為により登録ユーザーに生じた損害について一切の責任を負いません。
          </DecimalList>
        </OrderedList>

        <Title>第10条（退会）</Title>
        <OrderedList>
          <DecimalList>
            登録ユーザーは、サービス提供者所定の方法でサービス提供者に通知することにより、本サービスから退会し、自己の登録ユーザーとしての登録を抹消することができます。
          </DecimalList>
          <DecimalList>
            退会にあたり、サービス提供者に対して負っている債務が有る場合は、登録ユーザーは、サービス提供者に対して負っている債務の一切について当然に期限の利益を失い、直ちにサービス提供者に対して全ての債務の支払を行わなければなりません。
          </DecimalList>
          <DecimalList>退会後の利用者情報の取扱いについては、第15条の規定に従うものとします。</DecimalList>
        </OrderedList>

        <Title>第11条（本サービスの内容の変更、終了）</Title>
        <OrderedList>
          <DecimalList>
            サービス提供者は、サービス提供者の都合により、本サービスの内容を変更し、または提供を終了することができます。サービス提供者が本サービスの提供を終了する場合、サービス提供者は登録ユーザーに事前に通知するものとします。
          </DecimalList>
          <DecimalList>
            サービス提供者は、本条に基づきサービス提供者が行った措置に基づき登録ユーザーに生じた損害について一切の責任を負いません。
          </DecimalList>
        </OrderedList>

        <Title>第12条（保証の否認及び免責）</Title>
        <OrderedList>
          <DecimalList>
            サービス提供者は、本サービスが登録ユーザーの特定の目的に適合すること、期待する機能・商品的価値・正確性・有用性を有すること、登録ユーザーによる本サービスの利用が登録ユーザーに適用のある法令または業界団体の内部規則等に適合すること、及び不具合が生じないことについて、何ら保証するものではありません。
          </DecimalList>
          <DecimalList>
            サービス提供者は、サービス提供者による本サービスの提供の中断、停止、終了、利用不能または変更、登録ユーザーが本サービスに送信したメッセージまたは情報の削除または消失、登録ユーザーの登録の抹消、本サービスの利用による登録データの消失または機器の故障もしくは損傷、その他本サービスに関して登録ユーザーが被った損害（以下「ユーザー損害」といいます。）につき、賠償する責任を一切負わないものとします。
          </DecimalList>
          <DecimalList>
            何らかの理由によりサービス提供者が責任を負う場合であっても、サービス提供者は、ユーザー損害につき、過去【12ヶ月】間に登録ユーザーがサービス提供者に支払った対価の金額を超えて賠償する責任を負わないものとし、また、付随的損害、間接損害、特別損害、将来の損害及び逸失利益にかかる損害については、賠償する責任を負わないものとします。
          </DecimalList>
          <DecimalList>
            本サービスまたはサービス提供者ウェブサイトに関連して登録ユーザーと他の登録ユーザーまたは第三者との間において生じた取引、連絡、紛争等については、サービス提供者は一切責任を負いません。
          </DecimalList>
        </OrderedList>
        <Title>第13条（秘密保持）</Title>
        <Paragraph>
          登録ユーザーは、本サービスに関連してサービス提供者が登録ユーザーに対して秘密に取り扱うことを求めて開示した非公知の情報について、サービス提供者の事前の書面による承諾がある場合を除き、秘密に取り扱うものとします。
        </Paragraph>

        <Title>第14条（利用者情報の取扱い）</Title>
        <OrderedList>
          <DecimalList>
            サービス提供者による登録ユーザーの利用者情報の取扱いについては、別途サービス提供者プライバシーポリシー（
            <Anker href="https://blog-feedback.app/privacy">https://blog-feedback.app/privacy</Anker>
            ）の定めによるものとし、登録ユーザーはこのプライバシーポリシーに従ってサービス提供者が登録ユーザーの利用者情報を取扱うことについて同意するものとします。
          </DecimalList>
          <DecimalList>
            サービス提供者は、登録ユーザーがサービス提供者に提供した情報、データ等を、個人を特定できない形での統計的な情報として、サービス提供者の裁量で、利用及び公開することができるものとし、登録ユーザーはこれに異議を唱えないものとします。
          </DecimalList>
        </OrderedList>

        <Title>第15条（本規約等の変更）</Title>
        <Paragraph>
          サービス提供者は、本規約を変更できるものとします。サービス提供者は、本規約を変更した場合には、登録ユーザーに当該変更内容を通知するものとし、当該変更内容の通知後、登録ユーザーが本サービスを利用した場合またはサービス提供者の定める期間内に登録抹消の手続をとらなかった場合には、登録ユーザーは、本規約の変更に同意したものとみなします。
        </Paragraph>

        <Title>第16条（連絡/通知）</Title>
        <Paragraph>
          本サービスに関する問い合わせその他登録ユーザーからサービス提供者に対する連絡または通知、及び本規約の変更に関する通知その他サービス提供者から登録ユーザーに対する連絡または通知は、サービス提供者の定める方法で行うものとします。
        </Paragraph>

        <Title>第17条（サービス利用契約上の地位の譲渡等）</Title>
        <OrderedList>
          <DecimalList>
            登録ユーザーは、サービス提供者の書面による事前の承諾なく、サービス利用契約上の地位または本規約に基づく権利もしくは義務につき、第三者に対し、譲渡、移転、担保設定、その他の処分をすることはできません。
          </DecimalList>
          <DecimalList>
            サービス提供者は本サービスにかかる事業を他社に譲渡した場合には、当該事業譲渡に伴いサービス利用契約上の地位、本規約に基づく権利及び義務並びに登録ユーザーの登録事項その他の顧客情報を当該事業譲渡の譲受人に譲渡することができるものとし、登録ユーザーは、かかる譲渡につき本項において予め同意したものとします。なお、本項に定める事業譲渡には、通常の事業譲渡のみならず、会社分割その他事業が移転するあらゆる場合を含むものとします。
          </DecimalList>
        </OrderedList>

        <Title>第18条（分離可能性）</Title>
        <Paragraph>
          本規約のいずれかの条項またはその一部が、消費者契約法その他の法令等により無効または執行不能と判断された場合であっても、本規約の残りの規定及び一部が無効または執行不能と判断された規定の残りの部分は、継続して完全に効力を有するものとします。
        </Paragraph>

        <Title>第19条（準拠法及び管轄裁判所）</Title>
        <OrderedList>
          <DecimalList>
            本規約及びサービス利用契約の準拠法は日本法とします。なお、本サービスにおいて物品の売買が発生する場合であっても、国際物品売買契約に関する国際連合条約の適用を排除することに合意します。
          </DecimalList>
          <DecimalList>
            本規約またはサービス利用契約に起因し、または関連する一切の紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
          </DecimalList>
        </OrderedList>
        <Paragraph>【2018年12月8日制定】</Paragraph>
      </ContentWrapper>
    </StyledScrollView>
  </PageLayout>
);

export default TermPage;

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
