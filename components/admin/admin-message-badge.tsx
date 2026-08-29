"use client";

import { useCallback, useEffect, useState } from "react";

type BadgeNavigator = Navigator & {
  setAppBadge?: (contents?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
};

export function useUnreadMessages() {
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/messages/unread-count", {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = (await response.json()) as {
        unreadCount?: number;
      };

      const nextCount =
        typeof data.unreadCount === "number" ? data.unreadCount : 0;

      setUnreadCount(nextCount);

      const badgeNavigator = navigator as BadgeNavigator;

      if (nextCount > 0 && badgeNavigator.setAppBadge) {
        await badgeNavigator.setAppBadge(nextCount);
      } else if (nextCount === 0 && badgeNavigator.clearAppBadge) {
        await badgeNavigator.clearAppBadge();
      }
    } catch {
      // Le badge reste simplement sur sa dernière valeur connue.
    }
  }, []);

  useEffect(() => {
    void refresh();

    const onFocus = () => void refresh();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refresh]);

  return {
    unreadCount,
    refresh,
  };
}
