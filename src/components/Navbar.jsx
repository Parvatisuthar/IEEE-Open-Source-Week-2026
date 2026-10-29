import { useState } from "react";
import logo from "../assets/ieee-logo.png"; // adjust path if you keep the logo elsewhere

const LINKS = [
  ["About", "#about"],
  ["Highlights", "#highlights"],
  ["Themes", "#themes"],
  ["Timeline", "#timeline"],
  ["Events", "#events"],
  ["Speakers", "#speakers"],
  ["FAQ", "#faq"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav aria-label="Primary">
      <div className="w">
        <a className="lg" href="#hero" aria-label="IEEE IGDTUW – Home">
          <img src={logo} alt="IEEE IGDTUW" />
        </a>
        <button
          className="bg"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>
        <div className={"ls" + (open ? " o" : "")} id="ls" onClick={(e) => e.target.tagName === "A" && setOpen(false)}>
          {LINKS.map(([t, h]) => (
            <a key={h} href={h}>{t}</a>
          ))}
          <a className="btn" href="#register">Register</a>
        </div>
      </div>
    </nav>
  );
}
