// https://nextjs.org/docs/app/guides/json-ld

import { getSiteMeta } from "@/utils/siteMeta";

interface JsonLdProps {
  data: object;
}

const JsonLd = ({ data }: JsonLdProps) => {
  if (getSiteMeta().isBlockedHost) return null;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
      type="application/ld+json"
    />
  );
};

export default JsonLd;
