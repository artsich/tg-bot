import { Box, Paper, Typography, Grid, Card, CardContent } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Chat';

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Панель управления
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Добро пожаловать в админ-панель TgBot. Здесь вы можете управлять настройками бота.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SettingsIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h5">Глобальные настройки</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Настройте параметры работы бота: модель LLM, длина истории, промпты и расписание.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChatIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h5">Настройки чатов</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Управляйте настройками для каждого чата: проверка тупости, подписки на шутки.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Информация
        </Typography>
        <Typography variant="body2" color="text.secondary">
          В данный момент используется моковый API. Когда бэкенд будет готов, переключение на реальный API
          произойдёт автоматически через конфигурацию.
        </Typography>
      </Paper>
    </Box>
  );
}

