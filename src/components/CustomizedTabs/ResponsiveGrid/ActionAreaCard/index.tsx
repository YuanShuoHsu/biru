import Image from "next/image";
import { useParams } from "next/navigation";
import { useRef } from "react";

import CardDialogContent, {
  CardDialogContentImperativeHandle,
} from "./CardDialogContent";

import SoldOut from "@/components/SoldOut";

import { useI18n } from "@/context/i18n";

import { AutoAwesome, FavoriteBorder } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

import { useCartStore } from "@/stores/useCartStore";
import { useDialogStore } from "@/stores/useDialogStore";
import { useViewStore } from "@/stores/useViewStore";

import type { LangParam } from "@/types/locale";
import type { Option } from "@/types/menu";
import { ViewDirection, ViewDirections } from "@/types/view";

const StyledCard = styled(Card)({
  position: "relative",
  width: "100%",
});

const StyledCardActionArea = styled(CardActionArea, {
  shouldForwardProp: (prop) => prop !== "inStock" && prop !== "viewDirection",
})<{ inStock: boolean; viewDirection: ViewDirection }>(
  ({ inStock, viewDirection }) => ({
    height: "100%",
    display: "flex",
    flexDirection: viewDirection,
    pointerEvents: inStock ? "auto" : "none",
    cursor: inStock ? "pointer" : "default",
  }),
);

const ImageBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "viewDirection",
})<{ viewDirection: ViewDirection }>(({ viewDirection }) => ({
  position: "relative",
  width: viewDirection === "column" ? "100%" : 140,
  height: viewDirection === "column" ? 140 : "100%",
}));

const TopSoldChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "rank",
})<{ rank: number }>(({ rank, theme }) => {
  const backgroundColor =
    rank === 0
      ? "rgba(255, 215, 0, 0.5)"
      : rank === 1
        ? "rgba(192, 192, 192, 0.5)"
        : rank === 2
          ? "rgba(205, 133, 63, 0.5)"
          : alpha(theme.palette.primary.main, 0.5);

  return {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor,
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
    zIndex: 1,

    "& .MuiChip-icon": {
      color: theme.palette.common.white,
    },
  };
});

const LatestChip = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: alpha(theme.palette.primary.main, 0.5),
  color: theme.palette.common.white,
  fontWeight: theme.typography.fontWeightBold,
  zIndex: 1,

  "& .MuiChip-icon": {
    color: theme.palette.common.white,
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  width: "100%",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const SizeOptionChip = styled(Chip)({
  "& .MuiChip-label": {
    padding: 0,
    width: 24,
    display: "flex",
    justifyContent: "center",
  },
});

export interface ActionAreaCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  options: Option[];
  price: number;
  stock: number | null;
  showLatest: boolean;
  topSoldRank?: number;
}

const ActionAreaCard = ({
  id,
  description,
  imageUrl,
  name,
  options,
  price,
  showLatest,
  stock,
  topSoldRank,
}: ActionAreaCardProps) => {
  const dialogRef = useRef<CardDialogContentImperativeHandle>(null);

  const { lang } = useParams<LangParam>();

  const dict = useI18n();

  const { updateItem } = useCartStore();
  const { setDialog } = useDialogStore();
  const { view } = useViewStore();
  const viewDirection = ViewDirections[view];

  const displayPrice = price.toLocaleString(lang);

  const sizes = options?.find(({ name }) => name === "size")?.choices;

  const hasExtraCost = options?.some(({ choices }) =>
    choices.some(({ extraCost }) => extraCost > 0),
  );

  const inStock = stock === null || stock > 0;

  const handleDialogClick = () => {
    if (!inStock) return;

    setDialog({
      open: true,
      title: name,
      content: (
        <CardDialogContent
          id={id}
          name={name}
          description={description}
          imageUrl={imageUrl}
          options={options}
          price={price}
          ref={dialogRef}
        />
      ),
      cancelText: dict.dialog.close,
      confirmText: dict.dialog.addToCart,
      onConfirm: async () => {
        if (!dialogRef.current) return;
        const { amount, extraCost, price, quantity, choices } =
          dialogRef.current.getValues();

        updateItem({
          id,
          amount,
          extraCost,
          imageUrl,
          price,
          quantity,
          choices,
        });
      },
    });
  };

  return (
    <StyledCard>
      <SoldOut stock={stock} />
      <StyledCardActionArea
        disableRipple={!inStock}
        inStock={inStock}
        onClick={handleDialogClick}
        viewDirection={viewDirection}
      >
        <ImageBox viewDirection={viewDirection}>
          {topSoldRank !== undefined && (
            <TopSoldChip
              label={`${dict.order.tableNumber.top} ${topSoldRank + 1}`}
              icon={<FavoriteBorder />}
              rank={topSoldRank}
              size="small"
            />
          )}
          {showLatest && (
            <LatestChip
              label={dict.order.tableNumber.new}
              icon={<AutoAwesome />}
              size="small"
            />
          )}
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
              <SizeOptionChip
                key={label[lang]}
                label={label[lang]}
                size="small"
              />
            ))}
            <Typography color="text.primary" variant="subtitle2">
              {`${dict.common.currency} ${displayPrice} ${hasExtraCost ? dict.common.from : ""}`}
            </Typography>
          </Stack>
          {description && (
            <Typography color="text.secondary" variant="body2">
              {description}
            </Typography>
          )}
        </StyledCardContent>
      </StyledCardActionArea>
    </StyledCard>
  );
};

export default ActionAreaCard;
