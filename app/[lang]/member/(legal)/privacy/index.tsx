// https://mui.com/legal/privacy/
// https://vercel.com/legal/privacy-policy

import { Locale } from "@/constants/locale";

import { Box, Divider, Stack, Typography } from "@mui/material";

import { LocaleCode } from "@/types/locale";

interface PrivacyContent {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: { heading: string; body: string }[];
  contact: string;
}

const privacyByLocale: Record<Locale, PrivacyContent> = {
  [Locale.ZhTW]: {
    title: "Biru Coffee 隱私權政策",
    lastUpdated: "最近更新：2024/09/01",
    intro:
      "我們重視您的個人資料保護。本政策說明我們如何蒐集、使用、保護及分享您的資料，適用於您使用 Biru Coffee 的線上服務與相關功能。",
    sections: [
      {
        heading: "1. 蒐集的資料",
        body: "我們可能蒐集帳號資訊（姓名、Email、電話）、訂單與付款資訊、裝置與使用紀錄（如瀏覽行為、IP）、行銷偏好等。付款相關敏感資訊將交由可信的第三方金流處理。",
      },
      {
        heading: "2. 資料使用目的",
        body: "用於提供與履行訂單、身份驗證與帳號管理、客服支援、行銷溝通（需同意時才發送）、服務安全與防詐，以及依法律要求之必要用途。",
      },
      {
        heading: "3. 資料分享對象",
        body: "僅在必要時與金流、物流、行銷工具或雲端服務供應商分享，且限於提供服務之目的。除法律要求或執法機關調查外，不會出售您的個資。",
      },
      {
        heading: "4. 資料保存與安全",
        body: "我們採取合理技術與組織措施保護資料，並於達成目的或法定保存期間屆滿後刪除或匿名化。請也妥善保管您的登入資訊。",
      },
      {
        heading: "5. 您的權利",
        body: "您可依適用法律就您的個資行使查詢、閱覽、複製、更正、刪除、停止處理、撤回同意等權利；行使方式請聯繫我們。",
      },
      {
        heading: "6. 行銷與 Cookie",
        body: "我們可能使用 Cookie 或類似技術改善體驗、分析使用情況，並在取得同意後提供個人化行銷。您可透過瀏覽器或裝置設定管理 Cookie 偏好。",
      },
      {
        heading: "7. 跨境傳輸",
        body: "您的資料可能被傳輸並存放於我們或服務供應商所在地的伺服器，並將遵循當地法律與適當的保護機制。",
      },
      {
        heading: "8. 政策更新",
        body: "我們可能不時更新本政策並於此頁公告，重大變更將另行通知。持續使用服務即視為接受更新後的內容。",
      },
    ],
    contact:
      "如有任何隱私相關疑問或權利行使需求，請透過客服信箱或門市與我們聯繫。",
  },
  [Locale.ZhCN]: {
    title: "Biru Coffee 隐私权政策",
    lastUpdated: "最近更新：2024/09/01",
    intro:
      "我们重视您的个人信息保护。本政策说明我们如何收集、使用、保护和分享您的信息，适用于您使用 Biru Coffee 的在线服务与相关功能。",
    sections: [
      {
        heading: "1. 收集的信息",
        body: "我们可能收集账号信息（姓名、邮箱、电话）、订单与付款信息、设备与使用记录（如浏览行为、IP）、营销偏好等。支付敏感信息将由可信第三方支付处理。",
      },
      {
        heading: "2. 使用目的",
        body: "用于提供与履行订单、身份验证和账号管理、客服支持、营销沟通（需同意时才发送）、服务安全与防诈骗，以及法律要求的必要用途。",
      },
      {
        heading: "3. 分享对象",
        body: "仅在必要时与支付、物流、营销工具或云端服务供应商共享，且限于提供服务之目的。除法律要求或执法调查外，不会出售您的个人信息。",
      },
      {
        heading: "4. 保存与安全",
        body: "我们采取合理技术与组织措施保护信息，并在达成目的或法定保存期届满后删除或匿名化。也请妥善保管您的登录信息。",
      },
      {
        heading: "5. 您的权利",
        body: "您可依适用法律行使查询、访问、复制、更正、删除、停止处理、撤回同意等权利；请联系我们以行使这些权利。",
      },
      {
        heading: "6. 营销与 Cookie",
        body: "我们可能使用 Cookie 或类似技术改进体验、分析使用情况，并在取得同意后提供个性化营销。您可通过浏览器或设备设置管理 Cookie 偏好。",
      },
      {
        heading: "7. 跨境传输",
        body: "您的信息可能被传输并存储于我们或服务供应商所在地区的服务器，并将遵循当地法律与适当的保护机制。",
      },
      {
        heading: "8. 政策更新",
        body: "我们可能不时更新本政策并在此页公布，重大变更会另行通知。继续使用服务即表示接受更新后的内容。",
      },
    ],
    contact: "如有隐私相关疑问或权利行使需求，请通过客服邮箱或门店与我们联系。",
  },
  [Locale.En]: {
    title: "Biru Coffee Privacy Policy",
    lastUpdated: "Last updated: 2024/09/01",
    intro:
      "We value your privacy. This policy explains how we collect, use, protect, and share your information when you use Biru Coffee’s online services and related features.",
    sections: [
      {
        heading: "1. Information We Collect",
        body: "We may collect account details (name, email, phone), order and payment info, device and usage data (e.g., browsing activity, IP), and marketing preferences. Payment-sensitive data is handled by trusted payment providers.",
      },
      {
        heading: "2. How We Use Information",
        body: "To provide and fulfill orders, authenticate and manage accounts, offer support, send marketing with your consent, secure the service and prevent fraud, and comply with legal obligations.",
      },
      {
        heading: "3. Sharing",
        body: "We share data only as needed with payment, logistics, marketing, or cloud providers to deliver the service. We do not sell your data; we may disclose it if required by law or for investigations.",
      },
      {
        heading: "4. Retention and Security",
        body: "We apply reasonable technical and organizational measures to protect data and delete or anonymize it once purposes or legal retention periods expire. Please also safeguard your credentials.",
      },
      {
        heading: "5. Your Rights",
        body: "Subject to applicable law, you may request access, correction, deletion, restriction, objection, or withdraw consent. Contact us to exercise these rights.",
      },
      {
        heading: "6. Marketing and Cookies",
        body: "We may use cookies or similar technologies to improve experience and analytics, and provide personalized marketing with consent. Manage preferences via your browser or device settings.",
      },
      {
        heading: "7. Cross-Border Transfers",
        body: "Your data may be transferred to and stored on servers where we or our providers operate, under appropriate safeguards and in line with local laws.",
      },
      {
        heading: "8. Updates",
        body: "We may update this policy and post changes here; material changes may be notified separately. Continued use indicates acceptance of the updated policy.",
      },
    ],
    contact:
      "Questions or requests? Contact us via customer support email or in-store.",
  },
  [Locale.Ja]: {
    title: "Biru Coffee プライバシーポリシー",
    lastUpdated: "最終更新日：2024/09/01",
    intro:
      "当社はお客様のプライバシーを重視しています。本ポリシーは、Biru Coffee のオンラインサービス利用時における情報の収集、利用、保護、共有について説明します。",
    sections: [
      {
        heading: "1. 収集する情報",
        body: "アカウント情報（氏名、メール、電話）、注文・支払い情報、デバイスや利用状況データ（閲覧履歴、IP など）、マーケティング設定を収集する場合があります。決済に関する機密情報は信頼できる決済代行が処理します。",
      },
      {
        heading: "2. 利用目的",
        body: "注文提供・履行、認証とアカウント管理、サポート対応、同意にもとづくマーケティング、サービスの安全確保と不正防止、法令順守のために利用します。",
      },
      {
        heading: "3. 共有先",
        body: "サービス提供に必要な範囲で、決済、物流、マーケティング、クラウド事業者と共有する場合があります。法的要請や調査を除き、情報を販売することはありません。",
      },
      {
        heading: "4. 保存と安全管理",
        body: "合理的な技術的・組織的対策により情報を保護し、目的達成または法定保存期間満了後に削除または匿名化します。ログイン情報はご自身でも適切に管理してください。",
      },
      {
        heading: "5. お客様の権利",
        body: "適用法に基づき、開示、訂正、削除、処理の停止、同意撤回などを請求できます。行使を希望される場合はご連絡ください。",
      },
      {
        heading: "6. マーケティングと Cookie",
        body: "体験向上や分析のために Cookie 等を使用する場合があります。個別マーケティングは同意に基づき実施し、ブラウザ・端末設定で管理できます。",
      },
      {
        heading: "7. 国外移転",
        body: "情報は当社または委託先の所在する国のサーバーに移転・保存されることがあり、現地法と適切な保護措置に従います。",
      },
      {
        heading: "8. ポリシーの改定",
        body: "本ポリシーは随時更新され、本ページで告知します。重要な変更がある場合は別途お知らせし、継続利用をもって改定に同意したものとみなします。",
      },
    ],
    contact:
      "プライバシーに関するお問い合わせや権利行使のご希望は、カスタマーサポートまたは店舗までご連絡ください。",
  },
  [Locale.Ko]: {
    title: "Biru Coffee 개인정보 처리방침",
    lastUpdated: "최종 업데이트: 2024/09/01",
    intro:
      "당사는 고객의 개인정보 보호를 중시합니다. 본 방침은 Biru Coffee 온라인 서비스를 이용할 때 정보의 수집, 이용, 보호, 공유 방법을 설명합니다.",
    sections: [
      {
        heading: "1. 수집하는 정보",
        body: "계정 정보(이름, 이메일, 전화번호), 주문·결제 정보, 기기 및 이용 기록(브라우징 활동, IP 등), 마케팅 선호도를 수집할 수 있습니다. 결제 관련 민감 정보는 신뢰할 수 있는 결제 대행사가 처리합니다.",
      },
      {
        heading: "2. 이용 목적",
        body: "주문 제공 및 이행, 인증과 계정 관리, 고객 지원, 동의 기반 마케팅, 서비스 보안 및 사기 방지, 법적 의무 이행에 사용합니다.",
      },
      {
        heading: "3. 공유 대상",
        body: "서비스 제공에 필요한 범위 내에서 결제, 물류, 마케팅, 클라우드 공급업체와 정보를 공유할 수 있습니다. 법적 요구나 수사를 제외하고 정보 판매는 하지 않습니다.",
      },
      {
        heading: "4. 보관 및 보안",
        body: "합리적인 기술·조직적 조치를 통해 정보를 보호하며, 목적 달성 또는 법정 보관 기간 만료 시 삭제 또는 익명화합니다. 로그인 정보는 고객님께서도 안전하게 관리해 주세요.",
      },
      {
        heading: "5. 이용자의 권리",
        body: "적용 법령에 따라 열람, 정정, 삭제, 처리 제한, 동의 철회 등을 요구할 수 있습니다. 행사 방법은 당사에 문의해 주세요.",
      },
      {
        heading: "6. 마케팅 및 쿠키",
        body: "경험 개선과 분석을 위해 쿠키 등을 사용할 수 있으며, 개인화 마케팅은 동의하신 경우에만 진행합니다. 브라우저나 기기 설정에서 쿠키를 관리할 수 있습니다.",
      },
      {
        heading: "7. 국외 이전",
        body: "정보는 당사 또는 위탁사가 위치한 국가의 서버로 이전·저장될 수 있으며, 현지 법과 적절한 보호 조치를 준수합니다.",
      },
      {
        heading: "8. 정책 변경",
        body: "본 방침은 수시로 업데이트되며, 본 페이지에 게시합니다. 중요한 변경 사항은 별도로 안내하며, 서비스 지속 이용 시 변경에 동의한 것으로 봅니다.",
      },
    ],
    contact:
      "개인정보 관련 문의 또는 권리 행사는 고객지원 이메일 또는 매장을 통해 연락해 주세요.",
  },
};

interface MemberLegalPrivacyProps {
  lang: string;
}

const MemberLegalPrivacy = ({ lang }: MemberLegalPrivacyProps) => {
  const content = privacyByLocale[lang as LocaleCode];

  return (
    <Box component="section">
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {content.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {content.lastUpdated}
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {content.intro}
        </Typography>

        <Stack spacing={3} divider={<Divider />}>
          {content.sections.map(({ heading, body }) => (
            <Stack key={heading} spacing={1}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {heading}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {body}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {content.contact}
        </Typography>
      </Stack>
    </Box>
  );
};

export default MemberLegalPrivacy;
