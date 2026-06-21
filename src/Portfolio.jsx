import { useState, useEffect, useRef } from "react";

const PROFILE_IMAGE = process.env.PUBLIC_URL + "/yasirSultan.png";
/* ─── DESIGN TOKENS ─── */
const T = {
  bg:       "#04070a",
  bg1:      "#080d12",
  bg2:      "#0d1419",
  bg3:      "#111920",
  border:   "#1a2535",
  border2:  "#223044",
  accent:   "#00e5ff",
  accent2:  "#0077ff",
  accentDim:"rgba(0,229,255,0.08)",
  accentGlow:"rgba(0,229,255,0.15)",
  green:    "#00e5a0",
  purple:   "#a78bfa",
  amber:    "#fbbf24",
  text:     "#f0f4f8",
  textMid:  "#8fa3b8",
  textDim:  "#4a6070",
};

/* ─── HOOKS ─── */
function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

function useTyped(phrases, speed = 70, pause = 2200) {
  const [text, setText] = useState("");
  const state = useRef({ pIdx: 0, cIdx: 0, del: false });
  useEffect(() => {
    const s = state.current;
    const cur = phrases[s.pIdx];
    const t = setTimeout(() => {
      if (!s.del) {
        if (s.cIdx < cur.length) { s.cIdx++; }
        else { setTimeout(() => { s.del = true; }, pause); return; }
      } else {
        if (s.cIdx > 0) { s.cIdx--; }
        else { s.del = false; s.pIdx = (s.pIdx + 1) % phrases.length; }
      }
      setText(cur.slice(0, s.cIdx));
    }, s.del ? speed / 2 : speed);
    return () => clearTimeout(t);
  });
  return text;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]); // ← fixed: threshold added to dependency array
  return [ref, vis];
}

/* ─── MICRO COMPONENTS ─── */
function Tag({ children, color = T.accent }) {
  return (
    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color, background: `${color}14`, border: `1px solid ${color}30`, padding: "3px 9px", borderRadius: 4, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function GlowBtn({ children, onClick, primary }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 500,
        padding: "12px 26px", borderRadius: 8, cursor: "pointer",
        border: primary ? `1px solid ${T.accent}` : `1px solid ${T.border2}`,
        color: primary ? (hov ? T.bg : T.accent) : (hov ? T.text : T.textMid),
        background: primary ? (hov ? T.accent : `${T.accent}12`) : (hov ? T.bg3 : "transparent"),
        transition: "all .2s ease", whiteSpace: "nowrap",
        boxShadow: primary && hov ? `0 0 20px ${T.accent}30` : "none",
      }}>
      {children}
    </button>
  );
}

function SecLabel({ num, title }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "2.5rem", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(16px)", transition: "all .6s ease" }}>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: T.accent, letterSpacing: "0.1em" }}>0{num}</span>
      <div style={{ width: 40, height: 1, background: T.accent }} />
      <span style={{ fontSize: "clamp(1.6rem,3vw,2.1rem)", fontWeight: 700, color: T.text, letterSpacing: "-0.03em", fontFamily: "'Inter',sans-serif" }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  );
}

