// https://mui.com/material-ui/react-card/

"use client";

import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledWrapper = styled(Box)(({ theme }) => ({
  minHeight: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: theme.breakpoints.values.sm,
}));

const AccountSettingsPage = () => {
  // const dict = useI18n();
  // const { lang } = useParams<{ lang?: string }>();

  return (
    <StyledWrapper>
      <StyledCard>
        <CardHeader
          title={
            <Typography component="h1" variant="h6" fontWeight="bold">
              {/* {dict.member.accountSettings.title} */}
            </Typography>
          }
          subheader={
            <Typography color="text.secondary" variant="body2">
              {/* {dict.member.accountSettings.subtitle} */}
            </Typography>
          }
        />
        <CardContent>
          <Typography color="text.secondary" variant="body2">
            {/* {dict.member.accountSettings.placeholder.replace("{lang}", lang ?? "")} */}
          </Typography>
        </CardContent>
      </StyledCard>
    </StyledWrapper>
  );
};

export default AccountSettingsPage;
