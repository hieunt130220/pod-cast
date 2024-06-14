import React from "react";
import { makeStyles } from "@mui/styles";
import { AlertProps, Snackbar, Theme, Alert } from "@mui/material";
import { notiTypes } from "../constant/store/types";

const AlertComponent = React.forwardRef<HTMLDivElement, AlertProps>(
  function AlertComponent(props, ref) {
    return <Alert elevation={6} ref={ref} {...props} variant="filled" />;
  }
);

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  alert: {
    width: 400,
  },
}));

interface props {
  openSnackBar: boolean;
  setOpenSnackBar: (status: boolean) => void;
  noti: notiTypes;
  setNoti: (noti: notiTypes) => void;
}

const CustomizedSnackbars: React.FC<props> = ({
  openSnackBar,
  setOpenSnackBar,
  noti,
  setNoti,
}) => {
  const classes = useStyles();
  const { code, message } = noti;

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
    setNoti({});
  };

  return (
    <div className={classes.root}>
      {code && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={openSnackBar}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <AlertComponent
            onClose={handleClose}
            severity={
              code >= 200 && code < 300
                ? "success"
                : code >= 300 && code < 400
                ? "warning"
                : "error"
            }
            sx={{
              "&.MuiAlert-filledError": {
                backgroundColor: "#848484 !important",
              },
            }}
            className={classes.alert}
            variant="filled"
          >
            {message}
          </AlertComponent>
        </Snackbar>
      )}
    </div>
  );
};

export default CustomizedSnackbars;
