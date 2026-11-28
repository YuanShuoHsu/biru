"use client";

import { useTranslations } from "next-intl";
import useSWR from "swr";

import FormCard, {
  StyledCardHeader,
  StyledListItemText,
  StyledOutlinedListItem,
} from "@/components/FormCard";

import { useSession } from "@/hooks/useSession";

import { authClient } from "@/lib/auth-client";

import { OpenInNew, Storefront } from "@mui/icons-material";
import {
  Avatar,
  Button,
  CardContent,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { listOrganizationsKey } from "@/utils/auth";
import { toFetchError } from "@/utils/errors";

const StyledTypography = styled(Typography)({
  fontWeight: "bold",
});

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing(2),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.vars.palette.action.selected,
}));

const Organizations = () => {
  const session = useSession();

  const { data: organizations = [] } = useSWR(
    session ? [listOrganizationsKey, session.user.id] : null,
    async () => {
      const { data, error } = await authClient.organization.list();
      if (error) throw toFetchError(error);

      return data;
    },
  );

  const tAuth = useTranslations("auth");

  if (!organizations.length) return null;

  return (
    <FormCard>
      <StyledCardHeader
        avatar={<Storefront color="primary" />}
        subheader={tAuth("settings.organizations.subtitle")}
        title={
          <StyledTypography color="primary" variant="h6">
            {tAuth("settings.organizations.label")}
          </StyledTypography>
        }
      />
      <StyledCardContent>
        {organizations.map(({ id, logo, name }) => (
          <StyledOutlinedListItem key={id}>
            <ListItemIcon>
              <StyledAvatar
                alt={name}
                src={logo || undefined}
                variant="rounded"
              >
                {name[0]}
              </StyledAvatar>
            </ListItemIcon>
            <StyledListItemText primary={name} />
          </StyledOutlinedListItem>
        ))}
        <Button
          endIcon={<OpenInNew />}
          href={process.env.NEXT_PUBLIC_ADMIN_URL!}
          rel="noopener noreferrer"
          size="small"
          target="_blank"
          variant="outlined"
        >
          {tAuth("settings.organizations.manage")}
        </Button>
      </StyledCardContent>
    </FormCard>
  );
};

export default Organizations;
