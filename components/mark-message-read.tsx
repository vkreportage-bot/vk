"use client";

import { useEffect } from "react";

type BadgeNavigator = Navigator & {
  setAppBadge?: (contents?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
};

export function MarkMessageRead({
  messageId,
  alreadyRead,
}: {
  messageId: string;
  alreadyRead: boolean;
}) {
  useEffect(() => {
    if (alreadyRead) return;

    async function markRead() {
      try {
        const response = await fetch(
          `/api/admin/messages/${encodeURIComponent(messageId)}/read`,
          {
            method: "POST",
          }
        );

        if (!response.ok) return;

        const data = (await response.json()) as {
          unreadCount?: number;
        };

        const unreadCount =
          typeof data.unreadCount === "number" ? data.unreadCount : 0;

        const badgeNavigator = navigator as BadgeNavigator;

        if (unreadCount > 0 && badgeNavigator.setAppBadge) {
          await badgeNavigator.setAppBadge(unreadCount);
        } else if (unreadCount === 0 && badgeNavigator.clearAppBadge) {
          await badgeNavigator.clearAppBadge();
        }
      } catch {
        // La lecture du message reste possible même si la mise à jour échoue.
      }
    }

    void markRead();
  }, [alreadyRead, messageId]);

  return null;
}
