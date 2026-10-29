import { Fragment, useEffect, useRef, useState } from 'react';
import useReveal from '../hooks/useReveal';
import '../styles/osw-shared.css';
import './About.css';

/* ---------- EDIT CONTENT HERE ---------- */
const MANIFESTO =
  'Open Source Week is a one-week celebration of collaboration, learning, and innovation. Join us for an immersive experience featuring hands-on workshops, inspiring talks from industry leaders, and opportunities to contribute to real open-source projects.';
/* --------------------------------------- */

const WORDS = MANIFESTO.split(' ');
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Illustrative activity, not real GitHub contributions or verified event statistics.
const MILESTONES = [
  { title: 'Learn', description: 'Explore Git and open-source fundamentals.', command: 'git init' },
  { title: 'Develop', description: 'Build a feature and turn an idea into code.', command: 'git switch -c feature/new-idea' },
  { title: 'Grow', description: 'Receive feedback, improve, and ship your work.', command: 'git commit -m "Keep growing"' },
  { title: 'Collaborate', description: 'Review, support, and build with the community.', command: 'gh pr create' },
];
const START_DAY = Date.UTC(2026, 5, 8);
const DAY_MS = 24 * 60 * 60 * 1000;
const LEVELS = Array.from({ length: 140 }, (_, index) => {
  const value = (index * 37 + Math.floor(index / 5) * 17 + index * index * 3) % 31;
  return value < 5 ? 0 : value < 12 ? 1 : value < 19 ? 2 : value < 26 ? 3 : 4;
});
const CONTRIBUTION_COUNT = LEVELS.filter(Boolean).length;
const dateLabel = (index) => new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
}).format(new Date(START_DAY + index * DAY_MS));

const SAMPLE_CODE = `def main():
    # Welcome to IEEE Open Source Week!
    print("🚀 Learn, develop, grow—together!")

    workshops = [
        "Git & GitHub for Beginners",
        "Your First Open Source PR",
        "Building with Open Source",
        "AI Agents & Microservices"
    ]

    for workshop in workshops:
        print(f"  • {workshop}")

if __name__ == "__main__":
    main()`;

// Highlight complete and partially typed Python tokens without injecting HTML.
function highlightCode(text) {
  const pattern = /#[^\n]*|f?"(?:[^"\\]|\\.)*"?|\b(?:def|for|in|if)\b|\b(?:print|main)\b/g;
  const result = [];
  let position = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > position) result.push(text.slice(position, match.index));
    const token = match[0];
    const kind = token.startsWith('#') ? 'comment'
      : token.startsWith('"') || token.startsWith('f"') ? 'string'
        : /^(def|for|in|if)$/.test(token) ? 'keyword' : 'function';
    result.push(<span key={match.index} className={`about-syntax-${kind}`}>{token}</span>);
    position = match.index + token.length;
  }
  result.push(text.slice(position));
  return result;
}

function ContributionMap() {
  const [selected, setSelected] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const mapRef = useRef(null);
  const active = tooltip?.index ?? selected;
  const stage = active === null ? null : MILESTONES[active % MILESTONES.length];
  const rest = active !== null && LEVELS[active] === 0;

  const showTooltip = (index, element) => {
    const rect = element.getBoundingClientRect();
    const below = rect.top < 158;
    const x = Math.max(122, Math.min(window.innerWidth - 122, rect.left + rect.width / 2));
    setTooltip({ index, x, y: below ? rect.bottom + 12 : rect.top - 12, below });
  };

  const onCellKeyDown = (event, index) => {
    const offsets = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -5, ArrowRight: 5 };
    let next;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = LEVELS.length - 1;
    else if (Object.hasOwn(offsets, event.key)) next = index + offsets[event.key];
    else return;
    event.preventDefault();
    next = Math.max(0, Math.min(LEVELS.length - 1, next));
    setFocusIndex(next);
    mapRef.current?.querySelectorAll('button')[next]?.focus();
  };

  return (
    <article className="about-widget about-contrib" aria-labelledby="about-contrib-title">
      <div className="about-widget-head">
        <span className="about-widget-kicker">01 / THE JOURNEY</span>
        <span className="about-widget-status"><i aria-hidden="true" /> INTERACTIVE DEMO</span>
      </div>
      <h3 id="about-contrib-title">Every square tells a story<span className="about-accent">.</span></h3>
      <p className="about-widget-sub">Explore the journey from your first lesson to your next big contribution.</p>
      <div className="about-map-panel">
        <div className="about-map-heading">
          <span><strong>{CONTRIBUTION_COUNT}</strong> sample contributions</span>
          <span className="about-map-period">JUN — OCT 2026</span>
        </div>
        <div className="about-map-scroll">
          <div className="about-map" ref={mapRef} role="group" aria-label="Illustrative open-source activity. Hover, tap, or use arrow keys to explore milestones.">
            {LEVELS.map((level, index) => (
              <button
                type="button"
                key={index}
                className={`about-cell about-level-${level}${selected === index ? ' about-chosen' : ''}`}
                aria-label={`${dateLabel(index)}: ${level === 0 ? 'Rest day' : MILESTONES[index % 4].title} (sample)`}
                aria-pressed={selected === index}
                tabIndex={focusIndex === index ? 0 : -1}
                onPointerEnter={(event) => { if (event.pointerType !== 'touch') showTooltip(index, event.currentTarget); }}
                onPointerLeave={() => setTooltip(null)}
                onFocus={(event) => showTooltip(index, event.currentTarget)}
                onBlur={() => setTooltip(null)}
                onClick={() => { setSelected(index); setFocusIndex(index); }}
                onKeyDown={(event) => onCellKeyDown(event, index)}
              />
            ))}
          </div>
        </div>
        <div className="about-map-key" aria-hidden="true">
          <span>LESS</span>{[0, 1, 2, 3, 4].map((level) => <i key={level} className={`about-level-${level}`} />)}<span>MORE</span>
        </div>
      </div>
      <div className="about-milestone" aria-live="polite" aria-atomic="true">
        <span className="about-milestone-label">{active === null ? 'HOVER / TAP A SQUARE' : `${dateLabel(active).toUpperCase()} · ILLUSTRATIVE`}</span>
        <strong>{active === null ? 'Learn → Develop → Grow' : rest ? 'Rest & reflect' : stage.title}</strong>
        <p>{active === null ? 'Pick a day to discover the milestones behind open-source contributions.' : rest ? 'Even great contributors need time to recharge.' : stage.description}</p>
      </div>
      <p className="about-sample-note">Sample activity for this design preview — not real GitHub statistics.</p>
      {tooltip && (
        <div className={`about-tooltip${tooltip.below ? ' about-tooltip-below' : ''}`} role="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          <div className="about-tooltip-top"><span>{dateLabel(tooltip.index)}</span><span>DEMO</span></div>
          <strong>{LEVELS[tooltip.index] === 0 ? 'Rest & reflect' : MILESTONES[tooltip.index % 4].title}</strong>
          <span>{LEVELS[tooltip.index] === 0 ? 'A little pause before the next commit.' : MILESTONES[tooltip.index % 4].description}</span>
          <code>{LEVELS[tooltip.index] === 0 ? '// rest day' : MILESTONES[tooltip.index % 4].command}</code>
        </div>
      )}
    </article>
  );
}

