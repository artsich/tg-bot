import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Slider,
  Alert,
  CircularProgress,
  Divider,
  Toolbar,
} from '@mui/material';
import { api } from '../api/client';
import type { GlobalSettings } from '../types';

export default function GlobalSettings() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [originalSettings, setOriginalSettings] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getGlobalSettings();
      if (response.success) {
        const data = response.data;
        setSettings(data);
        setOriginalSettings(JSON.parse(JSON.stringify(data))); // Deep copy
      } else {
        setError('Не удалось загрузить настройки');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки настроек');
    } finally {
      setLoading(false);
    }
  };

  // Проверка наличия изменений
  const hasChanges = useMemo(() => {
    if (!settings || !originalSettings) return false;
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  }, [settings, originalSettings]);

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      const response = await api.updateGlobalSettings(settings);
      if (response.success) {
        setSuccess(true);
        setOriginalSettings(JSON.parse(JSON.stringify(settings))); // Обновляем оригинал
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Не удалось сохранить настройки');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения настроек');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalSettings) {
      setSettings(JSON.parse(JSON.stringify(originalSettings))); // Восстанавливаем из оригинала
      setError(null);
      setSuccess(false);
    }
  };

  const handleChange = (field: keyof GlobalSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Alert severity="error">Не удалось загрузить настройки</Alert>
    );
  }

  return (
    <Box>
      {/* Sticky Header с кнопками */}
      <Box
        sx={{
          position: 'sticky',
          top: 64, // Высота основного AppBar
          bgcolor: 'background.paper',
          boxShadow: 1,
          zIndex: (theme) => theme.zIndex.drawer - 1,
          mb: 3,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 2, minHeight: '64px !important' }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
            Глобальные настройки
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {hasChanges && (
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={saving || loading}
              >
                Отмена
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || loading || !hasChanges}
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </Box>
        </Toolbar>
      </Box>

      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Настройки успешно сохранены!
          </Alert>
        )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Настройки LLM
        </Typography>
        <TextField
          fullWidth
          label="Модель LLM"
          value={settings.llm_model}
          onChange={(e) => handleChange('llm_model', e.target.value)}
          margin="normal"
          helperText="Название модели для использования в LLM запросах"
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Настройки истории
        </Typography>
        <TextField
          fullWidth
          type="number"
          label="Максимальная длина истории"
          value={settings.history_max_len}
          onChange={(e) => handleChange('history_max_len', parseInt(e.target.value) || 0)}
          margin="normal"
          inputProps={{ min: 1, max: 1000 }}
          helperText="Максимальное количество сообщений в истории (1-1000)"
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Настройки проверки тупости
        </Typography>
        <Box sx={{ px: 2, py: 1 }}>
          <Typography gutterBottom>
            Вероятность проверки тупости: {settings.stupid_check.toFixed(2)}
          </Typography>
          <Slider
            value={settings.stupid_check}
            onChange={(_, value) => handleChange('stupid_check', value)}
            min={0}
            max={1}
            step={0.01}
            marks={[
              { value: 0, label: '0' },
              { value: 0.5, label: '0.5' },
              { value: 1, label: '1' },
            ]}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Вероятность того, что бот проверит сообщение на тупость (0.0 - никогда, 1.0 - всегда)
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Расписание ежедневных шуток
        </Typography>
        <TextField
          fullWidth
          type="time"
          label="Время отправки"
          value={settings.daily_jokes_time}
          onChange={(e) => handleChange('daily_jokes_time', e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          helperText="Время отправки ежедневных шуток (формат: HH:MM)"
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Промпты для LLM
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={8}
          label="Промпт для AI команды"
          value={settings.ai_instructions}
          onChange={(e) => handleChange('ai_instructions', e.target.value)}
          margin="normal"
          helperText="Инструкции для бота при обработке команды /ai"
        />

        <Divider sx={{ my: 3 }} />

        <TextField
          fullWidth
          multiline
          rows={5}
          label="Промпт для проверки тупости"
          value={settings.stupidity_instructions}
          onChange={(e) => handleChange('stupidity_instructions', e.target.value)}
          margin="normal"
          helperText="Инструкции для модератора при проверке сообщений на тупость"
        />

        <Divider sx={{ my: 3 }} />

        <TextField
          fullWidth
          multiline
          rows={5}
          label="Промпт для генерации шуток"
          value={settings.joke_instructions}
          onChange={(e) => handleChange('joke_instructions', e.target.value)}
          margin="normal"
          helperText="Инструкции для генератора шуток"
        />
      </Paper>
      </Box>
    </Box>
  );
}

