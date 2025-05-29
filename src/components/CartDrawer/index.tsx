"use client";

import Image from "next/image";
import Link from "next/link";

import { Add, Delete, Remove } from "@mui/icons-material";
import {
  Box,
  Button,
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

import { MAX_QUANTITY } from "@/constants/cart";
import { CartItem, useCartStore } from "@/stores/useCartStore";
import { useParams } from "next/navigation";

const ImageBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 60,
  height: 60,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

interface CartDrawerProps {
  onClose: () => void;
  open: boolean;
}

const CartDrawer = ({ onClose, open }: CartDrawerProps) => {
  const { updateItem, itemsList, deleteItem, totalAmount } = useCartStore();

  const { lang, tableNumber } = useParams();

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
    if (item.quantity < MAX_QUANTITY) {
      updateItem({
        ...item,
        quantity: 1,
        amount: item.price + item.extraCost,
      });
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "background.paper",
          zIndex: 1,
        }}
      >
        <Toolbar>
          <Typography variant="h6">購物車清單</Typography>
        </Toolbar>
        <Divider />
      </Box>
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
              <ListItemAvatar sx={{ margin: 0 }}>
                <ImageBox>
                  {item.imageUrl && (
                    <Image
                      alt={item.name}
                      fill
                      draggable={false}
                      sizes="(min-width: 808px) 50vw, 100vw"
                      src={item.imageUrl}
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </ImageBox>
              </ListItemAvatar>
              <Box display="flex" flexDirection="column">
                <ListItemText
                  primary={`${item.name}${item.size ? `（${item.size}）` : ""}`}
                  secondary={`NT$ ${(item.price + item.extraCost).toLocaleString(lang)} x ${item.quantity}`}
                  sx={{ margin: 0 }}
                />
                <Typography color="primary" fontWeight="bold" variant="body2">
                  NT$ {item.amount.toLocaleString(lang)}
                </Typography>
              </Box>
            </ListItem>
            <StyledFormControl>
              <Stack direction="row" alignItems="center" gap={1}>
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
                  disabled={item.quantity >= MAX_QUANTITY}
                  onClick={() => handleIncrease(item)}
                  size="small"
                >
                  <Add fontSize="small" />
                </IconButton>
              </Stack>
            </StyledFormControl>
            {index < itemsList().length - 1 && (
              <Divider component="li" variant="inset" />
            )}
          </Stack>
        ))}
      </List>
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "background.paper",
          zIndex: 1,
        }}
      >
        <Divider />
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography component="span" variant="subtitle1">
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
          </Stack>
          <Button
            component={Link}
            fullWidth
            href={`/order/${tableNumber}/checkout`}
            onClick={onClose}
            variant="contained"
          >
            前往結帳
          </Button>
        </Box>
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
