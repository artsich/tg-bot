import { createTheme, alpha } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#34C759" },
    secondary: { main: "#7C5CFF" },
    success: { main: "#34C759" },
    warning: { main: "#FFB020" },
    error: { main: "#FF5A5F" },
    background: {
      default: "#0B0E14",
      paper: "#141922",
    },
    text: {
      primary: "#E7EAF0",
      secondary: alpha("#E7EAF0", 0.65),
    },
    divider: alpha("#E7EAF0", 0.08),
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily:
      'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "#0B0E14",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${alpha("#FFFFFF", 0.06)}`,
          backgroundImage: "none",
          boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: alpha("#0B0E14", 0.7),
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${alpha("#FFFFFF", 0.06)}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
          backgroundColor: "#0E1219",
          borderRight: `1px solid ${alpha("#FFFFFF", 0.06)}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: "4px 8px",
          "&.Mui-selected": {
            backgroundColor: alpha("#34C759", 0.12),
          },
          "&.Mui-selected:hover": {
            backgroundColor: alpha("#34C759", 0.16),
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: "md",
      },
    },
  },
});
