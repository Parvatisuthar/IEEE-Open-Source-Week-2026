import { useEffect, useRef } from "react";
import "../styles/osw.css";
import Navbar from "./Navbar";
import Hero from "./Hero";
import {
  Ticker, About, Highlights, Themes, Timeline, Events,
  Speakers, Register, Faq, Contact, Footer,
} from "./Sections";

export default function Home() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups = [];

    /* smooth anchor scrolling that accounts for the fixed navbar (restored on unmount) */
    const html = document.documentElement;
    const prev = [html.style.scrollBehavior, html.style.scrollPaddingTop];
    html.style.scrollBehavior = RM ? "auto" : "smooth";
    html.style.scrollPaddingTop = "70px";
    cleanups.push(() => {
      html.style.scrollBehavior = prev[0];
      html.style.scrollPaddingTop = prev[1];
    });

    /* scroll progress bar */
    const bar = el.querySelector("#bar");
    const onScroll = () => {
      const h = document.documentElement;
      bar.style.transform = `scaleX(${window.scrollY / (h.scrollHeight - window.innerHeight || 1)})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    /* reveal on scroll */
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    el.querySelectorAll(".rv").forEach((n) => io.observe(n));
    cleanups.push(() => io.disconnect());

    /* cursor glow */
    const glow = el.querySelector("#glow");
    const onGlow = (e) => {
      glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    };
    window.addEventListener("pointermove", onGlow);
    cleanups.push(() => window.removeEventListener("pointermove", onGlow));

    /* 3D tilt on panels / event cards */
    el.querySelectorAll(".tilt").forEach((t) => {
      const move = (e) => {
        if (RM) return;
        const r = t.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        t.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`;
      };
      const leave = () => (t.style.transform = "");
      t.addEventListener("pointermove", move);
      t.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        t.removeEventListener("pointermove", move);
        t.removeEventListener("pointerleave", leave);
      });
    });

    /* magnetic register button */
    const mg = el.querySelector("#mg");
    const reg = el.querySelector("#register");
    const mag = (e) => {
      if (RM) return;
      const r = mg.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      mg.style.transform = Math.hypot(dx, dy) < 220 ? `translate(${dx * 0.22}px,${dy * 0.22}px)` : "";
    };
    reg.addEventListener("pointermove", mag);
    cleanups.push(() => reg.removeEventListener("pointermove", mag));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="osw" ref={root}>
      <div id="bar" />
      <div id="glow" />
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <About />
        <Highlights />
        <Themes />
        <Timeline />
        <Events />
        <Speakers />
        <Register />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
