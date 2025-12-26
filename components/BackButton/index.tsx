"use client";

import NextLink from "next/link";

import { useI18n } from "@/context/i18n";

import { KeyboardArrowLeft } from "@mui/icons-material";
import { Button } from "@mui/material";

import { handleQueryParam, QueryParamKey } from "@/utils/queryParams";

interface BackButtonProps {
  back?: string;
  lang: string;
  redirect?: string;
}

const BackButton = ({ back, lang, redirect }: BackButtonProps) => {
  const dict = useI18n();

  const href =
    back && redirect
      ? handleQueryParam(back, QueryParamKey.Redirect, redirect)
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
