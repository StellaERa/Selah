import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
] as const;

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black px-6 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
        <Link href="/" className="text-lg font-semibold">
          Selah
        </Link>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/75">
            {FOOTER_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link className="transition-colors hover:text-white" href={href}>
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                className="transition-colors hover:text-white"
                href="https://github.com/StellaERa/Selah"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
