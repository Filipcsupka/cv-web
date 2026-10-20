/* global React, ReactDOM, gsap, ScrollTrigger, initSmoothScroll, ClickSpark, VelocityMarquee */
const Root = () => {
  const isMobile = useIsMobile();
  const [active, setActive] = React.useState("hero");
  const [scrolled, setScrolled] = React.useState(false);
  const barRef = React.useRef(null);

  const navItems = [
    { id: "hero", label: "status" },
    { id: "stack", label: "toolbox" },
    { id: "experience", label: "exp" },
    { id: "about", label: "about" },
    { id: "contact", label: "contact" },
  ];

  React.useEffect(() => {
    initSmoothScroll();

    // scroll progress + nav state, all through ScrollTrigger
    const triggers = [
      ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: (self) => {
          if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          setScrolled((s) => { const n = window.scrollY > 40; return s === n ? s : n; });
        },
      }),
      ...navItems.map((n) => ScrollTrigger.create({
        trigger: `#${n.id}`, start: "top 50%", end: "bottom 50%",
        onToggle: (self) => { if (self.isActive) setActive(n.id); },
      })),
    ];
    // late layout shifts (fonts, widget) move trigger positions
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <div style={{
      color: "#edf7ff", minHeight: "100vh",
      fontFamily: "'JetBrains Mono', monospace", position: "relative",
    }}>
      <Backdrop />

      {/* scroll progress bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 2,
        zIndex: 100, background: "rgba(66,224,255,0.08)",
      }}>
        <div ref={barRef} style={{
          height: "100%", width: "100%", transformOrigin: "left", transform: "scaleX(0)",
          background: "linear-gradient(90deg, #42e0ff, #5cffb1)",
          boxShadow: "0 0 12px #42e0ff",
        }} />
      </div>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 2, left: 0, right: 0, zIndex: 50,
        padding: isMobile ? "8px 14px" : "10px 22px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 8,
        background: scrolled ? "rgba(2,8,16,0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        borderBottom: scrolled ? "1px solid #24577e" : "1px solid transparent",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: isMobile ? 11 : 13, flexShrink: 0 }}>
          <span className="fx-pulse-soft" style={{ color: "#5cffb1" }}>●</span>
          <span style={{ color: "#42e0ff", fontWeight: 700 }}>filip</span>
          {!isMobile && <><span style={{ color: "#5f7f9e" }}>@</span>
          <span style={{ color: "#a8bfd6" }}>sre-cluster</span></>}
          <span style={{ color: "#42e0ff" }}>:~$</span>
        </div>
        <div style={{ display: "flex", gap: isMobile ? 2 : 4, flexWrap: "nowrap" }}>
          {navItems.map((n) => (
            <a key={n.id} href={`#${n.id}`} style={{
              padding: isMobile ? "4px 7px" : "5px 12px",
              borderRadius: 4,
              fontSize: isMobile ? 10 : 11,
              letterSpacing: "0.04em", textDecoration: "none",
              color: active === n.id ? "#42e0ff" : "#5f7f9e",
              background: active === n.id ? "rgba(66,224,255,0.1)" : "transparent",
              border: active === n.id ? "1px solid rgba(66,224,255,0.3)" : "1px solid transparent",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}>
              {n.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Side scroll dots — desktop only */}
      {!isMobile && (
        <div style={{
          position: "fixed", right: 18, top: "50%", transform: "translateY(-50%)",
          zIndex: 40, display: "flex", flexDirection: "column", gap: 8,
        }}>
          {navItems.map((n) => (
            <a key={n.id} href={`#${n.id}`} aria-label={n.label} style={{
              display: "block", width: 28, height: 28,
              borderRadius: "50%",
              border: `1px solid ${active === n.id ? "#42e0ff" : "rgba(66,224,255,0.18)"}`,
              background: active === n.id ? "rgba(66,224,255,0.18)" : "rgba(7,27,49,0.5)",
              position: "relative",
              transition: "all 0.2s",
            }} title={n.label}>
              <span style={{
                position: "absolute", inset: 8, borderRadius: "50%",
                background: active === n.id ? "#42e0ff" : "rgba(66,224,255,0.3)",
                boxShadow: active === n.id ? "0 0 10px #42e0ff" : "none",
                transition: "all 0.2s",
              }} />
            </a>
          ))}
        </div>
      )}

      <Hero />
      <VelocityMarquee items={window.CV_DATA.roles} style={{
        position: "relative", zIndex: 2,
        borderTop: "1px solid rgba(66,224,255,0.14)", borderBottom: "1px solid rgba(66,224,255,0.14)",
        background: "rgba(3,16,31,0.55)", backdropFilter: "blur(6px)",
        padding: "18px 0",
      }} />
      <StackSection />
      <ExperienceSection />
      <AboutSection />
      <ContactSection />
      <ChatWidget />
      <ClickSpark />

      <footer style={{
        position: "relative", zIndex: 2,
        borderTop: "1px solid #24577e", padding: 24, textAlign: "center",
        fontSize: 11, color: "#5f7f9e",
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        © 2026 Filip Csupka · Running on <span style={{ color: "#42e0ff" }}>Kubernetes</span> · <span style={{ color: "#5cffb1" }}>● healthy</span>
      </footer>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
