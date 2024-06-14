import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PodcastsOutlinedIcon from "@mui/icons-material/PodcastsOutlined";
import React, { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  navLink: {
    gap: "10px",
    borderRadius: "10px !important",
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
}));

interface props {
  setStatusSideNav: (status: boolean) => void;
}

type MenuItem = {
  name: string;
  path: string;
  icon: ReactNode;
};

const SideNav: React.FC<props> = ({ setStatusSideNav }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const location = useLocation();

  const listMenu: MenuItem[] = [
    {
      name: "User",
      path: "/users",
      icon: <PeopleAltOutlinedIcon className={classes.iconOption} />,
    },
    {
      name: "Podcast",
      path: "/podcast",
      icon: <PodcastsOutlinedIcon className={classes.iconOption} />,
    },
  ];

  return (
    <>
      <Box
        display="flex"
        sx={{
          width: "280px",
          height: "100%",
          backgroundColor: "#121621",
        }}
      >
        <Box
          sx={{
            width: "100%",
            padding: 2,
          }}
        >
          <Typography className={classes.optionColor}>Dashboard</Typography>
          <List sx={{ width: "100%" }} component="nav">
            {listMenu.map((menu) => (
              <ListItemButton
                className={
                  location.pathname.includes(menu.path)
                    ? classes.navLinkSelected
                    : classes.navLink
                }
                onClick={() => {
                  navigate(menu.path);
                  setStatusSideNav(false);
                }}
                key={menu.name}
              >
                {menu.icon}
                <ListItemText
                  primary={menu.name}
                  className={classes.optionColor}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>
    </>
  );
};

export default SideNav;
