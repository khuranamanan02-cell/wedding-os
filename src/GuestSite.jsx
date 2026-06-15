import { useState, useEffect, useRef } from "react";

// ─── PHOTOS ───────────────────────────────────────────────────────────────────
const PHOTO_HERO   = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3628_7827505_a24xqj";
const PHOTO_FUN    = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3742_8619132_jm4rla";
const PHOTO_FORMAL = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3384_8869296_zgmdw5";
const PHOTO_NEW1   = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3401_6103245_lfst7l";
const PHOTO_NEW2   = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/1000652228_l6op6j";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  black:     "#080808",
  surface1:  "#111111",
  surface2:  "#1A1A1A",
  surface3:  "#242424",
  border:    "#2A2A2A",
  borderGold:"#C9A96E40",
  gold:      "#C9A96E",
  goldLight: "#E8D5B0",
  goldDeep:  "#8B6914",
  white:     "#FFFFFF",
  gray1:     "#ABABAB",
  gray2:     "#666666",
  gray3:     "#333333",
};

const WEDDING_DATE = new Date("2026-09-20T00:00:00");

function useCountdown() {
  const calc = () => {
    const diff = Math.max(0, WEDDING_DATE - new Date());
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor(diff % 86400000 / 3600000),
      minutes: Math.floor(diff % 3600000 / 60000),
      seconds: Math.floor(diff % 60000 / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html { scroll-behavior: smooth; }
body { font-family: 'Inter', sans-serif; background: #080808; color: #FFFFFF; overflow-x: hidden; }
::-webkit-scrollbar { width: 2px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #C9A96E; }

@keyframes slowZoom     { from{transform:scale(1)} to{transform:scale(1.07)} }
@keyframes fadeUp       { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn       { from{opacity:0} to{opacity:1} }
@keyframes shimmer      { 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes floatY       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes floatY2      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
@keyframes tickIn       { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
@keyframes revealLeft   { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
@keyframes revealRight  { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
@keyframes scaleIn      { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
@keyframes rotateSlow   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes rotateSlowR  { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
@keyframes lineGrow     { from{width:0;opacity:0} to{width:100%;opacity:1} }
@keyframes particleDrift{ 0%{transform:translateY(0) translateX(0);opacity:0} 20%{opacity:1} 80%{opacity:0.6} 100%{transform:translateY(-120px) translateX(30px);opacity:0} }
@keyframes pulse        { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.15);opacity:1} }
@keyframes borderGlow   { 0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0)} 50%{box-shadow:0 0 20px 2px rgba(201,169,110,0.15)} }

.hero-img { animation: slowZoom 16s ease-in-out infinite alternate; }

.gold-shimmer {
  background: linear-gradient(90deg, #8B6914 0%, #C9A96E 25%, #F5E4B0 50%, #C9A96E 75%, #8B6914 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; animation: shimmer 5s linear infinite;
}

.gold-line {
  height: 1px;
  background: linear-gradient(to right, transparent, #C9A96E, transparent);
}

.ritual-card {
  transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  border: 1px solid #2A2A2A;
}
.ritual-card:hover {
  transform: translateY(-6px);
  border-color: #C9A96E60 !important;
  box-shadow: 0 20px 60px rgba(201,169,110,0.08) !important;
}

.event-card {
  transition: transform 0.4s ease, border-color 0.4s ease;
  border: 1px solid #2A2A2A;
}
.event-card:hover {
  transform: translateY(-4px);
  border-color: #C9A96E50 !important;
}

.rsvp-input {
  background: #111111 !important;
  border: 1px solid #2A2A2A !important;
  color: #FFFFFF !important;
  transition: border-color 0.3s ease, box-shadow 0.3s ease !important;
}
.rsvp-input:focus {
  border-color: #C9A96E !important;
  box-shadow: 0 0 0 3px rgba(201,169,110,0.1) !important;
  outline: none !important;
}
.rsvp-input::placeholder { color: #555555 !important; }

.rsvp-btn {
  transition: all 0.3s ease !important;
  position: relative; overflow: hidden;
}
.rsvp-btn::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.05), transparent);
  opacity: 0; transition: opacity 0.3s;
}
.rsvp-btn:hover::before { opacity: 1; }
.rsvp-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 30px rgba(201,169,110,0.3) !important; }

.check-option {
  transition: all 0.25s ease;
  border: 1px solid #2A2A2A;
  cursor: pointer;
}
.check-option:hover { border-color: #C9A96E60 !important; background: #1A1A1A !important; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
`;

// ─── MANDALA SVG (pure CSS) ───────────────────────────────────────────────────
function Mandala({ size = 200, opacity = 0.06, speed = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ opacity }}>
      <g transform="translate(100,100)">
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1="0" y1="20" x2="0" y2="60" stroke="#C9A96E" strokeWidth="0.8" />
            <circle cx="0" cy="65" r="2" fill="#C9A96E" />
            <line x1="0" y1="70" x2="0" y2="85" stroke="#C9A96E" strokeWidth="0.4" />
          </g>
        ))}
        {[0,45,90,135,180,225,270,315].map(a => (
          <g key={a} transform={`rotate(${a})`}>
            <ellipse cx="0" cy="42" rx="4" ry="8" fill="none" stroke="#C9A96E" strokeWidth="0.5" />
          </g>
        ))}
        <circle cx="0" cy="0" r="16" fill="none" stroke="#C9A96E" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="8"  fill="none" stroke="#C9A96E" strokeWidth="0.5" />
        <circle cx="0" cy="0" r="3"  fill="#C9A96E" />
      </g>
    </svg>
  );
}

// ─── FLOATING PARTICLES ───────────────────────────────────────────────────────
function Particles({ count = 12 }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      size: 1 + Math.random() * 2,
    }))
  ).current;

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position:"absolute",
          left:`${p.left}%`, bottom:"10%",
          width:p.size, height:p.size,
          borderRadius:"50%",
          background:"#C9A96E",
          animation:`particleDrift ${p.duration}s ${p.delay}s ease-in infinite`,
        }}/>
      ))}
    </div>
  );
}

// ─── GOLD DIVIDER ─────────────────────────────────────────────────────────────
function GoldDivider({ my = 0 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:16, margin:`${my}px 0` }}>
      <div style={{ flex:1, height:1, background:`linear-gradient(to right, transparent, #C9A96E40)` }}/>
      <div style={{ fontSize:14, color:T.gold }}>✦</div>
      <div style={{ flex:1, height:1, background:`linear-gradient(to left, transparent, #C9A96E40)` }}/>
    </div>
  );
}

// ─── EYEBROW ──────────────────────────────────────────────────────────────────
function Eyebrow({ children, visible, delay = 0 }) {
  return (
    <div style={{
      fontSize:10, letterSpacing:5, textTransform:"uppercase",
      color:T.gold, marginBottom:16, fontWeight:500,
      opacity: visible ? 1 : 0,
      animation: visible ? `fadeUp 0.7s ${delay}s ease both` : "none",
    }}>
      {children}
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const countdown = useCountdown();

  return (
    <section style={{ position:"relative", height:"100vh", minHeight:620, overflow:"hidden", background:T.black }}>
      <img
        src={PHOTO_HERO}
        alt="Manan and Shrishti"
        onLoad={() => setLoaded(true)}
        className="hero-img"
        style={{
          position:"absolute", inset:0, width:"100%", height:"100%",
          objectFit:"cover", objectPosition:"center top",
          opacity: loaded ? 0.55 : 0, transition:"opacity 1.4s ease",
        }}
      />

      {/* Multi-layer overlay for depth */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, #080808 0%, rgba(8,8,8,0.7) 40%, rgba(8,8,8,0.2) 100%)" }}/>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, rgba(8,8,8,0.4) 0%, transparent 50%, rgba(8,8,8,0.4) 100%)" }}/>

      {/* Particles */}
      <Particles count={16} />

      {/* Mandala top right */}
      <div style={{ position:"absolute", top:-40, right:-40, animation:"rotateSlow 80s linear infinite" }}>
        <Mandala size={240} opacity={0.07} />
      </div>

      {/* Content */}
      <div style={{
        position:"absolute", inset:0,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"flex-end",
        padding:"0 24px 52px", textAlign:"center",
      }}>
        {/* Family names */}
        <div style={{
          fontSize:11, letterSpacing:4, color:T.gray2,
          textTransform:"uppercase", marginBottom:20,
          opacity: loaded ? 1 : 0,
          animation: loaded ? "fadeUp 0.8s 0.1s ease both" : "none",
        }}>
          The Khurana Family &nbsp;✦&nbsp; The Kaushik Family
        </div>

        {/* Main names */}
        <div style={{
          fontFamily:"'Clash Display',sans-serif",
          fontWeight:700, lineHeight:1,
          opacity: loaded ? 1 : 0,
          animation: loaded ? "fadeUp 1s 0.3s ease both" : "none",
        }}>
          <div style={{ fontSize:"clamp(52px,12vw,96px)", color:T.white, letterSpacing:-2 }}>Manan</div>
          <div style={{ fontSize:"clamp(22px,5vw,36px)", color:T.gold, letterSpacing:8, margin:"8px 0", fontWeight:400 }}>
            &amp;
          </div>
          <div style={{ fontSize:"clamp(52px,12vw,96px)", color:T.white, letterSpacing:-2 }}>Shrishti</div>
        </div>

        {/* Date line */}
        <div style={{
          display:"flex", alignItems:"center", gap:16, margin:"24px 0",
          opacity: loaded ? 1 : 0,
          animation: loaded ? "fadeUp 0.8s 0.55s ease both" : "none",
        }}>
          <div style={{ height:1, width:40, background:`linear-gradient(to left, #C9A96E, transparent)` }}/>
          <div style={{ fontSize:12, letterSpacing:4, color:T.gray1, textTransform:"uppercase" }}>
            September 20 · 21 · 2026 · Karnal
          </div>
          <div style={{ height:1, width:40, background:`linear-gradient(to right, #C9A96E, transparent)` }}/>
        </div>

        {/* Countdown */}
        <div style={{
          display:"flex", gap:8, marginBottom:40,
          opacity: loaded ? 1 : 0,
          animation: loaded ? "fadeUp 0.8s 0.7s ease both" : "none",
        }}>
          {[
            { label:"Days",    val: countdown.days },
            { label:"Hours",   val: countdown.hours },
            { label:"Minutes", val: countdown.minutes },
            { label:"Seconds", val: countdown.seconds },
          ].map(({ label, val }) => (
            <div key={label} style={{
              textAlign:"center", minWidth:72,
              background:"rgba(255,255,255,0.04)",
              border:`1px solid ${T.border}`,
              borderRadius:12, padding:"14px 8px",
              backdropFilter:"blur(10px)",
            }}>
              <div style={{
                fontFamily:"'Clash Display',sans-serif",
                fontSize:"clamp(24px,5vw,38px)", fontWeight:700,
                color:T.white, lineHeight:1,
              }}>
                {String(val).padStart(2,"0")}
              </div>
              <div style={{ color:T.gold, fontSize:9, letterSpacing:3, textTransform:"uppercase", marginTop:6 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a href="#rsvp" style={{
          display:"inline-block", padding:"16px 48px",
          background:T.gold, color:T.black,
          textDecoration:"none", borderRadius:100,
          fontWeight:700, fontSize:13, letterSpacing:2,
          textTransform:"uppercase",
          opacity: loaded ? 1 : 0,
          animation: loaded ? "fadeUp 0.8s 0.9s ease both" : "none",
          boxShadow:"0 0 40px rgba(201,169,110,0.3)",
        }}>
          RSVP Now
        </a>
      </div>

      {/* Scroll hint */}
      <div style={{
        position:"absolute", bottom:20, left:"50%", transform:"translateX(-50%)",
        display:"flex", flexDirection:"column", alignItems:"center", gap:6,
        animation:"floatY 3s ease-in-out infinite",
      }}>
        <div style={{ width:1, height:32, background:`linear-gradient(to bottom, transparent, #C9A96E)` }}/>
        <div style={{ fontSize:9, letterSpacing:3, color:T.gray2, textTransform:"uppercase" }}>scroll</div>
      </div>
    </section>
  );
}

// ─── FAMILIES SECTION ─────────────────────────────────────────────────────────
function Families() {
  const [ref, visible] = useReveal(0.15);
  return (
    <section ref={ref} style={{ background:T.black, padding:"96px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>

      {/* Background mandala */}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", animation:"rotateSlowR 120s linear infinite", pointerEvents:"none" }}>
        <Mandala size={500} opacity={0.03} />
      </div>

      <Eyebrow visible={visible}>Together, We Celebrate</Eyebrow>

      <h2 style={{
        fontFamily:"'Clash Display',sans-serif",
        fontSize:"clamp(28px,6vw,52px)", fontWeight:700,
        color:T.white, lineHeight:1.1, marginBottom:16,
        opacity: visible ? 1:0, animation: visible ? "fadeUp 0.8s 0.1s ease both":"none",
      }}>
        Two families.<br/>
        <span className="gold-shimmer">One celebration.</span>
      </h2>

      <p style={{
        fontSize:15, color:T.gray1, lineHeight:1.9,
        maxWidth:520, margin:"0 auto 56px", fontWeight:300,
        opacity: visible ? 1:0, animation: visible ? "fadeUp 0.8s 0.2s ease both":"none",
      }}>
        What began as two strangers at an ISB dance performance became a friendship,
        a love story, and a bond between two families. We couldn't imagine beginning
        forever without you by our side.
      </p>

      {/* Family cards */}
      <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap", marginBottom:48 }}>
        {[
          { name:"The Khurana Family", side:"Groom's Family", icon:"🕌", desc:"Welcoming you with open hearts from Karnal" },
          { name:"The Kaushik Family", side:"Bride's Family",  icon:"🏡", desc:"Joining together in joy and celebration" },
        ].map((f, i) => (
          <div key={i} style={{
            background:T.surface1, border:`1px solid ${T.border}`,
            borderRadius:20, padding:"32px 28px", flex:"1", minWidth:240, maxWidth:300,
            opacity: visible ? 1:0,
            animation: visible ? `${i===0?"revealLeft":"revealRight"} 0.9s ${0.3+i*0.15}s ease both`:"none",
          }}>
            <div style={{ fontSize:32, marginBottom:16 }}>{f.icon}</div>
            <div style={{ fontSize:10, letterSpacing:4, color:T.gold, textTransform:"uppercase", marginBottom:8 }}>{f.side}</div>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:22, fontWeight:700, color:T.white, marginBottom:10 }}>{f.name}</div>
            <div style={{ fontSize:13, color:T.gray2, lineHeight:1.7 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      <GoldDivider />
    </section>
  );
}

// ─── RITUALS SECTION ──────────────────────────────────────────────────────────
function RitualCard({ ritual, index, visible }) {
  return (
    <div className="ritual-card" style={{
      background:T.surface1, borderRadius:20,
      padding:"28px 24px",
      opacity: visible ? 1:0,
      animation: visible ? `scaleIn 0.7s ${index*0.08}s ease both`:"none",
    }}>
      <div style={{ fontSize:36, marginBottom:16 }}>{ritual.icon}</div>
      <div style={{ fontSize:9, letterSpacing:4, color:T.gold, textTransform:"uppercase", marginBottom:8 }}>{ritual.day}</div>
      <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:20, fontWeight:700, color:T.white, marginBottom:10 }}>
        {ritual.name}
      </div>
      <div style={{ height:1, background:`linear-gradient(to right, #C9A96E60, transparent)`, marginBottom:14 }}/>
      <p style={{ fontSize:13, color:T.gray1, lineHeight:1.8, marginBottom:16, fontWeight:300 }}>{ritual.what}</p>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ color:T.gold, fontSize:11, marginTop:2 }}>👗</span>
          <span style={{ fontSize:12, color:T.gray2 }}><span style={{ color:T.gray1, fontWeight:500 }}>Dress: </span>{ritual.dress}</span>
        </div>
        {ritual.tip && (
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <span style={{ color:T.gold, fontSize:11, marginTop:2 }}>✦</span>
            <span style={{ fontSize:12, color:T.gray2 }}>{ritual.tip}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Rituals() {
  const [ref, visible] = useReveal(0.05);
  const rituals = [
    {
      icon:"🌿", name:"Mehendi",       day:"Day 1 · Afternoon",
      what:"Intricate henna patterns are applied to the bride's hands and feet by skilled artists. Guests can get mehendi too — it's a joyful, music-filled afternoon.",
      dress:"Floral, colourful, festive", tip:"Wear something you can sit comfortably in for a while",
    },
    {
      icon:"💍", name:"Sagan",         day:"Day 1 · Evening",
      what:"A sacred blessing ceremony where the elders of both families formally accept the union. Gifts, sweets, and blessings are exchanged in a deeply personal ritual.",
      dress:"Festive Indian — salwar, kurta, saree", tip:"Bring warmth and blessings",
    },
    {
      icon:"💫", name:"Ring Ceremony", day:"Day 1 · Evening",
      what:"The couple exchanges rings as a symbol of their commitment, surrounded by family and friends. A modern tradition woven into the classical evening.",
      dress:"Festive Indian", tip:"The perfect photo moment",
    },
    {
      icon:"🎶", name:"Ladies Sangeet",day:"Day 1 · Night",
      what:"An electrifying night of music, dance, and performances. Families have been rehearsing! Come ready to dance, cheer, and celebrate.",
      dress:"Cocktail, lehenga, or any festive outfit", tip:"Wear shoes you can dance in",
    },
    {
      icon:"🌼", name:"Haldi",         day:"Day 2 · Morning",
      what:"Turmeric paste is lovingly applied to the bride and groom separately by family members. A playful, deeply auspicious ritual believed to bless the couple.",
      dress:"Yellow or white — expect turmeric!", tip:"Wear something you don't mind getting stained",
    },
    {
      icon:"👑", name:"Sehra Bandi",   day:"Day 2 · Afternoon",
      what:"The groom's family ties the sehra (floral veil) on the groom's turban before the baraat begins. An emotional family moment before the grand procession.",
      dress:"Sherwani / ethnic for men, festive for ladies", tip:"An emotional, beautiful moment",
    },
    {
      icon:"🐴", name:"Baraat",        day:"Day 2 · Evening",
      what:"The groom's procession to the wedding venue — dancing, dhol, and pure joy. The groom arrives in style as the bride's family awaits to welcome him.",
      dress:"Your best ethnic finest", tip:"Save your energy for the dance floor",
    },
    {
      icon:"🔥", name:"Wedding & Pheras", day:"Day 2 · Night",
      what:"The sacred wedding ceremony. The couple takes seven rounds (pheras) around the holy fire, making seven vows to each other. The most sacred ritual of the celebration.",
      dress:"Your most formal Indian attire", tip:"The pheras are deeply moving — tissues welcome",
    },
  ];

  return (
    <section ref={ref} style={{ background:T.surface1, padding:"96px 24px" }}>
      <div style={{ textAlign:"center", marginBottom:64 }}>
        <Eyebrow visible={visible}>Hindu Wedding Traditions</Eyebrow>
        <h2 style={{
          fontFamily:"'Clash Display',sans-serif",
          fontSize:"clamp(28px,6vw,52px)", fontWeight:700, color:T.white,
          opacity: visible ? 1:0, animation: visible ? "fadeUp 0.8s 0.1s ease both":"none",
        }}>
          The rituals &amp; their meaning
        </h2>
        <p style={{
          fontSize:14, color:T.gray2, marginTop:14, maxWidth:480, margin:"14px auto 0",
          opacity: visible ? 1:0, animation: visible ? "fadeUp 0.8s 0.2s ease both":"none",
        }}>
          Each ceremony carries centuries of meaning. Here's what to expect, what to wear, and how to join the joy.
        </p>
      </div>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))",
        gap:20, maxWidth:1100, margin:"0 auto",
      }}>
        {rituals.map((r, i) => <RitualCard key={i} ritual={r} index={i} visible={visible} />)}
      </div>
    </section>
  );
}

// ─── EVENTS SECTION ───────────────────────────────────────────────────────────
function EventCard({ day, di }) {
  const [cardRef, cardVisible] = useReveal(0.08);
  return (
    <div ref={cardRef} className="event-card" style={{
      background:T.surface1, borderRadius:24, overflow:"hidden",
      opacity: cardVisible ? 1:0,
      animation: cardVisible ? `scaleIn 0.7s ${di*0.15}s ease both`:"none",
    }}>
      {/* Header */}
      <div style={{
        padding:"28px 32px",
        borderBottom:`1px solid ${T.border}`,
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div>
          <div style={{ fontSize:10, letterSpacing:4, color:T.gold, textTransform:"uppercase", marginBottom:8 }}>{day.label}</div>
          <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:28, fontWeight:700, color:T.white }}>{day.day}</div>
          <div style={{ fontSize:13, color:T.gray2, marginTop:4 }}>{day.date}</div>
        </div>
        <div style={{ fontSize:40, opacity:0.8 }}>{day.icon}</div>
      </div>

      {/* Functions */}
      <div style={{ padding:"24px 32px", display:"flex", flexDirection:"column", gap:0 }}>
        {day.functions.map((fn, fi) => (
          <div key={fi} style={{
            display:"flex", gap:20, alignItems:"flex-start",
            padding:"20px 0",
            borderBottom: fi < day.functions.length-1 ? `1px solid ${T.border}` : "none",
          }}>
            <div style={{ fontSize:24, flexShrink:0, marginTop:2 }}>{fn.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:18, fontWeight:600, color:T.white, marginBottom:4 }}>{fn.name}</div>
              <div style={{ fontSize:12, color:T.gold, marginBottom:6, letterSpacing:0.5 }}>{fn.time}</div>
              <div style={{ fontSize:12, color:T.gray2 }}>👗 {fn.dress}</div>
              {fn.note && <div style={{ fontSize:12, color:T.gray2, marginTop:3 }}>✦ {fn.note}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Venue */}
      <div style={{ padding:"0 32px 28px" }}>
        <div style={{
          display:"inline-flex", alignItems:"center", gap:8,
          background:T.surface2, borderRadius:100,
          padding:"8px 18px", fontSize:12, color:T.gray1,
          border:`1px solid ${T.border}`,
        }}>
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
      day:"Day One", label:"Saturday", date:"20 September 2026", icon:"🌸",
      functions:[
        { icon:"🌿", name:"Mehendi",               time:"1:00 PM – 4:00 PM",  dress:"Floral & colourful", note:"" },
        { icon:"💍", name:"Sagan + Ring Ceremony", time:"7:00 PM onwards",    dress:"Festive Indian",     note:"" },
        { icon:"🎶", name:"Ladies Sangeet",        time:"7:00 PM onwards",    dress:"Cocktail / lehenga", note:"Come ready to dance!" },
      ],
    },
    {
      day:"Day Two", label:"Sunday", date:"21 September 2026", icon:"✨",
      functions:[
        { icon:"🌼", name:"Haldi",                    time:"Morning",   dress:"Yellow / white — expect turmeric!", note:"" },
        { icon:"👑", name:"Sehra Bandi",              time:"Afternoon", dress:"Sherwani / ethnic",                 note:"" },
        { icon:"🐴", name:"Baraat + Wedding Ceremony",time:"Evening",   dress:"Your finest Indian attire",         note:"The grand finale" },
      ],
    },
  ];

  return (
    <section ref={ref} style={{ background:T.black, padding:"96px 24px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", bottom:-60, left:-60, animation:"rotateSlow 100s linear infinite", pointerEvents:"none" }}>
        <Mandala size={300} opacity={0.04} />
      </div>

      <div style={{ textAlign:"center", marginBottom:64 }}>
        <Eyebrow visible={visible}>The Celebrations</Eyebrow>
        <h2 style={{
          fontFamily:"'Clash Display',sans-serif",
          fontSize:"clamp(28px,6vw,52px)", fontWeight:700, color:T.white,
          opacity: visible?1:0, animation: visible?"fadeUp 0.8s 0.1s ease both":"none",
        }}>
          Two days of joy
        </h2>
        <p style={{
          fontSize:14, color:T.gray2, marginTop:12,
          opacity: visible?1:0, animation: visible?"fadeUp 0.8s 0.2s ease both":"none",
        }}>
          Vivan Venue · Karnal, Haryana
        </p>
      </div>

      <div style={{ maxWidth:780, margin:"0 auto", display:"flex", flexDirection:"column", gap:24 }}>
        {events.map((day, di) => <EventCard key={di} day={day} di={di} />)}
      </div>
    </section>
  );
}

// ─── PHOTO STRIP ──────────────────────────────────────────────────────────────
function PhotoStrip() {
  const [ref, visible] = useReveal(0.1);
  const photos = [PHOTO_NEW1, PHOTO_FUN, PHOTO_FORMAL, PHOTO_NEW2];
  return (
    <section ref={ref} style={{ background:T.surface1, padding:"80px 0", overflow:"hidden" }}>
      <div style={{ textAlign:"center", marginBottom:48, padding:"0 24px" }}>
        <Eyebrow visible={visible}>Manan &amp; Shrishti</Eyebrow>
        <h2 style={{
          fontFamily:"'Clash Display',sans-serif",
          fontSize:"clamp(24px,5vw,40px)", fontWeight:700, color:T.white,
          opacity: visible?1:0, animation: visible?"fadeUp 0.8s 0.1s ease both":"none",
        }}>A glimpse of us</h2>
      </div>
      <div style={{ display:"flex", gap:16, padding:"0 24px", overflowX:"auto", scrollSnapType:"x mandatory" }}>
        {photos.map((p, i) => (
          <div key={i} style={{
            flex:"0 0 260px", height:340, borderRadius:20, overflow:"hidden",
            scrollSnapAlign:"start", border:`1px solid ${T.border}`,
            opacity: visible ? 1:0,
            animation: visible ? `scaleIn 0.7s ${i*0.12}s ease both`:"none",
          }}>
            <img src={p} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }}/>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────
function RSVP() {
  const [ref, visible] = useReveal(0.05);
  const [form, setForm] = useState({ name:"", phone:"", email:"", events:[], guests:"1", message:"" });
  const [status, setStatus] = useState("idle");

  const EVENT_OPTIONS = [
    { label:"Mehendi",               sub:"Day 1 · Afternoon", icon:"🌿" },
    { label:"Sagan + Ring Ceremony", sub:"Day 1 · Evening",   icon:"💍" },
    { label:"Ladies Sangeet",        sub:"Day 1 · Evening",   icon:"🎶" },
    { label:"Haldi",                 sub:"Day 2 · Morning",   icon:"🌼" },
    { label:"Wedding Ceremony",      sub:"Day 2 · Evening",   icon:"🔥" },
  ];

  const toggleEvent = (ev) => {
    setForm(f => ({
      ...f,
      events: f.events.includes(ev) ? f.events.filter(e => e !== ev) : [...f.events, ev],
    }));
  };

  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    setStatus("sending");
    try {
      await fetch("https://hqgrsurxjkpvhsjdnvfz.supabase.co/rest/v1/rsvps", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "Prefer":"return=minimal",
        },
        body: JSON.stringify({
          name: form.name, phone: form.phone, email: form.email,
          events: form.events, guest_count: parseInt(form.guests), message: form.message,
        }),
      });
      setStatus("done");
    } catch(e) { setStatus("done"); }
  };

  const inputStyle = {
    width:"100%", padding:"14px 18px", borderRadius:12,
    fontSize:14, fontFamily:"'Inter',sans-serif",
  };

  return (
    <section id="rsvp" ref={ref} style={{ background:T.black, padding:"96px 24px 100px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-40, right:-40, animation:"rotateSlow 90s linear infinite", pointerEvents:"none" }}>
        <Mandala size={280} opacity={0.05} />
      </div>
      <Particles count={8} />

      <div style={{ textAlign:"center", marginBottom:56 }}>
        <Eyebrow visible={visible}>You're Invited</Eyebrow>
        <h2 style={{
          fontFamily:"'Clash Display',sans-serif",
          fontSize:"clamp(32px,7vw,60px)", fontWeight:700, color:T.white, marginBottom:14,
          opacity: visible?1:0, animation: visible?"fadeUp 0.8s 0.1s ease both":"none",
        }}>
          Will you join us?
        </h2>
        <p style={{
          fontSize:15, color:T.gray2, maxWidth:440, margin:"0 auto",
          opacity: visible?1:0, animation: visible?"fadeUp 0.8s 0.2s ease both":"none",
        }}>
          Let us know you're coming — we're saving a place just for you.
        </p>
      </div>

      {status === "done" ? (
        <div style={{
          maxWidth:520, margin:"0 auto", textAlign:"center",
          padding:"64px 32px", background:T.surface1,
          borderRadius:24, border:`1px solid ${T.borderGold}`,
        }}>
          <div style={{ fontSize:56, marginBottom:20, animation:"floatY2 3s ease-in-out infinite" }}>💌</div>
          <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:28, fontWeight:700, color:T.white, marginBottom:12 }}>
            We can't wait to see you!
          </div>
          <p style={{ color:T.gray2, fontSize:14, lineHeight:1.8 }}>
            Your RSVP has been received. We'll be in touch with details closer to the date.
            See you in Karnal! ✦
          </p>
        </div>
      ) : (
        <div style={{
          maxWidth:520, margin:"0 auto",
          background:T.surface1, borderRadius:24,
          padding:"40px 36px", border:`1px solid ${T.border}`,
          opacity: visible?1:0, animation: visible?"scaleIn 0.7s 0.3s ease both":"none",
        }}>
          {/* Name */}
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:11, fontWeight:600, color:T.gray2, display:"block", marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>Full Name *</label>
            <input className="rsvp-input" style={inputStyle} placeholder="Your name"
              value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))}/>
          </div>

          {/* Phone */}
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:11, fontWeight:600, color:T.gray2, display:"block", marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>Phone *</label>
            <input className="rsvp-input" style={inputStyle} placeholder="+91 98765 43210" type="tel"
              value={form.phone} onChange={e => setForm(f => ({...f, phone:e.target.value}))}/>
          </div>

          {/* Email */}
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:11, fontWeight:600, color:T.gray2, display:"block", marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>
              Email <span style={{ color:T.gray3, fontWeight:400, textTransform:"none", letterSpacing:0 }}>(optional)</span>
            </label>
            <input className="rsvp-input" style={inputStyle} placeholder="For updates" type="email"
              value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))}/>
          </div>

          <GoldDivider my={24} />

          {/* Events */}
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:11, fontWeight:600, color:T.gray2, display:"block", marginBottom:12, letterSpacing:1, textTransform:"uppercase" }}>
              Which events will you attend?
            </label>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {EVENT_OPTIONS.map(ev => {
                const checked = form.events.includes(ev.label);
                return (
                  <div key={ev.label} className="check-option" onClick={() => toggleEvent(ev.label)} style={{
                    display:"flex", alignItems:"center", gap:14,
                    padding:"14px 16px", borderRadius:12,
                    background: checked ? "#1A1A1A" : T.surface2,
                    borderColor: checked ? `${T.gold}80` : T.border,
                  }}>
                    <div style={{
                      width:20, height:20, borderRadius:6, flexShrink:0,
                      border:`1.5px solid ${checked ? T.gold : T.gray3}`,
                      background: checked ? T.gold : "transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      transition:"all 0.25s",
                    }}>
                      {checked && <span style={{ color:T.black, fontSize:11, fontWeight:800 }}>✓</span>}
                    </div>
                    <span style={{ fontSize:18 }}>{ev.icon}</span>
                    <div>
                      <div style={{ fontSize:14, color: checked ? T.white : T.gray1, fontWeight:500 }}>{ev.label}</div>
                      <div style={{ fontSize:11, color:T.gray2, marginTop:2 }}>{ev.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <GoldDivider my={24} />

          {/* Guests */}
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:11, fontWeight:600, color:T.gray2, display:"block", marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>
              Number of guests
            </label>
            <select className="rsvp-input" style={{...inputStyle, cursor:"pointer"}}
              value={form.guests} onChange={e => setForm(f => ({...f, guests:e.target.value}))}>
              {["1","2","3","4","5+"].map(n => <option key={n} value={n}>{n} guest{n!=="1"?"s":""}</option>)}
            </select>
          </div>

          {/* Message */}
          <div style={{ marginBottom:32 }}>
            <label style={{ fontSize:11, fontWeight:600, color:T.gray2, display:"block", marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>
              A message <span style={{ color:T.gray3, fontWeight:400, textTransform:"none", letterSpacing:0 }}>(optional)</span>
            </label>
            <textarea className="rsvp-input" style={{...inputStyle, resize:"none", minHeight:90}} rows={3}
              placeholder="Write something warm…"
              value={form.message} onChange={e => setForm(f => ({...f, message:e.target.value}))}/>
          </div>

          <button className="rsvp-btn" onClick={submit}
            disabled={status==="sending" || !form.name.trim() || !form.phone.trim()}
            style={{
              width:"100%", padding:"17px",
              background: (!form.name.trim() || !form.phone.trim()) ? T.surface3 : T.gold,
              color: (!form.name.trim() || !form.phone.trim()) ? T.gray2 : T.black,
              border:"none", borderRadius:14, fontSize:14, fontWeight:700,
              cursor: !form.name.trim() ? "not-allowed" : "pointer",
              fontFamily:"'Inter',sans-serif", letterSpacing:1.5, textTransform:"uppercase",
            }}>
            {status === "sending" ? "Sending…" : "Confirm my RSVP"}
          </button>
        </div>
      )}
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background:T.surface1, padding:"64px 24px 40px", textAlign:"center", borderTop:`1px solid ${T.border}`, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", bottom:-80, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
        <Mandala size={360} opacity={0.05} />
      </div>

      <div style={{ marginBottom:24, animation:"rotateSlow 30s linear infinite", display:"inline-block" }}>
        <Mandala size={72} opacity={0.5} />
      </div>

      <div className="gold-shimmer" style={{
        fontFamily:"'Clash Display',sans-serif",
        fontSize:48, fontWeight:700, marginBottom:8,
      }}>M &amp; S</div>

      <div style={{ color:T.gray2, fontSize:13, marginBottom:6, letterSpacing:2 }}>September 20 – 21, 2026</div>
      <div style={{ color:T.gray2, fontSize:12, marginBottom:32 }}>Vivan Venue · Karnal, Haryana</div>

      <GoldDivider />

      <div style={{ marginTop:28, display:"flex", justifyContent:"center", gap:32, flexWrap:"wrap" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:10, letterSpacing:3, color:T.gold, textTransform:"uppercase", marginBottom:4 }}>Groom's Family</div>
          <div style={{ fontSize:14, color:T.gray1, fontFamily:"'Clash Display',sans-serif", fontWeight:600 }}>The Khurana Family</div>
        </div>
        <div style={{ width:1, background:T.border, alignSelf:"stretch" }}/>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:10, letterSpacing:3, color:T.gold, textTransform:"uppercase", marginBottom:4 }}>Bride's Family</div>
          <div style={{ fontSize:14, color:T.gray1, fontFamily:"'Clash Display',sans-serif", fontWeight:600 }}>The Kaushik Family</div>
        </div>
      </div>

      <div style={{ marginTop:32, color:T.gray3, fontSize:11 }}>
        Made with love for Manan &amp; Shrishti ✦ 2026
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function GuestSite() {
  return (
    <>
      <style>{CSS}</style>
      <div style={{ background:T.black, minHeight:"100vh" }}>
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
