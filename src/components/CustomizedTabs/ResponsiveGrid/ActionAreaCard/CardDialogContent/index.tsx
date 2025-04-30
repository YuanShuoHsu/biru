import Image from "next/image";
import { useState } from "react";

import { Add, Remove } from "@mui/icons-material";
import {
  Box,
  Chip,
  FormControl,
  FormLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

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

interface CardDialogContentProps {
  description?: string;
  imageUrl?: string;
  name: string;
  price: number;
  sizes?: Choice[];
}

const CardDialogContent = ({
  description,
  imageUrl,
  name,
  price,
  sizes,
}: CardDialogContentProps) => {
  const [selectedSize, setSelectedSize] = useState(sizes ? sizes[0].label : "");
  const [quantity, setQuantity] = useState(1);

  const extraCost =
    sizes?.find(({ label }) => label === selectedSize)?.extraCost || 0;
  const totalPrice = (price + extraCost) * quantity;

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
                color={selectedSize === label ? "primary" : "default"}
                key={label}
                label={`${label}`}
                onClick={() => setSelectedSize(label)}
              />
            ))}
          </Stack>
        </StyledFormControl>
      )}
      <StyledFormControl>
        <FormLabel htmlFor="quantity-input">數量</FormLabel>
        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            size="small"
          >
            <Remove fontSize="small" />
          </IconButton>
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
            value={quantity}
          />
          <IconButton
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            size="small"
          >
            <Add fontSize="small" />
          </IconButton>
        </Stack>
      </StyledFormControl>
      <Typography variant="subtitle1">小計：{totalPrice} 元</Typography>
    </Stack>
  );
};

export default CardDialogContent;
