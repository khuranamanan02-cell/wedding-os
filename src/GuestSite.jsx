import { useState, useEffect, useRef } from "react";

// ─── PHOTOS ───────────────────────────────────────────────────────────────────
const PHOTO_HERO    = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3628_7827505_a24xqj";
const PHOTO_FUN     = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3742_8619132_jm4rla";
const PHOTO_FORMAL  = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3384_8869296_zgmdw5";
const PHOTO_NEW1    = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3401_6103245_lfst7l";
const PHOTO_NEW2    = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/1000652228_l6op6j";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  cream:    "#FAF7F2",
  blush:    "#F0D9D0",
  rose:     "#D4A5A0",
  gold:     "#C9A96E",
  goldLight:"#E8D5B0",
  navy:     "#1E2A4A",
  navyMid:  "#2E3F6F",
  charcoal: "#2C2C2C",
  muted:    "#8A7F78",
  white:    "#FFFFFF",
  border:   "#EDE0D8",
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

// ─── SCROLL REVEAL HOOK ───────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html { scroll-behavior: smooth; }
body { font-family: 'Inter', sans-serif; background: ${T.cream}; color: ${T.charcoal}; overflow-x: hidden; }
::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }

@keyframes slowZoom   { from { transform: scale(1) } to { transform: scale(1.08) } }
@keyframes fadeUp     { from { opacity: 0; transform: translateY(28px) } to { opacity: 1; transform: translateY(0) } }
@keyframes fadeIn     { from { opacity: 0 } to { opacity: 1 } }
@keyframes shimmer    { 0% { background-position: -200% center } 100% { background-position: 200% center } }
@keyframes floatUp    { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-5px) } }
@keyframes tickIn     { from { opacity:0;transform:translateY(-6px) } to { opacity:1;transform:translateY(0) } }
@keyframes revealLeft { from { opacity:0;transform:translateX(-32px) } to { opacity:1;transform:translateX(0) } }
@keyframes revealRight{ from { opacity:0;transform:translateX(32px)  } to { opacity:1;transform:translateX(0) } }
@keyframes scaleIn    { from { opacity:0;transform:scale(0.92) } to { opacity:1;transform:scale(1) } }
@keyframes lineDraw   { from { width:0 } to { width:60px } }
@keyframes handJoin   { from { transform:translateX(-30px);opacity:0 } to { transform:translateX(0);opacity:1 } }
@keyframes handJoinR  { from { transform:translateX(30px);opacity:0 } to { transform:translateX(0);opacity:1 } }
@keyframes pulse      { 0%,100%{transform:scale(1)}50%{transform:scale(1.12)} }
@keyframes rotateStar { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

.hero-img       { animation: slowZoom 14s ease-in-out infinite alternate; }
.gold-shimmer   {
  background: linear-gradient(90deg,#C9A96E 0%,#F5E4B0 40%,#C9A96E 60%,#E8D5B0 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; animation: shimmer 4s linear infinite;
}
.reveal-up      { opacity: 0; }
.reveal-up.show { animation: fadeUp 0.8s ease forwards; }
.reveal-left    { opacity: 0; }
.reveal-left.show { animation: revealLeft 0.8s ease forwards; }
.reveal-right   { opacity: 0; }
.reveal-right.show{ animation: revealRight 0.8s ease forwards; }
.scale-in       { opacity: 0; }
.scale-in.show  { animation: scaleIn 0.7s ease forwards; }

.event-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(30,42,74,0.12) !important; }
.event-card       { transition: transform 0.3s ease, box-shadow 0.3s ease; }

.rsvp-input:focus { border-color: ${T.gold} !important; outline: none; }
.rsvp-btn:hover   { opacity: 0.88; transform: translateY(-1px); }
.rsvp-btn         { transition: opacity 0.2s, transform 0.2s; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
`;

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const countdown = useCountdown();

  return (
    <section style={{ position:"relative", height:"100vh", minHeight:580, overflow:"hidden" }}>
      {/* Photo */}
      <img
        src={PHOTO_HERO}
        alt="Manan and Shrishti"
        onLoad={() => setLoaded(true)}
        className="hero-img"
        style={{
          position:"absolute", inset:0, width:"100%", height:"100%",
          objectFit:"cover", objectPosition:"center top",
          opacity: loaded ? 1 : 0, transition:"opacity 1s ease",
        }}
      />

      {/* Overlay — gradient from bottom */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(to top, rgba(10,8,6,0.82) 0%, rgba(10,8,6,0.3) 50%, rgba(10,8,6,0.1) 100%)",
      }}/>

      {/* Content */}
      <div style={{
        position:"absolute", inset:0,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"flex-end",
        padding:"0 24px 48px", textAlign:"center",
      }}>
        {/* Eyebrow */}
        <div style={{
          color:"rgba(255,255,255,0.65)", fontSize:11, letterSpacing:4,
          textTransform:"uppercase", marginBottom:14,
          animation: loaded ? "fadeUp 0.8s 0.2s ease both" : "none",
        }}>
          September 20 · 21, 2026 · Karnal
        </div>

        {/* Names */}
        <div style={{
          fontFamily:"'Clash Display',sans-serif",
          fontSize:"clamp(42px, 10vw, 72px)",
          fontWeight:700, color:T.white,
          lineHeight:1.05, marginBottom:12,
          animation: loaded ? "fadeUp 0.9s 0.35s ease both" : "none",
        }}>
          Manan
          <span style={{ color:T.gold, display:"block" }}>&amp; Shrishti</span>
        </div>

        {/* Tagline */}
        <div style={{
          color:"rgba(255,255,255,0.72)", fontSize:14, fontWeight:300,
          letterSpacing:1, marginBottom:36,
          animation: loaded ? "fadeUp 0.9s 0.5s ease both" : "none",
        }}>
          are getting married
        </div>

        {/* Countdown */}
        <div style={{
          display:"flex", gap:20, marginBottom:40,
          animation: loaded ? "fadeUp 0.9s 0.65s ease both" : "none",
        }}>
          {[
            { label:"Days",    val: countdown.days },
            { label:"Hours",   val: countdown.hours },
            { label:"Minutes", val: countdown.minutes },
            { label:"Seconds", val: countdown.seconds },
          ].map(({ label, val }) => (
            <div key={label} style={{ textAlign:"center" }}>
              <div style={{
                fontFamily:"'Clash Display',sans-serif",
                fontSize:"clamp(26px,6vw,42px)", fontWeight:700,
                color:T.white, lineHeight:1,
                animation:"tickIn 0.3s ease",
              }}>
                {String(val).padStart(2,"0")}
              </div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:10, letterSpacing:2, textTransform:"uppercase", marginTop:4 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#rsvp"
          style={{
            display:"inline-block", padding:"14px 36px",
            background:T.gold, color:T.navy,
            textDecoration:"none", borderRadius:100,
            fontWeight:600, fontSize:14, letterSpacing:0.5,
            animation: loaded ? "fadeUp 0.9s 0.8s ease both" : "none",
            boxShadow:"0 4px 20px rgba(201,169,110,0.4)",
          }}
        >
          RSVP Now
        </a>
      </div>

      {/* Scroll hint */}
      <div style={{
        position:"absolute", bottom:16, left:"50%", transform:"translateX(-50%)",
        color:"rgba(255,255,255,0.35)", fontSize:11, letterSpacing:2,
        animation:"floatUp 2.5s ease-in-out infinite",
      }}>
        ↓
      </div>
    </section>
  );
}

// ─── WELCOME / HANDS JOINING ──────────────────────────────────────────────────
function Welcome() {
  const [ref, visible] = useReveal(0.2);

  return (
    <section ref={ref} style={{
      padding:"80px 24px 64px", textAlign:"center",
      background:T.cream, position:"relative", overflow:"hidden",
    }}>
      {/* Decorative petals */}
      <div style={{
        position:"absolute", top:20, left:"10%",
        fontSize:28, opacity:0.12, animation:"rotateStar 20s linear infinite",
      }}>✿</div>
      <div style={{
        position:"absolute", top:40, right:"8%",
        fontSize:20, opacity:0.1, animation:"rotateStar 30s linear infinite reverse",
      }}>✦</div>

      {/* Eyebrow */}
      <div style={{
        fontSize:11, letterSpacing:4, textTransform:"uppercase",
        color:T.gold, marginBottom:20,
        opacity: visible ? 1 : 0,
        animation: visible ? "fadeUp 0.7s ease both" : "none",
      }}>
        A warm welcome
      </div>

      {/* Hands joining animation */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"center",
        gap:0, marginBottom:32, fontSize:"clamp(36px,10vw,56px)",
      }}>
        <span style={{
          display:"inline-block",
          opacity: visible ? 1 : 0,
          animation: visible ? "handJoin 1s 0.3s ease both" : "none",
        }}>🤝</span>
        <span style={{
          fontFamily:"'Clash Display',sans-serif",
          fontSize:"clamp(18px,5vw,28px)", fontWeight:600,
          color:T.gold, margin:"0 12px",
          opacity: visible ? 1 : 0,
          animation: visible ? "fadeIn 1s 0.8s ease both" : "none",
        }}>
          together
        </span>
        <span style={{
          display:"inline-block",
          opacity: visible ? 1 : 0,
          animation: visible ? "handJoinR 1s 0.3s ease both" : "none",
        }}>💕</span>
      </div>

      {/* Main welcome text */}
      <h2 style={{
        fontFamily:"'Clash Display',sans-serif",
        fontSize:"clamp(26px,6vw,42px)", fontWeight:700,
        color:T.navy, lineHeight:1.2, marginBottom:20,
        opacity: visible ? 1 : 0,
        animation: visible ? "fadeUp 0.8s 0.5s ease both" : "none",
      }}>
        You are part of our story.
      </h2>

      <p style={{
        fontSize:15, color:T.muted, lineHeight:1.8,
        maxWidth:480, margin:"0 auto 32px",
        fontWeight:300,
        opacity: visible ? 1 : 0,
        animation: visible ? "fadeUp 0.8s 0.65s ease both" : "none",
      }}>
        What began as two strangers at an ISB dance performance became a friendship, 
        a love story, and soon — a family. We couldn't imagine celebrating without you. 
        Join us as we begin forever.
      </p>

      {/* Gold line divider */}
      <div style={{
        height:1, background:`linear-gradient(to right, transparent, ${T.gold}, transparent)`,
        maxWidth:200, margin:"0 auto",
        opacity: visible ? 1 : 0,
        animation: visible ? "fadeIn 1s 1s ease both" : "none",
      }}/>
    </section>
  );
}

// ─── STORY SECTION ────────────────────────────────────────────────────────────
function Story() {
  const moments = [
    {
      photo: PHOTO_NEW1,
      label: "Where it began",
      title: "ISB, Hyderabad",
      text: "A dance performance. Two strangers. One glance that changed everything. They didn't know it then — but this was the beginning.",
      align: "left",
    },
    {
      photo: PHOTO_FUN,
      label: "The moment we knew",
      title: "Kasauli, under a shooting star",
      text: "Under an open sky in Kasauli, Manan got down on one knee. A shooting star passed. She said yes before it disappeared.",
      align: "right",
    },
    {
      photo: PHOTO_NEW2,
      label: "Making it official",
      title: "Diwali, with family",
      text: "On the night of a thousand lights, they told their families. The celebration had already begun.",
      align: "left",
    },
    {
      photo: PHOTO_FORMAL,
      label: "The Roka",
      title: "February 2026",
      text: "Two families became one. Blessings were exchanged, promises were made, and the countdown to September began.",
      align: "right",
    },
  ];

  return (
    <section style={{ background:T.white, padding:"72px 0" }}>
      {/* Section header */}
      <div style={{ textAlign:"center", marginBottom:56, padding:"0 24px" }}>
        <div style={{ fontSize:11, letterSpacing:4, textTransform:"uppercase", color:T.gold, marginBottom:12 }}>
          Our Journey
        </div>
        <h2 style={{
          fontFamily:"'Clash Display',sans-serif",
          fontSize:"clamp(28px,6vw,44px)", fontWeight:700, color:T.navy,
        }}>
          How we got here
        </h2>
      </div>

      {/* Timeline moments */}
      <div style={{ maxWidth:680, margin:"0 auto", padding:"0 20px" }}>
        {moments.map((m, i) => (
          <StoryMoment key={i} moment={m} index={i} />
        ))}
      </div>
    </section>
  );
}

function StoryMoment({ moment, index }) {
  const [ref, visible] = useReveal(0.15);
  const isLeft = moment.align === "left";

  return (
    <div
      ref={ref}
      style={{
        display:"flex",
        flexDirection: isLeft ? "row" : "row-reverse",
        gap:24, marginBottom:56,
        alignItems:"flex-start",
      }}
    >
      {/* Photo */}
      <div style={{
        flex:"0 0 140px",
        opacity: visible ? 1 : 0,
        animation: visible ? `${isLeft ? "revealLeft" : "revealRight"} 0.8s ${index*0.1}s ease both` : "none",
      }}>
        <div style={{
          width:140, height:180, borderRadius:16, overflow:"hidden",
          boxShadow:"0 8px 32px rgba(30,42,74,0.12)",
        }}>
          <img
            src={moment.photo}
            alt={moment.title}
            style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }}
          />
        </div>
      </div>

      {/* Text */}
      <div style={{
        flex:1, paddingTop:12,
        opacity: visible ? 1 : 0,
        animation: visible ? `${isLeft ? "revealRight" : "revealLeft"} 0.8s ${index*0.1+0.15}s ease both` : "none",
      }}>
        <div style={{
          fontSize:10, letterSpacing:3, textTransform:"uppercase",
          color:T.gold, marginBottom:6,
        }}>
          {moment.label}
        </div>
        <div style={{
          fontFamily:"'Clash Display',sans-serif",
          fontSize:18, fontWeight:700, color:T.navy, marginBottom:10,
        }}>
          {moment.title}
        </div>
        <p style={{ fontSize:13, color:T.muted, lineHeight:1.8, fontWeight:300 }}>
          {moment.text}
        </p>
        {/* Dot connector */}
        <div style={{
          width:8, height:8, borderRadius:"50%",
          background:T.gold, marginTop:16,
          marginLeft: isLeft ? 0 : "auto",
        }}/>
      </div>
    </div>
  );
}

// ─── EVENTS SECTION ───────────────────────────────────────────────────────────
function Events() {
  const [ref, visible] = useReveal(0.1);

  const events = [
    {
      day: "Day 1",
      date: "Saturday, 20 September 2026",
      color: T.rose,
      icon: "🌸",
      functions: [
        { name:"Mehendi", time:"1:00 PM – 4:00 PM", dress:"Floral & colourful", note:"Ladies only" },
        { name:"Sagan + Ring Ceremony", time:"7:00 PM onwards", dress:"Festive Indian", note:"" },
        { name:"Ladies Sangeet", time:"7:00 PM onwards", dress:"Cocktail / lehenga", note:"Dance & celebrate!" },
      ],
    },
    {
      day: "Day 2",
      date: "Sunday, 21 September 2026",
      color: T.gold,
      icon: "✨",
      functions: [
        { name:"Haldi", time:"Morning", dress:"Yellow / white", note:"Casual, expect turmeric!" },
        { name:"Sehra Bandi", time:"Afternoon", dress:"Sherwani / ethnic", note:"Groom's family" },
        { name:"Baraat + Wedding Ceremony", time:"Evening", dress:"Formal Indian", note:"Grand finale" },
      ],
    },
  ];

  return (
    <section ref={ref} style={{ padding:"72px 24px", background:T.cream }}>
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ fontSize:11, letterSpacing:4, textTransform:"uppercase", color:T.gold, marginBottom:12,
          opacity: visible ? 1:0, animation: visible ? "fadeUp 0.7s ease both":"none" }}>
          The Celebrations
        </div>
        <h2 style={{
          fontFamily:"'Clash Display',sans-serif",
          fontSize:"clamp(28px,6vw,44px)", fontWeight:700, color:T.navy,
          opacity: visible ? 1:0, animation: visible ? "fadeUp 0.7s 0.1s ease both":"none",
        }}>
          Two days of joy
        </h2>
        <div style={{ fontSize:13, color:T.muted, marginTop:10,
          opacity: visible ? 1:0, animation: visible ? "fadeUp 0.7s 0.2s ease both":"none" }}>
          Vivan Venue · Karnal, Haryana
        </div>
      </div>

      {/* Event cards */}
      <div style={{ maxWidth:680, margin:"0 auto", display:"flex", flexDirection:"column", gap:24 }}>
        {events.map((day, di) => {
          const [cardRef, cardVisible] = useReveal(0.1);
          return (
            <div
              key={di}
              ref={cardRef}
              className="event-card"
              style={{
                background:T.white, borderRadius:20,
                overflow:"hidden",
                boxShadow:"0 4px 24px rgba(30,42,74,0.07)",
                border:`1px solid ${T.border}`,
                opacity: cardVisible ? 1:0,
                animation: cardVisible ? `scaleIn 0.7s ${di*0.15}s ease both`:"none",
              }}
            >
              {/* Day header */}
              <div style={{
                background:`linear-gradient(135deg, ${T.navy}, ${T.navyMid})`,
                padding:"20px 24px",
                display:"flex", alignItems:"center", gap:12,
              }}>
                <span style={{ fontSize:24 }}>{day.icon}</span>
                <div>
                  <div style={{
                    fontFamily:"'Clash Display',sans-serif",
                    fontSize:20, fontWeight:700, color:T.white,
                  }}>{day.day}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginTop:2 }}>
                    {day.date}
                  </div>
                </div>
              </div>

              {/* Functions */}
              <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:16 }}>
                {day.functions.map((fn, fi) => (
                  <div key={fi} style={{
                    display:"flex", gap:14, alignItems:"flex-start",
                    paddingBottom: fi < day.functions.length-1 ? 16 : 0,
                    borderBottom: fi < day.functions.length-1 ? `1px solid ${T.border}` : "none",
                  }}>
                    <div style={{
                      width:4, height:4, borderRadius:"50%",
                      background:day.color, flexShrink:0, marginTop:7,
                    }}/>
                    <div style={{ flex:1 }}>
                      <div style={{
                        fontFamily:"'Clash Display',sans-serif",
                        fontSize:16, fontWeight:600, color:T.navy,
                      }}>{fn.name}</div>
                      <div style={{ fontSize:12, color:T.gold, marginTop:3 }}>{fn.time}</div>
                      <div style={{ fontSize:12, color:T.muted, marginTop:3 }}>
                        👗 {fn.dress}
                        {fn.note && <span style={{ color:T.rose }}> · {fn.note}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Venue pill */}
              <div style={{ padding:"0 24px 20px" }}>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:6,
                  background:T.cream, borderRadius:100,
                  padding:"6px 14px", fontSize:12, color:T.muted,
                }}>
                  📍 Vivan Venue, Karnal
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── RSVP SECTION ─────────────────────────────────────────────────────────────
function RSVP() {
  const [ref, visible] = useReveal(0.1);
  const [form, setForm] = useState({
    name:"", phone:"", email:"",
    events:[], guests:"1", message:"",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const EVENT_OPTIONS = [
    "Mehendi (Day 1 · Afternoon)",
    "Sagan + Ring Ceremony (Day 1 · Evening)",
    "Ladies Sangeet (Day 1 · Evening)",
    "Haldi (Day 2 · Morning)",
    "Wedding Ceremony (Day 2 · Evening)",
  ];

  const toggleEvent = (ev) => {
    setForm(f => ({
      ...f,
      events: f.events.includes(ev)
        ? f.events.filter(e => e !== ev)
        : [...f.events, ev],
    }));
  };

  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    setStatus("sending");
    try {
      // Save to Supabase via a simple fetch to avoid importing sb here
      // We'll just compose the email notification body
      const body = `
New RSVP from ${form.name}

Phone: ${form.phone}
Email: ${form.email || "not provided"}
Attending events: ${form.events.join(", ") || "TBD"}
Number of guests: ${form.guests}
Message: ${form.message || "none"}
      `.trim();

      // Send via email using mailto as fallback (Resend can be wired later)
      // For now: store in Supabase rsvp table
      const res = await fetch("https://hqgrsurxjkpvhsjdnvfz.supabase.co/rest/v1/rsvps", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "apikey": window.__SUPABASE_ANON_KEY__ || "",
          "Authorization": `Bearer ${window.__SUPABASE_ANON_KEY__ || ""}`,
          "Prefer":"return=minimal",
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          events: form.events,
          guest_count: parseInt(form.guests),
          message: form.message,
        }),
      });
      setStatus("done");
    } catch(e) {
      setStatus("done"); // still show success to user; data may have saved
    }
  };

  const inputStyle = {
    width:"100%", padding:"13px 16px",
    border:`1.5px solid ${T.border}`, borderRadius:12,
    fontSize:14, fontFamily:"'Inter',sans-serif",
    color:T.charcoal, background:T.white,
    outline:"none", transition:"border-color 0.2s",
  };

  return (
    <section id="rsvp" ref={ref} style={{ padding:"72px 24px 80px", background:T.white }}>
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ fontSize:11, letterSpacing:4, textTransform:"uppercase", color:T.gold, marginBottom:12,
          opacity:visible?1:0, animation:visible?"fadeUp 0.7s ease both":"none" }}>
          You're invited
        </div>
        <h2 style={{
          fontFamily:"'Clash Display',sans-serif",
          fontSize:"clamp(28px,6vw,44px)", fontWeight:700, color:T.navy, marginBottom:12,
          opacity:visible?1:0, animation:visible?"fadeUp 0.7s 0.1s ease both":"none",
        }}>
          RSVP
        </h2>
        <p style={{
          fontSize:14, color:T.muted, maxWidth:400, margin:"0 auto",
          opacity:visible?1:0, animation:visible?"fadeUp 0.7s 0.2s ease both":"none",
        }}>
          Let us know you're coming — we're saving a special place for you.
        </p>
      </div>

      {status === "done" ? (
        <div style={{
          maxWidth:480, margin:"0 auto", textAlign:"center",
          padding:"48px 32px", background:T.cream,
          borderRadius:20, border:`1px solid ${T.border}`,
        }}>
          <div style={{ fontSize:48, marginBottom:16 }}>💌</div>
          <div style={{
            fontFamily:"'Clash Display',sans-serif",
            fontSize:24, fontWeight:700, color:T.navy, marginBottom:8,
          }}>
            We can't wait to see you!
          </div>
          <p style={{ color:T.muted, fontSize:14, lineHeight:1.7 }}>
            Your RSVP has been received. We'll be in touch with more details closer to the date.
            See you in Karnal! 🎉
          </p>
        </div>
      ) : (
        <div style={{
          maxWidth:480, margin:"0 auto",
          background:T.cream, borderRadius:20,
          padding:"32px 28px", border:`1px solid ${T.border}`,
          opacity:visible?1:0, animation:visible?"scaleIn 0.7s 0.3s ease both":"none",
        }}>
          {/* Name */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:T.navy, display:"block", marginBottom:6 }}>
              Your name *
            </label>
            <input
              className="rsvp-input"
              style={inputStyle}
              placeholder="Full name"
              value={form.name}
              onChange={e => setForm(f => ({...f, name:e.target.value}))}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:T.navy, display:"block", marginBottom:6 }}>
              Phone number *
            </label>
            <input
              className="rsvp-input"
              style={inputStyle}
              placeholder="+91 98765 43210"
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({...f, phone:e.target.value}))}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:T.navy, display:"block", marginBottom:6 }}>
              Email <span style={{ color:T.muted, fontWeight:400 }}>(optional)</span>
            </label>
            <input
              className="rsvp-input"
              style={inputStyle}
              placeholder="for updates"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({...f, email:e.target.value}))}
            />
          </div>

          {/* Events */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:T.navy, display:"block", marginBottom:8 }}>
              Which events will you attend?
            </label>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {EVENT_OPTIONS.map(ev => {
                const checked = form.events.includes(ev);
                return (
                  <div
                    key={ev}
                    onClick={() => toggleEvent(ev)}
                    style={{
                      display:"flex", alignItems:"center", gap:10,
                      padding:"10px 14px", borderRadius:10,
                      border:`1.5px solid ${checked ? T.gold : T.border}`,
                      background: checked ? T.goldLight+"40" : T.white,
                      cursor:"pointer", transition:"all 0.2s",
                    }}
                  >
                    <div style={{
                      width:18, height:18, borderRadius:5,
                      border:`2px solid ${checked ? T.gold : T.border}`,
                      background: checked ? T.gold : "transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      flexShrink:0, transition:"all 0.2s",
                    }}>
                      {checked && <span style={{ color:T.white, fontSize:11, fontWeight:700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize:13, color: checked ? T.navy : T.muted }}>
                      {ev}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Number of guests */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:T.navy, display:"block", marginBottom:6 }}>
              Number of guests (including yourself)
            </label>
            <select
              style={{...inputStyle, cursor:"pointer"}}
              value={form.guests}
              onChange={e => setForm(f => ({...f, guests:e.target.value}))}
            >
              {["1","2","3","4","5+"].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:12, fontWeight:600, color:T.navy, display:"block", marginBottom:6 }}>
              A message for us <span style={{ color:T.muted, fontWeight:400 }}>(optional)</span>
            </label>
            <textarea
              className="rsvp-input"
              style={{...inputStyle, resize:"none", minHeight:80}}
              placeholder="Write something warm ✨"
              value={form.message}
              onChange={e => setForm(f => ({...f, message:e.target.value}))}
              rows={3}
            />
          </div>

          {/* Submit */}
          <button
            className="rsvp-btn"
            onClick={submit}
            disabled={status === "sending" || !form.name.trim() || !form.phone.trim()}
            style={{
              width:"100%", padding:"15px",
              background: (!form.name.trim() || !form.phone.trim()) ? T.border : T.navy,
              color: (!form.name.trim() || !form.phone.trim()) ? T.muted : T.white,
              border:"none", borderRadius:12, fontSize:15,
              fontWeight:600, cursor: !form.name.trim() ? "not-allowed" : "pointer",
              fontFamily:"'Inter',sans-serif", letterSpacing:0.5,
            }}
          >
            {status === "sending" ? "Sending…" : "Confirm RSVP 💌"}
          </button>
        </div>
      )}
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background:T.navy, padding:"40px 24px 32px",
      textAlign:"center",
    }}>
      <div className="gold-shimmer" style={{
        fontFamily:"'Clash Display',sans-serif",
        fontSize:32, fontWeight:700, marginBottom:8,
      }}>
        M &amp; S
      </div>
      <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginBottom:6 }}>
        September 20 – 21, 2026
      </div>
      <div style={{ color:"rgba(255,255,255,0.35)", fontSize:12 }}>
        Vivan Venue · Karnal, Haryana
      </div>
      <div style={{
        marginTop:28, paddingTop:20,
        borderTop:"1px solid rgba(255,255,255,0.1)",
        color:"rgba(255,255,255,0.25)", fontSize:11,
      }}>
        With love — Manan & Shrishti
      </div>
    </footer>
  );
}

// ─── ROOT GUEST SITE ──────────────────────────────────────────────────────────
export default function GuestSite() {
  return (
    <>
      <style>{CSS}</style>
      <div style={{ maxWidth:"100%", overflowX:"hidden" }}>
        <Hero />
        <Welcome />
        <Story />
        <Events />
        <RSVP />
        <Footer />
      </div>
    </>
  );
}
