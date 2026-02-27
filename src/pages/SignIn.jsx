import { useState } from "react";
import { GraduationCap, AlertCircle, Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

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

const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  .si-wrap  { animation: fadeUp .32s ease both; }
  .view-in  { animation: fadeIn .22s ease both; }
  .si-input {
    width:100%; background:#faf8f5; border:1.5px solid #ede9e4;
    border-radius:11px; padding:11px 14px 11px 40px;
    font-size:14px; outline:none;
    font-family:'DM Sans',sans-serif; color:#1a1a1a;
    transition:border .18s, background .18s;
    box-sizing:border-box;
  }
  .si-input:focus   { background:#fff; border-color:#1a1a1a; }
  .si-input:disabled { opacity:.6; cursor:not-allowed; }
  .si-input::placeholder { color:#c0b8b0; }
  .g-btn {
    width:100%; background:#fff; color:#1a1a1a;
    border:1.5px solid #e2ddd8; border-radius:11px;
    padding:12px 18px; font-size:14px; font-weight:600;
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:11px;
    font-family:'DM Sans',sans-serif;
    transition:box-shadow .18s, border-color .18s;
    box-shadow:0 1px 4px rgba(0,0,0,.06);
  }
  .g-btn:hover:not(:disabled) { border-color:#c9c3bc; box-shadow:0 4px 14px rgba(0,0,0,.10); }
  .g-btn:disabled { opacity:.5; cursor:not-allowed; }
  .sub-btn {
    width:100%; background:#1a1a1a; color:#fff; border:none;
    border-radius:11px; padding:12px; font-size:14px; font-weight:600;
    cursor:pointer; font-family:'DM Sans',sans-serif;
    display:flex; align-items:center; justify-content:center; gap:9px;
    transition:opacity .15s;
  }
  .sub-btn:hover:not(:disabled) { opacity:.82; }
  .sub-btn:disabled { opacity:.5; cursor:not-allowed; }
  .txt-link  { background:none; border:none; color:#1a1a1a; font-weight:700; font-size:13.5px; cursor:pointer; text-decoration:underline; font-family:'DM Sans',sans-serif; padding:0; }
  .txt-link:hover { opacity:.65; }
  .back-btn  { background:none; border:none; color:#7a7169; font-size:13px; font-weight:500; cursor:pointer; display:flex; align-items:center; gap:6px; font-family:'DM Sans',sans-serif; padding:0; margin-bottom:22px; }
  .back-btn:hover { color:#1a1a1a; }
`;

const BG = "linear-gradient(135deg,#f9e8d8 0%,#f5dece 25%,#ecddd4 50%,#e8d5d0 75%,#e4d0d8 100%)";
const CARD = { background:"#fff", borderRadius:24, padding:"44px 40px", width:"100%", maxWidth:420, boxShadow:"0 8px 40px rgba(0,0,0,.10),0 1px 4px rgba(0,0,0,.06)", border:"1px solid #ede9e4" };
const WRAP = { minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'DM Sans',sans-serif" };

function Spinner() {
  return <div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite" }}/>;
}

function ErrorBox({ msg }) {
  return (
    <div style={{ background:"#fce4ec", border:"1px solid #f8bbd0", borderRadius:10, padding:"10px 14px", marginBottom:18, display:"flex", alignItems:"center", gap:9, color:"#c62828", fontSize:13 }}>
      <AlertCircle size={15} style={{ flexShrink:0 }}/> {msg}
    </div>
  );
}

function Logo() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:30 }}>
      <div style={{ width:52, height:52, borderRadius:15, background:"#1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
        <GraduationCap size={26} color="#fff"/>
      </div>
      <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, fontWeight:400, color:"#1a1a1a" }}>UniAdmin</h1>
      <p style={{ fontSize:13, color:"#b0a89e", marginTop:3 }}>University of Technology, Lagos</p>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
      <div style={{ flex:1, height:1, background:"#ede9e4" }}/>
      <span style={{ fontSize:12, color:"#c0b8b0", fontWeight:500 }}>or continue with email</span>
      <div style={{ flex:1, height:1, background:"#ede9e4" }}/>
    </div>
  );
}

// ─── VIEW: Sign In ────────────────────────────────────────────────────────────
function SignInView({ onForgot, onSignUp, onGoogle, onSubmit, loadingG, loadingE, error }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const busy = loadingG || loadingE;

  return (
    <div className="view-in">
      <Logo/>
      <h2 style={{ fontSize:19, fontWeight:700, color:"#1a1a1a", marginBottom:4 }}>Welcome back</h2>
      <p style={{ fontSize:13.5, color:"#b0a89e", marginBottom:24, lineHeight:1.6 }}>Sign in to your administrator account</p>

      {error && <ErrorBox msg={error}/>}

      <button className="g-btn" onClick={onGoogle} disabled={busy}>
        {loadingG ? <><div style={{ width:17,height:17,border:"2px solid #e2ddd8",borderTopColor:"#1a1a1a",borderRadius:"50%",animation:"spin .7s linear infinite" }}/> Signing in…</> : <><GoogleIcon/> Continue with Google</>}
      </button>

      <Divider/>

      <form onSubmit={e => { e.preventDefault(); onSubmit(email, password); }} style={{ display:"flex", flexDirection:"column", gap:13 }}>
        <div style={{ position:"relative" }}>
          <Mail size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#c0b8b0", pointerEvents:"none" }}/>
          <input className="si-input" type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" disabled={busy}/>
        </div>

        <div>
          <div style={{ position:"relative" }}>
            <Lock size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#c0b8b0", pointerEvents:"none" }}/>
            <input className="si-input" type={showPw?"text":"password"} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" disabled={busy} style={{ paddingRight:44 }}/>
            <button type="button" onClick={()=>setShowPw(v=>!v)} style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#c0b8b0", display:"flex", padding:0 }}>
              {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
          {/* Forgot password link — sits right below the password field */}
          <div style={{ textAlign:"right", marginTop:7 }}>
            <button type="button" className="txt-link" style={{ fontSize:12.5, fontWeight:600 }} onClick={onForgot}>
              Forgot password?
            </button>
          </div>
        </div>

        <button className="sub-btn" type="submit" disabled={busy}>
          {loadingE ? <><Spinner/> Signing in…</> : "Sign In"}
        </button>
      </form>

      <p style={{ textAlign:"center", fontSize:13.5, color:"#b0a89e", marginTop:22 }}>
        Don't have an account?{" "}<button className="txt-link" onClick={onSignUp}>Create account</button>
      </p>
      <p style={{ fontSize:12, color:"#c0b8b0", textAlign:"center", marginTop:14, lineHeight:1.6 }}>🔒 Secured by Firebase Authentication</p>
    </div>
  );
}

// ─── VIEW: Forgot Password ────────────────────────────────────────────────────
function ForgotView({ onBack, onSubmit, loading, error }) {
  const [email, setEmail] = useState("");

  return (
    <div className="view-in">
      <button className="back-btn" onClick={onBack}><ArrowLeft size={14}/> Back to sign in</button>

      {/* Icon */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:28 }}>
        <div style={{ width:56, height:56, borderRadius:16, background:"#f0ede9", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
          <Lock size={24} color="#1a1a1a"/>
        </div>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, fontWeight:400, color:"#1a1a1a" }}>Reset your password</h2>
      </div>

      <p style={{ fontSize:13.5, color:"#7a7169", marginBottom:24, lineHeight:1.7, textAlign:"center" }}>
        Enter the email address linked to your account and we'll send you a reset link instantly.
      </p>

      {error && <ErrorBox msg={error}/>}

      <form onSubmit={e => { e.preventDefault(); onSubmit(email); }} style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ position:"relative" }}>
          <Mail size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#c0b8b0", pointerEvents:"none" }}/>
          <input className="si-input" type="email" placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" disabled={loading}/>
        </div>
        <button className="sub-btn" type="submit" disabled={loading || !email.trim()}>
          {loading ? <><Spinner/> Sending…</> : "Send Reset Link"}
        </button>
      </form>

      <div style={{ marginTop:22, padding:"12px 14px", background:"#faf8f5", borderRadius:11, border:"1px solid #ede9e4" }}>
        <p style={{ fontSize:12.5, color:"#7a7169", lineHeight:1.7 }}>
          💡 Check your spam folder if the email doesn't arrive within a minute. The link expires after <strong>1 hour</strong>.
        </p>
      </div>
    </div>
  );
}

// ─── VIEW: Email Sent ─────────────────────────────────────────────────────────
function SentView({ email, onBack }) {
  return (
    <div className="view-in" style={{ textAlign:"center" }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:24 }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:"#e8f5e9", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
          <CheckCircle size={30} color="#22c55e"/>
        </div>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, fontWeight:400, color:"#1a1a1a" }}>Check your inbox</h2>
      </div>

      <p style={{ fontSize:14, color:"#4a4540", lineHeight:1.8, marginBottom:10 }}>
        We sent a password reset link to:
      </p>
      <div style={{ background:"#f0ede9", borderRadius:10, padding:"10px 16px", marginBottom:24, display:"inline-block" }}>
        <p style={{ fontWeight:700, fontSize:14, color:"#1a1a1a" }}>{email}</p>
      </div>

      <p style={{ fontSize:13, color:"#b0a89e", lineHeight:1.7, marginBottom:28 }}>
        Click the link in the email to set a new password. The link expires in <strong style={{ color:"#7a7169" }}>1 hour</strong>.
      </p>

      <button className="sub-btn" onClick={onBack} style={{ marginBottom:16 }}>
        Back to Sign In
      </button>

      <p style={{ fontSize:12.5, color:"#b0a89e", lineHeight:1.7 }}>
        Didn't receive it? Check spam, or{" "}
        <button className="txt-link" style={{ fontSize:12.5 }} onClick={onBack}>try again</button>.
      </p>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function SignIn({ onNavigateToSignUp }) {
  const { signInWithGoogle, signInWithEmail, resetPassword } = useAuth();

  // "signin" | "forgot" | "sent"
  const [view,      setView]      = useState("signin");
  const [sentEmail, setSentEmail] = useState("");
  const [loadingG,  setLoadingG]  = useState(false);
  const [loadingE,  setLoadingE]  = useState(false);
  const [loadingR,  setLoadingR]  = useState(false);
  const [error,     setError]     = useState("");

  const friendlyError = (code) => {
    switch (code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":    return "Incorrect email or password.";
      case "auth/invalid-email":          return "Please enter a valid email address.";
      case "auth/too-many-requests":      return "Too many attempts. Please wait and try again.";
      case "auth/popup-closed-by-user":   return "Sign-in cancelled. Please try again.";
      case "auth/popup-blocked":          return "Popup blocked. Please allow popups for this site.";
      case "auth/network-request-failed": return "Network error. Check your connection.";
      default:                            return "Something went wrong. Please try again.";
    }
  };

  const handleGoogle = async () => {
    setError(""); setLoadingG(true);
    try { await signInWithGoogle(); }
    catch (err) { setError(friendlyError(err.code)); }
    finally { setLoadingG(false); }
  };

  const handleEmail = async (email, password) => {
    if (!email.trim())    { setError("Please enter your email."); return; }
    if (!password.trim()) { setError("Please enter your password."); return; }
    setError(""); setLoadingE(true);
    try { await signInWithEmail(email, password); }
    catch (err) { setError(friendlyError(err.code)); }
    finally { setLoadingE(false); }
  };

  const handleReset = async (email) => {
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setError(""); setLoadingR(true);
    try {
      await resetPassword(email.trim());
      setSentEmail(email.trim());
      setView("sent");
    } catch (err) {
      // Don't reveal if email exists or not — just show success anyway (security best practice)
      if (err.code === "auth/user-not-found") {
        setSentEmail(email.trim());
        setView("sent");
      } else {
        setError(friendlyError(err.code));
      }
    } finally {
      setLoadingR(false);
    }
  };

  const goBack = () => { setView("signin"); setError(""); };

  return (
    <div style={WRAP}>
      <style>{SHARED_STYLES}</style>
      <div className="si-wrap" style={CARD}>
        {view === "signin" && (
          <SignInView
            onForgot  = {() => { setView("forgot"); setError(""); }}
            onSignUp  = {onNavigateToSignUp}
            onGoogle  = {handleGoogle}
            onSubmit  = {handleEmail}
            loadingG  = {loadingG}
            loadingE  = {loadingE}
            error     = {error}
          />
        )}
        {view === "forgot" && (
          <ForgotView
            onBack   = {goBack}
            onSubmit = {handleReset}
            loading  = {loadingR}
            error    = {error}
          />
        )}
        {view === "sent" && (
          <SentView
            email  = {sentEmail}
            onBack = {goBack}
          />
        )}
      </div>
    </div>
  );
}