import Image from "next/image";
import { useState } from "react";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useDialogStore } from "@/stores/useDialogStore";

import { Size } from "@/types/menu";

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "inStock",
})<{ inStock: boolean }>(({ inStock }) => ({
  flex: 1,
  opacity: inStock ? 1 : 0.5,
  pointerEvents: inStock ? "auto" : "none",
  display: "flex",
  flexDirection: "column",
}));

const StyledCardActionArea = styled(CardActionArea)(() => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
}));

const ImageBox = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  height: 140,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const StyledChip = styled(Chip)(() => ({
  "& .MuiChip-label": {
    padding: 0,
    width: 24,
    display: "flex",
    justifyContent: "center",
  },
}));

interface ActionAreaCardProps {
  description?: string;
  imageUrl?: string;
  inStock: boolean;
  name: string;
  sizes: Size[];
}

const ActionAreaCard = ({
  description,
  imageUrl,
  inStock,
  name,
  sizes,
}: ActionAreaCardProps) => {
  const { setDialog } = useDialogStore();

  const [selectedSize, setSelectedSize] = useState(sizes[0].label);
  // const [quantity, setQuantity] = useState<number>(1);

  const availableSizes = sizes.filter(({ label }) => Boolean(label));

  // const [quantity, setQuantity] = useState<number>(1);

  const handleDialogClick = () => {
    setDialog({
      open: true,
      title: name,
      content: (
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
      ),
      cancelText: "關閉",
      confirmText: "加入購物車",
      onConfirm: async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      },
    });
  };

  return (
    <StyledCard inStock={inStock} onClick={handleDialogClick}>
      <StyledCardActionArea>
        <ImageBox>
          {imageUrl && (
            <Image
              alt={name}
              draggable={false}
              fill
              priority
              sizes="(min-width: 808px) 50vw, 100vw"
              src={imageUrl}
              style={{ objectFit: "cover" }}
            />
          )}
        </ImageBox>
        <StyledCardContent>
          <Typography variant="h6">{name}</Typography>
          <Stack direction="row" alignItems="center" gap={0.5} flexWrap="wrap">
            {availableSizes.map(({ label }) => (
              <StyledChip key={label} label={label} size="small" />
            ))}
            <Typography variant="subtitle2" color="text.primary">
              {`${Math.min(...sizes.map(({ price }) => price))}元${sizes.length > 1 ? "起" : ""}`}
            </Typography>
          </Stack>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
          {!inStock && (
            <Typography variant="caption" color="error">
              售完
            </Typography>
          )}
        </StyledCardContent>
      </StyledCardActionArea>
    </StyledCard>
  );
};

export default ActionAreaCard;
