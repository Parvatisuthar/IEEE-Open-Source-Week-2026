import { useEffect, useRef, useState } from "react";
import "./FAQs.css";

const FAQ_CATEGORIES = [
  { label: "All Queries", value: "all" },
  { label: "General", value: "general" },
  { label: "Eligibility", value: "eligibility" },
  { label: "Experience", value: "experience" },
  { label: "Swags & Perks", value: "prizes" },
];

const FAQ_ITEMS = [
  {
    id: 1,
    category: "general",
    question: "What is Open Source Week?",
    answer:
      "Open Source Week is a premier 7-day technical festival hosted by IEEE IGDTUW, uniting students, industry mentors, and maintainers. It includes hands-on Git workshops, open-source project hacking, keynote fireside chats, and swags.",
  },
  {
    id: 2,
    category: "eligibility",
    question: "Who can participate in Open Source Week?",
    answer:
      "Any enrolled college student curious about open source, coding, and collaborative engineering can participate. Both solo contributors and collaborative squads from all branches and years are welcome.",
  },
  {
    id: 3,
    category: "experience",
    question: "Do I need prior open-source experience to join?",
    answer:
      "Absolutely NOT! We have dedicated beginner-friendly tracks, including Git & GitHub for Beginners and Creating Your First Open Source Pull Request. Mentors guide you throughout.",
  },
  {
    id: 4,
    category: "general",
    question: "Is there any registration fee?",
    answer:
      "Registration is completely FREE. You can register through Unstop and join our Discord community.",
  },
  {
    id: 5,
    category: "prizes",
    question: "Will I get certificates and exclusive goodies?",
    answer:
      "Yes. Active participants receive official IEEE IGDTUW certificates, while top contributors win cash prizes, medals, and IEEE swags.",
  },
];

const BACKGROUND_PHRASES = [
  "?",
  "¿",
  "💡",
  "❓",
  "How to submit PR?",
  "Is it free?",
  "Can I join solo?",
  "Swags?",
  "First Year eligible?",
  "No Git experience?",
  "What if code breaks?",
  "Discord link?",
  "Certificates?",
];

const PARTICLE_COLORS = [
  "#22e4ff",
  "#8b5cff",
  "#ff4fd8",
  "#00f5a0",
];

const PARTICLE_COUNT = 26;

function createParticle(width, height) {
  return {
    text:
      BACKGROUND_PHRASES[
        Math.floor(Math.random() * BACKGROUND_PHRASES.length)
      ],
    x: Math.random() * Math.max(width, 1),
    y: Math.random() * Math.max(height, 1),
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    size: Math.random() * 6 + 12,
    opacity: Math.random() * 0.35 + 0.15,
    color:
      PARTICLE_COLORS[
        Math.floor(Math.random() * PARTICLE_COLORS.length)
      ],
  };
}

