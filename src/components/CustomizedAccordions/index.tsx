// https://mui.com/material-ui/react-accordion/#CustomizedAccordions.tsx

"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import CartItemList from "@/components/CartItemList";

import { useI18n } from "@/context/i18n";

import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/stores/useCartStore";

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  transition: theme.transitions.create("background-color"),
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  "& .MuiAccordionSummary-content": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
}));

const StyledExpandMore = styled(ExpandMore, {
  shouldForwardProp: (prop) => prop !== "expanded",
})<{ expanded: boolean }>(({ expanded, theme }) => ({
  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
  transition: theme.transitions.create("transform"),
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: 0,
  borderTop: `1px solid ${theme.vars.palette.divider}`,
}));

const CustomizedAccordions = () => {
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const isPanel1Expanded = expanded === "panel1";

  const { lang } = useParams();

  const dict = useI18n();

  const { cartTotalAmount } = useCartStore();

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, newExpanded: boolean) =>
      setExpanded(newExpanded ? panel : false);

  return (
    <StyledAccordion
      disableGutters
      expanded={isPanel1Expanded}
      onChange={handleChange("panel1")}
    >
      <StyledAccordionSummary aria-controls="panel1-content" id="panel1-header">
        <Typography component="span" flex={1} variant="subtitle1">
          {dict.common.totalAmount}
        </Typography>
        <Typography
          color="primary"
          component="span"
          flex="auto"
          fontWeight="bold"
          textAlign="center"
          variant="h6"
        >
          {dict.common.currency} {cartTotalAmount.toLocaleString(lang)}
        </Typography>
        <Box flex={1} display="flex" justifyContent="flex-end">
          <StyledExpandMore expanded={isPanel1Expanded} />
        </Box>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <CartItemList />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default CustomizedAccordions;
