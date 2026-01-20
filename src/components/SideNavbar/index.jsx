import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SchoolIcon from "@mui/icons-material/School";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { URLS } from "../../urls";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useEffect, useState } from "react";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const navItemsAdmin = [
  // { label: "Admin", icon: <AdminPanelSettingsIcon />, url: URLS.ADMIN },
  { label: "Class Managements", icon: <AdminPanelSettingsIcon />, url: URLS.ADMIN },

  { label: "Members", icon: <PeopleAltIcon />, url: URLS.MEMBERS },
  { label: "Trainers", icon: <SchoolIcon />, url: URLS.TRAINERS },
];

const navItemsUser = [
  { label: "Dashboard", icon: <DashboardIcon />, url: URLS.USERS },
];

const navItemsTrainer = [
  { label: "Dashboard", icon: <DashboardIcon />, url: URLS.TRAINERS_DASHBOARD },
];

const SideNavbar = ({ open, handleDrawerClose }) => {
  const [navItems, setNavItems] = useState(navItemsAdmin);
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const roles = localStorage.getItem("roles")
    ? JSON.parse(localStorage.getItem("roles"))
    : [];

  useEffect(() => {
    if (roles.includes("USER")) {
      setNavItems(navItemsUser);
    } else if (roles.includes("ADMIN")) {
      setNavItems(navItemsAdmin);
    } else if (roles.includes("TRAINER")) {
      setNavItems(navItemsTrainer)
    }
  }, []);

  const handleItemClick = (url) => {
    navigate(url);
  };

  console.log(777, location);

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexGrow: 1,
          }}
        >
          <Typography component="span" aria-hidden="true" sx={{ fontSize: 20 }}>
            🧘
          </Typography>
          <Typography
            component="span"
            variant="h6"
            className="brand-name"
            sx={{ fontWeight: 700, color: "#000" }}
          >
            ReAlign
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {navItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={location.pathname === item.url}
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                },
                open
                  ? {
                      justifyContent: "initial",
                    }
                  : {
                      justifyContent: "center",
                    },
              ]}
              onClick={() => handleItemClick(item.url)}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: "center",
                  },
                  open
                    ? {
                        mr: 3,
                      }
                    : {
                        mr: "auto",
                      },
                ]}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={[
                  open
                    ? {
                        opacity: 1,
                      }
                    : {
                        opacity: 0,
                      },
                ]}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideNavbar;
