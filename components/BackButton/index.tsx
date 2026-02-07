"use client";

import NextLink from "next/link";

import type { Locale } from "@/app/[lang]/dictionaries";

import { KeyboardArrowLeft } from "@mui/icons-material";
import { Button } from "@mui/material";

import { useI18nStore } from "@/providers/i18n-store-provider";

import { handleQueryParam, QueryParamKey } from "@/utils/queryParams";

interface BackButtonProps {
  back?: string;
  lang: Locale;
  redirectTo?: string;
}

const BackButton = ({ back, lang, redirectTo }: BackButtonProps) => {
  const { dict } = useI18nStore((state) => state);

  const href =
    back && redirectTo
      ? handleQueryParam(back, { [QueryParamKey.RedirectTo]: redirectTo })
      : back || `/${lang}`;

  const backLabel = dict.company.legal.back;

  return (
    <Button
      component={NextLink}
      href={href}
      size="small"
      startIcon={<KeyboardArrowLeft fontSize="small" />}
      variant="outlined"
    >
      {backLabel}
    </Button>
  );
};

export default BackButton;
