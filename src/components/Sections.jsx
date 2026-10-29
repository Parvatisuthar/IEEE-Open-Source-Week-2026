import { Fragment, useEffect, useRef, useState } from "react";
import { CONFIG as C } from "../data/config";

const Cube = ({ cls }) => (
  <div className={"cw " + cls} aria-hidden="true">
    <div className="cube"><i /><i /><i /><i /><i /><i /></div>
  </div>
);

/* ---------- Ticker ---------- */
export function Ticker() {
  const items = [...Array(4)].flatMap(() => C.ticker);
  return (
    <div className="tk" aria-hidden="true">
      <div>
        {items.map((t, i) => (
          <Fragment key={i}>
            <span>{t}</span>
            <i>✦</i>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

/* ---------- About ---------- */
export function About() {
  const mf = useRef(null);
  const words = C.manifesto.split(" ");

  useEffect(() => {
    const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ws = [...mf.current.querySelectorAll("span")];
    if (RM) { ws.forEach((w) => w.classList.add("on")); return; }
    const onS = () => {
      const r = mf.current.getBoundingClientRect();
      const p = (window.innerHeight * 0.88 - r.top) / (r.height + window.innerHeight * 0.25);
      ws.forEach((w, i) => w.classList.toggle("on", i / ws.length < p));
    };
    window.addEventListener("scroll", onS, { passive: true });
    window.addEventListener("resize", onS);
    onS();
    return () => {
      window.removeEventListener("scroll", onS);
      window.removeEventListener("resize", onS);
    };
  }, []);

  return (
    <section id="about">
      <div className="w">
        <div className="big0" aria-hidden="true">00</div>
        <div>
          <p className="k">About</p>
          <p className="mf" ref={mf}>
            {words.map((w, i) => (
              <span key={i}>{w}{i < words.length - 1 ? " " : ""}</span>
            ))}
          </p>
          <div className="pts rv">
            {C.points.map((p) => (
              <div key={p[0]}><h3>{p[0]}</h3><p>{p[1]}</p></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Highlights ---------- */
export function Highlights() {
  return (
    <section id="highlights" style={{ paddingTop: 0 }}>
      <div className="w">
        <p className="k rv">Highlights</p>
        <h2 className="rv">What<br /><span className="out">happens.</span></h2>
        <div>
          {C.highlights.map((h, i) => (
            <div className="row rv" tabIndex={0} key={h[0]}>
              <em>0{i + 1}</em><h3>{h[0]}</h3><p>{h[1]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Themes ---------- */
export function Themes() {
  const [i, setI] = useState(0);
  const t = C.themes[i];
  const onKey = (e, idx) => {
    const n = /Down|Right/.test(e.key) ? 1 : /Up|Left/.test(e.key) ? -1 : 0;
    if (!n) return;
    e.preventDefault();
    e.currentTarget.parentElement.children[(idx + n + C.themes.length) % C.themes.length].focus();
  };
  return (
    <section id="themes">
      <div className="w">
        <div>
          <p className="k">Themes</p>
          <div className="tl" role="tablist" aria-label="Themes">
            {C.themes.map((th, idx) => (
              <button
                key={th[0]}
                className="tb"
                role="tab"
                aria-selected={i === idx}
                tabIndex={i === idx ? 0 : -1}
                onClick={() => setI(idx)}
                onFocus={() => setI(idx)}
                onPointerEnter={() => setI(idx)}
                onKeyDown={(e) => onKey(e, idx)}
              >
                <small>0{idx + 1}</small>{th[0]}
              </button>
            ))}
          </div>
        </div>
        <div className="scene">
          <Cube cls="th" />
          <div className="pgrid" aria-hidden="true" />
          <div className="pn tilt" id="pn" role="tabpanel" tabIndex={0}>
            <div className="dots"><i /><i /><i /></div>
            <div className="nm" aria-hidden="true">0{i + 1}</div>
            <h3>{t[0]}</h3>
            <p>{t[1]}</p>
            <pre><i>$</i> {t[2]}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Timeline ---------- */
export function Timeline() {
  const [d, setD] = useState(0);
  return (
    <section id="timeline">
      <div className="w">
        <Cube cls="tc" />
        <div className="tgrid" aria-hidden="true" />
        <p className="k rv">Event timeline</p>
        <h2 className="rv">The <span className="out">commit</span><br />log.</h2>
        <div className="br" role="tablist" aria-label="Days">
          {C.days.map((day, i) => (
            <button key={day.label} role="tab" aria-selected={d === i} onClick={() => setD(i)}>
              ⎇ {day.label}
            </button>
          ))}
        </div>
        <ol className="gl" key={d}>
          {C.days[d].slots.map((s, i) => (
            <li key={i}>
              <time>{s[0]}</time>
              <div><h3>{s[1]}</h3><p>{s[2]}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Events ---------- */
export function Events() {
  return (
    <section id="events">
      <div className="w">
        <p className="k">Upcoming events</p>
        <h2>Next <span className="out">up.</span></h2>
        <div className="sn" tabIndex={0} aria-label="Upcoming events, scroll horizontally">
          {C.events.map((e, i) => (
            <article className="sl tilt" key={i}>
              <span className="n" aria-hidden="true">0{i + 1}</span>
              <span className="tag">{e.tag} · {e.date}</span>
              <h3>{e.title}</h3>
              <p>{e.desc}</p>
              {e.url ? (
                <a className="btn" href={e.url} target="_blank" rel="noopener noreferrer">Details</a>
              ) : (
                <span className="btn" aria-disabled="true">Link coming soon</span>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Speakers ---------- */
export function Speakers() {
  return (
    <section id="speakers">
      <div className="w">
        <p className="k rv">Speakers</p>
        <h2 className="rv">Voices<br /><span className="out">of the stack.</span></h2>
        <div className="sp">
          {C.speakers.map((s, i) => (
            <figure className="sk rv" style={{ marginInline: 0 }} key={i}>
              <div className="pt">{s.img ? <img src={s.img} alt="" /> : "?"}</div>
              <h3>{s.name}</h3>
              <p>{s.role}</p>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Register ---------- */
export function Register() {
  const has = !!C.registerUrl;
  return (
    <section id="register">
      <div className="gh" aria-hidden="true">JOIN</div>
      <div className="w">
        <p className="k" style={{ justifyContent: "center" }}>Registration</p>
        <h2>Claim your <span className="out">seat.</span></h2>
        <p className="l">{C.registerText}</p>
        <span id="mg">
          <a
            className="btn f"
            id="rb"
            style={{ fontSize: 16, padding: "20px 38px" }}
            {...(has
              ? { href: C.registerUrl, target: "_blank", rel: "noopener noreferrer" }
              : { "aria-disabled": "true" })}
          >
            {has ? "Register now →" : "Registration opens soon"}
          </a>
        </span>
        <div className="st">
          {C.steps.map((s) => <span key={s}>{s}</span>)}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
export function Faq() {
  return (
    <section id="faq" style={{ paddingTop: 0 }}>
      <div className="w">
        <p className="k rv">FAQs</p>
        <h2 className="rv">Ask<br /><span className="out">anything.</span></h2>
        <div className="fq">
          {C.faqs.map((f) => (
            <details key={f[0]}><summary>{f[0]}</summary><p>{f[1]}</p></details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
export function Contact() {
  return (
    <section id="contact" style={{ paddingTop: 0 }}>
      <div className="w">
        <p className="k rv">Contact</p>
        <div className="ct">
          {C.contacts.map((c) =>
            c[2] ? (
              <a href={c[2]} key={c[0]} target="_blank" rel="noopener noreferrer">
                <small>{c[0]}</small><span>{c[1] || c[0]}</span>
              </a>
            ) : (
              <div key={c[0]}>
                <small>{c[0]}</small><span className="e">{c[1] || "Coming soon"}</span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
export function Footer() {
  return (
    <footer>
      <div className="w">
        <div className="big" aria-hidden="true">Open Source Week</div>
        <div>
          <span>{C.footer}</span>
          <span>IGDTUW · Delhi</span>
          <a href="#hero">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
