import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../api/client";

export type ApiHealthStatus = "unknown" | "healthy" | "unhealthy";

export interface UseApiHealthOptions {
  timeoutMs?: number;
  autoCheckOnMount?: boolean;
}

export interface ApiHealthState {
  status: ApiHealthStatus;
  isChecking: boolean;
  lastCheckedAt: number | null;
}

export interface UseApiHealthResult extends ApiHealthState {
  checkNow: () => Promise<void>;
}

export function useApiHealth(options: UseApiHealthOptions = {}): UseApiHealthResult {
  const { timeoutMs = 2_500, autoCheckOnMount = true } = options;

  const [state, setState] = useState<ApiHealthState>({
    status: "unknown",
    isChecking: false,
    lastCheckedAt: null,
  });

  const inFlightRef = useRef<AbortController | null>(null);

  const checkNow = useCallback(async () => {
    if (inFlightRef.current) return;

    const ac = new AbortController();
    inFlightRef.current = ac;

    setState((s) => ({ ...s, isChecking: true }));

    const timeoutId = window.setTimeout(() => ac.abort(), timeoutMs);

    try {
      const ok = await api.checkHealth(ac.signal);
      setState({
        status: ok ? "healthy" : "unhealthy",
        isChecking: false,
        lastCheckedAt: Date.now(),
      });
    } catch {
      setState({
        status: "unhealthy",
        isChecking: false,
        lastCheckedAt: Date.now(),
      });
    } finally {
      window.clearTimeout(timeoutId);
      inFlightRef.current = null;
    }
  }, [timeoutMs]);

  useEffect(() => {
    if (!autoCheckOnMount) return;
    void checkNow();
  }, [autoCheckOnMount, checkNow]);

  return { ...state, checkNow };
}


