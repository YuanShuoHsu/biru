import Image from "next/image";
import { useParams } from "next/navigation";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import { MAX_QUANTITY } from "@/constants/cart";

import { Add, Remove } from "@mui/icons-material";
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/stores/useCartStore";

import { Choice } from "@/types/menu";

const ImageBox = styled(Box)({
  position: "relative",
  width: "100%",
  aspectRatio: "4/3",
});

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export interface CardDialogContentImperativeHandle {
  getValues: () => {
    amount: number;
    extraCost: number;
    price: number;
    quantity: number;
    size: string;
  };
}

interface CardDialogContentProps {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  price: number;
  sizes?: Choice[];
}

const CardDialogContent = forwardRef<
  CardDialogContentImperativeHandle,
  CardDialogContentProps
>(({ id, name, description, imageUrl, price, sizes }, ref) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(sizes ? sizes[0].label : "");

  const { lang } = useParams();

  const { getItemQuantity } = useCartStore();
  const maxQuantity = MAX_QUANTITY - getItemQuantity(`${id}_${size}`);
  const minQuantity = maxQuantity > 0 ? 1 : 0;

  useEffect(() => {
    setQuantity(minQuantity);
  }, [minQuantity, size]);

  const extraCost = sizes?.find(({ label }) => label === size)?.extraCost || 0;
  const amount = (price + extraCost) * quantity;
  const displayPrice = amount.toLocaleString(lang);

  useImperativeHandle(
    ref,
    () => ({
      getValues: () => ({
        amount,
        extraCost,
        price,
        quantity,
        size,
      }),
    }),
    [amount, extraCost, price, quantity, size],
  );

  return (
    <Stack direction="column" gap={2}>
      <ImageBox>
        {imageUrl && (
          <Image
            alt={name}
            fill
            priority
            sizes="(min-width: 808px) 50vw, 100vw"
            src={imageUrl}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        )}
      </ImageBox>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
      {sizes && (
        <StyledFormControl>
          <FormLabel>尺寸</FormLabel>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {sizes.map(({ label }) => (
              <Chip
                clickable
                color={size === label ? "primary" : "default"}
                key={label}
                label={`${label}`}
                onClick={() => setSize(label)}
              />
            ))}
          </Stack>
        </StyledFormControl>
      )}
      <StyledFormControl>
        <FormLabel htmlFor="quantity-input">數量</FormLabel>
        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton
            aria-label="reduce"
            disabled={quantity <= minQuantity}
            onClick={() =>
              setQuantity((prev) => Math.max(prev - 1, minQuantity))
            }
            size="small"
          >
            <Remove fontSize="small" />
          </IconButton>
          <TextField
            disabled={!quantity}
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
            value={quantity}
          />
          <IconButton
            aria-label="increase"
            disabled={quantity >= maxQuantity}
            onClick={() =>
              setQuantity((prev) => Math.min(prev + 1, maxQuantity))
            }
            size="small"
          >
            <Add fontSize="small" />
          </IconButton>
        </Stack>
        {!minQuantity && (
          <FormHelperText error>最多只能購買 {MAX_QUANTITY} 件</FormHelperText>
        )}
      </StyledFormControl>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        <Typography variant="subtitle1">小計</Typography>
        <Typography variant="h6" fontWeight="bold" color="primary">
          NT$ {displayPrice}
        </Typography>
      </Stack>
    </Stack>
  );
});

CardDialogContent.displayName = "CardDialogContent";

export default CardDialogContent;
