import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import React from "react";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { userReducerType } from "../redux/reducer/userReducer";

const useStyles = makeStyles(() => ({
  root: {
    margin: 0,
    padding: "8px 16px 8px 24px!important",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

interface props {
  open: boolean;
  handleClose: () => void;
}

const FormUpdateTable: React.FC<props> = ({ open, handleClose }) => {
  const classes = useStyles();
  const dataDetailUser = useSelector<RootState, userReducerType>(
    (state) => state.userReducer
  ).dataUserDetail;
  const loadingDetailUser = useSelector<RootState, userReducerType>(
    (state) => state.userReducer
  ).loadingUserDetail;
  const loadingBtn = false;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: "",
      avatar: "",
    },
    // validationSchema: validation,
    onSubmit: async (values) => {
      //   const value = {
      //     username: values.username,
      //     avatar: values.avatar,
      //   };
      console.log(values);
    },
  });

  React.useEffect(() => {
    if (open) {
      if (dataDetailUser) {
        formik.setFieldValue("username", dataDetailUser.user.username);
        formik.setFieldValue("avatar", dataDetailUser.user.avatar);
      }
    }
  }, [open, dataDetailUser]);

  const handleSubmitForm = () => () => {};
  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <DialogTitle>Detail User</DialogTitle>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            {loadingDetailUser ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={55} />
              </Box>
            ) : (
              <Box sx={{ padding: "10px" }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} display="flex">
                    <TextField
                      value={formik.values.username}
                      onChange={(
                        event: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        formik.setFieldValue("username", event.target.value);
                      }}
                      label="Username"
                      variant="standard"
                      size="small"
                      name="username"
                      id="username"
                      error={
                        formik.touched.username &&
                        Boolean(formik.errors.username)
                      }
                      helperText={
                        formik.touched.username && formik.errors.username
                      }
                      sx={{
                        width: "80%",
                      }}
                    />
                    <Avatar src={formik.values.avatar} />
                  </Grid>
                </Grid>
              </Box>
            )}
          </form>
        </DialogContent>
        <Divider />
        <DialogActions>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={handleSubmitForm}
            style={{ margin: "10px 25px" }}
            loading={loadingBtn}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FormUpdateTable;
