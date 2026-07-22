import { useState, useEffect, useRef, useCallback } from "react";

// ─── PHOTOS ───────────────────────────────────────────────────────────────────
const PHOTO_HERO = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3628_7827505_a24xqj";
const PHOTO_FUN = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3742_8619132_jm4rla";
const PHOTO_FORMAL = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3384_8869296_zgmdw5";
const PHOTO_NEW1 = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3401_6103245_lfst7l";
const SCRAP_01 = "https://res.cloudinary.com/dmmstltmq/image/upload/v1784060819/WhatsApp_Image_2026-07-15_at_1.02.02_AM_h2szzl.jpg";
const SCRAP_02 = "https://res.cloudinary.com/dmmstltmq/image/upload/v1784060819/WhatsApp_Image_2026-07-15_at_12.57.15_AM_e0m0cl.jpg";
const SCRAP_03 = "https://res.cloudinary.com/dmmstltmq/image/upload/v1784060820/WhatsApp_Image_2026-07-15_at_12.58.25_AM_obwcik.jpg";
const SCRAP_04 = "https://res.cloudinary.com/dmmstltmq/image/upload/v1784060820/WhatsApp_Image_2026-07-15_at_12.57.14_AM_o08v2l.jpg";
const SCRAP_05 = "https://res.cloudinary.com/dmmstltmq/image/upload/v1784060819/WhatsApp_Image_2026-07-15_at_1.02.03_AM_2_yuvmk5.jpg";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  // Bases
  parchment: "#FAF6EF",
  parchmentDeep: "#F3EDE2",
  ivory: "#FEF9F3",
  blush: "#F5E6E0",
  mist: "#EDF1EC",
  // Accents
  rose: "#B8746A",
  roseDark: "#8B4F47",
  roseLight: "#E8C4BC",
  sage: "#7A9480",
  sageDark: "#4D6B54",
  sageLight: "#C8D9CA",
  gold: "#B8955A",
  goldLight: "#D4B483",
  goldPale: "#EDD9B5",
  // Text
  ink: "#2C2420",
  inkLight: "#5C4A44",
  inkMuted: "#8A7570",
  inkFaint: "#B5A8A4",
  // Borders
  border: "#DDD0C4",
  borderLight: "#EDE4DA",
};

const WEDDING_DATE = new Date("2026-09-20T00:00:00");

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useCountdown() {
  const calc = () => {
    const d = Math.max(0, WEDDING_DATE - new Date());
    return { days: Math.floor(d / 86400000), hours: Math.floor(d % 86400000 / 3600000), minutes: Math.floor(d % 3600000 / 60000), seconds: Math.floor(d % 60000 / 1000) };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);
  return t;
}

