"use client";

import { Delete } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import { useCartStore } from "@/stores/useCartStore";

interface CartDrawerProps {
  onClose: () => void;
  open: boolean;
}

const CartDrawer = ({ onClose, open }: CartDrawerProps) => {
  const { itemsList, removeItem, totalAmount } = useCartStore();

  const drawer = (
    <Box sx={{ width: 250, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        購物車清單
      </Typography>
      <Divider />
      <List>
        {itemsList().map((item) => (
          <ListItem
            key={item.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => removeItem(item)}
              >
                <Delete />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${item.name}${item.size ? `（${item.size}）` : ""}`}
              secondary={
                <>
                  <Typography variant="body2" component="span">
                    單價：NT$ {item.price} + 加價：NT$ {item.extraCost}
                  </Typography>
                  <Typography variant="body2" component="span">
                    數量：{item.quantity}，小計：NT$ {item.amount}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box mt={2}>
        <Typography variant="subtitle1">總計：NT$ {totalAmount}</Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
    >
      {drawer}
    </Drawer>
  );
};

export default CartDrawer;
