import { Link } from "react-router-dom";

export function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 72 72" role="img">
        <defs>
          <linearGradient id="logoBlue" x1="8" x2="42" y1="7" y2="68" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0758dc" />
            <stop offset="1" stopColor="#06359f" />
          </linearGradient>
          <linearGradient id="logoTeal" x1="34" x2="70" y1="6" y2="68" gradientUnits="userSpaceOnUse">
            <stop stopColor="#20c5b7" />
            <stop offset="1" stopColor="#0d948d" />
          </linearGradient>
          <linearGradient id="logoAccent" x1="18" x2="58" y1="17" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#dffbff" />
          </linearGradient>
        </defs>
        <rect width="72" height="72" rx="16" fill="url(#logoBlue)" />
        <path d="M36 0h20c8.8 0 16 7.2 16 16v40c0 8.8-7.2 16-16 16H36V0Z" fill="url(#logoTeal)" />
        <path
          d="M22 19h14.5c10.4 0 18 7.1 18 17s-7.6 17-18 17H22V19Zm8.1 7.1v19.8h6c5.9 0 10.1-4.1 10.1-9.9s-4.2-9.9-10.1-9.9h-6Z"
          fill="url(#logoAccent)"
        />
        <path
          d="M49.4 18.4h5.9c2.2 0 4 1.8 4 4v5.9"
          fill="none"
          stroke="#ffb24a"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <circle cx="57.8" cy="51.5" r="3.4" fill="#ffb24a" />
        <circle cx="47.9" cy="51.5" r="3.4" fill="#ffb24a" />
      </svg>
    </span>
  );
}

export default function BrandLogo({ className = "", onClick, to = "/" }) {
  const classes = ["logo", "market-logo", className].filter(Boolean).join(" ");

  return (
    <Link
      to={to}
      className={classes}
      onClick={onClick}
      aria-label="Datamak Technologies home"
      data-testid="nav-logo-link"
    >
      <LogoMark />
      <span className="logo-copy">
        <strong>Datamak Technologies</strong>
        <small>Shop Smart. Build Fast. Host Secure.</small>
      </span>
    </Link>
  );
}
