// https://mui.com/material-ui/react-dialog/#system-CustomizedDialogs.tsx

import { useSnackbar } from "notistack";
import { useState } from "react";

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

import { getErrorMessage } from "@/utils/errors";

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
  const [cancelLoading, setCancelLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const loading = cancelLoading || confirmLoading;

  const {
    cancelText,
    confirmDisabled,
    confirmText,
    content,
    contentText,
    onCancel,
    onConfirm,
    open,
    resetDialog,
    title,
  } = useDialogStore();

  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    if (loading) return;

    resetDialog();
  };

  const handleCancel = async () => {
    if (loading) return;

    setCancelLoading(true);

    try {
      await onCancel?.();
      handleClose();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
    } finally {
      setCancelLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (loading) return;

    setConfirmLoading(true);

    try {
      await onConfirm?.();
      handleClose();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <BootstrapDialog
      aria-labelledby="customized-dialog-title"
      aria-describedby="customized-dialog-description"
      fullWidth
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
        <Button
          loading={cancelLoading}
          loadingPosition="end"
          onClick={handleCancel}
        >
          {cancelText}
        </Button>
        <Button
          autoFocus
          disabled={confirmDisabled}
          loading={confirmLoading}
          loadingPosition="end"
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default CustomizedDialogs;
