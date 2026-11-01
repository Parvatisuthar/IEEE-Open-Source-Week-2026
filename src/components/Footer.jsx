
import { useEffect, useRef } from "react";
import "./Footer.css";
import logo from "../assets/ieee-logo.png";

/* ---------- EDIT CONTENT HERE ---------- */

const TAGLINE =
  "Advancing technology for humanity, powered by women who engineer the future.";

const EMAIL = "ieeeigdtu@gmail.com";
const ADDRESS = "Kashmere Gate, Delhi 110006";

const SOCIALS = [
  {
    label: "Instagram",
    url: "https://www.instagram.com/ieeeigdtuw/",
    icon: "instagram",
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/ieee-igdtuw/",
    icon: "linkedin",
  },
  {
    label: "Email",
    url: `mailto:${EMAIL}`,
    icon: "mail",
  },
];

const DOT_RGB = "56,214,255";
const LINE_RGB = "47,91,255";

/* --------------------------------------- */

function Icon({ type }) {
  const common = {
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    className: "ft-icon",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === "instagram") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle
          cx="17.5"
          cy="6.5"
          r="0.8"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    );
  }

  if (type === "linkedin") {
    return (
      <svg {...common}>
        <path d="M7 10v7M7 7v.01M11 17v-7M11 13a3 3 0 0 1 6 0v4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

/* Actual IEEE IGDTUW logo */
function Logo() {
  return (
    <a
      href="#hero"
      className="ft-logo"
      aria-label="IEEE IGDTUW home"
    >
      <img
        src={logo}
        alt="IEEE IGDTUW"
        className="ft-logo-img"
      />
    </a>
  );
}

/* Drifting dots + connecting lines */
function Constellation() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;

    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const LINK = 150;

    let w = 0;
    let h = 0;
    let nodes = [];
    let raf = 0;
    let visible = true;

    const build = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      w = r.width;
      h = r.height;

      canvas.width = w * dpr;
      canvas.height = h * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round((w * h) / 20000);

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.1 + 0.6,
        t: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      if (!reduce) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          n.t += 0.02;

          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          const d = Math.hypot(a.x - b.x, a.y - b.y);

          if (d < LINK) {
            ctx.strokeStyle = `rgba(${LINE_RGB},${
  (1 - d / LINK) * 0.35
})`;

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = `rgba(${DOT_RGB},${
  0.4 + 0.35 * Math.sin(n.t)
})`;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (visible) draw();

      raf = requestAnimationFrame(loop);
    };

    build();

    if (reduce) {
      draw();
    } else {
      loop();
    }

    const ro = new ResizeObserver(() => {
      build();

      if (reduce) draw();
    });

    ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="ft-canvas"
      aria-hidden="true"
    />
  );
}

export default function Footer() {
  const bigRef = useRef(null);

  const onMove = (e) => {
    const el = bigRef.current;

    if (!el) return;

    const r = el.getBoundingClientRect();

    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.dataset.active = "true";
  };

  const onLeave = () => {
    if (bigRef.current) {
      bigRef.current.dataset.active = "false";
    }
  };

  return (
    <footer
      className="ft"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <Constellation />

      <div className="ft-wrap">
        <div className="ft-grid">

          {/* Brand and actual IEEE IGDTUW logo */}
          <div className="ft-brand">
            <Logo />
            <p className="ft-tag">{TAGLINE}</p>
          </div>

          {/* Quick Links removed */}

          {/* Contact */}
          <div>
            <h3 className="ft-h">Contact</h3>

            <ul className="ft-list">
              <li>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </li>

              <li>{ADDRESS}</li>
            </ul>
          </div>

          {/* Social media */}
          <div>
            <h3 className="ft-h">Follow along</h3>

            <div className="ft-socials">
              {SOCIALS.map(({ label, url, icon }) => (
                <a
                  key={label}
                  className="ft-social"
                  href={url}
                  aria-label={
                    label === "Email"
                      ? `Email IEEE IGDTUW at ${EMAIL}`
                      : `Visit IEEE IGDTUW on ${label}`
                  }
                  {...(url.startsWith("http")
                    ? {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {})}
                >
                  <Icon type={icon} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Animated footer wordmark */}
      <div
        className="ft-big"
        ref={bigRef}
        data-active="false"
        aria-hidden="true"
      >
        <span className="ft-big-outline">IEEE IGDTUW</span>
        <span className="ft-big-fill">IEEE IGDTUW</span>
      </div>
    </footer>
  );
}