function Faqs() {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [openFAQ, setOpenFAQ] = useState(1);

  const visibleFAQs = FAQ_ITEMS.filter(
    (item) =>
      activeCategory === "all" ||
      item.category === activeCategory
  );

 useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!wrapper || !canvas || !context) return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let width = 0;
    let height = 0;
    let animationFrame = null;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    let particles = [];

    const mouse = { x: -1000, y: -1000 };

    function resizeCanvas() {
      const rect = wrapper.getBoundingClientRect();
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );

      if (particles.length === 0) {
        particles = Array.from(
          { length: PARTICLE_COUNT },
          () => createParticle(width, height)
        );
      } else {
        particles.forEach((particle) => {
          particle.x = Math.min(
            particle.x,
            Math.max(0, width - 10)
          );
          particle.y = Math.min(
            particle.y,
            Math.max(18, height - 10)
          );
        });
      }

      if (reducedMotion.matches) {
        drawStaticBackground();
      }
    }

    function drawParticle(particle) {
      context.globalAlpha = particle.opacity;
      context.fillStyle = particle.color;
      context.font = `500 ${particle.size}px monospace`;
      context.fillText(
        particle.text,
        particle.x,
        particle.y
      );
    }

    function drawStaticBackground() {
      context.clearRect(0, 0, width, height);

      particles.forEach(drawParticle);
      context.globalAlpha = 1;
    }

    function updateParticle(particle) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 10 || particle.x > width - 10) {
        particle.vx *= -1;
        particle.x = Math.max(
          10,
          Math.min(width - 10, particle.x)
        );
      }

      if (particle.y < 18 || particle.y > height - 10) {
        particle.vy *= -1;
        particle.y = Math.max(
          18,
          Math.min(height - 10, particle.y)
        );
      }

      const dx = particle.x - mouse.x;
      const dy = particle.y - mouse.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 120 && distance > 0) {
        const force = (120 - distance) / 120;

        particle.x += (dx / distance) * force * 5;
        particle.y += (dy / distance) * force * 5;
      }

      drawParticle(particle);
    }

    function animate() {
      animationFrame = null;

      if (
        reducedMotion.matches ||
        !isVisible ||
        !isPageVisible
      ) {
        return;
      }

      context.clearRect(0, 0, width, height);

      particles.forEach(updateParticle);
      context.globalAlpha = 1;

      animationFrame = window.requestAnimationFrame(animate);
    }

    function startAnimation() {
      if (
        reducedMotion.matches ||
        !isVisible ||
        !isPageVisible ||
        animationFrame !== null
      ) {
        return;
      }

      animationFrame = window.requestAnimationFrame(animate);
    }

    function stopAnimation() {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    }

    function syncMotionPreference() {
      stopAnimation();

      if (reducedMotion.matches) {
        drawStaticBackground();
      } else {
        startAnimation();
      }
    }

    function handlePointerMove(event) {
      if (event.pointerType === "touch") return;

      const rect = wrapper.getBoundingClientRect();

      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    }

    function resetMouse() {
      mouse.x = -1000;
      mouse.y = -1000;
    }

    function handleVisibilityChange() {
      isPageVisible = !document.hidden;

      if (isPageVisible) {
        startAnimation();
      } else {
        stopAnimation();
      }
    }

    wrapper.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true }
    );

    wrapper.addEventListener("pointerleave", resetMouse);
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    let resizeObserver;
    let visibilityObserver;

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(wrapper);
    } else {
      window.addEventListener("resize", resizeCanvas);
    }

    if ("IntersectionObserver" in window) {
      visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;

          if (isVisible) {
            startAnimation();
          } else {
            stopAnimation();
          }
        }
      );

      visibilityObserver.observe(wrapper);
    }

    if (typeof reducedMotion.addEventListener === "function") {
      reducedMotion.addEventListener(
        "change",
        syncMotionPreference
      );
    } else {
      reducedMotion.addListener(syncMotionPreference);
    }

    resizeCanvas();
    syncMotionPreference();

    return () => {
      stopAnimation();

      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();

      wrapper.removeEventListener(
        "pointermove",
        handlePointerMove
      );
      wrapper.removeEventListener(
        "pointerleave",
        resetMouse
      );
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
      window.removeEventListener("resize", resizeCanvas);

      if (typeof reducedMotion.removeEventListener === "function") {
        reducedMotion.removeEventListener(
          "change",
          syncMotionPreference
        );
      } else {
        reducedMotion.removeListener(syncMotionPreference);
      }
    };
  }, []);

  useEffect(() => {
    const currentFAQ = FAQ_ITEMS.find(
      (item) => item.id === openFAQ
    );

    if (
      currentFAQ &&
      activeCategory !== "all" &&
      currentFAQ.category !== activeCategory
    ) {
      setOpenFAQ(null);
    }
  }, [activeCategory, openFAQ]);

  function handleCategoryChange(category) {
    setActiveCategory(category);
  }

  function toggleFAQ(id) {
    setOpenFAQ((current) => (current === id ? null : id));
  }

  return (
    <section className="faqs-section" aria-labelledby="faqs-heading">
      <div className="faqs-wrapper" ref={wrapperRef}>
        <canvas
          className="faqs-background-canvas"
          ref={canvasRef}
          aria-hidden="true"
        />

        <div className="faqs-section-badge" aria-hidden="true">
          COMMUNITY KNOWLEDGE BASE
        </div>

        <div className="faqs-inner">
          <header className="faqs-section-header">
            <h1
              id="faqs-heading"
              className="faqs-main-heading"
            >
              FREQUENTLY{" "}
              <span className="faqs-heading-outline">
                ASKED QUESTIONS
              </span>
            </h1>

            <p className="faqs-section-lead">
              Got queries? We've got answers. Explore everything
              you need to know about Open Source Week.
            </p>
          </header>

          <div
            className="faqs-tabs"
            role="group"
            aria-label="Filter frequently asked questions"
          >
            {FAQ_CATEGORIES.map((category) => {
              const isActive =
                activeCategory === category.value;

              return (
                <button
                  key={category.value}
                  type="button"
                  className={`faqs-tab-btn${
                    isActive ? " active" : ""
                  }`}
                  aria-pressed={isActive}
                  onClick={() =>
                    handleCategoryChange(category.value)
                  }
                >
                  {category.label}
                </button>
              );
            })}
          </div>

          <div className="faqs-list">
            {visibleFAQs.map((item) => {
              const isOpen = openFAQ === item.id;
              const questionId = `faqs-question-${item.id}`;
              const answerId = `faqs-answer-${item.id}`;

              return (
                <article
                  className={`faqs-item${
                    isOpen ? " active" : ""
                  }`}
                  key={item.id}
                >
                  <h2 className="faqs-question-heading">
                    <button
                      className="faqs-question"
                      id={questionId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => toggleFAQ(item.id)}
                    >
                      <span className="faqs-question-text">
                        <span
                          className="faqs-q-badge"
                          aria-hidden="true"
                        >
                          {String(item.id).padStart(2, "0")}
                        </span>

                        <span className="faqs-question-label">
                          {item.question}
                        </span>
                      </span>

                      <span
                        className="faqs-toggle-icon"
                        aria-hidden="true"
                      >
                        ▾
                      </span>
                    </button>
                  </h2>

                  <div
                    className="faqs-answer"
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    aria-hidden={!isOpen}
                    inert={!isOpen}
                    data-open={isOpen}
                  >
                    <div className="faqs-answer-inner">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="faqs-ask-card">
            <div className="faqs-ask-text">
              <strong>
                Have a question that's not answered here?
              </strong>

              <p>
                Join the IEEE IGDTUW Discord server or contact our team.
              </p>
            </div>

            <a
              className="faqs-contact-btn"
              href="mailto:igdtwieee@gmail.com"
              aria-label="Contact the IEEE IGDTUW team with a question"
            >
              Ask on Discord <span aria-hidden="true">💬</span>
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Faqs;
