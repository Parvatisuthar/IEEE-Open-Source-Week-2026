import { useEffect, useRef } from "react";
import * as THREE from "three"; // install: npm i three@0.128.0
import { CONFIG } from "../data/config";

export default function Hero() {
  const heroRef = useRef(null);
  const mountRef = useRef(null);
  const hxRef = useRef(null);
  const hyRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const mount = mountRef.current;
    const T = THREE;
    let renderer;
    let raf = 0;
    let dead = false;
    let run = true;
    let io;

    const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 700;

    try {
      renderer = new T.WebGLRenderer({ antialias: !small, alpha: true });
    } catch (err) {
      return; // no WebGL: the CSS gradient background stays
    }
    const r = renderer;
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
    r.outputEncoding = T.sRGBEncoding;
    r.toneMapping = T.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.15;
    const cv = r.domElement;
    cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
    mount.appendChild(cv);

    const S = new T.Scene();
    const cam = new T.PerspectiveCamera(40, 1, 0.1, 60);
    cam.position.set(0, 0, 8.5);
    S.fog = new T.Fog(0x05070d, 11, 30);

    /* environment map for the metallic look */
    const ec = document.createElement("canvas");
    ec.width = 512;
    ec.height = 256;
    const e = ec.getContext("2d");
    const g = e.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "#12275E");
    g.addColorStop(0.5, "#050507");
    g.addColorStop(1, "#071A3A");
    e.fillStyle = g;
    e.fillRect(0, 0, 512, 256);
    e.globalAlpha = 0.9;
    [
      [40, 60, 150, 26, "#ffffff"],
      [300, 40, 120, 18, "#9fefff"],
      [200, 150, 200, 10, "#22d3ee"],
      [420, 110, 70, 40, "#ffffff"],
      [0, 200, 512, 14, "#2f5bff"],
    ].forEach((a) => {
      e.fillStyle = a[4];
      e.fillRect(a[0], a[1], a[2], a[3]);
    });
    const et = new T.CanvasTexture(ec);
    et.mapping = T.EquirectangularReflectionMapping;
    et.encoding = T.sRGBEncoding;
    const pmrem = new T.PMREMGenerator(r);
    S.environment = pmrem.fromEquirectangular(et).texture;

    /* main object */
    const G = new T.Group();
    const geo = new T.IcosahedronGeometry(1.5, 1);
    S.add(G);
    const core = new T.Mesh(
      geo,
      new T.MeshPhysicalMaterial({
        color: 0x93a3c8, metalness: 1, roughness: 0.2, clearcoat: 0.6,
        clearcoatRoughness: 0.15, flatShading: true, envMapIntensity: 1.4,
      })
    );
    G.add(core);
    const wire = new T.LineSegments(
      new T.EdgesGeometry(geo),
      new T.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.55 })
    );
    wire.scale.setScalar(1.004);
    G.add(wire);
    const inner = new T.Mesh(
      new T.OctahedronGeometry(0.7),
      new T.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.5 })
    );
    G.add(inner);
    const shell = new T.LineSegments(
      new T.EdgesGeometry(new T.IcosahedronGeometry(2.35, 1)),
      new T.LineBasicMaterial({ color: 0x4f7bff, transparent: true, opacity: 0.42 })
    );
    G.add(shell);
    const ring = (R, c, o, rx) => {
      const m = new T.Mesh(
        new T.TorusGeometry(R, 0.008, 6, small ? 90 : 180),
        new T.MeshBasicMaterial({ color: c, transparent: true, opacity: o })
      );
      m.rotation.x = rx;
      G.add(m);
      return m;
    };
    const r1 = ring(2.9, 0x22d3ee, 0.6, 1.2);
    const r2 = ring(3.4, 0x4f7bff, 0.4, 0.5);
    const sat = [0, 1, 2].map((i) => {
      const m = new T.Mesh(
        new T.OctahedronGeometry(0.07),
        new T.MeshBasicMaterial({ color: i ? 0xffffff : 0x7d70d6 })
      );
      r1.add(m);
      return m;
    });

    /* lights */
    S.add(new T.AmbientLight(0x8899aa, 0.25));
    const dl = new T.DirectionalLight(0xffffff, 1.1);
    dl.position.set(-3, 4, 5);
    S.add(dl);
    const pc = new T.PointLight(0x22d3ee, 3, 14);
    pc.position.set(3.5, -1, 3);
    S.add(pc);
    const pv = new T.PointLight(0x7d70d6, 0.5, 12);
    pv.position.set(-4, 2, -2);
    S.add(pv);
    const pb = new T.PointLight(0x2f5bff, 2.6, 18);
    pb.position.set(0, -3.5, -3);
    S.add(pb);
    const bk = new T.DirectionalLight(0x2f5bff, 1.4);
    bk.position.set(2, 3, -6);
    S.add(bk);

    /* glow sprites */
    const gc = document.createElement("canvas");
    gc.width = gc.height = 256;
    const gx = gc.getContext("2d");
    const gg = gx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gg.addColorStop(0, "rgba(34,211,238,.55)");
    gg.addColorStop(0.38, "rgba(47,91,255,.3)");
    gg.addColorStop(1, "rgba(34,211,238,0)");
    gx.fillStyle = gg;
    gx.fillRect(0, 0, 256, 256);
    const glow = new T.Sprite(
      new T.SpriteMaterial({
        map: new T.CanvasTexture(gc), blending: T.AdditiveBlending,
        depthWrite: false, transparent: true, opacity: 0.7,
      })
    );
    glow.scale.set(11, 11, 1);
    glow.position.z = -2.5;
    G.add(glow);
    glow.material.fog = false;
    const halo = new T.Sprite(
      new T.SpriteMaterial({
        map: glow.material.map, color: 0x2f5bff, blending: T.AdditiveBlending,
        depthWrite: false, transparent: true, opacity: 0.32, fog: false,
      })
    );
    halo.scale.set(20, 20, 1);
    halo.position.z = -4;
    G.add(halo);

    const fc = document.createElement("canvas");
    fc.width = fc.height = 256;
    const fx = fc.getContext("2d");
    const fg = fx.createRadialGradient(128, 128, 0, 128, 128, 128);
    fg.addColorStop(0, "rgba(47,91,255,.6)");
    fg.addColorStop(0.5, "rgba(34,211,238,.12)");
    fg.addColorStop(1, "rgba(34,211,238,0)");
    fx.fillStyle = fg;
    fx.fillRect(0, 0, 256, 256);
    const fl = new T.Mesh(
      new T.PlaneGeometry(9, 9),
      new T.MeshBasicMaterial({
        map: new T.CanvasTexture(fc), blending: T.AdditiveBlending,
        depthWrite: false, transparent: true, opacity: 0.8, fog: false,
      })
    );
    fl.rotation.x = -Math.PI / 2;
    fl.position.y = -2.85;
    G.add(fl);

    /* particles */
    const n = small ? 110 : 320;
    const pa = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const R = 3 + Math.random() * 7;
      const u = Math.random() * 6.283;
      const v = Math.acos(2 * Math.random() - 1);
      pa.set([R * Math.sin(v) * Math.cos(u), R * Math.cos(v) * 0.7, R * Math.sin(v) * Math.sin(u)], i * 3);
    }
    const pg = new T.BufferGeometry();
    pg.setAttribute("position", new T.BufferAttribute(pa, 3));
    const pts = new T.Points(
      pg,
      new T.PointsMaterial({
        color: 0x9ff3ff, size: 0.035, transparent: true, opacity: 0.75,
        depthWrite: false, blending: T.AdditiveBlending,
      })
    );
    S.add(pts);

    const grid = new T.GridHelper(40, 40, 0x2f5bff, 0x2f5bff);
    grid.material.transparent = true;
    grid.material.opacity = 0.34;
    grid.position.y = -2.9;
    S.add(grid);

    /* floating code labels */
    const lab = ["git push", "fork()", "{ merge }", "PR #open", "<Review/>", "commit -m", "LGTM ✓", "npm i"].map((w) => {
      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 48;
      const x = c.getContext("2d");
      x.font = '24px "JetBrains Mono",monospace';
      x.fillStyle = "#22d3ee";
      x.textAlign = "center";
      x.fillText(w, 128, 32);
      const s = new T.Sprite(
        new T.SpriteMaterial({ map: new T.CanvasTexture(c), transparent: true, opacity: 0.5, depthWrite: false })
      );
      s.scale.set(1.6, 0.3, 1);
      s.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 6, -2 + Math.random() * 4);
      S.add(s);
      return s;
    });

    /* loop */
    let W = 1, H = 1, mx = 0, my = 0, tx = 0, ty = 0, t = 0;
    let last = performance.now();

    const rs = () => {
      const b = hero.getBoundingClientRect();
      W = b.width;
      H = b.height;
      r.setSize(W, H, false);
      cam.aspect = W / H;
      cam.updateProjectionMatrix();
      G.position.set(W > 900 ? 2.1 : 0, W > 900 ? 0 : 1.2, 0);
      G.scale.setScalar(W > 900 ? 1 : 0.74);
    };
    const onMove = (ev) => {
      tx = ev.clientX / window.innerWidth - 0.5;
      ty = ev.clientY / window.innerHeight - 0.5;
    };

    function fr(now) {
      if (dead) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!RM) t += dt;
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      const sc = Math.min(window.scrollY, H) / H;
      core.rotation.set(t * 0.12 + my * 0.5, t * 0.18 + mx * 0.7 + sc * 1.6, 0);
      wire.rotation.copy(core.rotation);
      inner.rotation.set(-t * 0.3, t * 0.4, 0);
      shell.rotation.set(t * 0.05 + 0.3, -t * 0.09, 0);
      r1.rotation.z = t * 0.1;
      r2.rotation.set(0.5 + t * 0.04, t * 0.06, 0);
      sat.forEach((s, i) => {
        const a = t * 0.5 + i * 2.094;
        s.position.set(2.9 * Math.cos(a), 2.9 * Math.sin(a), 0);
      });
      pts.rotation.y = t * 0.02 + mx * 0.1;
      pts.position.y = Math.sin(t * 0.3) * 0.15;
      grid.position.z = (t * 0.8) % 1;
      glow.material.opacity = 0.6 + Math.sin(t * 0.8) * 0.1;
      if (!RM) {
        lab.forEach((s) => {
          s.position.y += dt * 0.12;
          if (s.position.y > 3.2) s.position.y = -3.2;
        });
      }
      cam.position.x = mx * 0.8;
      cam.position.y = -my * 0.5;
      cam.lookAt(0, 0, 0);
      r.render(S, cam);
      if (hxRef.current) hxRef.current.textContent = mx.toFixed(2);
      if (hyRef.current) hyRef.current.textContent = my.toFixed(2);
      if (run && !RM) raf = requestAnimationFrame(fr);
    }

    rs();
    fr(performance.now());
    const onResize = () => {
      rs();
      if (RM) fr(performance.now());
    };
    const onScroll = () => fr(performance.now());
    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", onResize);

    if (RM) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      // pause rendering when the hero is off-screen
      io = new IntersectionObserver((es) => {
        const v = es[0].isIntersecting;
        if (v && !run) {
          run = true;
          last = performance.now();
          raf = requestAnimationFrame(fr);
        }
        run = v;
      });
      io.observe(hero);
    }

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      io && io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      S.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (o.material.map) o.material.map.dispose();
          o.material.dispose();
        }
      });
      pmrem.dispose();
      r.dispose();
      if (cv.parentNode) cv.parentNode.removeChild(cv);
    };
  }, []);

  return (
    <section id="hero" aria-label="Introduction" ref={heroRef}>
      <div id="cv" ref={mountRef} aria-hidden="true" />
      <div className="side" aria-hidden="true">IEEE · IGDTUW · OPEN SOURCE WEEK</div>
      <div className="hud" aria-hidden="true">
        CAM <b ref={hxRef}>0.00</b> / <b ref={hyRef}>0.00</b>
        <br />
        RENDER <b>LIVE</b>
      </div>
      <div className="hc">
        <h1 aria-label="Open Source Week">
          <div className="hl"><span>Open</span></div>
          <div className="hl"><span className="out">Source</span></div>
          <div className="hl"><span>Week</span></div>
        </h1>
        <div className="hrow">
          <div>
            <p>{CONFIG.sub}</p>
            <div className="chips">
              {CONFIG.chips.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="btn f" href="#register">Register interest</a>
            <a className="btn" href="#timeline">Timeline</a>
          </div>
        </div>
      </div>
    </section>
  );
}
