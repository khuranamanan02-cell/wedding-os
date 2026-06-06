import { useState, useRef } from "react";
import * as XLSX from "xlsx";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  cream: "#FAF7F2", blush: "#F0D9D0", rose: "#D4A5A0",
  dusty: "#C48B84", gold: "#C9A96E", goldLight: "#E8D5B0",
  navy: "#1E2A4A", navyMid: "#2E3F6F", charcoal: "#2C2C2C",
  muted: "#8A7F78", white: "#FFFFFF", border: "#EDE0D8",
  success: "#7BAE8E", warn: "#E8B96A", danger: "#D4756B",
};

const WEDDING = new Date("2026-09-21T00:00:00");
const TODAY   = new Date("2026-06-07");
const DAYS_LEFT = Math.ceil((WEDDING - TODAY) / 86400000);

// ─── FONTS ────────────────────────────────────────────────────────────────────
const FONT_INJECT = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html, body { font-family: 'Inter', sans-serif; background: #FAF7F2; color: #2C2C2C; overscroll-behavior: none; }
input, select, textarea, button { font-family: 'Inter', sans-serif; }
::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }
.cd { font-family: 'Clash Display', 'Inter', sans-serif; }
input:focus, select:focus, textarea:focus { outline: 2px solid #C48B84; outline-offset: 1px; border-radius: 8px; }
button:active { opacity: 0.8; }
`;

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INIT_TASKS = [
  { id:1,  title:"Sign photography contract",            cat:"Vendors",    month:"June",      owner:"Manan",           pri:"P1", status:"pending",  due:"2026-06-15", notes:"" },
  { id:2,  title:"Sign cinematography contract",          cat:"Vendors",    month:"June",      owner:"Manan",           pri:"P1", status:"pending",  due:"2026-06-15", notes:"" },
  { id:3,  title:"Book wedding content creator",          cat:"Content",    month:"June",      owner:"Manan",           pri:"P1", status:"pending",  due:"2026-06-20", notes:"" },
  { id:4,  title:"Confirm catering package with Vivan",   cat:"Vendors",    month:"June",      owner:"Manan",           pri:"P1", status:"done",     due:"2026-06-10", notes:"₹50L committed, ₹10L paid" },
  { id:5,  title:"Book DJ + sound system",                cat:"Vendors",    month:"June",      owner:"Srishti",         pri:"P1", status:"pending",  due:"2026-06-25", notes:"" },
  { id:6,  title:"Book mehendi artist",                   cat:"Vendors",    month:"June",      owner:"Srishti",         pri:"P1", status:"pending",  due:"2026-06-25", notes:"" },
  { id:7,  title:"Book bridal makeup artist + trial",     cat:"Vendors",    month:"June",      owner:"Srishti",         pri:"P1", status:"pending",  due:"2026-06-28", notes:"" },
  { id:8,  title:"Book pandit — confirm ritual schedule", cat:"Rituals",    month:"June",      owner:"Family",          pri:"P1", status:"pending",  due:"2026-06-30", notes:"" },
  { id:9,  title:"Create master guest list",              cat:"Guests",     month:"June",      owner:"Both",            pri:"P1", status:"pending",  due:"2026-06-20", notes:"Target 550-600 wedding" },
  { id:10, title:"Lock Instagram handle + hashtag",       cat:"Content",    month:"June",      owner:"Manan",           pri:"P2", status:"pending",  due:"2026-06-15", notes:"" },
  { id:11, title:"Buy domain manandsrishti.com",          cat:"Content",    month:"June",      owner:"Manan",           pri:"P2", status:"pending",  due:"2026-06-15", notes:"" },
  { id:12, title:"Assign 4 family captains",              cat:"Delegation", month:"June",      owner:"Manan",           pri:"P1", status:"pending",  due:"2026-06-20", notes:"" },
  { id:13, title:"Confirm Srishti Dubai dates",           cat:"Dubai",      month:"June",      owner:"Srishti",         pri:"P1", status:"pending",  due:"2026-06-15", notes:"Aug 15-25 window" },
  { id:14, title:"Shortlist Dubai photographer",          cat:"Dubai",      month:"June",      owner:"Manan",           pri:"P1", status:"pending",  due:"2026-06-30", notes:"" },
  { id:15, title:"Shortlist floristry / decor vendor",    cat:"Vendors",    month:"June",      owner:"Both",            pri:"P1", status:"pending",  due:"2026-06-30", notes:"" },
  { id:16, title:"Sign decor / floristry contract",       cat:"Vendors",    month:"July",      owner:"Manan",           pri:"P1", status:"pending",  due:"2026-07-10", notes:"" },
  { id:17, title:"Book hotel room block — 80 rooms",      cat:"Guests",     month:"July",      owner:"Guest Captain",   pri:"P1", status:"pending",  due:"2026-07-15", notes:"40 per family" },
  { id:18, title:"Finalize catering menu all 4 functions",cat:"Vendors",    month:"July",      owner:"Both",            pri:"P1", status:"pending",  due:"2026-07-20", notes:"" },
  { id:19, title:"Book choreographer for Sangeet",        cat:"Sangeet",    month:"July",      owner:"Both",            pri:"P1", status:"pending",  due:"2026-07-10", notes:"Full performance!" },
  { id:20, title:"Design & send digital invitations",     cat:"Invitations",month:"July",      owner:"Manan",           pri:"P1", status:"pending",  due:"2026-07-25", notes:"" },
  { id:21, title:"Launch wedding website",                cat:"Content",    month:"July",      owner:"Manan",           pri:"P1", status:"pending",  due:"2026-07-31", notes:"" },
  { id:22, title:"Finalize & purchase bridal lehenga",    cat:"Shopping",   month:"July",      owner:"Srishti",         pri:"P1", status:"pending",  due:"2026-07-20", notes:"" },
  { id:23, title:"Finalize groom sherwani",               cat:"Shopping",   month:"July",      owner:"Manan",           pri:"P1", status:"pending",  due:"2026-07-20", notes:"" },
  { id:24, title:"Book Dubai photographer",               cat:"Dubai",      month:"July",      owner:"Manan",           pri:"P1", status:"pending",  due:"2026-07-15", notes:"" },
  { id:25, title:"Finalize Dubai shoot locations",        cat:"Dubai",      month:"July",      owner:"Manan",           pri:"P2", status:"pending",  due:"2026-07-31", notes:"Downtown, Desert, JBR, Al Fahidi" },
  { id:26, title:"Bridal jewelry shortlisting",           cat:"Shopping",   month:"July",      owner:"Srishti",         pri:"P1", status:"pending",  due:"2026-07-31", notes:"" },
  { id:27, title:"Book lighting vendor",                  cat:"Vendors",    month:"July",      owner:"Manan",           pri:"P2", status:"pending",  due:"2026-07-15", notes:"" },
  { id:28, title:"Begin family shopping",                 cat:"Shopping",   month:"July",      owner:"Shopping Captain", pri:"P2", status:"pending", due:"2026-07-31", notes:"" },
  { id:29, title:"Execute Dubai pre-wedding shoot",       cat:"Dubai",      month:"August",    owner:"Both",            pri:"P1", status:"pending",  due:"2026-08-20", notes:"Aug 15-25 window" },
  { id:30, title:"Final menu tasting at Vivan",           cat:"Vendors",    month:"August",    owner:"Both",            pri:"P1", status:"pending",  due:"2026-08-15", notes:"" },
  { id:31, title:"Confirm all RSVPs — final headcount",   cat:"Guests",     month:"August",    owner:"Guest Captain",   pri:"P1", status:"pending",  due:"2026-08-31", notes:"" },
  { id:32, title:"Complete all family shopping",          cat:"Shopping",   month:"August",    owner:"Shopping Captain", pri:"P1", status:"pending", due:"2026-08-25", notes:"" },
  { id:33, title:"Schedule bridal trial makeup + hair",   cat:"Shopping",   month:"August",    owner:"Srishti",         pri:"P1", status:"pending",  due:"2026-08-20", notes:"" },
  { id:34, title:"Script reels for each function",        cat:"Content",    month:"August",    owner:"Content Captain", pri:"P2", status:"pending",  due:"2026-08-31", notes:"" },
  { id:35, title:"Order return gifts",                    cat:"Gifts",      month:"August",    owner:"Shopping Captain", pri:"P2", status:"pending", due:"2026-08-20", notes:"" },
  { id:36, title:"Finalize Sangeet song list",            cat:"Sangeet",    month:"August",    owner:"Both",            pri:"P1", status:"pending",  due:"2026-08-15", notes:"" },
  { id:37, title:"Create shot list for photographer",     cat:"Vendors",    month:"August",    owner:"Both",            pri:"P2", status:"pending",  due:"2026-08-31", notes:"" },
  { id:38, title:"Receive Dubai shoot edited photos",     cat:"Dubai",      month:"August",    owner:"Manan",           pri:"P2", status:"pending",  due:"2026-09-01", notes:"" },
  { id:39, title:"All vendor final confirmations",        cat:"Vendors",    month:"September", owner:"Logistics Captain",pri:"P1", status:"pending", due:"2026-09-07", notes:"" },
  { id:40, title:"Send Day-of schedule to vendors",       cat:"Vendors",    month:"September", owner:"Manan",           pri:"P1", status:"pending",  due:"2026-09-10", notes:"" },
  { id:41, title:"Prepare vendor payment envelopes",      cat:"Budget",     month:"September", owner:"Manan",           pri:"P1", status:"pending",  due:"2026-09-15", notes:"" },
  { id:42, title:"Pack wedding day emergency kit",        cat:"Logistics",  month:"September", owner:"Both",            pri:"P1", status:"pending",  due:"2026-09-15", notes:"Safety pins, tape, medicine" },
  { id:43, title:"Groom grooming appointment",            cat:"Shopping",   month:"September", owner:"Manan",           pri:"P2", status:"pending",  due:"2026-09-18", notes:"" },
  { id:44, title:"Final outfit fitting + steaming",       cat:"Shopping",   month:"September", owner:"Both",            pri:"P1", status:"pending",  due:"2026-09-17", notes:"" },
  { id:45, title:"Handover captain task lists",           cat:"Delegation", month:"September", owner:"Manan",           pri:"P1", status:"pending",  due:"2026-09-18", notes:"" },
];

const INIT_VENDORS = [
  { id:1, name:"Vivan Venue",          cat:"Venue",         status:"confirmed",   contract:true,  contact:"", total:5000000, advance:1000000, advDate:"2026-05-01", balance:4000000, balDate:"2026-09-10", deliverables:"Full venue Sep 20-21", notes:"₹50L committed ₹10L paid" },
  { id:2, name:"TBD — Photography",    cat:"Photography",   status:"shortlisting",contract:false, contact:"", total:0,       advance:0,       advDate:"",            balance:0,       balDate:"",            deliverables:"Full coverage + album",    notes:"" },
  { id:3, name:"TBD — Cinematography", cat:"Cinematography",status:"shortlisting",contract:false, contact:"", total:0,       advance:0,       advDate:"",            balance:0,       balDate:"",            deliverables:"Film + highlight reel",    notes:"" },
  { id:4, name:"TBD — Content Creator",cat:"Content",       status:"shortlisting",contract:false, contact:"", total:0,       advance:0,       advDate:"",            balance:0,       balDate:"",            deliverables:"Reels + stories both days",notes:"" },
  { id:5, name:"TBD — Decor & Floristry",cat:"Decor",       status:"shortlisting",contract:false, contact:"", total:0,       advance:0,       advDate:"",            balance:0,       balDate:"",            deliverables:"Full decor all functions", notes:"" },
  { id:6, name:"TBD — Mehendi Artist", cat:"Mehendi",       status:"shortlisting",contract:false, contact:"", total:0,       advance:0,       advDate:"",            balance:0,       balDate:"",            deliverables:"Bridal + family mehendi", notes:"" },
  { id:7, name:"TBD — Bridal MUA",     cat:"Makeup",        status:"shortlisting",contract:false, contact:"", total:0,       advance:0,       advDate:"",            balance:0,       balDate:"",            deliverables:"Bridal makeup + trial",   notes:"" },
  { id:8, name:"TBD — DJ + Sound",     cat:"DJ & Sound",    status:"shortlisting",contract:false, contact:"", total:0,       advance:0,       advDate:"",            balance:0,       balDate:"",            deliverables:"Sangeet + Wedding DJ",    notes:"" },
];

const INIT_BUDGET = [
  { id:1,  cat:"Venue (Vivan)",         planned:5000000, committed:5000000, paid:1000000, icon:"🏛️" },
  { id:2,  cat:"Catering",              planned:1500000, committed:0,       paid:0,       icon:"🍽️" },
  { id:3,  cat:"Decor & Floristry",     planned:1200000, committed:0,       paid:0,       icon:"💐" },
  { id:4,  cat:"Photography",           planned:400000,  committed:0,       paid:0,       icon:"📸" },
  { id:5,  cat:"Cinematography",        planned:300000,  committed:0,       paid:0,       icon:"🎬" },
  { id:6,  cat:"Content Creator",       planned:150000,  committed:0,       paid:0,       icon:"📱" },
  { id:7,  cat:"DJ + Sound + Lighting", planned:300000,  committed:0,       paid:0,       icon:"🎵" },
  { id:8,  cat:"Bridal Outfit + Jewelry",planned:800000, committed:0,       paid:0,       icon:"💎" },
  { id:9,  cat:"Groom Outfit",          planned:200000,  committed:0,       paid:0,       icon:"🤵" },
  { id:10, cat:"Family Outfits",        planned:600000,  committed:0,       paid:0,       icon:"👗" },
  { id:11, cat:"Makeup + Hair",         planned:150000,  committed:0,       paid:0,       icon:"💄" },
  { id:12, cat:"Mehendi",               planned:80000,   committed:0,       paid:0,       icon:"🌿" },
  { id:13, cat:"Invitations",           planned:100000,  committed:0,       paid:0,       icon:"✉️" },
  { id:14, cat:"Guest Hospitality",     planned:500000,  committed:0,       paid:0,       icon:"🏨" },
  { id:15, cat:"Return Gifts",          planned:200000,  committed:0,       paid:0,       icon:"🎁" },
  { id:16, cat:"Dubai Pre-Wedding Shoot",planned:250000, committed:0,       paid:0,       icon:"✈️" },
  { id:17, cat:"Pandit + Rituals",      planned:100000,  committed:0,       paid:0,       icon:"🕯️" },
  { id:18, cat:"Miscellaneous",         planned:370000,  committed:0,       paid:0,       icon:"🔮" },
];

const INIT_CAPTAINS = [
  { id:1, role:"Logistics Captain", icon:"🚗", desc:"Transport, vendor coordination, baraat, parking",       color:T.navy,    name:"", tasks:["Book guest shuttles","Baraat vehicle arrangement","Day-of vendor check-in","Parking management at Vivan","Emergency transport"] },
  { id:2, role:"Guest Captain",     icon:"🏨", desc:"Hotel allocation, arrivals, RSVP follow-up",            color:T.dusty,   name:"", tasks:["Hotel room assignments (80 rooms)","Guest arrival tracker","Airport/station pickups","Welcome bag distribution","RSVP confirmations"] },
  { id:3, role:"Shopping Captain",  icon:"🛍️", desc:"Family outfits, color palette, return gifts",           color:T.gold,    name:"", tasks:["Track all family outfit purchases","Color palette per function","Alteration deadlines","Return gift procurement","Accessories tracker"] },
  { id:4, role:"Content Captain",   icon:"📸", desc:"Reels, stories, hashtag, shared album",                 color:T.success, name:"", tasks:["Manage wedding hashtag","BTS reels daily","Coordinate with content creator","Upload to shared album","Instagram stories"] },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const inr = v => {
  v = Number(v) || 0;
  if (v >= 10000000) return `₹${(v/10000000).toFixed(1)}Cr`;
  if (v >= 100000)   return `₹${(v/100000).toFixed(1)}L`;
  if (v >= 1000)     return `₹${(v/1000).toFixed(0)}K`;
  return `₹${v}`;
};
const priColor    = p => p==="P1" ? T.danger : p==="P2" ? T.warn : T.success;
const statusColor = s => s==="done" ? T.success : s==="in-progress" ? T.warn : T.muted;

// ─── INLINE EDIT ──────────────────────────────────────────────────────────────
function IE({ value, onChange, placeholder, multi, style = {} }) {
  const [v, setV]   = useState(value);
  const [ed, setEd] = useState(false);
  const r = useRef();

  // sync if parent changes
  useState(() => { setV(value); }, [value]);

  const commit = () => { setEd(false); onChange(v); };
  const base = {
    fontFamily:"inherit", fontSize:"inherit", color:"inherit",
    background: ed ? "rgba(255,255,255,0.95)" : "transparent",
    border: ed ? `1.5px solid ${T.dusty}` : "1.5px solid transparent",
    borderRadius: 8, padding: ed ? "4px 8px" : "4px 2px",
    outline:"none", width:"100%", resize:"none", cursor:"text",
    transition:"all 0.15s", ...style,
  };
  if (multi) return (
    <textarea ref={r} value={v} style={{ ...base, minHeight:60 }} rows={3}
      onChange={e => setV(e.target.value)} onBlur={commit} onFocus={() => setEd(true)}
      placeholder={placeholder || "Tap to edit…"} />
  );
  return (
    <input ref={r} value={v} style={base}
      onChange={e => setV(e.target.value)} onBlur={commit} onFocus={() => setEd(true)}
      onKeyDown={e => e.key==="Enter" && commit()}
      placeholder={placeholder || "Tap to edit…"} />
  );
}

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return <div style={{ background:T.white, borderRadius:16, padding:"14px 16px", border:`1px solid ${T.border}`, ...style }}>{children}</div>;
}

function Pill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding:"6px 14px", borderRadius:20, border:"none", cursor:"pointer",
      fontSize:12, fontWeight:500, whiteSpace:"nowrap",
      background: active ? T.navy : T.blush, color: active ? T.white : T.charcoal,
      transition:"all 0.18s",
    }}>{children}</button>
  );
}

function AddBtn({ onClick, label, active }) {
  return (
    <button onClick={onClick} style={{
      width:"100%", padding:"11px", borderRadius:12, marginBottom:12,
      cursor:"pointer", fontSize:13, fontWeight:600, letterSpacing:0.2,
      background: active ? T.cream : T.navy, color: active ? T.charcoal : T.white,
      border:`1px solid ${T.border}`, transition:"all 0.2s",
    }}>{active ? "✕  Cancel" : label}</button>
  );
}

function Header({ title, sub }) {
  return (
    <div style={{
      position:"sticky", top:0, zIndex:100,
      background:"rgba(250,247,242,0.96)", backdropFilter:"blur(16px)",
      borderBottom:`1px solid ${T.border}`, padding:"14px 20px 10px",
      display:"flex", justifyContent:"space-between", alignItems:"center",
    }}>
      <div className="cd" style={{ fontSize:22, fontWeight:700, color:T.navy, letterSpacing:-0.5 }}>{title}</div>
      <div style={{ fontSize:11, color:T.dusty, fontWeight:500 }}>{sub || `${DAYS_LEFT}d to go`}</div>
    </div>
  );
}

function SectionLabel({ children, right }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
      <div style={{ fontSize:10, letterSpacing:2.5, textTransform:"uppercase", color:T.muted }}>{children}</div>
      {right && <div style={{ fontSize:11, color:T.muted }}>{right}</div>}
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"home",        icon:"✦", label:"Home"    },
  { id:"tasks",       icon:"✓", label:"Tasks"   },
  { id:"budget",      icon:"₹", label:"Budget"  },
  { id:"vendors",     icon:"🤝", label:"Vendors" },
  { id:"guests",      icon:"💌", label:"Guests"  },
  { id:"family",      icon:"👥", label:"Family"  },
  { id:"photography", icon:"📷", label:"Photos"  },
];

function BottomNav({ active, set }) {
  return (
    <nav style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:480, zIndex:200,
      background:"rgba(250,247,242,0.97)", backdropFilter:"blur(20px)",
      borderTop:`1px solid ${T.border}`,
      display:"flex", justifyContent:"space-around", alignItems:"center",
      padding:"8px 0 env(safe-area-inset-bottom, 16px)",
    }}>
      {NAV.map(n => (
        <button key={n.id} onClick={() => set(n.id)} style={{
          display:"flex", flexDirection:"column", alignItems:"center", gap:3,
          background:"none", border:"none", cursor:"pointer", padding:"4px 6px", borderRadius:10,
          color: active===n.id ? T.dusty : T.muted, transition:"all 0.2s",
          transform: active===n.id ? "translateY(-2px)" : "none",
        }}>
          <span style={{ fontSize: active===n.id ? 18 : 15 }}>{n.icon}</span>
          <span style={{ fontSize:9, fontWeight: active===n.id ? 600 : 400, letterSpacing:0.5 }}>{n.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: HOME
// ═══════════════════════════════════════════════════════════════════════════════
function Home({ tasks, budget, set }) {
  const done    = tasks.filter(t => t.status==="done").length;
  const pct     = Math.round(done / tasks.length * 100);
  const totP    = budget.reduce((s,b) => s+(+b.planned||0), 0);
  const totC    = budget.reduce((s,b) => s+(+b.committed||0), 0);
  const totPaid = budget.reduce((s,b) => s+(+b.paid||0), 0);
  const urgent  = tasks.filter(t => t.status!=="done" && t.month==="June").slice(0,3);

  return (
    <div style={{ paddingBottom:100 }}>
      {/* Hero */}
      <div style={{ height:300, position:"relative", overflow:"hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
          alt="M&S Wedding"
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 30%", filter:"brightness(0.82) saturate(0.8)" }}
        />
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(to bottom, rgba(30,42,74,0.25) 0%, ${T.cream} 92%)` }}/>
        <div style={{ position:"absolute", bottom:20, left:24, right:24 }}>
          <div className="cd" style={{ fontSize:38, color:T.navy, fontWeight:700, lineHeight:1, letterSpacing:-1 }}>
            Manan × Srishti
          </div>
          <div style={{ fontSize:11, color:T.muted, marginTop:6, letterSpacing:3, textTransform:"uppercase", fontWeight:500 }}>
            Wedding OS · Sep 20–21, 2026
          </div>
        </div>
      </div>

      <div style={{ padding:"0 20px" }}>
        {/* Countdown */}
        <div style={{
          background:`linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 100%)`,
          borderRadius:20, padding:"24px", marginBottom:16, position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:-30, right:-30, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>
          <div style={{ fontSize:10, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.45)", marginBottom:8 }}>Days to Forever</div>
          <div className="cd" style={{ fontSize:76, color:T.goldLight, fontWeight:700, lineHeight:1 }}>{DAYS_LEFT}</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginTop:8 }}>
            {Math.floor(DAYS_LEFT/7)} weeks {DAYS_LEFT%7} days · Vivan, Karnal
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          <Card>
            <SectionLabel>Tasks</SectionLabel>
            <div className="cd" style={{ fontSize:38, fontWeight:700, color:T.navy }}>{pct}<span style={{ fontSize:20 }}>%</span></div>
            <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>{done} of {tasks.length} done</div>
            <div style={{ height:4, background:T.blush, borderRadius:4, marginTop:10, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:T.dusty, borderRadius:4, transition:"width 0.8s ease" }}/>
            </div>
          </Card>
          <Card>
            <SectionLabel>Paid Out</SectionLabel>
            <div className="cd" style={{ fontSize:28, fontWeight:700, color:T.navy }}>{inr(totPaid)}</div>
            <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>of {inr(totP)} planned</div>
            <button onClick={() => set("budget")} style={{ marginTop:10, fontSize:11, color:T.dusty, background:"none", border:"none", cursor:"pointer", fontWeight:600, padding:0 }}>View Budget →</button>
          </Card>
        </div>

        {/* Budget health */}
        <Card style={{ marginBottom:16 }}>
          <SectionLabel>Budget Health</SectionLabel>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[
              { l:"Total Planned", v:totP,           c:T.navy    },
              { l:"Committed",     v:totC,           c:T.warn    },
              { l:"Paid",          v:totPaid,        c:T.success },
              { l:"Remaining",     v:totP - totPaid, c:T.dusty   },
            ].map(b => (
              <div key={b.l} style={{ background:T.cream, borderRadius:10, padding:"10px 12px" }}>
                <div style={{ fontSize:9, color:T.muted, letterSpacing:1, textTransform:"uppercase" }}>{b.l}</div>
                <div className="cd" style={{ fontSize:18, fontWeight:700, color:b.c, marginTop:4 }}>{inr(b.v)}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Functions */}
        <SectionLabel>Function Schedule</SectionLabel>
        {[
          { date:"Sep 20 — Day 1", events:["Haldi (Day)", "Sagan", "Sangeet (Evening — Full Show 🎤)"], c:T.gold },
          { date:"Sep 21 — Day 2", events:["Combined Haldi (Morning)", "Wedding Ceremony (Night)"],   c:T.dusty },
        ].map(f => (
          <Card key={f.date} style={{ marginBottom:10, borderLeft:`3px solid ${f.c}` }}>
            <div className="cd" style={{ fontSize:16, fontWeight:600, color:T.navy, marginBottom:8 }}>{f.date}</div>
            {f.events.map(e => <div key={e} style={{ fontSize:13, color:T.charcoal, padding:"4px 0", borderBottom:`1px solid ${T.cream}` }}>· {e}</div>)}
          </Card>
        ))}

        {/* Urgent */}
        {urgent.length > 0 && (
          <div style={{ marginTop:16 }}>
            <SectionLabel right={`${urgent.length} urgent`}>This Month</SectionLabel>
            {urgent.map(t => (
              <Card key={t.id} style={{ marginBottom:8, borderLeft:`3px solid ${priColor(t.pri)}` }}>
                <div style={{ fontSize:13, fontWeight:500, color:T.charcoal }}>{t.title}</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>{t.owner} · {t.due}</div>
              </Card>
            ))}
            <button onClick={() => set("tasks")} style={{ width:"100%", padding:"10px", borderRadius:10, background:"none", border:`1px solid ${T.border}`, cursor:"pointer", fontSize:12, color:T.dusty, fontWeight:500 }}>
              View All Tasks →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: TASKS
// ═══════════════════════════════════════════════════════════════════════════════
function Tasks({ tasks, setTasks }) {
  const [fMonth,  setFMonth]  = useState("All");
  const [fStatus, setFStatus] = useState("All");
  const [adding,  setAdding]  = useState(false);
  const [nt, setNt] = useState({ title:"", cat:"Vendors", month:"June", owner:"Manan", pri:"P2", due:"", notes:"" });

  const months   = ["All","June","July","August","September"];
  const statuses = ["All","pending","in-progress","done"];

  const filtered = tasks.filter(t =>
    (fMonth==="All"  || t.month===fMonth) &&
    (fStatus==="All" || t.status===fStatus)
  );

  const toggle = id => setTasks(p => p.map(t => {
    if (t.id!==id) return t;
    const next = t.status==="done" ? "pending" : t.status==="pending" ? "in-progress" : "done";
    return { ...t, status:next };
  }));
  const upd = (id,f,v) => setTasks(p => p.map(t => t.id===id ? {...t,[f]:v} : t));
  const del = id => setTasks(p => p.filter(t => t.id!==id));
  const add = () => {
    if (!nt.title.trim()) return;
    setTasks(p => [...p, { ...nt, id:Date.now(), status:"pending" }]);
    setNt({ title:"", cat:"Vendors", month:"June", owner:"Manan", pri:"P2", due:"", notes:"" });
    setAdding(false);
  };

  const byMonth = {};
  filtered.forEach(t => { if (!byMonth[t.month]) byMonth[t.month]=[]; byMonth[t.month].push(t); });
  const done = tasks.filter(t => t.status==="done").length;

  return (
    <div style={{ paddingBottom:100 }}>
      <Header title="Tasks" sub={`${done}/${tasks.length} done`}/>
      <div style={{ padding:"16px 20px" }}>

        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:8 }}>
          {months.map(m => <Pill key={m} active={fMonth===m} onClick={() => setFMonth(m)}>{m}</Pill>)}
        </div>
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:12, marginBottom:12 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFStatus(s)} style={{
              padding:"5px 12px", borderRadius:20, border:`1px solid ${T.border}`, cursor:"pointer",
              whiteSpace:"nowrap", fontSize:11, fontWeight:500, textTransform:"capitalize",
              background: fStatus===s ? T.dusty : "transparent", color: fStatus===s ? T.white : T.muted,
            }}>{s}</button>
          ))}
        </div>

        <AddBtn onClick={() => setAdding(!adding)} label="+ Add Task" active={adding}/>

        {adding && (
          <Card style={{ marginBottom:14 }}>
            <input placeholder="Task title *" value={nt.title} onChange={e => setNt(p=>({...p,title:e.target.value}))}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:14, marginBottom:10, boxSizing:"border-box" }}/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
              {[
                { f:"month",  opts:["June","July","August","September"] },
                { f:"pri",    opts:["P1","P2","P3"] },
              ].map(x => (
                <select key={x.f} value={nt[x.f]} onChange={e => setNt(p=>({...p,[x.f]:e.target.value}))}
                  style={{ padding:"8px 10px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:12 }}>
                  {x.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              ))}
            </div>
            <input placeholder="Owner (Manan / Srishti / Captain…)" value={nt.owner} onChange={e => setNt(p=>({...p,owner:e.target.value}))}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, marginBottom:10, boxSizing:"border-box" }}/>
            <input type="date" value={nt.due} onChange={e => setNt(p=>({...p,due:e.target.value}))}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, marginBottom:12, boxSizing:"border-box" }}/>
            <button onClick={add} style={{ width:"100%", padding:"12px", borderRadius:10, background:T.dusty, color:T.white, border:"none", cursor:"pointer", fontSize:14, fontWeight:600 }}>Add Task</button>
          </Card>
        )}

        {Object.entries(byMonth).map(([month, items]) => (
          <div key={month} style={{ marginBottom:24 }}>
            <SectionLabel right={`${items.filter(t=>t.status==="done").length}/${items.length}`}>{month}</SectionLabel>
            {items.map(task => (
              <TaskCard key={task.id} task={task}
                onToggle={() => toggle(task.id)}
                onUpd={(f,v) => upd(task.id,f,v)}
                onDel={() => del(task.id)}/>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, onToggle, onUpd, onDel }) {
  const [exp, setExp] = useState(false);
  const done = task.status === "done";
  return (
    <div style={{
      background: done ? T.cream : T.white, borderRadius:14, padding:"12px 14px", marginBottom:8,
      border:`1px solid ${T.border}`, borderLeft:`3px solid ${priColor(task.pri)}`,
      opacity: done ? 0.6 : 1, transition:"all 0.2s",
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
        <button onClick={onToggle} style={{
          width:22, height:22, borderRadius:6,
          border:`2px solid ${statusColor(task.status)}`,
          background: done ? T.success : task.status==="in-progress" ? T.warn : "transparent",
          cursor:"pointer", flexShrink:0, marginTop:1,
          display:"flex", alignItems:"center", justifyContent:"center", color:T.white, fontSize:11,
        }}>{done ? "✓" : task.status==="in-progress" ? "–" : ""}</button>

        <div style={{ flex:1, minWidth:0 }}>
          <IE value={task.title} onChange={v => onUpd("title",v)}
            style={{ fontSize:13, fontWeight:500, color:T.charcoal, textDecoration: done?"line-through":"none" }}/>
          <div style={{ display:"flex", gap:8, marginTop:5, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontSize:10, color:T.muted, background:T.cream, padding:"2px 8px", borderRadius:8 }}>{task.cat}</span>
            <span style={{ fontSize:10, color:T.muted }}>{task.owner}</span>
            {task.due && <span style={{ fontSize:10, color:T.muted }}>📅 {task.due}</span>}
          </div>
        </div>
        <button onClick={() => setExp(!exp)} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted, fontSize:13, padding:"0 4px" }}>{exp?"▲":"▼"}</button>
      </div>

      {exp && (
        <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${T.cream}` }}>
          <div style={{ fontSize:11, color:T.muted, marginBottom:4 }}>Notes</div>
          <IE value={task.notes} onChange={v => onUpd("notes",v)} placeholder="Add notes…" multi style={{ fontSize:12, color:T.charcoal }}/>
          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            <select value={task.pri} onChange={e => onUpd("pri",e.target.value)}
              style={{ flex:1, padding:"7px 10px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:11 }}>
              <option value="P1">P1 — Critical</option>
              <option value="P2">P2 — Important</option>
              <option value="P3">P3 — Nice to have</option>
            </select>
            <button onClick={onDel} style={{ padding:"7px 14px", borderRadius:8, background:"none", border:`1px solid ${T.danger}`, color:T.danger, cursor:"pointer", fontSize:11, fontWeight:500 }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: BUDGET
// ═══════════════════════════════════════════════════════════════════════════════
function Budget({ budget, setBudget }) {
  const [adding, setAdding] = useState(false);
  const [nb, setNb] = useState({ cat:"", planned:0, committed:0, paid:0, icon:"💰" });

  const totP    = budget.reduce((s,b) => s+(+b.planned||0), 0);
  const totC    = budget.reduce((s,b) => s+(+b.committed||0), 0);
  const totPaid = budget.reduce((s,b) => s+(+b.paid||0), 0);
  const paidPct = totP > 0 ? (totPaid/totP)*100 : 0;
  const commPct = totP > 0 ? (totC/totP)*100 : 0;

  const upd = (id,f,v) => setBudget(p => p.map(b => b.id===id ? {...b,[f]:["cat","icon"].includes(f)?v:Number(v)||0} : b));
  const del = id => setBudget(p => p.filter(b => b.id!==id));
  const add = () => {
    if (!nb.cat.trim()) return;
    setBudget(p => [...p, { ...nb, id:Date.now(), planned:+nb.planned, committed:+nb.committed, paid:+nb.paid }]);
    setNb({ cat:"", planned:0, committed:0, paid:0, icon:"💰" });
    setAdding(false);
  };

  return (
    <div style={{ paddingBottom:100 }}>
      <Header title="Budget"/>
      <div style={{ padding:"16px 20px" }}>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {[
            { l:"Total Planned", v:totP,           i:0 },
            { l:"Committed",     v:totC,           c:T.warn },
            { l:"Paid Out",      v:totPaid,        c:T.success },
            { l:"Remaining",     v:totP-totPaid,   c:T.dusty },
          ].map((s,i) => (
            <div key={s.l} style={{ background:i===0?T.navy:T.white, borderRadius:14, padding:"14px 16px", border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:i===0?"rgba(255,255,255,0.45)":T.muted, marginBottom:6 }}>{s.l}</div>
              <div className="cd" style={{ fontSize:22, fontWeight:700, color:i===0?T.goldLight:s.c }}>{inr(s.v)}</div>
            </div>
          ))}
        </div>

        <Card style={{ marginBottom:16 }}>
          <SectionLabel>Budget Utilization</SectionLabel>
          <div style={{ background:T.cream, borderRadius:20, height:10, overflow:"hidden", position:"relative" }}>
            <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${commPct}%`, background:T.goldLight, borderRadius:20, transition:"width 0.8s" }}/>
            <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${paidPct}%`, background:T.dusty, borderRadius:20, transition:"width 0.8s" }}/>
          </div>
          <div style={{ display:"flex", gap:16, marginTop:8 }}>
            <span style={{ fontSize:11, color:T.dusty }}>● Paid {paidPct.toFixed(0)}%</span>
            <span style={{ fontSize:11, color:T.gold }}>● Committed {commPct.toFixed(0)}%</span>
          </div>
        </Card>

        <AddBtn onClick={() => setAdding(!adding)} label="+ Add Category" active={adding}/>

        {adding && (
          <Card style={{ marginBottom:14 }}>
            <input placeholder="Category name *" value={nb.cat} onChange={e => setNb(p=>({...p,cat:e.target.value}))}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:14, marginBottom:8, boxSizing:"border-box" }}/>
            {["planned","committed","paid"].map(f => (
              <input key={f} type="number" placeholder={`${f.charAt(0).toUpperCase()+f.slice(1)} (₹)`} value={nb[f]||""}
                onChange={e => setNb(p=>({...p,[f]:e.target.value}))}
                style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, marginBottom:8, boxSizing:"border-box" }}/>
            ))}
            <button onClick={add} style={{ width:"100%", padding:"12px", borderRadius:10, background:T.dusty, color:T.white, border:"none", cursor:"pointer", fontSize:14, fontWeight:600 }}>Add</button>
          </Card>
        )}

        <SectionLabel>Category Breakdown</SectionLabel>
        {budget.map(b => <BudgetRow key={b.id} item={b} onUpd={(f,v) => upd(b.id,f,v)} onDel={() => del(b.id)}/>)}

        <div style={{ background:T.navy, borderRadius:14, padding:"14px 16px", marginTop:8, display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:8, alignItems:"center" }}>
          <div className="cd" style={{ fontSize:13, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>TOTAL</div>
          {[totP, totC, totPaid].map((v,i) => (
            <div key={i} className="cd" style={{ fontSize:13, fontWeight:700, color:T.goldLight, textAlign:"right" }}>{inr(v)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BudgetRow({ item, onUpd, onDel }) {
  const [exp, setExp] = useState(false);
  return (
    <div style={{ background:T.white, borderRadius:12, padding:"12px 14px", marginBottom:8, border:`1px solid ${T.border}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => setExp(!exp)}>
        <span style={{ fontSize:18 }}>{item.icon}</span>
        <div style={{ flex:1 }}>
          <IE value={item.cat} onChange={v => onUpd("cat",v)} style={{ fontSize:13, fontWeight:500, color:T.charcoal }}/>
        </div>
        <div style={{ textAlign:"right" }}>
          <div className="cd" style={{ fontSize:15, fontWeight:700, color:T.navy }}>{inr(item.planned)}</div>
          {item.paid > 0 && <div style={{ fontSize:11, color:T.success }}>Paid {inr(item.paid)}</div>}
        </div>
        <span style={{ color:T.muted, fontSize:13, marginLeft:4 }}>{exp?"▲":"▼"}</span>
      </div>
      {item.planned > 0 && (
        <div style={{ marginTop:8, background:T.cream, borderRadius:4, height:3, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${item.planned>0?(item.paid/item.planned)*100:0}%`, background:T.dusty, borderRadius:4 }}/>
        </div>
      )}
      {exp && (
        <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${T.cream}` }}>
          {["planned","committed","paid"].map(f => (
            <div key={f} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:12, color:T.muted, textTransform:"capitalize", width:100 }}>{f} (₹)</span>
              <input type="number" value={item[f]} onChange={e => onUpd(f,e.target.value)}
                style={{ flex:1, maxWidth:160, padding:"6px 10px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, textAlign:"right" }}/>
            </div>
          ))}
          <button onClick={onDel} style={{ marginTop:6, padding:"6px 14px", borderRadius:8, background:"none", border:`1px solid ${T.danger}`, color:T.danger, cursor:"pointer", fontSize:11, fontWeight:500 }}>Delete Category</button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: VENDORS
// ═══════════════════════════════════════════════════════════════════════════════
function Vendors({ vendors, setVendors }) {
  const [adding, setAdding] = useState(false);
  const [nv, setNv] = useState({ name:"", cat:"Photography", status:"shortlisting", contact:"", total:0, advance:0, advDate:"", balance:0, balDate:"", deliverables:"", notes:"", contract:false });

  const STATUS_C = { confirmed:T.success, shortlisting:T.warn, negotiating:T.gold, booked:T.navy };
  const upd = (id,f,v) => setVendors(p => p.map(x => x.id===id ? {...x,[f]:v} : x));
  const del = id => setVendors(p => p.filter(v => v.id!==id));
  const add = () => {
    if (!nv.name.trim()) return;
    setVendors(p => [...p, { ...nv, id:Date.now(), total:+nv.total, advance:+nv.advance, balance:+nv.balance }]);
    setNv({ name:"", cat:"Photography", status:"shortlisting", contact:"", total:0, advance:0, advDate:"", balance:0, balDate:"", deliverables:"", notes:"", contract:false });
    setAdding(false);
  };

  const confirmed = vendors.filter(v => v.status==="confirmed").length;

  return (
    <div style={{ paddingBottom:100 }}>
      <Header title="Vendors" sub={`${confirmed}/${vendors.length} confirmed`}/>
      <div style={{ padding:"16px 20px" }}>

        <AddBtn onClick={() => setAdding(!adding)} label="+ Add Vendor" active={adding}/>

        {adding && (
          <Card style={{ marginBottom:14 }}>
            {[
              { ph:"Vendor name *",    f:"name"         },
              { ph:"Contact number",   f:"contact"      },
              { ph:"Deliverables",     f:"deliverables" },
              { ph:"Notes",            f:"notes"        },
            ].map(x => (
              <input key={x.f} placeholder={x.ph} value={nv[x.f]} onChange={e => setNv(p=>({...p,[x.f]:e.target.value}))}
                style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, marginBottom:8, boxSizing:"border-box" }}/>
            ))}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
              <select value={nv.cat} onChange={e => setNv(p=>({...p,cat:e.target.value}))}
                style={{ padding:"8px 10px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:12 }}>
                {["Photography","Cinematography","Content","Decor","Catering","Mehendi","Makeup","DJ & Sound","Lighting","Venue","Pandit","Other"].map(o => <option key={o}>{o}</option>)}
              </select>
              <select value={nv.status} onChange={e => setNv(p=>({...p,status:e.target.value}))}
                style={{ padding:"8px 10px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:12 }}>
                {["shortlisting","negotiating","booked","confirmed"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            {[{ ph:"Total Value (₹)", f:"total" },{ ph:"Advance Paid (₹)", f:"advance" },{ ph:"Balance Due (₹)", f:"balance" }].map(x => (
              <input key={x.f} type="number" placeholder={x.ph} value={nv[x.f]||""}
                onChange={e => setNv(p=>({...p,[x.f]:e.target.value}))}
                style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, marginBottom:8, boxSizing:"border-box" }}/>
            ))}
            <button onClick={add} style={{ width:"100%", padding:"12px", borderRadius:10, background:T.dusty, color:T.white, border:"none", cursor:"pointer", fontSize:14, fontWeight:600 }}>Add Vendor</button>
          </Card>
        )}

        {vendors.map(v => <VendorCard key={v.id} vendor={v} onUpd={(f,val) => upd(v.id,f,val)} onDel={() => del(v.id)} statusColors={STATUS_C}/>)}
      </div>
    </div>
  );
}

function VendorCard({ vendor, onUpd, onDel, statusColors }) {
  const [exp, setExp] = useState(false);
  const sc = statusColors[vendor.status] || T.muted;
  return (
    <div style={{ background:T.white, borderRadius:14, padding:"14px 16px", marginBottom:10, border:`1px solid ${T.border}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
        <div style={{ flex:1 }}>
          <IE value={vendor.name} onChange={v => onUpd("name",v)} style={{ fontSize:14, fontWeight:600, color:T.navy }}/>
          <div style={{ display:"flex", gap:8, marginTop:6, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ fontSize:10, background:T.cream, color:T.muted, padding:"2px 8px", borderRadius:8 }}>{vendor.cat}</span>
            <span style={{ fontSize:10, color:sc, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5 }}>● {vendor.status}</span>
            {vendor.contract && <span style={{ fontSize:10, color:T.success, fontWeight:500 }}>✓ Signed</span>}
          </div>
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          {vendor.total > 0 && <div className="cd" style={{ fontSize:15, fontWeight:700, color:T.charcoal }}>{inr(vendor.total)}</div>}
          {vendor.balance > 0 && <div style={{ fontSize:11, color:T.danger }}>Due {inr(vendor.balance)}</div>}
        </div>
        <button onClick={() => setExp(!exp)} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted, fontSize:13, padding:"0 4px", flexShrink:0 }}>{exp?"▲":"▼"}</button>
      </div>

      {exp && (
        <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${T.cream}` }}>
          {[
            { l:"Contact",      f:"contact",      ph:"+91 XXXXX XXXXX"      },
            { l:"Deliverables", f:"deliverables", ph:"What they deliver"     },
            { l:"Notes",        f:"notes",        ph:"Any notes…"            },
          ].map(x => (
            <div key={x.f} style={{ marginBottom:10 }}>
              <div style={{ fontSize:11, color:T.muted, marginBottom:3 }}>{x.l}</div>
              <IE value={vendor[x.f]||""} onChange={v => onUpd(x.f,v)} placeholder={x.ph} style={{ fontSize:13, color:T.charcoal }}/>
            </div>
          ))}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
            {[
              { l:"Total (₹)",       f:"total"   },
              { l:"Advance Paid (₹)",f:"advance" },
              { l:"Balance Due (₹)", f:"balance" },
            ].map(x => (
              <div key={x.f}>
                <div style={{ fontSize:11, color:T.muted, marginBottom:3 }}>{x.l}</div>
                <input type="number" value={vendor[x.f]||""} onChange={e => onUpd(x.f,+e.target.value)}
                  style={{ width:"100%", padding:"6px 10px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, boxSizing:"border-box" }}/>
              </div>
            ))}
            <div>
              <div style={{ fontSize:11, color:T.muted, marginBottom:3 }}>Balance Due Date</div>
              <input type="date" value={vendor.balDate||""} onChange={e => onUpd("balDate",e.target.value)}
                style={{ width:"100%", padding:"6px 10px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:12, boxSizing:"border-box" }}/>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <select value={vendor.status} onChange={e => onUpd("status",e.target.value)}
              style={{ flex:1, padding:"8px 10px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:12 }}>
              {["shortlisting","negotiating","booked","confirmed"].map(o => <option key={o}>{o}</option>)}
            </select>
            <button onClick={() => onUpd("contract",!vendor.contract)} style={{
              padding:"8px 12px", borderRadius:8,
              background: vendor.contract ? T.success : "transparent",
              border:`1px solid ${vendor.contract ? T.success : T.border}`,
              color: vendor.contract ? T.white : T.muted, cursor:"pointer", fontSize:11, fontWeight:500,
            }}>✓ Contract</button>
            <button onClick={onDel} style={{ padding:"8px 12px", borderRadius:8, background:"none", border:`1px solid ${T.danger}`, color:T.danger, cursor:"pointer", fontSize:11, fontWeight:500 }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: GUESTS — fully rebuilt, no crash
// ═══════════════════════════════════════════════════════════════════════════════
const SAMPLE_GUESTS = [
  { id:1, sno:1, name:"Rahul Sharma",  from:"Delhi",      side:"Groom", fn:"Wedding", hotel:"",        rsvp:"confirmed", notes:"" },
  { id:2, sno:2, name:"Priya Singh",   from:"Mumbai",     side:"Bride", fn:"Sangeet", hotel:"Hotel A", rsvp:"pending",   notes:"Veg" },
  { id:3, sno:3, name:"Amit Kapoor",   from:"Chandigarh", side:"Groom", fn:"Wedding", hotel:"Hotel B", rsvp:"confirmed", notes:"" },
];

function Guests() {
  const [gList,   setGList]   = useState(SAMPLE_GUESTS);
  const [adding,  setAdding]  = useState(false);
  const [search,  setSearch]  = useState("");
  const [fnFilter,setFnFilter]= useState("All");
  const [sideTab, setSideTab] = useState("All");
  const [ng, setNg] = useState({ name:"", from:"", side:"Groom", fn:"Wedding", hotel:"", rsvp:"pending", notes:"" });
  const fileRef = useRef();

  const RSVP_C = { confirmed:T.success, pending:T.warn, declined:T.danger };
  const FNS    = ["All","Wedding","Sangeet","Mehendi","Haldi"];
  const SIDES  = ["All","Groom","Bride"];

  const filtered = gList.filter(g => {
    const matchSide = sideTab === "All" || g.side === sideTab;
    const matchFn   = fnFilter === "All" || g.fn === fnFilter;
    const q = search.toLowerCase();
    const matchQ = !q || g.name.toLowerCase().includes(q) || (g.from||"").toLowerCase().includes(q);
    return matchSide && matchFn && matchQ;
  });

  const addG = () => {
    if (!ng.name.trim()) return;
    setGList(p => [...p, { ...ng, id:Date.now(), sno:p.length+1 }]);
    setNg({ name:"", from:"", side:"Groom", fn:"Wedding", hotel:"", rsvp:"pending", notes:"" });
    setAdding(false);
  };
  const delG = id => setGList(p => p.filter(g => g.id!==id));
  const updG = (id,f,v) => setGList(p => p.map(g => g.id===id ? {...g,[f]:v} : g));

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = new Uint8Array(ev.target.result);
        const wb   = XLSX.read(data, { type:"array" });
        const ws   = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws);
        const mapped = rows.map((r,i) => ({
          id:   Date.now()+i,
          sno:  r["S.No"]||r["sno"]||r["serial"]||gList.length+i+1,
          name: String(r["Name"]||r["name"]||"").trim(),
          from: String(r["From"]||r["from"]||r["City"]||r["city"]||"").trim(),
          side: r["Side"]||r["side"]||"Groom",
          fn:   r["Function"]||r["fn"]||"Wedding",
          hotel:String(r["Hotel"]||r["hotel"]||"").trim(),
          rsvp: String(r["RSVP"]||r["rsvp"]||"pending").toLowerCase(),
          notes:String(r["Notes"]||r["notes"]||"").trim(),
        })).filter(r => r.name);
        setGList(p => [...p, ...mapped]);
        alert(`✓ ${mapped.length} guests imported!`);
      } catch(err) {
        alert("Could not read file. Download and use the template provided.");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const downloadTemplate = () => {
    try {
      const ws = XLSX.utils.aoa_to_sheet([
        ["S.No","Name","From","Side","Function","Hotel","RSVP","Notes"],
        [1,"Rahul Sharma","Delhi","Groom","Wedding","Hotel A","confirmed",""],
        [2,"Priya Singh","Mumbai","Bride","Sangeet","Hotel B","pending","Vegetarian"],
        [3,"Amit Kapoor","Chandigarh","Groom","Haldi","","pending",""],
      ]);
      ws["!cols"] = [6,22,16,10,12,14,12,22].map(w=>({wch:w}));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Guests");
      XLSX.writeFile(wb, "MS_Wedding_Guest_Template.xlsx");
    } catch(err) {
      alert("Template download failed. Please try again.");
    }
  };

  const exportList = () => {
    try {
      const rows = gList.map(g => ({
        "S.No":g.sno, "Name":g.name, "From":g.from, "Side":g.side,
        "Function":g.fn, "Hotel":g.hotel, "RSVP":g.rsvp, "Notes":g.notes,
      }));
      const ws = XLSX.utils.json_to_sheet(rows);
      ws["!cols"] = [6,22,16,10,12,14,12,22].map(w=>({wch:w}));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Guests");
      XLSX.writeFile(wb, "MS_Wedding_Guests.xlsx");
    } catch(err) {
      alert("Export failed. Please try again.");
    }
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const total     = gList.length;
  const confirmed = gList.filter(g=>g.rsvp==="confirmed").length;
  const pending   = gList.filter(g=>g.rsvp==="pending").length;
  const declined  = gList.filter(g=>g.rsvp==="declined").length;
  const groomSide = gList.filter(g=>g.side==="Groom").length;
  const brideSide = gList.filter(g=>g.side==="Bride").length;
  const confPct   = total > 0 ? (confirmed/total)*100 : 0;

  const fnCounts = ["Wedding","Sangeet","Mehendi","Haldi"].map(f=>({
    f, n:gList.filter(g=>g.fn===f).length,
    icon:f==="Wedding"?"💍":f==="Sangeet"?"🎵":f==="Mehendi"?"🌿":"💛",
  }));

  return (
    <div style={{ paddingBottom:100 }}>
      <Header title="Guests" sub={`${total} total`}/>
      <div style={{ padding:"16px 20px" }}>

        {/* ── Big RSVP stats ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:14 }}>
          {[
            { l:"Total",     v:total,     c:T.navy    },
            { l:"Coming",    v:confirmed, c:T.success },
            { l:"Pending",   v:pending,   c:T.warn    },
            { l:"Declined",  v:declined,  c:T.danger  },
          ].map(s=>(
            <div key={s.l} style={{ background:T.white, borderRadius:12, padding:"10px 8px", border:`1px solid ${T.border}`, textAlign:"center" }}>
              <div className="cd" style={{ fontSize:22, fontWeight:700, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:9, color:T.muted, marginTop:3, textTransform:"uppercase", letterSpacing:0.8 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ── RSVP progress bar ── */}
        <Card style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:11, color:T.muted, fontWeight:500 }}>RSVP Progress</span>
            <span style={{ fontSize:11, color:T.success, fontWeight:600 }}>{confPct.toFixed(0)}% confirmed</span>
          </div>
          <div style={{ background:T.cream, borderRadius:20, height:10, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${confPct}%`, background:`linear-gradient(90deg,${T.success},${T.dusty})`, borderRadius:20, transition:"width 0.6s" }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
            <span style={{ fontSize:10, color:T.muted }}>🤵 Groom side: {groomSide}</span>
            <span style={{ fontSize:10, color:T.muted }}>👰 Bride side: {brideSide}</span>
          </div>
        </Card>

        {/* ── Function breakdown ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
          {fnCounts.map(f=>(
            <Card key={f.f} style={{ padding:"10px 14px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:10, color:T.muted, textTransform:"uppercase", letterSpacing:1 }}>{f.f}</div>
                  <div className="cd" style={{ fontSize:22, fontWeight:700, color:T.navy, marginTop:2 }}>{f.n}</div>
                </div>
                <span style={{ fontSize:24, opacity:0.6 }}>{f.icon}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Hotel rooms ── */}
        <div style={{ background:T.navy, borderRadius:14, padding:"12px 18px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", letterSpacing:2, textTransform:"uppercase" }}>Hotel Rooms</div>
            <div className="cd" style={{ fontSize:26, color:T.goldLight, fontWeight:700, marginTop:2 }}>80 Booked</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2 }}>40 Groom · 40 Bride</div>
          </div>
          <span style={{ fontSize:36, opacity:0.12 }}>🏨</span>
        </div>

        {/* ── Upload / Export / Template ── */}
        <Card style={{ marginBottom:14 }}>
          <div className="cd" style={{ fontSize:14, fontWeight:700, color:T.navy, marginBottom:6 }}>📤 Excel Tools</div>
          <div style={{ fontSize:11, color:T.muted, marginBottom:12, lineHeight:1.6 }}>
            Columns: <strong style={{ color:T.charcoal }}>S.No · Name · From · Side · Function · Hotel · RSVP · Notes</strong>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            <button onClick={downloadTemplate} style={{ padding:"9px 4px", borderRadius:10, background:T.cream, border:`1px solid ${T.border}`, cursor:"pointer", fontSize:11, color:T.charcoal, fontWeight:500 }}>
              ⬇ Template
            </button>
            <button onClick={()=>fileRef.current.click()} style={{ padding:"9px 4px", borderRadius:10, background:T.dusty, border:"none", cursor:"pointer", fontSize:11, color:T.white, fontWeight:600 }}>
              ⬆ Upload
            </button>
            <button onClick={exportList} style={{ padding:"9px 4px", borderRadius:10, background:T.navy, border:"none", cursor:"pointer", fontSize:11, color:T.white, fontWeight:600 }}>
              ⬇ Export
            </button>
          </div>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} style={{ display:"none" }}/>
        </Card>

        {/* ── Side tabs ── */}
        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          {SIDES.map(s=>(
            <button key={s} onClick={()=>setSideTab(s)} style={{
              flex:1, padding:"9px", borderRadius:10, border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
              background:sideTab===s?T.navy:T.cream, color:sideTab===s?T.white:T.muted, transition:"all 0.2s",
            }}>
              {s==="All"?"All Guests":s==="Groom"?"🤵 Groom":"👰 Bride"}
            </button>
          ))}
        </div>

        {/* ── Function filter ── */}
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:10, marginBottom:12 }}>
          {FNS.map(f=><Pill key={f} active={fnFilter===f} onClick={()=>setFnFilter(f)}>{f}</Pill>)}
        </div>

        {/* ── Search ── */}
        <input placeholder="🔍  Search by name or city…" value={search} onChange={e=>setSearch(e.target.value)}
          style={{ width:"100%", padding:"10px 14px", borderRadius:12, border:`1px solid ${T.border}`, fontSize:13, marginBottom:12, boxSizing:"border-box", background:T.white }}/>

        <AddBtn onClick={()=>setAdding(!adding)} label="+ Add Guest" active={adding}/>

        {adding && (
          <Card style={{ marginBottom:14 }}>
            <input placeholder="Full name *" value={ng.name} onChange={e=>setNg(p=>({...p,name:e.target.value}))}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:14, marginBottom:8, boxSizing:"border-box" }}/>
            <input placeholder="Coming from (city)" value={ng.from} onChange={e=>setNg(p=>({...p,from:e.target.value}))}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, marginBottom:8, boxSizing:"border-box" }}/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
              <select value={ng.side} onChange={e=>setNg(p=>({...p,side:e.target.value}))}
                style={{ padding:"8px 10px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:12 }}>
                <option>Groom</option><option>Bride</option>
              </select>
              <select value={ng.fn} onChange={e=>setNg(p=>({...p,fn:e.target.value}))}
                style={{ padding:"8px 10px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:12 }}>
                <option>Wedding</option><option>Sangeet</option><option>Mehendi</option><option>Haldi</option>
              </select>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
              <input placeholder="Hotel assigned" value={ng.hotel} onChange={e=>setNg(p=>({...p,hotel:e.target.value}))}
                style={{ padding:"8px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:12, boxSizing:"border-box" }}/>
              <select value={ng.rsvp} onChange={e=>setNg(p=>({...p,rsvp:e.target.value}))}
                style={{ padding:"8px 10px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:12 }}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <button onClick={addG} style={{ width:"100%", padding:"12px", borderRadius:10, background:T.dusty, color:T.white, border:"none", cursor:"pointer", fontSize:14, fontWeight:600 }}>Add Guest</button>
          </Card>
        )}

        {/* ── Guest list ── */}
        <SectionLabel right={`${filtered.length} shown`}>Guest List</SectionLabel>

        {filtered.length===0 && (
          <div style={{ textAlign:"center", padding:"40px 20px", color:T.muted, fontSize:13 }}>
            {total===0 ? "No guests yet — add one above or upload Excel" : "No guests match your filters"}
          </div>
        )}

        {filtered.map(g=>(
          <div key={g.id} style={{
            background:T.white, borderRadius:12, padding:"12px 14px", marginBottom:8,
            border:`1px solid ${T.border}`,
            borderLeft:`3px solid ${g.side==="Groom"?T.navy:T.dusty}`,
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:9, color:T.muted, fontWeight:700, flexShrink:0 }}>#{g.sno}</span>
                  <IE value={g.name} onChange={v=>updG(g.id,"name",v)} style={{ fontSize:13, fontWeight:600, color:T.charcoal }}/>
                </div>
                <div style={{ display:"flex", gap:8, marginTop:4, flexWrap:"wrap", alignItems:"center" }}>
                  {g.from&&<span style={{ fontSize:10, color:T.muted }}>📍{g.from}</span>}
                  <span style={{ fontSize:10, background:g.side==="Groom"?T.navy+"22":T.dusty+"22", color:g.side==="Groom"?T.navy:T.dusty, padding:"1px 6px", borderRadius:6, fontWeight:500 }}>{g.side}</span>
                  <span style={{ fontSize:10, color:T.muted }}>· {g.fn}</span>
                  {g.hotel&&<span style={{ fontSize:10, color:T.muted }}>🏨 {g.hotel}</span>}
                </div>
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
                <select value={g.rsvp} onChange={e=>updG(g.id,"rsvp",e.target.value)} style={{
                  padding:"4px 6px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:10,
                  background:(RSVP_C[g.rsvp]||T.muted)+"22", color:RSVP_C[g.rsvp]||T.muted, fontWeight:700,
                }}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Coming ✓</option>
                  <option value="declined">Declined</option>
                </select>
                <button onClick={()=>delG(g.id)} style={{ background:"none", border:"none", cursor:"pointer", color:T.danger, fontSize:18, padding:"0 2px", lineHeight:1 }}>×</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: FAMILY
// ═══════════════════════════════════════════════════════════════════════════════
function Family() {
  const [caps, setCaps] = useState(INIT_CAPTAINS);
  const upd = (id,f,v) => setCaps(p => p.map(c => c.id===id ? {...c,[f]:v} : c));

  return (
    <div style={{ paddingBottom:100 }}>
      <Header title="Family HQ"/>
      <div style={{ padding:"16px 20px" }}>

        <Card style={{ marginBottom:16 }}>
          <div style={{ fontSize:13, color:T.charcoal, lineHeight:1.7 }}>
            Your large extended family is your <strong>biggest advantage</strong>. Assign one captain per module — they own their domain completely so you and Srishti stay in couple mode. 💍
          </div>
        </Card>

        {caps.map(c => (
          <div key={c.id} style={{ background:T.white, borderRadius:16, padding:20, marginBottom:14, border:`1px solid ${T.border}`, borderTop:`3px solid ${c.color}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
              <span style={{ fontSize:28 }}>{c.icon}</span>
              <div>
                <div className="cd" style={{ fontSize:16, fontWeight:700, color:T.navy }}>{c.role}</div>
                <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{c.desc}</div>
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10, color:T.muted, marginBottom:4, letterSpacing:1.5, textTransform:"uppercase" }}>Assigned To</div>
              <IE value={c.name} onChange={v => upd(c.id,"name",v)} placeholder="Tap to assign a name…"
                style={{ fontSize:16, fontWeight:700, color: c.name ? c.color : T.muted }}/>
            </div>
            <SectionLabel>Responsibilities</SectionLabel>
            {c.tasks.map((t,i) => (
              <div key={i} style={{ fontSize:12, color:T.charcoal, padding:"7px 10px", marginBottom:4, background:T.cream, borderRadius:8 }}>✦ {t}</div>
            ))}
          </div>
        ))}

        <Card>
          <div className="cd" style={{ fontSize:14, fontWeight:700, color:T.navy, marginBottom:12 }}>Guest Count by Function</div>
          {[
            { f:"Wedding",  n:"550–600" },
            { f:"Sangeet",  n:"250–300" },
            { f:"Mehendi",  n:"150–200" },
            { f:"Haldi",    n:"100–150" },
          ].map(x => (
            <div key={x.f} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${T.cream}` }}>
              <span style={{ fontSize:13, color:T.charcoal }}>{x.f}</span>
              <span className="cd" style={{ fontSize:14, fontWeight:600, color:T.dusty }}>{x.n}</span>
            </div>
          ))}
          <div style={{ marginTop:12, fontSize:12, color:T.muted }}>Hotel rooms: <strong style={{ color:T.charcoal }}>80 booked (40 per family)</strong></div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN: PHOTOGRAPHY + DUBAI
// ═══════════════════════════════════════════════════════════════════════════════
function Photography() {
  const [tab, setTab] = useState("wedding");
  const [wNotes, setWNotes] = useState({ photographer:"", cinematographer:"", contentCreator:"", deliveryTimeline:"", shotList:"" });
  const [dubai, setDubai] = useState({
    dates:"August 15–25, 2026", photographer:"", budget:"₹2,50,000",
    notes:"Manan is based in Dubai. Srishti visiting for shoot + permanent move after wedding.",
    locations:[
      { name:"Downtown Dubai / Burj Khalifa", sel:true  },
      { name:"Al Fahidi Historic District",   sel:true  },
      { name:"Desert at Golden Hour",         sel:true  },
      { name:"JBR / Bluewaters Beachfront",   sel:false },
      { name:"Museum of the Future",          sel:false },
      { name:"Alserkal Avenue",               sel:false },
      { name:"Jumeirah Mosque Area",          sel:false },
      { name:"Dubai Frame",                   sel:false },
    ],
    outfits:[
      { look:"Look 1", desc:"Ethnic Formal — Lehenga + Sherwani", status:"pending"     },
      { look:"Look 2", desc:"Western Elegant — Dress + Suit",     status:"pending"     },
      { look:"Look 3", desc:"Casual / Relaxed — Matching co-ord", status:"pending"     },
    ],
  });

  const togLoc  = i => setDubai(p => ({ ...p, locations:p.locations.map((l,x) => x===i ? {...l,sel:!l.sel} : l) }));
  const cycleOut= i => setDubai(p => ({ ...p, outfits:p.outfits.map((o,x) => x===i ? {...o,status:o.status==="pending"?"in-progress":o.status==="in-progress"?"done":"pending"} : o) }));
  const SC = { pending:T.muted, "in-progress":T.warn, done:T.success };

  return (
    <div style={{ paddingBottom:100 }}>
      <Header title="Photography"/>
      <div style={{ padding:"0 20px 16px" }}>

        {/* Tabs */}
        <div style={{ display:"flex", gap:8, padding:"16px 0 14px" }}>
          {[{ id:"wedding", label:"📷 Wedding" },{ id:"dubai", label:"✈️ Dubai Shoot" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1, padding:"11px", borderRadius:12, border:"none", cursor:"pointer", fontSize:13, fontWeight:600,
              background: tab===t.id ? T.navy : T.cream, color: tab===t.id ? T.white : T.muted, transition:"all 0.2s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── WEDDING TAB ── */}
        {tab==="wedding" && (
          <>
            <Card style={{ marginBottom:12 }}>
              <div className="cd" style={{ fontSize:15, fontWeight:700, color:T.navy, marginBottom:12 }}>Coverage Team</div>
              {[
                { l:"Photographer",       f:"photographer",    ph:"Name / Studio" },
                { l:"Cinematographer",    f:"cinematographer", ph:"Name / Studio" },
                { l:"Content Creator",    f:"contentCreator",  ph:"Name / handle" },
                { l:"Delivery Timeline",  f:"deliveryTimeline",ph:"e.g. 30 days post-wedding" },
              ].map(x => (
                <div key={x.f} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${T.cream}` }}>
                  <span style={{ fontSize:12, color:T.muted, minWidth:120 }}>{x.l}</span>
                  <div style={{ flex:1, textAlign:"right" }}>
                    <IE value={wNotes[x.f]} onChange={v => setWNotes(p=>({...p,[x.f]:v}))} placeholder={x.ph}
                      style={{ fontSize:13, color:T.charcoal, textAlign:"right" }}/>
                  </div>
                </div>
              ))}
            </Card>

            <Card style={{ marginBottom:12 }}>
              <div className="cd" style={{ fontSize:15, fontWeight:700, color:T.navy, marginBottom:10 }}>Shot List & Notes</div>
              <IE value={wNotes.shotList} onChange={v => setWNotes(p=>({...p,shotList:v}))} multi
                placeholder="Add must-have shots, family groupings, special moments…" style={{ fontSize:13, color:T.charcoal }}/>
            </Card>

            <Card>
              <div className="cd" style={{ fontSize:15, fontWeight:700, color:T.navy, marginBottom:12 }}>Deliverables Checklist</div>
              {[
                "Edited photo album (500+ photos)",
                "Wedding film (8–10 min)",
                "Sangeet highlight reel",
                "Instagram reels — 3 to 5 short",
                "Same-day edit (SDE) — optional",
                "BTS content from content creator",
                "Drone footage — if venue allows",
              ].map((d,i) => (
                <div key={i} style={{ fontSize:13, color:T.charcoal, padding:"8px 0", borderBottom:`1px solid ${T.cream}`, display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ color:T.dusty, fontWeight:700 }}>·</span> {d}
                </div>
              ))}
            </Card>
          </>
        )}

        {/* ── DUBAI TAB ── */}
        {tab==="dubai" && (
          <>
            <div style={{
              background:`linear-gradient(135deg, ${T.navy} 0%, #2E4A7A 100%)`,
              borderRadius:20, padding:"22px 20px", marginBottom:14, position:"relative", overflow:"hidden",
            }}>
              <div style={{ position:"absolute", top:-20, right:-20, fontSize:80, opacity:0.05 }}>✈️</div>
              <div style={{ fontSize:10, letterSpacing:3, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginBottom:6 }}>Pre-Wedding Shoot</div>
              <div className="cd" style={{ fontSize:28, color:T.white, fontWeight:700 }}>Dubai ✦ August</div>
              <div style={{ fontSize:13, color:T.goldLight, marginTop:6 }}>Manan × Srishti in the city of gold</div>
            </div>

            <Card style={{ marginBottom:12 }}>
              <SectionLabel>Shoot Details</SectionLabel>
              {[{ l:"Shoot Window", f:"dates" },{ l:"Photographer", f:"photographer" },{ l:"Budget", f:"budget" }].map(x => (
                <div key={x.f} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${T.cream}` }}>
                  <span style={{ fontSize:12, color:T.muted }}>{x.l}</span>
                  <div style={{ flex:1, maxWidth:180, textAlign:"right" }}>
                    <IE value={dubai[x.f]} onChange={v => setDubai(p=>({...p,[x.f]:v}))} placeholder="Tap to fill…"
                      style={{ fontSize:13, color:T.charcoal, textAlign:"right" }}/>
                  </div>
                </div>
              ))}
            </Card>

            <Card style={{ marginBottom:12 }}>
              <SectionLabel right={`${dubai.locations.filter(l=>l.sel).length} selected`}>Location Shortlist</SectionLabel>
              {dubai.locations.map((loc,i) => (
                <div key={i} onClick={() => togLoc(i)} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${T.cream}`, cursor:"pointer" }}>
                  <div style={{
                    width:20, height:20, borderRadius:6, flexShrink:0,
                    border:`2px solid ${loc.sel ? T.gold : T.border}`, background: loc.sel ? T.gold : "transparent",
                    display:"flex", alignItems:"center", justifyContent:"center", color:T.white, fontSize:11,
                  }}>{loc.sel?"✓":""}</div>
                  <span style={{ fontSize:13, color: loc.sel ? T.charcoal : T.muted }}>{loc.name}</span>
                </div>
              ))}
            </Card>

            <Card style={{ marginBottom:12 }}>
              <SectionLabel>Outfit Planning</SectionLabel>
              {dubai.outfits.map((o,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom: i<2 ? `1px solid ${T.cream}` : "none" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, color:T.gold, fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>{o.look}</div>
                    <div style={{ fontSize:13, color:T.charcoal, marginTop:2 }}>{o.desc}</div>
                  </div>
                  <button onClick={() => cycleOut(i)} style={{
                    padding:"5px 12px", borderRadius:20, border:"none", cursor:"pointer", fontSize:11,
                    background: SC[o.status]+"22", color:SC[o.status], fontWeight:600,
                  }}>{o.status}</button>
                </div>
              ))}
            </Card>

            <Card>
              <SectionLabel>Notes</SectionLabel>
              <IE value={dubai.notes} onChange={v => setDubai(p=>({...p,notes:v}))} multi style={{ fontSize:13, color:T.charcoal }}/>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen,   setScreen]   = useState("home");
  const [tasks,    setTasks]    = useState(INIT_TASKS);
  const [budget,   setBudget]   = useState(INIT_BUDGET);
  const [vendors,  setVendors]  = useState(INIT_VENDORS);

  const screens = {
    home:        <Home tasks={tasks} budget={budget} set={setScreen}/>,
    tasks:       <Tasks tasks={tasks} setTasks={setTasks}/>,
    budget:      <Budget budget={budget} setBudget={setBudget}/>,
    vendors:     <Vendors vendors={vendors} setVendors={setVendors}/>,
    guests:      <Guests/>,
    family:      <Family/>,
    photography: <Photography/>,
  };

  return (
    <>
      <style>{FONT_INJECT}</style>
      <div style={{ maxWidth:480, margin:"0 auto", minHeight:"100vh", background:T.cream, position:"relative" }}>
        {screens[screen]}
        <BottomNav active={screen} set={setScreen}/>
      </div>
    </>
  );
}
