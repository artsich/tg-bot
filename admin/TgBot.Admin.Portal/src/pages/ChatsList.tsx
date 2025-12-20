import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import type { ChatInfo } from '../types';

const getChatTypeLabel = (type?: string): string => {
  const labels: Record<string, string> = {
    private: 'Личный',
    group: 'Группа',
    supergroup: 'Супергруппа',
    channel: 'Канал',
  };
  return labels[type || 'unknown'] || 'Неизвестно';
};

export default function ChatsList() {
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatInfo[]>([]);
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
        setError('Не удалось загрузить список чатов');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки чатов');
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
          Настройки чатов
        </Typography>
        <Button variant="outlined" onClick={loadChats}>
          Обновить
        </Button>
      </Box>

      {chats.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            Чаты не найдены. Чаты появятся здесь после первого взаимодействия с ботом.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Chat ID</TableCell>
                <TableCell>Тип чата</TableCell>
                <TableCell align="center">Проверка тупости</TableCell>
                <TableCell align="center">Подписка на шутки</TableCell>
                <TableCell>Тема шуток</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chats.map((chat) => (
                <TableRow key={chat.chat_id} hover>
                  <TableCell>{chat.chat_id}</TableCell>
                  <TableCell>{getChatTypeLabel(chat.chat_type)}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={chat.stupidity_check ? 'Включена' : 'Выключена'}
                      color={chat.stupidity_check ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={chat.joke_subscription ? 'Подписан' : 'Не подписан'}
                      color={chat.joke_subscription ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {chat.joke_subscription?.topic || '-'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/chats/${chat.chat_id}`)}
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

