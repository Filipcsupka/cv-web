/* global React, gsap, ScrollTrigger, SplitText, Lenis */
/*
  Motion layer. GSAP (ScrollTrigger, SplitText) + Lenis, plus ports of
  React Bits components (Aurora, DecryptedText, SpotlightCard, Magnet,
  ScrollVelocity, ClickSpark, GradientText) written against the global
  React / GSAP builds, so the site stays buildless.
*/
(() => {
  const { useRef, useEffect, useLayoutEffect } = React;

  const reduced = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = () =>
    window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  /* ─── Lenis smooth scroll, driven by the GSAP ticker ─────────── */
  let lenis = null;
  function initSmoothScroll() {
    if (lenis || reduced()) return null;
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    document.addEventListener("click", (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      const el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -8, duration: 1.4 });
    });
    return lenis;
  }

  /* ─── Aurora (React Bits) — raw WebGL2 port, no ogl dependency ─ */
  const AURORA_VERT = `#version 300 es
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }`;
  const AURORA_FRAG = `#version 300 es
precision highp float;
uniform float uTime;
uniform float uAmplitude;
uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2;
uniform vec2 uResolution;
uniform float uBlend;
out vec4 fragColor;

vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
void main(){
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec3 ramp = uv.x < 0.5 ? mix(uC0, uC1, uv.x * 2.0) : mix(uC1, uC2, (uv.x - 0.5) * 2.0);
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  float mid = 0.20;
  float alpha = smoothstep(mid - uBlend * 0.5, mid + uBlend * 0.5, intensity);
  fragColor = vec4(intensity * ramp * alpha, alpha);
}`;

  const hex3 = (h) => {
    const n = parseInt(h.replace("#", ""), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  };

  function Aurora({ colorStops = ["#42e0ff", "#5cffb1", "#a78bfa"], amplitude = 1.0, blend = 0.6, scale = 0.5, style }) {
    const ref = useRef(null);
    useEffect(() => {
      const canvas = ref.current;
      const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
      if (!gl) return;
      const compile = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
        return s;
      };
      const vs = compile(gl.VERTEX_SHADER, AURORA_VERT);
      const fs = compile(gl.FRAGMENT_SHADER, AURORA_FRAG);
      if (!vs || !fs) return;
      const prog = gl.createProgram();
      gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "position");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const U = (n) => gl.getUniformLocation(prog, n);
      const uTime = U("uTime"), uRes = U("uResolution");
      gl.uniform1f(U("uAmplitude"), amplitude);
      gl.uniform1f(U("uBlend"), blend);
      colorStops.forEach((c, i) => gl.uniform3fv(U("uC" + i), hex3(c)));
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      const resize = () => {
        const w = Math.max(2, Math.floor(canvas.clientWidth * scale));
        const h = Math.max(2, Math.floor(canvas.clientHeight * scale));
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      };
      resize();
      window.addEventListener("resize", resize);

      const draw = (t) => {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uTime, t);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      let raf = 0, running = true;
      const t0 = performance.now();
      const loop = () => {
        if (!running) return;
        draw((performance.now() - t0) / 1000 * 0.6 + 2.0);
        raf = requestAnimationFrame(loop);
      };
      if (reduced()) draw(2.0); else loop();
      const onVis = () => {
        running = !document.hidden && !reduced();
        if (running) { cancelAnimationFrame(raf); loop(); }
      };
      document.addEventListener("visibilitychange", onVis);
      return () => {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVis);
        const ext = gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
      };
    }, []);
    return <canvas ref={ref} aria-hidden="true" style={{ width: "100%", height: "100%", display: "block", ...style }} />;
  }

  /* ─── Reveal: fade/rise on scroll (ScrollTrigger) ───────────── */
  function Reveal({ as: Tag = "div", y = 32, x = 0, delay = 0, stagger = 0, duration = 0.9, children, style, start = "top 88%", ...rest }) {
    const ref = useRef(null);
    useLayoutEffect(() => {
      if (reduced()) return;
      const el = ref.current;
      const targets = stagger ? el.children : el;
      const ctx = gsap.context(() => {
        gsap.from(targets, {
          y, x, opacity: 0, duration, delay, stagger, ease: "power3.out",
          scrollTrigger: { trigger: el, start, once: true },
        });
      }, el);
      return () => ctx.revert();
    }, []);
    return <Tag ref={ref} style={style} {...rest}>{children}</Tag>;
  }

  /* ─── SplitHeading: SplitText chars rising on scroll/mount ──── */
  function SplitHeading({ as: Tag = "h2", children, style, immediate = false, gradient, delay = 0, ...rest }) {
    const ref = useRef(null);
    useLayoutEffect(() => {
      if (reduced()) return;
      const el = ref.current;
      let split, cancelled = false;
      const run = () => {
        if (cancelled) return;
        split = SplitText.create(el, {
          type: "words,chars",
          autoSplit: true,
          onSplit(self) {
            if (gradient) {
              // spread one gradient across all chars so the split keeps the fill
              const box = el.getBoundingClientRect();
              self.chars.forEach((c) => {
                const r = c.getBoundingClientRect();
                c.style.display = "inline-block";
                c.style.backgroundImage = gradient;
                c.style.backgroundSize = `${box.width}px 100%`;
                c.style.backgroundPosition = `${-(r.left - box.left)}px 0`;
                c.style.backgroundRepeat = "no-repeat";
                c.style.webkitBackgroundClip = "text";
                c.style.backgroundClip = "text";
                c.style.webkitTextFillColor = "transparent";
              });
            }
            return gsap.from(self.chars, {
              yPercent: 110, opacity: 0, rotate: 6, duration: 0.9, delay,
              ease: "power4.out", stagger: { each: 0.035, from: "start" },
              scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
            });
          },
        });
      };
      (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(run);
      return () => { cancelled = true; if (split) split.revert(); };
    }, []);
    return <Tag ref={ref} style={{ overflow: "hidden", ...style }} {...rest}>{children}</Tag>;
  }

  /* ─── DecryptedText (React Bits): scramble then settle ──────── */
  const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+-=<>/";
  function DecryptedText({ text, style, duration = 1.1, ...rest }) {
    const ref = useRef(null);
    useEffect(() => {
      const el = ref.current;
      el.textContent = text;
      if (reduced()) return;
      const state = { p: 0 };
      const render = () => {
        const shown = Math.floor(state.p * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          out += i < shown || ch === " " ? ch : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
        }
        el.textContent = out;
      };
      el.textContent = text.replace(/\S/g, () => SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0]);
      const tween = gsap.to(state, {
        p: 1, duration, ease: "none", onUpdate: render, onComplete: () => { el.textContent = text; },
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
      return () => { tween.scrollTrigger && tween.scrollTrigger.kill(); tween.kill(); el.textContent = text; };
    }, [text]);
    return <span ref={ref} aria-label={text} style={style} {...rest}>{text}</span>;
  }

  /* ─── SpotlightCard (React Bits): cursor-following glow ─────── */
  function SpotlightCard({ as: Tag = "div", color = "#42e0ff", style, children, innerStyle, ...rest }) {
    const ref = useRef(null);
    const glow = useRef(null);
    const onMove = (e) => {
      const r = ref.current.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      glow.current.style.background = `radial-gradient(360px circle at ${x}px ${y}px, ${color}2e, transparent 65%)`;
      ref.current.style.setProperty("--sx", x + "px");
      ref.current.style.setProperty("--sy", y + "px");
    };
    return (
      <Tag
        ref={ref}
        onMouseMove={canHover() ? onMove : undefined}
        onMouseEnter={() => { glow.current.style.opacity = 1; }}
        onMouseLeave={() => { glow.current.style.opacity = 0; }}
        style={{ position: "relative", overflow: "hidden", ...style }}
        {...rest}
      >
        <div ref={glow} aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0,
          transition: "opacity 0.35s", zIndex: 0,
        }} />
        <div style={{ position: "relative", zIndex: 1, ...innerStyle }}>{children}</div>
      </Tag>
    );
  }

  /* ─── Magnet (React Bits): pull toward cursor ───────────────── */
  function Magnet({ children, strength = 0.3, pad = 24, style }) {
    const ref = useRef(null);
    useEffect(() => {
      if (!canHover() || reduced()) return;
      const el = ref.current;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy;
        if (Math.abs(dx) < r.width / 2 + pad && Math.abs(dy) < r.height / 2 + pad) {
          xTo(dx * strength); yTo(dy * strength);
        } else { xTo(0); yTo(0); }
      };
      const leave = () => { xTo(0); yTo(0); };
      window.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => { window.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
    }, []);
    return <div ref={ref} style={{ display: "inline-block", ...style }}>{children}</div>;
  }

  /* ─── ScrollVelocity-style marquee ──────────────────────────── */
  function VelocityMarquee({ items, style }) {
    const rowRef = useRef(null);
    useLayoutEffect(() => {
      const row = rowRef.current;
      if (reduced()) return;
      const ctx = gsap.context(() => {
        const tween = gsap.to(row, { xPercent: -50, ease: "none", duration: 38, repeat: -1 });
        ScrollTrigger.create({
          start: 0, end: "max",
          onUpdate(self) {
            const v = Math.abs(self.getVelocity());
            const dir = self.direction;
            gsap.to(tween, {
              timeScale: dir * Math.min(10, 1 + v / 220), duration: 0.2, overwrite: true,
              onComplete: () => gsap.to(tween, { timeScale: 1, duration: 1.2 }),
            });
          },
        });
      }, row);
      return () => ctx.revert();
    }, []);
    const seq = [...items, ...items];
    return (
      <div aria-hidden="true" style={{ overflow: "hidden", whiteSpace: "nowrap", ...style }}>
        <div ref={rowRef} style={{ display: "inline-flex", willChange: "transform" }}>
          {[0, 1].map((k) => (
            <div key={k} style={{ display: "inline-flex" }}>
              {items.map((it, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span className="vm-word">{it}</span>
                  <span className="vm-sep">⸬</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ─── ClickSpark (React Bits): sparks on click ──────────────── */
  function ClickSpark({ color = "#42e0ff", count = 9, size = 12, radius = 22, duration = 0.5 }) {
    const ref = useRef(null);
    useEffect(() => {
      if (reduced()) return;
      const canvas = ref.current;
      const ctx = canvas.getContext("2d");
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      let W = 0, H = 0, sparks = [], raf = 0;
      const resize = () => {
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        canvas.style.width = W + "px"; canvas.style.height = H + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      const draw = (now) => {
        ctx.clearRect(0, 0, W, H);
        sparks = sparks.filter((s) => now - s.t0 < duration * 1000);
        sparks.forEach((s) => {
          const p = (now - s.t0) / (duration * 1000);
          const e = 1 - Math.pow(1 - p, 3);
          const d = e * radius, len = size * (1 - e);
          ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.globalAlpha = 1 - p;
          ctx.beginPath();
          ctx.moveTo(s.x + d * Math.cos(s.a), s.y + d * Math.sin(s.a));
          ctx.lineTo(s.x + (d + len) * Math.cos(s.a), s.y + (d + len) * Math.sin(s.a));
          ctx.stroke();
        });
        ctx.globalAlpha = 1;
        raf = sparks.length ? requestAnimationFrame(draw) : 0;
      };
      const click = (e) => {
        const t0 = performance.now();
        for (let i = 0; i < count; i++) sparks.push({ x: e.clientX, y: e.clientY, a: (Math.PI * 2 * i) / count, t0 });
        if (!raf) raf = requestAnimationFrame(draw);
      };
      window.addEventListener("click", click);
      window.addEventListener("resize", resize);
      return () => { cancelAnimationFrame(raf); window.removeEventListener("click", click); window.removeEventListener("resize", resize); };
    }, []);
    return <canvas ref={ref} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }} />;
  }

  /* ─── GradientText (React Bits): animated gradient fill ─────── */
  function GradientText({ children, colors = ["#42e0ff", "#5cffb1", "#a78bfa", "#42e0ff"], speed = 7, style }) {
    return (
      <span style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text", backgroundClip: "text",
        WebkitTextFillColor: "transparent", color: "transparent",
        animation: `fx-gradient ${speed}s linear infinite`, ...style,
      }}>{children}</span>
    );
  }

  Object.assign(window, {
    initSmoothScroll, Aurora, Reveal, SplitHeading, DecryptedText, SpotlightCard,
    Magnet, VelocityMarquee, ClickSpark, GradientText, fxReduced: reduced,
  });
})();
