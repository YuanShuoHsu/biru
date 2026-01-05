"use client";

import { Typography } from "@mui/material";

import { useI18nStore } from "@/providers/i18n-store-provider";

import { interpolate } from "@/utils/i18n";

const Copyright = () => {
  const { dict } = useI18nStore((state) => state);

  const copyrightLine = interpolate(dict.home.footer.copyright, {
    year: new Date().getFullYear(),
    brand: dict.home.footer.brand,
  });

  return (
    <Typography color="text.secondary" variant="caption">
      {copyrightLine}
    </Typography>
  );
};

export default Copyright;
