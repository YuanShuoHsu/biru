import { Locale } from "@/constants/locale";

import { Box, Divider, Stack, Typography } from "@mui/material";

import type { LocaleCode } from "@/types/locale";

interface TermsContent {
  title: string;
  lastUpdated: string;
  sections: { heading: string; body: string }[];
  contact: string;
}

const termsByLocale: Record<Locale, TermsContent> = {
  [Locale.ZhTW]: {
    title: "Biru Coffee 服務條款",
    lastUpdated: "最近更新：2024/09/01",
    sections: [
      {
        heading: "1. 適用範圍",
        body: "本條款適用於您使用 Biru Coffee 線上點餐、會員帳號與相關服務。使用本服務即表示您同意並遵守本條款。",
      },
      {
        heading: "2. 帳號與資料",
        body: "您需提供正確且完整的註冊資訊，並負責保管帳號與密碼。如發現未經授權的使用，請立即通知我們。",
      },
      {
        heading: "3. 訂單與支付",
        body: "所有訂單以系統確認為準。價格可能依地區與時段調整；若出現錯價，我們保留取消或調整的權利並通知您。",
      },
      {
        heading: "4. 取消與退款",
        body: "部分品項或限時優惠可能無法取消。符合退款條件的訂單將依原支付方式退款，處理時間依付款方規定而異。",
      },
      {
        heading: "5. 使用規範",
        body: "請勿以任何方式干擾系統、進行未授權存取或用於非法目的。如有違反，我們可暫停或終止您的帳號。",
      },
      {
        heading: "6. 個人資料與隱私",
        body: "我們依《隱私權政策》蒐集與使用您的個人資料。使用本服務即表示您同意該政策內容。",
      },
      {
        heading: "7. 變更與終止",
        body: "我們可能隨時更新本條款並在本頁公告。持續使用本服務視為接受更新後的條款。",
      },
      {
        heading: "8. 免責與責任限制",
        body: "在法律允許範圍內，對於因不可抗力、系統維護或第三方行為造成的損失，我們不承擔間接或附隨性責任。",
      },
    ],
    contact: "若有疑問，請透過客服信箱或門市與我們聯繫。",
  },
  [Locale.ZhCN]: {
    title: "Biru Coffee 服务条款",
    lastUpdated: "最近更新：2024/09/01",
    sections: [
      {
        heading: "1. 适用范围",
        body: "本条款适用于您使用 Biru Coffee 的线上点餐、会员账号与相关服务。使用即表示同意本条款。",
      },
      {
        heading: "2. 账号与资料",
        body: "请提供准确完整的注册信息并妥善保管账号密码。若发现未授权使用，请立即告知我们。",
      },
      {
        heading: "3. 订单与支付",
        body: "订单以系统确认为准。价格可能因地区或时段调整；若出现错误定价，我们保留取消或调整权利并通知您。",
      },
      {
        heading: "4. 取消与退款",
        body: "部分商品或限时优惠可能无法取消。符合退款条件的订单将按原支付方式退款，时间以支付方规定为准。",
      },
      {
        heading: "5. 使用规范",
        body: "请勿干扰系统、进行未授权存取或用于非法目的。如有违约，我们可暂停或终止您的账号。",
      },
      {
        heading: "6. 个人信息与隐私",
        body: "我们依《隐私政策》收集与使用个人信息。继续使用视为同意该政策。",
      },
      {
        heading: "7. 变更与终止",
        body: "我们可能随时更新本条款并在本页公告。继续使用即表示接受更新后的条款。",
      },
      {
        heading: "8. 免责与责任限制",
        body: "在法律允许范围内，对于因不可抗力、系统维护或第三方行为导致的间接或附带损失，我们不承担责任。",
      },
    ],
    contact: "如有疑问，请通过客服邮箱或门店与我们联系。",
  },
  [Locale.En]: {
    title: "Biru Coffee Terms of Service",
    lastUpdated: "Last updated: 2024/09/01",
    sections: [
      {
        heading: "1. Scope",
        body: "These terms govern your use of Biru Coffee’s online ordering, member accounts, and related services. Using the service means you accept these terms.",
      },
      {
        heading: "2. Account & Information",
        body: "Provide accurate and complete registration details and keep your credentials secure. Notify us promptly of any unauthorized use.",
      },
      {
        heading: "3. Orders & Payments",
        body: "Orders are confirmed by the system. Prices may vary by region or time; if pricing errors occur, we may cancel or adjust the order and notify you.",
      },
      {
        heading: "4. Cancellations & Refunds",
        body: "Some items or promotions may not be cancelable. Eligible refunds are returned to the original payment method; timing depends on your payment provider.",
      },
      {
        heading: "5. Acceptable Use",
        body: "Do not interfere with the service, attempt unauthorized access, or use it for illegal purposes. We may suspend or terminate accounts that violate these rules.",
      },
      {
        heading: "6. Privacy",
        body: "We collect and use personal data per our Privacy Policy. Using the service signifies your consent to that policy.",
      },
      {
        heading: "7. Changes & Termination",
        body: "We may update these terms and post changes here. Continued use constitutes acceptance of the updated terms.",
      },
      {
        heading: "8. Disclaimers & Liability",
        body: "To the extent permitted by law, we are not liable for indirect or incidental damages arising from force majeure, maintenance, or third-party actions.",
      },
    ],
    contact: "Questions? Contact us via customer support email or in-store.",
  },
  [Locale.Ja]: {
    title: "Biru Coffee 利用規約",
    lastUpdated: "最終更新日：2024/09/01",
    sections: [
      {
        heading: "1. 適用範囲",
        body: "本規約は、Biru Coffee のオンライン注文、会員アカウントおよび関連サービスの利用に適用されます。利用をもって同意したものとみなします。",
      },
      {
        heading: "2. アカウントと情報",
        body: "正確かつ最新の登録情報を提供し、認証情報を適切に管理してください。無断利用を発見した場合は速やかにご連絡ください。",
      },
      {
        heading: "3. 注文と支払い",
        body: "注文はシステムの確定をもって成立します。価格は地域や時間帯により変動する場合があります。誤価格が判明した場合、当社は注文を取消または調整し通知する場合があります。",
      },
      {
        heading: "4. キャンセルと返金",
        body: "一部商品や期間限定オファーはキャンセルできない場合があります。返金対象の場合は原決済手段にて対応し、所要時間は決済事業者の規定に従います。",
      },
      {
        heading: "5. 利用ルール",
        body: "サービスの妨害、無断アクセス、違法行為への利用を禁止します。違反が判明した場合、アカウントの一時停止または終了を行うことがあります。",
      },
      {
        heading: "6. 個人情報とプライバシー",
        body: "当社は「プライバシーポリシー」に基づき個人情報を取り扱います。サービス利用は同ポリシーへの同意を意味します。",
      },
      {
        heading: "7. 変更と終了",
        body: "本規約は随時改定され、本ページで告知します。利用継続により改定後の規約に同意したものとみなします。",
      },
      {
        heading: "8. 免責と責任制限",
        body: "法令で認められる範囲内で、不可抗力、システム保守、第三者行為に起因する間接的・付随的損害について当社は責任を負いません。",
      },
    ],
    contact: "ご不明点はカスタマーサポートや店舗までお問い合わせください。",
  },
  [Locale.Ko]: {
    title: "Biru Coffee 이용약관",
    lastUpdated: "최종 업데이트: 2024/09/01",
    sections: [
      {
        heading: "1. 적용 범위",
        body: "본 약관은 Biru Coffee 온라인 주문, 회원 계정 및 관련 서비스 이용에 적용됩니다. 이용 시 본 약관에 동의한 것으로 간주합니다.",
      },
      {
        heading: "2. 계정 및 정보",
        body: "정확하고 최신의 정보를 제공하고 계정 정보를 안전하게 보관하세요. 무단 사용을 발견하면 즉시 알려주세요.",
      },
      {
        heading: "3. 주문 및 결제",
        body: "주문은 시스템 확인 시 확정됩니다. 가격은 지역이나 시간대에 따라 달라질 수 있으며, 오표기 시 주문을 취소하거나 조정할 수 있습니다.",
      },
      {
        heading: "4. 취소 및 환불",
        body: "일부 상품이나 프로모션은 취소가 불가할 수 있습니다. 환불 대상인 경우 원결제 수단으로 처리되며, 소요 시간은 결제사 정책에 따릅니다.",
      },
      {
        heading: "5. 이용 수칙",
        body: "서비스를 방해하거나 무단 접근, 불법적인 목적으로 사용하지 말아주세요. 위반 시 계정을 일시 정지하거나 종료할 수 있습니다.",
      },
      {
        heading: "6. 개인정보 및 프라이버시",
        body: "개인정보는 개인정보 처리방침에 따라 수집·이용합니다. 서비스 이용은 해당 정책에 동의함을 의미합니다.",
      },
      {
        heading: "7. 변경 및 종료",
        body: "본 약관은 수시로 업데이트될 수 있으며, 본 페이지에 공지합니다. 계속 이용 시 변경된 약관에 동의한 것으로 봅니다.",
      },
      {
        heading: "8. 면책 및 책임 한계",
        body: "법이 허용하는 범위 내에서, 불가항력, 시스템 유지보수, 제3자 행위로 인한 간접·부수적 손해에 대해 당사는 책임을 지지 않습니다.",
      },
    ],
    contact: "문의사항은 고객지원 이메일 또는 매장을 통해 연락해 주세요.",
  },
};

interface MemberLegalTermsProps {
  lang: string;
}

const MemberLegalTerms = ({ lang }: MemberLegalTermsProps) => {
  const content = termsByLocale[lang as LocaleCode];

  return (
    <Box component="section">
      <Stack spacing={1}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {content.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {content.lastUpdated}
        </Typography>
      </Stack>
      <Stack spacing={3} divider={<Divider />}>
        {content.sections.map(({ heading, body }) => (
          <Stack key={heading} spacing={1}>
            <Typography variant="h6" fontWeight="bold">
              {heading}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {body}
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {content.contact}
      </Typography>
    </Box>
  );
};

export default MemberLegalTerms;
