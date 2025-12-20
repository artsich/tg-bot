import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              TgBot Admin Portal
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Админ-панель для управления ботом
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Добро пожаловать в админ-панель. Здесь вы сможете управлять настройками бота.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
