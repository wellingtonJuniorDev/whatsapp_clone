import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#005c4b",
    },
    secondary: {
      main: "#25D366",
    },
    background: {
      default: "#111b21",
      paper: "#202c33",
    },
    text: {
      primary: "#EDEDED",
      secondary: "#AAAAAA",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#202c33",
        },
      },
    },
  },
});
