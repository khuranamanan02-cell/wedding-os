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

const WEDDING_DATE = new Date("2026-09-21T00:00:00");

function getDaysLeft() {
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(WEDDING_DATE); target.setHours(0,0,0,0);
  return Math.max(0, Math.ceil((target - today) / 86400000));
}

// ─── FONTS + ANIMATIONS ───────────────────────────────────────────────────────
const FONT_INJECT = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
html,body{font-family:'Inter',sans-serif;background:#FAF7F2;color:#2C2C2C;overscroll-behavior:none;}
input,select,textarea,button{font-family:'Inter',sans-serif;}
::-webkit-scrollbar{display:none;}*{scrollbar-width:none;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes slowZoom{from{transform:scale(1)}to{transform:scale(1.06)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes tickIn{0%{transform:translateY(-8px);opacity:0}100%{transform:translateY(0);opacity:1}}
.hero-photo{animation:slowZoom 12s ease-in-out infinite alternate;}
.fade1{animation:fadeUp 0.6s ease forwards;}
.fade2{animation:fadeUp 0.6s 0.12s ease forwards;opacity:0;}
.fade3{animation:fadeUp 0.6s 0.24s ease forwards;opacity:0;}
.fade4{animation:fadeUp 0.6s 0.36s ease forwards;opacity:0;}
.fade5{animation:fadeUp 0.6s 0.48s ease forwards;opacity:0;}
.tick{animation:tickIn 0.3s ease forwards;}
.gold-shimmer{background:linear-gradient(90deg,#C9A96E 0%,#F0D9A0 40%,#C9A96E 60%,#E8D5B0 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite;}
.inline-edit{background:transparent;border:1px solid transparent;border-radius:6px;padding:2px 4px;outline:none;width:100%;font-family:inherit;font-size:inherit;color:inherit;cursor:pointer;}
.inline-edit:focus{background:rgba(255,255,255,0.95);border-color:#D4A5A0;cursor:text;padding:2px 6px;}
`;

// ─── INLINE EDIT COMPONENT ────────────────────────────────────────────────────
function IE({ value, onChange, placeholder = "Tap to edit…", style = {}, multiline = false }) {
  const [val, setVal] = useState(value);
  useEffect(() => { setVal(value); }, [value]);
  const commit = () => { if (val !== value) onChange(val); };
  const props = {
    className: "inline-edit",
    value: val,
    placeholder,
    onChange: e => setVal(e.target.value),
    onBlur: commit,
    onKeyDown: e => { if (!multiline && e.key === "Enter") { e.preventDefault(); e.target.blur(); } },
    style,
  };
  return multiline ? <textarea rows={2} {...props} style={{ ...props.style, resize: "none" }} /> : <input {...props} />;
}

// ─── BUDGET INPUT — commits on blur so totals update correctly ───────────────
function BudgetInput({ value, onCommit, style }) {
  const [val, setVal] = useState(String(value));
  useEffect(() => { setVal(String(value)); }, [value]);
  return (
    <input
      type="number"
      value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={() => onCommit(Number(val) || 0)}
      onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
      style={style}
    />
  );
}

// ─── LOCAL STORAGE HOOK ───────────────────────────────────────────────────────
function useLS(key, init) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [v, key]);
  return [v, setV];
}

// ─── COUNTDOWN HOOK ───────────────────────────────────────────────────────────
function useCountdown() {
  const calc = () => {
    const diff = Math.max(0, WEDDING_DATE - new Date());
    return { days: Math.floor(diff/86400000), hours: Math.floor(diff%86400000/3600000), minutes: Math.floor(diff%3600000/60000), seconds: Math.floor(diff%60000/1000) };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);
  return t;
}

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INIT_TASKS = [
  { id:1, text:"Book makeup artist", done:false, cat:"Beauty", priority:"high" },
  { id:2, text:"Finalise wedding outfit", done:true, cat:"Outfits", priority:"high" },
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
    { id:1, cat:"Venue",       name:"Vivan Venue",        budget:1000000, spent:1000000 },
    { id:2, cat:"Photography", name:"Delhi Photo Studio", budget:300000,  spent:50000  },
    { id:3, cat:"Catering",    name:"TBD",                budget:1500000, spent:0      },
    { id:4, cat:"Decor",       name:"TBD",                budget:600000,  spent:0      },
    { id:5, cat:"Outfits",     name:"Bride + Groom",      budget:400000,  spent:200000 },
    { id:6, cat:"Entertainment",name:"DJ + Performers",   budget:200000,  spent:0      },
    { id:7, cat:"Invitations", name:"Design + Print",     budget:50000,   spent:0      },
    { id:8, cat:"Misc",        name:"Buffer",             budget:950000,  spent:0      },
  ]
};

const INIT_VENDORS = [
  { id:1, cat:"Venue",       name:"Vivan Venue",        contact:"", status:"confirmed", notes:"10L paid" },
  { id:2, cat:"Photography", name:"Delhi Photo Studio", contact:"", status:"confirmed", notes:"" },
  { id:3, cat:"DJ",          name:"TBD",                contact:"", status:"searching", notes:"" },
  { id:4, cat:"Florist",     name:"TBD",                contact:"", status:"searching", notes:"" },
  { id:5, cat:"Catering",    name:"TBD",                contact:"", status:"searching", notes:"" },
];

const INIT_GUESTS = [
  { id:1, sno:1, name:"Example Guest", from:"Delhi", side:"Groom", fn:"Wedding", hotel:"", rsvp:"pending", notes:"" },
];

const INIT_FAMILY = [
  { id:1, side:"Groom", name:"Dad", role:"Captain – Logistics", tasks:"Vendor payments, Hotel coordination", phone:"" },
  { id:2, side:"Groom", name:"Mom", role:"Captain – Decor",     tasks:"Flower arrangements, Stage setup",   phone:"" },
  { id:3, side:"Bride", name:"Dad", role:"Captain – Guests",    tasks:"Guest list, Seating plan",           phone:"" },
  { id:4, side:"Bride", name:"Mom", role:"Captain – Beauty",    tasks:"Makeup artists, Mehendi",            phone:"" },
];

const NAV = [
  { id:"home",    icon:"🏠", label:"Home"    },
  { id:"tasks",   icon:"✅", label:"Tasks"   },
  { id:"budget",  icon:"💰", label:"Budget"  },
  { id:"vendors", icon:"🤝", label:"Vendors" },
  { id:"guests",  icon:"👥", label:"Guests"  },
  { id:"family",  icon:"👨‍👩‍👧", label:"Family"  },
  { id:"photos",  icon:"📸", label:"Photos"  },
];

const fmt = n => "₹" + Number(n).toLocaleString("en-IN");

// ═══════════════════════════════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════════════════════════════
function Home({ tasks, budget, vendors, guests }) {
  const { days, hours, minutes, seconds } = useCountdown();
  const [secKey, setSecKey] = useState(0);
  const prevSec = useRef(seconds);
  useEffect(() => { if (seconds !== prevSec.current) { setSecKey(k=>k+1); prevSec.current = seconds; } }, [seconds]);

  const tasksDone  = tasks.filter(t=>t.done).length;
  const totalSpent = budget.items.reduce((s,i)=>s+(parseFloat(i.spent)||0),0);
  const vendorConf = vendors.filter(v=>v.status==="confirmed").length;

  const SCHEDULE = [
    { day:"Day 1", date:"September 20, 2026", emoji:"🌸", color:T.blush,
      events:[
        { icon:"🌿", name:"Mehendi",                              time:"1:00 PM – 4:00 PM", note:"Tentative" },
        { icon:"💍", name:"Sagan + Ring Ceremony + Ladies Sangeet", time:"7:00 PM Onwards",  note:"Tentative" },
      ]
    },
    { day:"Day 2", date:"September 21, 2026", emoji:"👑", color:T.goldLight,
      events:[
        { icon:"🌼", name:"Haldi",       time:"Morning",          note:"Tentative" },
        { icon:"🌺", name:"Sehra Bandi", time:"Evening",          note:"Tentative" },
        { isWedding: true },
      ]
    },
  ];

  return (
    <div style={{ paddingBottom:100 }}>
      {/* Hero */}
      <div style={{ position:"relative", width:"100%", height:480, overflow:"hidden", background:T.navy }}>
        <img className="hero-photo" src={couplePhoto} alt="Manan & Shrishti"
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", transformOrigin:"center center" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(30,42,74,0.1) 0%,rgba(30,42,74,0.25) 50%,rgba(30,42,74,0.88) 100%)" }} />
        <div style={{ position:"absolute", bottom:32, left:0, right:0, textAlign:"center", padding:"0 24px" }}>
          <div className="fade1" style={{ fontFamily:"'Clash Display',sans-serif", fontSize:13, fontWeight:500, letterSpacing:4, color:T.goldLight, marginBottom:8, textTransform:"uppercase" }}>Manan & Shrishti</div>
          <div className="fade2 gold-shimmer" style={{ fontFamily:"'Clash Display',sans-serif", fontSize:36, fontWeight:700, lineHeight:1.1, marginBottom:6 }}>The Big Day</div>
          <div className="fade3" style={{ color:"rgba(255,255,255,0.75)", fontSize:13, letterSpacing:1 }}>September 20–21, 2026 · Vivan, Karnal</div>
        </div>
        <div style={{ position:"absolute", top:20, right:20, fontSize:22, animation:"float 3s ease-in-out infinite" }}>💫</div>
      </div>

      {/* Countdown */}
      <div className="fade4" style={{ margin:"0 16px", background:T.navy, borderRadius:"0 0 20px 20px", padding:"20px 16px 18px", textAlign:"center" }}>
        <div style={{ color:T.goldLight, fontSize:11, letterSpacing:3, marginBottom:14, textTransform:"uppercase" }}>Counting Down</div>
        <div style={{ display:"flex", justifyContent:"center", gap:8 }}>
          {[{label:"Days",val:days},{label:"Hours",val:hours},{label:"Mins",val:minutes},{label:"Secs",val:seconds,animate:true}].map(({label,val,animate})=>(
            <div key={label} style={{ flex:1, background:"rgba(255,255,255,0.07)", borderRadius:12, padding:"12px 4px", border:`1px solid rgba(201,169,110,0.2)` }}>
              <div key={animate?secKey:label} className={animate?"tick":undefined}
                style={{ fontFamily:"'Clash Display',sans-serif", fontSize:28, fontWeight:700, color:T.white, lineHeight:1 }}>
                {String(val).padStart(2,"0")}
              </div>
              <div style={{ color:T.gold, fontSize:10, marginTop:4, letterSpacing:1 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="fade5" style={{ padding:"20px 16px 0" }}>
        <div style={{ fontSize:11, color:T.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>Live Overview</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[
            { label:"Tasks Done",     val:`${tasksDone}/${tasks.length}`, icon:"✅", color:T.success },
            { label:"Budget Used",    val:fmt(totalSpent),                icon:"💰", color:T.gold    },
            { label:"Vendors Locked", val:`${vendorConf}/${vendors.length}`, icon:"🤝", color:T.dusty },
            { label:"Guests Listed",  val:guests.length,                  icon:"👥", color:T.navyMid },
          ].map(({label,val,icon,color})=>(
            <div key={label} style={{ background:T.white, borderRadius:14, padding:"14px", border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{icon}</div>
              <div>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:20, fontWeight:700, color:T.charcoal }}>{val}</div>
                <div style={{ fontSize:11, color:T.muted }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div style={{ padding:"24px 16px 0" }}>
        <div style={{ fontSize:11, color:T.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Function Schedule</div>
        {SCHEDULE.map(day=>(
          <div key={day.day} style={{ marginBottom:16, background:T.white, borderRadius:18, overflow:"hidden", border:`1px solid ${T.border}` }}>
            <div style={{ background:day.color, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:16, fontWeight:700, color:T.navy }}>{day.day}</div>
                <div style={{ fontSize:12, color:T.muted, marginTop:1 }}>{day.date}</div>
              </div>
              <div style={{ fontSize:20 }}>{day.emoji}</div>
            </div>
            <div style={{ padding:"8px 0" }}>
              {day.events.map((ev,i)=> ev.isWedding ? (
                <div key="wedding" style={{ margin:"6px 12px", background:`linear-gradient(135deg,${T.navy},${T.navyMid})`, borderRadius:12, padding:"10px 14px" }}>
                  <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:15, fontWeight:700, color:T.goldLight, marginBottom:8 }}>💒 Wedding</div>
                  {[{icon:"🎺",name:"Baraat",time:"~7:00 PM"},{icon:"🔥",name:"Wedding Ceremony",time:"~9:00 PM Onwards"}].map((s,j)=>(
                    <div key={j} style={{ display:"flex", alignItems:"center", gap:10, paddingTop:j>0?8:0, borderTop:j>0?"1px solid rgba(255,255,255,0.1)":"none" }}>
                      <span style={{ fontSize:16 }}>{s.icon}</span>
                      <div>
                        <div style={{ color:T.white, fontSize:13, fontWeight:600 }}>{s.name}</div>
                        <div style={{ color:T.gold, fontSize:11, marginTop:1 }}>{s.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div key={i} style={{ display:"flex", alignItems:"center", padding:"10px 16px", gap:12, borderBottom:i<day.events.length-1?`1px solid ${T.border}`:"none" }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:T.blush+"80", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{ev.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:T.charcoal }}>{ev.name}</div>
                    <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{ev.time} {ev.note && <span style={{ color:T.rose }}>· {ev.note}</span>}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Venue */}
      <div style={{ padding:"0 16px 8px" }}>
        <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`, borderRadius:18, padding:"18px 20px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontSize:32 }}>🏛️</div>
          <div>
            <div style={{ color:T.goldLight, fontSize:11, letterSpacing:2, textTransform:"uppercase" }}>Venue</div>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:20, fontWeight:700, color:T.white, marginTop:2 }}>Vivan, Karnal</div>
            <div style={{ color:"rgba(255,255,255,0.55)", fontSize:12, marginTop:2 }}>Haryana, India</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASKS
// ═══════════════════════════════════════════════════════════════════════════════
function Tasks({ tasks, setTasks }) {
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState({ text:"", cat:"Misc", priority:"medium" });
  const [filter, setFilter] = useState("All");
  const CATS = ["All","Beauty","Outfits","Entertainment","Guests","Food","Decor","Photography","Logistics","Misc"];
  const PRIO_C = { high:T.danger, medium:T.warn, low:T.success };
  const filtered = filter==="All" ? tasks : tasks.filter(t=>t.cat===filter);
  const done = tasks.filter(t=>t.done).length;
  const pct = Math.round((done/tasks.length)*100)||0;

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div>
          <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:22, fontWeight:700 }}>Tasks</div>
          <div style={{ color:T.muted, fontSize:13 }}>{done}/{tasks.length} completed · {pct}%</div>
        </div>
        <button onClick={()=>setAdding(true)} style={{ background:T.navy, color:T.white, border:"none", borderRadius:12, padding:"10px 18px", fontWeight:600, fontSize:14, cursor:"pointer" }}>+ Add</button>
      </div>

      <div style={{ height:6, background:T.border, borderRadius:99, marginBottom:16, overflow:"hidden" }}>
        <div style={{ height:"100%", width:pct+"%", background:`linear-gradient(90deg,${T.rose},${T.gold})`, borderRadius:99, transition:"width 0.4s" }} />
      </div>

      <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:12 }}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setFilter(c)} style={{
            padding:"6px 14px", borderRadius:99, cursor:"pointer",
            background:filter===c?T.navy:T.white, color:filter===c?T.white:T.muted,
            fontSize:12, fontWeight:500, whiteSpace:"nowrap",
            border:`1px solid ${filter===c?T.navy:T.border}`,
          }}>{c}</button>
        ))}
      </div>

      {adding && (
        <div style={{ background:T.white, borderRadius:16, padding:16, marginBottom:12, border:`1px solid ${T.border}` }}>
          <input value={newTask.text} onChange={e=>setNewTask({...newTask,text:e.target.value})}
            placeholder="Task description..." autoFocus
            style={{ width:"100%", border:"none", outline:"none", fontSize:15, background:"transparent", marginBottom:10 }} />
          <div style={{ display:"flex", gap:8 }}>
            <select value={newTask.cat} onChange={e=>setNewTask({...newTask,cat:e.target.value})}
              style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13 }}>
              {CATS.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
            </select>
            <select value={newTask.priority} onChange={e=>setNewTask({...newTask,priority:e.target.value})}
              style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13 }}>
              {["high","medium","low"].map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            <button onClick={()=>{ if(!newTask.text.trim())return; setTasks(ts=>[...ts,{...newTask,id:Date.now(),done:false}]); setNewTask({text:"",cat:"Misc",priority:"medium"}); setAdding(false); }}
              style={{ flex:1, padding:10, background:T.navy, color:T.white, border:"none", borderRadius:10, cursor:"pointer", fontWeight:600 }}>Add Task</button>
            <button onClick={()=>setAdding(false)} style={{ flex:1, padding:10, background:T.cream, color:T.muted, border:`1px solid ${T.border}`, borderRadius:10, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {filtered.map(t=>(
        <div key={t.id} style={{ background:T.white, borderRadius:14, padding:"12px 14px", marginBottom:8, border:`1px solid ${T.border}`, opacity:t.done?0.65:1 }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
            {/* Checkbox */}
            <div onClick={()=>setTasks(ts=>ts.map(x=>x.id===t.id?{...x,done:!x.done}:x))} style={{
              width:22, height:22, borderRadius:6, flexShrink:0, marginTop:2, cursor:"pointer",
              border:`2px solid ${t.done?T.success:T.border}`, background:t.done?T.success:"transparent",
              display:"flex", alignItems:"center", justifyContent:"center", color:T.white, fontSize:13,
            }}>{t.done&&"✓"}</div>
            {/* Inline editable text */}
            <div style={{ flex:1 }}>
              <IE value={t.text} onChange={v=>setTasks(ts=>ts.map(x=>x.id===t.id?{...x,text:v}:x))}
                style={{ fontSize:14, fontWeight:500, textDecoration:t.done?"line-through":"none", color:T.charcoal }} />
              <div style={{ display:"flex", gap:6, marginTop:6, alignItems:"center" }}>
                <select value={t.cat} onChange={e=>setTasks(ts=>ts.map(x=>x.id===t.id?{...x,cat:e.target.value}:x))}
                  style={{ fontSize:11, color:T.muted, background:T.cream, padding:"2px 6px", borderRadius:99, border:`1px solid ${T.border}`, cursor:"pointer" }}>
                  {CATS.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
                </select>
                <select value={t.priority} onChange={e=>setTasks(ts=>ts.map(x=>x.id===t.id?{...x,priority:e.target.value}:x))}
                  style={{ fontSize:11, color:PRIO_C[t.priority], background:PRIO_C[t.priority]+"20", padding:"2px 6px", borderRadius:99, border:`1px solid ${PRIO_C[t.priority]}`, cursor:"pointer" }}>
                  {["high","medium","low"].map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            {/* Delete */}
            <div onClick={()=>setTasks(ts=>ts.filter(x=>x.id!==t.id))} style={{ color:T.rose, cursor:"pointer", fontSize:20, padding:"0 2px", lineHeight:1 }}>×</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUDGET
// ═══════════════════════════════════════════════════════════════════════════════
function Budget({ budget, setBudget }) {
  const [adding, setAdding] = useState(false);
  const [nw, setNw] = useState({ cat:"Misc", name:"", budget:"", spent:"" });
  const totalSpent = budget.items.reduce((s,i)=>s+(parseFloat(i.spent)||0),0);
  const pct = Math.round((totalSpent/budget.total)*100);
  const upd = (id,field,val) => setBudget(b=>({
    ...b,
    items: b.items.map(i => i.id===id ? {
      ...i,
      [field]: (field==="name"||field==="cat") ? val : (parseFloat(val)||0)
    } : i)
  }));
  const del = id => setBudget(b=>({...b,items:b.items.filter(i=>i.id!==id)}));

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:22, fontWeight:700 }}>Budget</div>
        <button onClick={()=>setAdding(true)} style={{ background:T.navy, color:T.white, border:"none", borderRadius:12, padding:"10px 18px", fontWeight:600, fontSize:14, cursor:"pointer" }}>+ Add</button>
      </div>
      <div style={{ color:T.muted, fontSize:13, marginBottom:14 }}>Total: {fmt(budget.total)}</div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
        {[{label:"Spent",val:fmt(totalSpent),color:T.danger},{label:"Remaining",val:fmt(budget.total-totalSpent),color:T.success},{label:"Used",val:pct+"%",color:T.gold}].map(({label,val,color})=>(
          <div key={label} style={{ background:T.white, borderRadius:14, padding:"14px 10px", textAlign:"center", border:`1px solid ${T.border}` }}>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:16, fontWeight:700, color }}>{val}</div>
            <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ height:8, background:T.border, borderRadius:99, marginBottom:18, overflow:"hidden" }}>
        <div style={{ height:"100%", width:Math.min(pct,100)+"%", background:pct>85?T.danger:T.gold, borderRadius:99, transition:"width 0.4s" }} />
      </div>

      {adding && (
        <div style={{ background:T.white, borderRadius:16, padding:16, marginBottom:12, border:`1px solid ${T.border}` }}>
          <input placeholder="Item name *" value={nw.name} onChange={e=>setNw({...nw,name:e.target.value})} autoFocus
            style={{ width:"100%", border:"none", borderBottom:`1px solid ${T.border}`, outline:"none", fontSize:15, marginBottom:10, background:"transparent", paddingBottom:6 }} />
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            <input placeholder="Budget ₹" value={nw.budget} onChange={e=>setNw({...nw,budget:e.target.value})} type="number"
              style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13 }} />
            <input placeholder="Spent ₹" value={nw.spent} onChange={e=>setNw({...nw,spent:e.target.value})} type="number"
              style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13 }} />
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>{ if(!nw.name)return; setBudget(b=>({...b,items:[...b.items,{...nw,id:Date.now(),budget:Number(nw.budget)||0,spent:Number(nw.spent)||0}]})); setNw({cat:"Misc",name:"",budget:"",spent:""}); setAdding(false); }}
              style={{ flex:1, padding:10, background:T.navy, color:T.white, border:"none", borderRadius:10, cursor:"pointer", fontWeight:600 }}>Add</button>
            <button onClick={()=>setAdding(false)} style={{ flex:1, padding:10, background:T.cream, color:T.muted, border:`1px solid ${T.border}`, borderRadius:10, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {budget.items.map(item=>{
        const ip = item.budget>0?Math.round((item.spent/item.budget)*100):0;
        return (
          <div key={item.id} style={{ background:T.white, borderRadius:14, padding:"14px 16px", marginBottom:8, border:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ flex:1 }}>
                {/* Inline editable name */}
                <IE value={item.name} onChange={v=>upd(item.id,"name",v)} style={{ fontSize:14, fontWeight:600, color:T.charcoal }} />
                <IE value={item.cat} onChange={v=>upd(item.id,"cat",v)} style={{ fontSize:11, color:T.muted, marginTop:2 }} />
              </div>
              <div onClick={()=>del(item.id)} style={{ color:T.rose, cursor:"pointer", fontSize:20, paddingLeft:12 }}>×</div>
            </div>
            <div style={{ display:"flex", gap:12, marginBottom:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:T.muted, marginBottom:3 }}>Budget</div>
                <BudgetInput value={item.budget} onCommit={v=>upd(item.id,"budget",v)}
                  style={{ width:"100%", border:"none", borderBottom:`1px solid ${T.border}`, outline:"none", fontSize:14, fontWeight:600, background:"transparent", color:T.charcoal, padding:"2px 0" }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:T.muted, marginBottom:3 }}>Spent</div>
                <BudgetInput value={item.spent} onCommit={v=>upd(item.id,"spent",v)}
                  style={{ width:"100%", border:"none", borderBottom:`1px solid ${T.border}`, outline:"none", fontSize:14, fontWeight:600, background:"transparent", color:ip>100?T.danger:T.charcoal, padding:"2px 0" }} />
              </div>
            </div>
            <div style={{ height:4, background:T.border, borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:Math.min(ip,100)+"%", background:ip>100?T.danger:ip>75?T.warn:T.success, borderRadius:99 }} />
            </div>
            <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>{ip}% used · {fmt(item.budget-item.spent)} left</div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VENDORS
// ═══════════════════════════════════════════════════════════════════════════════
function Vendors({ vendors, setVendors }) {
  const [adding, setAdding] = useState(false);
  const [nv, setNv] = useState({ cat:"Venue", name:"", contact:"", status:"searching", notes:"" });
  const STATUS_C = { confirmed:T.success, searching:T.warn, shortlisted:T.gold };
  const CATS = ["Venue","Photography","Catering","Decor","DJ","Makeup","Transport","Pandit","Misc"];
  const upd = (id,field,val) => setVendors(vs=>vs.map(v=>v.id===id?{...v,[field]:val}:v));
  const del = id => setVendors(vs=>vs.filter(v=>v.id!==id));

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div>
          <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:22, fontWeight:700 }}>Vendors</div>
          <div style={{ color:T.muted, fontSize:13 }}>{vendors.filter(v=>v.status==="confirmed").length} confirmed</div>
        </div>
        <button onClick={()=>setAdding(true)} style={{ background:T.navy, color:T.white, border:"none", borderRadius:12, padding:"10px 18px", fontWeight:600, fontSize:14, cursor:"pointer" }}>+ Add</button>
      </div>

      {adding && (
        <div style={{ background:T.white, borderRadius:16, padding:16, marginBottom:12, border:`1px solid ${T.border}` }}>
          <input placeholder="Vendor name *" value={nv.name} onChange={e=>setNv({...nv,name:e.target.value})} autoFocus
            style={{ width:"100%", border:"none", borderBottom:`1px solid ${T.border}`, outline:"none", fontSize:15, marginBottom:10, background:"transparent", paddingBottom:6 }} />
          <div style={{ display:"flex", gap:8, marginBottom:8 }}>
            <select value={nv.cat} onChange={e=>setNv({...nv,cat:e.target.value})} style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13 }}>
              {CATS.map(c=><option key={c}>{c}</option>)}
            </select>
            <select value={nv.status} onChange={e=>setNv({...nv,status:e.target.value})} style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13 }}>
              {["searching","shortlisted","confirmed"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <input placeholder="Contact / phone" value={nv.contact} onChange={e=>setNv({...nv,contact:e.target.value})}
            style={{ width:"100%", padding:"8px 0", border:"none", borderBottom:`1px solid ${T.border}`, outline:"none", fontSize:13, background:"transparent", marginBottom:8 }} />
          <input placeholder="Notes" value={nv.notes} onChange={e=>setNv({...nv,notes:e.target.value})}
            style={{ width:"100%", padding:"8px 0", border:"none", borderBottom:`1px solid ${T.border}`, outline:"none", fontSize:13, background:"transparent", marginBottom:10 }} />
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>{ if(!nv.name)return; setVendors(vs=>[...vs,{...nv,id:Date.now()}]); setNv({cat:"Venue",name:"",contact:"",status:"searching",notes:""}); setAdding(false); }}
              style={{ flex:1, padding:10, background:T.navy, color:T.white, border:"none", borderRadius:10, cursor:"pointer", fontWeight:600 }}>Save</button>
            <button onClick={()=>setAdding(false)} style={{ flex:1, padding:10, background:T.cream, color:T.muted, border:`1px solid ${T.border}`, borderRadius:10, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {vendors.map(v=>(
        <div key={v.id} style={{ background:T.white, borderRadius:14, padding:"14px 16px", marginBottom:8, border:`1px solid ${T.border}`, borderLeft:`4px solid ${STATUS_C[v.status]||T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
            <div style={{ flex:1 }}>
              <IE value={v.name} onChange={val=>upd(v.id,"name",val)} style={{ fontSize:15, fontWeight:600, color:T.charcoal }} />
              <IE value={v.cat} onChange={val=>upd(v.id,"cat",val)} style={{ fontSize:12, color:T.muted, marginTop:2 }} />
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0, marginLeft:8 }}>
              <select value={v.status} onChange={e=>upd(v.id,"status",e.target.value)}
                style={{ fontSize:11, padding:"4px 8px", borderRadius:8, border:`1px solid ${STATUS_C[v.status]}`, color:STATUS_C[v.status], background:STATUS_C[v.status]+"15", cursor:"pointer", outline:"none" }}>
                {["searching","shortlisted","confirmed"].map(s=><option key={s}>{s}</option>)}
              </select>
              <div onClick={()=>del(v.id)} style={{ color:T.rose, cursor:"pointer", fontSize:20 }}>×</div>
            </div>
          </div>
          <IE value={v.contact||""} onChange={val=>upd(v.id,"contact",val)} placeholder="📞 Add contact..." style={{ fontSize:12, color:T.muted, display:"block", marginTop:4 }} />
          <IE value={v.notes||""} onChange={val=>upd(v.id,"notes",val)} placeholder="📝 Add notes..." style={{ fontSize:12, color:T.muted, display:"block", marginTop:4 }} />
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GUESTS
// ═══════════════════════════════════════════════════════════════════════════════
function Guests({ guests, setGuests }) {
  const [tab, setTab] = useState("Groom");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [ng, setNg] = useState({ name:"", from:"", side:"Groom", fn:"Wedding", hotel:"", rsvp:"pending", notes:"" });
  const fileRef = useRef();
  const RSVP_C = { confirmed:T.success, pending:T.warn, declined:T.danger };
  const FNS = ["Wedding","Sangeet","Mehendi","Haldi"];
  const upd = (id,field,val) => setGuests(gs=>gs.map(g=>g.id===id?{...g,[field]:val}:g));
  const del = id => setGuests(gs=>gs.filter(g=>g.id!==id));

  const filtered = guests.filter(g=>g.side===tab && g.name.toLowerCase().includes(search.toLowerCase()));
  const confirmed = guests.filter(g=>g.rsvp==="confirmed").length;
  const pending   = guests.filter(g=>g.rsvp==="pending").length;
  const declined  = guests.filter(g=>g.rsvp==="declined").length;

  const uploadExcel = e => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const wb = XLSX.read(new Uint8Array(ev.target.result),{type:"array"});
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        setGuests(rows.map((r,i)=>({ id:Date.now()+i, sno:i+1, name:r.Name||r.name||"", from:r.From||r.from||"", side:r.Side||r.side||"Groom", fn:r.Function||r.function||"Wedding", hotel:r.Hotel||r.hotel||"", rsvp:r.RSVP||r.rsvp||"pending", notes:r.Notes||r.notes||"" })).filter(g=>g.name));
      } catch {}
    };
    reader.readAsArrayBuffer(file);
  };

  const exportXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(guests.map(g=>({Name:g.name,From:g.from,Side:g.side,Function:g.fn,Hotel:g.hotel,RSVP:g.rsvp,Notes:g.notes})));
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,"Guests");
    XLSX.writeFile(wb,"guest_list.xlsx");
  };

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:22, fontWeight:700, marginBottom:12 }}>Guests</div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, marginBottom:14 }}>
        {[{label:"Total",val:guests.length,color:T.navy},{label:"✓ Conf",val:confirmed,color:T.success},{label:"⏳ Pend",val:pending,color:T.warn},{label:"✗ Decl",val:declined,color:T.danger}].map(({label,val,color})=>(
          <div key={label} style={{ background:T.white, borderRadius:12, padding:"10px 8px", textAlign:"center", border:`1px solid ${T.border}` }}>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:20, fontWeight:700, color }}>{val}</div>
            <div style={{ fontSize:10, color:T.muted }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <button onClick={()=>setAdding(true)} style={{ flex:1, padding:"9px 0", background:T.navy, color:T.white, border:"none", borderRadius:10, fontWeight:600, fontSize:13, cursor:"pointer" }}>+ Add</button>
        <button onClick={()=>fileRef.current.click()} style={{ flex:1, padding:"9px 0", background:T.white, color:T.navy, border:`1px solid ${T.border}`, borderRadius:10, fontWeight:600, fontSize:13, cursor:"pointer" }}>📤 Upload</button>
        <button onClick={exportXLSX} style={{ flex:1, padding:"9px 0", background:T.white, color:T.navy, border:`1px solid ${T.border}`, borderRadius:10, fontWeight:600, fontSize:13, cursor:"pointer" }}>📥 Export</button>
        <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display:"none" }} onChange={uploadExcel} />
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search guests..."
        style={{ width:"100%", padding:"10px 14px", borderRadius:12, border:`1px solid ${T.border}`, fontSize:14, outline:"none", background:T.white, marginBottom:12 }} />

      {/* Side tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {["Groom","Bride"].map(s=>(
          <button key={s} onClick={()=>setTab(s)} style={{
            flex:1, padding:"10px", borderRadius:12, cursor:"pointer", fontWeight:600, fontSize:14,
            background:tab===s?T.navy:T.white, color:tab===s?T.white:T.muted,
            border:`1px solid ${tab===s?T.navy:T.border}`,
          }}>{s} Side ({guests.filter(g=>g.side===s).length})</button>
        ))}
      </div>

      {adding && (
        <div style={{ background:T.white, borderRadius:16, padding:16, marginBottom:12, border:`1px solid ${T.border}` }}>
          <input placeholder="Guest name *" value={ng.name} onChange={e=>setNg({...ng,name:e.target.value})} autoFocus
            style={{ width:"100%", border:"none", borderBottom:`1px solid ${T.border}`, outline:"none", fontSize:15, marginBottom:10, background:"transparent", paddingBottom:6 }} />
          <div style={{ display:"flex", gap:8, marginBottom:8 }}>
            <input placeholder="From (city)" value={ng.from} onChange={e=>setNg({...ng,from:e.target.value})}
              style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13 }} />
            <select value={ng.side} onChange={e=>setNg({...ng,side:e.target.value})} style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13 }}>
              <option>Groom</option><option>Bride</option>
            </select>
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            <select value={ng.fn} onChange={e=>setNg({...ng,fn:e.target.value})} style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13 }}>
              {FNS.map(f=><option key={f}>{f}</option>)}
            </select>
            <select value={ng.rsvp} onChange={e=>setNg({...ng,rsvp:e.target.value})} style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13 }}>
              <option>pending</option><option>confirmed</option><option>declined</option>
            </select>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>{ if(!ng.name.trim())return; setGuests(gs=>[...gs,{...ng,id:Date.now(),sno:gs.length+1}]); setNg({name:"",from:"",side:"Groom",fn:"Wedding",hotel:"",rsvp:"pending",notes:""}); setAdding(false); }}
              style={{ flex:1, padding:10, background:T.navy, color:T.white, border:"none", borderRadius:10, cursor:"pointer", fontWeight:600 }}>Add Guest</button>
            <button onClick={()=>setAdding(false)} style={{ flex:1, padding:10, background:T.cream, color:T.muted, border:`1px solid ${T.border}`, borderRadius:10, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {filtered.length===0 && (
        <div style={{ textAlign:"center", color:T.muted, padding:"40px 0", fontSize:14 }}>No guests yet on {tab} side.</div>
      )}

      {filtered.map(g=>(
        <div key={g.id} style={{ background:T.white, borderRadius:14, padding:"12px 14px", marginBottom:8, border:`1px solid ${T.border}`, borderLeft:`4px solid ${g.side==="Groom"?T.navy:T.rose}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div style={{ flex:1 }}>
              <IE value={g.name} onChange={v=>upd(g.id,"name",v)} style={{ fontSize:14, fontWeight:600, color:T.charcoal }} />
              <div style={{ display:"flex", gap:6, marginTop:6, alignItems:"center", flexWrap:"wrap" }}>
                <IE value={g.from||""} onChange={v=>upd(g.id,"from",v)} placeholder="City..." style={{ fontSize:11, color:T.muted, width:80 }} />
                <select value={g.fn} onChange={e=>upd(g.id,"fn",e.target.value)}
                  style={{ fontSize:11, padding:"2px 6px", borderRadius:99, border:`1px solid ${T.border}`, background:T.cream, cursor:"pointer", color:T.muted }}>
                  {FNS.map(f=><option key={f}>{f}</option>)}
                </select>
                <IE value={g.hotel||""} onChange={v=>upd(g.id,"hotel",v)} placeholder="🏨 Hotel..." style={{ fontSize:11, color:T.muted, width:80 }} />
              </div>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0, marginLeft:8 }}>
              <select value={g.rsvp} onChange={e=>upd(g.id,"rsvp",e.target.value)}
                style={{ fontSize:11, padding:"4px 8px", borderRadius:8, border:`1px solid ${RSVP_C[g.rsvp]}`, color:RSVP_C[g.rsvp], background:RSVP_C[g.rsvp]+"15", outline:"none", cursor:"pointer" }}>
                <option>pending</option><option>confirmed</option><option>declined</option>
              </select>
              <div onClick={()=>del(g.id)} style={{ color:T.rose, cursor:"pointer", fontSize:20 }}>×</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAMILY
// ═══════════════════════════════════════════════════════════════════════════════
function Family({ family, setFamily }) {
  const [tab, setTab] = useState("Groom");
  const upd = (id,field,val) => setFamily(fs=>fs.map(f=>f.id===id?{...f,[field]:val}:f));
  const del = id => setFamily(fs=>fs.filter(f=>f.id!==id));
  const add = () => setFamily(fs=>[...fs,{id:Date.now(),side:tab,name:"",role:"",tasks:"",phone:""}]);

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:22, fontWeight:700, marginBottom:16 }}>Family Captains</div>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {["Groom","Bride"].map(s=>(
          <button key={s} onClick={()=>setTab(s)} style={{ flex:1, padding:10, borderRadius:12, cursor:"pointer", fontWeight:600, fontSize:14, background:tab===s?T.navy:T.white, color:tab===s?T.white:T.muted, border:`1px solid ${tab===s?T.navy:T.border}` }}>{s} Side</button>
        ))}
      </div>
      <button onClick={add} style={{ width:"100%", padding:12, background:T.white, border:`2px dashed ${T.border}`, borderRadius:14, color:T.muted, fontSize:14, cursor:"pointer", marginBottom:12 }}>+ Add Captain</button>

      {family.filter(f=>f.side===tab).map(f=>(
        <div key={f.id} style={{ background:T.white, borderRadius:16, padding:16, marginBottom:10, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div style={{ flex:1 }}>
              <IE value={f.name} onChange={v=>upd(f.id,"name",v)} placeholder="Name" style={{ fontSize:16, fontWeight:700, color:T.charcoal }} />
              <IE value={f.role} onChange={v=>upd(f.id,"role",v)} placeholder="Role / responsibility" style={{ fontSize:13, color:T.muted, marginTop:4 }} />
              <IE value={f.phone||""} onChange={v=>upd(f.id,"phone",v)} placeholder="📞 Phone number" style={{ fontSize:13, color:T.muted, marginTop:4 }} />
              <IE value={f.tasks||""} onChange={v=>upd(f.id,"tasks",v)} placeholder="Tasks (comma separated)" multiline style={{ fontSize:12, color:T.muted, marginTop:6 }} />
            </div>
            <div onClick={()=>del(f.id)} style={{ color:T.rose, cursor:"pointer", fontSize:20, paddingLeft:12 }}>×</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHOTOS
// ═══════════════════════════════════════════════════════════════════════════════
function Photos() {
  const [tab, setTab] = useState("wedding");
  const SHOTS = ["Baraat entry shot","Sehra closeup","Exchange of garlands (Jaimala)","Pheras — fire & couple","Ring ceremony closeup","Sagan moments","Family formals — both sides","Couple portrait — golden hour","Mehendi hands detail","Haldi — candid fun","Sangeet performances","First look","Getting ready — groom","Getting ready — bride","Invitation & details flat lay"];
  const DUBAI = [
    { cat:"Locations", items:["Burj Khalifa base","Dubai Frame","Desert dunes at sunset","JBR beachfront","Al Seef heritage district","Dubai Creek"] },
    { cat:"Outfits",   items:["Casual chic — 1 outfit","Traditional Indian — 1 outfit","Western formal — optional 3rd"] },
    { cat:"Props",     items:["Dupatta for wind shots","Sparklers for evening","Marigold garland"] },
    { cat:"Logistics", items:["Book photographer by July","Scout locations","Hair + makeup artist Dubai","Car rental for locations"] },
  ];

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:22, fontWeight:700, marginBottom:16 }}>Photography</div>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {[{id:"wedding",label:"Wedding Shots"},{id:"dubai",label:"Dubai Shoot"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:10, borderRadius:12, cursor:"pointer", fontWeight:600, fontSize:13, background:tab===t.id?T.navy:T.white, color:tab===t.id?T.white:T.muted, border:`1px solid ${tab===t.id?T.navy:T.border}` }}>{t.label}</button>
        ))}
      </div>

      {tab==="wedding" && SHOTS.map((s,i)=>(
        <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:T.white, borderRadius:12, marginBottom:6, border:`1px solid ${T.border}` }}>
          <div style={{ width:24, height:24, borderRadius:6, background:T.gold+"30", color:T.gold, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>{i+1}</div>
          <div style={{ fontSize:14 }}>{s}</div>
        </div>
      ))}

      {tab==="dubai" && <>
        <div style={{ background:`linear-gradient(135deg,${T.navy},${T.navyMid})`, borderRadius:16, padding:16, marginBottom:16, color:T.white }}>
          <div style={{ fontSize:11, color:T.gold, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>Pre-Wedding Shoot</div>
          <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:20, fontWeight:700 }}>Dubai, UAE</div>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginTop:2 }}>Mid-August 2026 · ~3 days</div>
        </div>
        {DUBAI.map(({cat,items})=>(
          <div key={cat} style={{ marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.navy, marginBottom:8 }}>{cat}</div>
            {items.map((item,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:T.white, borderRadius:12, marginBottom:5, border:`1px solid ${T.border}` }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:T.gold, flexShrink:0 }} />
                <div style={{ fontSize:13 }}>{item}</div>
              </div>
            ))}
          </div>
        ))}
      </>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen,  setScreen]  = useState("home");
  const [tasks,   setTasks]   = useLS("wos_tasks",   INIT_TASKS);
  const [budget,  setBudget]  = useLS("wos_budget",  INIT_BUDGET);
  const [vendors, setVendors] = useLS("wos_vendors", INIT_VENDORS);
  const [guests,  setGuests]  = useLS("wos_guests",  INIT_GUESTS);
  const [family,  setFamily]  = useLS("wos_family",  INIT_FAMILY);

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
      <div style={{ maxWidth:480, margin:"0 auto", minHeight:"100vh", background:T.cream, position:"relative" }}>
        <div style={{ position:"sticky", top:0, zIndex:100, background:T.cream, borderBottom:`1px solid ${T.border}`, padding:"14px 20px 10px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:18, fontWeight:700, color:T.navy }}>
            Manan <span style={{ color:T.rose }}>♥</span> Shrishti
          </div>
          <div style={{ fontSize:12, color:T.muted }}>{getDaysLeft()}d to go</div>
        </div>

        <div>{SCREENS[screen]}</div>

        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:T.white, borderTop:`1px solid ${T.border}`, display:"flex", paddingBottom:"env(safe-area-inset-bottom)", zIndex:200 }}>
          {NAV.map(({id,icon,label})=>(
            <button key={id} onClick={()=>setScreen(id)} style={{ flex:1, border:"none", background:"transparent", cursor:"pointer", padding:"10px 2px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <div style={{ fontSize:screen===id?22:20, transition:"all 0.2s" }}>{icon}</div>
              <div style={{ fontSize:9, fontWeight:screen===id?700:400, color:screen===id?T.navy:T.muted, letterSpacing:0.3 }}>{label}</div>
              {screen===id && <div style={{ width:4, height:4, borderRadius:"50%", background:T.gold, marginTop:-1 }} />}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
