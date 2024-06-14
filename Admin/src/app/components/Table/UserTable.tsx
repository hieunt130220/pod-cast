import {
  Avatar,
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
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DialogDelete from "../DialogDelete";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsersReq,
  searchUserByKeyword,
} from "../../redux/action/userAction";
import Cookies from "js-cookie";
import { RootState } from "../../redux/store";
import { userReducerType } from "../../redux/reducer/userReducer";
import { usersType } from "../../constant/store/users";
import LoadingTable from "../LoadingTable";
import { useNavigate } from "react-router-dom";
import { deleteUserApi, getAllUsersApi } from "../../apis/user.api";
import CustomizedSnackbars from "../SnackbarNotification";
import InputSearch from "../InputSearch";

const useStyles = makeStyles(() => ({
  tableWrap: {
    width: "100%",
    boxShadow:
      "rgba(0, 0, 0, 0.04) 0px 5px 22px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
    borderRadius: "20px",
    height: "calc(100vh - 220px)",
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
}));

const UserTable = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = Cookies.get("accessToken");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dataUser = useSelector<RootState, userReducerType>(
    (state) => state.userReducer
  ).dataUser;
  const loadingUsers = useSelector<RootState, userReducerType>(
    (state) => state.userReducer
  ).loading;
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
  const [titleDialogDelete, setTitleDialogDelete] = React.useState("");
  const [idUserDelete, setIdUserDelete] = React.useState<string | null>(null);
  const [loadingDeleteUser, setLoadingDeleteUser] = React.useState(false);
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [noti, setNoti] = React.useState({});
  const [dataSearch, setDataSearch] = React.useState<usersType | []>([]);
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

  const handleClickDelete = (data: usersType) => {
    setOpenDialogDelete(true);
    setTitleDialogDelete(data.username);
    setIdUserDelete(data._id);
  };

  const handleClickUpdate = (id: string) => {
    navigate(`/users/${id}`);
  };

  const handleDeleteUser = async () => {
    if (idUserDelete && token) {
      setLoadingDeleteUser(true);
      try {
        const response = await deleteUserApi(token, idUserDelete);
        if (response.status === 200) {
          dispatch(getAllUsersReq(token));
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
        setLoadingDeleteUser(false);
        setOpenSnackbar(true);
      }
    }
  };

  React.useEffect(() => {
    if (token) {
      dispatch(getAllUsersReq(token));
    }
  }, []);

  const callSearchApi = async () => {
    if (token) {
      let dataForSearch = dataSearch;
      try {
        setLoadingSearch(true);
        const response = await getAllUsersApi(token);
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
        <LoadingTable isShow={loadingUsers || loadingSearch} />
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
            searchByKeyword={searchUserByKeyword}
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
                  <TableCell>
                    <Typography fontWeight="700">ID</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="700">Username</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="700" align="center">
                      Avatar
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.cellStickyHeaderRight}>
                    <Typography fontWeight="700" align="center">
                      Administration
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataUser
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: usersType) => (
                    <TableRow
                      key={row._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{row._id}</TableCell>
                      <TableCell>{row.username}</TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center">
                          <Avatar src={row.avatar} sizes="small" />
                        </Box>
                      </TableCell>
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
            count={dataUser.length}
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
        loading={loadingDeleteUser}
        title={
          <>
            Are you sure you want to delete user {<b> {titleDialogDelete}</b>}?
          </>
        }
        handleDelete={handleDeleteUser}
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

export default UserTable;
