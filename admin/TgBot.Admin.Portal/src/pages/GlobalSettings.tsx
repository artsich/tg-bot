import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
} from "@mui/material";
import { api } from "../api/client";
import type { GlobalSettings } from "../types";

export default function GlobalSettings() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [originalSettings, setOriginalSettings] =
    useState<GlobalSettings | null>(null);
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
        setOriginalSettings({ ...data }); // Deep copy
      } else {
        setError(t("globalSettings.loadError"));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("globalSettings.loadError")
      );
    } finally {
      setLoading(false);
    }
  };

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
        setError(t("globalSettings.saveError"));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("globalSettings.saveError")
      );
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
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return <Alert severity="error">{t("globalSettings.loadError")}</Alert>;
  }

  return (
    <Box>
      <Box
        sx={{
          position: "sticky",
          top: 64, // Высота основного AppBar
          bgcolor: "background.paper",
          boxShadow: 1,
          zIndex: (theme) => theme.zIndex.drawer - 1,
          mb: 3,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: 2,
            minHeight: "64px !important",
          }}
        >
          <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
            {t("globalSettings.title")}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            {hasChanges && (
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={saving || loading}
              >
                {t("common.cancel")}
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || loading || !hasChanges}
              startIcon={
                saving ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {saving ? t("common.saving") : t("common.save")}
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
            {t("globalSettings.saveSuccess")}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("globalSettings.llm.title")}
          </Typography>
          <TextField
            fullWidth
            label={t("globalSettings.llm.model")}
            value={settings.llmModel}
            onChange={(e) => handleChange("llmModel", e.target.value)}
            margin="normal"
            helperText={t("globalSettings.llm.modelHelper")}
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("globalSettings.history.title")}
          </Typography>
          <TextField
            fullWidth
            type="number"
            label={t("globalSettings.history.maxLength")}
            value={settings.historyMaxLen}
            onChange={(e) =>
              handleChange("historyMaxLen", parseInt(e.target.value) || 0)
            }
            margin="normal"
            inputProps={{ min: 1, max: 1000 }}
            helperText={t("globalSettings.history.maxLengthHelper")}
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("globalSettings.stupidity.title")}
          </Typography>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography gutterBottom>
              {t("globalSettings.stupidity.probabilityValue", {
                value: settings.stupidCheck.toFixed(2),
              })}
            </Typography>
            <Slider
              value={settings.stupidCheck}
              onChange={(_, value) => handleChange("stupidCheck", value)}
              min={0}
              max={1}
              step={0.01}
              marks={[
                { value: 0, label: "0" },
                { value: 0.5, label: "0.5" },
                { value: 1, label: "1" },
              ]}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t("globalSettings.stupidity.probabilityHelper")}
            </Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("globalSettings.jokes.title")}
          </Typography>
          <TextField
            fullWidth
            type="time"
            label={t("globalSettings.jokes.time")}
            value={settings.dailyJokesTime}
            onChange={(e) => handleChange("dailyJokesTime", e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            helperText={t("globalSettings.jokes.timeHelper")}
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("globalSettings.prompts.title")}
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={8}
            label={t("globalSettings.prompts.ai.label")}
            value={settings.aiInstructions}
            onChange={(e) => handleChange("aiInstructions", e.target.value)}
            margin="normal"
            helperText={t("globalSettings.prompts.ai.helper")}
          />

          <Divider sx={{ my: 3 }} />

          <TextField
            fullWidth
            multiline
            rows={5}
            label={t("globalSettings.prompts.stupidity.label")}
            value={settings.stupidityInstructions}
            onChange={(e) =>
              handleChange("stupidityInstructions", e.target.value)
            }
            margin="normal"
            helperText={t("globalSettings.prompts.stupidity.helper")}
          />

          <Divider sx={{ my: 3 }} />

          <TextField
            fullWidth
            multiline
            rows={5}
            label={t("globalSettings.prompts.joke.label")}
            value={settings.jokeInstructions}
            onChange={(e) => handleChange("jokeInstructions", e.target.value)}
            margin="normal"
            helperText={t("globalSettings.prompts.joke.helper")}
          />
        </Paper>
      </Box>
    </Box>
  );
}