function useReveal(threshold = 0.08) {
  const ref = useRef(null); const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, v];
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
html{scroll-behavior:smooth;}
body{font-family:'Inter',sans-serif;background:#FAF6EF;color:#2C2420;overflow-x:hidden;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:#F3EDE2;}
::-webkit-scrollbar-thumb{background:#B8955A;border-radius:2px;}

@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes floatY2{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes slowZoom{from{transform:scale(1)}to{transform:scale(1.06)}}
@keyframes petalDrift{0%{transform:translateY(0) translateX(0) rotate(0deg);opacity:0}15%{opacity:0.8}85%{opacity:0.3}100%{transform:translateY(-180px) translateX(30px) rotate(220deg);opacity:0}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes flapOpen{0%{transform:rotateX(0deg)}100%{transform:rotateX(-172deg)}}
@keyframes cardRiseUp{0%{opacity:0;transform:translateY(56px) scale(0.97)}100%{opacity:1;transform:translateY(-70px) scale(1)}}
@keyframes petalPop{0%{opacity:0;transform:translate(-50%,-50%) scale(0)}50%{opacity:1}100%{opacity:0;transform:translate(var(--px),var(--py)) scale(0.5) rotate(var(--pr))}}
@keyframes waxFloat{0%,100%{transform:rotate(-1deg) scale(1)}50%{transform:rotate(1deg) scale(1.02)}}
@keyframes navIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes cursorFade{0%{opacity:0.6;transform:scale(1)}100%{opacity:0;transform:scale(0)}}
@keyframes sheenSlide{0%{transform:translateX(-120%) skewX(-12deg)}100%{transform:translateX(320%) skewX(-12deg)}}
@keyframes borderDraw{from{stroke-dashoffset:800}to{stroke-dashoffset:0}}
@keyframes rotateSlow{to{transform:rotate(360deg)}}
@keyframes sway{0%,100%{transform:rotate(-1.5deg) translateX(0)}50%{transform:rotate(1.5deg) translateX(4px)}}
@keyframes twinkle{0%,100%{opacity:0.7;transform:scale(1)}40%{opacity:1;transform:scale(1.08)}70%{opacity:0.5;transform:scale(0.95)}}
@keyframes garlandSway{0%,100%{transform:skewX(-1deg) translateY(0)}50%{transform:skewX(1deg) translateY(2px)}}

/* Petal particles */
.petal{position:absolute;pointer-events:none;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;}

/* Polaroid cards */
.polaroid{background:#fff;padding:10px 10px 38px;box-shadow:0 4px 20px rgba(44,36,32,0.12),0 1px 4px rgba(44,36,32,0.08);transition:transform 0.4s cubic-bezier(0.23,1,0.32,1),box-shadow 0.4s ease;cursor:pointer;}
.polaroid:hover{transform:rotate(0deg) scale(1.06)!important;box-shadow:0 16px 48px rgba(44,36,32,0.2)!important;z-index:10;position:relative;}
.polaroid-caption{font-family:'Cormorant Garamond',serif;font-style:italic;color:#5C4A44;font-size:14px;text-align:center;margin-top:8px;line-height:1.4;font-weight:400;}

/* Nav */
.nav-link{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#8A7570;text-decoration:none;transition:color 0.3s ease;position:relative;}
.nav-link::after{content:'';position:absolute;bottom:-3px;left:0;width:0;height:1px;background:#B8746A;transition:width 0.3s ease;}
.nav-link:hover,.nav-link.active{color:#B8746A;}
.nav-link:hover::after,.nav-link.active::after{width:100%;}

/* Event cards */
.ev-card{transition:transform 0.28s ease,box-shadow 0.28s ease;}
.ev-card:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(44,36,32,0.1)!important;}

/* RSVP inputs */
.rsvp-input{background:#fff!important;border:1.5px solid #DDD0C4!important;color:#2C2420!important;transition:border-color 0.25s,box-shadow 0.25s!important;font-family:'Inter',sans-serif!important;}
.rsvp-input:focus{border-color:#B8746A!important;box-shadow:0 0 0 3px rgba(184,116,106,0.12)!important;outline:none!important;}
.rsvp-input::placeholder{color:#B5A8A4!important;}
.rsvp-option{transition:all 0.22s ease;border:1.5px solid #DDD0C4;cursor:pointer;background:#fff;}
.rsvp-option:hover{border-color:#B8746A!important;background:#FDF5F3!important;}
.rsvp-option.selected{border-color:#B8746A!important;background:#FDF5F3!important;}

/* Music */
.music-btn{position:fixed;bottom:28px;right:24px;z-index:998;width:44px;height:44px;border-radius:50%;background:rgba(184,116,106,0.12);border:1px solid rgba(184,116,106,0.35);backdrop-filter:blur(12px);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s ease;}
.music-btn:hover{background:rgba(184,116,106,0.22);}

/* Map */
.map-frame{border:1px solid #DDD0C4;border-radius:16px;overflow:hidden;filter:sepia(0.15) saturate(0.9);}

/* Shimmer text */
.gold-shimmer{background:linear-gradient(90deg,#8B6914 0%,#B8955A 30%,#D4B483 50%,#B8955A 70%,#8B6914 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 6s linear infinite;}

@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;}}
`;

// ─── BOTANICAL SVG FRAME ──────────────────────────────────────────────────────
// A delicate botanical illustration frame — the signature element
function BotanicalFrame({ width = 320, height = 420, opacity = 1 }) {
  const c = "#7A9480";
  const r = "#B8746A";
  return (
    <svg width={width} height={height} viewBox="0 0 320 420" style={{ opacity, pointerEvents: "none", flexShrink: 0 }}>
      {/* Top left corner sprigs */}
      <g opacity="0.85">
        <path d="M20 20 Q40 60 30 100" fill="none" stroke={c} strokeWidth="1.2" />
        <path d="M30 100 Q50 80 60 50" fill="none" stroke={c} strokeWidth="0.8" />
        <ellipse cx="62" cy="44" rx="10" ry="6" transform="rotate(-30 62 44)" fill={c} opacity="0.5" />
        <path d="M30 70 Q10 65 8 45" fill="none" stroke={c} strokeWidth="0.8" />
        <ellipse cx="6" cy="40" rx="9" ry="5" transform="rotate(20 6 40)" fill={c} opacity="0.45" />
        <path d="M22 55 Q5 70 10 90" fill="none" stroke={c} strokeWidth="0.7" />
        <ellipse cx="10" cy="94" rx="7" ry="4" transform="rotate(40 10 94)" fill={c} opacity="0.4" />
        {/* Rose bud top-left */}
        <circle cx="20" cy="18" r="6" fill={r} opacity="0.7" />
        <path d="M14 18 Q20 10 26 18" fill={r} opacity="0.5" />
        <path d="M16 20 Q20 14 24 20" fill="#EDD9B5" opacity="0.6" />
      </g>

      {/* Top right corner */}
      <g opacity="0.85" transform="scale(-1,1) translate(-320,0)">
        <path d="M20 20 Q40 60 30 100" fill="none" stroke={c} strokeWidth="1.2" />
        <path d="M30 100 Q50 80 60 50" fill="none" stroke={c} strokeWidth="0.8" />
        <ellipse cx="62" cy="44" rx="10" ry="6" transform="rotate(-30 62 44)" fill={c} opacity="0.5" />
        <path d="M30 70 Q10 65 8 45" fill="none" stroke={c} strokeWidth="0.8" />
        <ellipse cx="6" cy="40" rx="9" ry="5" transform="rotate(20 6 40)" fill={c} opacity="0.45" />
        <path d="M22 55 Q5 70 10 90" fill="none" stroke={c} strokeWidth="0.7" />
        <ellipse cx="10" cy="94" rx="7" ry="4" transform="rotate(40 10 94)" fill={c} opacity="0.4" />
        <circle cx="20" cy="18" r="6" fill={r} opacity="0.7" />
        <path d="M14 18 Q20 10 26 18" fill={r} opacity="0.5" />
        <path d="M16 20 Q20 14 24 20" fill="#EDD9B5" opacity="0.6" />
      </g>

      {/* Bottom left */}
      <g opacity="0.85" transform="scale(1,-1) translate(0,-420)">
        <path d="M20 20 Q40 60 30 100" fill="none" stroke={c} strokeWidth="1.2" />
        <path d="M30 100 Q50 80 60 50" fill="none" stroke={c} strokeWidth="0.8" />
        <ellipse cx="62" cy="44" rx="10" ry="6" transform="rotate(-30 62 44)" fill={c} opacity="0.5" />
        <path d="M30 70 Q10 65 8 45" fill="none" stroke={c} strokeWidth="0.8" />
        <ellipse cx="6" cy="40" rx="9" ry="5" transform="rotate(20 6 40)" fill={c} opacity="0.45" />
        <circle cx="20" cy="18" r="5" fill={r} opacity="0.6" />
      </g>

      {/* Bottom right */}
      <g opacity="0.85" transform="scale(-1,-1) translate(-320,-420)">
        <path d="M20 20 Q40 60 30 100" fill="none" stroke={c} strokeWidth="1.2" />
        <path d="M30 100 Q50 80 60 50" fill="none" stroke={c} strokeWidth="0.8" />
        <ellipse cx="62" cy="44" rx="10" ry="6" transform="rotate(-30 62 44)" fill={c} opacity="0.5" />
        <path d="M30 70 Q10 65 8 45" fill="none" stroke={c} strokeWidth="0.8" />
        <ellipse cx="6" cy="40" rx="9" ry="5" transform="rotate(20 6 40)" fill={c} opacity="0.45" />
        <circle cx="20" cy="18" r="5" fill={r} opacity="0.6" />
      </g>

      {/* Delicate border lines */}
      <rect x="32" y="32" width="256" height="356" rx="2" fill="none" stroke={c} strokeWidth="0.6" opacity="0.4"
        strokeDasharray="6 4" />
      <rect x="26" y="26" width="268" height="368" rx="3" fill="none" stroke={c} strokeWidth="0.4" opacity="0.25" />
    </svg>
  );
}

// Small botanical sprig for section dividers
function Sprig({ flip = false, opacity = 0.6 }) {
  return (
    <svg width="120" height="32" viewBox="0 0 120 32" style={{ opacity, transform: flip ? "scaleX(-1)" : "none" }}>
      <path d="M10 16 Q40 10 70 16 Q90 20 110 14" fill="none" stroke="#7A9480" strokeWidth="1" />
      {[20, 35, 50, 65, 80].map((x, i) => (
        <ellipse key={i} cx={x} cy={16 - (i % 2 === 0 ? 4 : 3)} rx="6" ry="3.5"
          transform={`rotate(${i % 2 === 0 ? -20 : 20} ${x} ${16 - (i % 2 === 0 ? 4 : 3)})`}
          fill="#7A9480" opacity={0.5 + i * 0.06} />
      ))}
    </svg>
  );
}

// Rose bloom for section headers
function RoseBloom({ size = 28, opacity = 0.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" style={{ opacity }}>
      <circle cx="14" cy="14" r="4" fill="#B8746A" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
        const r = a * Math.PI / 180;
        return <ellipse key={a} cx={14 + 8 * Math.cos(r)} cy={14 + 8 * Math.sin(r)}
          rx="5" ry="3.5" transform={`rotate(${a} ${14 + 8 * Math.cos(r)} ${14 + 8 * Math.sin(r)})`}
          fill="#C9897A" opacity="0.75" />;
      })}
      <circle cx="14" cy="14" r="3" fill="#D4B483" opacity="0.8" />
    </svg>
  );
}

// ─── FLOATING PETALS ──────────────────────────────────────────────────────────
function Petals({ count = 12 }) {
  const ps = useRef(Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 5 + Math.random() * 90,
    delay: Math.random() * 12,
    duration: 8 + Math.random() * 10,
    size: 4 + Math.random() * 6,
    hue: Math.random() > 0.5 ? "#E8C4BC" : "#C8D9CA",
  }))).current;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {ps.map(p => (
        <div key={p.id} className="petal" style={{
          position: "absolute",
          left: `${p.left}%`, bottom: "-5%",
          width: p.size, height: p.size * 1.5,
          background: p.hue,
          animation: `petalDrift ${p.duration}s ${p.delay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── CURSOR TRAIL ─────────────────────────────────────────────────────────────
function CursorTrail() {
  useEffect(() => {
    const onMove = (e) => {
      if (Math.random() > 0.35) return; // sparse
      const p = document.createElement("div");
      const size = 3 + Math.random() * 4;
      const hue = Math.random() > 0.5 ? "#E8C4BC" : "#C8D9CA";
      Object.assign(p.style, {
        position: "fixed", left: e.clientX + "px", top: e.clientY + "px",
        width: size + "px", height: size * 1.4 + "px", borderRadius: "50% 50% 50% 50%/60% 60% 40% 40%",
        background: hue, pointerEvents: "none", zIndex: 9998,
        transform: "translate(-50%,-50%)",
        animation: "cursorFade 1s ease forwards",
      });
      document.body.appendChild(p);
      setTimeout(() => { p.remove(); }, 1000);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return null;
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 997,
      padding: "16px 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(250,246,239,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${T.border}` : "none",
      transition: "all 0.4s ease",
      animation: "navIn 1s 0.5s ease both",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <RoseBloom size={20} opacity={0.8} />
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 500, color: T.rose, fontStyle: "italic", letterSpacing: 1 }}>M & S</span>
      </div>
      <div style={{ display: "flex", gap: 28 }}>
        {[["events", "Events"], ["rsvp", "RSVP"], ["gallery", "Gallery"]].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="nav-link">{label}</a>
        ))}
      </div>
    </nav>
  );
}

// ─── MUSIC ────────────────────────────────────────────────────────────────────
function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const ref = useRef(null);
  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.volume = 0.14; ref.current.play().then(() => setPlaying(true)).catch(() => { }); }
  };
  return (
    <>
      <audio ref={ref} src="https://cdn.pixabay.com/audio/2022/03/15/audio_4a16f3cb6e.mp3" loop preload="none" />
      <button className="music-btn" onClick={toggle} title={playing ? "Pause" : "Play music"}>
        {playing
          ? <svg width="12" height="12" viewBox="0 0 12 12" fill="#B8746A"><rect x="1" y="1" width="3" height="10" rx="1" /><rect x="7" y="1" width="3" height="10" rx="1" /></svg>
          : <svg width="12" height="12" viewBox="0 0 12 12" fill="#B8746A"><path d="M2 1.5l9 4.5-9 4.5V1.5z" /></svg>
        }
      </button>
    </>
  );
}

// ─── WAX SEAL (ivory theme) ───────────────────────────────────────────────────
function WaxSeal({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id="wsMain" cx="35%" cy="28%">
          <stop offset="0%" stopColor="#E8C4BC" />
          <stop offset="40%" stopColor="#C9897A" />
          <stop offset="80%" stopColor="#8B4F47" />
          <stop offset="100%" stopColor="#5C2E2A" />
        </radialGradient>
        <radialGradient id="wsSheen" cx="30%" cy="25%">
          <stop offset="0%" stopColor="#FFF0EE" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#C9897A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="52" r="42" fill="rgba(44,36,32,0.12)" />
      <circle cx="50" cy="50" r="42" fill="url(#wsMain)" />
      <circle cx="50" cy="50" r="42" fill="url(#wsSheen)" />
      {Array.from({ length: 20 }, (_, i) => {
        const a1 = (i / 20) * Math.PI * 2; const a2 = ((i + 0.5) / 20) * Math.PI * 2;
        return <polygon key={i} points={`
          ${50 + 42 * Math.cos(a1)},${50 + 42 * Math.sin(a1)}
          ${50 + 38 * Math.cos(a2)},${50 + 38 * Math.sin(a2)}
          ${50 + 42 * Math.cos(a1 + Math.PI / 20)},${50 + 42 * Math.sin(a1 + Math.PI / 20)}
        `} fill="#7A3530" opacity="0.4" />;
      })}
      <circle cx="50" cy="50" r="36" fill="none" stroke="#FFF0EE" strokeWidth="0.6" opacity="0.5" />
      <circle cx="50" cy="50" r="28" fill="none" stroke="#FFF0EE" strokeWidth="0.4" opacity="0.35" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
        const rad = a * Math.PI / 180;
        return <ellipse key={a} cx={50 + 26 * Math.cos(rad)} cy={50 + 26 * Math.sin(rad)}
          rx="3" ry="5" transform={`rotate(${a},${50 + 26 * Math.cos(rad)},${50 + 26 * Math.sin(rad)})`}
          fill="#FFF0EE" opacity="0.3" />;
      })}
      <text x="50" y="54" textAnchor="middle" fontSize="16"
        fill="#FAF0EE" fontFamily="'Cormorant Garamond',serif"
        fontStyle="italic" fontWeight="600" letterSpacing="2">M &amp; S</text>
    </svg>
  );
}

// Petal burst on seal open
function PetalBurst({ active }) {
  const petals = useRef(Array.from({ length: 18 }, (_, i) => ({
    id: i, angle: (i / 18) * 360,
    dist: 55 + Math.random() * 70,
    rotate: Math.random() * 360,
    size: 4 + Math.random() * 5,
    delay: Math.random() * 0.25,
    hue: Math.random() > 0.5 ? "#E8C4BC" : "#C8D9CA",
  }))).current;
  if (!active) return null;
  return (
    <div style={{ position: "absolute", top: "45%", left: "50%", width: 0, height: 0, pointerEvents: "none", zIndex: 10 }}>
      {petals.map(p => {
        const rad = p.angle * Math.PI / 180;
        return (
          <div key={p.id} style={{
            position: "absolute", width: p.size, height: p.size * 1.5,
            borderRadius: "50% 50% 50% 50%/60% 60% 40% 40%",
            background: p.hue, transform: "translate(-50%,-50%)",
            "--px": `${Math.cos(rad) * p.dist}px`, "--py": `${Math.sin(rad) * p.dist}px`,
            "--pr": `${p.rotate}deg`,
            animation: `petalPop 1.1s ${p.delay}s ease-out forwards`,
          }} />
        );
      })}
    </div>
  );
}

// ─── ENVELOPE (ivory / rose theme) ────────────────────────────────────────────
function EnvelopeIdle({ envRef, tilt }) {
  return (
    <div ref={envRef} style={{
      width: 300, height: 210, position: "relative",
      transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      transition: "transform 0.12s ease-out",
      filter: "drop-shadow(0 16px 48px rgba(44,36,32,0.18)) drop-shadow(0 4px 12px rgba(44,36,32,0.1))",
      animation: "waxFloat 7s ease-in-out infinite",
    }}>
      <svg width="300" height="210" viewBox="0 0 300 210">
        <defs>
          <linearGradient id="eBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF9F3" />
            <stop offset="100%" stopColor="#F3EDE2" />
          </linearGradient>
          <linearGradient id="eFlap" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FAF0E8" />
            <stop offset="100%" stopColor="#EDE0D0" />
          </linearGradient>
        </defs>
        {/* Body */}
        <rect x="4" y="60" width="292" height="146" rx="10" fill="url(#eBody)" stroke="#DDD0C4" strokeWidth="1" />
        {/* Bottom V fold */}
        <path d="M4 206 L150 132 L296 206" fill="none" stroke="#C9B8A8" strokeWidth="0.7" opacity="0.6" />
        {/* Side shadows */}
        <path d="M4 60 L4 206 L150 132 Z" fill="#DDD0C4" opacity="0.2" />
        <path d="M296 60 L296 206 L150 132 Z" fill="#DDD0C4" opacity="0.2" />
        {/* Flap */}
        <path d="M4 60 L150 148 L296 60 Z" fill="url(#eFlap)" stroke="#DDD0C4" strokeWidth="1" />
        {/* Inner dashed border */}
        <rect x="12" y="68" width="276" height="126" rx="5" fill="none" stroke="#B8955A" strokeWidth="0.5" strokeDasharray="5 4" opacity="0.4" />
        {/* Wax seal */}
        <g transform="translate(110,80)"><WaxSeal size={80} /></g>
        {/* Bottom text */}
        {/*<text x="150" y="197" textAnchor="middle" fontSize="7.5" fill="#8A7570"
          fontFamily="'Cormorant Garamond',serif" fontStyle="italic" letterSpacing="3" opacity="0.7">
          Manan &amp; Shrishti · 2026
        </text>*/}
        {/* Botanical corner sprigs (tiny) */}
        <g opacity="0.5">
          <path d="M15 68 Q22 80 18 92" fill="none" stroke="#7A9480" strokeWidth="0.8" />
          <ellipse cx="14" cy="95" rx="5" ry="3" transform="rotate(30 14 95)" fill="#7A9480" opacity="0.6" />
          <ellipse cx="22" cy="76" rx="5" ry="3" transform="rotate(-20 22 76)" fill="#7A9480" opacity="0.5" />
        </g>
        <g opacity="0.5" transform="scale(-1,1) translate(-300,0)">
          <path d="M15 68 Q22 80 18 92" fill="none" stroke="#7A9480" strokeWidth="0.8" />
          <ellipse cx="14" cy="95" rx="5" ry="3" transform="rotate(30 14 95)" fill="#7A9480" opacity="0.6" />
          <ellipse cx="22" cy="76" rx="5" ry="3" transform="rotate(-20 22 76)" fill="#7A9480" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

function EnvelopeOpening() {
  return (
    <svg width="300" height="210" viewBox="0 0 300 210" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="eBody2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF9F3" /><stop offset="100%" stopColor="#F3EDE2" />
        </linearGradient>
        <linearGradient id="eFlap2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAF0E8" /><stop offset="100%" stopColor="#EDE0D0" />
        </linearGradient>
      </defs>
      <rect x="4" y="60" width="292" height="146" rx="10" fill="url(#eBody2)" stroke="#DDD0C4" strokeWidth="1" />
      <path d="M4 60 L4 206 L150 132 Z" fill="#DDD0C4" opacity="0.2" />
      <path d="M296 60 L296 206 L150 132 Z" fill="#DDD0C4" opacity="0.2" />
      <path d="M4 206 L150 132 L296 206" fill="none" stroke="#C9B8A8" strokeWidth="0.7" opacity="0.5" />
      <g style={{ transformOrigin: "150px 60px", animation: "flapOpen 0.85s 0.05s cubic-bezier(0.4,0,0.2,1) forwards" }}>
        <path d="M4 60 L150 148 L296 60 Z" fill="url(#eFlap2)" stroke="#DDD0C4" strokeWidth="1" />
        <circle cx="150" cy="104" r="10" fill="#C9897A" opacity="0.7" />
        <circle cx="150" cy="104" r="6" fill="#E8C4BC" opacity="0.6" />
        <text x="150" y="108" textAnchor="middle" fontSize="7" fill="#5C2E2A" fontFamily="serif" fontStyle="italic" fontWeight="600">M&S</text>
      </g>
      <ellipse cx="150" cy="80" rx="50" ry="7" fill="#B8746A" opacity="0.05" />
    </svg>
  );
}

function EnvelopeOpen() {
  return (
    <svg width="300" height="210" viewBox="0 0 300 210" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="eBody3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF9F3" /><stop offset="100%" stopColor="#F3EDE2" />
        </linearGradient>
      </defs>
      <path d="M4 60 L150 -28 L296 60" fill="#FAF0E8" stroke="#DDD0C4" strokeWidth="0.8" opacity="0.7" />
      <rect x="4" y="60" width="292" height="146" rx="10" fill="url(#eBody3)" stroke="#DDD0C4" strokeWidth="1" />
      <path d="M4 60 L4 206 L150 132 Z" fill="#DDD0C4" opacity="0.18" />
      <path d="M296 60 L296 206 L150 132 Z" fill="#DDD0C4" opacity="0.18" />
      <path d="M4 206 L150 132 L296 206" fill="none" stroke="#C9B8A8" strokeWidth="0.6" opacity="0.4" />
      <rect x="18" y="68" width="264" height="118" rx="3" fill="none" stroke="#B8955A" strokeWidth="0.4" opacity="0.3" />
    </svg>
  );
}

// ─── OPENING SEQUENCE ─────────────────────────────────────────────────────────
function OpeningSequence({ onComplete }) {
  const [phase, setPhase] = useState("idle");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const envRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (phase !== "idle") return;
    const rect = envRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
    setTilt({ x: dy * 5, y: -dx * 5 });
  }, [phase]);

  const handleTap = useCallback(() => {
    if (phase === "idle") {
      setPhase("opening");
      setTimeout(() => setPhase("card"), 1000);
    } else if (phase === "card") {
      setPhase("done");
      setTimeout(() => {
        window.scrollTo(0, 0);
        onComplete();
      }, 1000);
    }
  }, [phase, onComplete]);

  return (
    <div onClick={handleTap} onMouseMove={handleMouseMove} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      cursor: phase === "idle" ? "pointer" : "default",
      opacity: phase === "done" ? 0 : 1,
      transition: phase === "done" ? "opacity 0.75s ease" : "none",
      overflow: "hidden",
      background: T.parchment,
    }}>
      {/* Soft textured background */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 70% at 50% 45%, #FEF9F3 0%, #F3EDE2 60%, #EDE0D4 100%)",
      }} />

      <Petals count={18} />

      {/* Large botanical frame behind everything */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none", opacity: 0.25 }}>
        <BotanicalFrame width={600} height={700} />
      </div>

      {/* IDLE */}
      {phase === "idle" && (
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", animation: "fadeIn 1.4s ease both" }}>
          <EnvelopeIdle envRef={envRef} tilt={tilt} />
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 16, color: T.inkMuted, letterSpacing: 2 }}>
              A letter, sealed with love
            </div>
            <div style={{ width: 1, height: 28, background: `linear-gradient(to bottom,transparent,${T.rose}60)`, marginTop: 6, animation: "floatY 2.5s ease-in-out infinite" }} />
            <div style={{ fontSize: 11, letterSpacing: 5, color: T.inkMuted, textTransform: "uppercase" }}>tap to open</div>
          </div>
        </div>
      )}

      {/* OPENING */}
      {phase === "opening" && (
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 300, height: 210, position: "relative", filter: "drop-shadow(0 16px 48px rgba(44,36,32,0.15))" }}>
            <EnvelopeOpening />
            <PetalBurst active={true} />
          </div>
        </div>
      )}

      {/* CARD */}
      {(phase === "card" || phase === "done") && (
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 24px", maxWidth: 420, width: "100%" }}>
          <div style={{ width: 300, height: 210, position: "relative", flexShrink: 0, filter: "drop-shadow(0 6px 24px rgba(44,36,32,0.12))" }}>
            <EnvelopeOpen />
          </div>

          {/* The card */}
          <div style={{
            width: "100%", maxWidth: 360,
            background: T.ivory,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: "36px 32px 32px",
            position: "relative",
            boxShadow: "0 2px 0 rgba(255,255,255,0.8) inset, 0 20px 60px rgba(44,36,32,0.14), 0 4px 16px rgba(44,36,32,0.08)",
            animation: "cardRiseUp 1.85s cubic-bezier(0.16,1,0.3,1) both",
            marginTop: -85, zIndex: 5,
          }}>
            {/* shimmer */}
            <div style={{ position: "absolute", inset: 0, borderRadius: 12, overflow: "hidden", pointerEvents: "none" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.5) 50%,transparent 70%)", animation: "sheenSlide 1.8s 0.3s ease both" }} />
            </div>
            {/* corner marks */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 320 220" preserveAspectRatio="none">
              <path d="M16 6 L6 6 L6 16" fill="none" stroke="#B8955A" strokeWidth="1" opacity="0.5" />
              <path d="M304 6 L314 6 L314 16" fill="none" stroke="#B8955A" strokeWidth="1" opacity="0.5" />
              <path d="M16 214 L6 214 L6 204" fill="none" stroke="#B8955A" strokeWidth="1" opacity="0.5" />
              <path d="M304 214 L314 214 L314 204" fill="none" stroke="#B8955A" strokeWidth="1" opacity="0.5" />
            </svg>

            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 13, color: T.rose, letterSpacing: 2, animation: "fadeUp 0.6s 0.85s ease both", animationFillMode: "both" }}>
                You are cordially invited to celebrate the wedding of
              </div>
              <div style={{ marginBottom: 14, display: "flex", justifyContent: "center", gap: 8, animation: "fadeIn 0.6s 0.25s ease both", animationFillMode: "both" }}>
                <Sprig opacity={0.5} /><RoseBloom size={22} opacity={0.7} /><Sprig flip opacity={0.5} />
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,6vw,36px)", fontWeight: 400, fontStyle: "italic", color: T.ink, letterSpacing: 1, lineHeight: 1.05, marginBottom: 6, animation: "fadeUp 0.7s 0.35s ease both", animationFillMode: "both" }}>
                Manan &amp; Shrishti
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px auto", maxWidth: 200, animation: "fadeIn 0.6s 0.55s ease both", animationFillMode: "both" }}>
                <div style={{ flex: 1, height: "0.5px", background: `linear-gradient(to right,transparent,${T.gold}80)` }} />
                <RoseBloom size={10} opacity={0.6} />
                <div style={{ flex: 1, height: "0.5px", background: `linear-gradient(to left,transparent,${T.gold}80)` }} />
              </div>
              <div style={{ fontSize: 12, letterSpacing: 4, color: T.inkMuted, textTransform: "uppercase", marginBottom: 4, fontFamily: "Inter,sans-serif", animation: "fadeUp 0.7s 0.7s ease both", animationFillMode: "both" }}>
                20 · 21 September 2026
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 13, color: T.rose, letterSpacing: 1, animation: "fadeUp 0.6s 0.85s ease both", animationFillMode: "both" }}>
                Vivan Resort, Karnal
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, fontSize: 15, letterSpacing: 4, color: T.inkMuted, textTransform: "uppercase", animation: "fadeIn 0.8s 1.3s ease both", animationFillMode: "both" }}>
            tap anywhere to continue
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const cd = useCountdown();
  useEffect(() => { const t = setTimeout(() => setReady(true), 150); return () => clearTimeout(t); }, []);

  return (
    <section style={{ position: "relative", minHeight: "100vh", background: T.parchment, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Photo — top half, softly faded */}
      <div style={{ position: "relative", width: "100%", height: "62vh", overflow: "hidden", flexShrink: 0 }}>
        <img src={PHOTO_HERO} alt="Manan and Shrishti" onLoad={() => setLoaded(true)}
          style={{
            width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top",
            opacity: loaded ? 1 : 0, transition: "opacity 1.8s ease",
            animation: loaded ? "slowZoom 22s ease-in-out infinite alternate" : "none"
          }} />
        {/* Gradient fade to parchment at bottom */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom,rgba(250,246,239,0) 0%,rgba(250,246,239,0.3) 50%,${T.parchment} 100%)` }} />
        {/* Soft vignette */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center,transparent 40%,rgba(243,237,226,0.5) 100%)" }} />
      </div>

      <Petals count={10} />

      {/* Content below photo */}
      <div style={{
        flex: 1,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "0 24px 100px",
        background: T.parchment,
        position: "relative",
      }}>
        {/* Botanical frame behind text */}
        <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", pointerEvents: "none", opacity: 0.18 }}>
          <BotanicalFrame width={520} height={420} />
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, letterSpacing: 6, color: T.sage, textTransform: "uppercase", marginBottom: 16, fontWeight: 500, opacity: ready ? 1 : 0, animation: ready ? "fadeUp 0.8s 0.1s ease both" : "none" }}>
            Counting down to forever
          </div>

          <div style={{
            display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "clamp(12px, 4vw, 32px)", flexWrap: "nowrap",
            marginBottom: 40
          }}>
            {/* Manan */}
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(42px,10vw,80px)",
                fontWeight: 400, fontStyle: "italic",
                color: T.ink,
                letterSpacing: 1, lineHeight: 0.95,
                marginBottom: 12,
                opacity: ready ? 1 : 0,
                animation: ready ? "fadeUp 1s 0.2s ease both" : "none",
              }}>
                Manan
              </div>
              <div style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: T.sage,
                marginBottom: 8,
                opacity: ready ? 1 : 0,
                animation: ready ? "fadeUp 1s 0.3s ease both" : "none",
              }}>
                Son of
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(16px,3vw,20px)", fontStyle: "italic", color: T.inkLight,
                opacity: ready ? 1 : 0,
                animation: ready ? "fadeUp 1s 0.4s ease both" : "none",
              }}>
                Mr. Surinder Khurana <br/> <span style={{ fontSize: "0.75em", color: T.rose }}>&amp;</span> Mrs. Neelam Rani
              </div>
            </div>

            {/* Botanical divider */}
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              opacity: ready ? 1 : 0, animation: ready ? "fadeIn 0.8s 0.5s ease both" : "none",
              padding: "0 16px"
            }}>
              <RoseBloom size={30} opacity={0.75} />
            </div>

            {/* Shrishti */}
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(42px,10vw,80px)",
                fontWeight: 400, fontStyle: "italic",
                color: T.ink,
                letterSpacing: 1, lineHeight: 0.95,
                marginBottom: 12,
                opacity: ready ? 1 : 0,
                animation: ready ? "fadeUp 1s 0.6s ease both" : "none",
              }}>
                Shrishti
              </div>
              <div style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: T.sage,
                marginBottom: 8,
                opacity: ready ? 1 : 0,
                animation: ready ? "fadeUp 1s 0.7s ease both" : "none",
              }}>
                Daughter of
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(16px,3vw,20px)", fontStyle: "italic", color: T.inkLight,
                opacity: ready ? 1 : 0,
                animation: ready ? "fadeUp 1s 0.8s ease both" : "none",
              }}>
                Mr. Shivsharan Kaushik <br/> <span style={{ fontSize: "0.75em", color: T.rose }}>&amp;</span> Mrs. Vandana Kaushik
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11, letterSpacing: 4, color: T.inkMuted, textTransform: "uppercase", marginBottom: 32, opacity: ready ? 1 : 0, animation: ready ? "fadeUp 0.8s 0.9s ease both" : "none" }}>
            September 20 · 21 · 2026 · Karnal
          </div>

          {/* Countdown */}
          <div style={{ display: "flex", gap: 10, marginBottom: 40, justifyContent: "center", opacity: ready ? 1 : 0, animation: ready ? "fadeUp 0.8s 0.9s ease both" : "none" }}>
            {[{ l: "Days", v: cd.days }, { l: "Hours", v: cd.hours }, { l: "Minutes", v: cd.minutes }, { l: "Seconds", v: cd.seconds }].map(({ l, v }) => (
              <div key={l} style={{
                textAlign: "center", minWidth: 72,
                background: "#fff",
                border: `1px solid ${T.border}`,
                borderRadius: 12, padding: "14px 6px",
                boxShadow: "0 2px 8px rgba(44,36,32,0.06)",
              }}>
                <div style={{ fontSize: "clamp(22px,5vw,38px)", color: T.ink, lineHeight: 1, fontWeight: 600, fontFamily: "'Cormorant Garamond',serif" }}>{String(v).padStart(2, "0")}</div>
                <div style={{ color: T.rose, fontSize: 8, letterSpacing: 3, textTransform: "uppercase", marginTop: 5, fontFamily: "Inter,sans-serif" }}>{l}</div>
              </div>
            ))}
          </div>

          <a href="#rsvp" style={{
            display: "inline-block", padding: "15px 48px",
            background: T.rose, color: "#fff",
            textDecoration: "none", borderRadius: 100,
            fontWeight: 500, fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
            opacity: ready ? 1 : 0, animation: ready ? "fadeUp 0.8s 1.1s ease both" : "none",
            boxShadow: "0 4px 16px rgba(184,116,106,0.35)",
            transition: "background 0.25s,box-shadow 0.25s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = T.roseDark; e.currentTarget.style.boxShadow = "0 6px 20px rgba(184,116,106,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.rose; e.currentTarget.style.boxShadow = "0 4px 16px rgba(184,116,106,0.35)"; }}>
            Join the celebration
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, animation: "floatY 3s ease-in-out infinite" }}>
          <div style={{ width: 1, height: 32, background: `linear-gradient(to bottom,transparent,${T.rose}60)` }} />
          <div style={{ fontSize: 10, letterSpacing: 4, color: T.inkMuted, textTransform: "uppercase", marginRight: -4 }}>Scroll</div>
        </div>
      </div>
    </section>
  );
}

// ─── CEREMONY ICONS (line art, warm tones) ────────────────────────────────────
function CeremonyIcon({ type, size = 52 }) {
  const s = { fill: "none", stroke: T.rose, strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    haldi: (
      <svg width={size} height={size} viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="10" {...s} />
        <path d="M28 18 C28 12 22 8 22 8 C22 8 20 14 24 18" {...s} />
        <path d="M28 18 C30 12 36 10 36 10 C36 10 36 16 28 18" {...s} />
        <path d="M18 28 C12 26 10 20 10 20 C10 20 16 18 18 24" {...s} />
        <path d="M38 28 C44 26 46 20 46 20 C46 20 40 18 38 24" {...s} />
        <ellipse cx="28" cy="42" rx="12" ry="4" {...s} />
        <line x1="28" y1="38" x2="28" y2="42" {...s} />
      </svg>
    ),
    ring: (
      <svg width={size} height={size} viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="12" {...s} />
        <circle cx="28" cy="28" r="7" {...s} />
        <path d="M22 16 L28 10 L34 16" {...s} />
        <circle cx="28" cy="12" r="3" {...s} />
        <path d="M20 40 Q28 46 36 40" {...s} />
      </svg>
    ),
    ghadi: (
      <svg width={size} height={size} viewBox="0 0 56 56">
        <path d="M16 44 L28 10 L40 44 Z" {...s} />
        <circle cx="28" cy="28" r="4" fill={T.rose} stroke="none" />
        <path d="M20 36 L36 36" {...s} />
        <path d="M28 10 L28 6" {...s} />
        <circle cx="28" cy="5" r="2" {...s} />
        <path d="M12 44 L44 44" {...s} />
      </svg>
    ),
    sehra: (
      <svg width={size} height={size} viewBox="0 0 56 56">
        <path d="M16 18 Q28 12 40 18" {...s} />
        <path d="M14 26 Q28 20 42 26" {...s} />
        {[18, 22, 26, 30, 34, 38].map((x, i) => (
          <path key={i} d={`M${x} 26 Q${x - 1} 36 ${x} 42`} {...s} strokeOpacity={0.5 + i * 0.08} />
        ))}
        <circle cx="28" cy="15" r="3" {...s} />
      </svg>
    ),
    baraat: (
      <svg width={size} height={size} viewBox="0 0 56 56">
        <path d="M8 36 Q20 28 32 32 Q40 34 48 30" {...s} />
        <ellipse cx="18" cy="36" rx="8" ry="5" {...s} />
        <path d="M14 31 Q18 22 22 31" {...s} />
        <circle cx="18" cy="20" r="4" {...s} />
        <path d="M38 28 Q42 22 46 26 Q44 32 40 30" {...s} />
      </svg>
    ),
    reception: (
      <svg width={size} height={size} viewBox="0 0 56 56">
        <path d="M14 42 L14 24 Q14 18 20 18 L36 18 Q42 18 42 24 L42 42" {...s} />
        <path d="M10 42 L46 42" {...s} />
        <path d="M22 18 L22 12 Q22 8 28 8 Q34 8 34 12 L34 18" {...s} />
        <path d="M24 30 Q28 26 32 30 Q28 36 24 30" {...s} />
        <circle cx="28" cy="10" r="2" fill={T.rose} stroke="none" />
      </svg>
    ),
  };
  return icons[type] || null;
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────
const EVENTS = [
  {
    day: "Sunday, 20 September 2026", rose: true, items: [
      {
        id: "haldi", icon: "haldi", time: "11:00 AM", name: "Haldi", venue: "Fountain side, Vivan Resort",
        desc: "Turmeric, blessings, and joyful chaos.",
        colours: ["#FDF0CD", "#FDF374", "#F4C2C2", "#E6E6FA", "#9DC183", "#FFE5B4", "#FFFFF0", "#E6C88C"],
        coloursText: "Butter Yellow • Lemon Yellow • Blush Pink • Lavender • Sage Green • Peach • Ivory • Gold",
        dressStyle: "Traditional • Fun • Easy-going • Comfortable • Wear something you won't mind getting stained!",
        theme: { bg: "#FEF9E7", text: "#8B7D3A", heading: "#E0A800", accent: "#E5C849", style: "floral" }
      },
      {
        id: "ring", icon: "ring", time: "7:00 PM", name: "Ring Ceremony & Sangeet", venue: "GBR Hall, Vivan Resort",
        desc: "Rings, music, dancing under the stars.",
        colours: [
          "radial-gradient(circle at 30% 30%, #a67be0, #8347bf)",
          "radial-gradient(circle at 30% 30%, #B76E79, #722F37)",
          "radial-gradient(circle at 30% 30%, #FFF8DC, #F7E7CE)",
          "radial-gradient(circle at 30% 30%, #FFF8DC, #FFD700)",
          "radial-gradient(circle at 30% 30%, #F5F5F5, #C0C0C0)",
          "radial-gradient(circle at 30% 30%, #191970, #000033)",
          "radial-gradient(circle at 30% 30%, #606060, #000000)"
        ],
        coloursText: "Royal Violet • Wine • Champagne • Gold • Silver • Midnight Navy • Black",
        dressStyle: "Glamorous • Festive • Cocktail Chic • Indo-Western • Sequins, mirror work, embellished sarees, lehengas, gowns, stylish kurtas, bandhgalas or tailored suits. Dress to impress—and don't forget you'll be dancing!",
        theme: { bg: "#1A202C", text: "#E2E8F0", heading: "#D6BC7A", accent: "#D6BC7A", style: "evening" }
      },
    ]
  },
  {
    day: "Monday, 21 September 2026", rose: false, items: [
      {
        id: "wedding", icon: "baraat", time: "2:00 PM onwards", name: "The Wedding", venue: "Vivan Resort",
        desc: "Sacred vows, flying petals, two souls uniting.",
        colours: [],
        coloursText: "Any elegant festive colours are welcome",
        dressStyle: "Traditional • Regal • Elegant • Timeless. Rich silks, embroidered lehengas, graceful sarees, bandhgalas, or classic formal suits to celebrate the occasion in style.",
        subEvents: [
            { name: "Sehrabandi", time: "2:00 PM", venue: "Nawazish" },
            { name: "Baraat", time: "3:00 PM", venue: "Outside lawn" },
            { name: "Varmala & Phere", time: "5:00 PM", venue: "Outside lawn" },
            { name: "Reception", time: "7:00 PM onwards", venue: "Smaira" },
        ],
        theme: { bg: "#FAF6EF", text: "#4E342E", heading: "#2C2420", accent: "#B8746A", style: "premium" }
      }
    ]
  },
];

// ─── DECORATIVE BACKGROUND ────────────────────────────────────────────────────
const EVENT_DECORATIONS = {
  haldi:     { top: "/haldi-top.svg",     bottom: "/haldi-bottom.svg",     nextBg: "#1A202C",  overlayAnim: "none" },
  ring:      { top: "/sangeet-top.svg",   bottom: "/sangeet-bottom.svg",   nextBg: "#FAF6EF",  overlayAnim: "none" },
  wedding:   { top: "/wedding-top.svg",   bottom: "/wedding-bottom.svg",   nextBg: "#2D2625",  overlayAnim: "none" },
  reception: { top: "/reception-top.svg", bottom: "/reception-bottom.svg", nextBg: null,       overlayAnim: "none" },
};

function ImmersiveEvent({ ev, isLast }) {
  const [ref, visible] = useReveal(0.15);
  const t = ev.theme;
  const deco = EVENT_DECORATIONS[ev.id] || {};

  // Determine the transition gradient to the next section
  const transitionGradient = deco.nextBg && !isLast
    ? `linear-gradient(to bottom, transparent 60%, ${deco.nextBg} 100%)`
    : null;

  return (
    <div ref={ref} style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",
      background: t.bg, color: t.text, position: "relative", padding: "120px 24px 160px",
      overflow: "hidden",
    }}>

      {/* ── Top decorative SVG ── */}
      {deco.top && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          pointerEvents: "none", zIndex: 0,
          animation: `${deco.overlayAnim} 6s ease-in-out infinite`,
          transformOrigin: "top center",
        }}>
          <img src={deco.top} alt="" aria-hidden="true" style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
      )}

      {/* ── Bottom decorative SVG ── */}
      {deco.bottom && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          pointerEvents: "none", zIndex: 0,
          animation: `${deco.overlayAnim} 7s ease-in-out infinite reverse`,
          transformOrigin: "bottom center",
        }}>
          <img src={deco.bottom} alt="" aria-hidden="true" style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
      )}

      {/* ── Seamless transition gradient to next section ── */}
      {transitionGradient && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "220px",
          background: transitionGradient,
          pointerEvents: "none", zIndex: 1,
        }} />
      )}

      {/* ── Per-theme ambient overlays ── */}
      {t.style === "floral" && (
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,240,180,0.18) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      )}
      {t.style === "evening" && (
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 70% 15%, rgba(214,188,122,0.12) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 }} />
      )}
      {t.style === "premium" && (
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(184,116,106,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      )}
      {t.style === "grand" && (
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 10%, rgba(184,149,90,0.18) 0%, transparent 55%)", pointerEvents: "none", zIndex: 0 }} />
      )}

      {/* ── Event Content ── */}
      <div style={{
        maxWidth: 700, margin: "0 auto", width: "100%", position: "relative", zIndex: 2,
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 1s ease, transform 1s ease"
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ opacity: 0.8, color: t.accent }}><CeremonyIcon type={ev.icon} size={64} /></div>
        </div>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h3 style={{
            fontFamily: "'DM Serif Display',serif", fontSize: "clamp(36px,8vw,64px)",
            fontWeight: 400, fontStyle: "italic", color: t.heading,
            marginBottom: 12, lineHeight: 1.1
          }}>
            {ev.name}
          </h3>
          
          {!ev.subEvents ? (
            <>
              <div style={{ fontSize: 13, letterSpacing: 4, textTransform: "uppercase", color: t.accent, marginBottom: 8, fontFamily: "Inter,sans-serif" }}>
                {ev.time}
              </div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: t.text, opacity: 0.8, fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>📍</span> {ev.venue}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
              {ev.subEvents.map((sub, i) => (
                <div key={i}>
                  <div style={{ fontSize: 18, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontWeight: 600, color: t.text }}>{sub.name}</div>
                  <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginTop: 6, fontFamily: "Inter,sans-serif" }}>
                    {sub.time} <span style={{ opacity: 0.5, margin: "0 6px" }}>|</span> 📍 {sub.venue}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{
            fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(18px,4vw,24px)",
            fontStyle: "italic", fontWeight: 300, color: t.text, opacity: 0.9,
            maxWidth: 480, margin: "0 auto", lineHeight: 1.6
          }}>
            "{ev.desc}"
          </p>
        </div>

        {/* Dress Code Box */}
        <div style={{
          background: t.style === 'evening' || t.style === 'grand' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.45)',
          border: `1px solid ${t.style === 'evening' || t.style === 'grand' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
          borderRadius: 16, padding: "32px", backdropFilter: "blur(12px)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.05)"
        }}>
          <div style={{ textAlign: "center", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: t.accent, marginBottom: 24, fontWeight: 600 }}>
            Dress Code
          </div>

          {ev.colours && ev.colours.length > 0 && (
            <>
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
                {ev.colours.map((c, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: "50%", background: c,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    border: `2px solid ${t.style === 'evening' || t.style === 'grand' ? 'rgba(255,255,255,0.2)' : '#fff'}`
                  }} title={c} />
                ))}
              </div>

              <div style={{ textAlign: "center", marginBottom: 24, fontSize: 13, color: t.text, opacity: 0.8, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", lineHeight: 1.6 }}>
                <div style={{ fontWeight: 600, marginBottom: 6, color: t.accent, fontFamily: "Inter,sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, fontStyle: "normal" }}>Colours</div>
                {ev.coloursText}
              </div>
            </>
          )}
          
          <div style={{ textAlign: "center", fontSize: 13, color: t.text, opacity: 0.8, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", lineHeight: 1.6 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: t.accent, fontFamily: "Inter,sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, fontStyle: "normal" }}>Style</div>
            {ev.dressStyle}
          </div>

          {ev.note && (
            <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: t.text, opacity: 0.7, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif" }}>
              ✦ {ev.note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Events() {
  const [ref, visible] = useReveal(0.05);
  return (
    <section id="events" ref={ref} style={{ position: "relative", overflow: "hidden", background: "#fff" }}>
      {/* Intro Header */}
      <div style={{ background: T.parchmentDeep, padding: "96px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 15, letterSpacing: 5, color: T.sage, textTransform: "uppercase", marginBottom: 12, fontWeight: 500, opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.6s ease both" : "none" }}>
            The celebrations
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(32px,6vw,54px)", color: T.ink, fontWeight: 400, fontStyle: "italic", opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.1s ease both" : "none" }}>
            A journey of love.
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 24, opacity: visible ? 1 : 0, animation: visible ? "fadeIn 0.8s 0.2s ease both" : "none" }}>
            <Sprig opacity={0.45} /><RoseBloom size={18} opacity={0.6} /><Sprig flip opacity={0.45} />
          </div>
        </div>
      </div>

      {EVENTS.map((day, di) => (
        <div key={di}>
          <div style={{ 
            position: "sticky", top: 0, zIndex: 10, background: "rgba(250,246,239,0.95)", backdropFilter: "blur(12px)",
            padding: "24px 0", borderBottom: `2px solid ${T.roseLight}`, borderTop: di > 0 ? `2px solid ${T.roseLight}` : 'none',
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
          }}>
            <div style={{ textAlign: "center", fontSize: 14, letterSpacing: 6, color: T.ink, textTransform: "uppercase", fontFamily: "Inter,sans-serif", fontWeight: 600 }}>
              {day.day}
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12, opacity: 0.6 }}>
              <Sprig opacity={0.5} /><RoseBloom size={14} opacity={0.5} /><Sprig flip opacity={0.5} />
            </div>
          </div>
          {day.items.map((ev, ei) => {
            const allItems = EVENTS.flatMap(d => d.items);
            const globalIndex = allItems.findIndex(e => e.id === ev.id);
            const isLast = globalIndex === allItems.length - 1;
            return <ImmersiveEvent key={ev.id} ev={ev} isLast={isLast} />;
          })}
        </div>
      ))}
    </section>
  );
}

