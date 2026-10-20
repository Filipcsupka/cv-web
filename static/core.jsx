/* global React, ReactDOM, gsap, ScrollTrigger, Aurora, SplitHeading, Magnet, GradientText, DecryptedText, Reveal */
const { useState, useEffect, useRef, useLayoutEffect } = React;
const D = window.CV_DATA;

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(typeof window !== "undefined" ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    const on = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [breakpoint]);
  return mobile;
}

/* ─── Typing rotator ──────────────────────────────────────────── */
function useTyping(words, speed = 70, pause = 1600) {
  const [s, setS] = useState("");
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[i];
    const t = setTimeout(() => {
      if (!del) {
        if (j < word.length) { setS(word.slice(0, j + 1)); setJ(j + 1); }
        else { setTimeout(() => setDel(true), pause); }
      } else {
        if (j > 0) { setS(word.slice(0, j - 1)); setJ(j - 1); }
        else { setDel(false); setI((i + 1) % words.length); }
      }
    }, del ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [i, j, del, words, speed, pause]);
  return s;
}

/* ─── Background: Aurora (React Bits) + faint grid, fades on scroll ─── */
function Backdrop() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (fxReduced()) return;
    const tween = gsap.to(ref.current, {
      opacity: 0.22, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "+=900", scrub: true },
    });
    return () => { tween.scrollTrigger && tween.scrollTrigger.kill(); tween.kill(); };
  }, []);
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <div ref={ref} style={{ position: "absolute", inset: 0, opacity: 0.85 }}>
        <Aurora colorStops={["#42e0ff", "#5cffb1", "#a78bfa"]} amplitude={1.1} blend={0.7} />
      </div>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(66,224,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(66,224,255,0.045) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, #000 20%, transparent 75%)",
        maskImage: "radial-gradient(ellipse at 50% 30%, #000 20%, transparent 75%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 120%, rgba(3,16,31,0.95) 30%, transparent 70%)",
      }} />
    </div>
  );
}

/* ─── Hero ──────────────────────────────────────────────────── */
function Hero() {
  const role = useTyping(D.roles);
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    if (fxReduced()) return;
    const ctx = gsap.context(() => {
      // intro: badge, role line, subtitle, CTAs in sequence after the name
      gsap.from(".hero-in", {
        y: 22, opacity: 0, duration: 0.9, ease: "power3.out",
        stagger: 0.12, delay: 0.55,
      });
      // parallax out as the hero scrolls away
      gsap.to(contentRef.current, {
        yPercent: 14, opacity: 0, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={sectionRef} style={{
      position: "relative", minHeight: "100vh", zIndex: 2,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: isMobile ? "100px 16px 60px" : "120px 24px 80px", textAlign: "center",
    }}>
      <div ref={contentRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", willChange: "transform, opacity" }}>
        <div className="hero-in" style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 24,
          fontSize: 11, color: "#5f7f9e", letterSpacing: "0.04em",
          flexWrap: "wrap", justifyContent: "center",
        }}>
          <span className="fx-pulse" style={{
            width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: "#5cffb1",
          }} />
          {!isMobile && <span>{D.status}</span>}
          <span style={{
            background: "rgba(92,255,177,0.08)", border: "1px solid rgba(92,255,177,0.3)",
            borderRadius: 3, padding: "2px 8px", color: "#5cffb1",
          }}>
            status: {D.statusBadge}
          </span>
        </div>

        <SplitHeading as="h1" immediate delay={0.1}
          gradient="linear-gradient(135deg, #edf7ff 0%, #42e0ff 50%, #5cffb1 100%)"
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(2.6rem, 8vw, 6.2rem)",
            fontWeight: 900, letterSpacing: "0.06em", lineHeight: 1.08, margin: 0,
            paddingBottom: "0.06em",
            filter: "drop-shadow(0 0 28px rgba(66,224,255,0.28))",
          }}>
          FILIP CSUPKA
        </SplitHeading>

        <div className="hero-in" style={{ marginTop: 12, marginBottom: 20 }}>
          <div style={{
            fontSize: "clamp(1rem, 2.4vw, 1.5rem)", color: "#42e0ff", minHeight: "1.4em",
          }}>
            ⸬ {role}<span className="fx-blink" style={{
              display: "inline-block", width: 10, height: "1em",
              background: "#42e0ff", marginLeft: 4, verticalAlign: "-2px",
            }} />
          </div>
        </div>

        <p className="hero-in" style={{
          maxWidth: 620, color: "#a8bfd6", fontSize: 14, lineHeight: 1.7, margin: "0 0 32px",
        }}>
          {D.subtitle}
        </p>

        <div className="hero-in" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Magnet><a href="#experience" style={ctaPrimary}>VIEW EXPERIENCE</a></Magnet>
          <Magnet>
            <a href={D.resume.href} download="Filip_csupka_CV.docx" style={ctaGhost}>{D.resume.label}</a>
          </Magnet>
          <Magnet>
            <a href="https://github.com/Filipcsupka" target="_blank" rel="noopener noreferrer" style={ctaGhost}>GITHUB →</a>
          </Magnet>
          <Magnet>
            <button onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))} style={ctaChat}>⚡ AI CHAT</button>
          </Magnet>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
        fontSize: 11, color: "#5f7f9e",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        <span style={{ letterSpacing: "0.2em" }}>SCROLL TO DEPLOY</span>
        <div className="fx-scroll-line" style={{
          width: 1, height: 36, background: "linear-gradient(to bottom, #42e0ff, transparent)",
          transformOrigin: "top",
        }} />
      </div>
    </section>
  );
}

