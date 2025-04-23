import Image from "next/image";

import { Favorite } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
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
  size?: string;
  tags?: string[];
}

const ActionAreaCard = ({
  description,
  imageUrl,
  inStock,
  name,
  price,
  size,
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
        <CardHeader
          sx={{
            width: "100%",
            display: "flex",
            gap: 1,

            "& .MuiCardHeader-avatar": {
              margin: 0,
            },

            "& .MuiCardHeader-content": {
              display: "flex",
              flexDirection: "column",
              gap: 1,
            },
          }}
          avatar={
            <Avatar sx={{ width: 24, height: 24, bgcolor: "error.main" }}>
              <Favorite sx={{ fontSize: "12px" }} />
            </Avatar>
          }
          title={
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={1}
            >
              <Typography variant="h6" noWrap>
                {name}
              </Typography>
              {tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Stack>
          }
          subheader={
            <Stack direction="row" spacing={1} alignItems="center">
              {size && (
                <Typography variant="caption" color="text.secondary">
                  {size}
                </Typography>
              )}
              {price && (
                <Typography variant="subtitle2" color="text.primary">
                  {price}
                </Typography>
              )}
            </Stack>
          }
        />
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
