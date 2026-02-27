import { useState, useRef } from "react";
import { Camera, Edit3, Save, X, Mail, Phone, MapPin, Shield, Clock, Bell, Eye, EyeOff, Check, AlertCircle, Lock, Activity, Users, BookOpen, GraduationCap, TrendingUp, Key, Download, Calendar } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const ACTIVITY = [
  { action:"Updated Amara Obi's academic record",       time:"Today, 10:14 AM",     color:"#4f46e5", Icon:GraduationCap },
  { action:"Approved Dr. Afolabi's remark submission",  time:"Today, 09:52 AM",     color:"#10b981", Icon:Check         },
  { action:"Sent message to Prof. Adeleke",             time:"Today, 09:41 AM",     color:"#0ea5e9", Icon:Mail          },
  { action:"Added new course: Advanced Robotics",       time:"Yesterday, 04:12 PM", color:"#f59e0b", Icon:BookOpen      },
  { action:"Reviewed Chidi Eze's probation status",     time:"Yesterday, 02:30 PM", color:"#ef4444", Icon:AlertCircle   },
  { action:"Exported student report — Q4 2024",         time:"Yesterday, 11:00 AM", color:"#8b5cf6", Icon:Download      },
];

function Toast({ msg, type }) {
  return <div style={{ position:"fixed",top:24,right:24,zIndex:9999,background:"#fff",border:"1px solid #ede9e4",borderRadius:12,padding:"12px 18px",fontSize:13.5,fontWeight:500,display:"flex",alignItems:"center",gap:9,boxShadow:"0 8px 30px rgba(0,0,0,.10)",animation:"fadeUp .25s ease both",color:"#1a1a1a" }}>
    {type==="error"?<AlertCircle size={15} color="#c62828"/>:<Check size={15} color="#4caf50"/>} {msg}
  </div>;
}

const Toggle = ({ checked, onChange, label, desc }) => (
  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 0",borderBottom:"1px solid #f5f2ee" }}>
    <div><p style={{ fontWeight:600,fontSize:14,color:"#1a1a1a" }}>{label}</p>{desc&&<p style={{ fontSize:12.5,color:"#b0a89e",marginTop:2 }}>{desc}</p>}</div>
    <button onClick={()=>onChange(!checked)} className="toggle-track" style={{ background:checked?"#1a1a1a":"#e5e0db" }}>
      <div className="toggle-thumb" style={{ left:checked?21:3 }}/>
    </button>
  </div>
);