// ─── VENUE ────────────────────────────────────────────────────────────────────
function Venue() {
  const [ref, visible] = useReveal(0.07);
  return (
    <section id="venue" ref={ref} style={{ background: "#fff", padding: "96px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -60, top: "50%", transform: "translateY(-50%)", opacity: 0.07, pointerEvents: "none" }}>
        <BotanicalFrame width={380} height={560} />
      </div>
      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 9, letterSpacing: 5, color: T.sage, textTransform: "uppercase", marginBottom: 12, opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.6s ease both" : "none" }}>
            Find your way to us
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(26px,5vw,44px)", color: T.ink, fontWeight: 400, fontStyle: "italic", opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.1s ease both" : "none" }}>
            Vivan Resort, Karnal
          </h2>
          <p style={{ fontSize: 14, color: T.inkMuted, lineHeight: 1.9, maxWidth: 380, margin: "12px auto 0", fontWeight: 300, opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.2s ease both" : "none" }}>
            Set amid lush grounds in the heart of Haryana — our home for two unforgettable days.
          </p>
        </div>

        <div className="map-frame" style={{ marginBottom: 36, opacity: visible ? 1 : 0, animation: visible ? "scaleIn 0.9s 0.25s ease both" : "none" }}>
          <iframe title="Vivan Resort Karnal" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3488.563492026967!2d76.97659!3d29.6856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e4571dd0bc3b1%3A0x7f9c3db0b1234567!2sVivan%20Resort%20Karnal!5e0!3m2!1sen!2sin!4v1234567890" width="100%" height="300" style={{ border: "none", display: "block" }} loading="lazy" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14, marginBottom: 28, opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.4s ease both" : "none" }}>
          {[
            { icon: "📍", title: "Address", lines: ["Vivan Resort", "Karnal, Haryana 132001"], link: { label: "Open in Maps", href: "https://share.google/bzxZ0WW2HHCV6rXFQ" } },
            { icon: "✈️", title: "Nearest Airports", lines: ["Delhi IGI — 2.5 hrs", "Chandigarh — 2 hrs"] },
            { icon: "🚗", title: "By Road", lines: ["NH-44 from Delhi", "Karnal exit, Chandigarh highway"] },
            { icon: "🌐", title: "Venue", lines: ["vivanresort.com"], link: { label: "Visit website", href: "https://www.vivanresort.com" } },
          ].map((c, i) => (
            <div key={i} style={{ background: T.parchment, borderRadius: 14, padding: "18px 20px", border: `1px solid ${T.borderLight}` }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: T.sage, textTransform: "uppercase", marginBottom: 6 }}>{c.title}</div>
              {c.lines.map((l, j) => <div key={j} style={{ fontSize: 13, color: T.inkLight, lineHeight: 1.8 }}>{l}</div>)}
              {c.link && <a href={c.link.href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 6, fontSize: 11, color: T.rose, textDecoration: "none", letterSpacing: 1 }}>{c.link.label} →</a>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", fontSize: 13, color: T.inkMuted, lineHeight: 2, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.55s ease both" : "none" }}>
          Outstation guests — let us know in the RSVP and we'll take care of your stay.
        </div>
      </div>
    </section>
  );
}

