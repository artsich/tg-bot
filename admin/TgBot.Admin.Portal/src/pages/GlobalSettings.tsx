import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [originalSettings, setOriginalSettings] =
    useState<GlobalSettings | null>(null);

  const successTimerRef = useRef<number | null>(null);

  const clearSuccessTimer = () => {
    if (successTimerRef.current != null) {
      window.clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<GlobalSettings>({
    defaultValues: {
      llmModel: "",
      historyMaxLen: 0,
      stupidCheck: 0,
      dailyJokesTime: "00:00",
      aiInstructions: "",
      stupidityInstructions: "",
      jokeInstructions: "",
    },
    mode: "onChange",
  });

  const stupidCheckValue = watch("stupidCheck");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getGlobalSettings();
        if (response.success) {
          setOriginalSettings(response.data);
          reset(response.data);
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

    load();
  }, [reset, t]);

  useEffect(() => {
    return () => clearSuccessTimer();
  }, []);

  const onSave = handleSubmit(async (values) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      clearSuccessTimer();

      const response = await api.updateGlobalSettings(values);
      if (response.success) {
        setSuccess(true);
        setOriginalSettings(values);
        reset(values);
        successTimerRef.current = window.setTimeout(
          () => setSuccess(false),
          3000
        );
      } else {
        setError(t("globalSettings.saveError"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("globalSettings.saveError"));
    } finally {
      setSaving(false);
    }
  });

  const onCancel = () => {
    if (!originalSettings) return;
    reset(originalSettings);
    setError(null);
    setSuccess(false);
    clearSuccessTimer();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!originalSettings) {
    return <Alert severity="error">{t("globalSettings.loadError")}</Alert>;
  }

  return (
    <Box>
      <Box
        sx={{
          position: "sticky",
          top: 64,
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
            {isDirty && (
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={saving || loading}
              >
                {t("common.cancel")}
              </Button>
            )}
            <Button
              variant="contained"
              onClick={onSave}
              disabled={saving || loading || !isDirty}
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
            {...register("llmModel")}
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
            {...register("historyMaxLen", { valueAsNumber: true })}
            margin="normal"
            slotProps={{ htmlInput: { min: 1, max: 1000 } }}
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
                value: stupidCheckValue.toFixed(2),
              })}
            </Typography>
            <Controller
              name="stupidCheck"
              control={control}
              render={({ field }) => (
                <Slider
                  value={field.value}
                  onChange={(_, value) =>
                    field.onChange(Array.isArray(value) ? value[0] : value)
                  }
                  min={0}
                  max={1}
                  step={0.01}
                  marks={[
                    { value: 0, label: "0" },
                    { value: 0.5, label: "0.5" },
                    { value: 1, label: "1" },
                  ]}
                />
              )}
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
            {...register("dailyJokesTime")}
            margin="normal"
            slotProps={{ inputLabel: { shrink: true } }}
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
            {...register("aiInstructions")}
            margin="normal"
            helperText={t("globalSettings.prompts.ai.helper")}
          />

          <Divider sx={{ my: 3 }} />

          <TextField
            fullWidth
            multiline
            rows={5}
            label={t("globalSettings.prompts.stupidity.label")}
            {...register("stupidityInstructions")}
            margin="normal"
            helperText={t("globalSettings.prompts.stupidity.helper")}
          />

          <Divider sx={{ my: 3 }} />

          <TextField
            fullWidth
            multiline
            rows={5}
            label={t("globalSettings.prompts.joke.label")}
            {...register("jokeInstructions")}
            margin="normal"
            helperText={t("globalSettings.prompts.joke.helper")}
          />
        </Paper>
      </Box>
    </Box>
  );
}
