import { useEffect, useRef, useState } from "react";
import "./Timeline.css";

/* Edit this array to change content. Paste real links in the url fields. */
const EVENTS = [
  {
    date: "11th Nov 2025",
    title: "Registration Opens",
    desc: "Register yourself through unstop and join the discord channel.",
    links: [
      { label: "Register", url: "" },     // paste Unstop link here
      { label: "Join Discord", url: "" }, // paste Discord invite here
    ],
  },
  {
    date: "12th Nov - 18th Nov",
    title: "Contribution Period",
    desc: "Start contributing, collaborating, and bringing your ideas to life.",
    links: [{ label: "Guidelines", url: "" }], // paste guidelines link here
  },
  {
    date: "18th Nov 2025",
    title: "Closing Ceremony",
    desc: "A grand finale to an incredible open-source journey!",
    links: [],
  },
];

function Corner({ right }) {
  return (
    <svg
      className={right ? "otl-cr r" : "otl-cr"}
      viewBox="0 0 80 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M2 48C2 22 20 4 46 4c12 0 18 8 12 14-6 6-14 0-8-6" />
      <circle cx="64" cy="8" r="2.5" fill="currentColor" />
    </svg>
  );
}

export default function Timeline() {
  const [open, setOpen] = useState(0); // first card open by default
  const [height, setHeight] = useState(0);
  const bodies = useRef([]);

  useEffect(() => {
    const measure = () => {
      const el = bodies.current[open];
      setHeight(el ? el.scrollHeight : 0);
    };
    bodies.current.forEach((el, i) => {
      if (el) el.inert = i !== open; // collapsed cards can't be tabbed into
    });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open]);

  const toggle = (i) => setOpen((cur) => (cur === i ? -1 : i));

  return (
    <section id="timeline">
      <div className="otl-w">
        <div className="otl-cw" aria-hidden="true">
          <div className="otl-cube">
            <i></i><i></i><i></i><i></i><i></i><i></i>
          </div>
        </div>
        <div className="otl-grid" aria-hidden="true"></div>

        <p className="otl-k">Event timeline</p>
        <h2 className="otl-h2">
          The <span className="otl-out">commit</span>
          <br />
          log.
        </h2>

        <div className="otl-list">
          {EVENTS.map((e, i) => {
            const n = String(i + 1).padStart(2, "0");
            const on = open === i;
            return (
              <article
                key={e.title}
                className={"otl-item" + (on ? " on" : "")}
                style={on ? { height: height + "px" } : undefined}
                onClick={(ev) => {
                  if (ev.target.closest("a,.otl-btn")) return; // let links work
                  toggle(i);
                }}
              >
                <button type="button" className="otl-hd" aria-expanded={on}>
                  <b>⎇ {n}</b>
                  <em>{e.date}</em>
                  <span>{e.title}</span>
                </button>

                <div className="otl-body" ref={(el) => (bodies.current[i] = el)}>
                  <Corner />
                  <Corner right />
                  <div className="otl-nn" aria-hidden="true">{n}</div>
                  <div className="otl-tt">
                    <h3>{e.title}</h3>
                    <small>{e.date}</small>
                  </div>
                  <p className="otl-desc">{e.desc}</p>
                  {e.links.length > 0 && (
                    <div className="otl-acts">
                      {e.links.map((l, j) => {
                        const cls = "otl-btn" + (j === 0 ? " f" : "");
                        return l.url ? (
                          <a key={l.label} className={cls} href={l.url} target="_blank" rel="noopener noreferrer">
                            {l.label}
                          </a>
                        ) : (
                          <span key={l.label} className={cls} aria-disabled="true">
                            {l.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}