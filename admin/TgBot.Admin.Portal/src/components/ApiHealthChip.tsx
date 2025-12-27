import { useMemo } from "react";
import { Chip, CircularProgress, Tooltip, alpha } from "@mui/material";
import { useTranslation } from "react-i18next";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useApiHealth } from "../hooks/useApiHealth";

function formatTime(ts: number): string {
  try {
    return new Date(ts).toLocaleTimeString();
  } catch {
    return "";
  }
}

export default function ApiHealthChip() {
  const { t } = useTranslation();
  const { status, isChecking, lastCheckedAt, checkNow } = useApiHealth();

  const { color, label } = useMemo(() => {
    if (isChecking) {
      return { color: "warning" as const, label: t("health.api.unknown") };
    }
    if (status === "healthy") {
      return { color: "success" as const, label: t("health.api.healthy") };
    }
    if (status === "unhealthy") {
      return { color: "error" as const, label: t("health.api.unhealthy") };
    }
    return { color: "warning" as const, label: t("health.api.unknown") };
  }, [isChecking, status, t]);

  const tooltip = useMemo(() => {
    if (!lastCheckedAt) {
      return t("health.api.neverChecked");
    }
    return t("health.api.lastCheckedAt", { time: formatTime(lastCheckedAt) });
  }, [lastCheckedAt, t]);

  const checkTitle = isChecking
    ? t("health.api.checking")
    : t("health.api.check");

  return (
    <Tooltip title={`${tooltip} • ${checkTitle}`} arrow>
      <Chip
        size="small"
        color={color}
        label={label}
        variant="outlined"
        clickable={!isChecking}
        onClick={isChecking ? undefined : () => void checkNow()}
        onDelete={isChecking ? undefined : () => void checkNow()}
        deleteIcon={
          isChecking ? (
            <CircularProgress size={14} thickness={6} color="inherit" />
          ) : (
            <RefreshIcon fontSize="small" />
          )
        }
        sx={{
          borderColor: (theme) => alpha(theme.palette[color].main, 0.55),
          bgcolor: (theme) => alpha(theme.palette[color].main, 0.12),
          "& .MuiChip-label": { letterSpacing: "-0.01em" },
          opacity: isChecking ? 0.85 : 1,
          "& .MuiChip-deleteIcon": {
            marginRight: "6px",
            marginLeft: "2px",
          },
        }}
        aria-label={t("health.api.check")}
      />
    </Tooltip>
  );
}
