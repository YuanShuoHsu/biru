"use client";

import { useI18n } from "@/context/i18n";

import { Typography } from "@mui/material";

import { interpolate } from "@/utils/i18n";

const FooterCopyright = () => {
  const dict = useI18n();

  const copyrightLine = interpolate(dict.footer.copyright, {
    year: new Date().getFullYear(),
    brand: dict.footer.brand,
  });

  return (
    <Typography color="text.secondary" variant="caption">
      {copyrightLine}
    </Typography>
  );
};

export default FooterCopyright;
