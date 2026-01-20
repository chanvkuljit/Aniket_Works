/* eslint-disable react/prop-types */
import { Snackbar } from "@mui/material";
import * as React from "react";
import { forwardRef } from "react";
import MuiAlert from "@mui/material/Alert";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Toast = ({ message, onExited, autoHideDuration, ...props }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = (_event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      key={message.key}
      open={open}
      onClose={handleClose}
      slotProps={{
        transition: {
          onExited,
        },
      }}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={autoHideDuration ?? 5000}
      {...props}
    >
      <Alert
        severity={message.severity}
        onClose={handleClose}
        sx={{ width: "100%", color: "#fff" }}
      >
        {message.message}
      </Alert>
    </Snackbar>
  );
};
