import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import { ReactNode } from "react";

const useStyles = makeStyles(() => ({
  coverTemplate: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: "20px !important",
    padding: "10px 0",
  },
  textPerPage: { marginRight: "10px !important" },
  buttonAction: {
    textTransform: "capitalize !important" as any,
  },
}));

interface props {
  title: ReactNode;
  open: boolean;
  handleClose: React.MouseEventHandler<HTMLAnchorElement>;
  loading: boolean;
  handleDelete: () => void;
  dialogWidth?: number | string;
}

const DialogDelete: React.FC<props> = ({
  title,
  open,
  handleClose,
  loading,
  handleDelete,
  dialogWidth,
}) => {
  const classes = useStyles();

  return (
    <>
      <Dialog
        open={open}
        onClose={loading ? () => {} : handleClose}
        aria-labelledby="form-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            width: dialogWidth || 500,
          },
        }}
      >
        <DialogTitle id="form-dialog-title">
          <Typography variant="h6">Delete confirmation</Typography>
          <IconButton
            aria-label="close"
            onClick={loading ? () => {} : handleClose}
            sx={{
              position: "absolute",
              right: 3,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">{title}</Typography>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={loading}
            className={classes.buttonAction}
            onClick={handleDelete}
            variant="contained"
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogDelete;
