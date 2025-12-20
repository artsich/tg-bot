import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography, Grid, Card, CardContent } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Chat';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('dashboard.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('dashboard.welcome')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SettingsIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h5">{t('dashboard.globalSettingsCard.title')}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {t('dashboard.globalSettingsCard.description')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChatIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h5">{t('dashboard.chatSettingsCard.title')}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {t('dashboard.chatSettingsCard.description')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('dashboard.info.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('dashboard.info.mockApi')}
        </Typography>
      </Paper>
    </Box>
  );
}

