// https://nextjs.org/docs/app/api-reference/file-conventions/not-found

"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";

import { Box, Link as MuiLink, Typography } from "@mui/material";

const NotFound = () => {
  const { lang } = useParams();

  return (
    <Box>
      <Typography color="text.primary" variant="h2">
        Not Found
      </Typography>
      <Typography color="text.primary" variant="body1">
        Could not find requested resource
      </Typography>
      <MuiLink color="text.primary" component={NextLink} href={`/${lang}`}>
        Return Home
      </MuiLink>
    </Box>
  );
};

export default NotFound;
