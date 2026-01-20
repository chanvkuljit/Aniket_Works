import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
  },
}));

export default function ConfirmDialog({
  open,
  handleClose,
  dialogTitle,
  dialogContent,
  cancelBtnText,
  confirmBtnText,
}) {
  const handleDialogClose = (confirm) => {
    handleClose(confirm);
  };

  return (
    <BootstrapDialog
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {dialogTitle}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => handleDialogClose(false)}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: "red",
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Typography>{dialogContent}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handleDialogClose(false)}
          variant="contained"
          color="error"
        >
          {cancelBtnText}
        </Button>
        <Button
          autoFocus
          onClick={() => handleDialogClose(true)}
          variant="contained"
          color="success"
        >
          {confirmBtnText}
        </Button>
     
      </DialogActions>
    </BootstrapDialog>
  );
}
