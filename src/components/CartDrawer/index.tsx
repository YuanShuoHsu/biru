"use client";

import Image from "next/image";

import { Add, Delete, Remove } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { CartItem, useCartStore } from "@/stores/useCartStore";

const ImageBox = styled(Box)({
  position: "relative",
  width: "100%",
  aspectRatio: "4/3",
});

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(1),
}));

interface CartDrawerProps {
  onClose: () => void;
  open: boolean;
}

const CartDrawer = ({ onClose, open }: CartDrawerProps) => {
  const { updateItem, itemsList, deleteItem, totalAmount } = useCartStore();

  console.log(itemsList());

  const handleDecrease = (item: CartItem) => {
    if (item.quantity > 1) {
      updateItem({
        ...item,
        quantity: -1,
        amount: -(item.price + item.extraCost),
      });
    }
  };

  const handleIncrease = (item: CartItem) => {
    if (item.quantity < 10) {
      updateItem({
        ...item,
        quantity: 1,
        amount: item.price + item.extraCost,
      });
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Toolbar>
        <Typography variant="h6">購物車清單</Typography>
      </Toolbar>
      <Divider />
      <List
        disablePadding
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {itemsList().map((item, index) => (
          <Stack key={item.id} gap={2}>
            <ListItem
              alignItems="flex-start"
              sx={{ display: "flex", gap: 2 }}
              disablePadding
            >
              <ListItemAvatar>
                <ImageBox>
                  {item.imageUrl && (
                    <Image
                      alt={item.name}
                      fill
                      priority
                      sizes="(min-width: 808px) 50vw, 100vw"
                      src={item.imageUrl}
                      style={{ objectFit: "cover", borderRadius: 4 }}
                    />
                  )}
                </ImageBox>
              </ListItemAvatar>
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
            <StyledFormControl>
              {item.quantity === 1 ? (
                <IconButton
                  aria-label="delete"
                  onClick={() => deleteItem(item)}
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="decrease"
                  disabled={item.quantity <= 1}
                  onClick={() => handleDecrease(item)}
                  size="small"
                >
                  <Remove fontSize="small" />
                </IconButton>
              )}
              <TextField
                // disabled={!quantity}
                fullWidth
                id="quantity-input"
                size="small"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                  htmlInput: {
                    sx: { textAlign: "center" },
                  },
                }}
                value={item.quantity}
              />
              <IconButton
                aria-label="increase"
                // disabled={quantity >= maxQuantity}
                onClick={() => handleIncrease(item)}
                size="small"
              >
                <Add fontSize="small" />
              </IconButton>
            </StyledFormControl>
            {index < itemsList().length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </Stack>
        ))}
      </List>
      <Divider />
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="subtitle1">總計</Typography>
        <Typography variant="h6" fontWeight="bold" color="primary">
          NT$ {totalAmount}
        </Typography>
      </Toolbar>
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
