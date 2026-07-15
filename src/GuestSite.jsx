import { useState, useEffect, useRef } from "react";

// ─── PHOTOS (unchanged) ───────────────────────────────────────────────────────
const PHOTO_HERO   = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3628_7827505_a24xqj";
const PHOTO_FUN    = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3742_8619132_jm4rla";
const PHOTO_FORMAL = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3384_8869296_zgmdw5";
const PHOTO_NEW1   = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3401_6103245_lfst7l";
const PHOTO_NEW2   = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/1000652228_l6op6j";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Palette: raw linen / pressed cotton-rag paper / antique copper / dried sage
const T = {
  // Paper tones — warm, not cream
  paper:     "#F7F2EA",   // base — raw linen, not ivory
  paperDeep: "#EEE7D9",   // section alternate
  paperDark: "#E4D9C8",   // deepest parchment, borders
  canvas:    "#FAF7F2",   // lightest surface

  // Ink
  ink:       "#2A2118",   // very dark warm brown, not black
  inkMid:    "#5C4A36",   // mid warm brown
  inkLight:  "#8C7660",   // light brown — body text
  inkFaint:  "#B5A48C",   // very light — labels, captions

  // Copper — the accent. Not gold, not terracotta. Antique copper.
  copper:    "#9B5E3C",   // main accent
  copperLight:"#C4896A",  // lighter copper
  copperPale: "#E8CAB8",  // very pale copper tint

  // Sage — the breath between copper
  sage:      "#6B7F5E",   // muted botanical green
  sagePale:  "#C8D4C0",   // very pale sage for tints

  // Borders and dividers
  rule:      "#D4C8B4",   // hairline rules
  ruleFaint: "#E8DFCE",   // very faint — between sections
};

