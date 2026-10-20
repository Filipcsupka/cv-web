/* global React, gsap, ScrollTrigger, Reveal, SpotlightCard, SectionHead, useIsMobile */
const { useState: useS, useEffect: useE, useRef: useR, useLayoutEffect: useLE } = React;
const D2 = window.CV_DATA;

/* ─── TOOLBOX + FLOWS — what I run, where I ran it, and how work moves ─── */
const MONO = "'JetBrains Mono', monospace";
const GLASS = "rgba(7,27,49,0.62)";

function StackSection() {
  const isMobile = useIsMobile();
  const [sel, setSel] = useS("all");
  const ctxs = D2.contexts;
  const ctxColor = Object.fromEntries(ctxs.map((c) => [c.key, c.color]));

  return (
    <section id="stack" style={{
      position: "relative", zIndex: 2,
      maxWidth: 1180, margin: "0 auto", padding: "60px 16px 100px",
    }}>
      <SectionHead index="01" cmd="$ helm list -A  # what I actually run, and where" title="TOOLBOX & FLOWS" />

      <Reveal as="p" y={18} style={{
        color: "#a8bfd6", fontSize: 13, lineHeight: 1.7, maxWidth: 640,
        margin: "0 0 28px", fontFamily: MONO,
      }}>
        Tools grouped by the job they do. Filter by engagement to see what each one actually ran on.
      </Reveal>

      {/* engagement filter */}
      <Reveal y={16} stagger={0.06} role="group" aria-label="Filter tools by engagement" style={{
        display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22,
      }}>
        {[{ key: "all", label: "All engagements", color: "#42e0ff" }, ...ctxs].map((c) => {
          const on = sel === c.key;
          return (
            <button key={c.key} onClick={() => setSel(c.key)} aria-pressed={on} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "7px 13px", borderRadius: 999, cursor: "pointer",
              fontFamily: MONO, fontSize: 11.5, letterSpacing: "0.02em",
              color: on ? "#03101f" : "#c9dcee",
              background: on ? c.color : GLASS,
              border: `1px solid ${on ? c.color : "rgba(66,224,255,0.22)"}`,
              fontWeight: on ? 700 : 500,
              boxShadow: on ? `0 0 18px ${c.color}55` : "none",
              backdropFilter: "blur(6px)",
              transition: "background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s",
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: on ? "#03101f" : c.color,
              }} />
              {c.label}
            </button>
          );
        })}
      </Reveal>

      {/* toolbox table */}
      <div style={{ borderTop: "1px solid rgba(66,224,255,0.16)" }}>
        {D2.toolbox.map((row) => (
          <Reveal key={row.key} y={20}>
            <ToolRow row={row} sel={sel} ctxColor={ctxColor} isMobile={isMobile} />
          </Reveal>
        ))}
      </div>

      {/* flows */}
      <div style={{ marginTop: 64 }}>
        <Reveal as="h3" y={20} style={{
          fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
          fontWeight: 800, letterSpacing: "0.1em", color: "#edf7ff", margin: "0 0 8px",
        }}><span style={{ color: "#42e0ff" }}>./</span>FLOWS</Reveal>
        <Reveal as="p" y={16} style={{
          color: "#a8bfd6", fontSize: 13, lineHeight: 1.7, maxWidth: 640,
          margin: "0 0 22px", fontFamily: MONO,
        }}>
          How work moves on each engagement, in the order it happens.
        </Reveal>
        <div style={{ borderTop: "1px solid rgba(66,224,255,0.16)" }}>
          {D2.flows.map((f) => (
            <FlowRow key={f.key} flow={f} color={ctxColor[f.ctx]} dim={sel !== "all" && sel !== f.ctx} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolRow({ row, sel, ctxColor, isMobile }) {
  const rowActive = sel === "all" || row.tools.some((t) => t.in.length === 0 || t.in.includes(sel));
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "220px 1fr",
      gap: isMobile ? 10 : 24, alignItems: "baseline",
      padding: isMobile ? "16px 0" : "15px 0",
      borderBottom: "1px solid rgba(66,224,255,0.16)",
      opacity: rowActive ? 1 : 0.35,
      transition: "opacity 0.3s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: row.color, flexShrink: 0, boxShadow: `0 0 10px ${row.color}88` }} />
        <span style={{
          fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 700,
          letterSpacing: "0.04em", color: "#edf7ff",
        }}>{row.title}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {row.tools.map((tool) => {
          const everywhere = tool.in.length === 0;
          const hit = sel === "all" || everywhere || tool.in.includes(sel);
          return (
            <span key={tool.n} className="fx-chip" style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              fontFamily: MONO, fontSize: 12, padding: "4px 10px", borderRadius: 4,
              color: hit ? "#edf7ff" : "#5f7f9e",
              background: hit ? "rgba(66,224,255,0.07)" : "transparent",
              border: `1px solid ${hit ? "rgba(66,224,255,0.28)" : "rgba(66,224,255,0.1)"}`,
              opacity: hit ? 1 : 0.5,
              transition: "opacity 0.25s, color 0.25s, background 0.25s, border-color 0.25s, transform 0.2s",
            }}>
              {tool.n}
              {sel === "all" && !everywhere && (
                <span aria-hidden="true" style={{ display: "inline-flex", gap: 3 }}>
                  {tool.in.map((k) => (
                    <i key={k} style={{ width: 5, height: 5, borderRadius: "50%", background: ctxColor[k] }} />
                  ))}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function FlowRow({ flow, color, dim, isMobile }) {
  const n = flow.steps.length;
  const rowRef = useR(null);
  const lineRef = useR(null);

  // connector draws with scroll, steps pop in one by one
  useLE(() => {
    if (fxReduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current,
        isMobile ? { scaleY: 0 } : { scaleX: 0 },
        {
          ...(isMobile ? { scaleY: 1 } : { scaleX: 1 }), ease: "none",
          scrollTrigger: { trigger: rowRef.current, start: "top 85%", end: "bottom 55%", scrub: 0.6 },
        });
      gsap.from(rowRef.current.querySelectorAll("li"), {
        y: 14, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: rowRef.current, start: "top 85%", once: true },
      });
      gsap.from(rowRef.current.querySelectorAll("[data-flow-dot]"), {
        scale: 0, duration: 0.5, ease: "back.out(2.4)", stagger: 0.12,
        scrollTrigger: { trigger: rowRef.current, start: "top 85%", once: true },
      });
    }, rowRef);
    return () => ctx.revert();
  }, [isMobile]);

  return (
    <div ref={rowRef} style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "220px 1fr",
      gap: isMobile ? 14 : 24, alignItems: "start",
      padding: "20px 0",
      borderBottom: "1px solid rgba(66,224,255,0.16)",
      opacity: dim ? 0.3 : 1,
      transition: "opacity 0.3s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0, boxShadow: `0 0 10px ${color}` }} />
        <span style={{
          fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 700,
          letterSpacing: "0.04em", color: "#edf7ff",
        }}>{flow.title}</span>
      </div>

      <ol style={{
        listStyle: "none", margin: 0, padding: 0, position: "relative",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : `repeat(${n}, minmax(0, 1fr))`,
        gap: isMobile ? 14 : 12,
      }}>
        <span ref={lineRef} aria-hidden="true" style={isMobile ? {
          position: "absolute", left: 4, top: 6, bottom: 6, width: 1,
          background: `${color}88`, transformOrigin: "top",
        } : {
          position: "absolute", left: 4, right: 4, top: 4, height: 1,
          background: `${color}88`, transformOrigin: "left",
        }} />
        {flow.steps.map((s, k) => (
          <li key={s.s} style={{
            position: "relative", fontFamily: MONO,
            paddingTop: isMobile ? 0 : 18, paddingLeft: isMobile ? 22 : 0,
          }}>
            <span data-flow-dot aria-hidden="true" style={{
              position: "absolute", left: 0, top: isMobile ? 4 : 0,
              width: 9, height: 9, borderRadius: "50%",
              background: "#03101f", border: `2px solid ${color}`,
              boxShadow: `0 0 8px ${color}88`,
            }} />
            <div style={{ color: "#edf7ff", fontSize: 12.5, fontWeight: 700 }}>
              <span style={{ color, fontWeight: 600, marginRight: 6 }}>{k + 1}</span>{s.s}
            </div>
            <div style={{ color: "#a8bfd6", fontSize: 11.5, lineHeight: 1.5, marginTop: 3 }}>{s.t}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ─── EXPERIENCE ──────────────────────────────────────────────── */
function ExperienceSection() {
  const ref = useR(null);
  const fillRef = useR(null);
  const [open, setOpen] = useS(0);
  const isMobile = useIsMobile();

  // timeline fill follows scroll through the section
  useLE(() => {
    if (fxReduced()) { fillRef.current.style.transform = "scaleY(1)"; return; }
    const tween = gsap.fromTo(fillRef.current, { scaleY: 0 }, {
      scaleY: 1, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top 60%", end: "bottom 70%", scrub: 0.5 },
    });
    return () => { tween.scrollTrigger && tween.scrollTrigger.kill(); tween.kill(); };
  }, []);

  const toggle = (i) => {
    setOpen(open === i ? -1 : i);
    setTimeout(() => ScrollTrigger.refresh(), 600);
  };

  return (
    <section id="experience" ref={ref} style={sectionStyle}>
      <SectionHead index="02" cmd="$ kubectl describe deployment/filip-csupka --show-history" title="EXPERIENCE" />

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "32px 1fr" : "60px 1fr", gap: isMobile ? 12 : 24 }}>
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute", left: 28, top: 0, bottom: 0, width: 2,
            background: "linear-gradient(to bottom, #42e0ff, #5cffb1, #ffc64a, #ff5f80, #a78bfa)",
            opacity: 0.3,
          }} />
          <div ref={fillRef} style={{
            position: "absolute", left: 28, top: 0, bottom: 0, width: 2,
            background: "linear-gradient(to bottom, #42e0ff, #5cffb1)",
            boxShadow: "0 0 14px #42e0ff", transformOrigin: "top",
          }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {D2.experience.map((job, i) => (
            <Reveal key={job.id} y={36} x={24}>
              <ExpRow job={job} idx={i} open={open === i} onToggle={() => toggle(i)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpRow({ job, idx, open, onToggle }) {
  const color = job.color;

  return (
    <SpotlightCard color={color} style={{
      position: "relative", overflow: "visible",
      borderRadius: 8,
    }} innerStyle={{}}>
      <div style={{
        position: "absolute", left: -32, top: 18,
        width: 14, height: 14, borderRadius: "50%",
        background: "#03101f", border: `2px solid ${color}`,
        boxShadow: `0 0 ${open ? 18 : 8}px ${color}`,
        zIndex: 2, transition: "box-shadow 0.3s",
      }}>
        <div className="fx-pulse-soft" style={{
          position: "absolute", inset: 2, borderRadius: "50%", background: color,
          animationDelay: `${idx * -0.4}s`,
        }} />
      </div>

      <div style={{
        background: open
          ? "linear-gradient(135deg, rgba(7,27,49,0.95), rgba(12,39,67,0.95))"
          : GLASS,
        backdropFilter: "blur(6px)",
        border: `1px solid ${open ? color : "rgba(66,224,255,0.2)"}`,
        borderRadius: 8, overflow: "hidden",
        boxShadow: open ? `0 12px 30px rgba(0,0,0,0.4), 0 0 30px ${color}26` : "none",
        transition: "border-color 0.3s, box-shadow 0.3s, background 0.3s",
      }}>
        <button onClick={onToggle} aria-expanded={open} style={{
          display: "block", width: "100%", textAlign: "left",
          padding: "16px 20px",
          background: "transparent", border: "none", cursor: "pointer",
          fontFamily: MONO,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ color, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              ● {job.org}
            </span>
            <span style={{ marginLeft: "auto", color: "#5cffb1", fontSize: 11 }}>
              status: <strong>{job.status}</strong>
            </span>
            <span aria-hidden="true" style={{ color: "#5f7f9e", fontSize: 11 }}>{open ? "▾" : "▸"}</span>
          </div>
          <div style={{
            color: "#edf7ff", fontSize: 17, fontWeight: 700, marginTop: 8,
            fontFamily: "'Orbitron', monospace", letterSpacing: "0.02em",
          }}>{job.title}</div>
          <div style={{ color: "#a8bfd6", fontSize: 12, marginTop: 4 }}>
            <span style={{ color: "#5f7f9e" }}>focus:</span> {job.focus}
          </div>
        </button>

        <div style={{
          maxHeight: open ? 2400 : 0,
          overflow: "hidden",
          transition: "max-height 0.5s ease",
        }}>
          <div style={{ padding: "0 20px 20px", borderTop: `1px dashed ${color}40` }}>
            <div style={{
              padding: "16px 0 12px",
              color: "#f3e99a", fontSize: 13, lineHeight: 1.7, fontFamily: MONO,
            }}>
              <span style={{ color: "#5f7f9e" }}># summary</span><br />
              {job.summary}
            </div>

            <div style={{
              fontSize: 11, color: "#5f7f9e", letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 8, marginTop: 8,
            }}>⸬ highlights ({job.highlights.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {job.highlights.map((h, k) => (
                <HighlightLog key={k} text={h} idx={k} color={color} active={open} />
              ))}
            </div>

            {job.situations && job.situations.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <div style={{
                  fontSize: 11, color: "#5f7f9e", letterSpacing: "0.1em", textTransform: "uppercase",
                  marginBottom: 8,
                }}>⸬ situations ({job.situations.length})</div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {job.situations.map((s) => (
                    <div key={s.t} style={{
                      padding: "10px 0", borderTop: `1px solid ${color}26`, fontFamily: MONO,
                    }}>
                      <div style={{ color: "#edf7ff", fontSize: 12.5, fontWeight: 700 }}>{s.t}</div>
                      <div style={{ color: "#a8bfd6", fontSize: 12, lineHeight: 1.6, marginTop: 2 }}>{s.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {job.tags.map((tag) => <Tag key={tag} text={tag} color={color} />)}
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

function HighlightLog({ text, idx, color, active }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "34px 16px 1fr",
      gap: 10, alignItems: "baseline",
      fontFamily: MONO, fontSize: 12.5,
      transform: active ? "translateX(0)" : "translateX(-8px)",
      opacity: active ? 1 : 0,
      transition: `all 0.4s ease ${idx * 0.06}s`,
    }}>
      <span style={{ color: "#5f7f9e", fontSize: 10 }}>
        [{String(idx + 1).padStart(2, "0")}]
      </span>
      <span style={{ color }}>⸬</span>
      <span style={{ color: "#a8bfd6", lineHeight: 1.6 }}>{text}</span>
    </div>
  );
}

function Tag({ text, color }) {
  const [hover, setHover] = useS(false);
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: MONO, fontSize: 11,
        padding: "3px 9px", borderRadius: 4,
        border: `1px solid ${color}55`,
        background: hover ? `${color}22` : `${color}10`,
        color, transition: "all 0.2s",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hover ? `0 4px 12px ${color}33` : "none",
        cursor: "default",
      }}
    >{text}</span>
  );
}

/* ─── ABOUT ME ──────────────────────────────────────────────── */
function AboutSection() {
  return (
    <section id="about" style={sectionStyle}>
      <SectionHead index="03" cmd="$ kubectl describe human/filip-csupka -o yaml" title="ABOUT ME" />

      <Reveal y={20} style={{
        color: "#a8bfd6", fontSize: 13, lineHeight: 1.7, maxWidth: 760,
        marginBottom: 24, fontFamily: MONO,
      }}>
        Hyperactive family-first human with too many hobbies, a home Kubernetes cluster, and a healthy belief that learning starts exactly where confidence ends.
      </Reveal>

      <Reveal stagger={0.1} y={36} style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
        gap: 16,
      }}>
        {D2.about.map((a, i) => <AboutCard key={a.key} item={a} idx={i} />)}
      </Reveal>

      <Reveal y={30} style={{ marginTop: 18 }}><NotesCard /></Reveal>
      <LangRibbon />
    </section>
  );
}

function AboutCard({ item, idx }) {
  return (
    <SpotlightCard color={item.color} style={{
      border: `1px solid ${item.color}40`,
      borderRadius: 10,
      background: GLASS, backdropFilter: "blur(8px)",
      boxShadow: "0 6px 16px rgba(0,0,0,0.22)",
    }} innerStyle={{ padding: 18 }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 2,
        background: `linear-gradient(90deg, ${item.color}, transparent)`,
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontFamily: MONO }}>
        <span className="fx-pulse-soft" style={{
          width: 8, height: 8, borderRadius: "50%", background: item.color,
          boxShadow: `0 0 10px ${item.color}`, animationDelay: `${idx * -0.5}s`,
        }} />
        <span style={{
          color: item.color, fontSize: 11, letterSpacing: "0.12em",
          textTransform: "uppercase", fontWeight: 700,
        }}>{item.key}</span>
      </div>
      <div style={{ color: "#a8bfd6", fontSize: 13, lineHeight: 1.7, fontFamily: MONO }}>{item.val}</div>
    </SpotlightCard>
  );
}

function NotesCard() {
  const [active, setActive] = useS(0);
  const [tick, setTick] = useS(0);

  useE(() => {
    const a = setInterval(() => setActive((x) => (x + 1) % D2.notes.length), 2400);
    const b = setInterval(() => setTick((x) => x + 1), 1000);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

  return (
    <div style={{
      border: "1px solid rgba(66,224,255,0.3)",
      borderRadius: 10, padding: 20,
      background: "linear-gradient(135deg, rgba(7,27,49,0.8), rgba(12,39,67,0.65))",
      backdropFilter: "blur(10px)",
      boxShadow: "0 14px 30px rgba(0,0,0,0.3)",
    }}>
      <div style={{ fontFamily: MONO, fontSize: 11, color: "#5f7f9e", letterSpacing: "0.1em", marginBottom: 12 }}>
        # operating_notes <span style={{ color: "#5cffb1" }}>⸬ tick {tick}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {D2.notes.map((note, i) => {
          const isActive = i === active;
          return (
            <div key={note} style={{
              display: "grid", gridTemplateColumns: "32px 1fr",
              gap: 12, alignItems: "baseline", fontFamily: MONO,
              padding: "8px 12px", borderRadius: 6,
              background: isActive ? "rgba(66,224,255,0.08)" : "transparent",
              transition: "all 0.4s",
              borderLeft: isActive ? "2px solid #42e0ff" : "2px solid transparent",
            }}>
              <span style={{ color: isActive ? "#42e0ff" : "#5f7f9e", fontSize: 11 }}>
                [{String(i).padStart(2, "0")}]
              </span>
              <span style={{
                color: isActive ? "#edf7ff" : "#a8bfd6", fontSize: 13,
                lineHeight: 1.6, transition: "color 0.4s",
              }}>{note}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LangRibbon() {
  const ref = useR(null);
  useLE(() => {
    if (fxReduced()) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current.children, {
        y: 20, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
      gsap.from(ref.current.querySelectorAll("[data-bar]"), {
        scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "power3.out", stagger: 0.12, delay: 0.2,
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} style={{
      marginTop: 18,
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12,
    }}>
      {D2.languages.map((l, i) => {
        const c = ["#42e0ff", "#5cffb1", "#ffc64a"][i];
        return (
          <div key={l.lang} style={{
            border: `1px solid ${c}33`, borderRadius: 8, padding: 12,
            background: GLASS, backdropFilter: "blur(6px)", fontFamily: MONO,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: "#edf7ff", fontWeight: 600 }}>{l.lang}</span>
              <span style={{ color: c }}>{l.note}</span>
            </div>
            <div style={{ marginTop: 8, height: 5, borderRadius: 3, background: "rgba(66,224,255,0.06)", overflow: "hidden" }}>
              <div data-bar style={{
                height: "100%", width: `${l.level * 100}%`,
                background: `linear-gradient(90deg, ${c}, ${c}88)`,
                boxShadow: `0 0 8px ${c}`,
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── CONTACT ──────────────────────────────────────────────────── */
function ContactSection() {
  return (
    <section id="contact" style={sectionStyle}>
      <SectionHead index="04" cmd="$ kubectl exec -it filip-csupka -- /bin/contact" title="CONTACT" />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 28, maxWidth: 760, margin: "0 auto" }}>
        <Reveal y={40} style={{
          border: "1px solid #24577e", borderRadius: 10, overflow: "hidden",
          background: "rgba(3,16,31,0.88)", backdropFilter: "blur(10px)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 60px rgba(66,224,255,0.08)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 14px", borderBottom: "1px solid #24577e", background: "#0c2743",
          }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
            <span style={{ marginLeft: 14, fontSize: 11, color: "#5f7f9e", fontFamily: MONO }}>
              filip@sre-cluster:~$ contact --human
            </span>
          </div>
          <div style={{ padding: 26, fontFamily: MONO, fontSize: 13 }}>
            <div style={{ color: "#5cffb1", marginBottom: 14 }}>
              <span style={{ color: "#42e0ff" }}>filip@sre-cluster</span>
              <span style={{ color: "#5f7f9e" }}>:</span>
              <span style={{ color: "#a78bfa" }}>~</span>
              <span style={{ color: "#5f7f9e" }}>$</span> echo "$CONTACT_INFO"
            </div>
            <Reveal stagger={0.08} y={0} x={-24} duration={0.6} start="top 85%">
              {D2.contact.map((c) => <ContactRow key={c.key} c={c} />)}
            </Reveal>
            <div style={{ marginTop: 22, color: "#5cffb1" }}>
              <span style={{ color: "#42e0ff" }}>filip@sre-cluster</span>
              <span style={{ color: "#5f7f9e" }}>:</span>
              <span style={{ color: "#a78bfa" }}>~</span>
              <span style={{ color: "#5f7f9e" }}>$ </span>
              <span style={{ color: "#a8bfd6" }}>_</span>
              <span className="fx-blink" style={{
                display: "inline-block", width: 8, height: "1em",
                background: "#42e0ff", marginLeft: 2, verticalAlign: "-2px",
              }} />
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal y={14} style={{ fontFamily: MONO, fontSize: 11, color: "#5f7f9e", letterSpacing: "0.1em", marginBottom: 12 }}>
            $ ls ~/projects/
          </Reveal>
          <Reveal as="h3" y={20} style={{
            fontFamily: "'Orbitron', monospace", fontSize: "1.4rem", letterSpacing: "0.08em",
            color: "#edf7ff", margin: "0 0 16px",
          }}>
            <span style={{ color: "#42e0ff" }}>./</span>SIDE PROJECTS
          </Reveal>
          <Reveal stagger={0.1} y={32} style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
            gap: 12,
          }}>
            {D2.sideProjects.map((sp, i) => <SideProjectCard key={sp.name} sp={sp} idx={i} />)}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ c }) {
  const isMobile = useIsMobile();
  const Wrap = c.href ? "a" : "div";
  const linkProps = c.href
    ? {
        href: c.href,
        target: c.href.startsWith("/") ? undefined : "_blank",
        rel: c.href.startsWith("/") ? undefined : "noopener noreferrer",
        download: c.download,
        className: "fx-link",
        style: {
          color: "#5cffb1", textDecoration: "none",
          borderBottom: "1px dashed rgba(92,255,177,0.3)",
          fontSize: isMobile ? 11 : 13, wordBreak: "break-all",
        },
      }
    : { style: { color: "#a8bfd6", fontSize: isMobile ? 11 : 13 } };
  return (
    <div style={{
      display: "grid", gridTemplateColumns: isMobile ? "90px 12px 1fr" : "120px 16px 1fr",
      gap: isMobile ? 6 : 12, padding: "6px 0",
    }}>
      <span style={{ color: "#42e0ff", fontSize: isMobile ? 11 : 13 }}>{c.key}</span>
      <span style={{ color: "#5f7f9e" }}>:</span>
      {React.createElement(Wrap, linkProps, c.val)}
    </div>
  );
}

function SideProjectCard({ sp, idx }) {
  return (
    <SpotlightCard
      as={sp.href ? "a" : "div"}
      color={sp.color}
      {...(sp.href ? { href: sp.href, target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{
        display: "block", textDecoration: "none",
        border: `1px solid ${sp.color}40`, borderRadius: 10,
        background: GLASS, backdropFilter: "blur(8px)",
        boxShadow: "0 6px 14px rgba(0,0,0,0.22)",
        cursor: sp.href ? "pointer" : "default",
      }}
      innerStyle={{ padding: 16 }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 2,
        background: `linear-gradient(90deg, ${sp.color}, transparent)`,
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontFamily: MONO }}>
        <span className="fx-pulse-soft" style={{
          width: 8, height: 8, borderRadius: "50%", background: sp.color,
          boxShadow: `0 0 10px ${sp.color}`, animationDelay: `${idx * -0.6}s`,
        }} />
        <span style={{ color: sp.color, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
          {sp.tagline}
        </span>
      </div>
      <div style={{
        color: "#edf7ff", fontFamily: "'Orbitron', monospace", fontSize: 14,
        fontWeight: 700, marginBottom: 6, letterSpacing: "0.02em",
      }}>{sp.name + (sp.href ? "  →" : "")}</div>
      <div style={{ color: "#a8bfd6", fontSize: 12, lineHeight: 1.6, fontFamily: MONO }}>{sp.blurb}</div>
    </SpotlightCard>
  );
}

const sectionStyle = {
  position: "relative", zIndex: 2,
  padding: "60px 16px",
  maxWidth: 1180, margin: "0 auto",
};

Object.assign(window, { StackSection, ExperienceSection, AboutSection, ContactSection });
