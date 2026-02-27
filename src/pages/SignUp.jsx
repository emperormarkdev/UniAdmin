import { useState } from "react";
import { GraduationCap, AlertCircle, Eye, EyeOff, Mail, Lock, User, Phone, Shield, Check } from "lucide-react";
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

const ROLES = ["Administrator", "Faculty", "Registrar", "Finance Officer", "IT Officer"];

function StrengthBar({ password }) {
  const score = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8)          s++;
    if (/[A-Z]/.test(password))        s++;
    if (/[0-9]/.test(password))        s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const labels = ["","Weak","Fair","Good","Strong"];
  const colors = ["","#ef4444","#f59e0b","#3b82f6","#22c55e"];
  if (!password) return null;
  return (
    <div style={{ marginTop:7 }}>
      <div style={{ display:"flex", gap:4, marginBottom:5 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex:1, height:3, borderRadius:99, background:i<=score ? colors[score] : "#ede9e4", transition:"background .3s" }}/>
        ))}
      </div>
      <p style={{ fontSize:11.5, color:colors[score], fontWeight:600 }}>{labels[score]}</p>
    </div>
  );
}

export default function SignUp({ onNavigateToSignIn }) {
  const { signInWithGoogle, signUpWithEmail } = useAuth();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", role: "Administrator",
    password: "", confirm: "",
  });
  const [showPw,    setShowPw]    = useState(false);
  const [showCf,    setShowCf]    = useState(false);
  const [loadingG,  setLoadingG]  = useState(false);
  const [loadingE,  setLoadingE]  = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const friendlyError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":   return "An account with this email already exists. Try signing in instead.";
      case "auth/invalid-email":           return "Please enter a valid email address.";
      case "auth/weak-password":           return "Password must be at least 6 characters.";
      case "auth/popup-closed-by-user":    return "Sign-up cancelled. Please try again.";
      case "auth/popup-blocked":           return "Popup blocked. Please allow popups for this site.";
      case "auth/network-request-failed":  return "Network error. Check your connection.";
      default:                             return "Sign-up failed. Please try again.";
    }
  };

  const handleGoogle = async () => {
    setError(""); setLoadingG(true);
    try { await signInWithGoogle(); }
    catch (err) { setError(friendlyError(err.code)); }
    finally { setLoadingG(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.firstName.trim())   { setError("First name is required."); return; }
    if (!form.lastName.trim())    { setError("Last name is required."); return; }
    if (!form.email.trim())       { setError("Email is required."); return; }
    if (!form.password)           { setError("Password is required."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }

    setLoadingE(true);
    try {
      await signUpWithEmail({
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        email:     form.email.trim(),
        password:  form.password,
        role:      form.role,
      });
      setSuccess(true);
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoadingE(false);
    }
  };

  const busy = loadingG || loadingE;

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{
        minHeight:"100vh",
        background:"linear-gradient(135deg,#f9e8d8 0%,#f5dece 25%,#ecddd4 50%,#e8d5d0 75%,#e4d0d8 100%)",
        display:"flex", alignItems:"center", justifyContent:"center", padding:24,
        fontFamily:"'DM Sans',sans-serif",
      }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}.su-done{animation:fadeUp .35s ease both;}`}</style>
        <div className="su-done" style={{ background:"#fff", borderRadius:24, padding:"52px 44px", width:"100%", maxWidth:420, boxShadow:"0 8px 40px rgba(0,0,0,.10)", border:"1px solid #ede9e4", textAlign:"center" }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:"#e8f5e9", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
            <Check size={30} color="#22c55e"/>
          </div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, fontWeight:400, color:"#1a1a1a", marginBottom:10 }}>Account created!</h2>
          <p style={{ fontSize:14, color:"#7a7169", lineHeight:1.7, marginBottom:28 }}>
            Welcome to UniAdmin, <strong>{form.firstName}</strong>. You're now signed in and ready to go.
          </p>
          <div style={{ background:"#faf8f5", borderRadius:12, padding:"14px 16px", border:"1px solid #ede9e4", fontSize:13, color:"#7a7169", textAlign:"left" }}>
            <p><strong style={{ color:"#1a1a1a" }}>Name:</strong> {form.firstName} {form.lastName}</p>
            <p style={{ marginTop:5 }}><strong style={{ color:"#1a1a1a" }}>Email:</strong> {form.email}</p>
            <p style={{ marginTop:5 }}><strong style={{ color:"#1a1a1a" }}>Role:</strong> {form.role}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#f9e8d8 0%,#f5dece 25%,#ecddd4 50%,#e8d5d0 75%,#e4d0d8 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"32px 24px", fontFamily:"'DM Sans',sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .su-wrap { animation: fadeUp .35s ease both; }
        .su-input {
          width:100%; background:#faf8f5; border:1.5px solid #ede9e4;
          border-radius:11px; padding:11px 14px 11px 40px;
          font-size:14px; outline:none;
          font-family:'DM Sans',sans-serif; color:#1a1a1a;
          transition:border .18s, background .18s;
          box-sizing:border-box;
        }
        .su-input:focus { background:#fff; border-color:#1a1a1a; }
        .su-input:disabled { opacity:.6; cursor:not-allowed; }
        .su-input::placeholder { color:#c0b8b0; }
        .su-select {
          width:100%; background:#faf8f5; border:1.5px solid #ede9e4;
          border-radius:11px; padding:11px 14px 11px 40px;
          font-size:14px; outline:none; cursor:pointer;
          font-family:'DM Sans',sans-serif; color:#1a1a1a;
          appearance:none; transition:border .18s;
          box-sizing:border-box;
        }
        .su-select:focus { background:#fff; border-color:#1a1a1a; }
        .g-btn {
          width:100%; background:#fff; color:#1a1a1a;
          border:1.5px solid #e2ddd8; border-radius:11px;
          padding:12px 18px; font-size:14px; font-weight:600;
          cursor:pointer; display:flex; align-items:center;
          justify-content:center; gap:11px;
          font-family:'DM Sans',sans-serif;
          transition:box-shadow .18s, border-color .18s;
          box-shadow:0 1px 4px rgba(0,0,0,.06);
        }
        .g-btn:hover:not(:disabled) { border-color:#c9c3bc; box-shadow:0 4px 14px rgba(0,0,0,.10); }
        .g-btn:disabled { opacity:.5; cursor:not-allowed; }
        .sub-btn {
          width:100%; background:#1a1a1a; color:#fff; border:none;
          border-radius:11px; padding:13px; font-size:14px; font-weight:600;
          cursor:pointer; font-family:'DM Sans',sans-serif;
          display:flex; align-items:center; justify-content:center; gap:9px;
          transition:opacity .15s;
        }
        .sub-btn:hover:not(:disabled) { opacity:.82; }
        .sub-btn:disabled { opacity:.5; cursor:not-allowed; }
        .txt-link { background:none; border:none; color:#1a1a1a; font-weight:700; font-size:13.5px; cursor:pointer; text-decoration:underline; font-family:'DM Sans',sans-serif; padding:0; }
        .txt-link:hover { opacity:.65; }
        .field-label { font-size:11.5px; font-weight:700; color:#b0a89e; text-transform:uppercase; letter-spacing:.6px; display:block; margin-bottom:6px; }
      `}</style>

      <div className="su-wrap" style={{
        background:"#fff", borderRadius:24, padding:"44px 40px",
        width:"100%", maxWidth:460,
        boxShadow:"0 8px 40px rgba(0,0,0,.10),0 1px 4px rgba(0,0,0,.06)",
        border:"1px solid #ede9e4",
      }}>

        {/* ── Logo ── */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:28 }}>
          <div style={{ width:52, height:52, borderRadius:15, background:"#1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
            <GraduationCap size={26} color="#fff"/>
          </div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, fontWeight:400, color:"#1a1a1a" }}>UniAdmin</h1>
          <p style={{ fontSize:13, color:"#b0a89e", marginTop:3 }}>University of Technology, Lagos</p>
        </div>

        <h2 style={{ fontSize:19, fontWeight:700, color:"#1a1a1a", marginBottom:4 }}>Create your account</h2>
        <p style={{ fontSize:13.5, color:"#b0a89e", marginBottom:24, lineHeight:1.6 }}>Fill in your details or sign up with Google</p>

        {/* ── Error ── */}
        {error && (
          <div style={{ background:"#fce4ec", border:"1px solid #f8bbd0", borderRadius:10, padding:"10px 14px", marginBottom:18, display:"flex", alignItems:"center", gap:9, color:"#c62828", fontSize:13 }}>
            <AlertCircle size={15} style={{ flexShrink:0 }}/> {error}
          </div>
        )}

        {/* ── Google ── */}
        <button className="g-btn" onClick={handleGoogle} disabled={busy}>
          {loadingG
            ? <><div style={{ width:17,height:17,border:"2px solid #e2ddd8",borderTopColor:"#1a1a1a",borderRadius:"50%",animation:"spin .7s linear infinite" }}/> Creating account…</>
            : <><GoogleIcon/> Sign up with Google</>
          }
        </button>

        {/* ── Divider ── */}
        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
          <div style={{ flex:1, height:1, background:"#ede9e4" }}/>
          <span style={{ fontSize:12, color:"#c0b8b0", fontWeight:500 }}>or fill in your details</span>
          <div style={{ flex:1, height:1, background:"#ede9e4" }}/>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Name row */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label className="field-label">First Name</label>
              <div style={{ position:"relative" }}>
                <User size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#c0b8b0", pointerEvents:"none" }}/>
                <input className="su-input" type="text" placeholder="Ngozi" value={form.firstName} onChange={set("firstName")} autoComplete="given-name" disabled={busy}/>
              </div>
            </div>
            <div>
              <label className="field-label">Last Name</label>
              <div style={{ position:"relative" }}>
                <User size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#c0b8b0", pointerEvents:"none" }}/>
                <input className="su-input" type="text" placeholder="Eze" value={form.lastName} onChange={set("lastName")} autoComplete="family-name" disabled={busy}/>
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="field-label">Email Address</label>
            <div style={{ position:"relative" }}>
              <Mail size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#c0b8b0", pointerEvents:"none" }}/>
              <input className="su-input" type="email" placeholder="you@univ.edu.ng" value={form.email} onChange={set("email")} autoComplete="email" disabled={busy}/>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="field-label">Phone Number <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0, fontSize:11, color:"#c0b8b0" }}>(optional)</span></label>
            <div style={{ position:"relative" }}>
              <Phone size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#c0b8b0", pointerEvents:"none" }}/>
              <input className="su-input" type="tel" placeholder="+234 801 234 5678" value={form.phone} onChange={set("phone")} autoComplete="tel" disabled={busy}/>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="field-label">Role / Position</label>
            <div style={{ position:"relative" }}>
              <Shield size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#c0b8b0", pointerEvents:"none", zIndex:1 }}/>
              <select className="su-select" value={form.role} onChange={set("role")} disabled={busy}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="field-label">Password</label>
            <div style={{ position:"relative" }}>
              <Lock size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#c0b8b0", pointerEvents:"none" }}/>
              <input className="su-input" type={showPw?"text":"password"} placeholder="At least 6 characters" value={form.password} onChange={set("password")} autoComplete="new-password" disabled={busy} style={{ paddingRight:44 }}/>
              <button type="button" onClick={()=>setShowPw(v=>!v)} style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#c0b8b0", display:"flex", padding:0 }}>
                {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
            <StrengthBar password={form.password}/>
          </div>

          {/* Confirm password */}
          <div>
            <label className="field-label">Confirm Password</label>
            <div style={{ position:"relative" }}>
              <Lock size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#c0b8b0", pointerEvents:"none" }}/>
              <input className="su-input" type={showCf?"text":"password"} placeholder="Repeat password" value={form.confirm} onChange={set("confirm")} autoComplete="new-password" disabled={busy} style={{ paddingRight:44 }}/>
              <button type="button" onClick={()=>setShowCf(v=>!v)} style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#c0b8b0", display:"flex", padding:0 }}>
                {showCf ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
            {/* Match indicator */}
            {form.confirm && (
              <p style={{ fontSize:11.5, marginTop:5, fontWeight:600, color: form.password===form.confirm ? "#22c55e" : "#ef4444" }}>
                {form.password===form.confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          <button className="sub-btn" type="submit" disabled={busy} style={{ marginTop:4 }}>
            {loadingE
              ? <><div style={{ width:16,height:16,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite" }}/> Creating account…</>
              : "Create Account"
            }
          </button>
        </form>

        {/* ── Sign in link ── */}
        <p style={{ textAlign:"center", fontSize:13.5, color:"#b0a89e", marginTop:22 }}>
          Already have an account?{" "}
          <button className="txt-link" onClick={onNavigateToSignIn}>Sign in</button>
        </p>

        <p style={{ fontSize:12, color:"#c0b8b0", textAlign:"center", marginTop:14, lineHeight:1.6 }}>
          🔒 Secured by Firebase Authentication
        </p>
      </div>
    </div>
  );
}