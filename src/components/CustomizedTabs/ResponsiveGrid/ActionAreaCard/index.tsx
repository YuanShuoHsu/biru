import Image from "next/image";

import CardDialogContent from "./CardDialogContent";

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
  // const [quantity, setQuantity] = useState<number>(1);

  const availableSizes = sizes.filter(({ label }) => Boolean(label));

  // const [quantity, setQuantity] = useState<number>(1);

  const handleDialogClick = () => {
    setDialog({
      open: true,
      title: name,
      content: (
        <CardDialogContent
          availableSizes={availableSizes}
          description={description}
          imageUrl={imageUrl}
          name={name}
        />
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
