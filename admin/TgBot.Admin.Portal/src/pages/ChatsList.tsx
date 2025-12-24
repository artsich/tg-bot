import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { api } from '../api/client';
import type { ChatSettings } from '../types';

export default function ChatsList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getChats();
      if (response.success) {
        setChats(response.data);
      } else {
        setError(t('chats.list.loadError'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('chats.list.loadError'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button onClick={loadChats}>Попробовать снова</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('chats.list.title')}
        </Typography>
        <Button variant="outlined" onClick={loadChats}>
          {t('common.refresh')}
        </Button>
      </Box>

      {chats.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            {t('chats.list.empty')}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('chats.list.columns.chatId')}</TableCell>
                <TableCell align="center">{t('chats.list.columns.stupidityCheck')}</TableCell>
                <TableCell align="center">{t('chats.list.columns.jokeSubscription')}</TableCell>
                <TableCell>{t('chats.list.columns.jokeTopic')}</TableCell>
                <TableCell align="right">{t('chats.list.columns.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chats.map((chat) => (
                <TableRow key={chat.chatId} hover>
                  <TableCell>{chat.chatId}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={chat.stupidityCheck ? t('chats.list.status.enabled') : t('chats.list.status.disabled')}
                      color={chat.stupidityCheck ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={chat.jokeSubscribed ? t('chats.list.status.subscribed') : t('chats.list.status.notSubscribed')}
                      color={chat.jokeSubscribed ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {chat.jokeTopic || '-'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/chats/${chat.chatId}`)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