function TypewriterEditor() {
  const [editorRef, editorVisible] = useReveal(0.16);
  const [characters, setCharacters] = useState(() => (reducedMotion() ? SAMPLE_CODE.length : 0));
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    if (!editorVisible) return undefined;
    if (reducedMotion()) return undefined;
    let position = 0;
    const timer = window.setInterval(() => {
      position = Math.min(SAMPLE_CODE.length, position + 3);
      setCharacters(position);
      if (position === SAMPLE_CODE.length) window.clearInterval(timer);
    }, 19);
    return () => window.clearInterval(timer);
  }, [editorVisible, replay]);

  return (
    <article ref={editorRef} className="about-widget about-editor" aria-labelledby="about-editor-title">
      <div className="about-widget-head">
        <span className="about-widget-kicker">02 / WRITE YOUR STORY</span>
        <span className="about-widget-status"><i aria-hidden="true" /> LIVE TYPING</span>
      </div>
      <h3 id="about-editor-title">Start with one line<span className="about-accent">.</span></h3>
      <p className="about-widget-sub">A little code, a lot of possibility. Watch an open-source week come to life.</p>
      <div className="about-code-window">
        <div className="about-code-bar">
          <div className="about-window-dots" aria-hidden="true"><i /><i /><i /></div>
          <span>open_source_week.py</span>
          <span className="about-code-lang">PYTHON</span>
        </div>
        <div className="about-code-body">
          <pre aria-label="Illustrative Python program for IEEE Open Source Week"><code aria-hidden="true">{highlightCode(SAMPLE_CODE.slice(0, characters))}</code><span className="about-code-caret" aria-hidden="true" /></pre>
        </div>
        <div className="about-code-bottom">
          <span><i aria-hidden="true" /> ready to build</span>
          <button type="button" onClick={() => { setCharacters(reducedMotion() ? SAMPLE_CODE.length : 0); setReplay((value) => value + 1); }} aria-label="Replay the code typing animation">↻ REPLAY</button>
        </div>
      </div>
      <p className="about-sample-note">Illustrative code snippet — update the workshop names once confirmed.</p>
    </article>
  );
}

export default function About() {
  const textRef = useRef(null);
  // how many words are highlighted (all of them if the user prefers reduced motion)
  const [lit, setLit] = useState(() => (reducedMotion() ? WORDS.length : 0));
  const [widgetsRef, widgetsIn] = useReveal();

  // Words light up one by one as the paragraph scrolls into view
  useEffect(() => {
    if (reducedMotion()) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = textRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = (window.innerHeight * 0.88 - r.top) / (r.height + window.innerHeight * 0.25);
      setLit(Math.max(0, Math.min(WORDS.length, Math.ceil(p * WORDS.length))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="about" className="osw-sec about">
      <div className="osw-w about-grid">
        <div className="about-big0" aria-hidden="true">00</div>
        <div>
          <h2 className="osw-sr">About Open Source Week</h2>
          <p className="osw-k">About</p>
          <p className="about-mf" ref={textRef}>
            {WORDS.map((w, i) => (
              <Fragment key={i}>
                {i > 0 && ' '}
                <span className={i < lit ? 'on' : undefined}>{w}</span>
              </Fragment>
            ))}
          </p>
        </div>
      </div>
      {/* Center the two demos side by side beneath the original text. */}
      <div ref={widgetsRef} className={`about-widgets osw-rv${widgetsIn ? ' in' : ''}`}>
        <ContributionMap />
        <TypewriterEditor />
      </div>
    </section>
  );
}
