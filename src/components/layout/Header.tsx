"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { name: "Work", href: "/#work" },
  { name: "Timeline", href: "/#timeline" },
  { name: "Tools", href: "/tools" },
];

const helloHref = "/#hello";

function LineIcon({ d }: { d: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <header className="border-b border-line bg-paper-raised">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-8 px-6">
        <Link
          href="/#top"
          className="text-[17px] font-medium tracking-[0.12em] text-ink no-underline"
          onClick={close}
        >
          Thomas Hung
        </Link>
        <nav aria-label="Main" className="ml-auto hidden gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[14px] tracking-[0.04em] text-ink-muted no-underline hover:text-ink"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href={helloHref}
            className="border-b-2 border-ink text-[14px] tracking-[0.04em] text-ink no-underline"
          >
            Say hello
          </Link>
        </nav>
        <button
          type="button"
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-[2px] border-0 bg-transparent text-ink hover:bg-paper-sunk md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <LineIcon d={menuOpen ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
        </button>
      </div>
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="flex flex-col border-t border-line bg-paper-raised px-6 py-2 md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={close}
              className="flex h-11 items-center text-[14px] tracking-[0.04em] text-ink-muted no-underline hover:text-ink"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href={helloHref}
            onClick={close}
            className="flex h-11 items-center text-[14px] tracking-[0.04em] text-ink no-underline"
          >
            Say hello
          </Link>
        </nav>
      )}
    </header>
  );
}
