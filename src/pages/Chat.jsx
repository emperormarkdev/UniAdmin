import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, MicOff, X, Search, Phone, Video, MoreHorizontal, Check, CheckCheck, Image, FileText } from "lucide-react";

const CONTACTS = [
  { id:1,  name:"Dr. Chukwuemeka Afolabi", role:"Computer Science",        avatar:"CA", color:"#4f46e5", online:true,  unread:2, time:"09:41",  last:"Please review Amara's updated grade sheet when you get a chance." },
  { id:2,  name:"Prof. Rasheed Adeleke",   role:"Electrical Engineering",   avatar:"RA", color:"#0ea5e9", online:true,  unread:0, time:"08:30",  last:"The lab equipment requisition has been approved." },
  { id:3,  name:"Dr. Amina Bello",         role:"Medicine & Surgery",       avatar:"AB", color:"#10b981", online:false, unread:4, time:"Yesterday",last:"Can we reschedule the clinical assessment review?" },
  { id:4,  name:"Prof. Yemi Salami",       role:"Law",                      avatar:"YS", color:"#f59e0b", online:true,  unread:0, time:"Yesterday",last:"The moot court calendar has been updated." },
  { id:5,  name:"Dr. Grace Okafor",        role:"Business Administration",  avatar:"GO", color:"#8b5cf6", online:false, unread:0, time:"Mon",     last:"Marketing students' project submissions are in." },
  { id:6,  name:"Prof. Emeka Obi",         role:"Architecture",             avatar:"EO", color:"#ec4899", online:true,  unread:0, time:"Mon",     last:"Studio final crits are scheduled for Friday 2pm." },
  { id:7,  name:"Registrar Office",        role:"Administration",           avatar:"RO", color:"#14b8a6", online:true,  unread:1, time:"Sun",     last:"New student registrations are ready for approval." },
  { id:8,  name:"Student Affairs",         role:"Administration",           avatar:"SA", color:"#f97316", online:false, unread:0, time:"Sun",     last:"Welfare report for Q4 has been submitted." },
];

const INIT_MSGS = {
  1:[
    { id:1,  from:"them", text:"Good morning! I've finished reviewing the exam scripts for CSC 201.",          time:"08:15", read:true  },
    { id:2,  from:"me",   text:"Excellent, thank you. What's the average score looking like?",                 time:"08:17", read:true  },
    { id:3,  from:"them", text:"Class average is 68%. Three students are borderline — I'll flag them.",        time:"08:20", read:true  },
    { id:4,  from:"me",   text:"Please do. We need to get them into academic support before end of semester.", time:"08:22", read:true  },
    { id:5,  from:"them", text:"Will do. Also — Amara Obi scored 94%. Exceptional work.",                     time:"08:25", read:true  },
    { id:6,  from:"me",   text:"That's brilliant. Note it in her remarks, she deserves the recognition.",     time:"08:40", read:true  },
    { id:7,  from:"them", text:"Please review Amara's updated grade sheet when you get a chance.",            time:"09:41", read:false },
  ],
  2:[
    { id:1, from:"them", text:"The lab equipment requisition has been approved.", time:"08:30", read:true },
  ],
  3:[
    { id:1, from:"them", text:"Can we reschedule the clinical assessment review? I have a conflict Friday.", time:"Yesterday", read:false },
    { id:2, from:"them", text:"Let me know your availability this week.", time:"Yesterday", read:false },
  ],
  7:[
    { id:1, from:"them", text:"New student registrations are ready for your approval.", time:"Sun", read:false },
  ],
};

function Av({ name, color, photo, size=38 }) {
  const initials = name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:photo?"transparent":color, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.32, fontWeight:700, color:"#fff", flexShrink:0 }}>
      {photo?<img src={photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>:initials}
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display:"flex", gap:4, padding:"10px 14px", background:"#fff", border:"1px solid #ede9e4", borderRadius:"4px 16px 16px 16px", width:"fit-content" }}>
      {[0,1,2].map(i=>(
        <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"#b0a89e", animation:"pulse 1.2s infinite", animationDelay:`${i*.18}s` }}/>
      ))}
    </div>
  );
}

