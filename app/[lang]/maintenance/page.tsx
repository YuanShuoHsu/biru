// https://github.com/wayou/t-rex-runner

"use client";

import { useI18n } from "@/context/i18n";

import { Typography } from "@mui/material";

const Maintenance = () => {
  const dict = useI18n();

  return (
    <Typography color="primary" fontWeight="bold" variant="h4">
      {dict.maintenance.title}
    </Typography>
  );
};

export default Maintenance;
