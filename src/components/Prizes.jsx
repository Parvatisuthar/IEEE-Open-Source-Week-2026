
import { useEffect, useRef } from "react";
import "./Prizes.css";

const prizes = [
  {
    id: "01",
    place: "1st Place",
    icon: "🏆",
    description:
      "Cash Prize + Gold Medal + Exclusive IEEE Goodies + 1-Year IEEE Student Membership",
    className: "prizes-first",
  },
  {
    id: "02",
    place: "2nd Place",
    icon: "🥈",
    description:
      "Cash Prize + Silver Medal + IEEE Goodies + 1-Year IEEE Student Membership",
    className: "prizes-second",
  },
  {
    id: "03",
    place: "3rd Place",
    icon: "🥉",
    description:
      "Cash Prize + Bronze Medal + IEEE Goodies + 1-Year IEEE Student Membership",
    className: "prizes-third",
  },
];

function StarTunnel() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let animationId;
    let lastTime = 0;
    let stars = [];
    let disposed = false;

    const colors = [
      "#22d3ee",
      "#38bdf8",
      "#818cf8",
      "#a855f7",
      "#ec4899",
      "#f472b6",
      "#ffffff",
    ];

    const STAR_COUNT = 65;

    function createStar() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.6 + Math.random() * 1.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.35 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.5 + Math.random() * 1.2,
        driftX: (Math.random() - 0.5) * 5,
        driftY: (Math.random() - 0.5) * 5,
      };
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: STAR_COUNT }, createStar);
    }

    function draw(time) {
      if (disposed) return;

      const delta = lastTime
        ? Math.min((time - lastTime) / 1000, 0.04)
        : 0.016;

      lastTime = time;
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        star.x += star.driftX * delta;
        star.y += star.driftY * delta;
        star.phase += star.twinkleSpeed * delta;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const twinkle = 0.65 + 0.35 * Math.sin(star.phase);

        ctx.globalAlpha = star.alpha * twinkle;
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 5;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    }

    resize();
    animationId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="prizes-star-canvas"
      aria-hidden="true"
    />
  );
}

export default function Prizes() {
  return (
    <section id="prizes" className="osw-sec prizes-section">
      <StarTunnel />

      <div className="osw-w">
        <p className="osw-k">Recognition &amp; Rewards</p>

        <h2 className="osw-h2">
          Grand Prizes <span className="osw-out">&amp; Swag</span>
        </h2>

        <p className="prizes-intro">
          Celebrate your contributions with cash rewards, annual memberships,
          and official IEEE swag.
        </p>

        <div className="prizes-grid">
          {prizes.map((prize) => (
            <article
              className={`prize-card ${prize.className}`}
              key={prize.id}
            >
              <div className="prize-icon" aria-hidden="true">
                {prize.icon}
              </div>

              <h3>{prize.place}</h3>
              <p className="prize-description">{prize.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
