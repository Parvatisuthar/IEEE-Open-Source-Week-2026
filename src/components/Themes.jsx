import { useCallback, useLayoutEffect, useRef, useState } from "react";
import "./Themes.css";

/* ---------- data (edit here, not in the JSX) ---------- */
const THEMES = [
  { title: "Git & collaboration", desc: "Version control, branching and pull request etiquette.", cmd: "git checkout -b first-contribution" },
  { title: "Contributing to OSS", desc: "Finding projects, reading codebases, opening your first issue.", cmd: 'gh issue list --label "good first issue"' },
  { title: "Developer tooling", desc: "Editors, CI/CD, containers and automation.", cmd: "docker compose up --build" },
  { title: "AI & data, open", desc: "Open models, datasets and responsible sharing.", cmd: "pip install your-open-project" },
];

const EASE = "cubic-bezier(.22,1,.36,1)"; 
const SLIDE = 64;                        
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pad = (n) => String(n + 1).padStart(2, "0");


function Panel({ id, index, dir, exiting, onExited }) {
  const ref = useRef(null);
  const t = THEMES[index];

  useLayoutEffect(() => {
    const el = ref.current;
    if (!exiting && dir === 0) return; 

    if (!el || !el.animate || reduceMotion()) {
      if (exiting) onExited(id);
      return;
    }

    const x = dir * SLIDE; 
    if (exiting) {
   
      el.animate({ opacity: 0, transform: `translateX(${-x}px)` }, { duration: 320, easing: EASE, fill: "both" })
        .finished.then(() => onExited(id), () => {});
    } else {
      el.animate(
        [{ opacity: 0, transform: `translateX(${x}px)` }, { opacity: 1, transform: "translateX(0)" }],
        { duration: 480, easing: EASE, fill: "both" }
      );
    }
  }, [exiting, dir, id, onExited]);

  return (
    <div ref={ref} className={`th-content${exiting ? " th-content--exit" : ""}`} aria-hidden={exiting || undefined}>
      <div className="th-dots" aria-hidden="true"><i /><i /><i /></div>
      <div className="th-num" aria-hidden="true">{pad(index)}</div>
      <h3>{t.title}</h3>
      <p>{t.desc}</p>
      <pre><i>$</i> {t.cmd}</pre>
    </div>
  );
}


export default function Themes() {
  const [active, setActive] = useState(0);
  const [panels, setPanels] = useState([{ id: 0, index: 0, dir: 0, exiting: false }]);
  const nextId = useRef(1);
  const tabRefs = useRef([]);
  const panelRef = useRef(null);

  const remove = useCallback((id) => setPanels((ps) => ps.filter((p) => p.id !== id)), []);

  const select = (i, fromUser = false) => {
    if (i === active) return;
    const dir = i > active ? 1 : -1;
    const id = nextId.current++;
    setActive(i);
    setPanels((ps) => [
      ...ps.map((p) => (p.exiting ? p : { ...p, exiting: true, dir })), 
      { id, index: i, dir, exiting: false },                            
    ]);
    // on phones the card sits under the list: make sure it's visible
    if (fromUser && window.matchMedia("(max-width: 860px)").matches) {
      panelRef.current?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "nearest" });
    }
  };

  const onKeyDown = (e, i) => {
    const L = THEMES.length;
    const n = /Down|Right/.test(e.key) ? (i + 1) % L
      : /Up|Left/.test(e.key) ? (i - 1 + L) % L
      : e.key === "Home" ? 0 : e.key === "End" ? L - 1 : -1;
    if (n < 0) return;
    e.preventDefault();
    tabRefs.current[n]?.focus();
    select(n);
  };

 
  const onMove = (e) => {
    if (e.pointerType === "touch" || reduceMotion()) return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`;
  };
  const onLeave = (e) => { e.currentTarget.style.transform = ""; };

  return (
    <section id="themes" className="th-section">
      <div className="th-wrap">
        <div>
          <p className="th-kicker">Themes</p>
          <div className="th-list" role="tablist" aria-label="Themes">
            {THEMES.map((t, i) => (
              <button
                key={t.title}
                ref={(el) => { tabRefs.current[i] = el; }}
                id={`th-tab-${i}`}
                type="button"
                role="tab"
                className="th-tab"
                aria-selected={i === active}
                aria-controls="th-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => select(i, true)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <small>{pad(i)}</small>{
                <span>{t.title}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="th-scene">
          <div
            ref={panelRef}
            id="th-panel"
            className="th-panel"
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`th-tab-${active}`}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
          >
            {panels.map((p) => <Panel key={p.id} {...p} onExited={remove} />)}
          </div>
        </div>
      </div>
    </section>
  );
}