const WEDDING_DATE = new Date("2026-09-20T00:00:00");

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useCountdown() {
  const calc = () => {
    const diff = Math.max(0, WEDDING_DATE - new Date());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor(diff % 86400000 / 3600000),
      minutes: Math.floor(diff % 3600000 / 60000),
      seconds: Math.floor(diff % 60000 / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);
  return t;
}

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html { scroll-behavior: smooth; }
body { font-family: 'DM Sans', sans-serif; background: #F7F2EA; color: #2A2118; overflow-x: hidden; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: #EEE7D9; }
::-webkit-scrollbar-thumb { background: #9B5E3C; border-radius: 2px; }

/* Paper grain — the secret ingredient. A CSS noise layer that makes flat colour feel physical. */
.grain::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.028;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
  mix-blend-mode: multiply;
  z-index: 1;
}

/* Typography helpers */
.display { font-family: 'Playfair Display', serif; }
.display-italic { font-family: 'Playfair Display', serif; font-style: italic; }

/* Keyframes */
@keyframes fadeUp   { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
@keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.06); } }
@keyframes floatY   { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes floatY2  { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes scaleIn  { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
@keyframes drawLine { from { stroke-dashoffset: 400; } to { stroke-dashoffset: 0; } }
@keyframes navSlide { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

/* Nav */
.nav-link {
  font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #8C7660;
  text-decoration: none; transition: color 0.25s ease; font-family: 'DM Sans', sans-serif; font-weight: 500;
}
.nav-link:hover { color: #9B5E3C; }

/* Hero photo zoom */
.hero-img { animation: slowZoom 18s ease-in-out infinite alternate; }

/* Ritual cards */
.ritual-card {
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  cursor: default;
}
.ritual-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(42, 33, 24, 0.09) !important;
}

/* Event card */
.event-card { transition: box-shadow 0.3s ease; }
.event-card:hover { box-shadow: 0 12px 32px rgba(42, 33, 24, 0.08) !important; }

/* RSVP inputs */
.rsvp-input {
  background: #FAF7F2 !important; border: 1.5px solid #D4C8B4 !important;
  color: #2A2118 !important; transition: border-color 0.25s, box-shadow 0.25s !important;
  font-family: 'DM Sans', sans-serif !important;
}
.rsvp-input:focus {
  border-color: #9B5E3C !important;
  box-shadow: 0 0 0 3px rgba(155, 94, 60, 0.1) !important;
  outline: none !important;
}
.rsvp-input::placeholder { color: #B5A48C !important; }

/* Check options */
.check-option {
  transition: all 0.22s ease; border: 1.5px solid #D4C8B4; cursor: pointer;
  background: #FAF7F2;
}
.check-option:hover { border-color: #9B5E3C !important; background: #F7F0E8 !important; }
.check-option.selected { border-color: #9B5E3C !important; background: #F7F0E8 !important; }

/* Photo cards */
.photo-card { transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1); }
.photo-card:hover { transform: scale(1.03) rotate(0deg) !important; z-index: 5; position: relative; }

/* RSVP button */
.rsvp-btn { transition: all 0.25s ease !important; }
.rsvp-btn:hover:not(:disabled) {
  background: #7A4428 !important;
  box-shadow: 0 6px 20px rgba(155, 94, 60, 0.28) !important;
  transform: translateY(-1px) !important;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
`;

// ─── SVG ORNAMENTS ────────────────────────────────────────────────────────────

// The signature element: a letterpress-style postmark circle
// Used as section headers — rotated, imperfect, handcrafted feeling
function Postmark({ label = "M & S", sub = "September 2026", size = 90 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" style={{ display: "block" }}>
      <defs>
        <path id="circ-top" d="M 45,45 m -32,0 a 32,32 0 1,1 64,0" />
        <path id="circ-bot" d="M 45,45 m -28,0 a 28,28 0 0,0 56,0" />
      </defs>
      {/* Outer rings — slightly imperfect stroke width mimics letterpress */}
      <circle cx="45" cy="45" r="40" fill="none" stroke={T.copper} strokeWidth="1.2" opacity="0.6" />
      <circle cx="45" cy="45" r="35" fill="none" stroke={T.copper} strokeWidth="0.5" opacity="0.4" />
      {/* Curved top text */}
      <text fontFamily="'DM Sans', sans-serif" fontSize="7.5" fill={T.copper} letterSpacing="3.5" textAnchor="middle" fontWeight="500">
        <textPath href="#circ-top" startOffset="50%">{label.toUpperCase()}</textPath>
      </text>
      {/* Curved bottom text */}
      <text fontFamily="'DM Sans', sans-serif" fontSize="6.5" fill={T.copper} letterSpacing="2.5" textAnchor="middle" fontWeight="400" opacity="0.8">
        <textPath href="#circ-bot" startOffset="50%">{sub.toUpperCase()}</textPath>
      </text>
      {/* Centre cross-hatch */}
      <line x1="36" y1="45" x2="54" y2="45" stroke={T.copper} strokeWidth="0.8" opacity="0.5" />
      <line x1="45" y1="36" x2="45" y2="54" stroke={T.copper} strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

// Thin ruling lines — like the printed lines inside a fine envelope
function RulingLines({ width = 300, count = 6, opacity = 0.3 }) {
  return (
    <svg width={width} height={count * 14} viewBox={`0 0 ${width} ${count * 14}`} style={{ display: "block" }}>
      {Array.from({ length: count }, (_, i) => (
        <line key={i} x1="0" y1={i * 14 + 7} x2={width} y2={i * 14 + 7}
          stroke={T.rule} strokeWidth="0.6" opacity={opacity} />
      ))}
    </svg>
  );
}

// Botanical sprig — just a single stem with 3 leaves. Simple.
function Sprig({ scale = 1, flip = false, opacity = 0.5 }) {
  return (
    <svg
      width={80 * scale} height={40 * scale}
      viewBox="0 0 80 40"
      style={{ opacity, transform: flip ? "scaleX(-1)" : "none", display: "block" }}
    >
      <path d="M10 35 Q40 28 70 30" fill="none" stroke={T.sage} strokeWidth="1" />
      <path d="M22 30 Q18 20 26 18" fill="none" stroke={T.sage} strokeWidth="0.8" />
      <ellipse cx="26" cy="17" rx="5" ry="3.5" transform="rotate(-25 26 17)" fill={T.sage} opacity="0.55" />
      <path d="M38 28 Q36 16 44 15" fill="none" stroke={T.sage} strokeWidth="0.8" />
      <ellipse cx="44" cy="14" rx="5.5" ry="3.5" transform="rotate(-15 44 14)" fill={T.sage} opacity="0.5" />
      <path d="M54 28 Q55 18 62 20" fill="none" stroke={T.sage} strokeWidth="0.8" />
      <ellipse cx="63" cy="20" rx="5" ry="3.2" transform="rotate(20 63 20)" fill={T.sage} opacity="0.45" />
    </svg>
  );
}

// Thin horizontal rule with centre ornament
function Divider({ my = 0, ornament = "✦" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: `${my}px 0` }}>
      <div style={{ flex: 1, height: "0.75px", background: `linear-gradient(to right, transparent, ${T.rule})` }} />
      <span style={{ fontSize: 10, color: T.copperLight, letterSpacing: 2 }}>{ornament}</span>
      <div style={{ flex: 1, height: "0.75px", background: `linear-gradient(to left, transparent, ${T.rule})` }} />
    </div>
  );
}

// Section label — small caps, copper, constrained
function Eyebrow({ children, visible, delay = 0, center = true }) {
  return (
    <div style={{
      fontSize: 9, letterSpacing: 5, textTransform: "uppercase", color: T.copper,
      marginBottom: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
      textAlign: center ? "center" : "left",
      opacity: visible ? 1 : 0,
      animation: visible ? `fadeUp 0.6s ${delay}s ease both` : "none",
    }}>
      {children}
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 72);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 990,
      padding: "18px 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(247, 242, 234, 0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(18px)" : "none",
      borderBottom: scrolled ? `1px solid ${T.ruleFaint}` : "none",
      transition: "all 0.4s ease",
      animation: "navSlide 0.8s 0.4s ease both",
    }}>
      <div className="display-italic" style={{ fontSize: 16, color: T.copper, letterSpacing: 1 }}>
        M &amp; S
      </div>
      <div style={{ display: "flex", gap: 28 }}>
        {[["#events", "Events"], ["#gallery", "Gallery"], ["#rsvp", "RSVP"]].map(([href, label]) => (
          <a key={href} href={href} className="nav-link">{label}</a>
        ))}
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const countdown = useCountdown();

  return (
    <section className="grain" style={{
      position: "relative", height: "100vh", minHeight: 640,
      overflow: "hidden", background: T.paperDeep,
    }}>
      {/* Photo — visible, warm, present */}
      <img
        src={PHOTO_HERO} alt="Manan and Shrishti"
        onLoad={() => setLoaded(true)}
        className="hero-img"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center top",
          opacity: loaded ? 0.72 : 0,
          transition: "opacity 1.6s ease",
        }}
      />

      {/* Single, elegant bottom-fade — no crossing gradients */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(to top, ${T.paperDeep} 0%, rgba(238,231,217,0.5) 45%, transparent 100%)`,
      }} />

      {/* Content — sits in the lower third */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-end",
        padding: "0 24px 60px", textAlign: "center",
      }}>
        {/* Eyebrow */}
        <div style={{
          fontSize: 9, letterSpacing: 6, textTransform: "uppercase", color: T.inkMid,
          marginBottom: 16, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
          opacity: loaded ? 1 : 0, animation: loaded ? "fadeUp 0.7s 0.2s ease both" : "none",
        }}>
          We're getting married
        </div>

        {/* Names — single flowing italic line, the emotional centrepiece */}
        <div className="display-italic" style={{
          fontSize: "clamp(48px, 12vw, 104px)",
          fontWeight: 400, lineHeight: 0.95, color: T.ink,
          letterSpacing: -0.5,
          opacity: loaded ? 1 : 0,
          animation: loaded ? "fadeUp 1s 0.35s ease both" : "none",
        }}>
          Manan &amp; Shrishti
        </div>

        {/* Date line — plain, unhurried */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16, margin: "20px 0 36px",
          opacity: loaded ? 1 : 0, animation: loaded ? "fadeUp 0.7s 0.6s ease both" : "none",
        }}>
          <div style={{ width: 32, height: "0.75px", background: T.rule }} />
          <div style={{
            fontSize: 11, letterSpacing: 4, color: T.inkMid,
            textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
          }}>
            September 20 · 21 · 2026 · Karnal
          </div>
          <div style={{ width: 32, height: "0.75px", background: T.rule }} />
        </div>

        {/* Countdown — no boxes, just numbers and labels */}
        <div style={{
          display: "flex", gap: 32, marginBottom: 44, alignItems: "baseline",
          opacity: loaded ? 1 : 0, animation: loaded ? "fadeUp 0.7s 0.75s ease both" : "none",
        }}>
          {[
            { label: "Days", val: countdown.days },
            { label: "Hours", val: countdown.hours },
            { label: "Mins", val: countdown.minutes },
            { label: "Secs", val: countdown.seconds },
          ].map(({ label, val }, i) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div className="display" style={{
                fontSize: "clamp(28px, 6vw, 48px)", color: T.ink, lineHeight: 1, fontWeight: 500,
              }}>
                {String(val).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 8, letterSpacing: 3, color: T.inkLight, textTransform: "uppercase", marginTop: 5 }}>
                {label}
              </div>
              {i < 3 && (
                <div style={{
                  position: "absolute", fontSize: 18, color: T.rule, lineHeight: 1,
                  marginTop: -28, marginLeft: 68,
                }}>·</div>
              )}
            </div>
          ))}
        </div>

        {/* CTA — bordered, elegant */}
        <a href="#rsvp" style={{
          display: "inline-block", padding: "14px 44px",
          border: `1.5px solid ${T.copper}`, color: T.copper,
          textDecoration: "none", borderRadius: 2,
          fontWeight: 500, fontSize: 10, letterSpacing: 3.5, textTransform: "uppercase",
          fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.3s ease",
          opacity: loaded ? 1 : 0, animation: loaded ? "fadeUp 0.7s 0.95s ease both" : "none",
          background: "transparent",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = T.copper; e.currentTarget.style.color = T.canvas; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.copper; }}
        >
          RSVP
        </a>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        animation: "floatY 3s ease-in-out infinite",
      }}>
        <div style={{ width: "0.75px", height: 30, background: `linear-gradient(to bottom, transparent, ${T.copper}70)` }} />
        <div style={{ fontSize: 7, letterSpacing: 4, color: T.inkFaint, textTransform: "uppercase" }}>scroll</div>
      </div>
    </section>
  );
}

