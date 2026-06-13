import { useEffect, useRef } from "react";

interface PollingOptions {
  enabled?: boolean;
  intervalMs: number;
  onUnauthorized?: () => void;
}

const isUnauthorizedError = (error: unknown) => {
  return (error as { response?: { status?: number } })?.response?.status === 401;
};

const usePolling = (
  callback: () => Promise<void>,
  { enabled = true, intervalMs, onUnauthorized }: PollingOptions
) => {
  const callbackRef = useRef(callback);
  const isRunningRef = useRef(false);
  const stoppedRef = useRef(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    stoppedRef.current = false;

    if (!enabled) return;

    const run = async () => {
      if (isRunningRef.current || stoppedRef.current) return;

      isRunningRef.current = true;

      try {
        await callbackRef.current();
      } catch (error) {
        if (isUnauthorizedError(error)) {
          stoppedRef.current = true;
          onUnauthorized?.();
        }
      } finally {
        isRunningRef.current = false;
      }
    };

    const intervalId = window.setInterval(run, intervalMs);

    return () => {
      stoppedRef.current = true;
      window.clearInterval(intervalId);
    };
  }, [enabled, intervalMs, onUnauthorized]);
};

export default usePolling;
