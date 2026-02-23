"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { KeyboardArrowLeft } from "@mui/icons-material";
import { Button } from "@mui/material";

import { handleQueryParam, QueryParamKey } from "@/utils/queryParams";

interface BackButtonProps {
  back?: string;
  redirectTo?: string;
}

const BackButton = ({ back, redirectTo }: BackButtonProps) => {
  const tCompany = useTranslations("company");

  const href =
    back && redirectTo
      ? handleQueryParam(back, { [QueryParamKey.RedirectTo]: redirectTo })
      : back || "/";

  return (
    <Button
      component={Link}
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
