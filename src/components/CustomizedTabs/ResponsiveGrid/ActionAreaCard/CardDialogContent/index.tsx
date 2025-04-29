import Image from "next/image";
import { useState } from "react";

import {
  Box,
  Chip,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Size } from "@/types/menu";

interface CardDialogContentProps {
  availableSizes: Size[];
  description?: string;
  imageUrl?: string;
  name: string;
}

const CardDialogContent = ({
  availableSizes,
  description,
  imageUrl,
  name,
}: CardDialogContentProps) => {
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]?.label);

  return (
    <Stack direction="column" gap={2}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "4/3",
        }}
      >
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
      </Box>
      {availableSizes.length > 0 && (
        <FormControl component="fieldset">
          <FormLabel component="legend">尺寸</FormLabel>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {availableSizes.map(({ label, price }) => (
              <Chip
                clickable
                color={selectedSize === label ? "primary" : "default"}
                key={label}
                label={`${label} (${price}元)`}
                onClick={() => setSelectedSize(label)}
              />
            ))}
          </Stack>
        </FormControl>
      )}
      <TextField
        label="數量"
        type="number"
        size="small"
        // inputProps={{ min: 1 }}
        // value={quantity}
        // onChange={(e) =>
        // setQuantity(Math.max(1, parseInt(e.target.value) || 1))
        // }
      />
      {/* <Typography variant="subtitle1">
            小計：
            {(sizes.find((s) => s.label === selectedSize)?.price || 0) *
              quantity}
            元
          </Typography> */}
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </Stack>
  );
};

export default CardDialogContent;
