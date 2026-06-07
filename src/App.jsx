import couplePhoto from "./couplePhoto.js";
import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  cream: "#FAF7F2", blush: "#F0D9D0", rose: "#D4A5A0",
  dusty: "#C48B84", gold: "#C9A96E", goldLight: "#E8D5B0",
  navy: "#1E2A4A", navyMid: "#2E3F6F", charcoal: "#2C2C2C",
  muted: "#8A7F78", white: "#FFFFFF", border: "#EDE0D8",
  success: "#7BAE8E", warn: "#E8B96A", danger: "#D4756B",
};

// ─── WEDDING DATE ─────────────────────────────────────────────────────────────
const WEDDING_DATE = new Date("2026-09-21T00:00:00");

function getDaysLeft() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(WEDDING_DATE.getFullYear(), WEDDING_DATE.getMonth(), WEDDING_DATE.getDate());
  return Math.max(0, Math.ceil((target - today) / 86400000));
}

// ─── FONTS ────────────────────────────────────────────────────────────────────
const FONT_INJECT = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html, body { font-family: 'Inter', sans-serif; background: #FAF7F2; color: #2C2C2C; overscroll-behavior: none; }
input, select, textarea, button { font-family: 'Inter', sans-serif; }
::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes slowZoom {
  from { transform: scale(1); }
  to   { transform: scale(1.06); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}
@keyframes tickIn {
  0%   { transform: translateY(-8px); opacity: 0; }
  100% { transform: translateY(0);    opacity: 1; }
}

.hero-photo {
  animation: slowZoom 12s ease-in-out infinite alternate;
}
.fade-up-1 { animation: fadeUp 0.7s ease forwards; }
.fade-up-2 { animation: fadeUp 0.7s 0.15s ease forwards; opacity: 0; }
.fade-up-3 { animation: fadeUp 0.7s 0.30s ease forwards; opacity: 0; }
.fade-up-4 { animation: fadeUp 0.7s 0.45s ease forwards; opacity: 0; }
.fade-up-5 { animation: fadeUp 0.7s 0.60s ease forwards; opacity: 0; }
.tick-in   { animation: tickIn 0.3s ease forwards; }

.gold-shimmer {
  background: linear-gradient(90deg, #C9A96E 0%, #F0D9A0 40%, #C9A96E 60%, #E8D5B0 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}
`;

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INIT_TASKS = [
  { id:1, text:"Book makeup artist", done:false, cat:"Beauty", priority:"high" },
  { id:2, text:"Finalise wedding outfit", done:true,  cat:"Outfits", priority:"high" },
  { id:3, text:"Book DJ for Sangeet", done:false, cat:"Entertainment", priority:"medium" },
  { id:4, text:"Send invitations", done:false, cat:"Guests", priority:"high" },
  { id:5, text:"Confirm catering menu", done:true, cat:"Food", priority:"medium" },
  { id:6, text:"Book florist", done:false, cat:"Decor", priority:"medium" },
  { id:7, text:"Dubai pre-wedding shoot", done:false, cat:"Photography", priority:"high" },
  { id:8, text:"Book hotel rooms (80)", done:true, cat:"Logistics", priority:"high" },
];

const INIT_BUDGET = {
  total: 5000000,
  items: [
    { id:1, cat:"Venue",        name:"Vivan Venue",         budget:1000000, spent:1000000 },
    { id:2, cat:"Photography",  name:"Delhi Photo Studio",  budget:300000,  spent:50000  },
    { id:3, cat:"Catering",     name:"TBD",                 budget:1500000, spent:0      },
    { id:4, cat:"Decor",        name:"TBD",                 budget:600000,  spent:0      },
    { id:5, cat:"Outfits",      name:"Bride + Groom",       budget:400000,  spent:200000 },
    { id:6, cat:"Entertainment","name":"DJ + Performers",   budget:200000,  spent:0      },
    { id:7, cat:"Invitations",  name:"Design + Print",      budget:50000,   spent:0      },
    { id:8, cat:"Misc",         name:"Buffer",              budget:950000,  spent:0      },
  ]
};

const INIT_VENDORS = [
  { id:1, cat:"Venue",       name:"Vivan Venue",        contact:"",  status:"confirmed", notes:"10L paid" },
  { id:2, cat:"Photography", name:"Delhi Photo Studio", contact:"",  status:"confirmed", notes:"" },
  { id:3, cat:"DJ",          name:"TBD",                contact:"",  status:"searching", notes:"" },
  { id:4, cat:"Florist",     name:"TBD",                contact:"",  status:"searching", notes:"" },
  { id:5, cat:"Catering",    name:"TBD",                contact:"",  status:"searching", notes:"" },
];

const INIT_GUESTS = [
  { id:1, sno:1, name:"Example Guest", from:"Delhi", side:"Groom", fn:"Wedding", hotel:"", rsvp:"pending", notes:"" },
];

const INIT_FAMILY = [
  { id:1, side:"Groom", name:"Dad", role:"Captain – Logistics", tasks:["Vendor payments","Hotel coordination"], phone:"" },
  { id:2, side:"Groom", name:"Mom", role:"Captain – Decor",     tasks:["Flower arrangements","Stage setup"],   phone:"" },
  { id:3, side:"Bride", name:"Dad", role:"Captain – Guests",    tasks:["Guest list","Seating plan"],           phone:"" },
  { id:4, side:"Bride", name:"Mom", role:"Captain – Beauty",    tasks:["Makeup artists","Mehendi"],            phone:"" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");
function useLocalState(key, init) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [v, key]);
  return [v, setV];
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"home",    icon:"🏠", label:"Home"    },
  { id:"tasks",   icon:"✅", label:"Tasks"   },
  { id:"budget",  icon:"💰", label:"Budget"  },
  { id:"vendors", icon:"🤝", label:"Vendors" },
  { id:"guests",  icon:"👥", label:"Guests"  },
  { id:"family",  icon:"👨‍👩‍👧", label:"Family"  },
  { id:"photos",  icon:"📸", label:"Photos"  },
];

// ─── COUNTDOWN HOOK ───────────────────────────────────────────────────────────
function useCountdown() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    const diff = Math.max(0, WEDDING_DATE - now);
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, WEDDING_DATE - now);
      setTime({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: HOME
// ═══════════════════════════════════════════════════════════════════════════════
function Home({ tasks, budget, vendors, guests }) {
  const { days, hours, minutes, seconds } = useCountdown();
  const [prevSec, setPrevSec] = useState(seconds);
  const [secKey, setSecKey] = useState(0);

  useEffect(() => {
    if (seconds !== prevSec) { setSecKey(k => k + 1); setPrevSec(seconds); }
  }, [seconds]);

  // Live stats
  const tasksDone   = tasks.filter(t => t.done).length;
  const totalTasks  = tasks.length;
  const totalBudget = budget.total;
  const totalSpent  = budget.items.reduce((s, i) => s + i.spent, 0);
  const vendorConf  = vendors.filter(v => v.status === "confirmed").length;
  const totalGuests = guests.length;

  const SCHEDULE = [
    {
      day: "Day 1", date: "September 20, 2026", color: T.blush,
      events: [
        { name: "Mehendi", time: "1:00 PM – 4:00 PM", icon: "🌿", note: "Tentative" },
        { name: "Sagan + Ring Ceremony + Ladies Sangeet", time: "7:00 PM Onwards", icon: "💍", note: "Tentative" },
      ]
    },
    {
      day: "Day 2", date: "September 21, 2026", color: T.goldLight,
      events: [
        { name: "Haldi", time: "Morning", icon: "🌼", note: "Tentative" },
        { name: "Sehra Bandi", time: "Evening", icon: "🌺", note: "Tentative" },
        {
          name: "💒 Wedding", time: "", icon: "", note: "", isWeddingGroup: true,
          sub: [
            { name: "Baraat", time: "~7:00 PM", icon: "🎺" },
            { name: "Wedding Ceremony", time: "~9:00 PM Onwards", icon: "🔥" },
          ]
        },
      ]
    },
  ];

  return (
    <div style={{ paddingBottom: 100 }}>

      {/* ── HERO SECTION ── */}
      <div style={{
        position: "relative", width: "100%", height: 480,
        overflow: "hidden", background: T.navy,
      }}>
        {/* Animated photo */}
        <img
          className="hero-photo"
          src={couplePhoto}
          alt="Manan & Shrishti"
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            objectPosition: "center top",
            transformOrigin: "center center",
          }}
          onError={e => { e.target.style.display = "none"; }}
        />

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(30,42,74,0.15) 0%, rgba(30,42,74,0.3) 50%, rgba(30,42,74,0.85) 100%)",
        }} />

        {/* Text overlay */}
        <div style={{
          position: "absolute", bottom: 32, left: 0, right: 0,
          textAlign: "center", padding: "0 24px",
        }}>
          <div className="fade-up-1" style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: 13, fontWeight: 500, letterSpacing: 4,
            color: T.goldLight, marginBottom: 8, textTransform: "uppercase",
          }}>
            Manan & Shrishti
          </div>
          <div className="fade-up-2 gold-shimmer" style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: 36, fontWeight: 700, lineHeight: 1.1,
            marginBottom: 6,
          }}>
            The Big Day
          </div>
          <div className="fade-up-3" style={{
            color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 400,
            letterSpacing: 1,
          }}>
            September 20–21, 2026 · Vivan, Karnal
          </div>
        </div>

        {/* Floating hearts */}
        <div style={{
          position: "absolute", top: 20, right: 20,
          fontSize: 22, animation: "float 3s ease-in-out infinite",
        }}>💫</div>
      </div>

      {/* ── LIVE COUNTDOWN ── */}
      <div className="fade-up-4" style={{
        margin: "0 16px",
        background: T.navy,
        borderRadius: "0 0 20px 20px",
        padding: "20px 16px 18px",
        textAlign: "center",
      }}>
        <div style={{ color: T.goldLight, fontSize: 11, letterSpacing: 3, marginBottom: 14, textTransform: "uppercase" }}>
          Counting Down
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {[
            { label: "Days",    val: days },
            { label: "Hours",   val: hours },
            { label: "Mins",    val: minutes },
            { label: "Secs",    val: seconds, animate: true, key: secKey },
          ].map(({ label, val, animate, key }) => (
            <div key={label} style={{
              flex: 1, background: "rgba(255,255,255,0.07)",
              borderRadius: 12, padding: "12px 4px",
              border: `1px solid rgba(201,169,110,0.2)`,
            }}>
              <div
                key={animate ? key : undefined}
                className={animate ? "tick-in" : undefined}
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 28, fontWeight: 700, color: T.white, lineHeight: 1,
                }}
              >
                {String(val).padStart(2, "0")}
              </div>
              <div style={{ color: T.gold, fontSize: 10, marginTop: 4, letterSpacing: 1 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK STATS ── */}
      <div className="fade-up-5" style={{ padding: "20px 16px 0" }}>
        <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
          Live Overview
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Tasks Done",      val: `${tasksDone}/${totalTasks}`,  icon: "✅", color: T.success },
            { label: "Budget Used",     val: fmt(totalSpent),               icon: "💰", color: T.gold    },
            { label: "Vendors Locked",  val: `${vendorConf}/${vendors.length}`, icon: "🤝", color: T.dusty },
            { label: "Guests Listed",   val: totalGuests,                   icon: "👥", color: T.navyMid },
          ].map(({ label, val, icon, color }) => (
            <div key={label} style={{
              background: T.white, borderRadius: 14,
              padding: "14px 14px", border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: color + "20", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>
                {icon}
              </div>
              <div>
                <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 20, fontWeight: 700, color: T.charcoal }}>
                  {val}
                </div>
                <div style={{ fontSize: 11, color: T.muted }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FUNCTION SCHEDULE ── */}
      <div style={{ padding: "24px 16px 0" }}>
        <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
          Function Schedule
        </div>

        {SCHEDULE.map((day) => (
          <div key={day.day} style={{
            marginBottom: 16,
            background: T.white,
            borderRadius: 18,
            overflow: "hidden",
            border: `1px solid ${T.border}`,
          }}>
            {/* Day Header */}
            <div style={{
              background: day.color,
              padding: "12px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 16, fontWeight: 700, color: T.navy }}>
                  {day.day}
                </div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>{day.date}</div>
              </div>
              <div style={{ fontSize: 20 }}>
                {day.day === "Day 1" ? "🌸" : "👑"}
              </div>
            </div>

            {/* Events */}
            <div style={{ padding: "8px 0" }}>
              {day.events.map((ev, i) => (
                ev.isWeddingGroup ? (
                  <div key={i}>
                    {/* Wedding group header */}
                    <div style={{
                      margin: "6px 12px",
                      background: `linear-gradient(135deg, ${T.navy}, ${T.navyMid})`,
                      borderRadius: 12, padding: "10px 14px",
                    }}>
                      <div style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 15, fontWeight: 700, color: T.goldLight,
                        marginBottom: 8,
                      }}>
                        💒 Wedding
                      </div>
                      {ev.sub.map((s, j) => (
                        <div key={j} style={{
                          display: "flex", alignItems: "center",
                          gap: 10, paddingTop: j > 0 ? 8 : 0,
                          borderTop: j > 0 ? "1px solid rgba(255,255,255,0.1)" : "none",
                        }}>
                          <span style={{ fontSize: 16 }}>{s.icon}</span>
                          <div>
                            <div style={{ color: T.white, fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                            <div style={{ color: T.gold, fontSize: 11, marginTop: 1 }}>{s.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div key={i} style={{
                    display: "flex", alignItems: "center",
                    padding: "10px 16px", gap: 12,
                    borderBottom: i < day.events.length - 1 ? `1px solid ${T.border}` : "none",
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: T.blush + "80",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, flexShrink: 0,
                    }}>
                      {ev.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: T.charcoal }}>{ev.name}</div>
                      <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                        {ev.time} {ev.note && <span style={{ color: T.rose }}>· {ev.note}</span>}
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── VENUE CARD ── */}
      <div style={{ padding: "0 16px 8px" }}>
        <div style={{
          background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 100%)`,
          borderRadius: 18, padding: "18px 20px",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{ fontSize: 32 }}>🏛️</div>
          <div>
            <div style={{ color: T.goldLight, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Venue</div>
            <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 20, fontWeight: 700, color: T.white, marginTop: 2 }}>
              Vivan, Karnal
            </div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 }}>
              Haryana, India
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: TASKS
// ═══════════════════════════════════════════════════════════════════════════════
function Tasks({ tasks, setTasks }) {
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState({ text: "", cat: "Misc", priority: "medium" });
  const [filter, setFilter] = useState("All");

  const CATS = ["All", "Beauty", "Outfits", "Entertainment", "Guests", "Food", "Decor", "Photography", "Logistics", "Misc"];
  const PRIO_C = { high: T.danger, medium: T.warn, low: T.success };

  const filtered = filter === "All" ? tasks : tasks.filter(t => t.cat === filter);
  const done = tasks.filter(t => t.done).length;
  const pct = Math.round((done / tasks.length) * 100) || 0;

  const toggle = (id) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const del = (id) => setTasks(ts => ts.filter(t => t.id !== id));
  const add = () => {
    if (!newTask.text.trim()) return;
    setTasks(ts => [...ts, { ...newTask, id: Date.now(), done: false }]);
    setNewTask({ text: "", cat: "Misc", priority: "medium" });
    setAdding(false);
  };

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 22, fontWeight: 700 }}>Tasks</div>
          <div style={{ color: T.muted, fontSize: 13 }}>{done}/{tasks.length} completed · {pct}%</div>
        </div>
        <button onClick={() => setAdding(true)} style={{
          background: T.navy, color: T.white, border: "none", borderRadius: 12,
          padding: "10px 18px", fontWeight: 600, fontSize: 14, cursor: "pointer",
        }}>+ Add</button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: T.border, borderRadius: 99, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: `linear-gradient(90deg, ${T.rose}, ${T.gold})`, borderRadius: 99, transition: "width 0.4s" }} />
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 12 }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "6px 14px", borderRadius: 99, border: "none", cursor: "pointer",
            background: filter === c ? T.navy : T.white, color: filter === c ? T.white : T.muted,
            fontSize: 12, fontWeight: 500, whiteSpace: "nowrap",
            border: `1px solid ${filter === c ? T.navy : T.border}`,
          }}>{c}</button>
        ))}
      </div>

      {/* Add form */}
      {adding && (
        <div style={{ background: T.white, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${T.border}` }}>
          <input value={newTask.text} onChange={e => setNewTask({ ...newTask, text: e.target.value })}
            placeholder="Task description..." autoFocus
            style={{ width: "100%", border: "none", outline: "none", fontSize: 15, background: "transparent", marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select value={newTask.cat} onChange={e => setNewTask({ ...newTask, cat: e.target.value })}
              style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 13 }}>
              {CATS.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
              style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 13 }}>
              {["high", "medium", "low"].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={add} style={{ flex: 1, padding: 10, background: T.navy, color: T.white, border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>Add Task</button>
            <button onClick={() => setAdding(false)} style={{ flex: 1, padding: 10, background: T.cream, color: T.muted, border: `1px solid ${T.border}`, borderRadius: 10, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Task list */}
      {filtered.map(t => (
        <div key={t.id} style={{
          background: T.white, borderRadius: 14, padding: "14px 16px", marginBottom: 8,
          display: "flex", alignItems: "center", gap: 12, border: `1px solid ${T.border}`,
          opacity: t.done ? 0.6 : 1,
        }}>
          <div onClick={() => toggle(t.id)} style={{
            width: 22, height: 22, borderRadius: 6, border: `2px solid ${t.done ? T.success : T.border}`,
            background: t.done ? T.success : "transparent", cursor: "pointer", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center", color: T.white, fontSize: 13,
          }}>
            {t.done && "✓"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, textDecoration: t.done ? "line-through" : "none", color: T.charcoal }}>{t.text}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: 11, color: T.muted, background: T.cream, padding: "2px 8px", borderRadius: 99 }}>{t.cat}</span>
              <span style={{ fontSize: 11, color: PRIO_C[t.priority], background: PRIO_C[t.priority] + "20", padding: "2px 8px", borderRadius: 99 }}>{t.priority}</span>
            </div>
          </div>
          <div onClick={() => del(t.id)} style={{ color: T.rose, cursor: "pointer", fontSize: 18, padding: 4 }}>×</div>
        </div>
      ))}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: BUDGET
// ═══════════════════════════════════════════════════════════════════════════════
function Budget({ budget, setBudget }) {
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({ cat: "Misc", name: "", budget: "", spent: "" });

  const totalSpent  = budget.items.reduce((s, i) => s + i.spent, 0);
  const totalBudget = budget.total;
  const remaining   = totalBudget - totalSpent;
  const pct         = Math.round((totalSpent / totalBudget) * 100);

  const update = (id, field, val) => {
    setBudget(b => ({ ...b, items: b.items.map(i => i.id === id ? { ...i, [field]: Number(val) || 0 } : i) }));
  };
  const del = (id) => setBudget(b => ({ ...b, items: b.items.filter(i => i.id !== id) }));
  const add = () => {
    if (!newItem.name) return;
    setBudget(b => ({ ...b, items: [...b.items, { ...newItem, id: Date.now(), budget: Number(newItem.budget) || 0, spent: Number(newItem.spent) || 0 }] }));
    setNewItem({ cat: "Misc", name: "", budget: "", spent: "" });
    setAdding(false);
  };

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Budget</div>
      <div style={{ color: T.muted, fontSize: 13, marginBottom: 16 }}>Total: {fmt(totalBudget)}</div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
        {[
          { label: "Spent",     val: fmt(totalSpent),  color: T.danger },
          { label: "Remaining", val: fmt(remaining),   color: T.success },
          { label: "Used",      val: pct + "%",        color: T.gold },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background: T.white, borderRadius: 14, padding: "14px 10px", textAlign: "center", border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 16, fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ height: 8, background: T.border, borderRadius: 99, marginBottom: 18, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: pct > 85 ? T.danger : T.gold, borderRadius: 99, transition: "width 0.4s" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Line Items</div>
        <button onClick={() => setAdding(true)} style={{ background: T.navy, color: T.white, border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add</button>
      </div>

      {adding && (
        <div style={{ background: T.white, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${T.border}` }}>
          <input placeholder="Item name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
            style={{ width: "100%", border: "none", outline: "none", fontSize: 14, marginBottom: 8, background: "transparent" }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input placeholder="Budget ₹" value={newItem.budget} onChange={e => setNewItem({ ...newItem, budget: e.target.value })} type="number"
              style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 13 }} />
            <input placeholder="Spent ₹" value={newItem.spent} onChange={e => setNewItem({ ...newItem, spent: e.target.value })} type="number"
              style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 13 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={add} style={{ flex: 1, padding: 10, background: T.navy, color: T.white, border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>Add</button>
            <button onClick={() => setAdding(false)} style={{ flex: 1, padding: 10, background: T.cream, color: T.muted, border: `1px solid ${T.border}`, borderRadius: 10, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {budget.items.map(item => {
        const itemPct = item.budget > 0 ? Math.round((item.spent / item.budget) * 100) : 0;
        return (
          <div key={item.id} style={{ background: T.white, borderRadius: 14, padding: "14px 16px", marginBottom: 8, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{item.cat}</div>
              </div>
              <div onClick={() => del(item.id)} style={{ color: T.rose, cursor: "pointer", fontSize: 18 }}>×</div>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 3 }}>Budget</div>
                <input value={item.budget} onChange={e => update(item.id, "budget", e.target.value)} type="number"
                  style={{ width: "100%", border: "none", borderBottom: `1px solid ${T.border}`, outline: "none", fontSize: 14, fontWeight: 600, background: "transparent", color: T.charcoal }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 3 }}>Spent</div>
                <input value={item.spent} onChange={e => update(item.id, "spent", e.target.value)} type="number"
                  style={{ width: "100%", border: "none", borderBottom: `1px solid ${T.border}`, outline: "none", fontSize: 14, fontWeight: 600, background: "transparent", color: itemPct > 100 ? T.danger : T.charcoal }} />
              </div>
            </div>
            <div style={{ height: 4, background: T.border, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: Math.min(itemPct, 100) + "%", background: itemPct > 100 ? T.danger : itemPct > 75 ? T.warn : T.success, borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{itemPct}% used · {fmt(item.budget - item.spent)} left</div>
          </div>
        );
      })}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: VENDORS
// ═══════════════════════════════════════════════════════════════════════════════
function Vendors({ vendors, setVendors }) {
  const [adding, setAdding] = useState(false);
  const [nv, setNv] = useState({ cat: "Venue", name: "", contact: "", status: "searching", notes: "" });

  const STATUS_C = { confirmed: T.success, searching: T.warn, shortlisted: T.gold };
  const STATUS_L = { confirmed: "Confirmed ✓", searching: "Searching...", shortlisted: "Shortlisted" };
  const CATS = ["Venue","Photography","Catering","Decor","DJ","Makeup","Transport","Pandit","Misc"];

  const add = () => {
    if (!nv.name) return;
    setVendors(vs => [...vs, { ...nv, id: Date.now() }]);
    setNv({ cat: "Venue", name: "", contact: "", status: "searching", notes: "" });
    setAdding(false);
  };
  const upd = (id, field, val) => setVendors(vs => vs.map(v => v.id === id ? { ...v, [field]: val } : v));
  const del = (id) => setVendors(vs => vs.filter(v => v.id !== id));

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 22, fontWeight: 700 }}>Vendors</div>
          <div style={{ color: T.muted, fontSize: 13 }}>{vendors.filter(v => v.status === "confirmed").length} confirmed</div>
        </div>
        <button onClick={() => setAdding(true)} style={{ background: T.navy, color: T.white, border: "none", borderRadius: 12, padding: "10px 18px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>+ Add</button>
      </div>

      {adding && (
        <div style={{ background: T.white, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${T.border}` }}>
          <input placeholder="Vendor name" value={nv.name} onChange={e => setNv({ ...nv, name: e.target.value })}
            style={{ width: "100%", border: "none", borderBottom: `1px solid ${T.border}`, outline: "none", fontSize: 15, marginBottom: 10, background: "transparent", paddingBottom: 6 }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <select value={nv.cat} onChange={e => setNv({ ...nv, cat: e.target.value })}
              style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 13 }}>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={nv.status} onChange={e => setNv({ ...nv, status: e.target.value })}
              style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 13 }}>
              {["searching","shortlisted","confirmed"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <input placeholder="Contact / phone" value={nv.contact} onChange={e => setNv({ ...nv, contact: e.target.value })}
            style={{ width: "100%", padding: "8px 0", border: "none", borderBottom: `1px solid ${T.border}`, outline: "none", fontSize: 13, background: "transparent", marginBottom: 8 }} />
          <input placeholder="Notes" value={nv.notes} onChange={e => setNv({ ...nv, notes: e.target.value })}
            style={{ width: "100%", padding: "8px 0", border: "none", borderBottom: `1px solid ${T.border}`, outline: "none", fontSize: 13, background: "transparent", marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={add} style={{ flex: 1, padding: 10, background: T.navy, color: T.white, border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>Save</button>
            <button onClick={() => setAdding(false)} style={{ flex: 1, padding: 10, background: T.cream, color: T.muted, border: `1px solid ${T.border}`, borderRadius: 10, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {vendors.map(v => (
        <div key={v.id} style={{ background: T.white, borderRadius: 14, padding: "14px 16px", marginBottom: 8, border: `1px solid ${T.border}`, borderLeft: `4px solid ${STATUS_C[v.status] || T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{v.name}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{v.cat}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select value={v.status} onChange={e => upd(v.id, "status", e.target.value)}
                style={{ fontSize: 11, padding: "4px 8px", borderRadius: 8, border: `1px solid ${STATUS_C[v.status]}`, color: STATUS_C[v.status], background: STATUS_C[v.status] + "15", cursor: "pointer", outline: "none" }}>
                {["searching","shortlisted","confirmed"].map(s => <option key={s}>{s}</option>)}
              </select>
              <div onClick={() => del(v.id)} style={{ color: T.rose, cursor: "pointer", fontSize: 18 }}>×</div>
            </div>
          </div>
          {v.contact && <div style={{ fontSize: 12, color: T.muted, marginTop: 6 }}>📞 {v.contact}</div>}
          {v.notes && <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>📝 {v.notes}</div>}
        </div>
      ))}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: GUESTS
// ═══════════════════════════════════════════════════════════════════════════════
function Guests({ guests, setGuests }) {
  const [tab, setTab]       = useState("Groom");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [ng, setNg]         = useState({ name:"", from:"", side:"Groom", fn:"Wedding", hotel:"", rsvp:"pending", notes:"" });
  const fileRef             = useRef();

  const RSVP_C = { confirmed: T.success, pending: T.warn, declined: T.danger };
  const FNS    = ["Wedding","Sangeet","Mehendi","Haldi"];

  const sideGuests   = guests.filter(g => g.side === tab);
  const filtered     = sideGuests.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));
  const totalGuests  = guests.length;
  const confirmed    = guests.filter(g => g.rsvp === "confirmed").length;
  const pending      = guests.filter(g => g.rsvp === "pending").length;
  const declined     = guests.filter(g => g.rsvp === "declined").length;

  const addGuest = () => {
    if (!ng.name.trim()) return;
    setGuests(gs => [...gs, { ...ng, id: Date.now(), sno: gs.length + 1 }]);
    setNg({ name:"", from:"", side:"Groom", fn:"Wedding", hotel:"", rsvp:"pending", notes:"" });
    setAdding(false);
  };
  const del = (id) => setGuests(gs => gs.filter(g => g.id !== id));
  const upd = (id, field, val) => setGuests(gs => gs.map(g => g.id === id ? { ...g, [field]: val } : g));

  const uploadExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(new Uint8Array(ev.target.result), { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws);
        const parsed = rows.map((r, i) => ({
          id: Date.now() + i, sno: i + 1,
          name:  r["Name"] || r["name"] || "",
          from:  r["From"] || r["from"] || "",
          side:  r["Side"] || r["side"] || "Groom",
          fn:    r["Function"] || r["function"] || "Wedding",
          hotel: r["Hotel"] || r["hotel"] || "",
          rsvp:  r["RSVP"] || r["rsvp"] || "pending",
          notes: r["Notes"] || r["notes"] || "",
        })).filter(g => g.name);
        setGuests(parsed);
      } catch {}
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{ Name:"", From:"", Side:"Groom", Function:"Wedding", Hotel:"", RSVP:"pending", Notes:"" }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Guests");
    XLSX.writeFile(wb, "guests_template.xlsx");
  };

  const exportGuests = () => {
    const ws = XLSX.utils.json_to_sheet(guests.map(g => ({ Name:g.name, From:g.from, Side:g.side, Function:g.fn, Hotel:g.hotel, RSVP:g.rsvp, Notes:g.notes })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Guests");
    XLSX.writeFile(wb, "guest_list.xlsx");
  };

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Guests</div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { label:"Total",     val: totalGuests, color: T.navy    },
          { label:"Confirmed", val: confirmed,   color: T.success },
          { label:"Pending",   val: pending,     color: T.warn    },
          { label:"Declined",  val: declined,    color: T.danger  },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background: T.white, borderRadius: 12, padding: "10px 8px", textAlign: "center", border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 20, fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: 10, color: T.muted }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Actions row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setAdding(true)} style={{ flex: 1, padding: "9px 0", background: T.navy, color: T.white, border: "none", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>+ Add</button>
        <button onClick={() => fileRef.current.click()} style={{ flex: 1, padding: "9px 0", background: T.white, color: T.navy, border: `1px solid ${T.border}`, borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>📤 Upload</button>
        <button onClick={exportGuests} style={{ flex: 1, padding: "9px 0", background: T.white, color: T.navy, border: `1px solid ${T.border}`, borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>📥 Export</button>
        <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={uploadExcel} />
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guests..."
        style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: `1px solid ${T.border}`, fontSize: 14, outline: "none", background: T.white, marginBottom: 12 }} />

      {/* Side tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["Groom","Bride"].map(s => (
          <button key={s} onClick={() => setTab(s)} style={{
            flex: 1, padding: "10px", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 600, fontSize: 14,
            background: tab === s ? T.navy : T.white, color: tab === s ? T.white : T.muted,
            border: `1px solid ${tab === s ? T.navy : T.border}`,
          }}>
            {s} Side ({guests.filter(g => g.side === s).length})
          </button>
        ))}
      </div>

      {/* Add form */}
      {adding && (
        <div style={{ background: T.white, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${T.border}` }}>
          <input placeholder="Guest name *" value={ng.name} onChange={e => setNg({ ...ng, name: e.target.value })} autoFocus
            style={{ width: "100%", border: "none", borderBottom: `1px solid ${T.border}`, outline: "none", fontSize: 15, marginBottom: 10, background: "transparent", paddingBottom: 6 }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input placeholder="From (city)" value={ng.from} onChange={e => setNg({ ...ng, from: e.target.value })}
              style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 13 }} />
            <select value={ng.side} onChange={e => setNg({ ...ng, side: e.target.value })}
              style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 13 }}>
              <option>Groom</option><option>Bride</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <select value={ng.fn} onChange={e => setNg({ ...ng, fn: e.target.value })}
              style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 13 }}>
              {FNS.map(f => <option key={f}>{f}</option>)}
            </select>
            <select value={ng.rsvp} onChange={e => setNg({ ...ng, rsvp: e.target.value })}
              style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 13 }}>
              <option>pending</option><option>confirmed</option><option>declined</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addGuest} style={{ flex: 1, padding: 10, background: T.navy, color: T.white, border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>Add Guest</button>
            <button onClick={() => setAdding(false)} style={{ flex: 1, padding: 10, background: T.cream, color: T.muted, border: `1px solid ${T.border}`, borderRadius: 10, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Guest list */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", color: T.muted, padding: "40px 0", fontSize: 14 }}>
          No guests yet. Add manually or upload Excel.
          <br /><button onClick={downloadTemplate} style={{ marginTop: 10, padding: "8px 16px", background: T.cream, border: `1px solid ${T.border}`, borderRadius: 10, cursor: "pointer", fontSize: 13 }}>Download Template</button>
        </div>
      )}
      {filtered.map(g => (
        <div key={g.id} style={{
          background: T.white, borderRadius: 14, padding: "12px 16px", marginBottom: 8,
          border: `1px solid ${T.border}`, borderLeft: `4px solid ${g.side === "Groom" ? T.navy : T.rose}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{g.name}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{g.from && `📍 ${g.from}  `}{g.fn}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select value={g.rsvp} onChange={e => upd(g.id, "rsvp", e.target.value)}
                style={{ fontSize: 11, padding: "4px 8px", borderRadius: 8, border: `1px solid ${RSVP_C[g.rsvp]}`, color: RSVP_C[g.rsvp], background: RSVP_C[g.rsvp] + "15", outline: "none", cursor: "pointer" }}>
                <option>pending</option><option>confirmed</option><option>declined</option>
              </select>
              <div onClick={() => del(g.id)} style={{ color: T.rose, cursor: "pointer", fontSize: 18 }}>×</div>
            </div>
          </div>
          {g.hotel && <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>🏨 {g.hotel}</div>}
        </div>
      ))}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: FAMILY
// ═══════════════════════════════════════════════════════════════════════════════
function Family({ family, setFamily }) {
  const [tab, setTab] = useState("Groom");
  const upd = (id, field, val) => setFamily(fs => fs.map(f => f.id === id ? { ...f, [field]: val } : f));
  const del = (id) => setFamily(fs => fs.filter(f => f.id !== id));
  const add = () => setFamily(fs => [...fs, { id: Date.now(), side: tab, name: "", role: "", tasks: [], phone: "" }]);

  const shown = family.filter(f => f.side === tab);

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Family Captains</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["Groom","Bride"].map(s => (
          <button key={s} onClick={() => setTab(s)} style={{
            flex: 1, padding: 10, border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 600, fontSize: 14,
            background: tab === s ? T.navy : T.white, color: tab === s ? T.white : T.muted,
            border: `1px solid ${tab === s ? T.navy : T.border}`,
          }}>{s} Side</button>
        ))}
      </div>
      <button onClick={add} style={{ width: "100%", padding: 12, background: T.white, border: `2px dashed ${T.border}`, borderRadius: 14, color: T.muted, fontSize: 14, cursor: "pointer", marginBottom: 12 }}>+ Add Captain</button>
      {shown.map(f => (
        <div key={f.id} style={{ background: T.white, borderRadius: 16, padding: "16px", marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <input value={f.name} onChange={e => upd(f.id, "name", e.target.value)} placeholder="Name"
              style={{ fontSize: 16, fontWeight: 700, border: "none", outline: "none", background: "transparent", flex: 1 }} />
            <div onClick={() => del(f.id)} style={{ color: T.rose, cursor: "pointer", fontSize: 18 }}>×</div>
          </div>
          <input value={f.role} onChange={e => upd(f.id, "role", e.target.value)} placeholder="Role / responsibility"
            style={{ width: "100%", fontSize: 13, color: T.muted, border: "none", outline: "none", background: "transparent", marginTop: 4 }} />
          <input value={f.phone} onChange={e => upd(f.id, "phone", e.target.value)} placeholder="Phone number"
            style={{ width: "100%", fontSize: 13, color: T.muted, border: "none", outline: "none", background: "transparent", marginTop: 4 }} />
          {f.tasks.length > 0 && (
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {f.tasks.map((t, i) => (
                <span key={i} style={{ fontSize: 11, background: T.cream, color: T.charcoal, padding: "4px 10px", borderRadius: 99, border: `1px solid ${T.border}` }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: PHOTOS
// ═══════════════════════════════════════════════════════════════════════════════
function Photos() {
  const [tab, setTab] = useState("wedding");

  const WEDDING_SHOTS = [
    "Baraat entry shot","Sehra closeup","Exchange of garlands (Jaimala)","Pheras — fire & couple",
    "Ring ceremony closeup","Sagan moments","Family formals — both sides","Couple portrait — golden hour",
    "Mehendi hands detail","Haldi — candid fun","Sangeet performances","First look",
    "Getting ready — groom","Getting ready — bride","Invitation & details flat lay",
  ];

  const DUBAI_CHECKLIST = [
    { cat:"Locations", items:["Burj Khalifa base","Dubai Frame","Desert dunes at sunset","JBR beachfront","Al Seef heritage district","Dubai Creek"] },
    { cat:"Outfits",   items:["Casual chic — 1 outfit","Traditional Indian — 1 outfit","Western formal — optional 3rd"] },
    { cat:"Props",     items:["Dupatta for wind shots","Sparklers for evening","Marigold garland"] },
    { cat:"Logistics", items:["Book photographer by July","Scout locations","Hair + makeup artist Dubai","Car rental for locations"] },
  ];

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Photography</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{id:"wedding",label:"Wedding Shots"},{id:"dubai",label:"Dubai Shoot"}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: 10, border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 600, fontSize: 13,
            background: tab === t.id ? T.navy : T.white, color: tab === t.id ? T.white : T.muted,
            border: `1px solid ${tab === t.id ? T.navy : T.border}`,
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "wedding" && (
        <div>
          <div style={{ color: T.muted, fontSize: 13, marginBottom: 12 }}>{WEDDING_SHOTS.length} must-have shots</div>
          {WEDDING_SHOTS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: T.white, borderRadius: 12, marginBottom: 6, border: `1px solid ${T.border}` }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: T.gold + "30", color: T.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 14 }}>{s}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "dubai" && (
        <div>
          <div style={{ background: `linear-gradient(135deg, ${T.navy}, ${T.navyMid})`, borderRadius: 16, padding: "16px", marginBottom: 16, color: T.white }}>
            <div style={{ fontSize: 11, color: T.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Pre-Wedding Shoot</div>
            <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 20, fontWeight: 700 }}>Dubai, UAE</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 2 }}>Mid-August 2026 · ~3 days</div>
          </div>
          {DUBAI_CHECKLIST.map(({ cat, items }) => (
            <div key={cat} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 8 }}>{cat}</div>
              {items.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: T.white, borderRadius: 12, marginBottom: 5, border: `1px solid ${T.border}` }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.gold, flexShrink: 0 }} />
                  <div style={{ fontSize: 13 }}>{item}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen,  setScreen]  = useState("home");
  const [tasks,   setTasks]   = useLocalState("wos_tasks",   INIT_TASKS);
  const [budget,  setBudget]  = useLocalState("wos_budget",  INIT_BUDGET);
  const [vendors, setVendors] = useLocalState("wos_vendors", INIT_VENDORS);
  const [guests,  setGuests]  = useLocalState("wos_guests",  INIT_GUESTS);
  const [family,  setFamily]  = useLocalState("wos_family",  INIT_FAMILY);

  const SCREENS = {
    home:    <Home    tasks={tasks} budget={budget} vendors={vendors} guests={guests} />,
    tasks:   <Tasks   tasks={tasks}   setTasks={setTasks} />,
    budget:  <Budget  budget={budget} setBudget={setBudget} />,
    vendors: <Vendors vendors={vendors} setVendors={setVendors} />,
    guests:  <Guests  guests={guests}  setGuests={setGuests} />,
    family:  <Family  family={family}  setFamily={setFamily} />,
    photos:  <Photos />,
  };

  return (
    <>
      <style>{FONT_INJECT}</style>
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: T.cream, position: "relative" }}>

        {/* Top bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100,
          background: T.cream,
          borderBottom: `1px solid ${T.border}`,
          padding: "14px 20px 10px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 18, fontWeight: 700, color: T.navy }}>
            Manan <span style={{ color: T.rose }}>♥</span> Shrishti
          </div>
          <div style={{ fontSize: 12, color: T.muted }}>{getDaysLeft()}d to go</div>
        </div>

        {/* Screen content */}
        <div style={{ flex: 1 }}>
          {SCREENS[screen]}
        </div>

        {/* Bottom nav */}
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 480,
          background: T.white,
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          paddingBottom: "env(safe-area-inset-bottom)",
          zIndex: 200,
        }}>
          {NAV.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setScreen(id)}
              style={{
                flex: 1, border: "none", background: "transparent", cursor: "pointer",
                padding: "10px 2px 8px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              }}
            >
              <div style={{ fontSize: screen === id ? 22 : 20, transition: "all 0.2s" }}>{icon}</div>
              <div style={{
                fontSize: 9, fontWeight: screen === id ? 700 : 400,
                color: screen === id ? T.navy : T.muted,
                letterSpacing: 0.3,
              }}>
                {label}
              </div>
              {screen === id && (
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.gold, marginTop: -1 }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