export default function Profile() {
  const { admin, setAdmin } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(admin);
  const [tab,     setTab]     = useState("profile");
  const [toast,   setToast]   = useState(null);
  const [pw,      setPw]      = useState({ current:"", next:"", confirm:"" });
  const [showPw,  setShowPw]  = useState({ current:false, next:false, confirm:false });
  const photoRef = useRef(null);

  const fire = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  const handlePhoto = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 5*1024*1024) { fire("Photo must be under 5 MB","error"); return; }
    const reader = new FileReader();
    reader.onload = ev => { const u = {...admin,photo:ev.target.result}; setAdmin(u); setDraft(u); fire("Photo updated — showing in sidebar now"); };
    reader.readAsDataURL(file); e.target.value = "";
  };

  const handleSave = () => {
    if (!draft.firstName.trim()||!draft.lastName.trim()) { fire("Name cannot be empty","error"); return; }
    if (!draft.email.trim()) { fire("Email cannot be empty","error"); return; }
    setAdmin(draft); setEditing(false);
    fire("Profile saved — your name and email are updated everywhere");
  };

  const handlePwChange = () => {
    if (!pw.current)             { fire("Enter your current password","error"); return; }
    if (pw.current!==admin.password) { fire("Current password is incorrect","error"); return; }
    if (pw.next.length<6)        { fire("New password must be at least 6 characters","error"); return; }
    if (pw.next!==pw.confirm)    { fire("New passwords do not match","error"); return; }
    setAdmin({...admin,password:pw.next}); setPw({current:"",next:"",confirm:""});
    fire("Password changed — use it on your next sign-in");
  };

  const initials = `${admin.firstName[0]}${admin.lastName[0]}`;

  const TABS = [{id:"profile",label:"Profile"},{id:"security",label:"Security"},{id:"notifs",label:"Notifications"},{id:"activity",label:"Activity"}];

  return (
    <div className="page-enter" style={{ display:"flex",flexDirection:"column",gap:22 }}>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}

      <div>
        <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:26,fontWeight:400,color:"#1a1a1a" }}>My Profile</h1>
        <p style={{ color:"#b0a89e",fontSize:13.5,marginTop:3 }}>Changes save instantly and update across the entire app</p>
      </div>

      {/* Hero */}
      <div className="panel" style={{ overflow:"hidden" }}>
        <div style={{ height:110, background:"linear-gradient(135deg,#1a1a1a 0%,#3a3a3a 100%)" }}/>
        <div style={{ padding:"0 28px 26px", marginTop:-36, display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
          <div style={{ display:"flex", alignItems:"flex-end", gap:16 }}>
            <div style={{ position:"relative" }}>
              <div style={{ width:72, height:72, borderRadius:"50%", background:"#1a1a1a", border:"3px solid #fff", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:700, color:"#fff", fontFamily:"'DM Sans',sans-serif", boxShadow:"0 4px 16px rgba(0,0,0,.2)" }}>
                {admin.photo?<img src={admin.photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>:initials}
              </div>
              <button onClick={()=>photoRef.current.click()} title="Change photo"
                style={{ position:"absolute",bottom:1,right:1,width:24,height:24,borderRadius:"50%",background:"#1a1a1a",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
                <Camera size={11} color="#fff"/>
              </button>
              <input type="file" ref={photoRef} style={{ display:"none" }} accept="image/*" onChange={handlePhoto}/>
            </div>
            <div style={{ paddingBottom:6 }}>
              <h2 style={{ fontSize:19,fontWeight:700,color:"#1a1a1a" }}>{admin.firstName} {admin.lastName}</h2>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:4 }}>
                <span style={{ background:"#f0ede9",color:"#1a1a1a",padding:"2px 10px",borderRadius:99,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5 }}>
                  <Shield size={10}/> {admin.role}
                </span>
                <span style={{ fontSize:12.5,color:"#b0a89e" }}>{admin.dept}</span>
              </div>
            </div>
          </div>
          <div style={{ paddingBottom:6 }}>
            {editing?(
              <div style={{ display:"flex",gap:10 }}>
                <button className="btn-dark" onClick={handleSave}><Save size={14}/> Save</button>
                <button className="btn-ghost" onClick={()=>{setDraft(admin);setEditing(false);}}><X size={14}/> Cancel</button>
              </div>
            ):(
              <button className="btn-ghost" onClick={()=>{setDraft(admin);setEditing(true);setTab("profile");}}><Edit3 size={14}/> Edit Profile</button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex",gap:3,background:"#f0ede9",borderRadius:12,padding:3,width:"fit-content" }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ padding:"7px 16px",borderRadius:9,border:"none",cursor:"pointer",background:tab===t.id?"#fff":"transparent",color:tab===t.id?"#1a1a1a":"#7a7169",fontWeight:tab===t.id?700:500,fontSize:13,fontFamily:"'DM Sans',sans-serif",boxShadow:tab===t.id?"0 1px 4px rgba(0,0,0,.07)":"none",transition:"all .15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab==="profile" && (
        <div className="panel" style={{ padding:26 }}>
          <h3 style={{ fontWeight:700,fontSize:15,color:"#1a1a1a",marginBottom:22 }}>Personal Information</h3>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
            {[["First Name","firstName"],["Last Name","lastName"],["Email","email"],["Phone","phone"],["Role","role"],["Department","dept"],["Location","location"]].map(([l,k])=>(
              <div key={k} style={{ gridColumn:k==="location"?"span 2":"span 1" }}>
                <label style={{ fontSize:11.5,fontWeight:700,color:"#b0a89e",textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:6 }}>{l}</label>
                <input value={editing?draft[k]:admin[k]} onChange={e=>setDraft(d=>({...d,[k]:e.target.value}))} disabled={!editing} className="field-input"/>
              </div>
            ))}
            <div style={{ gridColumn:"span 2" }}>
              <label style={{ fontSize:11.5,fontWeight:700,color:"#b0a89e",textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:6 }}>Bio</label>
              <textarea value={editing?draft.bio:admin.bio} onChange={e=>setDraft(d=>({...d,bio:e.target.value}))} disabled={!editing} rows={3}
                style={{ width:"100%",background:editing?"#fff":"#faf8f5",border:"1.5px solid #ede9e4",borderRadius:10,padding:"10px 14px",fontSize:13.5,outline:"none",fontFamily:"'DM Sans',sans-serif",color:!editing?"#b0a89e":"#1a1a1a",resize:"vertical",cursor:!editing?"not-allowed":"text" }}
                onFocus={e=>{if(editing)e.target.style.border="1.5px solid #1a1a1a";}} onBlur={e=>e.target.style.border="1.5px solid #ede9e4"}/>
            </div>
          </div>
          {editing&&<div style={{ marginTop:16,background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"11px 14px",fontSize:13,color:"#92400e",display:"flex",alignItems:"center",gap:9 }}><AlertCircle size={14} style={{ flexShrink:0 }}/>Saving will update your name and sign-in email immediately.</div>}
        </div>
      )}

      {tab==="security" && (
        <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
          <div className="panel" style={{ padding:26 }}>
            <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:20 }}><Lock size={16} color="#1a1a1a"/><h3 style={{ fontWeight:700,fontSize:15,color:"#1a1a1a" }}>Change Password</h3></div>
            <div style={{ display:"flex",flexDirection:"column",gap:14,maxWidth:400 }}>
              {[["Current Password","current"],["New Password","next"],["Confirm Password","confirm"]].map(([l,k])=>(
                <div key={k}>
                  <label style={{ fontSize:11.5,fontWeight:700,color:"#b0a89e",textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:6 }}>{l}</label>
                  <div style={{ position:"relative" }}>
                    <input type={showPw[k]?"text":"password"} value={pw[k]} onChange={e=>setPw(p=>({...p,[k]:e.target.value}))} placeholder={k==="current"?"Current password":"Min. 6 characters"} className="field-input" style={{ paddingRight:42 }}/>
                    <button type="button" onClick={()=>setShowPw(p=>({...p,[k]:!p[k]}))} style={{ position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#b0a89e",display:"flex" }}>
                      {showPw[k]?<EyeOff size={16}/>:<Eye size={16}/>}
                    </button>
                  </div>
                </div>
              ))}
              <button className="btn-dark" onClick={handlePwChange} style={{ width:"fit-content" }}><Key size={14}/> Update Password</button>
            </div>
            <p style={{ fontSize:12,color:"#b0a89e",marginTop:14 }}>Your new password takes effect on your next sign-in.</p>
          </div>
          <div className="panel" style={{ padding:26 }}>
            <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:14 }}><Shield size={16} color="#1a1a1a"/><h3 style={{ fontWeight:700,fontSize:15,color:"#1a1a1a" }}>Two-Factor Auth</h3></div>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14 }}>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13.5,color:"#4a4540",lineHeight:1.6 }}>Add an extra layer of security — a code is required at each sign-in.</p>
                <p style={{ fontSize:13,color:admin.twoFactor?"#2e7d32":"#b0a89e",marginTop:7,fontWeight:600 }}>Status: {admin.twoFactor?"✓ Enabled":"Not enabled"}</p>
              </div>
              <button onClick={()=>{setAdmin({...admin,twoFactor:!admin.twoFactor});fire(admin.twoFactor?"2FA disabled":"2FA enabled");}}
                className={admin.twoFactor?"btn-ghost":"btn-dark"} style={{ background:admin.twoFactor?"#fce4ec":"#1a1a1a",color:admin.twoFactor?"#c62828":"#fff" }}>
                {admin.twoFactor?"Disable":"Enable"} 2FA
              </button>
            </div>
          </div>
        </div>
      )}

      {tab==="notifs" && (
        <div className="panel" style={{ padding:26 }}>
          <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:20 }}><Bell size={16} color="#1a1a1a"/><h3 style={{ fontWeight:700,fontSize:15,color:"#1a1a1a" }}>Notifications</h3></div>
          <Toggle checked={admin.notifications.email}   onChange={v=>{setAdmin({...admin,notifications:{...admin.notifications,email:v}});fire(`Email notifications ${v?"on":"off"}`);}}   label="Email"          desc="Important updates via email"/>
          <Toggle checked={admin.notifications.sms}     onChange={v=>{setAdmin({...admin,notifications:{...admin.notifications,sms:v}});fire(`SMS notifications ${v?"on":"off"}`);}}     label="SMS"            desc="Critical alerts to your phone"/>
          <Toggle checked={admin.notifications.browser} onChange={v=>{setAdmin({...admin,notifications:{...admin.notifications,browser:v}});fire(`Browser notifications ${v?"on":"off"}`);}} label="Browser"        desc="Desktop notifications while active"/>
          <Toggle checked={admin.notifications.reports} onChange={v=>{setAdmin({...admin,notifications:{...admin.notifications,reports:v}});fire(`Weekly reports ${v?"on":"off"}`);}}  label="Weekly Reports" desc="Weekly student performance digest"/>
        </div>
      )}

      {tab==="activity" && (
        <div className="panel" style={{ padding:26 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
            <div style={{ display:"flex",alignItems:"center",gap:9 }}><Activity size={16} color="#1a1a1a"/><h3 style={{ fontWeight:700,fontSize:15,color:"#1a1a1a" }}>Recent Activity</h3></div>
            <button className="btn-ghost" style={{ padding:"7px 13px",fontSize:13 }} onClick={()=>{
              const csv="Action,Time\n"+ACTIVITY.map(a=>`"${a.action}","${a.time}"`).join("\n");
              const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);
              const el=document.createElement("a");el.href=url;el.download="activity-log.csv";document.body.appendChild(el);el.click();document.body.removeChild(el);
              fire("Activity log downloaded");
            }}>
              <Download size={13}/> Export CSV
            </button>
          </div>
          {ACTIVITY.map((a,i)=>(
            <div key={i} style={{ display:"flex",gap:13,paddingBottom:14,marginBottom:14,borderBottom:i<ACTIVITY.length-1?"1px solid #f5f2ee":"none" }}>
              <div style={{ width:34,height:34,borderRadius:10,background:a.color+"16",display:"flex",alignItems:"center",justifyContent:"center",color:a.color,flexShrink:0 }}><a.Icon size={14}/></div>
              <div>
                <p style={{ fontSize:13.5,color:"#1a1a1a",fontWeight:500 }}>{a.action}</p>
                <p style={{ fontSize:12,color:"#b0a89e",marginTop:3,display:"flex",alignItems:"center",gap:5 }}><Clock size={11}/>{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}