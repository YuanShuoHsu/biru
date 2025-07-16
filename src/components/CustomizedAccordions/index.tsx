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

import { LangParam } from "@/types/locale";

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  transition: theme.transitions.create("background-color"),
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  "& .MuiAccordionSummary-content": {
    display: "flex",
    alignItems: "center",
  },

  "& .MuiSvgIcon-root": {
    transition: theme.transitions.create(["color", "fill"]),
  },
}));

const LabelTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  width: "33%",
  flexShrink: 0,
  transition: theme.transitions.create("color"),
}));

const AmountTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  transition: theme.transitions.create("color"),
}));

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
        <LabelTypography component="span" variant="subtitle1">
          {dict.common.totalAmount}
        </LabelTypography>
        <AmountTypography
          color="primary"
          component="span"
          fontWeight="bold"
          variant="h6"
        >
          {dict.common.currency} {totalAmount.toLocaleString(lang)}
        </AmountTypography>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <CartItemList />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default CustomizedAccordions;
