// src/components/Layout.jsx
import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const DRAWER_WIDTH = 240;

const menuItems = [
  { label: "Início", path: "/home", icon: <HomeIcon /> },
  { label: "Pacientes", path: "/patients", icon: <PeopleIcon /> },
  { label: "Agendamentos", path: "/appointments", icon: <CalendarMonthIcon /> },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  }

  function handleNavigate(path) {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  }

  const drawerContent = (
    <Box sx={{ width: DRAWER_WIDTH }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 2.5,
          backgroundColor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <LocalHospitalIcon />
        <Typography variant="h6">Odonto Wudich</Typography>
      </Box>

      <Divider />

      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "primary.main",
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: isActive ? "primary.contrastText" : "inherit" }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Sair" sx={{ color: "error.main" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <LocalHospitalIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Odonto Wudich
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    fontWeight:
                      location.pathname === item.path ? 700 : 400,
                    borderBottom:
                      location.pathname === item.path
                        ? "2px solid white"
                        : "2px solid transparent",
                    borderRadius: 0,
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {!isMobile && (
            <Tooltip title="Sair">
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8,
          minHeight: "100vh",
          backgroundColor: "background.default",
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}