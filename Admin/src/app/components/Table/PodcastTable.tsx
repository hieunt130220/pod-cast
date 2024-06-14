import {
  Box,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { podcastType } from "../../constant/store/podcast";
import { formatTime } from "../../utils/formatTime";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  getAllPodcastsReq,
  searchPodcastByKeyword,
} from "../../redux/action/podcastAction";
import { RootState } from "../../redux/store";
import { podcastReducerType } from "../../redux/reducer/podcastReducer";
import LoadingTable from "../LoadingTable";
import DialogDelete from "../DialogDelete";
import { useNavigate } from "react-router-dom";
import { deletePodcastApi, getAllPodcastsApi } from "../../apis/podcast.api";
import CustomizedSnackbars from "../SnackbarNotification";
import InputSearch from "../InputSearch";

const useStyles = makeStyles(() => ({
  tableWrap: {
    width: "100%",
    boxShadow:
      "rgba(0, 0, 0, 0.04) 0px 5px 22px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
    borderRadius: "20px",
    maxHeight: "calc(100vh - 220px)",
    position: "relative",
  },
  root: {
    width: "100%",
    height: "100% ",
  },
  cellStickyHeaderRight: {
    position: "sticky",
    right: 0,
    boxShadow: "-2px 1px rgba(0, 0, 0, 0.06)",
    width: 120,
    zIndex: "4!important",
  },
  cellStickyRight: {
    position: "sticky",
    right: 0,
    boxShadow: "-2px 1px rgba(0, 0, 0, 0.06)",
    width: 120,
    zIndex: "3!important",
    backgroundColor: "#fff",
  },
  tableContainer: {
    overflow: "auto",
    maxHeight: "calc(100% - 102px)",
    borderTop: "1px solid rgba(0, 0, 0, 0.06)",
  },
  imgPodcast: {
    width: "160px",
    height: "100px",
    borderRadius: "4px",
  },
  captionPodcast: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "200px",
    cursor: " pointer",
  },
}));

const PodcastTable = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = Cookies.get("accessToken");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [noti, setNoti] = React.useState({});

  const dataPodcast = useSelector<RootState, podcastReducerType>(
    (state) => state.podcastReducer
  ).dataPodcast;
  const loadingDataPodcast = useSelector<RootState, podcastReducerType>(
    (state) => state.podcastReducer
  ).loading;

  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
  const [titleDialogDelete, setTitleDialogDelete] = React.useState("");
  const [uidPodcast, setUidPodcast] = React.useState("");
  const [loadingDeletePodcast, setLoadingDeletePodcast] = React.useState(false);
  const [dataSearch, setDataSearch] = React.useState<podcastType | []>([]);
  const [loadingSearch, setLoadingSearch] = React.useState(false);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseDialogDelete = () => {
    setOpenDialogDelete(false);
  };

  const handleClickUpdate = (idPodcast: string) => {
    navigate(`/podcast/${idPodcast}`);
  };

  const handleClickDelete = (data: podcastType) => {
    setOpenDialogDelete(true);
    setTitleDialogDelete(data._id);
    setUidPodcast(data.user._id);
  };

  const handleDeletePodcast = async () => {
    if (titleDialogDelete && token && uidPodcast) {
      setLoadingDeletePodcast(true);
      try {
        const response = await deletePodcastApi(
          token,
          titleDialogDelete,
          uidPodcast
        );
        if (response.status === 200) {
          dispatch(getAllPodcastsReq(token));
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
        setOpenDialogDelete(false);
        setLoadingDeletePodcast(false);
        setOpenSnackbar(true);
      }
    }
  };

  React.useEffect(() => {
    if (token) {
      dispatch(getAllPodcastsReq(token));
    }
  }, []);

  const callSearchApi = async () => {
    if (token) {
      let dataForSearch = dataSearch;
      try {
        setLoadingSearch(true);
        const response = await getAllPodcastsApi(token);
        if (response.status === 200) {
          const { data } = response.data;
          setDataSearch(data);
          dataForSearch = data;
          setPage(0);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setLoadingSearch(false);
      }
      return dataForSearch;
    }
  };

  return (
    <>
      <div className={classes.tableWrap}>
        <LoadingTable isShow={loadingDataPodcast || loadingSearch} />
        <Box
          sx={{
            height: 50,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <InputSearch
            dataSearch={dataSearch}
            callSearchApi={callSearchApi}
            searchByKeyword={searchPodcastByKeyword}
          />
        </Box>
        <div className={classes.root}>
          <TableContainer className={classes.tableContainer}>
            <Table
              stickyHeader
              size="small"
              sx={{ minWidth: 650 }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      minWidth: 200,
                    }}
                  >
                    <Typography fontWeight="700">ID</Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 150,
                    }}
                  >
                    <Typography fontWeight="700">Caption</Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 160,
                    }}
                  >
                    <Typography fontWeight="700" align="center">
                      Background
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 150,
                    }}
                  >
                    <Typography fontWeight="700">Update date</Typography>
                  </TableCell>
                  <TableCell className={classes.cellStickyHeaderRight}>
                    <Typography fontWeight="700" align="center">
                      Administration
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataPodcast
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: podcastType) => (
                    <TableRow
                      key={row._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{row._id}</TableCell>
                      <TableCell>
                        <Tooltip
                          title={row.caption}
                          enterDelay={700}
                          enterNextDelay={700}
                        >
                          <Typography className={classes.captionPodcast}>
                            {row.caption}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center">
                          <img
                            src={row.background}
                            className={classes.imgPodcast}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{formatTime(row.uploadDate)}</TableCell>
                      <TableCell
                        align="center"
                        className={classes.cellStickyRight}
                      >
                        <IconButton
                          aria-label="detail"
                          onClick={() => handleClickUpdate(row._id)}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleClickDelete(row)}
                        >
                          <DeleteOutlineOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider />
          <TablePagination
            component="div"
            count={dataPodcast.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
      <DialogDelete
        open={openDialogDelete}
        handleClose={handleCloseDialogDelete}
        loading={loadingDeletePodcast}
        title={
          <>
            Are you sure you want to delete podcast{" "}
            {<b> {titleDialogDelete}</b>}?
          </>
        }
        handleDelete={handleDeletePodcast}
        dialogWidth={600}
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

export default PodcastTable;
