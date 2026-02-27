import { useState, useRef } from "react";
import {
  Camera, Edit3, Save, X, Mail, Shield, Clock, Bell, Eye, EyeOff,
  Check, AlertCircle, Lock, Activity, Download, Calendar,
  Phone, MapPin, User, Building, FileText, Key, LogOut,
  CheckCircle, Pencil, RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

// ─── tiny helpers ─────────────────────────────────────────────────────────────
const ROLES = ["Administrator","Faculty","Registrar","Finance Officer","IT Officer"];

function Toast({ msg, type = "success" }) {
  return (
    <div style={{
      position:"fixed", top:24, right:24, zIndex:9999,
      background: type === "error" ? "#fce4ec" : "#fff",
      border: `1px solid ${type === "error" ? "#f8bbd0" : "#ede9e4"}`,
      borderRadius:13, padding:"12px 18px",
      display:"flex", alignItems:"center", gap:10,
      boxShadow:"0 8px 30px rgba(0,0,0,.12)",
      animation:"toastIn .25s cubic-bezier(.4,0,.2,1) both",
      fontSize:13.5, fontWeight:500,
      color: type === "error" ? "#c62828" : "#1a1a1a",
      maxWidth: 340,
    }}>
      {type === "error"
        ? <AlertCircle size={16} style={{ flexShrink:0, color:"#c62828" }}/>
        : <CheckCircle size={16} style={{ flexShrink:0, color:"#22c55e" }}/>
      }
      {msg}
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div style={{ background:"#fff", borderRadius:18, border:"1px solid #ede9e4", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
      <div style={{ padding:"18px 24px 16px", borderBottom:"1px solid #f5f2ee", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:9, background:"#f0ede9", display:"flex", alignItems:"center", justifyContent:"center", color:"#1a1a1a" }}>
          {icon}
        </div>
        <h3 style={{ fontWeight:700, fontSize:14.5, color:"#1a1a1a" }}>{title}</h3>
      </div>
      <div style={{ padding:"22px 24px" }}>{children}</div>
    </div>
  );
}

function FieldInput({ label, value, onChange, type = "text", disabled, icon, placeholder, hint, multiline, rightEl }) {
  return (
    <div>
      {label && <label style={{ fontSize:11.5, fontWeight:700, color:"#b0a89e", textTransform:"uppercase", letterSpacing:.6, display:"block", marginBottom:6 }}>{label}</label>}
      <div style={{ position:"relative" }}>
        {icon && <div style={{ position:"absolute", left:13, top: multiline ? 13 : "50%", transform: multiline ? "none" : "translateY(-50%)", color:"#c0b8b0", pointerEvents:"none" }}>{icon}</div>}
        {multiline ? (
          <textarea
            value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} disabled={disabled} rows={3}
            style={{ width:"100%", background:disabled?"#faf8f5":"#fff", border:"1.5px solid #ede9e4", borderRadius:11, padding:`11px 14px 11px ${icon?40:14}px`, fontSize:14, outline:"none", fontFamily:"'DM Sans',sans-serif", color:disabled?"#b0a89e":"#1a1a1a", resize:"vertical", cursor:disabled?"not-allowed":"text", transition:"border .18s" }}
            onFocus={e=>{ if(!disabled) e.target.style.border="1.5px solid #1a1a1a"; }}
            onBlur={e=>e.target.style.border="1.5px solid #ede9e4"}
          />
        ) : (
          <input
            type={type} value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} disabled={disabled}
            style={{ width:"100%", background:disabled?"#faf8f5":"#fff", border:"1.5px solid #ede9e4", borderRadius:11, padding:`11px ${rightEl?44:14}px 11px ${icon?40:14}px`, fontSize:14, outline:"none", fontFamily:"'DM Sans',sans-serif", color:disabled?"#b0a89e":"#1a1a1a", cursor:disabled?"not-allowed":"text", transition:"border .18s" }}
            onFocus={e=>{ if(!disabled) e.target.style.border="1.5px solid #1a1a1a"; }}
            onBlur={e=>e.target.style.border="1.5px solid #ede9e4"}
          />
        )}
        {rightEl && <div style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)" }}>{rightEl}</div>}
      </div>
      {hint && <p style={{ fontSize:11.5, color:"#b0a89e", marginTop:5 }}>{hint}</p>}
    </div>
  );
}

function PwInput({ label, value, onChange, placeholder, disabled }) {
  const [show, setShow] = useState(false);
  return (
    <FieldInput
      label={label} value={value} onChange={onChange}
      type={show ? "text" : "password"} placeholder={placeholder} disabled={disabled}
      icon={<Lock size={15}/>}
      rightEl={
        <button type="button" onClick={() => setShow(v => !v)} style={{ background:"none", border:"none", cursor:"pointer", color:"#c0b8b0", display:"flex", padding:0 }}>
          {show ? <EyeOff size={15}/> : <Eye size={15}/>}
        </button>
      }
    />
  );
}

function Toggle({ checked, onChange, label, desc }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 0", borderBottom:"1px solid #f5f2ee" }}>
      <div>
        <p style={{ fontWeight:600, fontSize:14, color:"#1a1a1a" }}>{label}</p>
        {desc && <p style={{ fontSize:12.5, color:"#b0a89e", marginTop:2 }}>{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{ width:42, height:23, borderRadius:99, border:"none", cursor:"pointer", background:checked?"#1a1a1a":"#e5e0db", position:"relative", transition:"background .2s", flexShrink:0 }}
      >
        <div style={{ width:17, height:17, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:checked?22:3, transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,.2)" }}/>
      </button>
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id:"profile",   label:"Profile"        },
  { id:"security",  label:"Security"       },
  { id:"notifs",    label:"Notifications"  },
  { id:"activity",  label:"Activity"       },
];

const ACTIVITY_LOG = [
  { action:"Approved Dr. Afolabi's remark submission",  time:"Today, 09:52 AM",     color:"#10b981" },
  { action:"Sent message to Prof. Adeleke",             time:"Today, 09:41 AM",     color:"#0ea5e9" },
  { action:"Added new course: Advanced Robotics",       time:"Yesterday, 04:12 PM", color:"#f59e0b" },
  { action:"Reviewed Chidi Eze's probation status",     time:"Yesterday, 02:30 PM", color:"#ef4444" },
  { action:"Exported student report — Q4 2024",         time:"Yesterday, 11:00 AM", color:"#8b5cf6" },
  { action:"Updated library catalogue — 3 new books",   time:"Mon, 03:45 PM",       color:"#ec4899" },
  { action:"Created faculty account: Dr. Grace Okafor", time:"Mon, 10:20 AM",       color:"#14b8a6" },
  { action:"Updated Amara Obi's academic record",       time:"Mon, 08:15 AM",       color:"#4f46e5" },
];

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function Profile() {
  const { profile, user, updateProfileData, updateProfilePhoto, changePassword, changeEmail, resetPassword, logout } = useAuth();

  const [tab,     setTab]     = useState("profile");
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);
  const photoRef = useRef(null);

  // Draft state for editing
  const [draft, setDraft] = useState({});

  // Security form
  const [pwForm,   setPwForm]   = useState({ current:"", next:"", confirm:"" });
  const [pwSaving, setPwSaving] = useState(false);
  const [emailForm,  setEmailForm]  = useState({ current:"", newEmail:"" });
  const [emailSaving, setEmailSaving] = useState(false);

  // Notification prefs stored locally (extend to Firestore if needed)
  const [notifs, setNotifs] = useState({ email:true, sms:false, browser:true, reports:true });

  const fire = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const startEditing = () => {
    setDraft({
      firstName: profile?.firstName || profile?.displayName?.split(" ")[0] || "",
      lastName:  profile?.lastName  || profile?.displayName?.split(" ").slice(1).join(" ") || "",
      phone:     profile?.phone     || "",
      dept:      profile?.dept      || "",
      location:  profile?.location  || "",
      bio:       profile?.bio       || "",
      role:      profile?.role      || "Administrator",
    });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!draft.firstName?.trim()) { fire("First name is required.", "error"); return; }
    setSaving(true);
    try {
      await updateProfileData(draft);
      setEditing(false);
      fire("Profile saved — your name updates everywhere instantly ✓");
    } catch (err) {
      fire(err.message || "Failed to save profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { fire("Photo must be under 3 MB.", "error"); return; }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        await updateProfilePhoto(ev.target.result);
        fire("Profile photo updated — showing in sidebar now ✓");
      } catch (err) {
        fire("Failed to upload photo.", "error");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handlePasswordChange = async () => {
    if (!pwForm.current)                   { fire("Enter your current password.", "error"); return; }
    if (pwForm.next.length < 6)            { fire("New password must be at least 6 characters.", "error"); return; }
    if (pwForm.next !== pwForm.confirm)    { fire("New passwords do not match.", "error"); return; }
    // Google users don't have a password to change
    if (user?.providerData?.[0]?.providerId === "google.com") {
      fire("You signed in with Google. Use 'Forgot password?' on the sign-in page instead.", "error"); return;
    }
    setPwSaving(true);
    try {
      await changePassword(pwForm.current, pwForm.next);
      setPwForm({ current:"", next:"", confirm:"" });
      fire("Password changed — take effect on next sign-in ✓");
    } catch (err) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        fire("Current password is incorrect.", "error");
      } else if (err.code === "auth/requires-recent-login") {
        fire("Session expired. Please sign out and sign back in, then try again.", "error");
      } else {
        fire(err.message || "Failed to change password.", "error");
      }
    } finally {
      setPwSaving(false);
    }
  };

  const handleEmailChange = async () => {
    if (!emailForm.current)          { fire("Enter your current password to confirm.", "error"); return; }
    if (!emailForm.newEmail?.trim()) { fire("Enter the new email address.", "error"); return; }
    if (!/\S+@\S+\.\S+/.test(emailForm.newEmail)) { fire("Please enter a valid email address.", "error"); return; }
    if (user?.providerData?.[0]?.providerId === "google.com") {
      fire("You signed in with Google. Email is managed by your Google account.", "error"); return;
    }
    setEmailSaving(true);
    try {
      await changeEmail(emailForm.current, emailForm.newEmail.trim());
      setEmailForm({ current:"", newEmail:"" });
      fire(`Email updated to ${emailForm.newEmail} ✓`);
    } catch (err) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        fire("Current password is incorrect.", "error");
      } else if (err.code === "auth/email-already-in-use") {
        fire("That email is already in use by another account.", "error");
      } else if (err.code === "auth/requires-recent-login") {
        fire("Session expired. Please sign out and sign back in.", "error");
      } else {
        fire(err.message || "Failed to update email.", "error");
      }
    } finally {
      setEmailSaving(false);
    }
  };

  const handleSendReset = async () => {
    try {
      await resetPassword(profile?.email || user?.email);
      fire("Password reset email sent — check your inbox ✓");
    } catch (err) {
      fire("Failed to send reset email.", "error");
    }
  };

  const handleExportActivity = () => {
    const csv = "Action,Time\n" + ACTIVITY_LOG.map(a => `"${a.action}","${a.time}"`).join("\n");
    const blob = new Blob([csv], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "activity-log.csv";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    fire("Activity log downloaded ✓");
  };

  const isGoogle = user?.providerData?.[0]?.providerId === "google.com";
  const displayName = profile?.displayName || profile?.email || "Admin";
  const initials    = displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const joinDate    = profile?.createdAt?.toDate
    ? profile.createdAt.toDate().toLocaleDateString("en-GB", { month:"long", year:"numeric" })
    : "—";

  return (
    <div className="page-enter" style={{ display:"flex", flexDirection:"column", gap:22, paddingBottom:40 }}>
      <style>{`
        @keyframes toastIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type}/>}

      {/* ── Page header ── */}
      <div>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, fontWeight:400, color:"#1a1a1a" }}>My Profile</h1>
        <p style={{ color:"#b0a89e", fontSize:13.5, marginTop:3 }}>Your account details, saved directly to Firebase</p>
      </div>

      {/* ── Hero card ── */}
      <div style={{ background:"#fff", borderRadius:20, overflow:"hidden", border:"1px solid #ede9e4", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
        {/* Banner */}
        <div style={{ height:110, background:"linear-gradient(135deg,#1a1a1a 0%,#3d3d3d 60%,#5a5a5a 100%)", position:"relative" }}>
          {/* Subtle texture dots */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle, rgba(255,255,255,.06) 1px, transparent 1px)", backgroundSize:"20px 20px" }}/>
        </div>

        <div style={{ padding:"0 28px 26px", marginTop:-38, display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
          {/* Avatar + name */}
          <div style={{ display:"flex", alignItems:"flex-end", gap:16 }}>
            {/* Photo */}
            <div style={{ position:"relative" }}>
              <div style={{
                width:76, height:76, borderRadius:"50%",
                background: profile?.photo ? "transparent" : "#1a1a1a",
                border:"3px solid #fff",
                overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:24, fontWeight:700, color:"#fff",
                boxShadow:"0 4px 16px rgba(0,0,0,.18)",
              }}>
                {profile?.photo
                  ? <img src={profile.photo} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  : initials
                }
              </div>
              <button
                onClick={() => photoRef.current.click()}
                title="Change photo"
                style={{ position:"absolute", bottom:2, right:2, width:26, height:26, borderRadius:"50%", background:"#1a1a1a", border:"2.5px solid #fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 2px 6px rgba(0,0,0,.25)" }}
              >
                <Camera size={12} color="#fff"/>
              </button>
              <input type="file" ref={photoRef} style={{ display:"none" }} accept="image/*" onChange={handlePhoto}/>
            </div>

            <div style={{ paddingBottom:6 }}>
              <h2 style={{ fontSize:20, fontWeight:700, color:"#1a1a1a" }}>{displayName}</h2>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:5, flexWrap:"wrap" }}>
                <span style={{ background:"#f0ede9", color:"#1a1a1a", padding:"3px 11px", borderRadius:99, fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:5 }}>
                  <Shield size={10}/> {profile?.role || "Administrator"}
                </span>
                {isGoogle && (
                  <span style={{ background:"#e3f2fd", color:"#1565c0", padding:"3px 11px", borderRadius:99, fontSize:12, fontWeight:600 }}>
                    Google account
                  </span>
                )}
                <span style={{ fontSize:12.5, color:"#b0a89e" }}>{profile?.email}</span>
              </div>
            </div>
          </div>

          {/* Edit / Save buttons */}
          <div style={{ paddingBottom:6 }}>
            {editing ? (
              <div style={{ display:"flex", gap:10 }}>
                <button
                  onClick={handleSave} disabled={saving}
                  style={{ display:"flex", alignItems:"center", gap:7, background:"#1a1a1a", color:"#fff", border:"none", borderRadius:11, padding:"10px 18px", fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", opacity:saving?.6:1 }}>
                  {saving
                    ? <><div style={{ width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite" }}/> Saving…</>
                    : <><Save size={14}/> Save Changes</>
                  }
                </button>
                <button onClick={() => setEditing(false)} style={{ display:"flex", alignItems:"center", gap:7, background:"#f0ede9", color:"#1a1a1a", border:"none", borderRadius:11, padding:"10px 18px", fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                  <X size={14}/> Cancel
                </button>
              </div>
            ) : (
              <button onClick={startEditing} style={{ display:"flex", alignItems:"center", gap:7, background:"#f0ede9", color:"#1a1a1a", border:"none", borderRadius:11, padding:"10px 18px", fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                <Edit3 size={14}/> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Quick stats strip */}
        <div style={{ padding:"14px 28px 18px", borderTop:"1px solid #f5f2ee", display:"flex", gap:32, flexWrap:"wrap" }}>
          {[
            ["Member Since", joinDate],
            ["Department", profile?.dept || "—"],
            ["Location", profile?.location || "—"],
            ["Phone", profile?.phone || "—"],
          ].map(([k, v]) => (
            <div key={k}>
              <p style={{ fontSize:11, color:"#b0a89e", fontWeight:700, textTransform:"uppercase", letterSpacing:.6 }}>{k}</p>
              <p style={{ fontSize:13.5, color:"#1a1a1a", fontWeight:500, marginTop:3 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display:"flex", gap:3, background:"#f0ede9", borderRadius:13, padding:4, width:"fit-content" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding:"8px 18px", borderRadius:9, border:"none", cursor:"pointer", background:tab===t.id?"#fff":"transparent", color:tab===t.id?"#1a1a1a":"#7a7169", fontWeight:tab===t.id?700:500, fontSize:13, fontFamily:"'DM Sans',sans-serif", boxShadow:tab===t.id?"0 1px 4px rgba(0,0,0,.07)":"none", transition:"all .15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════════════════ PROFILE TAB ════════════════════ */}
      {tab === "profile" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <SectionCard title="Personal Information" icon={<User size={15}/>}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <FieldInput label="First Name" value={editing ? draft.firstName : (profile?.firstName || profile?.displayName?.split(" ")[0] || "")} onChange={v => setDraft(d => ({...d, firstName:v}))} disabled={!editing} icon={<User size={14}/>} placeholder="First name"/>
              <FieldInput label="Last Name"  value={editing ? draft.lastName  : (profile?.lastName  || profile?.displayName?.split(" ").slice(1).join(" ") || "")} onChange={v => setDraft(d => ({...d, lastName:v}))}  disabled={!editing} icon={<User size={14}/>} placeholder="Last name"/>
              <FieldInput label="Phone"      value={editing ? draft.phone     : (profile?.phone || "")}     onChange={v => setDraft(d => ({...d, phone:v}))}     disabled={!editing} icon={<Phone size={14}/>} placeholder="+234 801 234 5678"/>
              <div>
                <label style={{ fontSize:11.5, fontWeight:700, color:"#b0a89e", textTransform:"uppercase", letterSpacing:.6, display:"block", marginBottom:6 }}>Role</label>
                {editing ? (
                  <div style={{ position:"relative" }}>
                    <Shield size={14} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#c0b8b0", pointerEvents:"none" }}/>
                    <select
                      value={draft.role || "Administrator"}
                      onChange={e => setDraft(d => ({...d, role:e.target.value}))}
                      style={{ width:"100%", background:"#fff", border:"1.5px solid #ede9e4", borderRadius:11, padding:"11px 14px 11px 40px", fontSize:14, outline:"none", fontFamily:"'DM Sans',sans-serif", color:"#1a1a1a", cursor:"pointer", appearance:"none" }}
                      onFocus={e => e.target.style.border="1.5px solid #1a1a1a"}
                      onBlur={e => e.target.style.border="1.5px solid #ede9e4"}
                    >
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                ) : (
                  <div style={{ background:"#faf8f5", border:"1.5px solid #ede9e4", borderRadius:11, padding:"11px 14px", fontSize:14, color:"#b0a89e", display:"flex", alignItems:"center", gap:10 }}>
                    <Shield size={14} color="#c0b8b0"/>{profile?.role || "Administrator"}
                  </div>
                )}
              </div>
              <FieldInput label="Department" value={editing ? draft.dept     : (profile?.dept || "")}     onChange={v => setDraft(d => ({...d, dept:v}))}     disabled={!editing} icon={<Building size={14}/>} placeholder="e.g. Office of the Registrar"/>
              <FieldInput label="Location"   value={editing ? draft.location : (profile?.location || "")} onChange={v => setDraft(d => ({...d, location:v}))} disabled={!editing} icon={<MapPin size={14}/>}   placeholder="City, institution"/>
            </div>
            <div style={{ marginTop:16 }}>
              <FieldInput label="Bio" value={editing ? draft.bio : (profile?.bio || "")} onChange={v => setDraft(d => ({...d, bio:v}))} disabled={!editing} icon={<FileText size={14}/>} placeholder="A short description of your role…" multiline/>
            </div>
            {editing && (
              <div style={{ marginTop:16, padding:"11px 14px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, display:"flex", alignItems:"center", gap:9, fontSize:13, color:"#92400e" }}>
                <AlertCircle size={14} style={{ flexShrink:0 }}/>
                Your name updates across the entire app the moment you save.
              </div>
            )}
          </SectionCard>

          {/* Photo upload card */}
          <SectionCard title="Profile Photo" icon={<Camera size={15}/>}>
            <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
              <div style={{ width:72, height:72, borderRadius:"50%", background: profile?.photo ? "transparent" : "#1a1a1a", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:700, color:"#fff", flexShrink:0, boxShadow:"0 3px 12px rgba(0,0,0,.12)" }}>
                {profile?.photo
                  ? <img src={profile.photo} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  : initials}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, color:"#1a1a1a", fontWeight:500, marginBottom:5 }}>Upload a new profile photo</p>
                <p style={{ fontSize:13, color:"#b0a89e", marginBottom:14, lineHeight:1.6 }}>JPEG or PNG, max 3 MB. Your photo appears in the sidebar and on your profile.</p>
                <button
                  onClick={() => photoRef.current.click()}
                  style={{ display:"inline-flex", alignItems:"center", gap:7, background:"#1a1a1a", color:"#fff", border:"none", borderRadius:10, padding:"10px 18px", fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                  <Camera size={14}/> Choose Photo
                </button>
                <input type="file" ref={photoRef} style={{ display:"none" }} accept="image/*" onChange={handlePhoto}/>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ════════════════════ SECURITY TAB ════════════════════ */}
      {tab === "security" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Change Password */}
          <SectionCard title="Change Password" icon={<Key size={15}/>}>
            {isGoogle ? (
              <div style={{ padding:"16px 18px", background:"#e3f2fd", borderRadius:12, border:"1px solid #bbdefb", fontSize:13.5, color:"#1565c0", lineHeight:1.7 }}>
                <p style={{ fontWeight:600, marginBottom:4 }}>Google account detected</p>
                <p>You signed in with Google, so your password is managed by Google. To change it, visit <a href="https://myaccount.google.com" target="_blank" rel="noreferrer" style={{ color:"#1565c0", fontWeight:600 }}>myaccount.google.com</a>.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:14, maxWidth:420 }}>
                <PwInput label="Current Password" value={pwForm.current} onChange={v => setPwForm(f => ({...f, current:v}))} placeholder="Your current password" disabled={pwSaving}/>
                <PwInput label="New Password"     value={pwForm.next}    onChange={v => setPwForm(f => ({...f, next:v}))}    placeholder="Min. 6 characters"      disabled={pwSaving}/>
                <PwInput label="Confirm Password" value={pwForm.confirm} onChange={v => setPwForm(f => ({...f, confirm:v}))} placeholder="Repeat new password"     disabled={pwSaving}/>
                {pwForm.confirm && (
                  <p style={{ fontSize:12, fontWeight:600, color: pwForm.next===pwForm.confirm?"#22c55e":"#ef4444" }}>
                    {pwForm.next===pwForm.confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
                <button onClick={handlePasswordChange} disabled={pwSaving}
                  style={{ display:"inline-flex", alignItems:"center", gap:7, background:"#1a1a1a", color:"#fff", border:"none", borderRadius:11, padding:"11px 20px", fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", width:"fit-content", opacity:pwSaving?.6:1 }}>
                  {pwSaving ? <><div style={{ width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite" }}/> Saving…</> : <><Key size={14}/> Update Password</>}
                </button>
                <p style={{ fontSize:12, color:"#b0a89e" }}>After changing, you'll use the new password on your next sign-in.</p>
              </div>
            )}
          </SectionCard>

          {/* Change Email */}
          <SectionCard title="Change Email Address" icon={<Mail size={15}/>}>
            {isGoogle ? (
              <div style={{ padding:"16px 18px", background:"#e3f2fd", borderRadius:12, border:"1px solid #bbdefb", fontSize:13.5, color:"#1565c0", lineHeight:1.7 }}>
                <p style={{ fontWeight:600, marginBottom:4 }}>Google account detected</p>
                <p>Your email is tied to your Google account and cannot be changed here.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:14, maxWidth:420 }}>
                <p style={{ fontSize:13.5, color:"#7a7169", lineHeight:1.6 }}>
                  Current: <strong style={{ color:"#1a1a1a" }}>{profile?.email}</strong>
                </p>
                <FieldInput label="New Email Address" value={emailForm.newEmail} onChange={v => setEmailForm(f => ({...f, newEmail:v}))} type="email" icon={<Mail size={14}/>} placeholder="new@example.com" disabled={emailSaving}/>
                <PwInput label="Confirm with Current Password" value={emailForm.current} onChange={v => setEmailForm(f => ({...f, current:v}))} placeholder="Required to change email" disabled={emailSaving}/>
                <button onClick={handleEmailChange} disabled={emailSaving}
                  style={{ display:"inline-flex", alignItems:"center", gap:7, background:"#1a1a1a", color:"#fff", border:"none", borderRadius:11, padding:"11px 20px", fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", width:"fit-content", opacity:emailSaving?.6:1 }}>
                  {emailSaving ? <><div style={{ width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite" }}/> Saving…</> : <><Mail size={14}/> Update Email</>}
                </button>
              </div>
            )}
          </SectionCard>

          {/* Send reset link */}
          <SectionCard title="Password Reset via Email" icon={<RefreshCw size={15}/>}>
            <p style={{ fontSize:13.5, color:"#7a7169", lineHeight:1.6, marginBottom:16 }}>
              Sends a secure reset link to <strong style={{ color:"#1a1a1a" }}>{profile?.email}</strong>. Useful if you've forgotten your current password or want to log in from a new device.
            </p>
            <button onClick={handleSendReset}
              style={{ display:"inline-flex", alignItems:"center", gap:7, background:"#f0ede9", color:"#1a1a1a", border:"none", borderRadius:11, padding:"11px 20px", fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
              <Mail size={14}/> Send Reset Link to My Email
            </button>
          </SectionCard>

          {/* Danger zone */}
          <SectionCard title="Sign Out" icon={<LogOut size={15}/>}>
            <p style={{ fontSize:13.5, color:"#7a7169", lineHeight:1.6, marginBottom:16 }}>
              Signs you out on this device. Your data is saved to Firebase and will be here when you return.
            </p>
            <button
              onClick={logout}
              style={{ display:"inline-flex", alignItems:"center", gap:7, background:"#fce4ec", color:"#c62828", border:"1px solid #f8bbd0", borderRadius:11, padding:"11px 20px", fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
              <LogOut size={14}/> Sign Out
            </button>
          </SectionCard>
        </div>
      )}

      {/* ════════════════════ NOTIFICATIONS TAB ════════════════════ */}
      {tab === "notifs" && (
        <SectionCard title="Notification Preferences" icon={<Bell size={15}/>}>
          <Toggle checked={notifs.email}   onChange={v => { setNotifs(n => ({...n, email:v}));   fire(`Email notifications ${v?"enabled":"disabled"}`);   }} label="Email Notifications"   desc="Important updates sent to your email"/>
          <Toggle checked={notifs.sms}     onChange={v => { setNotifs(n => ({...n, sms:v}));     fire(`SMS notifications ${v?"enabled":"disabled"}`);     }} label="SMS Alerts"             desc="Critical alerts sent to your phone number"/>
          <Toggle checked={notifs.browser} onChange={v => { setNotifs(n => ({...n, browser:v})); fire(`Browser notifications ${v?"enabled":"disabled"}`); }} label="Browser Notifications"  desc="Desktop popups while using the platform"/>
          <Toggle checked={notifs.reports} onChange={v => { setNotifs(n => ({...n, reports:v})); fire(`Weekly reports ${v?"enabled":"disabled"}`);         }} label="Weekly Reports Digest"  desc="A summary of student performance every Monday"/>
          <p style={{ fontSize:12, color:"#b0a89e", marginTop:16 }}>Notification settings are saved locally on this device.</p>
        </SectionCard>
      )}

      {/* ════════════════════ ACTIVITY TAB ════════════════════ */}
      {tab === "activity" && (
        <SectionCard title="Recent Activity" icon={<Activity size={15}/>}>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:18 }}>
            <button onClick={handleExportActivity}
              style={{ display:"inline-flex", alignItems:"center", gap:7, background:"#f0ede9", color:"#1a1a1a", border:"none", borderRadius:10, padding:"8px 14px", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
              <Download size={13}/> Export CSV
            </button>
          </div>
          {ACTIVITY_LOG.map((a, i) => (
            <div key={i} style={{ display:"flex", gap:13, paddingBottom:14, marginBottom:i < ACTIVITY_LOG.length-1 ? 14 : 0, borderBottom: i < ACTIVITY_LOG.length-1 ? "1px solid #f5f2ee" : "none" }}>
              <div style={{ width:9, height:9, borderRadius:"50%", background:a.color, flexShrink:0, marginTop:6 }}/>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13.5, color:"#1a1a1a", fontWeight:500 }}>{a.action}</p>
                <p style={{ fontSize:12, color:"#b0a89e", marginTop:3, display:"flex", alignItems:"center", gap:5 }}><Clock size={11}/>{a.time}</p>
              </div>
            </div>
          ))}
        </SectionCard>
      )}
    </div>
  );
}