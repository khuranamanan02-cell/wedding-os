import { useState } from "react";

const T = {
  cream: "#FAF7F2", gold: "#C9A96E", navy: "#1E2A4A",
  rose: "#D4A5A0", border: "#EDE0D8", muted: "#8A7F78",
  white: "#FFFFFF", charcoal: "#2C2C2C",
};

const PASSWORD = "mananshrishti2026";

export default function PasswordGate({ onUnlock }) {
  const [val, setVal] = useState("");
  const [shake, setShake] = useState(false);
  const [show, setShow] = useState(false);

  const attempt = () => {
    if (val === PASSWORD) {
      onUnlock();
    } else {
      setShake(true);
      setVal("");
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Inter',sans-serif;background:${T.cream};}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .gate-wrap{animation:fadeUp 0.7s ease forwards;}
        .gate-shake{animation:shake 0.5s ease;}
        .gold-shimmer{
          background:linear-gradient(90deg,#C9A96E 0%,#F0D9A0 40%,#C9A96E 60%,#E8D5B0 100%);
          background-size:200% auto;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          background-clip:text;animation:shimmer 3s linear infinite;
        }
      `}</style>
      <div style={{
        minHeight:"100vh", background:T.cream,
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:24, fontFamily:"'Inter',sans-serif"
      }}>
        <div className="gate-wrap" style={{width:"100%", maxWidth:380, textAlign:"center"}}>
          {/* Monogram */}
          <div className="gold-shimmer" style={{
            fontFamily:"'Clash Display',sans-serif",
            fontSize:52, fontWeight:700, marginBottom:8, letterSpacing:2
          }}>M & S</div>

          <div style={{color:T.muted, fontSize:14, marginBottom:40, letterSpacing:0.5}}>
            Wedding Planning Suite
          </div>

          {/* Card */}
          <div style={{
            background:T.white, borderRadius:20,
            padding:"32px 28px", border:`1px solid ${T.border}`,
            boxShadow:"0 4px 32px rgba(30,42,74,0.06)"
          }}>
            <div style={{
              fontFamily:"'Clash Display',sans-serif",
              fontSize:20, fontWeight:600, color:T.navy, marginBottom:6
            }}>Family Access</div>
            <div style={{color:T.muted, fontSize:13, marginBottom:24}}>
              Enter the password to open the planning dashboard
            </div>

            <div className={shake ? "gate-shake" : ""} style={{marginBottom:16, position:"relative"}}>
              <input
                type={show ? "text" : "password"}
                value={val}
                onChange={e => setVal(e.target.value)}
                onKeyDown={e => e.key === "Enter" && attempt()}
                placeholder="Password"
                autoComplete="current-password"
                style={{
                  width:"100%", padding:"14px 44px 14px 16px",
                  border:`1.5px solid ${shake ? "#D4756B" : T.border}`,
                  borderRadius:12, fontSize:15, outline:"none",
                  background:T.cream, color:T.charcoal,
                  fontFamily:"'Inter',sans-serif",
                  transition:"border-color 0.2s",
                }}
              />
              <button
                onClick={() => setShow(s => !s)}
                style={{
                  position:"absolute", right:12, top:"50%",
                  transform:"translateY(-50%)", background:"none",
                  border:"none", cursor:"pointer", fontSize:16,
                  color:T.muted, padding:4,
                }}
              >{show ? "🙈" : "👁️"}</button>
            </div>

            <button
              onClick={attempt}
              style={{
                width:"100%", padding:"14px",
                background:T.navy, color:T.white,
                border:"none", borderRadius:12,
                fontSize:15, fontWeight:600,
                cursor:"pointer", fontFamily:"'Inter',sans-serif",
                letterSpacing:0.3,
                transition:"opacity 0.2s",
              }}
              onMouseOver={e => e.target.style.opacity = "0.88"}
              onMouseOut={e => e.target.style.opacity = "1"}
            >
              Enter
            </button>
          </div>

          <div style={{color:T.muted, fontSize:12, marginTop:24}}>
            ← Back to{" "}
            <a href="/" style={{color:T.gold, textDecoration:"none", fontWeight:500}}>
              wedding website
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
