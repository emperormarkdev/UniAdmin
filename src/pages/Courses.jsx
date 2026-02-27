import { useState } from "react";
import { BookMarked, GraduationCap, Clock, Plus, Trash2, Pencil, Check, X } from "lucide-react";

const INITIAL_COURSES = [
  { id:1,  name:"Computer Science",          dept:"Technology",           students:312, duration:"4 yrs", code:"CSC", color:"#4f46e5", desc:"Algorithms, AI, distributed systems and software engineering.", price:850000 },
  { id:2,  name:"Electrical Engineering",    dept:"Engineering",          students:278, duration:"5 yrs", code:"EEE", color:"#0ea5e9", desc:"Power systems, electronics, telecoms and control engineering.", price:920000 },
  { id:3,  name:"Medicine & Surgery",        dept:"Medical Sciences",     students:180, duration:"6 yrs", code:"MBB", color:"#10b981", desc:"Clinical medicine, surgery, pharmacology and patient care.", price:1500000 },
  { id:4,  name:"Law",                       dept:"Social Sciences",      students:220, duration:"5 yrs", code:"LAW", color:"#f59e0b", desc:"Constitutional, corporate, criminal and international law.", price:780000 },
  { id:5,  name:"Business Administration",   dept:"Management",           students:340, duration:"4 yrs", code:"BUS", color:"#8b5cf6", desc:"Entrepreneurship, finance, marketing and strategic management.", price:720000 },
  { id:6,  name:"Architecture",              dept:"Environmental Design", students:145, duration:"5 yrs", code:"ARC", color:"#ec4899", desc:"Structural design, urban planning and architectural aesthetics.", price:880000 },
  { id:7,  name:"Mechanical Engineering",    dept:"Engineering",          students:260, duration:"5 yrs", code:"MEE", color:"#f97316", desc:"Thermodynamics, fluid mechanics, robotics and manufacturing.", price:910000 },
  { id:8,  name:"Civil Engineering",         dept:"Engineering",          students:230, duration:"5 yrs", code:"CVE", color:"#14b8a6", desc:"Structural engineering, geotechnics, transportation and water resources.", price:900000 },
  { id:9,  name:"Pharmacy",                  dept:"Medical Sciences",     students:160, duration:"5 yrs", code:"PHR", color:"#06b6d4", desc:"Pharmaceutical sciences, drug design, clinical pharmacy and toxicology.", price:1100000 },
  { id:10, name:"Accounting",                dept:"Management",           students:295, duration:"4 yrs", code:"ACC", color:"#84cc16", desc:"Financial reporting, auditing, taxation and management accounting.", price:680000 },
  { id:11, name:"Mass Communication",        dept:"Social Sciences",      students:210, duration:"4 yrs", code:"MCS", color:"#a855f7", desc:"Journalism, broadcasting, public relations and media studies.", price:650000 },
  { id:12, name:"Economics",                 dept:"Social Sciences",      students:270, duration:"4 yrs", code:"ECO", color:"#ef4444", desc:"Micro and macroeconomics, econometrics and development economics.", price:700000 },
  { id:13, name:"Nursing Science",           dept:"Medical Sciences",     students:195, duration:"5 yrs", code:"NRS", color:"#f43f5e", desc:"Patient care, clinical nursing, midwifery and community health.", price:950000 },
  { id:14, name:"Chemical Engineering",      dept:"Engineering",          students:175, duration:"5 yrs", code:"CHE", color:"#22c55e", desc:"Process engineering, petrochemicals, materials and reaction kinetics.", price:890000 },
  { id:15, name:"Information Technology",    dept:"Technology",           students:320, duration:"4 yrs", code:"ITE", color:"#6366f1", desc:"Networking, cybersecurity, cloud computing and systems administration.", price:820000 },
  { id:16, name:"Public Administration",     dept:"Social Sciences",      students:185, duration:"4 yrs", code:"PAD", color:"#d946ef", desc:"Governance, policy analysis, public finance and administrative law.", price:620000 },
  { id:17, name:"Biochemistry",              dept:"Medical Sciences",     students:155, duration:"4 yrs", code:"BCH", color:"#0891b2", desc:"Molecular biology, metabolism, genetics and biotechnology.", price:760000 },
  { id:18, name:"Mathematics",               dept:"Sciences",             students:140, duration:"4 yrs", code:"MTH", color:"#7c3aed", desc:"Pure mathematics, statistics, operations research and modelling.", price:580000 },
  { id:19, name:"Physics",                   dept:"Sciences",             students:120, duration:"4 yrs", code:"PHY", color:"#0d9488", desc:"Classical and quantum mechanics, electromagnetism and astrophysics.", price:600000 },
  { id:20, name:"Political Science",         dept:"Social Sciences",      students:200, duration:"4 yrs", code:"POL", color:"#b45309", desc:"Comparative politics, international relations and political theory.", price:640000 },
  { id:21, name:"Agricultural Science",      dept:"Sciences",             students:165, duration:"4 yrs", code:"AGR", color:"#65a30d", desc:"Crop science, animal husbandry, soil science and agribusiness.", price:560000 },
  { id:22, name:"Environmental Science",     dept:"Environmental Design", students:130, duration:"4 yrs", code:"ENV", color:"#059669", desc:"Environmental management, ecology, climate change and sustainability.", price:610000 },
  { id:23, name:"Microbiology",              dept:"Sciences",             students:145, duration:"4 yrs", code:"MCB", color:"#dc2626", desc:"Bacteriology, virology, immunology and industrial microbiology.", price:650000 },
  { id:24, name:"Fine & Applied Arts",       dept:"Arts & Humanities",    students:110, duration:"4 yrs", code:"FAA", color:"#db2777", desc:"Painting, sculpture, graphic design and art history.", price:500000 },
];

