import { useState } from "react";
import { GraduationCap, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

// Google "G" SVG logo
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  );
}

export default function SignIn() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      // Auth state listener in AuthContext will handle the rest
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked. Please allow popups for this site.");
      } else {
        setError("Sign-in failed. Please try again.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f9e8d8 0%, #f5dece 25%, #ecddd4 50%, #e8d5d0 75%, #e4d0d8 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .si-card { animation: fadeUp .35s ease both; }
        .g-btn {
          width: 100%; background: #fff; color: #1a1a1a;
          border: 1.5px solid #e2ddd8; border-radius: 11px;
          padding: 13px 18px; font-size: 14.5px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 12px;
          font-family: 'Inter', sans-serif;
          transition: box-shadow .18s, border-color .18s, background .18s;
          box-shadow: 0 1px 4px rgba(0,0,0,.06);
        }
        .g-btn:hover:not(:disabled) {
          border-color: #c9c3bc;
          box-shadow: 0 4px 16px rgba(0,0,0,.10);
          background: #fafafa;
        }
        .g-btn:disabled { opacity: .55; cursor: not-allowed; }
      `}</style>

      <div className="si-card" style={{
        background: "#fff", borderRadius: 24, padding: "48px 44px",
        width: "100%", maxWidth: 420,
        boxShadow: "0 8px 40px rgba(0,0,0,.10), 0 1px 4px rgba(0,0,0,.06)",
        border: "1px solid #ede9e4",
      }}>
        {/* Logo */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom: 36 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:"#1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
            <GraduationCap size={28} color="#fff"/>
          </div>
          <h1 style={{ fontSize:24, fontWeight:700, color:"#1a1a1a", letterSpacing:"-0.5px" }}>UniAdmin</h1>
          <p style={{ fontSize:13.5, color:"#b0a89e", marginTop:4 }}>University of Technology, Lagos</p>
        </div>

        {/* Heading */}
        <h2 style={{ fontSize:20, fontWeight:700, color:"#1a1a1a", marginBottom:6 }}>Welcome back</h2>
        <p style={{ fontSize:13.5, color:"#b0a89e", marginBottom:28, lineHeight:1.6 }}>
          Sign in with your institutional Google account to access the admin portal.
        </p>

        {/* Error */}
        {error && (
          <div style={{ background:"#fce4ec", border:"1px solid #f8bbd0", borderRadius:10, padding:"10px 14px", marginBottom:18, display:"flex", alignItems:"center", gap:9, color:"#c62828", fontSize:13 }}>
            <AlertCircle size={15} style={{ flexShrink:0 }}/> {error}
          </div>
        )}

        {/* Google button */}
        <button className="g-btn" onClick={handleGoogle} disabled={loading}>
          {loading
            ? <><div style={{ width:18, height:18, border:"2px solid #e2ddd8", borderTopColor:"#1a1a1a", borderRadius:"50%", animation:"spin .7s linear infinite" }}/> Signing in…</>
            : <><GoogleIcon/> Continue with Google</>
          }
        </button>

        {/* Divider info */}
        <div style={{ marginTop:28, padding:"14px 16px", background:"#faf8f5", borderRadius:12, border:"1px solid #ede9e4" }}>
          <p style={{ fontSize:12.5, color:"#7a7169", lineHeight:1.7, textAlign:"center" }}>
            🔒 Secure sign-in via Google OAuth 2.0.<br/>
            Your Google account is authenticated directly — no passwords stored here.
          </p>
        </div>

        {/* Multi-user note */}
        <p style={{ fontSize:12, color:"#c0b8b0", marginTop:18, textAlign:"center", lineHeight:1.6 }}>
          Multiple admin accounts supported. Each Google account gets its own profile.
        </p>
      </div>
    </div>
  );
}