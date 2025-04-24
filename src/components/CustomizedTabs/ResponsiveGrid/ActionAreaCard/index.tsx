import Image from "next/image";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

interface ActionAreaCardProps {
  description?: string;
  imageUrl?: string;
  inStock: boolean;
  name: string;
  price: string | number;
  sizes: string[];
  tags?: string[];
}

const ActionAreaCard = ({
  description,
  imageUrl,
  inStock,
  name,
  price,
  sizes,
  // tags = [],
}: ActionAreaCardProps) => {
  return (
    <Card
      sx={{
        flex: 1,
        opacity: inStock ? 1 : 0.5,
        pointerEvents: inStock ? "auto" : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea
        sx={{ display: "flex", flexDirection: "column", flex: 1 }}
      >
        <Box sx={{ position: "relative", width: "100%", height: 140 }}>
          {imageUrl && (
            <Image
              alt={name}
              fill
              priority
              sizes="(min-width: 808px) 50vw, 100vw"
              src={imageUrl}
              style={{ objectFit: "cover" }}
            />
          )}
        </Box>
        <CardContent
          sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6">{name}</Typography>
          <Stack direction="row" alignItems="center" gap={0.5} flexWrap="wrap">
            {sizes.map((size) => (
              <Chip
                key={size}
                label={size}
                size="small"
                sx={{
                  "& .MuiChip-label": {
                    p: 0,
                    width: 24,
                    display: "flex",
                    justifyContent: "center",
                  },
                }}
              />
            ))}
            <Typography variant="subtitle2" color="text.primary">
              {price}
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ActionAreaCard;
