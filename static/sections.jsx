/* global React */
const { useState: useS, useEffect: useE, useRef: useR, useMemo: useM } = React;
const D2 = window.CV_DATA;

/* ─── TOOLBOX + FLOWS — what I run, where I ran it, and how work moves ─── */
const MONO = "'JetBrains Mono', monospace";
const clamp01 = (v) => Math.max(0, Math.min(1, v));

function StackSection() {
  const ref = useR(null);
  const p = useElementProgress(ref);
  const isMobile = useIsMobile();
  const [sel, setSel] = useS("all");
  const ctxs = D2.contexts;
  const ctxColor = Object.fromEntries(ctxs.map((c) => [c.key, c.color]));

  return (
    <section id="stack" ref={ref} style={{
      position: "relative", zIndex: 2,
      maxWidth: 1180, margin: "0 auto", padding: "60px 16px 100px",
    }}>
      <SectionHead cmd="$ helm list -A  # what I actually run, and where" title="TOOLBOX & FLOWS" />

      <p style={{
        color: "#a8bfd6", fontSize: 13, lineHeight: 1.7, maxWidth: 640,
        margin: "0 0 28px", fontFamily: MONO,
      }}>
        Tools grouped by the job they do. Filter by engagement to see what each one actually ran on.
      </p>

      {/* engagement filter */}
      <div role="group" aria-label="Filter tools by engagement" style={{
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
              background: on ? c.color : "rgba(7,27,49,0.7)",
              border: `1px solid ${on ? c.color : "rgba(66,224,255,0.22)"}`,
              fontWeight: on ? 700 : 500,
              transition: "background 0.2s, color 0.2s, border-color 0.2s",
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: on ? "#03101f" : c.color,
              }} />
              {c.label}
            </button>
          );
        })}
      </div>

      {/* toolbox table */}
      <div style={{ borderTop: "1px solid rgba(66,224,255,0.16)" }}>
        {D2.toolbox.map((row, i) => (
          <ToolRow key={row.key} row={row} sel={sel} ctxColor={ctxColor}
                   isMobile={isMobile} reveal={clamp01((p - 0.04) * 6 - i * 0.12)} />
        ))}
      </div>

      {/* flows */}
      <div style={{ marginTop: 64 }}>
        <h3 style={{
          fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
          fontWeight: 800, letterSpacing: "0.1em", color: "#edf7ff", margin: "0 0 8px",
        }}><span style={{ color: "#42e0ff" }}>./</span>FLOWS</h3>
        <p style={{
          color: "#a8bfd6", fontSize: 13, lineHeight: 1.7, maxWidth: 640,
          margin: "0 0 22px", fontFamily: MONO,
        }}>
          How work moves on each engagement, in the order it happens.
        </p>
        <div style={{ borderTop: "1px solid rgba(66,224,255,0.16)" }}>
          {D2.flows.map((f, i) => (
            <FlowRow key={f.key} flow={f} color={ctxColor[f.ctx]} dim={sel !== "all" && sel !== f.ctx}
                     isMobile={isMobile} reveal={clamp01((p - 0.42) * 5 - i * 0.12)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolRow({ row, sel, ctxColor, isMobile, reveal }) {
  const rowActive = sel === "all" || row.tools.some((t) => t.in.length === 0 || t.in.includes(sel));
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "220px 1fr",
      gap: isMobile ? 10 : 24, alignItems: "baseline",
      padding: isMobile ? "16px 0" : "15px 0",
      borderBottom: "1px solid rgba(66,224,255,0.16)",
      opacity: (rowActive ? 1 : 0.35) * (0.15 + reveal * 0.85),
      transform: `translateY(${(1 - reveal) * 14}px)`,
      transition: "opacity 0.3s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: row.color, flexShrink: 0 }} />
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
            <span key={tool.n} style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              fontFamily: MONO, fontSize: 12, padding: "4px 10px", borderRadius: 4,
              color: hit ? "#edf7ff" : "#5f7f9e",
              background: hit ? "rgba(66,224,255,0.07)" : "transparent",
              border: `1px solid ${hit ? "rgba(66,224,255,0.28)" : "rgba(66,224,255,0.1)"}`,
              opacity: hit ? 1 : 0.5,
              transition: "opacity 0.25s, color 0.25s, background 0.25s, border-color 0.25s",
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

function FlowRow({ flow, color, dim, isMobile, reveal }) {
  const n = flow.steps.length;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "220px 1fr",
      gap: isMobile ? 14 : 24, alignItems: "start",
      padding: "20px 0",
      borderBottom: "1px solid rgba(66,224,255,0.16)",
      opacity: (dim ? 0.3 : 1) * (0.15 + reveal * 0.85),
      transform: `translateY(${(1 - reveal) * 14}px)`,
      transition: "opacity 0.3s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
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
        {/* connector, drawn in once on reveal */}
        <span aria-hidden="true" style={isMobile ? {
          position: "absolute", left: 4, top: 6, bottom: 6, width: 1,
          background: `${color}66`, transformOrigin: "top",
          transform: `scaleY(${reveal})`,
        } : {
          position: "absolute", left: 4, right: 4, top: 4, height: 1,
          background: `${color}66`, transformOrigin: "left",
          transform: `scaleX(${reveal})`,
        }} />
        {flow.steps.map((s, k) => (
          <li key={s.s} style={{
            position: "relative", fontFamily: MONO,
            paddingTop: isMobile ? 0 : 18, paddingLeft: isMobile ? 22 : 0,
          }}>
            <span aria-hidden="true" style={{
              position: "absolute", left: 0, top: isMobile ? 4 : 0,
              width: 9, height: 9, borderRadius: "50%",
              background: "#03101f", border: `2px solid ${color}`,
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
  const p = useElementProgress(ref);
  const [open, setOpen] = useS(0);
  const isMobile = useIsMobile();

  return (
    <section id="experience" ref={ref} style={sectionStyle}>
      <SectionHead cmd="$ kubectl describe deployment/filip-csupka --show-history" title="EXPERIENCE" />

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "32px 1fr" : "60px 1fr", gap: isMobile ? 12 : 24 }}>
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute", left: 28, top: 0, bottom: 0, width: 2,
            background: "linear-gradient(to bottom, #42e0ff, #5cffb1, #ffc64a, #ff5f80, #a78bfa)",
            opacity: 0.3,
          }} />
          <div style={{
            position: "absolute", left: 28, top: 0, width: 2,
            height: `${Math.min(1, p * 1.2) * 100}%`,
            background: "linear-gradient(to bottom, #42e0ff, #5cffb1)",
            boxShadow: "0 0 14px #42e0ff",
            transition: "height 0.1s linear",
          }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {D2.experience.map((job, i) => (
            <ExpRow key={job.id} job={job} idx={i} progress={p} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} total={D2.experience.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpRow({ job, idx, progress, open, onToggle, total }) {
  const reveal = Math.max(0, Math.min(1, (progress - 0.05) * 4 - idx * 0.15));
  const t = useTick();
  const color = job.color;

  return (
    <div style={{
      position: "relative",
      transform: `translateX(${(1 - reveal) * 40}px)`,
      opacity: reveal,
      transition: "opacity 0.2s",
    }}>
      <div style={{
        position: "absolute", left: -32, top: 18,
        width: 14, height: 14, borderRadius: "50%",
        background: "#03101f", border: `2px solid ${color}`,
        boxShadow: `0 0 ${open ? 18 : 8}px ${color}`,
        zIndex: 2,
      }}>
        <div style={{
          position: "absolute", inset: 2,
          borderRadius: "50%",
          background: color,
          opacity: 0.5 + (Math.sin(t * 3 + idx) + 1) / 2 * 0.5,
        }} />
      </div>

      <div style={{
        background: open
          ? `linear-gradient(135deg, rgba(7,27,49,0.95), rgba(12,39,67,0.95))`
          : "rgba(7,27,49,0.7)",
        border: `1px solid ${open ? color : "rgba(66,224,255,0.2)"}`,
        borderRadius: 8, overflow: "hidden",
        boxShadow: open ? `0 12px 30px rgba(0,0,0,0.4), 0 0 30px ${color}26` : "none",
        transition: "all 0.3s",
      }}>
        <button onClick={onToggle} style={{
          display: "block", width: "100%", textAlign: "left",
          padding: "16px 20px",
          background: "transparent", border: "none", cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ color: color, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              ● {job.org}
            </span>
            <span style={{ color: "#a8bfd6", fontSize: 11 }}>{job.period}</span>
            <span style={{ marginLeft: "auto", color: job.status === "Running" ? "#5cffb1" : "#5f7f9e", fontSize: 11 }}>
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
              color: "#f3e99a", fontSize: 13, lineHeight: 1.7,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              <span style={{ color: "#5f7f9e" }}># summary</span><br/>
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
                      padding: "10px 0", borderTop: `1px solid ${color}26`,
                      fontFamily: "'JetBrains Mono', monospace",
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
    </div>
  );
}

function HighlightLog({ text, idx, color, active }) {
  const t = useTick();
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "34px 16px 1fr",
      gap: 10, alignItems: "baseline",
      fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5,
      transform: active ? "translateX(0)" : "translateX(-8px)",
      opacity: active ? 1 : 0,
      transition: `all 0.4s ease ${idx * 0.06}s`,
    }}>
      <span style={{ color: "#5f7f9e", fontSize: 10 }}>
        [{String(idx + 1).padStart(2, "0")}]
      </span>
      <span style={{ color, opacity: 0.6 + (Math.sin(t * 2 + idx) + 1) / 2 * 0.4 }}>⸬</span>
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
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
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
  const ref = useR(null);
  const p = useElementProgress(ref);
  const t = useTick();

  return (
    <section id="about" ref={ref} style={sectionStyle}>
      <SectionHead cmd="$ kubectl describe human/filip-csupka -o yaml" title="ABOUT ME" />

      <div style={{
        color: "#a8bfd6", fontSize: 13, lineHeight: 1.7, maxWidth: 760,
        marginBottom: 24, fontFamily: "'JetBrains Mono', monospace",
      }}>
        Hyperactive family-first human with too many hobbies, a home Kubernetes cluster, and a healthy belief that learning starts exactly where confidence ends.
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
        gap: 16,
      }}>
        {D2.about.map((a, i) => (
          <AboutCard key={a.key} item={a} idx={i} progress={p} t={t} />
        ))}
      </div>

      <NotesCard progress={p} t={t} />
      <LangRibbon progress={p} t={t} />
    </section>
  );
}

function AboutCard({ item, idx, progress, t }) {
  const reveal = Math.max(0, Math.min(1, (progress - 0.05) * 5 - idx * 0.1));
  const drift = Math.sin(t * 0.7 + idx * 1.2) * 3;
  const [hover, setHover] = useS(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: `1px solid ${item.color}40`,
        borderRadius: 10, padding: 18,
        background: hover
          ? `linear-gradient(135deg, ${item.color}15, rgba(7,27,49,0.9))`
          : "rgba(7,27,49,0.7)",
        backdropFilter: "blur(6px)",
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 30 + (hover ? -4 : drift)}px)`,
        transition: "background 0.3s, box-shadow 0.3s",
        boxShadow: hover ? `0 14px 30px ${item.color}33` : "0 6px 16px rgba(0,0,0,0.22)",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${item.color}, transparent)`,
      }} />
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: item.color,
          boxShadow: `0 0 ${6 + (Math.sin(t * 2 + idx) + 1) / 2 * 8}px ${item.color}`,
        }} />
        <span style={{
          color: item.color, fontSize: 11, letterSpacing: "0.12em",
          textTransform: "uppercase", fontWeight: 700,
        }}>{item.key}</span>
      </div>
      <div style={{
        color: "#a8bfd6", fontSize: 13, lineHeight: 1.7,
        fontFamily: "'JetBrains Mono', monospace",
      }}>{item.val}</div>
    </div>
  );
}

function NotesCard({ progress, t }) {
  const reveal = Math.max(0, Math.min(1, (progress - 0.2) * 5));
  const [active, setActive] = useS(0);

  useE(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % D2.notes.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      marginTop: 18,
      border: "1px solid rgba(66,224,255,0.3)",
      borderRadius: 10, padding: 20,
      background: "linear-gradient(135deg, rgba(7,27,49,0.85), rgba(12,39,67,0.7))",
      backdropFilter: "blur(8px)",
      opacity: reveal,
      boxShadow: "0 14px 30px rgba(0,0,0,0.3)",
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: "#5f7f9e", letterSpacing: "0.1em", marginBottom: 12,
      }}># operating_notes <span style={{ color: "#5cffb1" }}>⸬ tick {Math.floor(t)}</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {D2.notes.map((note, i) => {
          const isActive = i === active;
          return (
            <div key={note} style={{
              display: "grid", gridTemplateColumns: "32px 1fr",
              gap: 12, alignItems: "baseline",
              fontFamily: "'JetBrains Mono', monospace",
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

function LangRibbon({ progress, t }) {
  const reveal = Math.max(0, Math.min(1, (progress - 0.35) * 4));
  return (
    <div style={{
      marginTop: 18, opacity: reveal,
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12,
    }}>
      {D2.languages.map((l, i) => {
        const colors = ["#42e0ff", "#5cffb1", "#ffc64a"];
        const c = colors[i];
        const lvl = l.level * Math.min(1, reveal * 1.5);
        return (
          <div key={l.lang} style={{
            border: `1px solid ${c}33`, borderRadius: 8, padding: 12,
            background: "rgba(7,27,49,0.6)",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: "#edf7ff", fontWeight: 600 }}>{l.lang}</span>
              <span style={{ color: c }}>{l.note}</span>
            </div>
            <div style={{
              marginTop: 8, height: 5, borderRadius: 3,
              background: "rgba(66,224,255,0.06)", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", width: `${lvl * 100}%`,
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
  const ref = useR(null);
  const p = useElementProgress(ref);
  const t = useTick();

  return (
    <section id="contact" ref={ref} style={sectionStyle}>
      <SectionHead cmd="$ kubectl exec -it filip-csupka -- /bin/contact" title="CONTACT" />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 28, maxWidth: 760, margin: "0 auto" }}>
        <div style={{
          border: "1px solid #24577e", borderRadius: 10, overflow: "hidden",
          background: "rgba(3,16,31,0.92)", backdropFilter: "blur(8px)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 60px rgba(66,224,255,0.08)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 14px", borderBottom: "1px solid #24577e",
            background: "#0c2743",
          }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
            <span style={{
              marginLeft: 14, fontSize: 11, color: "#5f7f9e",
              fontFamily: "'JetBrains Mono', monospace",
            }}>filip@sre-cluster:~$ contact --human</span>
          </div>
          <div style={{ padding: 26, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
            <div style={{ color: "#5cffb1", marginBottom: 14 }}>
              <span style={{ color: "#42e0ff" }}>filip@sre-cluster</span>
              <span style={{ color: "#5f7f9e" }}>:</span>
              <span style={{ color: "#a78bfa" }}>~</span>
              <span style={{ color: "#5f7f9e" }}>$</span> echo "$CONTACT_INFO"
            </div>
            {D2.contact.map((c, i) => (
              <ContactRow key={c.key} c={c} idx={i} progress={p} />
            ))}
            <div style={{ marginTop: 22, color: "#5cffb1" }}>
              <span style={{ color: "#42e0ff" }}>filip@sre-cluster</span>
              <span style={{ color: "#5f7f9e" }}>:</span>
              <span style={{ color: "#a78bfa" }}>~</span>
              <span style={{ color: "#5f7f9e" }}>$ </span>
              <span style={{ color: "#a8bfd6" }}>_</span>
              <span style={{
                display: "inline-block", width: 8, height: "1em",
                background: "#42e0ff", marginLeft: 2, verticalAlign: "-2px",
                opacity: Math.sin(t * 6) > 0 ? 1 : 0,
              }} />
            </div>
          </div>
        </div>

        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: "#5f7f9e", letterSpacing: "0.1em", marginBottom: 12,
          }}>$ ls ~/projects/</div>
          <h3 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "1.4rem", letterSpacing: "0.08em",
            color: "#edf7ff", margin: "0 0 16px",
          }}>
            <span style={{ color: "#42e0ff" }}>./</span>SIDE PROJECTS
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
            gap: 12,
          }}>
            {D2.sideProjects.map((sp, i) => (
              <SideProjectCard key={sp.name} sp={sp} idx={i} progress={p} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ c, idx, progress }) {
  const reveal = Math.max(0, Math.min(1, (progress - 0.1) * 4 - idx * 0.08));
  const isMobile = useIsMobile();
  const Wrap = c.href ? "a" : "div";
  const linkProps = c.href
    ? {
        href: c.href,
        target: c.href.startsWith("/") ? undefined : "_blank",
        rel: c.href.startsWith("/") ? undefined : "noopener noreferrer",
        download: c.download,
        style: {
          color: "#5cffb1",
          textDecoration: "none",
          borderBottom: "1px dashed rgba(92,255,177,0.3)",
          fontSize: isMobile ? 11 : 13,
          wordBreak: "break-all",
        },
      }
    : {
        style: { color: "#a8bfd6", fontSize: isMobile ? 11 : 13 },
      };
  return (
    <div style={{
      display: "grid", gridTemplateColumns: isMobile ? "90px 12px 1fr" : "120px 16px 1fr",
      gap: isMobile ? 6 : 12, padding: "6px 0",
      opacity: reveal, transform: `translateX(${(1 - reveal) * -24}px)`,
      transition: "opacity 0.2s, transform 0.2s",
    }}>
      <span style={{ color: "#42e0ff", fontSize: isMobile ? 11 : 13 }}>{c.key}</span>
      <span style={{ color: "#5f7f9e" }}>:</span>
      {React.createElement(
        Wrap,
        linkProps,
        c.val
      )}
    </div>
  );
}

function SideProjectCard({ sp, idx, progress, t }) {
  const reveal = Math.max(0, Math.min(1, (progress - 0.25) * 5 - idx * 0.12));
  const [hover, setHover] = useS(false);
  const Wrap = sp.href ? "a" : "div";
  const live = (Math.sin(t * 1.4 + idx * 0.7) + 1) / 2;

  return React.createElement(
    Wrap,
    {
      ...(sp.href ? { href: sp.href, target: "_blank", rel: "noopener noreferrer" } : {}),
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "block",
        textDecoration: "none",
        border: `1px solid ${sp.color}40`,
        borderRadius: 10, padding: 16,
        background: hover
          ? `linear-gradient(135deg, ${sp.color}18, rgba(7,27,49,0.9))`
          : "rgba(7,27,49,0.7)",
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 24 + (hover ? -3 : 0)}px)`,
        transition: "all 0.3s",
        boxShadow: hover ? `0 12px 24px ${sp.color}33` : "0 6px 14px rgba(0,0,0,0.22)",
        position: "relative", overflow: "hidden",
        cursor: sp.href ? "pointer" : "default",
      },
    },
    React.createElement("div", {
      style: { position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${sp.color}, transparent)` }
    }),
    React.createElement("div", {
      style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }
    },
      React.createElement("span", { style: {
        width: 8, height: 8, borderRadius: "50%",
        background: sp.color,
        boxShadow: `0 0 ${4 + live * 8}px ${sp.color}`,
      }}),
      React.createElement("span", {
        style: { color: sp.color, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }
      }, sp.tagline)
    ),
    React.createElement("div", {
      style: { color: "#edf7ff", fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 700, marginBottom: 6, letterSpacing: "0.02em" }
    }, sp.name + (sp.href ? "  →" : "")),
    React.createElement("div", {
      style: { color: "#a8bfd6", fontSize: 12, lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }
    }, sp.blurb)
  );
}

const sectionStyle = {
  position: "relative", zIndex: 2,
  padding: "60px 16px",
  maxWidth: 1180, margin: "0 auto",
};

Object.assign(window, { StackSection, ExperienceSection, AboutSection, ContactSection });
