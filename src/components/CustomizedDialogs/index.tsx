// https://mui.com/material-ui/react-dialog/#system-CustomizedDialogs.tsx

import { Fragment } from "react";

import Transition from "@/components/CustomizedDialogs/Transition";

import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useDialogStore } from "@/stores/useDialogStore";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: 8,
  top: 8,
  color: theme.palette.grey[500],
}));

const CustomizedDialogs = () => {
  const {
    buttonText,
    cancelText,
    confirmText,
    content,
    contentText,
    onCancel,
    onConfirm,
    open,
    setDialog,
    title,
  } = useDialogStore();

  const handleClickOpen = () => setDialog({ open: true });
  const handleClose = () => setDialog({ open: false });

  const handleCancel = () => {
    onCancel?.();
    setDialog({ open: false });
  };

  const handleConfirm = () => {
    onConfirm?.();
    setDialog({ open: false });
  };

  return (
    <Fragment>
      <Button onClick={handleClickOpen} variant="outlined">
        {buttonText}
      </Button>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        aria-describedby="customized-dialog-description"
        onClose={handleClose}
        open={open}
        scroll="body"
        slots={{ transition: Transition }}
      >
        <StyledDialogTitle id="customized-dialog-title">
          {title}
        </StyledDialogTitle>
        <StyledIconButton aria-label="close" onClick={handleClose}>
          <Close />
        </StyledIconButton>
        <DialogContent dividers>
          <DialogContentText id="customized-dialog-description">
            {contentText}
          </DialogContentText>
          {content}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>{cancelText}</Button>
          <Button onClick={handleConfirm} autoFocus>
            {confirmText}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Fragment>
  );
};

export default CustomizedDialogs;
