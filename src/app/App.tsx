import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import profileImg from "../imports/1629203665854-2.jpeg";

// ─── TOKENS ────────────────────────────────────────────────────────────────
const C = {
  bg:         "#080E1A",
  surface:    "#0F1829",
  card:       "#131F33",
  border:     "#1E2D47",
  borderHov:  "rgba(0,196,161,0.4)",
  teal:       "#00C4A1",
  tealDim:    "rgba(0,196,161,0.12)",
  tealGlow:   "rgba(0,196,161,0.3)",
  blue:       "#3B7CF4",
  text:       "#F0F4FF",        // high-contrast white
  body:       "#CBD5E1",        // comfortable reading gray
  muted:      "#8494A8",        // secondary labels
  dim:        "#3A4A60",
};

// ─── DATA ───────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: "📱", title: "iOS & Full-Stack Development", desc: "Complete mobile products — SwiftUI frontend, Node.js backend, Supabase database. From architecture to App Store. Real apps, not prototypes." },
  { icon: "⚙️", title: "Solutions Engineering",        desc: "Take a complex technical product and make it work for a real client with a real business problem. Integrations, workflow design, API connections, deployment." },
  { icon: "🤖", title: "AI & Workflow Automation",     desc: "Deploy Claude API, ChatGPT, and Make.com into real fintech operations — eliminating manual processes and increasing team throughput by 60–70%." },
  { icon: "🏦", title: "Fintech Product & Operations", desc: "9 years in mortgage workflows, lead management, CRM architecture, and underwriting coordination. I understand the business before I write a line of code." },
];

const PROJECTS = [
  {
    num: "01",
    name: "LoanTrack",
    tagline: "Full-Stack Fintech iOS App",
    badge: "Production · Live",
    problem: "Mortgage brokers lose leads because their workflow is broken — no routing logic, no follow-up system, no visibility.",
    desc: "LoanTrack is a complete iOS application that fixes this: lead pipeline management, AI-powered scoring, mortgage calculation, and a four-role permission system. Built end-to-end, solo.",
    features: ["JWT Auth", "4-Role System", "AI Lead Scoring", "Mortgage Calculator", "Analytics Dashboard", "Full Leads CRUD"],
    stack: ["SwiftUI", "Node.js", "Express", "Supabase", "PostgreSQL", "JWT", "Claude API", "MVVM"],
    links: [
      { label: "Live Demo", href: "https://saadvarg.github.io/LoanTrackWeb/" },
      { label: "GitHub", href: "https://github.com/saadvarg/LoanTrack-iOS" },
    ],
    color: "#00C4A1",
  },
  {
    num: "02",
    name: "DealLens",
    tagline: "AI Equipment Finance Screening",
    badge: "Enterprise iOS",
    problem: "Equipment finance underwriters spend hours manually extracting data from PDFs to make risk decisions.",
    desc: "DealLens automates this — AI extracts the key data points and produces a deterministic risk score in seconds. Built for finance teams who need speed without sacrificing accuracy.",
    features: ["PDF AI Extraction", "Risk Scoring Engine", "Underwriting Workflow", "Finance Team UX"],
    stack: ["SwiftUI", "Node.js", "Supabase", "Claude API", "PDF Processing"],
    links: [{ label: "Get DealLens", href: "https://saadventure2608.gumroad.com/l/deallens" }],
    color: "#3B7CF4",
  },
  {
    num: "03",
    name: "BrokerForm Pro",
    tagline: "WordPress Plugin for Mortgage Brokers",
    badge: "Live on Gumroad",
    problem: "Most mortgage brokers collect applications through email and paper forms — losing data and missing follow-ups.",
    desc: "BrokerForm Pro turns any WordPress site into a professional intake and pipeline system. No custom development required.",
    features: ["Intake Forms", "Pipeline Management", "Client Follow-up", "Admin Dashboard"],
    stack: ["WordPress", "PHP", "MySQL", "JavaScript"],
    links: [
      { label: "Get Plugin", href: "https://saadventure2608.gumroad.com/l/qgumhr" },
      { label: "Live Demo", href: "https://safepowerservice.ma/demo/" },
    ],
    color: "#F5A623",
  },
];

