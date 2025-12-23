import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "./components/Layout";
import GlobalSettings from "./pages/GlobalSettings";
import ChatsList from "./pages/ChatsList";
import ChatSettings from "./pages/ChatSettings";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/global" replace />} />
            <Route path="/global" element={<GlobalSettings />} />
            <Route path="/chats" element={<ChatsList />} />
            <Route path="/chats/:chatId" element={<ChatSettings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