const PALETTE = ["#4f46e5","#0ea5e9","#10b981","#f59e0b","#8b5cf6","#ec4899","#f97316","#14b8a6","#06b6d4","#84cc16","#a855f7","#ef4444"];
const fmt = (n) => `₦${Number(n).toLocaleString("en-NG")}`;

export default function Courses() {
  const [courses, setCourses]       = useState(INITIAL_COURSES);
  const [editingPrice, setEditing]  = useState(null);
  const [priceInput, setPriceInput] = useState("");
  const [showAdd, setShowAdd]       = useState(false);
  const [newC, setNewC]             = useState({ name:"", dept:"", code:"", duration:"4 yrs", students:"0", price:"", desc:"" });
  const [err, setErr]               = useState("");

  const startEdit = (c) => { setEditing(c.id); setPriceInput(c.price); };
  const savePrice = (id) => {
    const val = parseInt(String(priceInput).replace(/\D/g,""));
    if (val > 0) setCourses(cs => cs.map(c => c.id === id ? {...c, price:val} : c));
    setEditing(null);
  };

  const remove = (id) => setCourses(cs => cs.filter(c => c.id !== id));

  const handleAdd = () => {
    if (!newC.name.trim()) { setErr("Course name is required."); return; }
    if (!newC.code.trim()) { setErr("Course code is required."); return; }
    const priceVal = parseInt(String(newC.price).replace(/\D/g,""));
    if (!priceVal)         { setErr("Tuition fee is required."); return; }
    setCourses(cs => [{
      ...newC, id:Date.now(),
      students: parseInt(newC.students)||0,
      price: priceVal,
      color: PALETTE[cs.length % PALETTE.length],
    }, ...cs]);
    setNewC({ name:"", dept:"", code:"", duration:"4 yrs", students:"0", price:"", desc:"" });
    setShowAdd(false); setErr("");
  };

  return (
    <div className="page-enter" style={{ display:"flex", flexDirection:"column", gap:22 }}>

      {/* ── Add modal ── */}
      {showAdd && (
        <div style={{ position:"fixed", inset:0, zIndex:9998, background:"rgba(0,0,0,.4)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:"#fff", borderRadius:20, padding:30, maxWidth:540, width:"100%", boxShadow:"0 24px 60px rgba(0,0,0,.18)", maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h3 style={{ fontSize:18, fontWeight:700, color:"#1a1a1a" }}>Add New Course</h3>
              <button onClick={()=>{setShowAdd(false);setErr("");}} style={{ background:"none", border:"none", cursor:"pointer", color:"#b0a89e" }}><X size={20}/></button>
            </div>
            {err && <div style={{ background:"#fce4ec", borderRadius:10, padding:"9px 13px", marginBottom:14, color:"#c62828", fontSize:13 }}>{err}</div>}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
              {[["Course Name","name","text","span 2",true],["Department","dept","text","span 2",false],["Course Code","code","text","span 1",true],["Duration","duration","text","span 1",false],["Tuition Fee (₦)","price","number","span 1",true],["Est. Students","students","number","span 1",false]].map(([lbl,key,type,col,req])=>(
                <div key={key} style={{ gridColumn:col }}>
                  <label style={{ fontSize:11, fontWeight:700, color:"#b0a89e", textTransform:"uppercase", letterSpacing:.6, display:"block", marginBottom:5 }}>{lbl}{req?" *":""}</label>
                  <input type={type} className="field-input" value={newC[key]} onChange={e=>setNewC(p=>({...p,[key]:e.target.value}))} placeholder={req?"Required":""}/>
                </div>
              ))}
              <div style={{ gridColumn:"span 2" }}>
                <label style={{ fontSize:11, fontWeight:700, color:"#b0a89e", textTransform:"uppercase", letterSpacing:.6, display:"block", marginBottom:5 }}>Description</label>
                <textarea className="field-input" rows={3} value={newC.desc} onChange={e=>setNewC(p=>({...p,desc:e.target.value}))} style={{ resize:"vertical" }}/>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button className="btn-dark" onClick={handleAdd}><Plus size={15}/> Add Course</button>
              <button className="btn-ghost" onClick={()=>{setShowAdd(false);setErr("");}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <h1 style={{ fontFamily:"'Inter',sans-serif", fontSize:26, fontWeight:700, color:"#1a1a1a", letterSpacing:"-0.5px" }}>Courses</h1>
          <p style={{ color:"#b0a89e", fontSize:13.5, marginTop:3 }}>{courses.length} programmes across all faculties</p>
        </div>
        <button className="btn-dark" onClick={()=>setShowAdd(true)}><Plus size={15}/> Add Course</button>
      </div>

      {/* ── Grid ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
        {courses.map((c,i) => (
          <div key={c.id} className="panel"
            style={{ overflow:"hidden", animation:"fadeUp .25s ease both", animationDelay:`${Math.min(i,8)*.05}s`, transition:"transform .18s,box-shadow .18s" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 10px 30px rgba(0,0,0,.09)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>

            <div style={{ height:5, background:`linear-gradient(90deg,${c.color},${c.color}77)` }}/>

            <div style={{ padding:20 }}>
              {/* Top */}
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:c.color+"18", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <BookMarked size={20} color={c.color}/>
                  </div>
                  <div>
                    <span style={{ background:c.color, color:"#fff", padding:"2px 8px", borderRadius:99, fontSize:10.5, fontWeight:700 }}>{c.code}</span>
                    <p style={{ fontSize:11.5, color:"#b0a89e", marginTop:3 }}>{c.dept}</p>
                  </div>
                </div>
                <button onClick={()=>remove(c.id)} title="Remove" style={{ background:"none", border:"none", cursor:"pointer", color:"#e57373", padding:4, borderRadius:7 }}
                  onMouseEnter={e=>e.currentTarget.style.background="#fce4ec"}
                  onMouseLeave={e=>e.currentTarget.style.background="none"}>
                  <Trash2 size={14}/>
                </button>
              </div>

              <h3 style={{ fontWeight:700, fontSize:15, color:"#1a1a1a" }}>{c.name}</h3>
              <p style={{ fontSize:13, color:"#7a7169", marginTop:5, lineHeight:1.6 }}>{c.desc}</p>

              {/* Price box */}
              <div style={{ marginTop:13, padding:"11px 12px", background:"#faf8f5", borderRadius:11, border:"1px solid #f0ede9" }}>
                <p style={{ fontSize:10, fontWeight:700, color:"#b0a89e", textTransform:"uppercase", letterSpacing:.7, marginBottom:6 }}>Annual Tuition Fee</p>
                {editingPrice === c.id ? (
                  <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                    <span style={{ fontSize:14, fontWeight:600, color:"#7a7169" }}>₦</span>
                    <input type="number" value={priceInput} onChange={e=>setPriceInput(e.target.value)}
                      onKeyDown={e=>{ if(e.key==="Enter") savePrice(c.id); if(e.key==="Escape") setEditing(null); }}
                      className="field-input" style={{ flex:1, padding:"5px 9px", fontSize:14 }} autoFocus/>
                    <button onClick={()=>savePrice(c.id)} style={{ background:"#1a1a1a", border:"none", borderRadius:7, padding:"5px 7px", cursor:"pointer", color:"#fff", display:"flex" }}><Check size={13}/></button>
                    <button onClick={()=>setEditing(null)} style={{ background:"#f0ede9", border:"none", borderRadius:7, padding:"5px 7px", cursor:"pointer", display:"flex" }}><X size={13}/></button>
                  </div>
                ) : (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontSize:18, fontWeight:700, color:"#1a1a1a" }}>{fmt(c.price)}</span>
                    <button onClick={()=>startEdit(c)} style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:600, color:"#b0a89e", background:"none", border:"none", cursor:"pointer", padding:"4px 8px", borderRadius:7 }}
                      onMouseEnter={e=>e.currentTarget.style.background="#f0ede9"}
                      onMouseLeave={e=>e.currentTarget.style.background="none"}>
                      <Pencil size={12}/> Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:13, paddingTop:13, borderTop:"1px solid #f5f2ee" }}>
                <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12.5, color:"#7a7169" }}><GraduationCap size={13}/>{c.students.toLocaleString()}</span>
                <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12.5, color:"#7a7169" }}><Clock size={13}/>{c.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}