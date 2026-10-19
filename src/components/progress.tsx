"use client";
import { useMemo, useSyncExternalStore } from "react";
import {
  emptyProgress,
  STORAGE_KEY,
  validateProgress,
  type Progress,
} from "@/lib/progress";
const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("academy-progress", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("academy-progress", callback);
  };
};
function snapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
const serverSnapshot = () => null;
export function useProgress() {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const state = useMemo(() => {
    try {
      return raw ? validateProgress(JSON.parse(raw)) : emptyProgress;
    } catch {
      return emptyProgress;
    }
  }, [raw]);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const update = (fn: (old: Progress) => Progress) => {
    // Read latest storage to avoid stale closures across simultaneously mounted controls.
    const latest = snapshot();
    let old = emptyProgress;
    try {
      old = latest ? validateProgress(JSON.parse(latest)) : emptyProgress;
    } catch {
      /* recover through explicit new action */
    }
    const next = validateProgress(fn(old));
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("academy-progress"));
    } catch {
      throw new Error(
        "Local storage is unavailable or full. Export your data or allow storage before saving.",
      );
    }
  };
  return { state, update, ready };
}
