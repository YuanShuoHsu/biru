// https://nextjs.org/docs/app/api-reference/file-conventions/not-found

"use client";

import { Link } from "@/i18n/navigation";

import { Box, Link as MuiLink, Typography } from "@mui/material";

const NotFound = () => (
  <Box>
    <Typography color="text.primary" variant="h2">
      Not Found
    </Typography>
    <Typography color="text.primary" variant="body1">
      Could not find requested resource
    </Typography>
    <MuiLink color="text.primary" component={Link} href="/">
      Return Home
    </MuiLink>
  </Box>
);

export default NotFound;