const SKILL_GROUPS = [
  { title: "Mobile",              skills: ["Swift", "SwiftUI", "UIKit", "Xcode", "XCTest", "MVVM"] },
  { title: "Backend",             skills: ["Node.js", "Express", "REST APIs", "JWT", "Supabase", "PostgreSQL"] },
  { title: "AI & Automation",     skills: ["Claude API", "ChatGPT API", "Make.com", "n8n", "Prompt Engineering"] },
  { title: "CRM & Systems",       skills: ["Salesforce", "HubSpot", "Zoho", "Lead Routing", "Pipelines"] },
  { title: "Product & Delivery",  skills: ["Technical PM", "Agile / Scrum", "Jira", "Figma", "Git"] },
  { title: "Domain Knowledge",    skills: ["Fintech", "Mortgage", "Lending", "Underwriting", "LOS"] },
];

const EXPERIENCE = [
  {
    company:  "CR Equity AI, Inc.",
    role:     "Technical Product Manager & Solutions Lead",
    period:   "May 2025 – March 2026 · Remote, USA",
    bullets: [
      "Owned sprint planning, backlog management, and cross-team delivery between CEO, engineering, design, and operations.",
      "Led CRM solution design across Salesforce, HubSpot, and Zoho — mapping workflows, designing lead routing logic, advising on integrations.",
      "Deployed AI automation using Claude, ChatGPT, and Make.com — measurably reducing manual processes across the team.",
      "Coordinated end-to-end mortgage workflow: lenders, title, appraisal, underwriting, and LOS.",
    ],
  },
  {
    company:  "Avail by Realtor.com",
    role:     "Growth Systems & Operations Manager",
    period:   "January 2022 – May 2026 · Remote, USA",
    bullets: [
      "Built affiliate program infrastructure from zero — partner recruitment, onboarding, commission models, performance dashboards.",
      "Managed CRM-based lead distribution pipelines — routing logic, reporting, acquisition spend optimisation.",
    ],
  },
  {
    company:  "Axion Credit Repair",
    role:     "Sales Operations & CRM Manager",
    period:   "March 2021 – September 2022 · Remote, USA",
    bullets: [
      "Built affiliate program and owned full CRM pipeline — lead segmentation, follow-up sequences, conversion optimisation.",
    ],
  },
  {
    company:  "Manifesto Agency",
    role:     "Digital Product & Systems Consultant · Top Rated",
    period:   "2016 – 2019 · Remote",
    bullets: [
      "Web development, digital systems, and growth consulting for international clients. Top Rated Seller on Fiverr.",
    ],
  },
];

const CONTACT_LINKS = [
  { icon: "✉️", label: "Email",          value: "elmouataz.saad@gmail.com",       href: "mailto:elmouataz.saad@gmail.com" },
  { icon: "💼", label: "LinkedIn",       value: "saad-elmouataz",                  href: "https://www.linkedin.com/in/saad-el-mouataz-558bb2106/" },
  { icon: "⌨️", label: "GitHub",         value: "github.com/saadvarg",             href: "https://github.com/saadvarg" },
  { icon: "📱", label: "LoanTrack Demo", value: "View Live Project",               href: "https://saadvarg.github.io/LoanTrackWeb/" },
];

const MARQUEE_SKILLS = ["SwiftUI", "Node.js", "Supabase", "Claude API", "Make.com", "Salesforce", "HubSpot", "PostgreSQL", "Figma", "JWT Auth", "Agile", "Fintech", "Mortgage", "LOS", "Underwriting", "n8n", "ChatGPT API", "Prompt Engineering", "MVVM", "Express"];

