import { Box, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";

interface PropsLoading {
  isShow: boolean;
}

const useStyles = makeStyles(() => ({
  wrapperLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const LoadingTable = (props: PropsLoading) => {
  const { isShow } = props;
  const classes = useStyles();
  return isShow ? (
    <Box className={classes.wrapperLoading}>
      <CircularProgress
        size={55}
        sx={{
          position: "fixed",
        }}
      />
    </Box>
  ) : (
    <></>
  );
};

export default LoadingTable;
