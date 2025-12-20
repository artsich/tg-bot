import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { api } from '../api/client';

interface ChatSettingsData {
  chat_id: number;
  stupidity_check: boolean;
  joke_subscription?: {
    topic: string;
  } | null;
}

export default function ChatSettings() {
  const { t } = useTranslation();
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<ChatSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const chatIdNum = chatId ? parseInt(chatId, 10) : null;

  useEffect(() => {
    if (chatIdNum) {
      loadSettings();
    }
  }, [chatIdNum]);

  const loadSettings = async () => {
    if (!chatIdNum) return;

    try {
      setLoading(true);
      setError(null);
      const response = await api.getChatSettings(chatIdNum);
      if (response.success) {
        setSettings(response.data);
      } else {
        setError(t('chats.settings.loadError'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('chats.settings.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings || !chatIdNum) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const updateData: any = {
        stupidity_check: settings.stupidity_check,
      };

      if (settings.joke_subscription) {
        updateData.joke_subscribed = true;
        updateData.joke_topic = settings.joke_subscription.topic || '';
      } else {
        updateData.joke_subscribed = false;
      }

      const response = await api.updateChatSettings(chatIdNum, updateData);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(t('chats.settings.saveError'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('chats.settings.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ChatSettingsData, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleJokeSubscriptionChange = (subscribed: boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      joke_subscription: subscribed
        ? { topic: settings.joke_subscription?.topic || '' }
        : null,
    });
  };

  if (!chatIdNum) {
    return (
      <Alert severity="error">{t('chats.settings.invalidChatId')}</Alert>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Alert severity="error">{t('chats.settings.loadError')}</Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button onClick={() => navigate('/chats')} sx={{ mr: 2 }}>
          ← {t('common.back')}
        </Button>
        <Typography variant="h4" component="h1">
          {t('chats.settings.title', { chatId: chatIdNum })}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {t('chats.settings.saveSuccess')}
          </Alert>
        )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('chats.settings.info.title')}
        </Typography>
        <TextField
          fullWidth
          label={t('chats.settings.info.chatId')}
          value={settings.chat_id}
          margin="normal"
          InputProps={{ readOnly: true }}
          helperText={t('chats.settings.info.chatIdHelper')}
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('chats.settings.stupidity.title')}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={settings.stupidity_check}
              onChange={(e) => handleChange('stupidity_check', e.target.checked)}
            />
          }
          label={t('chats.settings.stupidity.enabled')}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('chats.settings.stupidity.helper')}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('chats.settings.jokes.title')}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={!!settings.joke_subscription}
              onChange={(e) => handleJokeSubscriptionChange(e.target.checked)}
            />
          }
          label={t('chats.settings.jokes.subscribe')}
        />
        
        {settings.joke_subscription && (
          <>
            <Divider sx={{ my: 2 }} />
            <TextField
              fullWidth
              label={t('chats.settings.jokes.topic')}
              value={settings.joke_subscription.topic}
              onChange={(e) =>
                handleChange('joke_subscription', {
                  topic: e.target.value,
                })
              }
              margin="normal"
              helperText={t('chats.settings.jokes.topicHelper')}
              placeholder={t('chats.settings.jokes.topicPlaceholder')}
            />
          </>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/chats')} disabled={saving}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : null}
        >
          {saving ? t('common.saving') : t('common.save')}
        </Button>
      </Box>
    </Box>
  );
}