// ─── FAMILIES ─────────────────────────────────────────────────────────────────
function Families() {
  const [ref, visible] = useReveal(0.15);
  return (
    <section ref={ref} className="grain" style={{
      background: T.paper, padding: "88px 24px 80px",
      textAlign: "center", position: "relative",
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <Eyebrow visible={visible}>With joy in our hearts</Eyebrow>

        <h2 className="display-italic" style={{
          fontSize: "clamp(28px, 6vw, 52px)", fontWeight: 400, color: T.ink,
          lineHeight: 1.2, marginBottom: 20,
          opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.1s ease both" : "none",
        }}>
          You're not just invited.<br />You're family.
        </h2>

        <p style={{
          fontSize: 15, color: T.inkLight, lineHeight: 1.95, maxWidth: 480, margin: "0 auto 40px",
          fontWeight: 300,
          opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.2s ease both" : "none",
        }}>
          Every love story is beautiful, but ours is our favourite. As we begin this new
          chapter together, the only thing that would make it complete is having the people
          we love beside us. Come laugh, dance, eat far too much, and celebrate with us.
        </p>

        <Divider my={0} />

        {/* Family names — two columns, a real typographic treatment */}
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: 0, marginTop: 32, flexWrap: "wrap",
          opacity: visible ? 1 : 0, animation: visible ? "scaleIn 0.8s 0.35s ease both" : "none",
        }}>
          <div style={{ padding: "0 40px", textAlign: "center" }}>
            <div style={{ fontSize: 8, letterSpacing: 4, color: T.copper, textTransform: "uppercase", marginBottom: 8 }}>
              Groom's Family
            </div>
            <div className="display-italic" style={{ fontSize: 22, color: T.ink, fontWeight: 400 }}>
              The Khurana Family
            </div>
          </div>
          <div style={{ width: "0.75px", height: 44, background: T.rule }} />
          <div style={{ padding: "0 40px", textAlign: "center" }}>
            <div style={{ fontSize: 8, letterSpacing: 4, color: T.copper, textTransform: "uppercase", marginBottom: 8 }}>
              Bride's Family
            </div>
            <div className="display-italic" style={{ fontSize: 22, color: T.ink, fontWeight: 400 }}>
              The Kaushik Family
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── RITUALS ──────────────────────────────────────────────────────────────────
// Ceremony SVG icons — hand-drawn line art feel, no emoji
function CeremonyIcon({ type }) {
  const s = { fill: "none", stroke: T.copper, strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    mehendi: (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <path d="M18 6 C14 10 10 14 10 20 C10 26 14 30 18 30 C22 30 26 26 26 20 C26 14 22 10 18 6Z" {...s} />
        <path d="M18 12 C16 15 14 18 15 22 C16 25 17 26 18 27" {...s} opacity="0.5" />
        <path d="M8 20 Q5 17 6 13" {...s} />
        <path d="M28 20 Q31 17 30 13" {...s} />
        <circle cx="18" cy="20" r="2.5" {...s} />
      </svg>
    ),
    ring: (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="20" r="9" {...s} />
        <circle cx="18" cy="20" r="5.5" {...s} />
        <path d="M14 11 L18 6 L22 11" {...s} />
        <circle cx="18" cy="7" r="2.5" {...s} />
        <path d="M16 7 Q18 5 20 7" {...s} opacity="0.5" />
      </svg>
    ),
    sangeet: (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <path d="M8 26 Q8 14 16 12 L16 24 Q14 22 12 24 Q10 26 12 28 Q14 30 16 28 L16 12" {...s} />
        <path d="M16 14 L28 10 L28 22 Q26 20 24 22 Q22 24 24 26 Q26 28 28 26 L28 10" {...s} />
      </svg>
    ),
    haldi: (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <path d="M18 10 C13 13 10 17 10 22 C10 26 13 29 18 29 C23 29 26 26 26 22 C26 17 23 13 18 10Z" {...s} />
        <path d="M10 18 Q6 16 7 11" {...s} />
        <path d="M26 18 Q30 16 29 11" {...s} />
        <path d="M15 22 Q18 24 21 22" {...s} opacity="0.5" />
        <path d="M18 10 L18 6" {...s} />
        <path d="M14 8 Q18 4 22 8" {...s} />
      </svg>
    ),
    sehra: (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="12" r="5" {...s} />
        <path d="M10 17 Q18 20 26 17" {...s} />
        <path d="M11 19 L9 30" {...s} strokeDasharray="1.5 2" opacity="0.7" />
        <path d="M14 19 L13 30" {...s} strokeDasharray="1.5 2" opacity="0.7" />
        <path d="M18 20 L18 30" {...s} strokeDasharray="1.5 2" opacity="0.7" />
        <path d="M22 19 L23 30" {...s} strokeDasharray="1.5 2" opacity="0.7" />
        <path d="M25 19 L27 30" {...s} strokeDasharray="1.5 2" opacity="0.7" />
      </svg>
    ),
    baraat: (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <ellipse cx="18" cy="26" rx="10" ry="5" {...s} />
        <path d="M8 26 L8 22 Q8 18 18 18 Q28 18 28 22 L28 26" {...s} />
        <path d="M13 18 Q13 12 18 10 Q23 12 23 18" {...s} />
        <circle cx="18" cy="9" r="3" {...s} />
        <circle cx="10" cy="27" r="2" {...s} />
        <circle cx="26" cy="27" r="2" {...s} />
      </svg>
    ),
    wedding: (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <path d="M8 28 L18 10 L28 28 Z" {...s} />
        <path d="M12 28 Q18 20 24 28" {...s} opacity="0.4" />
        <path d="M18 10 L18 6" {...s} />
        <path d="M14 7 Q18 4 22 7" {...s} />
        <path d="M10 22 L26 22" {...s} opacity="0.5" />
        <circle cx="18" cy="18" r="2" fill={T.copperLight} stroke="none" />
      </svg>
    ),
    sagan: (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <path d="M10 28 C10 20 14 14 18 10 C22 14 26 20 26 28" {...s} />
        <path d="M14 28 C14 23 16 19 18 16 C20 19 22 23 22 28" {...s} opacity="0.5" />
        <path d="M10 28 L26 28" {...s} />
        <path d="M7 28 L29 28" {...s} />
        <circle cx="18" cy="20" r="2" fill={T.copperPale} stroke={T.copper} strokeWidth="0.8" />
      </svg>
    ),
  };
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{icons[type] || icons.wedding}</div>;
}

function RitualCard({ ritual, index, visible }) {
  return (
    <div className="ritual-card" style={{
      background: T.canvas, border: `1px solid ${T.ruleFaint}`,
      borderRadius: 3, padding: "24px 20px",
      opacity: visible ? 1 : 0, animation: visible ? `fadeIn 0.6s ${index * 0.06}s ease both` : "none",
      boxShadow: "0 2px 12px rgba(42, 33, 24, 0.05)",
    }}>
      <div style={{ marginBottom: 14 }}>
        <CeremonyIcon type={ritual.iconType} />
      </div>
      <div style={{ fontSize: 8, letterSpacing: 4, color: T.copper, textTransform: "uppercase", marginBottom: 5 }}>
        {ritual.day}
      </div>
      <div className="display" style={{ fontSize: 17, fontWeight: 500, color: T.ink, marginBottom: 10 }}>
        {ritual.name}
      </div>
      <div style={{ height: "0.75px", background: T.ruleFaint, marginBottom: 12 }} />
      <p style={{ fontSize: 12.5, color: T.inkLight, lineHeight: 1.8, marginBottom: 12, fontWeight: 300 }}>
        {ritual.what}
      </p>
      <div style={{ fontSize: 11, color: T.inkFaint }}>
        <span style={{ color: T.sage, marginRight: 4 }}>↳</span> {ritual.dress}
      </div>
      {ritual.tip && (
        <div style={{ fontSize: 11, color: T.inkFaint, marginTop: 5, fontStyle: "italic" }}>
          {ritual.tip}
        </div>
      )}
    </div>
  );
}

function Rituals() {
  const [ref, visible] = useReveal(0.04);
  const rituals = [
    { iconType: "mehendi", name: "Mehendi", day: "Day 1 · Afternoon", what: "Henna is applied to the bride's hands in beautiful patterns. Music, colour, and laughter — guests can get mehendi too.", dress: "Floral & festive", tip: "Come ready to relax and enjoy" },
    { iconType: "sagan",   name: "Sagan", day: "Day 1 · Evening", what: "A blessing ceremony where both families formally welcome the union with sweets, gifts, and love.", dress: "Festive Indian", tip: "Bring your warmest blessings" },
    { iconType: "ring",    name: "Ring Ceremony", day: "Day 1 · Evening", what: "Manan and Shrishti exchange rings, surrounded by everyone they love. A modern moment woven into the classical evening.", dress: "Festive Indian", tip: "The perfect photo moment" },
    { iconType: "sangeet", name: "Ladies Sangeet", day: "Day 1 · Night", what: "A night of music and dance — the families have been rehearsing! Come cheer, dance, and celebrate.", dress: "Cocktail or lehenga", tip: "Wear your dancing shoes" },
    { iconType: "haldi",   name: "Haldi", day: "Day 2 · Morning", what: "Turmeric paste is playfully applied to the couple for blessings and a radiant glow. Pure joy.", dress: "Yellow or white", tip: "Expect happy turmeric stains" },
    { iconType: "sehra",   name: "Sehra Bandi", day: "Day 2 · Afternoon", what: "The groom's family ties his floral sehra before the baraat — a tender, emotional family moment.", dress: "Sherwani / ethnic", tip: "A heartfelt moment to witness" },
    { iconType: "baraat",  name: "Baraat", day: "Day 2 · Evening", what: "The groom's grand procession — dhol, dancing, and pure celebration all the way in.", dress: "Your ethnic finest", tip: "Save some energy to dance" },
    { iconType: "wedding", name: "Wedding & Pheras", day: "Day 2 · Night", what: "Seven rounds around the holy fire, seven vows, one forever. The most sacred moment of the celebration.", dress: "Your most formal best", tip: "The most moving moment of all" },
  ];

  return (
    <section ref={ref} className="grain" style={{ background: T.paperDeep, padding: "88px 24px 96px", position: "relative" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Eyebrow visible={visible}>Hindu Wedding Traditions</Eyebrow>
          <h2 className="display-italic" style={{
            fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 400, color: T.ink,
            opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.1s ease both" : "none",
          }}>
            What to expect &amp; what to wear
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}>
          {rituals.map((r, i) => <RitualCard key={i} ritual={r} index={i} visible={visible} />)}
        </div>
      </div>
    </section>
  );
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────
function EventCard({ day, di, visible }) {
  return (
    <div className="event-card" style={{
      background: T.canvas, border: `1px solid ${T.ruleFaint}`,
      borderRadius: 3, overflow: "hidden",
      boxShadow: "0 2px 16px rgba(42, 33, 24, 0.05)",
      opacity: visible ? 1 : 0, animation: visible ? `fadeUp 0.7s ${di * 0.12}s ease both` : "none",
    }}>
      {/* Header */}
      <div style={{
        padding: "24px 28px 20px",
        borderBottom: `1px solid ${T.ruleFaint}`,
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <div>
          <div className="display" style={{ fontSize: 22, fontWeight: 500, color: T.ink }}>
            {day.day}
          </div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: T.copper, textTransform: "uppercase", marginTop: 4 }}>
            {day.label} · {day.date}
          </div>
        </div>
        <div style={{ fontSize: 28, opacity: 0.6 }}>{day.icon}</div>
      </div>

      {/* Functions */}
      <div style={{ padding: "4px 0" }}>
        {day.functions.map((fn, fi) => (
          <div key={fi} style={{
            display: "flex", gap: 18, alignItems: "flex-start",
            padding: "18px 28px",
            borderBottom: fi < day.functions.length - 1 ? `1px solid ${T.ruleFaint}` : "none",
          }}>
            <div style={{ fontSize: 20, flexShrink: 0, marginTop: 2, opacity: 0.75 }}>{fn.icon}</div>
            <div style={{ flex: 1 }}>
              <div className="display" style={{ fontSize: 16, fontWeight: 500, color: T.ink, marginBottom: 3 }}>
                {fn.name}
              </div>
              <div style={{ fontSize: 10, color: T.copper, marginBottom: 5, letterSpacing: 1 }}>{fn.time}</div>
              <div style={{ fontSize: 11, color: T.inkLight }}>
                <span style={{ color: T.sage, marginRight: 4 }}>↳</span>{fn.dress}
              </div>
              {fn.note && (
                <div style={{ fontSize: 11, color: T.inkFaint, marginTop: 3, fontStyle: "italic" }}>
                  {fn.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 28px", borderTop: `1px solid ${T.ruleFaint}` }}>
        <div style={{ fontSize: 10, color: T.inkFaint, letterSpacing: 1 }}>
          📍 Vivan Venue, Karnal, Haryana
        </div>
      </div>
    </div>
  );
}

function Events() {
  const [ref, visible] = useReveal(0.05);
  const events = [
    {
      day: "Day One", label: "Saturday", date: "20 September 2026", icon: "🌸",
      functions: [
        { icon: "🌿", name: "Mehendi", time: "1:00 PM – 4:00 PM", dress: "Floral & colourful", note: "" },
        { icon: "💍", name: "Sagan + Ring Ceremony", time: "7:00 PM onwards", dress: "Festive Indian", note: "" },
        { icon: "🎶", name: "Ladies Sangeet", time: "7:00 PM onwards", dress: "Cocktail / lehenga", note: "Come ready to dance!" },
      ],
    },
    {
      day: "Day Two", label: "Sunday", date: "21 September 2026", icon: "✨",
      functions: [
        { icon: "🌼", name: "Haldi", time: "Morning", dress: "Yellow or white — expect turmeric!", note: "" },
        { icon: "👑", name: "Sehra Bandi", time: "Afternoon", dress: "Sherwani / ethnic", note: "" },
        { icon: "🐴", name: "Baraat + Wedding Ceremony", time: "Evening", dress: "Your finest Indian attire", note: "The grand finale" },
      ],
    },
  ];

  return (
    <section id="events" ref={ref} className="grain" style={{
      background: T.paper, padding: "88px 24px 96px", position: "relative",
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Section header — postmark as the signature element */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            opacity: visible ? 1 : 0, animation: visible ? "scaleIn 0.7s ease both" : "none",
          }}>
            <Postmark label="M & S" sub="September 2026" size={100} />
          </div>
          <Eyebrow visible={visible} delay={0.2}>The Celebrations</Eyebrow>
          <h2 className="display-italic" style={{
            fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 400, color: T.ink,
            opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.3s ease both" : "none",
          }}>
            Two days of joy
          </h2>
          <p style={{
            fontSize: 13, color: T.inkLight, marginTop: 10, letterSpacing: 1,
            opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.4s ease both" : "none",
          }}>
            Vivan Venue · Karnal, Haryana
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {events.map((day, di) => <EventCard key={di} day={day} di={di} visible={visible} />)}
        </div>
      </div>
    </section>
  );
}

// ─── PHOTO STRIP ──────────────────────────────────────────────────────────────
// Varied heights, subtle rotations, captions — an editorial gallery, not a component tray
const GALLERY_PHOTOS = [
  { src: PHOTO_NEW1, caption: "Roka, 2026", rotate: -1.8, h: 320 },
  { src: PHOTO_FUN,  caption: "Shrishti",   rotate: 1.4,  h: 380 },
  { src: PHOTO_FORMAL, caption: "Together", rotate: -0.8, h: 290 },
  { src: PHOTO_NEW2, caption: "Manan",      rotate: 2.1,  h: 350 },
];

function PhotoStrip() {
  const [ref, visible] = useReveal(0.08);
  return (
    <section id="gallery" ref={ref} className="grain" style={{
      background: T.paperDeep, padding: "80px 0 72px", overflow: "hidden",
    }}>
      <div style={{ textAlign: "center", marginBottom: 40, padding: "0 24px" }}>
        <Eyebrow visible={visible}>Manan &amp; Shrishti</Eyebrow>
        <h2 className="display-italic" style={{
          fontSize: "clamp(24px, 5vw, 40px)", fontWeight: 400, color: T.ink,
          opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.1s ease both" : "none",
        }}>
          A glimpse of us
        </h2>
      </div>

      {/* Photos: horizontal scroll on mobile, inline-flex on desktop */}
      <div style={{
        display: "flex", gap: 20, padding: "24px 40px 12px",
        overflowX: "auto", alignItems: "flex-end",
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
      }}>
        {GALLERY_PHOTOS.map((p, i) => (
          <div
            key={i}
            className="photo-card"
            style={{
              flex: "0 0 auto",
              width: "clamp(180px, 22vw, 260px)",
              transform: `rotate(${p.rotate}deg)`,
              opacity: visible ? 1 : 0,
              animation: visible ? `scaleIn 0.65s ${i * 0.1}s ease both` : "none",
              scrollSnapAlign: "start",
            }}
          >
            {/* Polaroid-style card */}
            <div style={{
              background: "#fff",
              padding: "8px 8px 36px",
              boxShadow: "0 4px 20px rgba(42, 33, 24, 0.12), 0 1px 4px rgba(42, 33, 24, 0.06)",
            }}>
              <img
                src={p.src} alt={p.caption}
                style={{ width: "100%", height: p.h, objectFit: "cover", objectPosition: "top", display: "block" }}
                loading="lazy"
              />
              <div className="display-italic" style={{
                textAlign: "center", marginTop: 10, fontSize: 13,
                color: T.inkMid, fontWeight: 400,
              }}>
                {p.caption}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────
function RSVP() {
  const [ref, visible] = useReveal(0.05);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", email: "", events: [], guests: "1", message: "" });
  const [status, setStatus] = useState("idle");

  const EVENT_OPTIONS = [
    { label: "Mehendi",              sub: "Day 1 · Afternoon", icon: "🌿" },
    { label: "Sagan + Ring Ceremony",sub: "Day 1 · Evening",   icon: "💍" },
    { label: "Ladies Sangeet",       sub: "Day 1 · Evening",   icon: "🎶" },
    { label: "Haldi",                sub: "Day 2 · Morning",   icon: "🌼" },
    { label: "Wedding Ceremony",     sub: "Day 2 · Evening",   icon: "🔥" },
  ];

  const toggleEvent = (ev) => {
    setForm(f => ({
      ...f,
      events: f.events.includes(ev) ? f.events.filter(e => e !== ev) : [...f.events, ev],
    }));
  };

  const canNext = () => {
    if (step === 0) return form.name.trim().length > 1 && form.phone.trim().length > 6;
    if (step === 1) return form.events.length > 0;
    return true;
  };

  const goNext = () => { if (step < 2) setStep(s => s + 1); else submit(); };
  const goBack = () => { if (step > 0) setStep(s => s - 1); };

  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    setStatus("sending");
    try {
      await fetch("https://hqgrsurxjkpvhsjdnvfz.supabase.co/rest/v1/rsvps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          name: form.name, phone: form.phone, email: form.email,
          events: form.events, guest_count: parseInt(form.guests), message: form.message,
        }),
      });
      setStatus("done");
    } catch (e) { setStatus("done"); }
  };

  const inp = {
    width: "100%", padding: "13px 16px", borderRadius: 2,
    fontSize: 14, fontFamily: "'DM Sans', sans-serif",
  };

  const STEPS = ["You", "Events", "Message"];

  const stepContent = [
    // Step 0: who are you
    <div key={0}>
      <div className="display-italic" style={{ fontSize: 26, color: T.ink, textAlign: "center", marginBottom: 6 }}>
        Let us know who's coming
      </div>
      <p style={{ textAlign: "center", color: T.inkLight, fontSize: 13.5, lineHeight: 1.8, marginBottom: 24 }}>
        We'd love to put your name on our list.
      </p>
      {[
        { label: "Your name *",          field: "name",  type: "text",  ph: "Full name" },
        { label: "Phone *",              field: "phone", type: "tel",   ph: "+91 98765 43210" },
        { label: "Email (optional)",     field: "email", type: "email", ph: "For updates closer to the date" },
      ].map(({ label, field, type, ph }) => (
        <div key={field} style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 9, color: T.inkFaint, display: "block", marginBottom: 5, letterSpacing: 2.5, textTransform: "uppercase" }}>
            {label}
          </label>
          <input
            className="rsvp-input"
            style={inp}
            type={type}
            placeholder={ph}
            value={form[field]}
            onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
          />
        </div>
      ))}
    </div>,

    // Step 1: which events
    <div key={1}>
      <div className="display-italic" style={{ fontSize: 26, color: T.ink, textAlign: "center", marginBottom: 6 }}>
        Which events will you join?
      </div>
      <p style={{ textAlign: "center", color: T.inkLight, fontSize: 13.5, lineHeight: 1.8, marginBottom: 20 }}>
        Select everything you're planning to attend.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {EVENT_OPTIONS.map(ev => {
          const checked = form.events.includes(ev.label);
          return (
            <div
              key={ev.label}
              className={`check-option${checked ? " selected" : ""}`}
              onClick={() => toggleEvent(ev.label)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "13px 15px", borderRadius: 2,
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 2, flexShrink: 0,
                border: `1.5px solid ${checked ? T.copper : T.rule}`,
                background: checked ? T.copper : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}>
                {checked && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: 16, opacity: 0.8 }}>{ev.icon}</span>
              <div>
                <div style={{ fontSize: 13.5, color: checked ? T.ink : T.inkMid, fontWeight: checked ? 500 : 400 }}>
                  {ev.label}
                </div>
                <div style={{ fontSize: 10.5, color: T.inkFaint, marginTop: 1 }}>{ev.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 20, display: "flex", gap: 12, alignItems: "center" }}>
        <label style={{ fontSize: 9, color: T.inkFaint, letterSpacing: 2.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>
          Guests coming
        </label>
        <select
          className="rsvp-input"
          style={{ ...inp, flex: 1, cursor: "pointer" }}
          value={form.guests}
          onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}
        >
          {["1", "2", "3", "4", "5+"].map(n => <option key={n} value={n}>{n} guest{n !== "1" ? "s" : ""}</option>)}
        </select>
      </div>
    </div>,

    // Step 2: message
    <div key={2} style={{ textAlign: "center" }}>
      <div className="display-italic" style={{ fontSize: 26, color: T.ink, marginBottom: 6 }}>
        Anything else?
      </div>
      <p style={{ color: T.inkLight, fontSize: 13.5, lineHeight: 1.8, marginBottom: 20 }}>
        Dietary preferences, a warm message, anything we should know.
      </p>
      <textarea
        className="rsvp-input"
        style={{ ...inp, resize: "none", minHeight: 120, textAlign: "left" }}
        rows={5}
        placeholder="Write something warm…"
        value={form.message}
        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
      />
    </div>,
  ];

  return (
    <section id="rsvp" ref={ref} className="grain" style={{
      background: T.paperDeep, padding: "88px 24px 104px", position: "relative",
    }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Eyebrow visible={visible}>Your place at our table</Eyebrow>
          <h2 className="display-italic" style={{
            fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 400, color: T.ink,
            lineHeight: 1.2, marginBottom: 10,
            opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.1s ease both" : "none",
          }}>
            You're not just invited.
          </h2>
          <p style={{
            fontFamily: "'Playfair Display', serif", fontStyle: "italic",
            fontSize: "clamp(15px, 2.5vw, 19px)", color: T.copper, fontWeight: 400,
            opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.2s ease both" : "none",
          }}>
            You're helping us create the most beautiful celebration of our lives.
          </p>
        </div>

        {status === "done" ? (
          <div style={{
            textAlign: "center", padding: "56px 32px",
            background: T.canvas, border: `1px solid ${T.ruleFaint}`,
            borderRadius: 3, animation: "scaleIn 0.7s ease both",
            boxShadow: "0 4px 24px rgba(42, 33, 24, 0.07)",
          }}>
            <div style={{ fontSize: 44, marginBottom: 20, animation: "floatY2 3s ease-in-out infinite" }}>🌸</div>
            <h3 className="display-italic" style={{ fontSize: 28, fontWeight: 400, color: T.ink, marginBottom: 10 }}>
              We can't wait to see you.
            </h3>
            <p style={{ color: T.inkLight, fontSize: 14, lineHeight: 2 }}>
              Your RSVP is confirmed. We'll be in touch with details closer to the date.<br />
              See you in Karnal. ✦
            </p>
          </div>
        ) : (
          <div style={{
            background: T.canvas, borderRadius: 3, padding: "36px 28px",
            border: `1px solid ${T.ruleFaint}`,
            boxShadow: "0 4px 24px rgba(42, 33, 24, 0.07)",
            opacity: visible ? 1 : 0, animation: visible ? "scaleIn 0.8s 0.3s ease both" : "none",
          }}>
            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 36 }}>
              {STEPS.map((label, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%",
                      border: `1.5px solid ${i <= step ? T.copper : T.rule}`,
                      background: i < step ? T.copper : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 600,
                      color: i < step ? "#fff" : i === step ? T.copper : T.inkFaint,
                      transition: "all 0.3s",
                      margin: "0 auto",
                    }}>
                      {i < step ? "✓" : i + 1}
                    </div>
                    <div style={{
                      fontSize: 8, color: i === step ? T.copper : T.inkFaint,
                      marginTop: 3, letterSpacing: 1.5, textTransform: "uppercase",
                    }}>
                      {label}
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{
                      width: 24, height: "0.75px",
                      background: i < step ? T.copper : T.rule,
                      marginBottom: 16, transition: "background 0.3s",
                    }} />
                  )}
                </div>
              ))}
            </div>

            <div style={{ minHeight: 260 }}>{stepContent[step]}</div>

            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              {step > 0 && (
                <button
                  onClick={goBack}
                  style={{
                    flex: 1, padding: "13px", background: "transparent",
                    color: T.inkLight, border: `1.5px solid ${T.rule}`,
                    borderRadius: 2, fontSize: 12, fontWeight: 500, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", letterSpacing: 1, transition: "all 0.2s",
                  }}
                >
                  ← Back
                </button>
              )}
              <button
                className="rsvp-btn"
                onClick={goNext}
                disabled={!canNext() || status === "sending"}
                style={{
                  flex: 2, padding: "13px",
                  background: canNext() ? T.copper : T.ruleFaint,
                  color: canNext() ? "#fff" : T.inkFaint,
                  border: "none", borderRadius: 2,
                  fontSize: 10, fontWeight: 500, cursor: canNext() ? "pointer" : "not-allowed",
                  fontFamily: "'DM Sans', sans-serif", letterSpacing: 3, textTransform: "uppercase",
                  transition: "all 0.25s",
                }}
              >
                {status === "sending" ? "Sending…" : step === 2 ? "Confirm RSVP" : "Continue →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="grain" style={{
      background: T.paper, padding: "64px 24px 44px",
      textAlign: "center", borderTop: `1px solid ${T.ruleFaint}`,
      position: "relative", overflow: "hidden",
    }}>
      {/* Ruling lines as a decorative background element */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none", opacity: 0.4 }}>
        <RulingLines width="100%" count={8} opacity={0.5} />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 20, alignItems: "center" }}>
          <Sprig opacity={0.45} />
          <Postmark label="M & S" sub="September 2026" size={72} />
          <Sprig flip opacity={0.45} />
        </div>

        <div className="display-italic" style={{ fontSize: 44, fontWeight: 400, color: T.ink, marginBottom: 4, letterSpacing: 0.5 }}>
          Manan &amp; Shrishti
        </div>
        <div style={{ fontSize: 10, color: T.inkMid, marginBottom: 3, letterSpacing: 4, textTransform: "uppercase" }}>
          September 20 – 21, 2026
        </div>
        <div style={{ fontSize: 11, color: T.inkLight, marginBottom: 36 }}>
          Vivan Venue · Karnal, Haryana
        </div>

        <Divider />

        <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
          <div style={{ padding: "0 32px", textAlign: "center" }}>
            <div style={{ fontSize: 8, letterSpacing: 4, color: T.copper, textTransform: "uppercase", marginBottom: 5 }}>Groom's Family</div>
            <div className="display-italic" style={{ fontSize: 16, color: T.ink }}>The Khurana Family</div>
          </div>
          <div style={{ width: "0.75px", background: T.rule, alignSelf: "stretch" }} />
          <div style={{ padding: "0 32px", textAlign: "center" }}>
            <div style={{ fontSize: 8, letterSpacing: 4, color: T.copper, textTransform: "uppercase", marginBottom: 5 }}>Bride's Family</div>
            <div className="display-italic" style={{ fontSize: 16, color: T.ink }}>The Kaushik Family</div>
          </div>
        </div>

        <div style={{ marginTop: 32, fontSize: 10, color: T.inkFaint, letterSpacing: 1 }}>
          Made with love for Manan &amp; Shrishti ✦ 2026
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function GuestSite() {
  return (
    <>
      <style>{CSS}</style>
      <Nav />
      <div style={{ background: T.paper, minHeight: "100vh" }}>
        <Hero />
        <Families />
        <Rituals />
        <Events />
        <PhotoStrip />
        <RSVP />
        <Footer />
      </div>
    </>
  );
}
