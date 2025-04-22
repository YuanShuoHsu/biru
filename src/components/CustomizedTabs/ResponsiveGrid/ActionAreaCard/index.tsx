import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

import Image from "next/image";

interface ActionAreaCardProps {
  label: string;
}

const ActionAreaCard = ({ label }: ActionAreaCardProps) => {
  return (
    <Card>
      <CardActionArea>
        <Box sx={{ position: "relative", height: 140 }}>
          <Image
            alt={label}
            fill
            priority
            sizes="(min-width: 808px) 50vw, 100vw"
            src="/IMG_4590.jpg"
            style={{ objectFit: "cover" }}
          />
        </Box>
        <CardContent>
          <Typography component="div" gutterBottom variant="h5">
            {label}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ActionAreaCard;