// ─── SCRAPBOOK ────────────────────────────────────────────────────────────────
const PHOTOS = [
  { src: "/story-1.jpg", rotate: -3.5 },
  { src: "/story-2.jpg", rotate: 2.2 },
  { src: "/story-3.jpg", rotate: -1.8 },
  { src: "/story-4.jpg", rotate: 2.5 },
  { src: "/story-5.jpg", rotate: 1.5 },
];

function Scrapbook() {
  const [ref, visible] = useReveal(0.04);
  return (
    <section id="gallery" ref={ref} style={{ background: T.mist, padding: "88px 24px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 9, letterSpacing: 5, color: T.sage, textTransform: "uppercase", marginBottom: 12, fontWeight: 500, opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.6s ease both" : "none" }}>
            Before September
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(26px,5vw,44px)", color: T.ink, fontWeight: 400, fontStyle: "italic", opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.1s ease both" : "none" }}>
            A few pages from our story
          </h2>
        </div>
        {/* Row 1: 3 photos */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
          {PHOTOS.slice(0, 3).map((p, i) => (
            <div key={i} style={{
              opacity: visible ? 1 : 0,
              animation: visible ? `scaleIn 0.6s ${i * 0.08}s ease both` : "none",
              flex: "1 1 160px", maxWidth: 200,
            }}>
              <div className="polaroid" style={{ transform: `rotate(${p.rotate}deg)` }}>
                <img src={p.src} alt="Our Story" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block", filter: "contrast(1.02) saturate(0.92)" }} loading="lazy" onError={e => { e.currentTarget.style.minHeight = "150px"; e.currentTarget.style.background = T.blush; }} />
              </div>
            </div>
          ))}
        </div>
        {/* Row 2: 2 photos centered */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          {PHOTOS.slice(3, 5).map((p, i) => (
            <div key={i + 3} style={{
              opacity: visible ? 1 : 0,
              animation: visible ? `scaleIn 0.6s ${(i + 3) * 0.08}s ease both` : "none",
              flex: "1 1 160px", maxWidth: 200,
            }}>
              <div className="polaroid" style={{ transform: `rotate(${p.rotate}deg)` }}>
                <img src={p.src} alt="Our Story" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block", filter: "contrast(1.02) saturate(0.92)" }} loading="lazy" onError={e => { e.currentTarget.style.minHeight = "150px"; e.currentTarget.style.background = T.blush; }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SCRATCH CARD ─────────────────────────────────────────────────────────────
function ScratchCard() {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [scratching, setScratching] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, canvas.width, 0);
    g.addColorStop(0, "#C9897A"); g.addColorStop(0.5, "#D4B483"); g.addColorStop(1, "#C9897A");
    ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,240,236,0.22)";
    for (let i = 0; i < canvas.width; i += 6) { for (let j = 0; j < canvas.height; j += 6) { if (Math.random() > 0.55) ctx.fillRect(i, j, 3, 3); } }
    ctx.fillStyle = "#fff"; ctx.font = "bold 14px -apple-system,sans-serif";
    ctx.textAlign = "center"; ctx.fillText("✦  scratch here  ✦", canvas.width / 2, canvas.height / 2 + 5);
  }, []);
  const scratch = (x, y) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const cx = (x - rect.left) * (canvas.width / rect.width);
    const cy = (y - rect.top) * (canvas.height / rect.height);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.fill();
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let t = 0; for (let i = 3; i < data.length; i += 4) { if (data[i] === 0) t++; }
    if (t / (canvas.width * canvas.height) * 100 > 45 && !revealed) setRevealed(true);
  };
  const handleMouseMove = (e) => { if (scratching) scratch(e.clientX, e.clientY); };
  const handleTouch = (e) => { e.preventDefault(); scratch(e.touches[0].clientX, e.touches[0].clientY); };
  return (
    <div style={{ position: "relative", width: 290, height: 120, margin: "0 auto", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 16px rgba(44,36,32,0.12)" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 20px", background: T.ivory }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 20, color: T.rose, marginBottom: 6, lineHeight: 1.3 }}>You just made our day more beautiful.</div>
        <div style={{ fontSize: 12, color: T.inkMuted }}>See you in September 🌸</div>
      </div>
      <canvas ref={canvasRef} width={580} height={240}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: 14, opacity: revealed ? 0 : 1, transition: "opacity 0.5s ease 0.3s", touchAction: "none", cursor: "crosshair" }}
        onMouseDown={() => setScratching(true)} onMouseUp={() => setScratching(false)} onMouseLeave={() => setScratching(false)}
        onMouseMove={handleMouseMove} onTouchMove={handleTouch} />
    </div>
  );
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────
const EVENT_OPTIONS = [
  { label: "Haldi", icon: "🌿", sub: "Day 1 · 11 AM" },
  { label: "Ring Ceremony & Sangeet", icon: "💍", sub: "Day 1 · 7 PM" },
  { label: "Ghadi Ghadoli", icon: "🪔", sub: "Day 2 · 11 AM" },
  { label: "Sehra Bandi", icon: "👑", sub: "Day 2 · 2 PM" },
  { label: "Baraat", icon: "🐎", sub: "Day 2 · 4 PM" },
  { label: "Reception", icon: "🥂", sub: "Day 2 · 8 PM" },
];
const ACCOM_OPTIONS = [
  { label: "No room needed", sub: "I'm sorted, thank you" },
  { label: "Single room", sub: "Just for me" },
  { label: "Double sharing", sub: "Sharing with someone" },
  { label: "Family room", sub: "Coming with family" },
];
const STEP_LABELS = ["You", "Events", "Stay", "Message"];

