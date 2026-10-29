import "./UpcomingEvents.css";

const events = [
  {
    tag: "Talk",
    date: "12 Nov 2025",
    title: "Transforming Ideas into Impact through Code, Mentorship and AI Automation",
    speaker: "Paras Atal",
    time: "11:00 AM - 1:00 PM",
    venue: "Auditorium, IGDTUW",
    desc: "Dive into a live session exploring how code, mentorship, and AI automation can transform ideas into impactful real-world innovations.",
    url: "", // add registration / details link here
  },
  {
    tag: "Talk",
    date: "12 Nov 2025",
    title: "Building Impact through Open Source: GirlScript and Dev Guild",
    speaker: "Anubha Maneshwar",
    time: "8:00 PM",
    venue: "Webex Meet",
    desc: "Discover how open-source collaboration drives real-world impact with insights from GirlScript and Dev Guild.",
    url: "",
  },
  {
    tag: "Workshop",
    date: "13 Nov 2025",
    title: "Professional Development Workshop",
    speaker: "Megha Gupta",
    time: "1:00 PM",
    venue: "Seminar Hall, IGDTUW",
    desc: "Be a part of an insightful session on mental wellbeing and personal growth with youth wellbeing expert Megha Gupta.",
    url: "",
  },
  {
    tag: "Coming Soon",
    date: "Date TBA",
    title: "To be announced",
    desc: "Another session is on the way. Stay tuned.",
    url: "",
    soon: true,
  },
];

// 3D tilt on pointer move (same effect as the HTML version)
const tiltMove = (e) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`;
};
const tiltLeave = (e) => {
  e.currentTarget.style.transform = "";
};

export default function UpcomingEvents() {
  return (
    <section id="events" className="osw-sec upcoming-events">
      <div className="osw-w">
        <p className="osw-k">Upcoming events</p>

        <h2 className="osw-h2">
          Next <span className="osw-out">up.</span>
        </h2>

        <div
          className="upcoming-events-list"
          tabIndex={0}
          aria-label="Upcoming events, scroll horizontally"
        >
          {events.map((event, i) => (
            <article
              className={`upcoming-event-card${event.soon ? " is-soon" : ""}`}
              key={i}
              onPointerMove={tiltMove}
              onPointerLeave={tiltLeave}
            >
              <span className="upcoming-event-number" aria-hidden="true">
                0{i + 1}
              </span>

              <span className="upcoming-event-meta">
                {event.tag} · {event.date}
              </span>

              <h3>{event.title}</h3>

              {event.speaker && (
                <p className="upcoming-event-speaker">with {event.speaker}</p>
              )}

              {event.time && (
                <p className="upcoming-event-info">
                  {event.time}
                  <br />
                  {event.venue}
                </p>
              )}

              <p className="upcoming-event-description">{event.desc}</p>

              {event.url ? (
                <a
                  className="upcoming-event-link"
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Details
                </a>
              ) : (
                <span className="upcoming-event-link" aria-disabled="true">
                  {event.soon ? "Stay tuned" : "Link coming soon"}
                </span>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}