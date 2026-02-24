"use client";

import { useTranslations } from "next-intl";

import { query } from "@/constants/query";

import { KeyboardArrowLeft } from "@mui/icons-material";
import { Button } from "@mui/material";

import { getHref } from "@/utils/href";

interface BackButtonProps {
  back: string;
  redirectTo?: string;
}

const BackButton = ({ back, redirectTo }: BackButtonProps) => {
  const tCompany = useTranslations("company");

  const { href } = getHref(back, {
    [query.redirectTo]: redirectTo,
  });

  return (
    <Button
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
