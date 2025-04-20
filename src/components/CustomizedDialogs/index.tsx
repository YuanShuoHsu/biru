// https://mui.com/material-ui/react-dialog/#system-CustomizedDialogs.tsx

import { Fragment, useState } from "react";

import Transition from "@/components/CustomizedDialogs/Transition";

import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

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
  const [open, setOpen] = useState(true);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <Fragment>
      <Button onClick={handleClickOpen} variant="outlined">
        Open dialog
      </Button>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        onClose={handleClose}
        open={open}
        TransitionComponent={Transition}
      >
        <StyledDialogTitle id="customized-dialog-title">
          Modal title
        </StyledDialogTitle>
        <StyledIconButton aria-label="close" onClick={handleClose}>
          <Close />
        </StyledIconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Fragment>
  );
};

export default CustomizedDialogs;