/* ─── ANIMATED GRID BG ─── */
function GridBg() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.border}55 1px, transparent 1px), linear-gradient(90deg, ${T.border}55 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.4 }} />
      <div style={{ position: "absolute", top: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}08 0%, transparent 70%)` }} />
      <div style={{ position: "absolute", top: "50%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${T.purple}08 0%, transparent 70%)` }} />
      <div style={{ position: "absolute", bottom: "10%", left: "20%", width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent2}06 0%, transparent 70%)` }} />
    </div>
  );
}

/* ─── NAV ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const w = useWidth();
  const mobile = w < 768;
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = id => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "space-between", padding: mobile ? "1rem 1.25rem" : "1rem 3rem", background: scrolled ? "rgba(4,7,10,0.9)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${T.border}` : "none", transition: "all .4s ease" }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, color: T.accent, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ animation: "blink 1.2s step-end infinite", fontSize: 18 }}>›</span>
          <span>yasir<span style={{ color: T.text }}>.dev</span></span>
        </div>

        {!mobile && (
          <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
            {["about","skills","projects","contact"].map(s => (
              <button key={s} onClick={() => go(s)} style={{ background: "none", border: "none", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: T.textMid, cursor: "pointer", padding: 0, transition: "color .2s", letterSpacing: "0.03em" }}
                onMouseEnter={e => e.target.style.color = T.accent} onMouseLeave={e => e.target.style.color = T.textMid}>
                {s}
              </button>
            ))}
            <GlowBtn primary onClick={() => go("contact")}>hire me</GlowBtn>
          </div>
        )}

        {mobile && (
          <button onClick={() => setMenuOpen(m => !m)} style={{ background: "none", border: "none", color: T.textMid, fontSize: 22, cursor: "pointer" }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        )}
      </nav>

      {mobile && menuOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, bottom: 0, background: T.bg, zIndex: 199, display: "flex", flexDirection: "column", gap: "0.5rem", padding: "2rem 1.5rem" }}>
          {["about","skills","projects","contact"].map(s => (
            <button key={s} onClick={() => go(s)} style={{ background: "none", border: "none", fontFamily: "'JetBrains Mono',monospace", fontSize: 18, color: T.textMid, cursor: "pointer", textAlign: "left", padding: "1rem 0", borderBottom: `1px solid ${T.border}` }}>
              <span style={{ color: T.accent }}>~/ </span>{s}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

/* ─── TERMINAL CARD ─── */
function Terminal() {
  const typed = useTyped(['"DevOps & Web Developer"', '"MERN Stack Engineer"', '"Docker & Kubernetes"', '"CI/CD Pipeline Builder"']);
  const w = useWidth(); const mobile = w < 768;

  const lines = [
    { comment: true, t: "// whoami — FAST-NUCES, Islamabad" },
    { parts: [{ c: T.accent, t: "const " }, { c: "#79c0ff", t: "dev" }, { c: T.text, t: " = {" }] },
    { parts: [{ sp: true }, { c: T.purple, t: "name" }, { c: T.textMid, t: ': ' }, { c: T.amber, t: '"Yasir Sultan",' }] },
    { parts: [{ sp: true }, { c: T.purple, t: "role" }, { c: T.textMid, t: ': ' }, { c: T.amber, t: typed, cur: true }] },
    { parts: [{ sp: true }, { c: T.purple, t: "stack" }, { c: T.textMid, t: ': [' }, { c: T.amber, t: '"MERN"' }, { c: T.textMid, t: ', ' }, { c: T.amber, t: '"Docker"' }, { c: T.textMid, t: ', ' }, { c: T.amber, t: '"K8s"' }, { c: T.textMid, t: "]," }] },
    { parts: [{ sp: true }, { c: T.purple, t: "status" }, { c: T.textMid, t: ': ' }, { c: T.green, t: '"open to internship"' }] },
    { parts: [{ c: T.text, t: "}" }] },
  ];

  return (
    <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", width: "100%" }}>
      {/* Title bar */}
      <div style={{ background: T.bg3, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
        </div>
        <span style={{ flex: 1, textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: T.textDim }}>yasir@portfolio ~ bash</span>
        <div style={{ width: 12 }} />
      </div>
      {/* Code body */}
      <div style={{ padding: mobile ? "1.25rem" : "1.75rem", fontFamily: "'JetBrains Mono',monospace", fontSize: mobile ? 12 : 14, lineHeight: 2.0, overflowX: "auto" }}>
        {lines.map((line, i) => (
          <div key={i} style={{ whiteSpace: "nowrap" }}>
            <span style={{ color: T.textDim, userSelect: "none", marginRight: 16, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
            {line.comment
              ? <span style={{ color: T.textDim, fontStyle: "italic" }}>{line.t}</span>
              : line.parts.map((p, j) =>
                  p.sp ? <span key={j}>&nbsp;&nbsp;&nbsp;&nbsp;</span> :
                  <span key={j} style={{ color: p.c || T.text }}>
                    {p.t}
                    {p.cur && <span style={{ display: "inline-block", width: 9, height: "1em", background: T.accent, verticalAlign: "middle", marginLeft: 1, animation: "blink 1s step-end infinite", borderRadius: 1 }} />}
                  </span>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── HERO ─── */
function Hero() {
  const w = useWidth(); const mobile = w < 768; const tablet = w < 1024;
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const hasPhoto = PROFILE_IMAGE && PROFILE_IMAGE !== "https://your-image-url.com/photo.jpg";

  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: mobile ? "7rem 1.25rem 3rem" : tablet ? "7rem 2rem 3rem" : "7rem 3rem 3rem", position: "relative", zIndex: 1 }}>

      {/* Photo + badge row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "2rem" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          {hasPhoto ? (
            <img src={PROFILE_IMAGE} alt="Yasir Sultan" style={{ width: mobile ? 60 : 76, height: mobile ? 60 : 76, borderRadius: "50%", objectFit: "cover", border: `2px solid ${T.accent}`, display: "block" }} />
          ) : (
            <div style={{ width: mobile ? 60 : 76, height: mobile ? 60 : 76, borderRadius: "50%", background: `${T.accent}15`, border: `2px solid ${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", fontSize: mobile ? 20 : 26, fontWeight: 700, color: T.accent }}>YS</div>
          )}
          <span style={{ position: "absolute", bottom: 3, right: 3, width: 14, height: 14, borderRadius: "50%", background: T.green, border: `2.5px solid ${T.bg}`, animation: "pulse 2.5s ease-in-out infinite" }} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: T.green, animation: "pulse 2.5s ease-in-out infinite" }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: T.green }}>Available for hire</span>
          </div>
          <div style={{ fontSize: 14, color: T.textMid }}>Islamabad, Pakistan · FAST-NUCES</div>
        </div>
      </div>

      {/* Big headline */}
      <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: mobile ? "clamp(3.5rem,14vw,5rem)" : "clamp(4rem,8vw,7rem)", fontWeight: 900, color: T.text, lineHeight: 0.95, letterSpacing: "-0.05em", marginBottom: "1.5rem" }}>
        <span style={{ display: "block" }}>Yasir</span>
        <span style={{ display: "block", WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text", backgroundImage: `linear-gradient(120deg, ${T.accent} 0%, ${T.accent2} 60%, ${T.purple} 100%)`, backgroundClip: "text" }}>Sultan.</span>
      </h1>

      <p style={{ fontSize: mobile ? 16 : 19, color: T.textMid, lineHeight: 1.75, maxWidth: 540, marginBottom: "2.5rem" }}>
        <strong style={{ color: T.text, fontWeight: 600 }}>DevOps & Web Developer</strong> building scalable systems with MERN, Docker, Kubernetes, and CI/CD pipelines.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: mobile ? "3rem" : "4rem" }}>
        <GlowBtn primary onClick={() => go("projects")}>./view-work</GlowBtn>
        <GlowBtn onClick={() => go("contact")}>./contact-me</GlowBtn>
      </div>

      {/* Terminal below headline */}
      <div style={{ maxWidth: 680 }}>
        <Terminal />
      </div>

      {/* Stat pills below terminal */}
      <div style={{ display: "flex", gap: 12, marginTop: "2rem", flexWrap: "wrap" }}>
        {[
          { label: "Projects", val: "6+", color: T.accent },
          { label: "Stack", val: "MERN", color: T.purple },
          { label: "DevOps", val: "Docker · K8s", color: T.green },
          { label: "Status", val: "Open to work", color: T.amber },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 20px", display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: mobile ? 13 : 15, fontWeight: 700, color }}>{val}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── ABOUT ─── */
function About() {
  const w = useWidth(); const mobile = w < 768;
  const [ref, vis] = useInView();
  return (
    <section id="about" style={{ padding: mobile ? "4rem 1.25rem" : "6rem 3rem", position: "relative", zIndex: 1 }}>
      <SecLabel num={1} title="About" />
      <div ref={ref} style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "3fr 2fr", gap: "3rem", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: "all .7s ease .1s" }}>
        <div>
          <p style={{ fontSize: mobile ? 16 : 18, color: T.textMid, lineHeight: 1.85, marginBottom: "1.5rem" }}>
            I'm <span style={{ color: T.text, fontWeight: 600 }}>Yasir Sultan</span>, a passionate Software Engineering student at <span style={{ color: T.accent }}>FAST-NUCES, Islamabad</span> with a strong focus on DevOps practices and modern web engineering.
          </p>
          <p style={{ fontSize: mobile ? 15 : 17, color: T.textMid, lineHeight: 1.85 }}>
            I build full-stack applications and automate infrastructure — containerizing with Docker, orchestrating at scale with Kubernetes, and wiring CI/CD pipelines with GitHub Actions and Jenkins. I care deeply about writing clean, maintainable code and systems that hold up in production.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "ti-map-pin", label: "Location", val: "Islamabad, PK" },
            { icon: "ti-school", label: "University", val: "FAST-NUCES" },
            { icon: "ti-code", label: "Focus", val: "DevOps & Web Dev" },
            { icon: "ti-brand-docker", label: "Tools", val: "Docker · K8s · CI/CD" },
            { icon: "ti-briefcase", label: "Seeking", val: "Internship" },
          ].map(({ icon, label, val }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 10 }}>
              <i className={`ti ${icon}`} style={{ fontSize: 18, color: T.accent, flexShrink: 0 }} aria-hidden="true" />
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
                <div style={{ fontSize: 14, color: T.text, marginTop: 2 }}>{val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SKILLS ─── */
function Skills() {
  const [active, setActive] = useState("all");
  const w = useWidth(); const mobile = w < 768;
  const [ref, vis] = useInView();

  const all = [
    { icon: "ti-brand-react", label: "React", color: T.accent },
    { icon: "ti-brand-nodejs", label: "Node.js", color: T.green },
    { icon: "ti-database", label: "MongoDB", color: T.green },
    { icon: "ti-server", label: "Express", color: T.textMid },
    { icon: "ti-brand-javascript", label: "JavaScript", color: T.amber },
    { icon: "ti-brand-python", label: "Python", color: T.amber },
    { icon: "ti-brand-docker", label: "Docker", color: T.accent2 },
    { icon: "ti-settings", label: "Kubernetes", color: T.accent2 },
    { icon: "ti-brand-git", label: "Git", color: "#f05032" },
    { icon: "ti-brand-github", label: "GH Actions", color: T.textMid },
    { icon: "ti-terminal-2", label: "Bash", color: T.green },
    { icon: "ti-brand-cpp", label: "C / C++", color: T.purple },
    { icon: "ti-settings-2", label: "Jenkins", color: "#d33833" },
    { icon: "ti-brand-html5", label: "HTML5", color: "#e34f26" },
    { icon: "ti-brand-css3", label: "CSS3", color: "#264de4" },
  ];

  const filters = {
    all,
    "lang & fw": all.filter(s => ["React","Node.js","JavaScript","Python","C / C++","HTML5","CSS3","Express","MongoDB"].includes(s.label)),
    devops: all.filter(s => ["Docker","Kubernetes","GH Actions","Jenkins","Bash","Git"].includes(s.label)),
    tools: all.filter(s => ["Git","GH Actions","Bash","MongoDB","Jenkins"].includes(s.label)),
  };

  const bars = [
    { label: "JavaScript / React", pct: 85, color: T.accent },
    { label: "Node.js / Express", pct: 80, color: T.green },
    { label: "Docker / K8s", pct: 75, color: T.accent2 },
    { label: "Python", pct: 72, color: T.amber },
    { label: "CI/CD", pct: 68, color: T.purple },
  ];

  return (
    <section id="skills" style={{ padding: mobile ? "4rem 1.25rem" : "6rem 3rem", position: "relative", zIndex: 1 }}>
      <SecLabel num={2} title="Tech stack" />

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: "2rem", flexWrap: "wrap" }}>
        {Object.keys(filters).map(k => (
          <button key={k} onClick={() => setActive(k)}
            style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, padding: "7px 16px", borderRadius: 6, cursor: "pointer", border: `1px solid ${active === k ? T.accent : T.border}`, color: active === k ? T.accent : T.textDim, background: active === k ? `${T.accent}10` : "transparent", transition: "all .2s" }}>
            {k}
          </button>
        ))}
      </div>

      {/* Skill chips */}
      <div ref={ref} style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${mobile ? "110px" : "140px"}, 1fr))`, gap: 10, marginBottom: "3rem", opacity: vis ? 1 : 0, transition: "all .6s ease" }}>
        {filters[active].map(({ icon, label, color }, i) => (
          <SkillChip key={label} icon={icon} label={label} color={color} delay={i * 40} visible={vis} />
        ))}
      </div>

      {/* Proficiency bars */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: "1.5rem" }}>
        {bars.map(({ label, pct, color }) => <BarItem key={label} label={label} pct={pct} color={color} />)}
      </div>
    </section>
  );
}

function SkillChip({ icon, label, color, delay, visible }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? `${color}12` : T.bg2, border: `1px solid ${hov ? color : T.border}`, borderRadius: 10, padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "default", transition: "all .2s ease", opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.96)", transitionDelay: `${delay}ms` }}>
      <i className={`ti ${icon}`} style={{ fontSize: 24, color: hov ? color : T.textMid, transition: "color .2s" }} aria-hidden="true" />
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: hov ? color : T.textMid, textAlign: "center", transition: "color .2s" }}>{label}</span>
    </div>
  );
}

function BarItem({ label, pct, color }) {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setW(pct); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct]);
  return (
    <div ref={ref}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: T.textMid }}>{label}</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: T.bg3, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${w}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)`, borderRadius: 2, transition: "width 1s cubic-bezier(.4,0,.2,1)", boxShadow: w > 0 ? `0 0 8px ${color}55` : "none" }} />
      </div>
    </div>
  );
}

/* ─── PROJECTS ─── */
const PROJECTS = [
  { name: "Simple Notes App", icon: "ti-notes", badge: "MERN", color: T.accent, desc: "Full-stack MERN app with complete CRUD, auth, and REST API.", stack: ["MongoDB","Express","React","Node.js"], link: "https://github.com/sultanyaso/mern-demo.git" },
  { name: "NodeVault", icon: "ti-database", badge: "DevOps", color: T.green, desc: "Containerized CLI record management system using Docker.", stack: ["Docker","Node.js","CLI","Bash"], link: "https://github.com/sultanyaso/DevOps_Part2.git" },
  { name: "Path Finder PK", icon: "ti-map-route", badge: "Algorithm", color: T.purple, desc: "Pakistan route planning with Dijkstra + OpenStreetMap data.", stack: ["Python","OpenStreetMap","Dijkstra"], link: "https://github.com/sultanyaso/Design-and-Algorithm-Project.git" },
  { name: "GitHub Finder", icon: "ti-brand-github", badge: "React", color: "#79c0ff", desc: "Search and explore GitHub profiles and repo stats in real-time.", stack: ["React","GitHub API","JavaScript"], link: "https://github.com/sultanyaso/github-profile-finder.git" },
  { name: "Weather App", icon: "ti-cloud-storm", badge: "Vanilla JS", color: T.amber, desc: "Clean weather application using a public API with HTML/CSS/JS.", stack: ["HTML","CSS","JavaScript","API"], link: "https://github.com/sultanyaso/Weather_Web_App.git" },
  { name: "Dodge Game", icon: "ti-device-gamepad-2", badge: "Python", color: T.purple, desc: "Pygame arcade game with smooth collision detection.", stack: ["Python","Pygame"], link: "https://github.com/sultanyaso/dodge-the-blocks-game.git" },
];

function Projects() {
  const w = useWidth(); const mobile = w < 768; const tablet = w < 1100;

  return (
    <section id="projects" style={{ padding: mobile ? "4rem 1.25rem" : "6rem 3rem", position: "relative", zIndex: 1 }}>
      <SecLabel num={3} title="Projects" />
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : tablet ? "1fr 1fr" : "1fr 1fr 1fr", gap: "1.25rem" }}>
        {PROJECTS.map((p, i) => <ProjCard key={p.name} {...p} index={i} mobile={mobile} />)}
      </div>
    </section>
  );
}

function ProjCard({ name, icon, badge, color, desc, stack, link, index, mobile }) {
  const [hov, setHov] = useState(false);
  const [ref, vis] = useInView(0.1);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? T.bg2 : T.bg1, border: `1px solid ${hov ? color : T.border}`, borderRadius: 14, padding: "1.6rem", display: "flex", flexDirection: "column", gap: "1rem", transition: "all .25s ease", cursor: "default", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transitionDelay: `${index * 60}ms` }}>

      {/* Top */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <i className={`ti ${icon}`} style={{ fontSize: 22, color }} aria-hidden="true" />
        </div>
        <Tag color={color}>{badge}</Tag>
      </div>

      <div>
        <div style={{ fontSize: mobile ? 16 : 17, fontWeight: 700, color: T.text, marginBottom: 8, fontFamily: "'Inter',sans-serif" }}>{name}</div>
        <p style={{ fontSize: 14, color: T.textMid, lineHeight: 1.65 }}>{desc}</p>
      </div>

      {/* Stack */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
        {stack.map(s => <Tag key={s} color={T.textDim}>{s}</Tag>)}
      </div>

      {/* Link */}
      <a href={link} target="_blank" rel="noopener noreferrer"
        style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: hov ? color : T.textDim, textDecoration: "none", paddingTop: "1rem", borderTop: `1px solid ${T.border}`, transition: "color .2s" }}>
        <i className="ti ti-brand-github" style={{ fontSize: 15 }} aria-hidden="true" />
        View on GitHub
        <i className="ti ti-arrow-right" style={{ fontSize: 13, marginLeft: "auto" }} aria-hidden="true" />
      </a>
    </div>
  );
}

