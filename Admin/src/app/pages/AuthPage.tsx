import { Box, TextField, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginReq } from "../redux/action/authAction";
import { RootState } from "../redux/store";
import { authReducerType } from "../redux/reducer/authReducer";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import React from "react";
import Cookies from "js-cookie";

const useStyles = makeStyles((theme: Theme) => ({
  signInForm: {
    [theme.breakpoints.up("md")]: {
      padding: "160px 64px 0px",
    },
    [theme.breakpoints.down("md")]: {
      padding: "120px 16px",
    },
    maxWidth: "480px",
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  textFieldStyle: {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "rgb(33, 43, 54)",
      },
    },
    "& label.Mui-focused": {
      color: "rgb(33, 43, 54)",
    },
    "& label": {
      color: "rgb(145, 158, 171)",
      fontSize: "14px",
    },
    "& input": {
      height: "20px",
    },
    "& .MuiInputBase-root": {
      borderRadius: "10px",
    },
  },
  btnStyle: {
    padding: "8px 16px !important",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    textTransform: "capitalize !important" as any,
    fontSize: "15px !important",
    fontWeight: "600 !important",
    backgroundColor: "rgb(33, 43, 54) !important",
    "&:hover": {
      backgroundColor: "rgb(69, 79, 91) !important",
    },
    "& .MuiLoadingButton-loadingIndicator": {
      color: "#fff !important",
    },
  },
  signInImg: {
    width: "100%",
    height: "100%",
    display: "flex",
    flex: "1",
    background:
      "linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)) center center / cover no-repeat, url(https://minimals.cc/assets/background/overlay_2.jpg)",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

const AuthPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector<RootState, authReducerType>(
    (state) => state.authReducer
  ).token;
  const loading = useSelector<RootState, authReducerType>(
    (state) => state.authReducer
  ).loading;
  const errMessage = useSelector<RootState, authReducerType>(
    (state) => state.authReducer
  ).message;

  const validationObject = Yup.object({
    email: Yup.string()
      .required("You cannot leave this field blank")
      .matches(
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "This is not valid email format"
      ),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationObject,
    onSubmit: (values) => {
      const { email, password } = values;
      dispatch(loginReq(email, password));
      if (token) {
        navigate("/users");
      }
      formik.setFieldValue("password", "");
    },
  });

  React.useEffect(() => {
    if (token) {
      navigate("/users");
      Cookies.set("accessToken", token, { expires: 1 });
    }
  }, [token]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100vh",
        }}
      >
        <Box className={classes.signInImg}></Box>

        <Box className={classes.signInForm}>
          <Typography variant="h5" fontWeight="600" marginBottom={5}>
            Sign in to Admin
          </Typography>

          <Box
            component="form"
            display="flex"
            gap="20px"
            flexDirection="column"
          >
            <TextField
              fullWidth
              label="Email address"
              variant="outlined"
              size="medium"
              value={formik.values.email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik.setFieldValue("email", event.target.value);
              }}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              className={classes.textFieldStyle}
            />

            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              size="medium"
              type="password"
              value={formik.values.password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                formik.setFieldValue("password", event.target.value);
              }}
              className={classes.textFieldStyle}
            />

            {errMessage && (
              <Typography
                variant="body2"
                sx={{
                  color: "#e01e1e",
                }}
              >
                {errMessage}
              </Typography>
            )}

            <LoadingButton
              className={classes.btnStyle}
              variant="contained"
              onClick={() => {
                formik.submitForm();
              }}
              loading={loading}
            >
              Login
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AuthPage;