export default function Chat() {
  const [active,    setActive]    = useState(CONTACTS[0]);
  const [messages,  setMessages]  = useState(INIT_MSGS);
  const [contacts,  setContacts]  = useState(CONTACTS);
  const [input,     setInput]     = useState("");
  const [search,    setSearch]    = useState("");
  const [recording, setRecording] = useState(false);
  const [recTime,   setRecTime]   = useState(0);
  const [typing,    setTyping]    = useState(false);
  const [files,     setFiles]     = useState([]);
  const bottomRef  = useRef(null);
  const fileRef    = useRef(null);
  const recTimer   = useRef(null);
  const mediaRec   = useRef(null);
  const recChunks  = useRef([]);

  const getMsgs = (id) => messages[id] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, active.id, typing]);

  // Mark messages read when switching contact
  useEffect(() => {
    setContacts(prev => prev.map(c => c.id===active.id ? {...c, unread:0} : c));
    setMessages(prev => ({
      ...prev,
      [active.id]: (prev[active.id]||[]).map(m => ({...m, read:true}))
    }));
  }, [active.id]);

  const sendMessage = (text, type="text", extra={}) => {
    if (type==="text" && !text.trim()) return;
    const msg = { id:Date.now(), from:"me", text, type, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), read:false, ...extra };
    setMessages(prev => ({ ...prev, [active.id]: [...(prev[active.id]||[]), msg] }));
    setContacts(prev => prev.map(c => c.id===active.id ? {...c, last:type==="text"?text:type==="voice"?"🎤 Voice message":"📎 "+extra.fileName, time:"now"} : c));
    setInput("");
    setFiles([]);

    // Simulate reply
    if (type==="text") {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        const reply = { id:Date.now()+1, from:"them", text:"Got it — thanks for the update!", time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), read:true };
        setMessages(prev => ({ ...prev, [active.id]: [...(prev[active.id]||[]), reply] }));
        setContacts(prev => prev.map(c => c.id===active.id ? {...c, last:reply.text, time:"now"} : c));
      }, 1200+Math.random()*1000);
    }
  };

  const handleSend = () => {
    if (files.length>0) {
      files.forEach(f => {
        if (f.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = ev => sendMessage("", "image", { imageUrl:ev.target.result, fileName:f.name });
          reader.readAsDataURL(f);
        } else {
          sendMessage("", "file", { fileName:f.name, fileSize:(f.size/1024).toFixed(0)+"KB" });
        }
      });
    }
    if (input.trim()) sendMessage(input);
  };

  const handleKey = (e) => { if (e.key==="Enter"&&!e.shiftKey) { e.preventDefault(); handleSend(); } };

  const handleFile = (e) => {
    const selected = Array.from(e.target.files||[]);
    setFiles(prev => [...prev, ...selected]);
    e.target.value = "";
  };

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      const rec = new MediaRecorder(stream);
      recChunks.current = [];
      rec.ondataavailable = e => recChunks.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(recChunks.current, { type:"audio/webm" });
        const url  = URL.createObjectURL(blob);
        sendMessage("", "voice", { audioUrl:url, duration:recTime });
        stream.getTracks().forEach(t => t.stop());
      };
      rec.start();
      mediaRec.current = rec;
      setRecording(true);
      setRecTime(0);
      recTimer.current = setInterval(() => setRecTime(t => t+1), 1000);
    } catch {
      alert("Microphone permission is required to record voice messages.");
    }
  };

  const stopRec = () => {
    mediaRec.current?.stop();
    clearInterval(recTimer.current);
    setRecording(false);
  };

  const cancelRec = () => {
    mediaRec.current?.stream?.getTracks().forEach(t=>t.stop());
    mediaRec.current = null;
    clearInterval(recTimer.current);
    setRecording(false);
    setRecTime(0);
  };

  const fmt = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  const filteredContacts = contacts.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));
  const msgs = getMsgs(active.id);

  return (
    <div style={{ display:"flex", height:"100%", gap:0, fontFamily:"'DM Sans',sans-serif" }}>

      {/* Contact list — left panel */}
      <div style={{ width:300, flexShrink:0, borderRight:"1px solid #ede9e4", display:"flex", flexDirection:"column", background:"#fff" }}>

        {/* Header */}
        <div style={{ padding:"18px 18px 12px", borderBottom:"1px solid #f0ede9" }}>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, fontWeight:600, color:"#1a1a1a", marginBottom:12 }}>Messages</h2>
          <div className="search-wrap">
            <Search size={14}/>
            <input className="search-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{ fontSize:13 }}/>
          </div>
        </div>

        {/* Contact rows */}
        <div style={{ flex:1, overflowY:"auto" }}>
          {filteredContacts.map(c=>(
            <div key={c.id} className={`list-row ${active.id===c.id?"active":""}`} onClick={()=>setActive(c)}>
              <div style={{ position:"relative", flexShrink:0 }}>
                <Av name={c.name} color={c.color} size={40}/>
                {c.online && <div style={{ position:"absolute", bottom:1, right:1, width:9, height:9, borderRadius:"50%", background:"#4caf50", border:"2px solid #fff" }}/>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                  <p style={{ fontWeight:c.unread>0?700:500, fontSize:13.5, color:"#1a1a1a", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:130 }}>{c.name}</p>
                  <p style={{ fontSize:11.5, color:"#b0a89e", flexShrink:0 }}>{c.time}</p>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:2 }}>
                  <p style={{ fontSize:12.5, color: c.unread>0?"#4a4540":"#b0a89e", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:170, fontWeight:c.unread>0?500:400 }}>{c.last}</p>
                  {c.unread>0 && <span style={{ background:"#1a1a1a", color:"#fff", borderRadius:99, fontSize:10.5, fontWeight:700, padding:"1px 6px", flexShrink:0 }}>{c.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat window — right panel */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#faf8f5", minWidth:0 }}>

        {/* Chat header */}
        <div style={{ padding:"14px 22px", borderBottom:"1px solid #ede9e4", background:"#fff", display:"flex", alignItems:"center", gap:13 }}>
          <div style={{ position:"relative" }}>
            <Av name={active.name} color={active.color} size={40}/>
            {active.online && <div style={{ position:"absolute", bottom:1, right:1, width:9, height:9, borderRadius:"50%", background:"#4caf50", border:"2px solid #fff" }}/>}
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:700, fontSize:14.5, color:"#1a1a1a" }}>{active.name}</p>
            <p style={{ fontSize:12, color: active.online?"#4caf50":"#b0a89e" }}>{active.online?"Online":"Offline"}</p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {[Phone, Video, MoreHorizontal].map((Icon,i)=>(
              <button key={i} style={{ width:36,height:36,borderRadius:10,border:"1px solid #ede9e4",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#7a7169" }}
                onClick={()=>i<2&&alert(i===0?"Voice call — requires WebRTC integration":"Video call — requires WebRTC integration")}>
                <Icon size={16}/>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 22px", display:"flex", flexDirection:"column", gap:10 }}>
          {msgs.map((m,i) => {
            const isMe = m.from==="me";
            return (
              <div key={m.id} className="msg-enter" style={{ display:"flex", flexDirection:"column", alignItems:isMe?"flex-end":"flex-start", animationDelay:`${i*.02}s` }}>
                {m.type==="voice" ? (
                  <div style={{ background:isMe?"#1a1a1a":"#fff", border:isMe?"none":"1px solid #ede9e4", borderRadius:isMe?"16px 4px 16px 16px":"4px 16px 16px 16px", padding:"10px 14px", display:"flex", alignItems:"center", gap:11 }}>
                    <button onClick={()=>{ const a=new Audio(m.audioUrl);a.play(); }} style={{ width:30,height:30,borderRadius:"50%",background:isMe?"rgba(255,255,255,.15)":"#f0ede9",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:isMe?"#fff":"#1a1a1a" }}>▶</button>
                    <div style={{ display:"flex", gap:2, alignItems:"center" }}>
                      {Array(18).fill(0).map((_,j)=><div key={j} style={{ width:2.5,height:4+Math.sin(j)*10,borderRadius:2,background:isMe?"rgba(255,255,255,.7)":"#b0a89e" }}/>)}
                    </div>
                    <span style={{ fontSize:12, color:isMe?"rgba(255,255,255,.7)":"#b0a89e" }}>{fmt(m.duration)}</span>
                  </div>
                ) : m.type==="image" ? (
                  <div style={{ borderRadius:14, overflow:"hidden", maxWidth:220 }}>
                    <img src={m.imageUrl} alt={m.fileName} style={{ width:"100%", display:"block" }}/>
                  </div>
                ) : m.type==="file" ? (
                  <div style={{ background:isMe?"#1a1a1a":"#fff", border:isMe?"none":"1px solid #ede9e4", borderRadius:isMe?"16px 4px 16px 16px":"4px 16px 16px 16px", padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34,height:34,borderRadius:9,background:isMe?"rgba(255,255,255,.15)":"#f0ede9",display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <FileText size={16} color={isMe?"#fff":"#1a1a1a"}/>
                    </div>
                    <div>
                      <p style={{ fontSize:13,fontWeight:600,color:isMe?"#fff":"#1a1a1a" }}>{m.fileName}</p>
                      <p style={{ fontSize:11.5,color:isMe?"rgba(255,255,255,.6)":"#b0a89e" }}>{m.fileSize}</p>
                    </div>
                  </div>
                ) : (
                  <div className={isMe?"bubble-me":"bubble-them"}>{m.text}</div>
                )}
                <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:3 }}>
                  <p style={{ fontSize:11, color:"#b0a89e" }}>{m.time}</p>
                  {isMe && (m.read ? <CheckCheck size={12} color="#4caf50"/> : <Check size={12} color="#b0a89e"/>)}
                </div>
              </div>
            );
          })}
          {typing && (
            <div className="msg-enter" style={{ display:"flex", flexDirection:"column", alignItems:"flex-start" }}>
              <TypingDots/>
              <p style={{ fontSize:11, color:"#b0a89e", marginTop:3 }}>typing…</p>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* File preview bar */}
        {files.length>0 && (
          <div style={{ padding:"10px 22px", background:"#fff", borderTop:"1px solid #ede9e4", display:"flex", gap:10, flexWrap:"wrap" }}>
            {files.map((f,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, background:"#f5f2ee", borderRadius:9, padding:"6px 10px" }}>
                {f.type.startsWith("image/")
                  ? <img src={URL.createObjectURL(f)} alt="" style={{ width:28,height:28,borderRadius:6,objectFit:"cover" }}/>
                  : <FileText size={16} color="#7a7169"/>
                }
                <span style={{ fontSize:12.5, color:"#1a1a1a", maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</span>
                <button onClick={()=>setFiles(prev=>prev.filter((_,j)=>j!==i))} style={{ background:"none",border:"none",cursor:"pointer",color:"#b0a89e",display:"flex" }}><X size={13}/></button>
              </div>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div style={{ padding:"12px 22px 16px", background:"#fff", borderTop:"1px solid #ede9e4" }}>
          {recording ? (
            <div style={{ display:"flex", alignItems:"center", gap:14, background:"#faf8f5", borderRadius:14, padding:"12px 16px", border:"1.5px solid #1a1a1a" }}>
              <div className="rec-dot" style={{ width:9,height:9,borderRadius:"50%",background:"#ef4444",flexShrink:0 }}/>
              <div style={{ display:"flex", gap:3, flex:1, alignItems:"center" }}>
                {Array(24).fill(0).map((_,i)=>(
                  <div key={i} className="wave-bar" style={{ "--d":`${0.3+Math.random()*.4}s`, height:3+Math.random()*14, background:"#1a1a1a", animationDelay:`${i*.05}s` }}/>
                ))}
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:"#1a1a1a", flexShrink:0 }}>{fmt(recTime)}</span>
              <button onClick={cancelRec} style={{ background:"none",border:"none",cursor:"pointer",color:"#b0a89e" }}><X size={16}/></button>
              <button onClick={stopRec} style={{ background:"#1a1a1a",color:"#fff",border:"none",borderRadius:9,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>Send</button>
            </div>
          ) : (
            <div style={{ display:"flex", alignItems:"flex-end", gap:10 }}>
              <div style={{ flex:1, background:"#faf8f5", border:"1.5px solid #ede9e4", borderRadius:14, padding:"10px 14px", display:"flex", alignItems:"flex-end", gap:8, transition:"border .18s" }}
                onFocusCapture={e=>e.currentTarget.style.border="1.5px solid #1a1a1a"}
                onBlurCapture={e=>e.currentTarget.style.border="1.5px solid #ede9e4"}>
                <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey}
                  placeholder={`Message ${active.name.split(" ")[0]}…`}
                  rows={1}
                  style={{ flex:1, background:"none", border:"none", outline:"none", resize:"none", fontFamily:"'DM Sans',sans-serif", fontSize:13.5, color:"#1a1a1a", lineHeight:1.5, maxHeight:120, overflowY:"auto" }}
                  onInput={e=>{ e.target.style.height="auto"; e.target.style.height=e.target.scrollHeight+"px"; }}
                />
                <div style={{ display:"flex", gap:7, flexShrink:0 }}>
                  <button onClick={()=>fileRef.current.click()} style={{ background:"none",border:"none",cursor:"pointer",color:"#b0a89e",display:"flex",padding:4,borderRadius:7,transition:"color .15s" }}
                    onMouseEnter={e=>e.currentTarget.style.color="#1a1a1a"} onMouseLeave={e=>e.currentTarget.style.color="#b0a89e"}>
                    <Paperclip size={17}/>
                  </button>
                  <input type="file" ref={fileRef} multiple style={{ display:"none" }} onChange={handleFile} accept="image/*,.pdf,.doc,.docx,.xlsx,.txt"/>
                </div>
              </div>

              <button onClick={startRec} style={{ width:42,height:42,borderRadius:12,background:"#f0ede9",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#7a7169",flexShrink:0 }}
                onMouseEnter={e=>e.currentTarget.style.background="#e6e2dd"} onMouseLeave={e=>e.currentTarget.style.background="#f0ede9"}>
                <Mic size={17}/>
              </button>

              <button onClick={handleSend} disabled={!input.trim()&&files.length===0}
                style={{ width:42,height:42,borderRadius:12,background:input.trim()||files.length>0?"#1a1a1a":"#f0ede9",border:"none",cursor:input.trim()||files.length>0?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",color:input.trim()||files.length>0?"#fff":"#b0a89e",flexShrink:0,transition:"all .15s" }}>
                <Send size={16}/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}