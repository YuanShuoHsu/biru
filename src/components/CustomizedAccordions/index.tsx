// https://mui.com/material-ui/react-accordion/#CustomizedAccordions.tsx

import { useCartStore } from "@/stores/useCartStore";
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
} from "@mui/material";
import { useParams } from "next/navigation";

const CustomizedAccordions = () => {
  const { lang } = useParams();

  const { itemsList, totalAmount } = useCartStore();

  return (
    <Accordion defaultExpanded disableGutters>
      <AccordionSummary
        aria-controls="panel1-content"
        expandIcon={<ExpandMore />}
        id="panel1-header"
        sx={{
          "& .MuiAccordionSummary-content": {
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <Typography
          component="span"
          sx={{ width: "33%", flexShrink: 0 }}
          variant="subtitle1"
        >
          總計
        </Typography>
        <Typography
          color="primary"
          component="span"
          fontWeight="bold"
          variant="h6"
        >
          NT$ {totalAmount.toLocaleString(lang)}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          p: 2,
          borderTop: "1px solid rgba(0, 0, 0, .125)",
        }}
      >
        <List
          disablePadding
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <NoSsr defer fallback={<Typography>載入中...</Typography>}>
            {itemsList().map((item, index) => (
              <Stack key={item.id} gap={2}>
                <ListItem disablePadding>
                  <ListItemText
                    primary={`${item.name} ${item.size ? `(${item.size})` : ""}`}
                    secondary={`NT$ ${(item.price + item.extraCost).toLocaleString(lang)} x ${item.quantity}`}
                    sx={{ m: 0 }}
                  />
                  <Typography color="primary" fontWeight="bold" variant="body2">
                    NT$ {(item.price * item.quantity).toLocaleString(lang)}
                  </Typography>
                </ListItem>
                {index < itemsList().length - 1 && <Divider component="li" />}
              </Stack>
            ))}
          </NoSsr>
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomizedAccordions;
