import { useState } from "react";
import { Plus, X, Send, Trash2, Pin, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const PRIORITY = { "High":{ bg:"#fce4ec",color:"#c62828" }, "Normal":{ bg:"#e3f2fd",color:"#1565c0" }, "Low":{ bg:"#f5f5f5",color:"#616161" } };
const AUDIENCE_COLOR = { "All Students":"#4f46e5", "Faculty Only":"#10b981", "Everyone":"#f59e0b" };

const INITIAL = [
  { id:1, title:"Second Semester Exam Timetable Released", body:"The timetable for the 2024/2025 second semester examinations has been published. Students are advised to check the portal.", audience:"All Students", priority:"High", date:"15 Jan 2025", pinned:true,  author:"Admin" },
  { id:2, title:"Faculty Research Symposium — March 2025",  body:"All faculty members are invited to submit abstracts for the annual research symposium taking place 14–16 March 2025.",    audience:"Faculty Only",  priority:"Normal", date:"10 Jan 2025", pinned:false, author:"Admin" },
  { id:3, title:"Library Extended Hours",                   body:"The university library will be open until midnight every weekday during the examination period starting 20 January.",       audience:"Everyone",      priority:"Low",    date:"8 Jan 2025",  pinned:false, author:"Admin" },
];

function Toast({ msg, type }) {
  return <div style={{ position:"fixed",top:24,right:24,zIndex:9999,background:"#fff",border:"1px solid #ede9e4",borderRadius:12,padding:"12px 18px",fontSize:13.5,fontWeight:500,display:"flex",alignItems:"center",gap:9,boxShadow:"0 8px 30px rgba(0,0,0,.10)",animation:"fadeUp .25s ease both",color:"#1a1a1a" }}>
    {type==="error"?<AlertCircle size={15} color="#c62828"/>:<Check size={15} color="#4caf50"/>} {msg}
  </div>;
}

export default function Announcements() {
  const { user, profile } = useAuth();
  const authorName = profile?.displayName || user?.displayName || user?.email || "Admin";

  const [announcements, setAnnouncements] = useState(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [toast,    setToast]    = useState(null);
  const [delId,    setDelId]    = useState(null);
  const [form,     setForm]     = useState({ title:"", body:"", audience:"All Students", priority:"Normal" });

  const fire = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const handleSend = () => {
    if (!form.title.trim()) { fire("Title is required.","error"); return; }
    if (!form.body.trim())  { fire("Message body is required.","error"); return; }
    const item = { id:Date.now(), ...form, date:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}), pinned:false, author:authorName };
    setAnnouncements(prev=>[item,...prev]);
    setForm({ title:"", body:"", audience:"All Students", priority:"Normal" });
    setShowForm(false);
    fire(`Announcement sent to ${form.audience}`);
  };

  const togglePin = (id) => {
    const item = announcements.find(a=>a.id===id);
    setAnnouncements(prev=>prev.map(a=>a.id===id?{...a,pinned:!a.pinned}:a));
    fire(item?.pinned?"Unpinned":"Pinned to top");
  };

  const handleDelete = (id) => {
    setAnnouncements(prev=>prev.filter(a=>a.id!==id));
    setDelId(null);
    fire("Announcement deleted");
  };

  const sorted = [...announcements].sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));

  const selS = { background:"#faf8f5", border:"1.5px solid #ede9e4", borderRadius:10, padding:"10px 13px", fontSize:13.5, outline:"none", fontFamily:"'Inter',sans-serif", color:"#1a1a1a", cursor:"pointer", width:"100%" };

  return (
    <div className="page-enter" style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}

      {delId && (
        <div style={{ position:"fixed",inset:0,zIndex:9998,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
          <div style={{ background:"#fff",borderRadius:20,padding:30,maxWidth:380,width:"100%",boxShadow:"0 24px 60px rgba(0,0,0,.15)" }}>
            <div style={{ width:48,height:48,borderRadius:14,background:"#fce4ec",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14 }}><Trash2 size={22} color="#c62828"/></div>
            <h3 style={{ fontSize:20,fontWeight:700,color:"#1a1a1a",marginBottom:8 }}>Delete announcement?</h3>
            <p style={{ fontSize:13.5,color:"#7a7169",lineHeight:1.6,marginBottom:22 }}>This cannot be undone.</p>
            <div style={{ display:"flex",gap:11 }}>
              <button className="btn-dark" style={{ background:"#c62828" }} onClick={()=>handleDelete(delId)}>Delete</button>
              <button className="btn-ghost" onClick={()=>setDelId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12 }}>
        <div>
          <h1 style={{ fontSize:26,fontWeight:700,color:"#1a1a1a",letterSpacing:"-0.5px" }}>Announcements</h1>
          <p style={{ color:"#b0a89e",fontSize:13.5,marginTop:3 }}>Broadcast messages to students, faculty or everyone</p>
        </div>
        <button className="btn-dark" onClick={()=>setShowForm(true)}><Plus size={15}/> New Announcement</button>
      </div>

      {showForm && (
        <div className="panel" style={{ padding:26,border:"1.5px solid #e3e0ff" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
            <h3 style={{ fontWeight:700,fontSize:15,color:"#1a1a1a",display:"flex",alignItems:"center",gap:8 }}><Send size={15} color="#4f46e5"/> Compose Announcement</h3>
            <button onClick={()=>setShowForm(false)} style={{ background:"none",border:"none",cursor:"pointer",color:"#b0a89e" }}><X size={19}/></button>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            <div>
              <label style={{ fontSize:11.5,fontWeight:700,color:"#b0a89e",textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:6 }}>Title</label>
              <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Exam schedule 2025…" className="field-input"/>
            </div>
            <div>
              <label style={{ fontSize:11.5,fontWeight:700,color:"#b0a89e",textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:6 }}>Message</label>
              <textarea value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))} rows={4} placeholder="Write your announcement…"
                style={{ width:"100%",background:"#faf8f5",border:"1.5px solid #ede9e4",borderRadius:10,padding:"10px 14px",fontSize:13.5,outline:"none",fontFamily:"'Inter',sans-serif",color:"#1a1a1a",resize:"vertical" }}
                onFocus={e=>e.target.style.border="1.5px solid #1a1a1a"} onBlur={e=>e.target.style.border="1.5px solid #ede9e4"}/>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
              <div>
                <label style={{ fontSize:11.5,fontWeight:700,color:"#b0a89e",textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:6 }}>Audience</label>
                <select value={form.audience} onChange={e=>setForm(f=>({...f,audience:e.target.value}))} style={selS}>
                  {["All Students","Faculty Only","Everyone"].map(a=><option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:11.5,fontWeight:700,color:"#b0a89e",textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:6 }}>Priority</label>
                <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} style={selS}>
                  {["Normal","High","Low"].map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:"flex",gap:11 }}>
              <button className="btn-dark" onClick={handleSend}><Send size={14}/> Send</button>
              <button className="btn-ghost" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12 }}>
        {[["Total",announcements.length,"#1a1a1a"],["Pinned",announcements.filter(a=>a.pinned).length,"#f59e0b"],["High Priority",announcements.filter(a=>a.priority==="High").length,"#c62828"]].map(([l,v,c])=>(
          <div key={l} style={{ background:"#fff",borderRadius:14,padding:"16px 18px",border:"1px solid #ede9e4" }}>
            <p style={{ fontSize:22,fontWeight:700,color:c }}>{v}</p>
            <p style={{ fontSize:12.5,color:"#b0a89e",marginTop:3 }}>{l}</p>
          </div>
        ))}
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        {sorted.map(a=>(
          <div key={a.id} className="panel" style={{ padding:22,border:a.pinned?"1.5px solid #e8e8ff":"1px solid #ede9e4" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap" }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:9 }}>
                  {a.pinned&&<span style={{ background:"#eef2ff",color:"#4f46e5",fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99,display:"flex",alignItems:"center",gap:4 }}><Pin size={9}/> Pinned</span>}
                  <span style={{ ...PRIORITY[a.priority],fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99 }}>{a.priority}</span>
                  <span style={{ background:AUDIENCE_COLOR[a.audience]+"16",color:AUDIENCE_COLOR[a.audience],fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:99 }}>{a.audience}</span>
                </div>
                <h3 style={{ fontWeight:700,fontSize:15,color:"#1a1a1a" }}>{a.title}</h3>
                <p style={{ fontSize:13.5,color:"#4a4540",lineHeight:1.7,marginTop:8 }}>{a.body}</p>
                <p style={{ fontSize:12,color:"#b0a89e",marginTop:9 }}>Sent by {a.author} · {a.date}</p>
              </div>
              <div style={{ display:"flex",gap:8,flexShrink:0 }}>
                <button onClick={()=>togglePin(a.id)} title={a.pinned?"Unpin":"Pin"}
                  style={{ width:34,height:34,borderRadius:9,border:"1px solid #ede9e4",background:a.pinned?"#eef2ff":"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:a.pinned?"#4f46e5":"#b0a89e" }}><Pin size={14}/></button>
                <button onClick={()=>setDelId(a.id)}
                  style={{ width:34,height:34,borderRadius:9,border:"1px solid #ede9e4",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#b0a89e" }}><Trash2 size={14}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}