"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getGitHubSnapshot, type GitHubSnapshot } from "@/lib/github";
import { apiPath, isPages } from "@/lib/hosting";
const initial: GitHubSnapshot = {
  status: "unavailable",
  repositories: [],
  fetchedAt: null,
};
const Context = createContext({
  snapshot: initial,
  refreshing: true,
  refresh: () => {},
});
export function LiveDataProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState(initial);
  const [refreshing, setRefreshing] = useState(true);
  const request = useRef<AbortController | null>(null);
  const refresh = useCallback(() => {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    const load = isPages
      ? getGitHubSnapshot(controller.signal)
      : fetch(apiPath("/api/github"), {
          cache: "no-store",
          signal: controller.signal,
        }).then((response) => {
          if (!response.ok) throw new Error("Unavailable");
          return response.json() as Promise<GitHubSnapshot>;
        });
    return load
      .then((next) => {
        if (!controller.signal.aborted)
          setSnapshot((previous) =>
            next.status === "live"
              ? next
              : { ...previous, status: "unavailable", message: next.message },
          );
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setSnapshot((previous) => ({
            ...previous,
            status: "unavailable",
            message: "GitHub updates are temporarily unavailable.",
          }));
      })
      .finally(() => {
        if (!controller.signal.aborted) setRefreshing(false);
        if (request.current === controller) request.current = null;
      });
  }, []);
  useEffect(() => {
    void refresh();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 300000);
    const visible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", visible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", visible);
      request.current?.abort();
      request.current = null;
    };
  }, [refresh]);
  return (
    <Context.Provider
      value={{
        snapshot,
        refreshing,
        refresh: () => {
          setRefreshing(true);
          void refresh();
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useLiveData() {
  return useContext(Context);
}
