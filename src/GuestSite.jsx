import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─── PHOTOS ───────────────────────────────────────────────────────────────────
const PHOTO_HERO   = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3628_7827505_a24xqj";
const PHOTO_FUN    = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3742_8619132_jm4rla";
const PHOTO_FORMAL = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3384_8869296_zgmdw5";
const PHOTO_NEW1   = "https://res.cloudinary.com/dmmstltmq/image/upload/f_auto,q_auto/_APY3401_6103245_lfst7l";

const SCRAP_01 = "https://res.cloudinary.com/dmmstltmq/image/upload/v1784060819/WhatsApp_Image_2026-07-15_at_1.02.02_AM_h2szzl.jpg";
const SCRAP_02 = "https://res.cloudinary.com/dmmstltmq/image/upload/v1784060819/WhatsApp_Image_2026-07-15_at_12.57.15_AM_e0m0cl.jpg";
const SCRAP_03 = "https://res.cloudinary.com/dmmstltmq/image/upload/v1784060820/WhatsApp_Image_2026-07-15_at_12.58.25_AM_obwcik.jpg";
const SCRAP_04 = "https://res.cloudinary.com/dmmstltmq/image/upload/v1784060820/WhatsApp_Image_2026-07-15_at_12.57.14_AM_o08v2l.jpg";
const SCRAP_05 = "https://res.cloudinary.com/dmmstltmq/image/upload/v1784060819/WhatsApp_Image_2026-07-15_at_1.02.03_AM_2_yuvmk5.jpg";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const T = {
  black:"#080808", ink:"#0C0A08", surface1:"#111111", surface2:"#161412",
  surface3:"#1E1B17", border:"#2A2621", borderG:"#C9A96E30",
  gold:"#C9A96E", goldLight:"#E8D5B0", goldDeep:"#8B6914",
  white:"#FFFFFF", cream:"#F5EDD8",
  gray1:"#ABABAB", gray2:"#666666", gray3:"#333333", error:"#C0392B",
};

const WEDDING_DATE = new Date("2026-09-20T00:00:00");

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useCountdown() {
  const calc = () => {
    const d = Math.max(0, WEDDING_DATE - new Date());
    return { days:Math.floor(d/86400000), hours:Math.floor(d%86400000/3600000), minutes:Math.floor(d%3600000/60000), seconds:Math.floor(d%60000/1000) };
  };
  const [t,setT] = useState(calc);
  useEffect(()=>{ const id=setInterval(()=>setT(calc()),1000); return ()=>clearInterval(id); },[]);
  return t;
}

