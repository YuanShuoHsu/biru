// https://mui.com/material-ui/react-accordion/#CustomizedAccordions.tsx

import { useParams } from "next/navigation";

import CartItemList from "@/components/CartItemList";

import { useI18n } from "@/context/i18n";

import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/stores/useCartStore";

import type { LangParam } from "@/types/locale";

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  transition: theme.transitions.create("background-color"),
}));

const StyledAccordionSummary = styled(AccordionSummary)({
  "& .MuiAccordionSummary-content": {
    display: "flex",
    alignItems: "center",
  },
});

const StyledTypography = styled(Typography)<TypographyProps>({
  width: "33%",
  flexShrink: 0,
});

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: 0,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const CustomizedAccordions = () => {
  const { lang } = useParams<LangParam>();

  const dict = useI18n();

  const { totalAmount } = useCartStore();

  return (
    <StyledAccordion defaultExpanded disableGutters>
      <StyledAccordionSummary
        aria-controls="panel1-content"
        expandIcon={<ExpandMore />}
        id="panel1-header"
      >
        <StyledTypography component="span" variant="subtitle1">
          {dict.common.totalAmount}
        </StyledTypography>
        <Typography
          color="primary"
          component="span"
          fontWeight="bold"
          variant="h6"
        >
          {dict.common.currency} {totalAmount.toLocaleString(lang)}
        </Typography>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <CartItemList />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default CustomizedAccordions;
