import {
  Box,
  Avatar,
  Theme,
  Drawer,
  Popover,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SideNav from "../components/SideNav";
import { useDispatch } from "react-redux";
import { logout } from "../redux/action/authAction";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({
  navLink: {
    gap: "10px",
    borderRadius: "10px !important",
    // backgroundColor: "#635bff !important",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.04) !important",
      borderRadius: "10px",
      "& >*": {
        color: "#fff",
      },
    },
  },
  navLinkSelected: {
    gap: "10px",
    borderRadius: "10px !important",
    backgroundColor: "#635bff !important",
    "& >*": {
      color: "#fff !important",
    },
  },
  optionColor: {
    color: "#8a94a6",
  },
  iconOption: {
    color: "#8a94a6",
    fontSize: "20px",
  },
  menuIconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("lg")]: {
      borderRadius: "8px",
      padding: "8px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#f7f7f7",
      },
    },
  },
  menuIconStyle: {
    display: "none !important",
    fontSize: "28px",
    [theme.breakpoints.down("lg")]: {
      display: "block!important",
    },
  },
  sideNav: {
    [theme.breakpoints.down("lg")]: {
      display: "none !important",
    },
  },
  btnAvatar: {
    "&:hover": {
      backgroundColor: "unset !important",
    },
  },
}));

interface props {
  children: React.ReactNode;
}

const AdminPage: React.FC<props> = ({ children }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [statusSideNav, setStatusSideNav] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClickAvatar = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAvatar = () => {
    setAnchorEl(null);
  };

  const openAvatar = Boolean(anchorEl);

  const toggleSideNavDialog = (status: boolean) => () => {
    setStatusSideNav(status);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <Box display="flex" height="100vh" width="100%">
        <Box className={classes.sideNav}>
          <SideNav setStatusSideNav={setStatusSideNav} />
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              padding: "8px 24px",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #dcdfe4",
            }}
            component="header"
          >
            <Box
              className={classes.menuIconBtn}
              onClick={toggleSideNavDialog(true)}
            >
              <MenuIcon className={classes.menuIconStyle} />
            </Box>
            <Button onClick={handleClickAvatar} className={classes.btnAvatar}>
              <Avatar />
            </Button>
          </Box>

          <Box
            sx={{
              padding: "20px 24px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              position: "relative",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
      <Drawer open={statusSideNav} onClose={toggleSideNavDialog(false)}>
        <SideNav setStatusSideNav={setStatusSideNav} />
      </Drawer>

      <Popover
        open={openAvatar}
        anchorEl={anchorEl}
        onClose={handleCloseAvatar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List sx={{ py: 0 }}>
          <ListItem disableGutters>
            <ListItemButton
              sx={{
                px: 4,
              }}
              onClick={handleLogout}
            >
              <ListItemText primary="Log out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </>
  );
};

export default AdminPage;
