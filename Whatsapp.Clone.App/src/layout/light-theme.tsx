import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#d9fdd3",
    },
    secondary: {
      main: "#25D366",
    },
    background: {
      default: "#FFF",
      paper: "#f0f2f5",
    },
    text: {
      primary: "#000000",
      secondary: "#555555",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#f0f2f5",
        },
      },
    },
  },
});
