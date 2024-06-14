import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { podcastReducerType } from "../redux/reducer/podcastReducer";
import { getDetailPodcastReq } from "../redux/action/podcastAction";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Cookies from "js-cookie";
import { deleteCommentPodcastApi } from "../apis/podcast.api";
import DialogDelete from "../components/DialogDelete";
import { commentType } from "../constant/store/podcast";
import CustomizedSnackbars from "../components/SnackbarNotification";

const DetailPodcast = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = Cookies.get("accessToken");
  const { id } = useParams();
  const loadingComment = false;
  const isFetching = useSelector<RootState, podcastReducerType>(
    (state) => state.podcastReducer
  ).loadingDetailPodcast;
  const dataPodcast = useSelector<RootState, podcastReducerType>(
    (state) => state.podcastReducer
  ).detailPodcast;
  const [commentSeleted, setCommentSelected] =
    React.useState<commentType | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [openDialogDeleteComment, setOpenDialogDeleteComment] =
    React.useState(false);
  const [loadingDeleteComment, setLoadingDeleteComment] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [noti, setNoti] = React.useState({});

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    comment: commentType
  ) => {
    setAnchorEl(event.currentTarget);
    setCommentSelected(comment);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleDeleteComment = async () => {
    if (commentSeleted && token && id) {
      setLoadingDeleteComment(true);
      try {
        const response = await deleteCommentPodcastApi(
          token,
          id,
          commentSeleted._id
        );
        if (response.status === 200) {
          dispatch(getDetailPodcastReq(token, id));
          setNoti({
            code: 200,
            message: response.data.message,
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setNoti({
          code: 400,
          message: error?.response?.data?.error?.message,
        });
      } finally {
        setLoadingDeleteComment(false);
        setOpenDialogDeleteComment(false);
        setOpenSnackbar(true);
      }
    }
  };

  React.useEffect(() => {
    if (token && id) {
      dispatch(getDetailPodcastReq(token, id));
    }
  }, [id]);

  return (
    <>
      <IconButton
        sx={{
          position: "fixed",
          top: "80px",
        }}
        onClick={() => {
          navigate("/podcast");
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Box pl={5}>
        {isFetching ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {dataPodcast && (
              <>
                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "600px",
                    },
                    height: {
                      xs: "200px",
                      sm: "300px",
                      md: "300px",
                    },
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={dataPodcast.background}
                    alt={dataPodcast.background}
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: "26px",
                    }}
                  />

                  <audio
                    id="myAudio"
                    controls
                    style={{
                      width: "100%",
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    <source src={dataPodcast.audio} type="audio/mpeg" />
                  </audio>
                </Box>
                <Box
                  sx={{
                    marginTop: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <Typography
                    component="h4"
                    sx={{
                      fontWeight: "600",
                      wordWrap: "break-word",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "60%",
                      maxHeight: "50px",
                      marginBottom: "10px",
                    }}
                  >
                    {dataPodcast.caption}
                  </Typography>
                  <Box
                    sx={{
                      width: "66%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          cursor: "pointer",
                        }}
                      >
                        <Avatar
                          sx={{ width: 40, height: 40 }}
                          src={dataPodcast.user.avatar}
                        />
                      </Box>
                      <Box
                        sx={{
                          marginLeft: "10px",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          width: "50%",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: "600",
                          }}
                          variant="body2"
                        >
                          {dataPodcast.user.username}
                        </Typography>
                      </Box>

                      {/* <InteractionPost postId={dataPodcast._id} likeId={data._id} /> */}
                    </Box>
                  </Box>
                </Box>

                {loadingComment ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "100vh",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "calc(100vh - 550px)",
                      overflow: "auto",
                    }}
                  >
                    {dataPodcast.comments.map((comment) => (
                      <Box
                        key={comment._id}
                        sx={{
                          display: "flex",
                          marginBottom: "24px",
                          gap: "16px",
                        }}
                      >
                        <Box>
                          <Avatar src={comment.user.avatar} />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            sx={{
                              marginBottom: "6px",
                              display: "flex",
                              gap: "6px",
                            }}
                          >
                            <Typography
                              component="span"
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                cursor: "pointer",
                                ":hover": {
                                  opacity: 0.5,
                                },
                              }}
                            >
                              {comment.user.username}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: "#7f7c7c",
                              }}
                            >
                              {moment(comment.date).from(moment())}
                            </Typography>
                          </Box>
                          <Typography component="span" variant="body2" sx={{}}>
                            {comment.text}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            justifyContent: "flex-end",
                            display: "flex",
                            flex: 1,
                          }}
                        >
                          <IconButton onClick={(e) => handleClick(e, comment)}>
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography
          sx={{ p: 2, cursor: "pointer" }}
          onClick={() => {
            setOpenDialogDeleteComment(true);
            setAnchorEl(null);
          }}
        >
          Delete comment
        </Typography>
      </Popover>

      <DialogDelete
        open={openDialogDeleteComment}
        handleClose={() => {
          setOpenDialogDeleteComment(false);
        }}
        loading={loadingDeleteComment}
        title={
          <>
            Are you sure you want to delete comment{" "}
            {<b> {commentSeleted?.text}</b>}?
          </>
        }
        handleDelete={handleDeleteComment}
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

export default DetailPodcast;
