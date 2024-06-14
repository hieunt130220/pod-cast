import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { userReducerType } from "../redux/reducer/userReducer";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteAvatarUserReq,
  getDetailUsersReq,
} from "../redux/action/userAction";
import Cookies from "js-cookie";
import { formatTime } from "../utils/formatTime";
import { makeStyles } from "@mui/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { podcastType } from "../constant/store/podcast";
import DialogDelete from "../components/DialogDelete";
import { deleteUsernameApi } from "../apis/user.api";
import CustomizedSnackbars from "../components/SnackbarNotification";

const useStyles = makeStyles(() => ({
  optionAvt: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const DetailUserPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = Cookies.get("accessToken");
  const dataDetailUser = useSelector<RootState, userReducerType>(
    (state) => state.userReducer
  ).dataUserDetail;
  const loadingDetailUser = useSelector<RootState, userReducerType>(
    (state) => state.userReducer
  ).loadingUserDetail;
  const loadingDeleteAvt = useSelector<RootState, userReducerType>(
    (state) => state.userReducer
  ).loadingDeleteAvt;

  const { id } = useParams();

  const [openDialogAvt, setOpenDialogAvt] = React.useState(false);
  const [openDialogDeleteUsername, setOpenDialogDeleteUsername] =
    React.useState(false);
  const [loadingDeleteUsername, setLoadingDeleteUsername] =
    React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [noti, setNoti] = React.useState({});

  React.useEffect(() => {
    if (id && token) {
      dispatch(getDetailUsersReq(token, id));
    }
  }, [id]);

  React.useEffect(() => {
    if (id && token && loadingDeleteAvt) {
      dispatch(getDetailUsersReq(token, id));
    }
  }, [loadingDeleteAvt]);

  const handleDeleteCurrentAvt = () => {
    if (id && token) {
      dispatch(deleteAvatarUserReq(token, id));
      setOpenDialogAvt(false);
    }
  };

  const handleDeleteUsername = async () => {
    if (id && token) {
      setLoadingDeleteUsername(true);
      try {
        const response = await deleteUsernameApi(token, id);
        if (response.status === 200) {
          dispatch(getDetailUsersReq(token, id));
          setNoti({
            code: 200,
            message: response.data.message,
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setNoti({
          code: 400,
          message: error?.response?.data?.message,
        });
      } finally {
        setLoadingDeleteUsername(false);
        setOpenSnackbar(true);
        setOpenDialogDeleteUsername(false);
      }
    }
  };

  return (
    <>
      <IconButton
        sx={{
          position: "fixed",
          top: "80px",
        }}
        onClick={() => {
          navigate("/users");
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      {loadingDetailUser ? (
        <>
          <Box
            component="header"
            sx={{
              marginBottom: "16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                marginX: {
                  xs: 0,
                  md: "100px",
                },
              }}
            >
              <Box
                component="section"
                sx={{
                  flexGrow: 2,
                  display: "flex",
                  justifyContent: "center",
                  borderBottom: "1px solid #dad7d7",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem", width: " 20%" }}
                />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  justifyContent: "center",
                }}
              >
                <Skeleton variant="circular" width={80} height={80} />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "calc(100vh - 262px)",
              overflow: "auto",
            }}
          >
            <Card
              component="article"
              sx={{
                marginX: "auto",
                width: "480px",
              }}
            >
              <Box
                sx={{
                  py: 2,
                  px: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem", width: "80%" }}
                />
                <Skeleton variant="circular" width={40} height={40} />
              </Box>
              <Skeleton variant="rectangular" width={480} height={80} />

              <CardContent>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mt={2}
                >
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem", width: "10%" }}
                  />

                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem", width: "10%" }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </>
      ) : (
        <>
          {dataDetailUser && (
            <>
              <Box
                component="header"
                sx={{
                  marginBottom: "16px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    marginX: {
                      xs: 0,
                      md: "100px",
                    },
                    mt: "20px",
                  }}
                >
                  <Box
                    component="section"
                    sx={{
                      flexGrow: 2,
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <Typography fontWeight="600">Username</Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography>{dataDetailUser.user.username}</Typography>
                      <IconButton
                        onClick={() => {
                          setOpenDialogDeleteUsername(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexGrow: 1,
                      justifyContent: "center",
                    }}
                  >
                    <Avatar
                      src={dataDetailUser.user.avatar}
                      sx={{ width: 80, height: 80, cursor: "pointer" }}
                      onClick={() => {
                        setOpenDialogAvt(true);
                      }}
                    />
                  </Box>
                </Box>
                <Typography align="center">List podcast</Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "calc(100vh - 350px)",
                  overflow: "auto",
                }}
              >
                {dataDetailUser.podcasts.length > 0 &&
                  dataDetailUser.podcasts.map((podcast: podcastType) => (
                    <Card
                      component="article"
                      sx={{
                        marginX: "auto",
                        width: "480px",
                        mb: 2,
                      }}
                      key={podcast._id}
                    >
                      <CardHeader
                        avatar={
                          <Avatar
                            src={dataDetailUser.user.avatar}
                            aria-label="recipe"
                          ></Avatar>
                        }
                        title={dataDetailUser.user.username}
                        subheader={formatTime(podcast.uploadDate)}
                      />
                      <CardMedia
                        component="img"
                        height="194"
                        image={podcast.background}
                        alt="background"
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          {podcast.caption}
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          mt={2}
                        >
                          <Typography variant="body2">
                            {podcast.likes.length}{" "}
                            {podcast.likes.length > 1 ? `likes` : `like`}
                          </Typography>
                          <Typography variant="body2">
                            {podcast.comments.length}{" "}
                            {podcast.comments.length > 1
                              ? `comments`
                              : `comment`}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
              </Box>
            </>
          )}
        </>
      )}

      <Dialog open={openDialogAvt} onClose={() => setOpenDialogAvt(false)}>
        <List sx={{ pt: 0, width: "400px" }}>
          <ListItem
            sx={{
              paddingTop: "32px",
              paddingBottom: "16px",
              borderBottom: "1px solid rgb(210 197 197)",
            }}
          >
            <ListItemText
              primary="Change avatar"
              className={classes.optionAvt}
            />
          </ListItem>
          <ListItem
            sx={{
              borderBottom: "1px solid rgb(210 197 197)",
            }}
            onClick={handleDeleteCurrentAvt}
          >
            <ListItemText
              primary="Delete current avatar"
              className={classes.optionAvt}
              sx={{
                color: "#ED4956",
                cursor: "pointer",
              }}
            />
          </ListItem>
          <ListItem onClick={() => setOpenDialogAvt(false)}>
            <ListItemText
              primary="Cancel"
              className={classes.optionAvt}
              sx={{
                cursor: "pointer",
              }}
            />
          </ListItem>
        </List>
      </Dialog>

      <DialogDelete
        open={openDialogDeleteUsername}
        handleClose={() => {
          setOpenDialogDeleteUsername(false);
        }}
        loading={loadingDeleteUsername}
        title={<>Are you sure you want to delete username?</>}
        handleDelete={handleDeleteUsername}
      />

      <CustomizedSnackbars
        openSnackBar={openSnackbar}
        setOpenSnackBar={setOpenSnackbar}
        noti={noti}
        setNoti={setNoti}
      />
    </>
  );
};

export default DetailUserPage;
