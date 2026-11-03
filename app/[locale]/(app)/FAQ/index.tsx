"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import CustomizedAccordions from "@/components/CustomizedAccordions";
import GradientBox from "@/components/GradientBox";

import {
  Box,
  type BoxProps,
  Container,
  Stack,
  Typography,
  type TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const FAQ_KEYS = [
  "pickup",
  "dineIn",
  "waitlist",
  "points",
  "payment",
  "invoice",
] as const;

type FaqKey = (typeof FAQ_KEYS)[number];

const SectionBox = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.paper,
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(5, 2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(5),
}));

const HeaderStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
}));

const StyledTypography = styled(Typography)<TypographyProps>({
  fontWeight: "bold",
});

const AccordionStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
}));

const DetailsBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const FAQ = () => {
  const [expanded, setExpanded] = useState<FaqKey[]>([]);

  const tHomeFaq = useTranslations("home.faq");

  const handleChange =
    (key: FaqKey) => (_event: React.SyntheticEvent, isExpanded: boolean) =>
      setExpanded(
        isExpanded
          ? [...expanded, key]
          : expanded.filter((item) => item !== key),
      );

  return (
    <SectionBox component="section">
      <StyledContainer disableGutters maxWidth="lg">
        <HeaderStack>
          <StyledTypography color="primary" variant="body2">
            {tHomeFaq("subtitle")}
          </StyledTypography>
          <StyledTypography component="h2" variant="h5">
            {tHomeFaq("titlePrefix")}
            <GradientBox component="span">
              {tHomeFaq("titleHighlight")}
            </GradientBox>
          </StyledTypography>
        </HeaderStack>
        <AccordionStack>
          {FAQ_KEYS.map((key) => (
            <CustomizedAccordions
              expanded={expanded.includes(key)}
              key={key}
              onChange={handleChange(key)}
              summary={
                <Typography component="h3" variant="subtitle2">
                  {tHomeFaq(`items.${key}.question`)}
                </Typography>
              }
            >
              <DetailsBox>
                <Typography color="textSecondary" variant="body2">
                  {tHomeFaq(`items.${key}.answer`)}
                </Typography>
              </DetailsBox>
            </CustomizedAccordions>
          ))}
        </AccordionStack>
      </StyledContainer>
    </SectionBox>
  );
};

export default FAQ;