/* ─── CONTACT ─── */
function Contact() {
  const w = useWidth(); const mobile = w < 768;
  const [ref, vis] = useInView();

  const links = [
    { icon: "ti-mail", label: "Email", val: "sultanyasir990@gmail.com", href: "mailto:sultanyasir990@gmail.com", color: T.accent },
    { icon: "ti-brand-github", label: "GitHub", val: "github.com/sultanyaso", href: "https://github.com/sultanyaso", color: T.text },
    { icon: "ti-brand-linkedin", label: "LinkedIn", val: "linkedin.com/in/yasir-sultan", href: "https://www.linkedin.com/in/yasir-sultan-931758254", color: "#0a66c2" },
    { icon: "ti-phone", label: "Phone", val: "+92 348 5185767", href: "tel:+923485185767", color: T.green },
    { icon: "ti-map-pin", label: "Location", val: "Islamabad, Pakistan", color: T.purple },
  ];

  return (
    <section id="contact" style={{ padding: mobile ? "4rem 1.25rem 5rem" : "6rem 3rem 8rem", position: "relative", zIndex: 1 }}>
      <SecLabel num={4} title="Contact" />
      <div ref={ref} style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: "1.5rem", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: "all .7s ease" }}>

        {/* Contact links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {links.map(({ icon, label, val, href, color }) => (
            <a key={label} href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 12, textDecoration: "none", transition: "all .2s", color: "inherit" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}0a`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.bg2; }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={`ti ${icon}`} style={{ fontSize: 18, color }} aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 14, color: T.textMid, wordBreak: "break-all" }}>{val}</div>
              </div>
              <i className="ti ti-arrow-right" style={{ fontSize: 14, color: T.textDim, marginLeft: "auto", flexShrink: 0 }} aria-hidden="true" />
            </a>
          ))}
        </div>

        {/* CTA card */}
        <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 14, padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${T.green}15`, border: `1px solid ${T.green}30`, borderRadius: 20, padding: "6px 14px", marginBottom: "1.75rem" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.green, animation: "pulse 2.5s infinite" }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: T.green }}>open to work</span>
            </div>
            <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: mobile ? 22 : 26, fontWeight: 700, color: T.text, lineHeight: 1.3, marginBottom: "1rem" }}>
              Open to internship opportunities
            </h3>
            <p style={{ fontSize: 15, color: T.textMid, lineHeight: 1.7, marginBottom: "2rem" }}>
              Looking for DevOps and full-stack roles. Let's build something great together.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <GlowBtn primary onClick={() => window.open("mailto:sultanyasir990@gmail.com")}>Send email</GlowBtn>
              <a href="/YASIR SULTAN - Resume.pdf" download style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: T.textMid, border: `1px solid ${T.border2}`, background: "transparent", padding: "11px 22px", borderRadius: 8, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 7, transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.textMid; e.currentTarget.style.color = T.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border2; e.currentTarget.style.color = T.textMid; }}>
                <i className="ti ti-download" style={{ fontSize: 15 }} aria-hidden="true" /> Download CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── ROOT ─── */
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.31.0/dist/tabler-icons.min.css');
        *{box-sizing:border-box;margin:0;padding:0}
        html{font-size:16px;scroll-behavior:smooth}
        body{background:#04070a;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.85)}}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#04070a}
        ::-webkit-scrollbar-thumb{background:#1a2535;border-radius:3px}
        ::selection{background:#00e5ff22;color:#00e5ff}
        a{color:inherit}
      `}</style>
      <div style={{ background: "#04070a", color: T.textMid, fontFamily: "'Inter',sans-serif", minHeight: "100vh", position: "relative" }}>
        <GridBg />
        <Nav />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <footer style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${T.border}`, padding: "2rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: T.textDim }}>
            <span style={{ color: T.accent }}>yasir</span>@portfolio:~$ <span style={{ color: T.green }}>built with passion & caffeine</span>
          </span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: T.textDim }}>© 2026 Yasir Sultan</span>
        </footer>
      </div>
    </>
  );
}