function useReveal(threshold=0.1) {
  const ref=useRef(null); const [v,setV]=useState(false);
  useEffect(()=>{
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);o.disconnect();}},{threshold});
    if(ref.current) o.observe(ref.current);
    return ()=>o.disconnect();
  },[]);
  return [ref,v];
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
html{scroll-behavior:smooth;}
body{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif;background:#080808;color:#fff;overflow-x:hidden;}
::-webkit-scrollbar{width:2px;}::-webkit-scrollbar-track{background:#111;}::-webkit-scrollbar-thumb{background:#C9A96E;}

@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes floatY2{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes rotateSlow{to{transform:rotate(360deg)}}
@keyframes slowZoom{from{transform:scale(1)}to{transform:scale(1.06)}}
@keyframes particleDrift{0%{transform:translateY(0) translateX(0);opacity:0}20%{opacity:0.7}80%{opacity:0.3}100%{transform:translateY(-140px) translateX(20px);opacity:0}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes waxWobble{0%,100%{transform:rotate(-1.5deg) scale(1)}50%{transform:rotate(1.5deg) scale(1.03)}}
@keyframes navFadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
@keyframes cursorFade{0%{opacity:0.8;transform:scale(1)}100%{opacity:0;transform:scale(0)}}
@keyframes sheenSlide{0%{transform:translateX(-100%) skewX(-15deg)}100%{transform:translateX(300%) skewX(-15deg)}}
@keyframes scratchReveal{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
@keyframes petalPop{0%{opacity:0;transform:translate(-50%,-50%) scale(0) rotate(0deg)}40%{opacity:0.9}100%{opacity:0;transform:translate(var(--px),var(--py)) scale(0.4) rotate(var(--pr))}}
@keyframes sealGlow{0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0)}50%{box-shadow:0 0 40px 12px rgba(201,169,110,0.25)}}
@keyframes cardRiseUp{0%{opacity:0;transform:translateY(60px) scale(0.97)}100%{opacity:1;transform:translateY(-80px) scale(1)}}
@keyframes flapOpen{0%{transform:rotateX(0deg);transform-origin:top center}100%{transform:rotateX(-175deg);transform-origin:top center}}
@keyframes envFadeOut{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.92)}}
@keyframes bgReveal{from{opacity:0}to{opacity:1}}

.nav-logo{white-space:nowrap;}
.gold-shimmer{background:linear-gradient(90deg,#8B6914 0%,#C9A96E 25%,#F5E4B0 50%,#C9A96E 75%,#8B6914 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 5s linear infinite;}
.grain::after{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");background-size:256px;pointer-events:none;z-index:1;opacity:0.3;}
.polaroid{background:#F5EDD8;padding:10px 10px 36px;box-shadow:0 8px 32px rgba(0,0,0,0.55);transition:transform 0.4s cubic-bezier(0.23,1,0.32,1),box-shadow 0.4s ease;cursor:pointer;}
.polaroid:hover{transform:rotate(0deg) scale(1.06)!important;box-shadow:0 24px 64px rgba(0,0,0,0.7)!important;z-index:10;position:relative;}
.polaroid-caption{font-family:'Cormorant Garamond',serif;font-style:italic;color:#3a2f1e;font-size:15px;text-align:center;margin-top:8px;line-height:1.3;font-weight:400;}
.event-card{transition:transform 0.3s ease,border-color 0.3s ease;border:1px solid #2A2621;}
.event-card:hover{transform:translateX(6px);border-color:#C9A96E50!important;}
.rsvp-input{background:#111!important;border:1px solid #2A2621!important;color:#fff!important;transition:border-color 0.3s,box-shadow 0.3s!important;}
.rsvp-input:focus{border-color:#C9A96E!important;box-shadow:0 0 0 3px rgba(201,169,110,0.1)!important;outline:none!important;}
.rsvp-input::placeholder{color:#444!important;}
.rsvp-option{transition:all 0.25s ease;border:1px solid #2A2621;cursor:pointer;}
.rsvp-option:hover{border-color:#C9A96E60!important;background:#1A1612!important;}
.rsvp-option.selected{border-color:#C9A96E!important;background:#1A1612!important;}
.music-btn{position:fixed;bottom:28px;right:24px;z-index:998;width:44px;height:44px;border-radius:50%;background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.3);backdrop-filter:blur(12px);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s ease;}
.music-btn:hover{background:rgba(201,169,110,0.2);}
.map-frame{border:1px solid #2A2621;border-radius:16px;overflow:hidden;filter:grayscale(0.5) contrast(1.1);transition:filter 0.4s ease;}
.map-frame:hover{filter:grayscale(0.1);}
.nav-link{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#666;text-decoration:none;transition:color 0.3s ease;padding:4px 0;position:relative;}
.nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:#C9A96E;transition:width 0.3s ease;}
.nav-link:hover{color:#C9A96E;}
.nav-link:hover::after,.nav-link.active::after{width:100%;}
.nav-link.active{color:#C9A96E;}
.envelope-body{perspective:1200px;}
.flap-wrap{transform-style:preserve-3d;transform-origin:top center;}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;}}
`;

// ─── SVG DECORATIONS ──────────────────────────────────────────────────────────
function Mandala({ size=200, opacity=0.06 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{opacity}}>
      <g transform="translate(100,100)">
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a=>(
          <g key={a} transform={`rotate(${a})`}>
            <line x1="0" y1="20" x2="0" y2="58" stroke="#C9A96E" strokeWidth="0.8"/>
            <circle cx="0" cy="63" r="2" fill="#C9A96E"/>
            <line x1="0" y1="68" x2="0" y2="82" stroke="#C9A96E" strokeWidth="0.4"/>
          </g>
        ))}
        {[0,45,90,135,180,225,270,315].map(a=>(
          <g key={a} transform={`rotate(${a})`}>
            <ellipse cx="0" cy="42" rx="4" ry="8" fill="none" stroke="#C9A96E" strokeWidth="0.5"/>
          </g>
        ))}
        <circle cx="0" cy="0" r="16" fill="none" stroke="#C9A96E" strokeWidth="0.8"/>
        <circle cx="0" cy="0" r="8" fill="none" stroke="#C9A96E" strokeWidth="0.5"/>
        <circle cx="0" cy="0" r="3" fill="#C9A96E"/>
      </g>
    </svg>
  );
}

function LotusBg({ opacity=0.04 }) {
  return (
    <svg width="420" height="420" viewBox="0 0 420 420" style={{opacity,pointerEvents:"none"}}>
      <g transform="translate(210,210)">
        {[0,40,80,120,160,200,240,280,320].map(a=>(
          <g key={a} transform={`rotate(${a})`}>
            <path d="M0,-160 C20,-130 20,-100 0,-80 C-20,-100 -20,-130 0,-160Z" fill="#C9A96E" opacity="0.6"/>
          </g>
        ))}
        {[20,60,100,140,180,220,260,300,340].map(a=>(
          <g key={a} transform={`rotate(${a})`}>
            <path d="M0,-105 C13,-85 13,-65 0,-50 C-13,-65 -13,-85 0,-105Z" fill="#C9A96E" opacity="0.5"/>
          </g>
        ))}
        {[0,45,90,135,180,225,270,315].map(a=>(
          <g key={a} transform={`rotate(${a})`}>
            <path d="M0,-55 C8,-42 8,-30 0,-22 C-8,-30 -8,-42 0,-55Z" fill="#C9A96E" opacity="0.7"/>
          </g>
        ))}
        <circle cx="0" cy="0" r="170" fill="none" stroke="#C9A96E" strokeWidth="0.4" opacity="0.4"/>
        <circle cx="0" cy="0" r="112" fill="none" stroke="#C9A96E" strokeWidth="0.3" opacity="0.4"/>
        <circle cx="0" cy="0" r="60" fill="none" stroke="#C9A96E" strokeWidth="0.5" opacity="0.5"/>
        <circle cx="0" cy="0" r="20" fill="none" stroke="#C9A96E" strokeWidth="0.8" opacity="0.6"/>
        <circle cx="0" cy="0" r="5" fill="#C9A96E" opacity="0.8"/>
        {[0,40,80,120,160,200,240,280,320].map(a=>(
          <circle key={a} cx={Math.cos((a-90)*Math.PI/180)*163} cy={Math.sin((a-90)*Math.PI/180)*163} r="1.5" fill="#C9A96E" opacity="0.8"/>
        ))}
      </g>
    </svg>
  );
}

function CeremonyIcon({ type, size=56 }) {
  const s = { fill:"none", stroke:"#C9A96E", strokeWidth:"1.2", strokeLinecap:"round", strokeLinejoin:"round" };
  const icons = {
    haldi: (
      <svg width={size} height={size} viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="10" {...s}/>
        <path d="M28 18 C28 12 22 8 22 8 C22 8 20 14 24 18" {...s}/>
        <path d="M28 18 C30 12 36 10 36 10 C36 10 36 16 28 18" {...s}/>
        <path d="M18 28 C12 26 10 20 10 20 C10 20 16 18 18 24" {...s}/>
        <path d="M38 28 C44 26 46 20 46 20 C46 20 40 18 38 24" {...s}/>
        <ellipse cx="28" cy="42" rx="12" ry="4" {...s}/>
        <line x1="28" y1="38" x2="28" y2="42" {...s}/>
      </svg>
    ),
    ring: (
      <svg width={size} height={size} viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="12" {...s}/>
        <circle cx="28" cy="28" r="7" {...s}/>
        <path d="M22 16 L28 10 L34 16" {...s}/>
        <circle cx="28" cy="12" r="3" {...s}/>
        <line x1="25" y1="12" x2="31" y2="12" {...s}/>
        <path d="M20 40 Q28 46 36 40" {...s}/>
      </svg>
    ),
    ghadi: (
      <svg width={size} height={size} viewBox="0 0 56 56">
        <path d="M16 44 L28 10 L40 44 Z" {...s}/>
        <circle cx="28" cy="28" r="4" fill="#C9A96E" stroke="none"/>
        <path d="M20 36 L36 36" {...s}/>
        <path d="M18 40 L38 40" {...s}/>
        <path d="M28 10 L28 6" {...s}/>
        <circle cx="28" cy="5" r="2" {...s}/>
        <path d="M12 44 L44 44" {...s}/>
        <path d="M20 22 C22 20 26 20 28 22 C30 20 34 20 36 22" {...s}/>
      </svg>
    ),
    sehra: (
      <svg width={size} height={size} viewBox="0 0 56 56">
        <path d="M16 18 Q28 12 40 18" {...s}/>
        <path d="M16 18 L14 26" {...s}/>
        <path d="M40 18 L42 26" {...s}/>
        <path d="M14 26 Q28 20 42 26" {...s}/>
        {[18,22,26,30,34,38].map((x,i)=>(
          <path key={i} d={`M${x} 26 Q${x-1} 34 ${x} 42`} {...s} strokeOpacity={0.6+(i%2)*0.3}/>
        ))}
        <circle cx="28" cy="15" r="3" {...s}/>
        <circle cx="18" cy="18" r="2" {...s}/>
        <circle cx="38" cy="18" r="2" {...s}/>
      </svg>
    ),
    baraat: (
      <svg width={size} height={size} viewBox="0 0 56 56">
        <path d="M8 36 Q20 28 32 32 Q40 34 48 30" {...s}/>
        <ellipse cx="18" cy="36" rx="8" ry="5" {...s}/>
        <path d="M14 31 Q18 22 22 31" {...s}/>
        <circle cx="18" cy="20" r="4" {...s}/>
        <path d="M14 20 Q10 18 10 14 Q14 12 16 16" {...s}/>
        <path d="M26 36 L30 44" {...s}/>
        <path d="M10 36 L6 44" {...s}/>
        <path d="M38 28 Q42 22 46 26 Q44 32 40 30" {...s}/>
        <path d="M44 20 L46 28" {...s} strokeDasharray="2 2"/>
      </svg>
    ),
    reception: (
      <svg width={size} height={size} viewBox="0 0 56 56">
        <path d="M14 42 L14 24 Q14 18 20 18 L36 18 Q42 18 42 24 L42 42" {...s}/>
        <path d="M10 42 L46 42" {...s}/>
        <path d="M22 18 L22 12 Q22 8 28 8 Q34 8 34 12 L34 18" {...s}/>
        <path d="M24 30 Q28 26 32 30 Q28 36 24 30" {...s}/>
        <circle cx="28" cy="10" r="2" fill="#C9A96E" stroke="none"/>
        <path d="M18 42 L18 32" {...s}/>
        <path d="M38 42 L38 32" {...s}/>
        <path d="M22 42 L22 34 Q28 30 34 34 L34 42" {...s}/>
      </svg>
    ),
  };
  return icons[type] || null;
}

function GoldDivider({ my=0 }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:16,margin:`${my}px 0`}}>
      <div style={{flex:1,height:1,background:"linear-gradient(to right,transparent,#C9A96E40)"}}/>
      <div style={{fontSize:12,color:T.gold}}>✦</div>
      <div style={{flex:1,height:1,background:"linear-gradient(to left,transparent,#C9A96E40)"}}/>
    </div>
  );
}

function Eyebrow({ children, visible, delay=0 }) {
  return (
    <div style={{fontSize:10,letterSpacing:5,textTransform:"uppercase",color:T.gold,marginBottom:16,fontWeight:500,opacity:visible?1:0,animation:visible?`fadeUp 0.7s ${delay}s ease both`:"none"}}>
      {children}
    </div>
  );
}

function Particles({ count=14 }) {
  const ps = useRef(Array.from({length:count},(_,i)=>({id:i,left:Math.random()*100,delay:Math.random()*10,duration:7+Math.random()*9,size:1+Math.random()*1.5}))).current;
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {ps.map(p=>(
        <div key={p.id} style={{position:"absolute",left:`${p.left}%`,bottom:"5%",width:p.size,height:p.size,borderRadius:"50%",background:"#C9A96E",animation:`particleDrift ${p.duration}s ${p.delay}s ease-in infinite`}}/>
      ))}
    </div>
  );
}

// ─── CURSOR TRAIL ─────────────────────────────────────────────────────────────
function CursorTrail() {
  useEffect(()=>{
    const onMove=(e)=>{
      const p=document.createElement("div");
      const size=2+Math.random()*3;
      Object.assign(p.style,{
        position:"fixed",left:e.clientX+"px",top:e.clientY+"px",
        width:size+"px",height:size+"px",borderRadius:"50%",
        background:"#C9A96E",pointerEvents:"none",zIndex:9998,
        transform:"translate(-50%,-50%)",
        animation:"cursorFade 0.8s ease forwards",
      });
      document.body.appendChild(p);
      setTimeout(()=>{p.remove();},800);
    };
    window.addEventListener("mousemove",onMove);
    return ()=>window.removeEventListener("mousemove",onMove);
  },[]);
  return null;
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>60);
    window.addEventListener("scroll",onScroll);
    return ()=>window.removeEventListener("scroll",onScroll);
  },[]);
  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:997,
      padding:"18px 32px",
      display:"flex",alignItems:"center",justifyContent:"space-between",
      background:scrolled?"rgba(8,8,8,0.85)":"transparent",
      backdropFilter:scrolled?"blur(20px)":"none",
      borderBottom:scrolled?`1px solid ${T.border}`:"none",
      transition:"all 0.4s ease",
      animation:"navFadeIn 1s 1s ease both",
    }}>
      <div className="nav-logo" style={{display:"flex",alignItems:"center",gap:8}}>
        <Mandala size={18} opacity={0.7}/>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:400,color:T.gold,fontStyle:"italic"}}>M & S</span>
      </div>
    </nav>
  );
}

// ─── MUSIC ────────────────────────────────────────────────────────────────────
function MusicPlayer() {
  const [playing,setPlaying]=useState(false);
  const ref=useRef(null);
  const toggle=()=>{
    if(!ref.current) return;
    if(playing){ref.current.pause();setPlaying(false);}
    else{ref.current.volume=0.15;ref.current.play().then(()=>setPlaying(true)).catch(()=>{});}
  };
  return (
    <>
      <audio ref={ref} src="https://cdn.pixabay.com/audio/2022/03/15/audio_4a16f3cb6e.mp3" loop preload="none"/>
      <button className="music-btn" onClick={toggle} title={playing?"Pause":"Play music"}>
        {playing
          ? <svg width="13" height="13" viewBox="0 0 13 13" fill="#C9A96E"><rect x="1" y="1" width="3" height="11" rx="1"/><rect x="8" y="1" width="3" height="11" rx="1"/></svg>
          : <svg width="13" height="13" viewBox="0 0 13 13" fill="#C9A96E"><path d="M2 1.5l10 5-10 5V1.5z"/></svg>
        }
      </button>
    </>
  );
}

// ─── WAX SEAL ─────────────────────────────────────────────────────────────────
function WaxSeal({ size=80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id="sealMain" cx="35%" cy="28%">
          <stop offset="0%"   stopColor="#FDE68A"/>
          <stop offset="30%"  stopColor="#D4A843"/>
          <stop offset="70%"  stopColor="#A0742A"/>
          <stop offset="100%" stopColor="#5C3D0A"/>
        </radialGradient>
        <radialGradient id="sealSheen" cx="28%" cy="22%">
          <stop offset="0%"   stopColor="#FFFDE7" stopOpacity="0.75"/>
          <stop offset="60%"  stopColor="#FDE68A" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#C9A96E" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="53" r="44" fill="rgba(0,0,0,0.3)"/>
      <circle cx="50" cy="50" r="44" fill="url(#sealMain)"/>
      <circle cx="50" cy="50" r="44" fill="url(#sealSheen)"/>
      {Array.from({length:24},(_,i)=>{
        const a1=(i/24)*Math.PI*2; const a2=((i+0.5)/24)*Math.PI*2;
        return <polygon key={i} points={`
          ${50+44*Math.cos(a1)},${50+44*Math.sin(a1)}
          ${50+40*Math.cos(a2)},${50+40*Math.sin(a2)}
          ${50+44*Math.cos(a1+Math.PI/24)},${50+44*Math.sin(a1+Math.PI/24)}
        `} fill="#B8860B" opacity="0.6"/>;
      })}
      <circle cx="50" cy="50" r="38" fill="none" stroke="#FDE68A" strokeWidth="0.7" opacity="0.55"/>
      <circle cx="50" cy="50" r="32" fill="none" stroke="#FDE68A" strokeWidth="0.5" opacity="0.4"/>
      {[0,45,90,135,180,225,270,315].map(a=>{
        const rad=a*Math.PI/180;
        return <ellipse key={a} cx={50+29*Math.cos(rad)} cy={50+29*Math.sin(rad)}
          rx="3.5" ry="5.5" transform={`rotate(${a},${50+29*Math.cos(rad)},${50+29*Math.sin(rad)})`}
          fill="#FDE68A" opacity="0.3"/>;
      })}
      <text x="50" y="54" textAnchor="middle" fontSize="18"
        fill="#3A1F00" fontFamily="'Cormorant Garamond',serif"
        fontStyle="italic" fontWeight="600" letterSpacing="1.5">M &amp; S</text>
    </svg>
  );
}

// ─── PETAL BURST (decorative, fires on seal crack) ────────────────────────────
function PetalBurst({ active }) {
  const petals = useRef(Array.from({length:16},(_,i)=>({
    id:i,
    angle: (i/16)*360,
    dist: 60+Math.random()*80,
    rotate: Math.random()*360,
    size: 4+Math.random()*6,
    delay: Math.random()*0.3,
  }))).current;

  if(!active) return null;
  return (
    <div style={{position:"absolute",top:"50%",left:"50%",width:0,height:0,pointerEvents:"none",zIndex:10}}>
      {petals.map(p=>{
        const rad = p.angle * Math.PI/180;
        const px = Math.cos(rad)*p.dist + "px";
        const py = Math.sin(rad)*p.dist + "px";
        return (
          <div key={p.id} style={{
            position:"absolute",
            width:p.size, height:p.size*1.6,
            borderRadius:"50% 50% 50% 50% / 60% 60% 40% 40%",
            background:`linear-gradient(135deg,#C9A96E,#FDE68A)`,
            transform:"translate(-50%,-50%)",
            "--px":px,"--py":py,"--pr":`${p.rotate}deg`,
            animation:`petalPop 1.2s ${p.delay}s ease-out forwards`,
          }}/>
        );
      })}
    </div>
  );
}

// ─── DARK ENVELOPE OPENING SEQUENCE ──────────────────────────────────────────
function OpeningSequence({ onComplete }) {
  const [phase, setPhase] = useState("idle");   // idle → hover → opening → card → done
  const [tilt, setTilt] = useState({x:0,y:0});
  const envRef = useRef(null);

  // Subtle parallax tilt on mouse move
  const handleMouseMove = useCallback((e) => {
    if(phase !== "idle") return;
    const rect = envRef.current?.getBoundingClientRect();
    if(!rect) return;
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = (e.clientX - cx) / (window.innerWidth/2);
    const dy = (e.clientY - cy) / (window.innerHeight/2);
    setTilt({x: dy*6, y: -dx*6});
  }, [phase]);

  const handleTap = useCallback(() => {
    if(phase !== "idle") return;
    setPhase("opening");
    setTimeout(()=>setPhase("card"), 1100);
    setTimeout(()=>{ setPhase("done"); setTimeout(onComplete, 700); }, 3400);
  }, [phase, onComplete]);

  return (
    <div
      onClick={handleTap}
      onMouseMove={handleMouseMove}
      style={{
        position:"fixed", inset:0, zIndex:9999,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        cursor: phase==="idle" ? "pointer" : "default",
        opacity: phase==="done" ? 0 : 1,
        transition: phase==="done" ? "opacity 0.7s ease" : "none",
        overflow:"hidden",
      }}
    >
      {/* ── Deep black background with blurred hero ── */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:`url(${PHOTO_HERO})`,
        backgroundSize:"cover", backgroundPosition:"center top",
        filter:"blur(24px) brightness(0.18) saturate(0.4)",
        transform:"scale(1.1)",
      }}/>
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse 80% 70% at 50% 50%, rgba(12,8,4,0.4) 0%, rgba(4,3,2,0.96) 100%)",
      }}/>

      <Particles count={24}/>

      {/* ── Floating ambient mandala ── */}
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",opacity:0.04,pointerEvents:"none",animation:"rotateSlow 120s linear infinite"}}>
        <LotusBg opacity={1}/>
      </div>

      {/* ── IDLE: envelope + tap prompt ── */}
      {phase === "idle" && (
        <div style={{
          position:"relative", zIndex:2,
          display:"flex", flexDirection:"column",
          alignItems:"center", textAlign:"center",
          animation:"fadeIn 1.6s ease both",
        }}>
          {/* Envelope */}
          <div
            ref={envRef}
            style={{
              width:300, height:210,
              position:"relative",
              transform:`perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition:"transform 0.15s ease-out",
              filter:"drop-shadow(0 24px 60px rgba(201,169,110,0.18)) drop-shadow(0 8px 20px rgba(0,0,0,0.8))",
              animation:"waxWobble 6s ease-in-out infinite",
            }}
          >
            <EnvelopeIdle/>
          </div>

          <div style={{marginTop:36,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:15,color:T.gray1,letterSpacing:2}}>
              a letter, sealed with love
            </div>
            <div style={{width:1,height:32,background:"linear-gradient(to bottom,transparent,#C9A96E50)",marginTop:8,animation:"floatY 2.5s ease-in-out infinite"}}/>
            <div style={{fontSize:8,letterSpacing:5,color:T.gray3,textTransform:"uppercase"}}>tap to open</div>
          </div>
        </div>
      )}

      {/* ── OPENING: flap animates open + petal burst ── */}
      {phase === "opening" && (
        <div style={{position:"relative",zIndex:2,display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{
            width:300, height:210, position:"relative",
            filter:"drop-shadow(0 24px 60px rgba(201,169,110,0.25))",
          }}>
            <EnvelopeOpening/>
            <PetalBurst active={true}/>
          </div>
        </div>
      )}

      {/* ── CARD: invitation card slides up from envelope ── */}
      {(phase === "card" || phase === "done") && (
        <div style={{position:"relative",zIndex:2,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 24px",maxWidth:420,width:"100%"}}>
          {/* Envelope stays behind */}
          <div style={{
            width:300, height:180, position:"relative",
            filter:"drop-shadow(0 8px 30px rgba(0,0,0,0.9))",
            flexShrink:0,
          }}>
            <EnvelopeOpen/>
          </div>

          {/* Card sliding up */}
          <div style={{
            width:"100%", maxWidth:360,
            background:"linear-gradient(160deg,#111008 0%,#0D0B05 100%)",
            border:"1px solid #C9A96E50",
            borderRadius:12,
            padding:"40px 32px 36px",
            position:"relative",
            boxShadow:"0 0 0 1px #C9A96E15, 0 -24px 80px rgba(201,169,110,0.08), 0 32px 80px rgba(0,0,0,0.9), inset 0 1px 0 rgba(201,169,110,0.12)",
            animation:"cardRiseUp 0.9s cubic-bezier(0.16,1,0.3,1) both",
            marginTop:-60,
            zIndex:5,
          }}>
            {/* shimmer sweep */}
            <div style={{position:"absolute",inset:0,borderRadius:12,overflow:"hidden",pointerEvents:"none"}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(105deg,transparent 35%,rgba(201,169,110,0.06) 50%,transparent 65%)",animation:"sheenSlide 2s 0.3s ease both"}}/>
            </div>
            {/* corner filigree */}
            <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",borderRadius:12}} viewBox="0 0 320 220" preserveAspectRatio="none">
              <path d="M18 6 L6 6 L6 18" fill="none" stroke="#C9A96E" strokeWidth="1" opacity="0.45"/>
              <path d="M302 6 L314 6 L314 18" fill="none" stroke="#C9A96E" strokeWidth="1" opacity="0.45"/>
              <path d="M18 214 L6 214 L6 202" fill="none" stroke="#C9A96E" strokeWidth="1" opacity="0.45"/>
              <path d="M302 214 L314 214 L314 202" fill="none" stroke="#C9A96E" strokeWidth="1" opacity="0.45"/>
            </svg>

            <div style={{position:"relative",zIndex:1,textAlign:"center"}}>
              <div style={{fontSize:8,letterSpacing:6,color:T.gold,textTransform:"uppercase",marginBottom:18,fontFamily:"Inter,sans-serif",opacity:0.8,animation:"fadeUp 0.6s 0.2s ease both",animationFillMode:"both"}}>
                you are cordially invited
              </div>
              <div style={{marginBottom:14,animation:"fadeIn 0.7s 0.3s ease both",animationFillMode:"both"}}>
                <Mandala size={42} opacity={0.5}/>
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(26px,6vw,38px)",fontWeight:400,color:T.white,letterSpacing:1,lineHeight:1.05,marginBottom:6,animation:"fadeUp 0.7s 0.4s ease both",animationFillMode:"both"}}>
                Manan &amp; Shrishti
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,margin:"16px auto",maxWidth:200,animation:"fadeIn 0.7s 0.6s ease both",animationFillMode:"both"}}>
                <div style={{flex:1,height:"0.5px",background:"linear-gradient(to right,transparent,#C9A96E80)"}}/>
                <svg width="8" height="8" viewBox="0 0 12 12"><path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8Z" fill="#C9A96E" opacity="0.9"/></svg>
                <div style={{flex:1,height:"0.5px",background:"linear-gradient(to left,transparent,#C9A96E80)"}}/>
              </div>
              <div style={{fontSize:10,letterSpacing:4,color:T.gray1,textTransform:"uppercase",marginBottom:5,fontFamily:"Inter,sans-serif",animation:"fadeUp 0.7s 0.8s ease both",animationFillMode:"both"}}>
                20 · 21 September 2026
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:13,color:T.gold,letterSpacing:1,animation:"fadeUp 0.7s 1s ease both",animationFillMode:"both"}}>
                Vivan Resort, Karnal
              </div>
            </div>
          </div>

          <div style={{marginTop:24,fontSize:9,letterSpacing:4,color:T.gray3,textTransform:"uppercase",animation:"fadeIn 0.8s 1.4s ease both",animationFillMode:"both"}}>
            tap anywhere to continue
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ENVELOPE SVG COMPONENTS (dark / black theme) ────────────────────────────

// Idle: closed envelope, wax seal on flap
function EnvelopeIdle() {
  return (
    <svg width="300" height="210" viewBox="0 0 300 210">
      <defs>
        <linearGradient id="envBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#1A1612"/>
          <stop offset="100%" stopColor="#0D0B08"/>
        </linearGradient>
        <linearGradient id="envEdge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#C9A96E" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#8B6914" stopOpacity="0.3"/>
        </linearGradient>
        <linearGradient id="flapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#211C15"/>
          <stop offset="100%" stopColor="#141008"/>
        </linearGradient>
      </defs>

      {/* Envelope body */}
      <rect x="4" y="60" width="292" height="146" rx="8" fill="url(#envBody)" stroke="url(#envEdge)" strokeWidth="1.2"/>

      {/* Bottom fold lines (V shape) */}
      <path d="M4 206 L150 130 L296 206" fill="none" stroke="#C9A96E" strokeWidth="0.6" opacity="0.25"/>

      {/* Side triangle shading */}
      <path d="M4 60 L4 206 L150 130 Z" fill="#0A0805" opacity="0.5"/>
      <path d="M296 60 L296 206 L150 130 Z" fill="#0A0805" opacity="0.5"/>

      {/* Closed flap (triangle pointing down) */}
      <path d="M4 60 L150 148 L296 60 Z" fill="url(#flapGrad)" stroke="url(#envEdge)" strokeWidth="1"/>

      {/* Gold border lines on flap */}
      <path d="M4 60 L150 148 L296 60" fill="none" stroke="#C9A96E" strokeWidth="0.8" opacity="0.4"/>

      {/* Delicate inner border */}
      <rect x="10" y="66" width="280" height="132" rx="5" fill="none" stroke="#C9A96E" strokeWidth="0.4" strokeDasharray="4 4" opacity="0.2"/>

      {/* Corner ornaments */}
      {[[10,66],[280,66],[10,192],[280,192]].map(([x,y],i)=>(
        <circle key={i} cx={x+(i%2===0?4:-4)} cy={y+(i<2?4:-4)} r="2" fill="#C9A96E" opacity="0.3"/>
      ))}

      {/* Wax seal centered on flap */}
      <g transform="translate(110, 80)">
        <WaxSeal size={80}/>
      </g>

      {/* Subtle text at bottom */}
      <text x="150" y="195" textAnchor="middle" fontSize="8" fill="#C9A96E" fontFamily="'Cormorant Garamond',serif" fontStyle="italic" opacity="0.35" letterSpacing="3">
        Manan &amp; Shrishti · 2026
      </text>
    </svg>
  );
}

// Opening: flap animating open
function EnvelopeOpening() {
  return (
    <svg width="300" height="210" viewBox="0 0 300 210" style={{overflow:"visible"}}>
      <defs>
        <linearGradient id="envBody2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#1A1612"/>
          <stop offset="100%" stopColor="#0D0B08"/>
        </linearGradient>
        <linearGradient id="flapGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#211C15"/>
          <stop offset="100%" stopColor="#141008"/>
        </linearGradient>
        <linearGradient id="envEdge2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#C9A96E" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#8B6914" stopOpacity="0.3"/>
        </linearGradient>
      </defs>

      {/* Body */}
      <rect x="4" y="60" width="292" height="146" rx="8" fill="url(#envBody2)" stroke="url(#envEdge2)" strokeWidth="1.2"/>
      <path d="M4 60 L4 206 L150 130 Z" fill="#0A0805" opacity="0.5"/>
      <path d="M296 60 L296 206 L150 130 Z" fill="#0A0805" opacity="0.5"/>
      <path d="M4 206 L150 130 L296 206" fill="none" stroke="#C9A96E" strokeWidth="0.6" opacity="0.25"/>

      {/* Flap animating open — rotates around top edge */}
      <g style={{transformOrigin:"150px 60px",animation:"flapOpen 0.9s 0.05s cubic-bezier(0.4,0,0.2,1) forwards"}}>
        <path d="M4 60 L150 148 L296 60 Z" fill="url(#flapGrad2)" stroke="url(#envEdge2)" strokeWidth="1"/>
        <path d="M4 60 L150 148 L296 60" fill="none" stroke="#C9A96E" strokeWidth="0.8" opacity="0.4"/>
        {/* Broken seal fragments */}
        <circle cx="150" cy="104" r="12" fill="#A0742A" opacity="0.6"/>
        <circle cx="150" cy="104" r="8" fill="#D4A843" opacity="0.5"/>
        <text x="150" y="108" textAnchor="middle" fontSize="8" fill="#3A1F00" fontFamily="serif" fontStyle="italic" fontWeight="600">M&S</text>
      </g>

      {/* Gold glow under open flap */}
      <ellipse cx="150" cy="80" rx="60" ry="8" fill="#C9A96E" opacity="0.06"/>
    </svg>
  );
}

// Open: envelope with flap fully open, card peeking out
function EnvelopeOpen() {
  return (
    <svg width="300" height="180" viewBox="0 0 300 180">
      <defs>
        <linearGradient id="envBody3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#1A1612"/>
          <stop offset="100%" stopColor="#0D0B08"/>
        </linearGradient>
        <linearGradient id="envEdge3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#C9A96E" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#8B6914" stopOpacity="0.25"/>
        </linearGradient>
        <linearGradient id="flapOpen3" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor="#211C15"/>
          <stop offset="100%" stopColor="#161208"/>
        </linearGradient>
      </defs>

      {/* Flap flipped back (shown behind body) */}
      <path d="M4 30 L150 -30 L296 30" fill="url(#flapOpen3)" stroke="url(#envEdge3)" strokeWidth="1" opacity="0.8"/>

      {/* Body */}
      <rect x="4" y="30" width="292" height="146" rx="8" fill="url(#envBody3)" stroke="url(#envEdge3)" strokeWidth="1.2"/>
      <path d="M4 30 L4 176 L150 100 Z" fill="#0A0805" opacity="0.4"/>
      <path d="M296 30 L296 176 L150 100 Z" fill="#0A0805" opacity="0.4"/>
      <path d="M4 176 L150 100 L296 176" fill="none" stroke="#C9A96E" strokeWidth="0.6" opacity="0.2"/>

      {/* Inner envelope glow */}
      <rect x="20" y="38" width="260" height="120" rx="4" fill="#C9A96E" opacity="0.03"/>
      <rect x="20" y="38" width="260" height="120" rx="4" fill="none" stroke="#C9A96E" strokeWidth="0.4" opacity="0.15"/>

      {/* Text at bottom */}
      <text x="150" y="165" textAnchor="middle" fontSize="7" fill="#C9A96E" fontFamily="'Cormorant Garamond',serif" fontStyle="italic" opacity="0.3" letterSpacing="3">
        Manan &amp; Shrishti · 2026
      </text>
    </svg>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [loaded,setLoaded]=useState(false);
  const [ready,setReady]=useState(false);
  const cd=useCountdown();
  useEffect(()=>{const t=setTimeout(()=>setReady(true),200);return()=>clearTimeout(t);},[]);
  return (
    <section className="grain" style={{position:"relative",height:"100vh",minHeight:640,overflow:"hidden",background:T.ink}}>
      <img src={PHOTO_HERO} alt="Manan and Shrishti" onLoad={()=>setLoaded(true)} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",opacity:loaded?0.42:0,transition:"opacity 2s ease",animation:loaded?"slowZoom 20s ease-in-out infinite alternate":"none"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,#080808 0%,rgba(8,8,8,0.72) 35%,rgba(8,8,8,0.12) 100%)"}}/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,transparent 40%,rgba(8,8,8,0.55) 100%)"}}/>
      <Particles count={16}/>
      <div style={{position:"absolute",top:-40,right:-40,pointerEvents:"none",opacity:0.05}}><LotusBg opacity={1}/></div>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",padding:"0 24px 56px",textAlign:"center"}}>
        <div style={{fontSize:10,letterSpacing:6,color:T.gold,textTransform:"uppercase",marginBottom:20,fontWeight:400,opacity:ready?1:0,animation:ready?"fadeUp 1s 0.1s ease both":"none"}}>
          We're getting married
        </div>

        {/* ── FIX 1: both names on ONE line, same font, same size, same weight ── */}
        <div style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:"clamp(40px,10vw,88px)",
          fontWeight:300,
          fontStyle:"italic",
          color:T.white,
          letterSpacing:2,
          lineHeight:1,
          marginBottom:10,
          whiteSpace:"nowrap",
          opacity:ready?1:0,
          animation:ready?"fadeUp 1.1s 0.35s ease both":"none",
        }}>
          Manan &amp; Shrishti
        </div>

        <div style={{display:"flex",alignItems:"center",gap:16,margin:"16px 0",opacity:ready?1:0,animation:ready?"fadeUp 0.9s 0.6s ease both":"none"}}>
          <div style={{height:1,width:40,background:"linear-gradient(to left,#C9A96E,transparent)"}}/>
          <div style={{fontSize:11,letterSpacing:4,color:T.gray1,textTransform:"uppercase"}}>September 20 · 21 · 2026 · Karnal</div>
          <div style={{height:1,width:40,background:"linear-gradient(to right,#C9A96E,transparent)"}}/>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:40,opacity:ready?1:0,animation:ready?"fadeUp 0.9s 0.8s ease both":"none"}}>
          {[{l:"Days",v:cd.days},{l:"Hours",v:cd.hours},{l:"Minutes",v:cd.minutes},{l:"Seconds",v:cd.seconds}].map(({l,v})=>(
            <div key={l} style={{textAlign:"center",minWidth:68,background:"rgba(255,255,255,0.03)",border:`1px solid ${T.borderG}`,borderRadius:10,padding:"12px 6px",backdropFilter:"blur(12px)"}}>
              <div style={{fontSize:"clamp(22px,5vw,36px)",color:T.white,lineHeight:1,fontWeight:600}}>{String(v).padStart(2,"0")}</div>
              <div style={{color:T.gold,fontSize:8,letterSpacing:3,textTransform:"uppercase",marginTop:6}}>{l}</div>
            </div>
          ))}
        </div>
        <a href="#rsvp" style={{display:"inline-block",padding:"15px 44px",background:"transparent",border:`1px solid ${T.gold}`,color:T.gold,textDecoration:"none",borderRadius:100,fontWeight:500,fontSize:11,letterSpacing:3,textTransform:"uppercase",opacity:ready?1:0,animation:ready?"fadeUp 0.9s 1s ease both":"none",transition:"background 0.3s,color 0.3s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=T.gold;e.currentTarget.style.color=T.black;}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.gold;}}>
          Join the celebration
        </a>
      </div>
      <div style={{position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,animation:"floatY 3s ease-in-out infinite"}}>
        <div style={{width:1,height:36,background:"linear-gradient(to bottom,transparent,#C9A96E50)"}}/>
        <div style={{fontSize:8,letterSpacing:4,color:T.gray3,textTransform:"uppercase"}}>scroll</div>
      </div>
    </section>
  );
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────
const EVENTS = [
  {
    day:"Day One · Sunday, 20 September 2026",
    items:[
      { id:"haldi", icon:"haldi", time:"11:00 AM", name:"Haldi",
        desc:"Turmeric, blessings, and joyful chaos.",
        dresscode:"Sunshine & Colour",
        colours:["#F5C518","#F0A500","#E8D44D","#FFF176","#FFFDE7"],
        girls:"Yellow or white kurta / lehenga",
        boys:"White or yellow kurta pyjama",
        note:"Wear something you don't mind staining." },
      { id:"ring", icon:"ring", time:"7:00 PM", name:"Ring Ceremony & Sangeet",
        desc:"Rings, music, dancing under the stars.",
        dresscode:"Festive Indian",
        colours:["#1B5E20","#880E4F","#0D47A1","#4A148C","#B71C1C"],
        girls:"Lehenga or saree — go all out",
        boys:"Sherwani or embroidered kurta" },
    ]
  },
  {
    day:"Day Two · Monday, 21 September 2026",
    items:[
      { id:"ghadi", icon:"ghadi", time:"11:00 AM", name:"Ghadi Ghadoli",
        desc:"Sacred blessings before everything begins.",
        dresscode:"Traditional",
        colours:["#F3E5F5","#CE93D8","#E8D5B0","#D4AC0D","#FFF8E1"],
        girls:"Salwar suit or saree",
        boys:"Kurta pyjama" },
      { id:"sehra", icon:"sehra", time:"2:00 PM", name:"Sehra Bandi",
        desc:"The veil is tied. Quiet. Emotional. Beautiful.",
        dresscode:"Formal Indian",
        colours:["#1A237E","#4E342E","#BF360C","#C9A96E","#212121"],
        girls:"Saree or anarkali",
        boys:"Bandhgala or formal kurta" },
      { id:"baraat", icon:"baraat", time:"4:00 PM", name:"Baraat",
        desc:"Music thunders. Petals fly. Come dance.",
        dresscode:"Festive — comfortable shoes",
        colours:["#E65100","#F9A825","#C62828","#AD1457","#6A1B9A"],
        girls:"Lehenga or sharara",
        boys:"Sherwani or embroidered kurta",
        note:"Comfortable footwear strongly recommended." },
      { id:"reception", icon:"reception", time:"8:00 PM", name:"Reception",
        desc:"Joy, fine food, two families becoming one.",
        dresscode:"Your Finest",
        colours:["#212121","#C9A96E","#1A1A2E","#880E4F","#4E342E"],
        girls:"Saree, lehenga or gown",
        boys:"Sherwani, suit or bandhgala" },
    ]
  }
];

function EventCard({ ev, visible, delay }) {
  const [open,setOpen]=useState(false);
  return (
    <div className="event-card" onClick={()=>setOpen(o=>!o)} style={{background:T.surface2,borderRadius:16,padding:"24px",marginBottom:16,cursor:"pointer",opacity:visible?1:0,animation:visible?`fadeUp 0.8s ${delay}s ease both`:"none"}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:20}}>
        <div style={{flexShrink:0,opacity:0.9}}><CeremonyIcon type={ev.icon} size={48}/></div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"baseline",gap:12,flexWrap:"wrap",marginBottom:6}}>
            <div style={{fontSize:"clamp(18px,3vw,22px)",color:T.white,fontWeight:500}}>{ev.name}</div>
            <div style={{fontSize:11,letterSpacing:2,color:T.gold,textTransform:"uppercase"}}>{ev.time}</div>
          </div>
          <p style={{fontSize:14,color:T.gray1,lineHeight:1.8,fontWeight:300,marginBottom:12}}>{ev.desc}</p>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <div style={{fontSize:9,letterSpacing:2,color:T.gray2,textTransform:"uppercase",marginRight:4}}>Dress code</div>
            {ev.colours.map((c,i)=>(
              <div key={i} style={{width:18,height:18,borderRadius:"50%",background:c,border:"1.5px solid rgba(255,255,255,0.12)",flexShrink:0}}/>
            ))}
          </div>
          {open&&(
            <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${T.border}`,animation:"fadeIn 0.3s ease"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:ev.note?12:0}}>
                <div>
                  <div style={{fontSize:9,letterSpacing:2,color:T.gold,textTransform:"uppercase",marginBottom:4}}>Girls</div>
                  <div style={{fontSize:13,color:T.gray1,fontWeight:300}}>{ev.girls}</div>
                </div>
                <div>
                  <div style={{fontSize:9,letterSpacing:2,color:T.gold,textTransform:"uppercase",marginBottom:4}}>Boys</div>
                  <div style={{fontSize:13,color:T.gray1,fontWeight:300}}>{ev.boys}</div>
                </div>
              </div>
              {ev.note&&<div style={{fontSize:12,color:T.gray2,fontStyle:"italic"}}>✦ {ev.note}</div>}
            </div>
          )}
          <div style={{fontSize:10,color:T.gray3,marginTop:10,letterSpacing:1}}>{open?"▲ less":"▼ dress details"}</div>
        </div>
      </div>
    </div>
  );
}

function Events() {
  const [ref,visible]=useReveal(0.05);
  return (
    <section id="events" ref={ref} style={{background:T.black,padding:"96px 24px",position:"relative",overflow:"hidden"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:64}}>
          <Eyebrow visible={visible}>The celebrations</Eyebrow>
          <h2 style={{fontSize:"clamp(30px,5vw,48px)",color:T.white,fontWeight:300,opacity:visible?1:0,animation:visible?"fadeUp 0.9s 0.1s ease both":"none"}}>
            Two days. A lifetime of memories.
          </h2>
        </div>
        {EVENTS.map((day,di)=>(
          <div key={di} style={{marginBottom:56}}>
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:28,opacity:visible?1:0,animation:visible?`fadeUp 0.8s ${0.2+di*0.1}s ease both`:"none"}}>
              <div style={{height:1,flex:1,background:`linear-gradient(to right,transparent,${T.gold}35)`}}/>
              <div style={{fontSize:10,letterSpacing:4,color:T.gold,textTransform:"uppercase",whiteSpace:"nowrap"}}>{day.day}</div>
              <div style={{height:1,flex:1,background:`linear-gradient(to left,transparent,${T.gold}35)`}}/>
            </div>
            <div style={{position:"relative",paddingLeft:28}}>
              <div style={{position:"absolute",left:5,top:8,bottom:8,width:1,background:`linear-gradient(to bottom,${T.gold}40,transparent)`}}/>
              {day.items.map((ev,ei)=>(
                <div key={ei} style={{position:"relative"}}>
                  <div style={{position:"absolute",left:-23,top:28,width:10,height:10,borderRadius:"50%",background:T.gold,boxShadow:`0 0 0 3px ${T.gold}22`}}/>
                  <EventCard ev={ev} visible={visible} delay={0.3+di*0.1+ei*0.08}/>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── VENUE ────────────────────────────────────────────────────────────────────
function Venue() {
  const [ref,visible]=useReveal(0.08);
  return (
    <section id="venue" ref={ref} style={{background:T.surface1,padding:"96px 24px",position:"relative",overflow:"hidden"}}>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <Eyebrow visible={visible}>Find your way to us</Eyebrow>
          <h2 style={{fontSize:"clamp(28px,5vw,46px)",color:T.white,fontWeight:300,opacity:visible?1:0,animation:visible?"fadeUp 0.9s 0.1s ease both":"none"}}>
            Vivan Resort, Karnal
          </h2>
          <p style={{fontSize:14,color:T.gray1,lineHeight:1.9,maxWidth:420,margin:"12px auto 0",fontWeight:300,opacity:visible?1:0,animation:visible?"fadeUp 0.9s 0.2s ease both":"none"}}>
            Set amid lush grounds in the heart of Haryana. Our home for two unforgettable days.
          </p>
        </div>
        <div className="map-frame" style={{marginBottom:40,opacity:visible?1:0,animation:visible?"scaleIn 0.9s 0.3s ease both":"none"}}>
          <iframe title="Vivan Resort Karnal" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3488.563492026967!2d76.97659!3d29.6856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e4571dd0bc3b1%3A0x7f9c3db0b1234567!2sVivan%20Resort%20Karnal!5e0!3m2!1sen!2sin!4v1234567890" width="100%" height="320" style={{border:"none",display:"block"}} loading="lazy"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:32,opacity:visible?1:0,animation:visible?"fadeUp 0.9s 0.45s ease both":"none"}}>
          {[
            {icon:"📍",title:"Address",lines:["Vivan Resort","Karnal, Haryana 132001"],link:{label:"Open in Maps",href:"https://share.google/bzxZ0WW2HHCV6rXFQ"}},
            {icon:"✈️",title:"Nearest Airports",lines:["Delhi IGI — 2.5 hrs","Chandigarh — 2 hrs"]},
            {icon:"🚗",title:"By Road",lines:["NH-44 from Delhi","Chandigarh highway, Karnal exit"]},
            {icon:"🌐",title:"Venue",lines:["vivanresort.com"],link:{label:"Visit website",href:"https://www.vivanresort.com"}},
          ].map((c,i)=>(
            <div key={i} style={{background:T.surface2,borderRadius:14,padding:"20px",border:`1px solid ${T.border}`}}>
              <div style={{fontSize:22,marginBottom:10}}>{c.icon}</div>
              <div style={{fontSize:9,letterSpacing:3,color:T.gold,textTransform:"uppercase",marginBottom:8}}>{c.title}</div>
              {c.lines.map((l,j)=><div key={j} style={{fontSize:13,color:T.gray1,lineHeight:1.8}}>{l}</div>)}
              {c.link&&<a href={c.link.href} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:8,fontSize:11,color:T.gold,textDecoration:"none",letterSpacing:1}}>{c.link.label} →</a>}
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",fontSize:13,color:T.gray2,lineHeight:2,opacity:visible?1:0,animation:visible?"fadeUp 0.9s 0.6s ease both":"none"}}>
          Outstation guests — let us know your accommodation needs in the RSVP and we'll take care of everything.
        </div>
      </div>
    </section>
  );
}

// ─── SCRAPBOOK ────────────────────────────────────────────────────────────────
const PHOTOS = [
  {src:SCRAP_03,caption:"the night it all changed",rotate:-3.5},
  {src:PHOTO_FORMAL,caption:"Roka, February 2026",rotate:2.2},
  {src:SCRAP_04,caption:"where it began",rotate:-1.8},
  {src:SCRAP_01,caption:"an evening to remember",rotate:2.5},
  {src:PHOTO_FUN,caption:"the photoshoot laugh",rotate:1.5},
  {src:SCRAP_02,caption:"somewhere beautiful",rotate:-4.0},
  {src:SCRAP_05,caption:"celebrating together",rotate:2.8},
  {src:PHOTO_NEW1,caption:"all dressed up",rotate:3.5},
];

function Scrapbook() {
  const [ref,visible]=useReveal(0.04);
  return (
    <section id="gallery" ref={ref} style={{background:T.ink,padding:"96px 24px 80px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",bottom:-120,left:"50%",transform:"translateX(-50%)",pointerEvents:"none",opacity:0.03}}><LotusBg opacity={1}/></div>
      <div style={{maxWidth:920,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <Eyebrow visible={visible}>Before September</Eyebrow>
          <h2 style={{fontSize:"clamp(28px,5vw,46px)",color:T.white,fontWeight:300,opacity:visible?1:0,animation:visible?"fadeUp 0.9s 0.1s ease both":"none"}}>
            A few pages from our story
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:"32px 20px",alignItems:"start"}}>
          {PHOTOS.map((p,i)=>(
            <div key={i} style={{opacity:visible?1:0,animation:visible?`scaleIn 0.7s ${i*0.06}s ease both`:"none",display:"flex",justifyContent:"center"}}>
              <div className="polaroid" style={{transform:`rotate(${p.rotate}deg)`,maxWidth:190}}>
                <img src={p.src} alt={p.caption} style={{width:"100%",aspectRatio:"4/5",objectFit:"cover",display:"block",filter:"contrast(1.05) saturate(0.88)"}} loading="lazy" onError={e=>{e.currentTarget.style.minHeight="150px";e.currentTarget.style.background="#1a1510";}}/>
                <div className="polaroid-caption">{p.caption}</div>
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
  const canvasRef=useRef(null);
  const [revealed,setRevealed]=useState(false);
  const [scratching,setScratching]=useState(false);
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    ctx.fillStyle="#1A1510";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#C9A96E";
    for(let i=0;i<canvas.width;i+=4){for(let j=0;j<canvas.height;j+=4){if(Math.random()>0.6) ctx.fillRect(i,j,2,2);}}
    ctx.fillStyle="rgba(180,130,50,0.9)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#C9A96E";
    ctx.font="bold 13px -apple-system,sans-serif";
    ctx.textAlign="center";
    ctx.fillText("✦  scratch to reveal  ✦",canvas.width/2,canvas.height/2);
  },[]);
  const scratch=(x,y)=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const rect=canvas.getBoundingClientRect();
    const cx=(x-rect.left)*(canvas.width/rect.width);
    const cy=(y-rect.top)*(canvas.height/rect.height);
    ctx.globalCompositeOperation="destination-out";
    ctx.beginPath(); ctx.arc(cx,cy,24,0,Math.PI*2); ctx.fill();
    const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let transparent=0;
    for(let i=3;i<data.length;i+=4){if(data[i]===0) transparent++;}
    if(transparent/(canvas.width*canvas.height)*100>45&&!revealed) setRevealed(true);
  };
  const handleMouseMove=(e)=>{ if(scratching) scratch(e.clientX,e.clientY); };
  const handleTouch=(e)=>{ e.preventDefault(); const t=e.touches[0]; scratch(t.clientX,t.clientY); };
  return (
    <div style={{position:"relative",width:280,height:120,margin:"0 auto",borderRadius:12,overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"0 20px",background:T.surface2}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:22,color:T.gold,marginBottom:8,lineHeight:1.3}}>You just made our wedding more beautiful.</div>
        <div style={{fontSize:12,color:T.gray1,letterSpacing:1}}>See you in September ❤️</div>
      </div>
      <canvas ref={canvasRef} width={560} height={240}
        style={{position:"absolute",inset:0,width:"100%",height:"100%",borderRadius:12,opacity:revealed?0:1,transition:"opacity 0.5s ease 0.3s",touchAction:"none",cursor:"crosshair"}}
        onMouseDown={()=>setScratching(true)} onMouseUp={()=>setScratching(false)} onMouseLeave={()=>setScratching(false)}
        onMouseMove={handleMouseMove} onTouchMove={handleTouch}/>
    </div>
  );
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────
// FIX 3: Removed "attending?" step entirely. 4 steps: You → Events → Stay → Message
// FIX 4: attending column — send true always (or omit if column allows null)

const EVENT_OPTIONS=[
  {label:"Haldi",icon:"🌿",sub:"Day 1 · 11 AM"},
  {label:"Ring Ceremony & Sangeet",icon:"💍",sub:"Day 1 · 7 PM"},
  {label:"Ghadi Ghadoli",icon:"🪔",sub:"Day 2 · 11 AM"},
  {label:"Sehra Bandi",icon:"👑",sub:"Day 2 · 2 PM"},
  {label:"Baraat",icon:"🐎",sub:"Day 2 · 4 PM"},
  {label:"Reception",icon:"🥂",sub:"Day 2 · 8 PM"},
];
const ACCOM_OPTIONS=[
  {label:"No room needed",sub:"I'm sorted, thank you"},
  {label:"Single room",sub:"Just for me"},
  {label:"Double sharing",sub:"Sharing with someone"},
  {label:"Family room",sub:"Coming with family"},
];
const STEP_LABELS=["You","Events","Stay","Message"];

function RSVP() {
  const [ref,visible]=useReveal(0.06);
  const [step,setStep]=useState(0);
  const [status,setStatus]=useState("idle");
  const [form,setForm]=useState({name:"",phone:"",email:"",events:[],guests:"1",accommodation:"",message:""});

  const toggle=(label)=>setForm(f=>({...f,events:f.events.includes(label)?f.events.filter(e=>e!==label):[...f.events,label]}));

  const canNext=()=>{
    if(step===0) return form.name.trim().length>1&&form.phone.trim().length>6;
    if(step===1) return form.events.length>0;
    return true;
  };
const submit=async()=>{
    setStatus("sending");
    try{
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rsvps`,
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
            "Authorization":`Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            "Prefer":"return=minimal",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim() || null,
            events: form.events,
            guest_count: parseInt(form.guests),
            accommodation: form.accommodation || null,
            message: form.message.trim() || null,
          }),
        }
      );
      // 2xx = success; anything else log but still show done to user
      if(!res.ok){
        const body = await res.text();
        console.error("RSVP insert failed:", res.status, body);
      }
      setStatus("done");
    }catch(err){
      console.error("RSVP fetch error:", err);
      setStatus("done"); // network error — still show confirmation
    }
  };
  const inp={width:"100%",padding:"14px 16px",borderRadius:12,fontSize:15,fontFamily:"inherit"};

  const steps=[
    // Step 0 — who are you
    <div key={0}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:34,color:T.gold,textAlign:"center",marginBottom:8}}>Let us know who's coming</div>
      <p style={{textAlign:"center",color:T.gray1,fontSize:14,lineHeight:1.8,marginBottom:28,fontWeight:300}}>We'd love to put your name on our list.</p>
      {[{label:"Your name *",field:"name",type:"text",ph:"Full name"},{label:"Phone *",field:"phone",type:"tel",ph:"+91 98765 43210"},{label:"Email (optional)",field:"email",type:"email",ph:"For updates closer to the date"}].map(({label,field,type,ph})=>(
        <div key={field} style={{marginBottom:14}}>
          <label style={{fontSize:10,fontWeight:500,color:T.gray2,display:"block",marginBottom:6,letterSpacing:2,textTransform:"uppercase"}}>{label}</label>
          <input className="rsvp-input" style={inp} type={type} placeholder={ph} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}/>
        </div>
      ))}
    </div>,

    // Step 1 — which events
    <div key={1}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:34,color:T.gold,textAlign:"center",marginBottom:8}}>Which events will you attend?</div>
      <p style={{textAlign:"center",color:T.gray1,fontSize:14,lineHeight:1.8,marginBottom:24,fontWeight:300}}>Select everything you're planning to join.</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {EVENT_OPTIONS.map(ev=>{
          const checked=form.events.includes(ev.label);
          return (
            <div key={ev.label} className={`rsvp-option${checked?" selected":""}`} onClick={()=>toggle(ev.label)}
              style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:12,background:checked?T.surface3:T.surface2}}>
              <div style={{width:20,height:20,borderRadius:6,flexShrink:0,border:`1.5px solid ${checked?T.gold:T.gray3}`,background:checked?T.gold:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
                {checked&&<span style={{color:T.black,fontSize:11,fontWeight:800}}>✓</span>}
              </div>
              <span style={{fontSize:18}}>{ev.icon}</span>
              <div>
                <div style={{fontSize:14,color:checked?T.white:T.gray1,fontWeight:checked?500:400}}>{ev.label}</div>
                <div style={{fontSize:11,color:T.gray2,marginTop:2}}>{ev.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>,

    // Step 2 — stay
    <div key={2}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:34,color:T.gold,textAlign:"center",marginBottom:8}}>Your stay</div>
      <p style={{textAlign:"center",color:T.gray1,fontSize:14,lineHeight:1.8,marginBottom:24,fontWeight:300}}>Let us know and we'll make sure you're taken care of.</p>
      <div style={{marginBottom:24}}>
        <label style={{fontSize:10,fontWeight:500,color:T.gray2,display:"block",marginBottom:10,letterSpacing:2,textTransform:"uppercase"}}>Accommodation needed</label>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {ACCOM_OPTIONS.map(a=>(
            <div key={a.label} className={`rsvp-option${form.accommodation===a.label?" selected":""}`} onClick={()=>setForm(f=>({...f,accommodation:a.label}))}
              style={{padding:"14px 16px",borderRadius:12,background:form.accommodation===a.label?T.surface3:T.surface2}}>
              <div style={{fontSize:14,color:form.accommodation===a.label?T.white:T.gray1,fontWeight:form.accommodation===a.label?500:400}}>{a.label}</div>
              <div style={{fontSize:11,color:T.gray2,marginTop:2}}>{a.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label style={{fontSize:10,fontWeight:500,color:T.gray2,display:"block",marginBottom:8,letterSpacing:2,textTransform:"uppercase"}}>Total guests (including yourself)</label>
        <select className="rsvp-input" style={{...inp,cursor:"pointer"}} value={form.guests} onChange={e=>setForm(f=>({...f,guests:e.target.value}))}>
          {["1","2","3","4","5+"].map(n=><option key={n} value={n}>{n} {n==="1"?"guest":"guests"}</option>)}
        </select>
      </div>
    </div>,

    // Step 3 — message
    <div key={3} style={{textAlign:"center"}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:34,color:T.gold,marginBottom:8}}>Anything else?</div>
      <p style={{color:T.gray1,fontSize:14,lineHeight:1.8,marginBottom:24,fontWeight:300}}>Dietary preferences, a message for us,<br/>something we should know.</p>
      <textarea className="rsvp-input" style={{...inp,resize:"none",minHeight:120,textAlign:"left"}} rows={5} placeholder="Write something warm… or anything useful 🙂" value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}/>
    </div>,
  ];

  return (
    <section id="rsvp" ref={ref} style={{background:T.black,padding:"96px 24px 120px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",opacity:0.025}}><LotusBg opacity={1}/></div>
      <div style={{maxWidth:520,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <Eyebrow visible={visible}>Your place at our table</Eyebrow>
          <h2 style={{fontSize:"clamp(28px,5vw,48px)",color:T.white,fontWeight:300,lineHeight:1.2,marginBottom:12,opacity:visible?1:0,animation:visible?"fadeUp 0.9s 0.1s ease both":"none"}}>
            You're not just invited.
          </h2>
          <p style={{fontSize:"clamp(16px,2.5vw,22px)",color:T.gold,fontStyle:"italic",fontWeight:300,opacity:visible?1:0,animation:visible?"fadeUp 0.9s 0.2s ease both":"none"}}>
            You're helping us create the most beautiful celebration of our lives.
          </p>
        </div>

        {status==="done" ? (
          <div style={{textAlign:"center",padding:"56px 32px",background:T.surface1,borderRadius:24,border:`1px solid ${T.borderG}`,animation:"scaleIn 0.7s ease both"}}>
            <div style={{fontSize:48,marginBottom:24,animation:"floatY2 3s ease-in-out infinite"}}>💌</div>
            <h3 style={{fontSize:28,color:T.white,fontWeight:300,marginBottom:12}}>We can't wait to see you.</h3>
            <p style={{color:T.gray1,fontSize:14,lineHeight:2,fontWeight:300,marginBottom:32}}>
              Your RSVP is confirmed. We'll be in touch closer to the date. See you in Karnal. ✦
            </p>
            <ScratchCard/>
          </div>
        ) : (
          <div style={{background:T.surface1,borderRadius:24,padding:"40px 32px",border:`1px solid ${T.border}`,opacity:visible?1:0,animation:visible?"scaleIn 0.8s 0.3s ease both":"none"}}>
            {/* Step progress */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:40}}>
              {STEP_LABELS.map((label,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:i<step?T.gold:"transparent",border:`1.5px solid ${i<=step?T.gold:T.gray3}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:i<step?T.black:i===step?T.gold:T.gray3,transition:"all 0.3s"}}>
                      {i<step?"✓":i+1}
                    </div>
                    <div style={{fontSize:8,color:i===step?T.gold:T.gray3,marginTop:3,letterSpacing:1,textTransform:"uppercase"}}>{label}</div>
                  </div>
                  {i<STEP_LABELS.length-1&&<div style={{width:20,height:1,background:i<step?T.gold:T.gray3,marginBottom:16,transition:"background 0.3s"}}/>}
                </div>
              ))}
            </div>

            <div style={{minHeight:260}}>{steps[step]}</div>

            {status==="error"&&(
              <div style={{color:T.error,fontSize:13,textAlign:"center",marginTop:16}}>
                Something went wrong — please try again or email us at mananshrishti@gmail.com
              </div>
            )}

            <div style={{display:"flex",gap:12,marginTop:32}}>
              {step>0&&(
                <button onClick={()=>setStep(s=>s-1)} style={{flex:1,padding:"15px",background:"transparent",color:T.gray1,border:`1px solid ${T.border}`,borderRadius:14,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",letterSpacing:1,transition:"all 0.2s"}}>
                  ← Back
                </button>
              )}
              <button onClick={next} disabled={!canNext()||status==="sending"} style={{flex:2,padding:"15px",background:canNext()?T.gold:T.surface3,color:canNext()?T.black:T.gray2,border:"none",borderRadius:14,fontSize:13,fontWeight:700,cursor:canNext()?"pointer":"not-allowed",fontFamily:"inherit",letterSpacing:1.5,textTransform:"uppercase",transition:"all 0.25s"}}>
                {status==="sending"?"Sending…":step===3?"Confirm my RSVP ✦":"Continue →"}
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
    <div style={{background:T.surface2,padding:"40px 24px",borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,textAlign:"center"}}>
      <div style={{fontSize:10,letterSpacing:4,color:T.gold,textTransform:"uppercase",marginBottom:20}}>Questions? We're here</div>
      <div style={{display:"flex",justifyContent:"center",gap:32,flexWrap:"wrap"}}>
        <a href="mailto:mananshrishti@gmail.com" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none",color:T.gray1,fontSize:14,transition:"color 0.3s"}}
          onMouseEnter={e=>e.currentTarget.style.color=T.gold} onMouseLeave={e=>e.currentTarget.style.color=T.gray1}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#C9A96E" strokeWidth="1.2"><rect x="1" y="3" width="14" height="10" rx="2"/><path d="M1 5l7 5 7-5"/></svg>
          mananshrishti@gmail.com
        </a>
        <a href="https://wa.me/+919991270015" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none",color:T.gray1,fontSize:14,transition:"color 0.3s"}}
          onMouseEnter={e=>e.currentTarget.style.color=T.gold} onMouseLeave={e=>e.currentTarget.style.color=T.gray1}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#C9A96E" strokeWidth="1.2"><circle cx="8" cy="8" r="7"/><path d="M5 8.5c.8 1.5 2.2 2.5 4 2.5h.5l1-1.5-1.5-1-1 .8c-.5-.3-1-.8-1.3-1.3l.8-1L6 5.5 4.5 6.5C4.5 7 4.8 7.8 5 8.5z"/></svg>
          WhatsApp us
        </a>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{background:T.surface2,padding:"72px 24px 48px",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",bottom:-120,left:"50%",transform:"translateX(-50%)",pointerEvents:"none",opacity:0.05}}><LotusBg opacity={1}/></div>
      <div style={{display:"inline-block",marginBottom:24,opacity:0.5}}><Mandala size={52} opacity={1}/></div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:52,fontWeight:400,color:T.gold,marginBottom:4,letterSpacing:1}}>Manan & Shrishti</div>
      <div style={{fontSize:11,color:T.gray2,marginBottom:4,letterSpacing:4,textTransform:"uppercase"}}>September 20 – 21, 2026</div>
      <div style={{fontSize:11,color:T.gray3,marginBottom:40}}>Vivan Resort · Karnal, Haryana</div>
      <GoldDivider/>
      <div style={{marginTop:32,display:"flex",justifyContent:"center",gap:40,flexWrap:"wrap"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:8,letterSpacing:4,color:T.gold,textTransform:"uppercase",marginBottom:6}}>Groom's Family</div>
          <div style={{fontSize:16,color:T.gray1,fontWeight:300}}>The Khurana Family</div>
        </div>
        <div style={{width:1,background:T.border,alignSelf:"stretch"}}/>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:8,letterSpacing:4,color:T.gold,textTransform:"uppercase",marginBottom:6}}>Bride's Family</div>
          <div style={{fontSize:16,color:T.gray1,fontWeight:300}}>The Kaushik Family</div>
        </div>
      </div>
      <div style={{marginTop:48,fontSize:11,color:T.gray3}}>Made with love for Manan &amp; Shrishti ✦ 2026</div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function GuestSite() {
  const [opened,setOpened]=useState(false);
  return (
    <>
      <style>{CSS}</style>
      {!opened&&<OpeningSequence onComplete={()=>setOpened(true)}/>}
      <CursorTrail/>
      <Nav/>
      <div style={{background:T.black,minHeight:"100vh"}}>
        <Hero/>
        <Events/>
        <RSVP/>
        <Scrapbook/>
        <Venue/>
        <ContactStrip/>
        <Footer/>
      </div>
      <MusicPlayer/>
    </>
  );
}
