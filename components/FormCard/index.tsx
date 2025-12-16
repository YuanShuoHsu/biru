"use client";

import React from "react";

import { Card, type CardProps } from "@mui/material";

const FormCard = React.forwardRef<HTMLFormElement, CardProps<"form">>(
  (props, ref) => <Card ref={ref} component="form" {...props} />,
);

FormCard.displayName = "FormCard";

export default FormCard;