const ctaPrimary = {
  display: "inline-block", padding: "12px 28px", borderRadius: 6, fontSize: 12, fontWeight: 700,
  textDecoration: "none", background: "#42e0ff", color: "#03101f",
  letterSpacing: "0.1em", border: "1px solid #42e0ff",
  boxShadow: "0 0 22px rgba(66,224,255,0.35), inset 0 0 12px rgba(255,255,255,0.15)",
};
const ctaGhost = {
  display: "inline-block", padding: "12px 28px", borderRadius: 6, fontSize: 12, fontWeight: 700,
  textDecoration: "none", background: "rgba(3,16,31,0.35)", color: "#42e0ff",
  letterSpacing: "0.1em", border: "1px solid rgba(66,224,255,0.5)",
  backdropFilter: "blur(6px)",
};
const ctaChat = {
  padding: "12px 28px", borderRadius: 6, fontSize: 12, fontWeight: 700,
  letterSpacing: "0.1em", border: "1px solid #5cffb1",
  background: "rgba(92,255,177,0.12)", color: "#5cffb1", cursor: "pointer",
  boxShadow: "0 0 22px rgba(92,255,177,0.4), 0 0 6px rgba(92,255,177,0.2)",
  animation: "chat-pulse 2.4s ease-in-out infinite",
};

/* ─── Section header ──────────────────────────────────────────── */
function SectionHead({ cmd, title, index }) {
  const barRef = useRef(null);
  useLayoutEffect(() => {
    if (fxReduced()) return;
    const tween = gsap.from(barRef.current, {
      scaleX: 0, transformOrigin: "left", duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: barRef.current, start: "top 92%", once: true },
    });
    return () => { tween.scrollTrigger && tween.scrollTrigger.kill(); tween.kill(); };
  }, []);

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        display: "flex", alignItems: "baseline", gap: 12,
        fontSize: 11, color: "#5f7f9e", letterSpacing: "0.08em", marginBottom: 10, overflow: "hidden",
      }}>
        {index && <span style={{ color: "#42e0ff", fontWeight: 700 }}>{index}</span>}
        <DecryptedText text={cmd} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} />
      </div>
      <SplitHeading as="h2" style={{
        fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.5rem, 3.2vw, 2.4rem)",
        fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
        color: "#edf7ff", margin: 0, lineHeight: 1.2, paddingBottom: "0.1em",
      }}>
        <span style={{ color: "#42e0ff" }}>./</span>{title}
      </SplitHeading>
      <div ref={barRef} style={{
        height: 2, marginTop: 10,
        background: "linear-gradient(90deg, #42e0ff, #5cffb1, transparent)", maxWidth: 220,
      }} />
    </div>
  );
}

Object.assign(window, { Backdrop, Hero, SectionHead, useIsMobile });
