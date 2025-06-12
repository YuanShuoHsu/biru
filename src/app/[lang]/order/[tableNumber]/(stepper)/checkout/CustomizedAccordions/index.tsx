// https://mui.com/material-ui/react-accordion/#CustomizedAccordions.tsx

import { useParams } from "next/navigation";

import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  List,
  ListItem,
  ListItemText,
  NoSsr,
  Stack,
  Typography,
  TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/stores/useCartStore";

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

const StyledListItemText = styled(ListItemText)({
  margin: 0,
});

const CustomizedAccordions = () => {
  const { lang } = useParams();

  const { isEmpty, itemsList, totalAmount } = useCartStore();

  return (
    <Accordion defaultExpanded disableGutters>
      <StyledAccordionSummary
        aria-controls="panel1-content"
        expandIcon={<ExpandMore />}
        id="panel1-header"
      >
        <StyledTypography component="span" variant="subtitle1">
          總計
        </StyledTypography>
        <Typography
          color="primary"
          component="span"
          fontWeight="bold"
          variant="h6"
        >
          NT$ {totalAmount.toLocaleString(lang)}
        </Typography>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <StyledList disablePadding>
          <NoSsr defer fallback={<Typography>載入中...</Typography>}>
            {isEmpty ? (
              <Typography variant="body1">尚未有商品</Typography>
            ) : (
              itemsList.map((item, index) => (
                <Stack key={item.id} gap={2}>
                  <ListItem disablePadding>
                    <StyledListItemText
                      primary={`${item.name} ${item.size ? `(${item.size})` : ""}`}
                      secondary={`NT$ ${(item.price + item.extraCost).toLocaleString(lang)} x ${item.quantity}`}
                    />
                    <Typography
                      color="primary"
                      fontWeight="bold"
                      variant="body2"
                    >
                      NT$ {(item.price * item.quantity).toLocaleString(lang)}
                    </Typography>
                  </ListItem>
                  {index < itemsList.length - 1 && <Divider component="li" />}
                </Stack>
              ))
            )}
          </NoSsr>
        </StyledList>
      </StyledAccordionDetails>
    </Accordion>
  );
};

export default CustomizedAccordions;
