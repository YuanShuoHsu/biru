"use client";

import { useTranslations } from "next-intl";

import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

const Passkeys = () => {
  const tAuth = useTranslations("auth");

  return (
    <Box>
      <Typography fontWeight={600} mb={1.5} variant="subtitle2">
        {tAuth("settings.passkeys.label")}
      </Typography>
      <Card>
        <CardContent>
          <Stack
            alignItems={{ sm: "center" }}
            direction={{ xs: "column", sm: "row" }}
            gap={2}
            justifyContent="space-between"
          >
            <Stack>
              <Typography fontWeight={500} variant="body2">
                {tAuth("settings.passkeys.title")}
              </Typography>
              <Typography color="text.secondary" mt={0.5} variant="caption">
                {tAuth("settings.passkeys.subtitle")}
              </Typography>
            </Stack>
            <Button
              disabled
              size="small"
              sx={{ flexShrink: 0 }}
              variant="contained"
            >
              {tAuth("settings.passkeys.add")}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Passkeys;
