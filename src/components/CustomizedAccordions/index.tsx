// https://mui.com/material-ui/react-accordion/#CustomizedAccordions.tsx

import { useParams } from "next/navigation";

import CartItemList from "@/components/CartItemList";

import { useI18n } from "@/context/i18n";

import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  NoSsr,
  Typography,
  TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/stores/useCartStore";

import { LangParam } from "@/types/locale";

import { getItemKey } from "@/utils/itemKey";

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
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const StyledList = styled(List)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const CustomizedAccordions = () => {
  const { lang } = useParams<LangParam>();

  const dict = useI18n();

  const { isEmpty, itemsList, totalAmount } = useCartStore();

  return (
    <Accordion defaultExpanded disableGutters>
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
        <StyledList disablePadding>
          <NoSsr
            defer
            fallback={<Typography>{dict.common.loading}</Typography>}
          >
            {isEmpty ? (
              <Typography variant="body1">{dict.common.empty}</Typography>
            ) : (
              itemsList.map((item, index) => {
                const { id, choices } = item;

                return (
                  <CartItemList
                    dict={dict}
                    item={item}
                    key={getItemKey(id, choices)}
                    lang={lang}
                    showDivider={index < itemsList.length - 1}
                  />
                );
              })
            )}
          </NoSsr>
        </StyledList>
      </StyledAccordionDetails>
    </Accordion>
  );
};

export default CustomizedAccordions;
