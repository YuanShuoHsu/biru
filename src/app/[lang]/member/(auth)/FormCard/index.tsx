"use client";

import React from "react";

import { Card, CardProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const FormCard = React.forwardRef<HTMLFormElement, CardProps<"form">>(
  (props, ref) => <Card ref={ref} component="form" {...props} />,
);
FormCard.displayName = "FormCard";

export const StyledCard = styled(FormCard)({
  width: "100%",
});

export default StyledCard;
