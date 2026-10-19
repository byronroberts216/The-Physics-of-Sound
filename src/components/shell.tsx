"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { useProgress } from "./progress";
const navigation = [
  ["/", "Overview", "home"],
  ["/course", "Learning path", "book"],
  ["/labs", "Physics laboratory", "lab"],
  ["/workshop", "Room workshop", "room"],
  ["/glossary", "Glossary", "search"],
  ["/library", "My notebook", "bookmark"],
  ["/references", "Sources & method", "external"],
];
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { state, update, ready } = useProgress();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <Icon name="wave" size={25} />
          </span>
          <span>
            THE PHYSICS
            <br />
            <strong>OF SOUND</strong>
          </span>
        </Link>
        <div className="sidebar-label">YOUR ACADEMY</div>
        <nav aria-label="Main navigation">
          {navigation.map(([href, label, icon]) => (
            <Link
              key={href}
              href={href}
              aria-current={
                (href === "/" ? path === href : path.startsWith(href))
                  ? "page"
                  : undefined
              }
              onClick={() => setOpen(false)}
            >
              <Icon name={icon} />
              {label}
              {path === href && <span className="nav-dot" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="student-avatar">♪</div>
          <div>
            <strong>Your learning space</strong>
            <span>Private. At your own pace.</span>
          </div>
        </div>
      </aside>
      <div className="app-content">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Icon name="menu" />
          </button>
          <span className="topbar-title">
            A little curiosity. A deeper understanding.
          </span>
          <div className="topbar-actions">
            <span className="local-badge">
              <span />
              Saved on this device
            </span>
            <button
              className="icon-button"
              aria-label={
                state.theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              disabled={!ready}
              onClick={() => {
                try {
                  update((s) => ({
                    ...s,
                    theme: s.theme === "dark" ? "light" : "dark",
                  }));
                } catch (e) {
                  setMessage((e as Error).message);
                }
              }}
            >
              <Icon name={state.theme === "dark" ? "sun" : "moon"} />
            </button>
          </div>
        </header>
        {message && (
          <p className="error-banner" role="alert">
            {message}
          </p>
        )}
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="site-footer">
          <span>The Physics of Sound · An independent learning academy</span>
          <Link href="/references">
            Scientific sources & model limits <span aria-hidden="true">↗</span>
          </Link>
        </footer>
      </div>
    </div>
  );
}
