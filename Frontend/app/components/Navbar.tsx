"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Study", href: "#study" },
  { label: "Mentors", href: "#mentors" },
  { label: "Groups", href: "#groups" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profile", href: "/profile" },
] as const;

const NOTIFICATION_STORAGE_KEY = "Selah:notifications";

function getUnreadNotificationCount(): number {
  try {
    const raw = window.localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    const notifications: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(notifications)
      ? notifications.filter(
          (notification) =>
            notification !== null &&
            typeof notification === "object" &&
            !(notification as { read?: unknown }).read,
        ).length
      : 0;
  } catch {
    return 0;
  }
}

function subscribeToHash(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

function getHashSnapshot() {
  return window.location.hash;
}

function getServerHashSnapshot() {
  return "";
}

function isActiveHref(href: string, pathname: string, hash: string) {
  if (href.startsWith("#")) {
    return pathname === "/" && hash === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const pathname = usePathname();
  const hash = useSyncExternalStore(
    subscribeToHash,
    getHashSnapshot,
    getServerHashSnapshot,
  );

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLAnchorElement>(
        '[role="menuitem"]',
      ) ?? [],
    );
    const currentIndex = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (!items.length) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMobileMenu();
      return;
    }

    const nextIndex =
      event.key === "ArrowDown"
        ? (currentIndex + 1) % items.length
        : event.key === "ArrowUp"
          ? (currentIndex - 1 + items.length) % items.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? items.length - 1
              : -1;
    if (nextIndex >= 0) {
      event.preventDefault();
      items[nextIndex].focus();
    }
  }
  useEffect(() => {
    const refreshCount = () => setUnreadNotificationCount(getUnreadNotificationCount());
    refreshCount();
    window.addEventListener("storage", refreshCount);
    window.addEventListener("Selah:notifications-updated", refreshCount);
    return () => {
      window.removeEventListener("storage", refreshCount);
      window.removeEventListener("Selah:notifications-updated", refreshCount);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full bg-primary px-6 py-3 sm:px-8 sm:py-4">
        <Link href="/" className="text-lg font-bold text-black sm:text-xl">
          Selah
        </Link>

        <ul className="hidden items-center gap-6 md:flex lg:gap-8">
          {NAV_LINKS.map(({ label, href }) => {
            const active = isActiveHref(href, pathname, hash);

            return (
              <li key={label}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative text-sm font-medium transition-colors ${
                    active
                      ? "text-white after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-white"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="#notifications"
            aria-label={`${unreadNotificationCount} unread notifications`}
            className="relative rounded-full p-2 text-white/80 hover:text-white"
          >
            <span aria-hidden="true">🔔</span>
            {unreadNotificationCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1 text-center text-[10px] font-bold leading-5 text-white">
                {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
              </span>
            )}
          </Link>
          <Link
            href="#connect-wallet"
            className="rounded-full border border-white/20 bg-[#333] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Connect Wallet
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-black hover:text-black/70 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          ref={menuButtonRef}
          aria-controls="mobile-navigation-menu"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl bg-primary px-6 pb-4 md:hidden">
          <ul
            id="mobile-navigation-menu"
            ref={menuRef}
            role="menu"
            onKeyDown={handleMenuKeyDown}
            className="flex flex-col gap-2 py-4"
          >
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActiveHref(href, pathname, hash);

              return (
                <li key={label}>
                  <Link
                    role="menuitem"
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-white/20 text-white"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="#connect-wallet"
            className="inline-block rounded-full border border-white/20 bg-[#333] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            onClick={() => setMobileMenuOpen(false)}
          >
            Connect Wallet
          </Link>
        </div>
      )}
    </header>
  );
}
