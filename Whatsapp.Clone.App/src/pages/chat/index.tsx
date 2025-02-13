import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { ArrowBack } from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Switch } from "@mui/material";
import { UserAvatar } from "../../components/user-avatar";
import { darkTheme } from "../../layout/dark-theme";
import { lightTheme } from "../../layout/light-theme";
import { ThemeProvider } from "@mui/material/styles";
import LightBackGround from "../../assets/light-background.png";
import DarkBackground from "../../assets/dark-background.png";
import { Outlet } from "react-router-dom";
import { Aside } from "../../components/aside";
import { MessagesWrapper } from "./wrapper-messages";
import { useEffect, useState } from "react";
import { IUserChat } from "../../interfaces/IUserChat";
import { SendMessage } from "../../components/send-message";

export const drawerWidth = "30%";

export const Chat = () => {
  const [mobileOpen, setMobileOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("darkTheme");
    setIsDarkMode(theme === "true");
  }, []);

  const currentTheme = isDarkMode ? darkTheme : lightTheme;
  const currentImage = isDarkMode ? DarkBackground : LightBackGround;

  const [selectedUser, setSelectedUser] = useState<IUserChat | null>(null);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => setIsClosing(false);

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const aside = (
    <Aside
      selected={selectedUser}
      onSelected={(user) => {
        setSelectedUser(user);
        handleDrawerClose();
      }}
    />
  );

  return (
    <ThemeProvider theme={currentTheme}>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
        }}
      >
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth})` },
            ml: { sm: `${drawerWidth}` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: "none" } }}
            >
              <ArrowBack />
            </IconButton>

            {selectedUser && (
              <>
                <UserAvatar name={selectedUser.name} />
                <Typography variant="h6" noWrap component="div">
                  {selectedUser.name}
                </Typography>
              </>
            )}

            <Switch
              value={isDarkMode}
              onChange={() => {
                setIsDarkMode(!isDarkMode);
                localStorage.setItem("darkTheme", (!isDarkMode).toString());
              }}
            />
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="users"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: "100%",
                bgcolor: "background.default",
              },
            }}
          >
            {aside}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                bgcolor: "background.default",
              },
            }}
            open
          >
            {aside}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            bgcolor: "background.default",
          }}
        >
          <Toolbar />

          <Box
            sx={{
              display: "flex",
              height: "calc(100% - 64px)",
              flexDirection: "column",
            }}
          >
            <MessagesWrapper backgroundimage={currentImage}>
              <Outlet />
            </MessagesWrapper>

            <SendMessage selectedUser={selectedUser} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
