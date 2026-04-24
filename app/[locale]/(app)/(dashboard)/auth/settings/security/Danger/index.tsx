import { useTranslations } from "next-intl";

import FormCard, {
  StyledCardContent,
  StyledCardHeader,
} from "@/components/FormCard";

import { Button, Stack, Typography } from "@mui/material";

const Danger = () => {
  const tAuth = useTranslations("auth");

  return (
    <FormCard sx={{ borderColor: "error.main" }} variant="outlined">
      <StyledCardHeader
        title={
          <Typography color="error" fontWeight="bold" variant="h6">
            {tAuth("settings.danger.label")}
          </Typography>
        }
      />
      <StyledCardContent>
        <Stack
          alignItems={{ sm: "center" }}
          direction={{ xs: "column", sm: "row" }}
          gap={2}
          justifyContent="space-between"
          width="100%"
        >
          <Stack>
            <Typography fontWeight={500} variant="body2">
              {tAuth("settings.danger.title")}
            </Typography>
            <Typography color="text.secondary" mt={0.5} variant="caption">
              {tAuth("settings.danger.subtitle")}
            </Typography>
          </Stack>
          <Button
            color="error"
            disabled
            size="small"
            sx={{ flexShrink: 0 }}
            variant="contained"
          >
            {tAuth("settings.danger.action")}
          </Button>
        </Stack>
      </StyledCardContent>
    </FormCard>
  );
};

export default Danger;