// ─── PRIMITIVES ─────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function Orb({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none", zIndex: 0, ...style }} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, color: C.teal, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
      <span style={{ display: "inline-block", width: 28, height: 1, background: C.teal, borderRadius: 2 }} />
      {children}
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [navSolid, setNavSolid]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [openExp,  setOpenExp]    = useState<number | null>(0);
  const [form, setForm]           = useState({ name: "", email: "", service: "", desc: "" });
  const [sent, setSent]           = useState(false);

  const { scrollY } = useScroll();
  const heroY       = useTransform(scrollY, [0, 500], [0, -70]);
  const heroOpacity = useTransform(scrollY, [0, 380], [1, 0]);

  useEffect(() => scrollY.on("change", v => setNavSolid(v > 24)), [scrollY]);

  const go = useCallback((id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    const subject = `Portfolio enquiry from ${form.name}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\nService: ${form.service || "Not specified"}\n\n${form.desc}`;
    const mailto = `mailto:elmouataz.saad@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_blank");
    setSent(true);
    setForm({ name: "", email: "", service: "", desc: "" });
  };

  const NAV = ["What I Do", "Projects", "Experience", "Skills", "Contact"];

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", lineHeight: 1.6, overflowX: "hidden" }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 5vw", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: navSolid ? "rgba(8,14,26,0.92)" : "transparent",
        backdropFilter: navSolid ? "blur(16px)" : "none",
        borderBottom: `1px solid ${navSolid ? C.border : "transparent"}`,
        transition: "all 0.3s ease",
      }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: 18, color: C.text, background: "none", border: "none", cursor: "pointer", letterSpacing: "-0.02em" }}>
          saad<span style={{ color: C.teal }}>.</span>
        </button>

        <ul className="hidden md:flex" style={{ display: "flex", gap: 28, listStyle: "none", margin: 0, padding: 0 }}>
          {NAV.map(n => (
            <li key={n}>
              <button onClick={() => go(n.toLowerCase().replace(" ", "-"))}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, color: C.muted, background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>{n}</button>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* availability */}
          <div className="hidden md:flex" style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,196,161,0.08)", border: `1px solid rgba(0,196,161,0.2)`, borderRadius: 100, padding: "5px 12px" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)", display: "inline-block" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4ade80", letterSpacing: "0.05em" }}>Available now</span>
          </div>
          <a href="mailto:elmouataz.saad@gmail.com"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, color: C.bg, background: C.teal, padding: "8px 18px", borderRadius: 6, textDecoration: "none", transition: "all 0.2s", boxShadow: `0 0 20px ${C.tealGlow}` }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
            Hire me
          </a>
          <button className="md:hidden" onClick={() => setMenuOpen(p => !p)}
            style={{ background: "none", border: "none", cursor: "pointer", color: C.text, padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen
                ? <><line x1="3" y1="3" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="19" y1="3" x2="3" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>
                : <><line x1="2" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>}
            </svg>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            style={{ position: "fixed", top: 60, left: 0, right: 0, zIndex: 99, background: "rgba(8,14,26,0.98)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}`, padding: "1rem 5vw", display: "flex", flexDirection: "column" }}>
            {NAV.map(n => (
              <button key={n} onClick={() => go(n.toLowerCase().replace(" ", "-"))}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500, color: C.text, background: "none", border: "none", borderBottom: `1px solid ${C.border}`, cursor: "pointer", textAlign: "left", padding: "14px 0" }}>{n}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "0 5vw", position: "relative", overflow: "hidden" }}>
        <Orb style={{ top: "-15%", right: "-5%", width: 600, height: 600, background: "radial-gradient(circle, rgba(0,196,161,0.09) 0%, transparent 70%)" }} />
        <Orb style={{ bottom: "10%", left: "-10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(59,124,244,0.07) 0%, transparent 70%)" }} />
        {/* subtle grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)", backgroundSize: "64px 64px", zIndex: 0 }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity, width: "100%", paddingTop: 60, position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: "4rem", alignItems: "center" }} className="hero-grid">
            <div>
              {/* eyebrow */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.teal, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 28 }}>
                <span style={{ width: 28, height: 1, background: C.teal, display: "inline-block" }} />
                Available for remote roles · Rabat, Morocco
              </motion.div>

              {/* h1 */}
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2.5rem, 5.5vw, 4.75rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 24, color: C.text }}>
                The bridge between<br />
                <span style={{ background: `linear-gradient(135deg, ${C.teal} 0%, #3B7CF4 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  fintech problems
                </span><br />
                and technical solutions.
              </motion.h1>

              {/* sub */}
              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.32 }}
                style={{ fontSize: 17, color: C.body, lineHeight: 1.75, maxWidth: 560, marginBottom: 36 }}>
                I'm <strong style={{ color: C.text, fontWeight: 700 }}>Saad El Mouataz</strong> — a fintech specialist who builds iOS apps, solves operational problems, and deploys AI automation. I work best where the{" "}
                <strong style={{ color: C.text, fontWeight: 700 }}>business problem and the technical solution</strong> need to be understood by the same person.
              </motion.p>

              {/* CTA */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.46 }}
                style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
                <button onClick={() => go("projects")}
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: C.bg, background: C.teal, padding: "13px 26px", borderRadius: 8, border: "none", cursor: "pointer", boxShadow: `0 0 28px ${C.tealGlow}`, transition: "all 0.22s", letterSpacing: "0.01em" }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 36px ${C.tealGlow}`; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 0 28px ${C.tealGlow}`; }}>
                  See My Work →
                </button>
                <button onClick={() => go("contact")}
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: C.text, background: "transparent", padding: "13px 26px", borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}>
                  Get in Touch
                </button>
              </motion.div>

              {/* bridge visual */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                style={{ display: "flex", alignItems: "center", gap: 0, overflow: "hidden" }}>
                {["Business Strategy", null, "Saad El Mouataz", null, "Technical Execution"].map((item, i) =>
                  item === null ? (
                    <div key={i} style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.border}, ${C.teal}, ${C.border})`, minWidth: 20 }} />
                  ) : (
                    <div key={item} style={{ padding: "9px 16px", background: item === "Saad El Mouataz" ? C.tealDim : C.card, border: `1px solid ${item === "Saad El Mouataz" ? C.teal : C.border}`, borderRadius: 6, fontSize: 13, fontWeight: 600, color: item === "Saad El Mouataz" ? C.teal : C.muted, whiteSpace: "nowrap" }}>{item}</div>
                  )
                )}
              </motion.div>
            </div>

            {/* Photo */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.28 }}
              className="hidden lg:block" style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 300, height: 380, borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: `0 0 60px rgba(0,196,161,0.12)` }}>
                <img src={profileImg} alt="Saad El Mouataz" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, rgba(8,14,26,0.75))" }} />
                <div style={{ position: "absolute", bottom: 18, left: 18, right: 18 }}>
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 15, color: C.text }}>Saad El Mouataz</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.muted, marginTop: 2 }}>Rabat, Morocco · Remote</div>
                </div>
              </div>
              {/* floating badge */}
              <motion.div animate={{ y: [0, -7, 0] }} transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                style={{ position: "absolute", top: -14, right: -14, background: C.teal, borderRadius: 10, padding: "10px 14px", boxShadow: `0 8px 32px ${C.tealGlow}`, color: C.bg, textAlign: "center" }}>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: 22, lineHeight: 1 }}>9+</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, marginTop: 2, letterSpacing: "0.07em", opacity: 0.75 }}>YRS EXP</div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "14px 0", background: C.surface, overflow: "hidden" }}>
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
          style={{ display: "flex", gap: "2.5rem", whiteSpace: "nowrap", width: "max-content" }}>
          {[...MARQUEE_SKILLS, ...MARQUEE_SKILLS].map((s, i) => (
            <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.dim, letterSpacing: "0.08em", display: "inline-flex", alignItems: "center", gap: "2.5rem" }}>
              {s} <span style={{ color: C.teal, fontSize: 8 }}>◆</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── WHAT I DO ────────────────────────────────────────── */}
      <section id="what-i-do" style={{ padding: "96px 5vw", position: "relative", overflow: "hidden" }}>
        <Orb style={{ right: "-5%", top: "0%", width: 480, height: 480, background: "radial-gradient(circle, rgba(0,196,161,0.06) 0%, transparent 70%)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <FadeUp>
            <SectionLabel>What I Do</SectionLabel>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, letterSpacing: "-0.025em", color: C.text, marginBottom: 8 }}>
              Three things. All connected.
            </h2>
            <p style={{ fontSize: 15, color: C.muted, marginBottom: 48, maxWidth: 520 }}>
              Each one makes the others stronger. Together they make me different from a pure developer or a pure consultant.
            </p>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {SERVICES.map((s, i) => (
              <FadeUp key={s.title} delay={i * 0.07}>
                <ServiceCard service={s} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────────────────── */}
      <section id="projects" style={{ padding: "96px 5vw", background: C.surface, position: "relative", overflow: "hidden" }}>
        <Orb style={{ left: "-8%", bottom: "10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(59,124,244,0.07) 0%, transparent 70%)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <FadeUp>
            <SectionLabel>Projects</SectionLabel>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, letterSpacing: "-0.025em", color: C.text, marginBottom: 8 }}>
              Things I actually shipped.
            </h2>
            <p style={{ fontSize: 15, color: C.muted, marginBottom: 48, maxWidth: 500 }}>
              Every project solves a real fintech problem. All built end-to-end as sole developer.
            </p>
          </FadeUp>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {PROJECTS.map((p, i) => (
              <FadeUp key={p.name} delay={i * 0.08}>
                <ProjectCard project={p} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ───────────────────────────────────────── */}
      <section id="experience" style={{ padding: "96px 5vw", position: "relative", overflow: "hidden" }}>
        <Orb style={{ right: "-5%", top: "20%", width: 450, height: 450, background: "radial-gradient(circle, rgba(0,196,161,0.06) 0%, transparent 70%)" }} />
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <FadeUp>
            <SectionLabel>Experience</SectionLabel>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, letterSpacing: "-0.025em", color: C.text, marginBottom: 8 }}>
              9 years at the intersection.
            </h2>
            <p style={{ fontSize: 15, color: C.muted, marginBottom: 48 }}>Finance, operations, and technology — always all three at once.</p>
          </FadeUp>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {EXPERIENCE.map((exp, i) => (
              <FadeUp key={exp.company} delay={i * 0.06}>
                <div style={{
                  background: openExp === i ? C.card : "transparent",
                  border: `1px solid ${openExp === i ? C.teal + "44" : C.border}`,
                  borderRadius: 12, overflow: "hidden",
                  transition: "all 0.28s ease",
                  boxShadow: openExp === i ? `0 0 28px rgba(0,196,161,0.07)` : "none",
                }}>
                  <button onClick={() => setOpenExp(openExp === i ? null : i)}
                    style={{ width: "100%", padding: "20px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.teal, marginBottom: 4, letterSpacing: "0.05em" }}>{exp.company}</div>
                      <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 2 }}>{exp.role}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.muted, letterSpacing: "0.04em" }}>{exp.period}</div>
                    </div>
                    <motion.span animate={{ rotate: openExp === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                      style={{ color: openExp === i ? C.teal : C.dim, fontSize: 22, fontWeight: 300, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>+</motion.span>
                  </button>
                  <AnimatePresence>
                    {openExp === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
                        <div style={{ padding: "0 24px 22px" }}>
                          <div style={{ width: "100%", height: 1, background: C.border, marginBottom: 16 }} />
                          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                            {exp.bullets.map((b, j) => (
                              <li key={j} style={{ fontSize: 14, color: C.body, paddingLeft: 20, position: "relative", lineHeight: 1.65 }}>
                                <span style={{ position: "absolute", left: 0, color: C.teal, fontSize: 13 }}>→</span>{b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────────────────────── */}
      <section id="skills" style={{ padding: "96px 5vw", background: C.surface }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeUp>
            <SectionLabel>Skills</SectionLabel>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, letterSpacing: "-0.025em", color: C.text, marginBottom: 8 }}>
              The full stack — technical and operational.
            </h2>
            <p style={{ fontSize: 15, color: C.muted, marginBottom: 48, maxWidth: 520 }}>
              Every skill here comes from real projects and real companies, not just tutorials.
            </p>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
            {SKILL_GROUPS.map((g, i) => (
              <FadeUp key={g.title} delay={i * 0.05}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "22px 20px", height: "100%", transition: "border-color 0.2s" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = C.teal + "55")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = C.border)}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: C.teal, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>{g.title}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {g.skills.map(s => (
                      <span key={s} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, padding: "4px 10px", background: C.surface, color: C.body, border: `1px solid ${C.border}`, borderRadius: 5, transition: "all 0.18s", cursor: "default" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.teal + "55"; (e.currentTarget as HTMLElement).style.color = C.text; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.body; }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────── */}
      <section style={{ padding: "96px 5vw", position: "relative", overflow: "hidden" }}>
        <Orb style={{ left: "20%", top: "-10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(0,196,161,0.08) 0%, transparent 70%)" }} />
        <FadeUp>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.09)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 100, padding: "6px 14px", marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4ade80", letterSpacing: "0.06em" }}>Available for new projects</span>
            </div>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, marginBottom: 20, lineHeight: 1.08 }}>
              Ready to build something<br />
              <span style={{ background: `linear-gradient(135deg, ${C.teal} 0%, ${C.blue} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                that actually works?
              </span>
            </h2>
            <p style={{ fontSize: 16, color: C.body, marginBottom: 36, lineHeight: 1.75 }}>
              Open to Solutions Engineering, Founding Engineer, and Technical Product roles.<br />Also available for fintech consulting and iOS freelance. Remote globally.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="mailto:elmouataz.saad@gmail.com"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: C.bg, background: C.teal, padding: "14px 28px", borderRadius: 8, textDecoration: "none", boxShadow: `0 0 32px ${C.tealGlow}`, transition: "all 0.22s" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
                Send me a message →
              </a>
              <a href="https://www.linkedin.com/in/saad-el-mouataz-558bb2106/" target="_blank" rel="noreferrer"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15, color: C.text, padding: "14px 28px", borderRadius: 8, border: `1px solid ${C.border}`, textDecoration: "none", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(8px)", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal + "66"; e.currentTarget.style.color = C.teal; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}>
                View LinkedIn ↗
              </a>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <section id="contact" style={{ padding: "96px 5vw", background: C.surface }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeUp>
            <SectionLabel>Contact</SectionLabel>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, letterSpacing: "-0.025em", color: C.text, marginBottom: 8 }}>Let's talk.</h2>
            <p style={{ fontSize: 15, color: C.muted, marginBottom: 48, maxWidth: 520 }}>
              Open to Solutions Engineer, Technical PM, and Founding Engineer roles — remote globally. Also available for fintech consulting and iOS development freelance.
            </p>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48, alignItems: "start" }} className="contact-grid">
            {/* contact cards */}
            <FadeUp>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {CONTACT_LINKS.map(link => (
                  <a key={link.href} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 16px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, textDecoration: "none", color: "inherit", transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.teal + "55"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                    <div style={{ width: 40, height: 40, background: C.tealDim, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{link.icon}</div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>{link.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{link.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </FadeUp>
            {/* form */}
            <FadeUp delay={0.1}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[{ label: "Full name", type: "text", k: "name", ph: "Your name" }, { label: "Email", type: "email", k: "email", ph: "you@company.com" }].map(f => (
                    <div key={f.k}>
                      <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{f.label}</label>
                      <input type={f.type} placeholder={f.ph} value={(form as any)[f.k]}
                        onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                        style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 14px", color: C.text, fontFamily: "'Inter', sans-serif", fontSize: 14, outline: "none", transition: "border 0.2s", boxSizing: "border-box" }}
                        onFocus={e => (e.target.style.borderColor = C.teal + "66")}
                        onBlur={e => (e.target.style.borderColor = C.border)} />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>What are you looking for?</label>
                  <select value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                    style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 14px", color: form.service ? C.text : C.muted, fontFamily: "'Inter', sans-serif", fontSize: 14, outline: "none", appearance: "none", cursor: "pointer", boxSizing: "border-box" }}
                    onFocus={e => (e.target.style.borderColor = C.teal + "66")}
                    onBlur={e => (e.target.style.borderColor = C.border)}>
                    <option value="">Select a service</option>
                    {["Solutions Engineering", "iOS Development", "Full-Stack Development", "AI & Automation", "CRM Architecture", "Technical Product / PM", "Fintech Consulting", "Other"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Message</label>
                  <textarea placeholder="Tell me about your project or what you're working on..." value={form.desc}
                    onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
                    style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 14px", color: C.text, fontFamily: "'Inter', sans-serif", fontSize: 14, outline: "none", resize: "vertical", minHeight: 100, boxSizing: "border-box" }}
                    onFocus={e => (e.target.style.borderColor = C.teal + "66")}
                    onBlur={e => (e.target.style.borderColor = C.border)} />
                </div>
                <button type="submit"
                  style={{ background: C.teal, color: C.bg, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, padding: "13px 24px", borderRadius: 8, border: "none", cursor: "pointer", boxShadow: `0 0 24px ${C.tealGlow}`, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  Send message →
                </button>
                {sent && (
                  <div style={{ textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#4ade80", padding: "12px", background: "rgba(34,197,94,0.08)", borderRadius: 8, border: "1px solid rgba(34,197,94,0.2)" }}>
                    ✓ Sent! I'll get back to you within 24 hours.
                  </div>
                )}
              </form>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ padding: "32px 5vw", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.muted }}>
          Built by <span style={{ color: C.teal }}>Saad El Mouataz</span> · Rabat, Morocco · Open to remote roles globally
        </p>
        <div style={{ display: "flex", gap: 24 }}>
          {[{ l: "GitHub", h: "https://github.com/saadvarg" }, { l: "LinkedIn", h: "https://www.linkedin.com/in/saad-el-mouataz-558bb2106/" }, { l: "Email", h: "mailto:elmouataz.saad@gmail.com" }].map(x => (
            <a key={x.l} href={x.h} target={x.h.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.muted, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.teal)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>{x.l}</a>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes pulse-dot { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.4)} 50%{box-shadow:0 0 0 5px rgba(34,197,94,0)} }
        ::selection { background: rgba(0,196,161,0.25); color: #F0F4FF; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080E1A; }
        ::-webkit-scrollbar-thumb { background: rgba(0,196,161,0.3); border-radius: 2px; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
function ServiceCard({ service }: { service: typeof SERVICES[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: C.card, border: `1px solid ${hov ? C.teal + "55" : C.border}`, borderRadius: 12, padding: "28px 24px", transition: "all 0.22s", transform: hov ? "translateY(-3px)" : "translateY(0)", boxShadow: hov ? `0 8px 28px rgba(0,196,161,0.07)` : "none", height: "100%" }}>
      <div style={{ width: 44, height: 44, background: C.tealDim, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 18 }}>{service.icon}</div>
      <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 15, color: C.text, marginBottom: 10 }}>{service.title}</div>
      <div style={{ fontSize: 14, color: C.body, lineHeight: 1.7 }}>{service.desc}</div>
    </div>
  );
}

function ProjectCard({ project }: { project: typeof PROJECTS[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: C.card, border: `1px solid ${hov ? project.color + "55" : C.border}`, borderRadius: 14, padding: 32, transition: "all 0.25s", position: "relative", overflow: "hidden" }}>
      {/* top accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${project.color}, transparent)`, opacity: hov ? 1 : 0, transition: "opacity 0.25s" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.dim, letterSpacing: "0.1em" }}>// {project.num}</span>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 19, color: C.text }}>{project.name}</div>
          </div>
          <div style={{ fontSize: 13, color: project.color, fontWeight: 600 }}>{project.tagline}</div>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: "5px 11px", background: project.color + "18", color: project.color, border: `1px solid ${project.color}35`, borderRadius: 5, whiteSpace: "nowrap" }}>{project.badge}</div>
      </div>

      {/* problem → solution */}
      <div style={{ background: C.surface, borderRadius: 8, padding: "14px 16px", marginBottom: 18, borderLeft: `3px solid ${project.color}55` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>Problem</div>
        <p style={{ fontSize: 13, color: C.body, lineHeight: 1.65, margin: 0 }}>{project.problem}</p>
      </div>
      <p style={{ fontSize: 14, color: C.body, lineHeight: 1.72, marginBottom: 18 }}>{project.desc}</p>

      {/* feature tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
        {project.features.map(f => (
          <span key={f} style={{ fontSize: 12, fontWeight: 500, padding: "4px 10px", background: C.surface, color: C.body, border: `1px solid ${C.border}`, borderRadius: 5 }}>{f}</span>
        ))}
      </div>

      {/* stack */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
        {project.stack.map(s => (
          <span key={s} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: "3px 8px", background: C.bg, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 4 }}>{s}</span>
        ))}
      </div>

      {/* links */}
      {project.links.length > 0 && (
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          {project.links.map(link => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer"
              style={{ fontSize: 13, fontWeight: 600, color: C.teal, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              → {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
