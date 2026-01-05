// https://github.com/wayou/t-rex-runner

"use client";

import { Typography } from "@mui/material";

import { useI18nStore } from "@/providers/i18n-store-provider";

const Maintenance = () => {
  const { dict } = useI18nStore((state) => state);

  return (
    <Typography color="primary" fontWeight="bold" variant="h4">
      {dict.maintenance.title}
    </Typography>
  );
};

export default Maintenance;