function RSVP() {
  const [ref, visible] = useReveal(0.06);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", phone: "", email: "", events: [], guests: "1", accommodation: "", message: "" });

  const toggle = (label) => setForm(f => ({ ...f, events: f.events.includes(label) ? f.events.filter(e => e !== label) : [...f.events, label] }));
  const canNext = () => {
    if (step === 0) return form.name.trim().length > 1 && form.phone.trim().length > 6;
    if (step === 1) return form.events.length > 0;
    return true;
  };
  const goNext = () => { if (step < 3) setStep(s => s + 1); else submit(); };

  const submit = async () => {
    setStatus("sending");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rsvps`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY, "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, "Prefer": "return=minimal" },
          body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim() || null, events: form.events, guest_count: parseInt(form.guests), accommodation: form.accommodation || null, message: form.message.trim() || null }),
        }
      );
      if (!res.ok) { const b = await res.text(); console.error("RSVP error:", res.status, b); }
      setStatus("done");
    } catch (err) { console.error(err); setStatus("done"); }
  };

  const inp = { width: "100%", padding: "13px 16px", borderRadius: 10, fontSize: 14, fontFamily: "inherit" };

  const steps = [
    <div key={0}>
      <div style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: 30, color: T.ink, textAlign: "center", marginBottom: 6 }}>Let us know who's coming</div>
      <p style={{ textAlign: "center", color: T.inkMuted, fontSize: 13.5, lineHeight: 1.8, marginBottom: 24, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}>We'd love to put your name on our list.</p>
      {[{ label: "Your name *", field: "name", type: "text", ph: "Full name" }, { label: "Phone *", field: "phone", type: "tel", ph: "+91 98765 43210" }, { label: "Email (optional)", field: "email", type: "email", ph: "For updates closer to the date" }].map(({ label, field, type, ph }) => (
        <div key={field} style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 9, fontWeight: 500, color: T.inkMuted, display: "block", marginBottom: 5, letterSpacing: 2, textTransform: "uppercase" }}>{label}</label>
          <input className="rsvp-input" style={inp} type={type} placeholder={ph} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} />
        </div>
      ))}
    </div>,

    <div key={1}>
      <div style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: 30, color: T.ink, textAlign: "center", marginBottom: 6 }}>Which events will you join?</div>
      <p style={{ textAlign: "center", color: T.inkMuted, fontSize: 13.5, lineHeight: 1.8, marginBottom: 20, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}>Select everything you're planning to attend.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {EVENT_OPTIONS.map(ev => {
          const checked = form.events.includes(ev.label);
          return (
            <div key={ev.label} className={`rsvp-option${checked ? " selected" : ""}`} onClick={() => toggle(ev.label)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 15px", borderRadius: 10, background: checked ? T.blush : "#fff" }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: `1.5px solid ${checked ? T.rose : T.border}`, background: checked ? T.rose : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                {checked && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: 16 }}>{ev.icon}</span>
              <div>
                <div style={{ fontSize: 13.5, color: checked ? T.ink : T.inkLight, fontWeight: checked ? 500 : 400 }}>{ev.label}</div>
                <div style={{ fontSize: 10.5, color: T.inkFaint, marginTop: 1 }}>{ev.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>,

    <div key={2}>
      <div style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: 30, color: T.ink, textAlign: "center", marginBottom: 6 }}>Your stay</div>
      <p style={{ textAlign: "center", color: T.inkMuted, fontSize: 13.5, lineHeight: 1.8, marginBottom: 20, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}>Let us know and we'll make sure you're comfortable.</p>
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 9, fontWeight: 500, color: T.inkMuted, display: "block", marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" }}>Accommodation needed</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ACCOM_OPTIONS.map(a => (
            <div key={a.label} className={`rsvp-option${form.accommodation === a.label ? " selected" : ""}`} onClick={() => setForm(f => ({ ...f, accommodation: a.label }))}
              style={{ padding: "13px 15px", borderRadius: 10, background: form.accommodation === a.label ? T.blush : "#fff" }}>
              <div style={{ fontSize: 13.5, color: form.accommodation === a.label ? T.ink : T.inkLight, fontWeight: form.accommodation === a.label ? 500 : 400 }}>{a.label}</div>
              <div style={{ fontSize: 10.5, color: T.inkFaint, marginTop: 1 }}>{a.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label style={{ fontSize: 9, fontWeight: 500, color: T.inkMuted, display: "block", marginBottom: 6, letterSpacing: 2, textTransform: "uppercase" }}>Total guests (including yourself)</label>
        <select className="rsvp-input" style={{ ...inp, cursor: "pointer" }} value={form.guests} onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}>
          {["1", "2", "3", "4", "5+"].map(n => <option key={n} value={n}>{n} {n === "1" ? "guest" : "guests"}</option>)}
        </select>
      </div>
    </div>,

    <div key={3} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: 30, color: T.ink, marginBottom: 6 }}>Anything else?</div>
      <p style={{ color: T.inkMuted, fontSize: 13.5, lineHeight: 1.8, marginBottom: 20, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}>Dietary preferences, a message for us,<br />anything we should know.</p>
      <textarea className="rsvp-input" style={{ ...inp, resize: "none", minHeight: 120, textAlign: "left" }} rows={5} placeholder="Write something warm… 🌸" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
    </div>,
  ];

  return (
    <section id="rsvp" ref={ref} style={{ background: T.blush, padding: "96px 24px 112px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -80, top: "50%", transform: "translateY(-50%)", opacity: 0.1, pointerEvents: "none" }}>
        <BotanicalFrame width={440} height={600} />
      </div>
      <div style={{ maxWidth: 520, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 9, letterSpacing: 5, color: T.sage, textTransform: "uppercase", marginBottom: 12, fontWeight: 500, opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.6s ease both" : "none" }}>
            Your place at our table
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(26px,5vw,44px)", color: T.ink, fontWeight: 400, fontStyle: "italic", lineHeight: 1.2, marginBottom: 10, opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.1s ease both" : "none" }}>
            You're not just invited.
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "clamp(15px,2.5vw,20px)", color: T.rose, fontWeight: 400, opacity: visible ? 1 : 0, animation: visible ? "fadeUp 0.8s 0.2s ease both" : "none" }}>
            You're helping us create the most beautiful celebration of our lives.
          </p>
        </div>

        {status === "done" ? (
          <div style={{ textAlign: "center", padding: "52px 32px", background: "#fff", borderRadius: 24, border: `1px solid ${T.borderLight}`, boxShadow: "0 4px 24px rgba(44,36,32,0.08)", animation: "scaleIn 0.7s ease both" }}>
            <div style={{ fontSize: 44, marginBottom: 20, animation: "floatY2 3s ease-in-out infinite" }}>🌸</div>
            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: 28, color: T.ink, fontWeight: 400, marginBottom: 10 }}>We can't wait to see you.</h3>
            <p style={{ color: T.inkMuted, fontSize: 14, lineHeight: 2, marginBottom: 28, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}>
              Your RSVP is confirmed. We'll be in touch closer to the date. See you in Karnal. ✦
            </p>
            <ScratchCard />
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 24, padding: "36px 28px", border: `1px solid ${T.borderLight}`, boxShadow: "0 4px 24px rgba(44,36,32,0.08)", opacity: visible ? 1 : 0, animation: visible ? "scaleIn 0.8s 0.3s ease both" : "none" }}>
            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 36 }}>
              {STEP_LABELS.map((label, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: i < step ? T.rose : "transparent", border: `1.5px solid ${i <= step ? T.rose : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: i < step ? "#fff" : i === step ? T.rose : T.inkFaint, transition: "all 0.28s" }}>
                      {i < step ? "✓" : i + 1}
                    </div>
                    <div style={{ fontSize: 8, color: i === step ? T.rose : T.inkFaint, marginTop: 3, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
                  </div>
                  {i < STEP_LABELS.length - 1 && <div style={{ width: 18, height: 1, background: i < step ? T.rose : T.border, marginBottom: 16, transition: "background 0.28s" }} />}
                </div>
              ))}
            </div>

            <div style={{ minHeight: 260 }}>{steps[step]}</div>

            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: "14px", background: "transparent", color: T.inkMuted, border: `1.5px solid ${T.border}`, borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1, transition: "all 0.2s" }}>
                  ← Back
                </button>
              )}
              <button onClick={goNext} disabled={!canNext() || status === "sending"} style={{ flex: 2, padding: "14px", background: canNext() ? T.rose : "#EDE0D4", color: canNext() ? "#fff" : T.inkFaint, border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: canNext() ? "pointer" : "not-allowed", fontFamily: "inherit", letterSpacing: 1.5, textTransform: "uppercase", transition: "all 0.22s", boxShadow: canNext() ? "0 4px 14px rgba(184,116,106,0.3)" : "none" }}>
                {status === "sending" ? "Sending…" : step === 3 ? "Confirm RSVP 🌸" : "Continue →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── CONTACT STRIP ────────────────────────────────────────────────────────────
function ContactStrip() {
  return (
    <div style={{ background: T.sageLight, padding: "36px 24px", textAlign: "center", borderTop: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: T.sageDark, textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>Questions? We're here</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
        {[
          { href: "mailto:mananshrishti@gmail.com", label: "mananshrishti@gmail.com" },
          { href: "https://wa.me/+919991270015", label: "WhatsApp us", target: "_blank" },
        ].map((l, i) => (
          <a key={i} href={l.href} target={l.target || "_self"} rel="noopener noreferrer"
            style={{ fontSize: 13.5, color: T.sageDark, textDecoration: "none", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = T.roseDark}
            onMouseLeave={e => e.currentTarget.style.color = T.sageDark}>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: T.parchmentDeep, padding: "64px 24px 44px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: -80, left: "50%", transform: "translateX(-50%)", pointerEvents: "none", opacity: 0.12 }}>
        <BotanicalFrame width={480} height={320} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 16, opacity: 0.6 }}>
        <Sprig opacity={0.5} /><RoseBloom size={26} opacity={0.7} /><Sprig flip opacity={0.5} />
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 48, fontWeight: 400, color: T.ink, marginBottom: 3, letterSpacing: 1 }}>Manan & Shrishti</div>
      <div style={{ fontSize: 10, color: T.inkMuted, marginBottom: 2, letterSpacing: 4, textTransform: "uppercase" }}>September 20 – 21, 2026</div>
      <div style={{ fontSize: 11, color: T.inkFaint, marginBottom: 36 }}>Vivan Resort · Karnal, Haryana</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "0 auto 28px", maxWidth: 300 }}>
        <div style={{ flex: 1, height: "0.5px", background: `linear-gradient(to right,transparent,${T.border})` }} />
        <RoseBloom size={14} opacity={0.5} />
        <div style={{ flex: 1, height: "0.5px", background: `linear-gradient(to left,transparent,${T.border})` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 36, flexWrap: "wrap", marginBottom: 36 }}>
        {[["Groom's Family", "The Khurana Family"], ["Bride's Family", "The Kaushik Family"]].map(([role, name], i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 8, letterSpacing: 4, color: T.sage, textTransform: "uppercase", marginBottom: 5 }}>{role}</div>
            <div style={{ fontSize: 16, color: T.inkLight, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}>{name}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: T.inkFaint }}>Made with love for Manan &amp; Shrishti ✦ 2026</div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function GuestSite() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <style>{CSS}</style>
      {!opened && <OpeningSequence onComplete={() => setOpened(true)} />}
      <CursorTrail />
      <Nav />
      <div style={{ background: T.parchment, minHeight: "100vh" }}>
        <Hero />
        <Events />
        <RSVP />
        <Scrapbook />
        <Venue />
        <ContactStrip />
        <Footer />
      </div>
      <MusicPlayer />
    </>
  );
}
