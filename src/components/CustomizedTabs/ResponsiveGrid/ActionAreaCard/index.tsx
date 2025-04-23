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
  inStock?: boolean;
  name: string;
  price?: string | number;
  tags?: string[];
}

const ActionAreaCard = ({
  description,
  imageUrl,
  inStock,
  name,
  price,
  tags = [],
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
        <CardContent sx={{ flex: 1 }}>
          <Typography component="div" variant="h6">
            {name}
          </Typography>
          {tags.length > 0 && (
            <Stack direction="row" spacing={0.5}>
              {tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Stack>
          )}
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
          {price && (
            <Typography variant="subtitle1" component="div">
              {price}
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
