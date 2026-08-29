"use client";

import Link from "next/link";
import { useUnreadMessages } from "@/components/admin-message-badge";

export function AdminMessagesNavLink() {
  const { unreadCount } = useUnreadMessages();

  return (
    <Link
      href="/admin/messages"
      className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm transition hover:bg-black/5"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M4 5.5h16v13H4z" />
        <path d="m4 7 8 6 8-6" />
      </svg>

      <span className="flex-1">Messages</span>

      {unreadCount > 0 ? (
        <span
          aria-label={`${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""}`}
          className="inline-flex min-w-6 items-center justify-center rounded-full bg-black px-2 py-0.5 text-xs font-medium text-white"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
