"use client";

import { useTranslations } from "next-intl";
import NextLink from "next/link";

import type { Locale } from "@/i18n/routing";

import { KeyboardArrowLeft } from "@mui/icons-material";
import { Button } from "@mui/material";

import { handleQueryParam, QueryParamKey } from "@/utils/queryParams";

interface BackButtonProps {
  back?: string;
  locale: Locale;
  redirectTo?: string;
}

const BackButton = ({ back, locale, redirectTo }: BackButtonProps) => {
  const tCompany = useTranslations("company");

  const href =
    back && redirectTo
      ? handleQueryParam(back, { [QueryParamKey.RedirectTo]: redirectTo })
      : back || `/${locale}`;

  return (
    <Button
      component={NextLink}
      href={href}
      size="small"
      startIcon={<KeyboardArrowLeft fontSize="small" />}
      variant="outlined"
    >
      {tCompany("legal.back")}
    </Button>
  );
};

export default BackButton;
