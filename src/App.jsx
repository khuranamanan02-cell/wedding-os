import { Routes, Route, Navigate } from "react-router-dom";
// import { useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import GuestSite from "./GuestSite.jsx";
// import PasswordGate from "./PasswordGate.jsx";

// Lazy import the OS so it doesn't load until needed
// import WeddingOS from "./WeddingOS.jsx";

// function OSRoute() {
//  const [unlocked, setUnlocked] = useState(
//    () => sessionStorage.getItem("os_unlocked") === "true"
//  );

// const unlock = () => {
//    sessionStorage.setItem("os_unlocked", "true");
//    setUnlocked(true);
//  };

//  if (!unlocked) return <PasswordGate onUnlock={unlock} />;
//  return <WeddingOS />;
// }

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/"    element={<GuestSite />} />
        {/* <Route path="/os"  element={<OSRoute />} /> */}
        {/* <Route path="/os/*" element={<OSRoute />} /> */}
        <Route path="*"    element={<Navigate to="/" replace />} />
      </Routes>
      <SpeedInsights />
    </>
  );
}
