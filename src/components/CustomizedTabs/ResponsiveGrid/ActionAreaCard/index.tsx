import Image from "next/image";
import { useParams } from "next/navigation";
import { useRef } from "react";

import CardDialogContent, {
  CardDialogContentImperativeHandle,
} from "./CardDialogContent";

import { useI18n } from "@/context/i18n";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useDialogStore } from "@/stores/useDialogStore";

import { useCartStore } from "@/stores/useCartStore";
import { Option } from "@/types/menu";

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
  width: "100%",
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
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  inStock: boolean;
  options?: Option[];
  price: number;
}

const ActionAreaCard = ({
  id,
  description,
  imageUrl,
  inStock,
  name,
  options,
  price,
}: ActionAreaCardProps) => {
  const dialogRef = useRef<CardDialogContentImperativeHandle>(null);

  const { lang } = useParams();

  const dict = useI18n();

  const { updateItem } = useCartStore();
  const { setDialog } = useDialogStore();

  const displayPrice = price.toLocaleString(lang);

  const sizes = options?.find(({ name }) => name === "size")?.choices;

  const handleDialogClick = () => {
    setDialog({
      open: true,
      title: name,
      content: (
        <CardDialogContent
          id={id}
          name={name}
          description={description}
          imageUrl={imageUrl}
          price={price}
          ref={dialogRef}
          sizes={sizes}
        />
      ),
      cancelText: dict.dialog.close,
      confirmText: dict.dialog.addToCart,
      onConfirm: async () => {
        if (!dialogRef.current) return;
        const { amount, extraCost, price, quantity, size } =
          dialogRef.current.getValues();

        const itemId = size ? `${id}_${size}` : id;

        updateItem({
          id: itemId,
          name,
          amount,
          extraCost,
          imageUrl,
          price,
          quantity,
          size,
        });
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
          <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
            {sizes?.map(({ label }) => (
              <StyledChip key={label} label={label} size="small" />
            ))}
            <Typography variant="subtitle2" color="text.primary">
              {`NT$ ${displayPrice} ${sizes ? dict.dialog.from : ""}`}
            </Typography>
          </Stack>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
          {!inStock && (
            <Typography variant="caption" color="error">
              {dict.dialog.soldOut}
            </Typography>
          )}
        </StyledCardContent>
      </StyledCardActionArea>
    </StyledCard>
  );
};

export default ActionAreaCard;
