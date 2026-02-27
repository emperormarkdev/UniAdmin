import { useState, useMemo } from "react";
import { Search, ChevronRight, ArrowLeft, Filter, X, MessageSquare } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const STATUS = {
  "In Progress":{ bg:"#e3f2fd", color:"#1565c0" },
  "Concluded":  { bg:"#e8f5e9", color:"#2e7d32" },
  "Break":      { bg:"#fff8e1", color:"#e65100" },
};

function Avatar({ name, color, photo, size=36 }) {
  const initials = name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:photo?"transparent":color, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.33, fontWeight:700, color:"#fff", flexShrink:0 }}>
      {photo ? <img src={photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : initials}
    </div>
  );
}

function StudentProfile({ student:s, onBack }) {
  return (
    <div className="page-enter">
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:6, color:"#1a1a1a", fontWeight:600, fontSize:13.5, background:"none", border:"none", cursor:"pointer", marginBottom:22 }}>
        <ArrowLeft size={15}/> Back to Students
      </button>
      <div className="panel" style={{ overflow:"hidden", marginBottom:16 }}>
        <div style={{ height:100, background:`linear-gradient(135deg,${s.color},${s.color}88)` }}/>
        <div style={{ padding:"0 28px 28px", marginTop:-28 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12 }}>
            <div style={{ display:"flex", alignItems:"flex-end", gap:14 }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:s.color, border:"3px solid #fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:"#fff" }}>
                {s.avatar}
              </div>
              <div style={{ paddingBottom:4 }}>
                <h2 style={{ fontSize:20, fontWeight:700, color:"#1a1a1a" }}>{s.name}</h2>
                <p style={{ fontSize:13, color:"#b0a89e", marginTop:2 }}>{s.regNo} · {s.course} · {s.year}</p>
              </div>
            </div>
            <span style={{ ...STATUS[s.status], padding:"4px 13px", borderRadius:99, fontSize:12, fontWeight:700, marginBottom:4 }}>{s.status}</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:12, marginTop:20 }}>
            {[["CGA",s.cga.toFixed(2),"#1a1a1a"],["Attendance",`${s.attendance}/100`,"#63a47a"],["Faculty",s.faculty,"#b0a89e"],["Year",s.year,"#b0a89e"],["Lecture Time",s.lectureTime,"#b0a89e"],["Lecture Place",s.lecturePlace,"#b0a89e"]].map(([k,v,c])=>(
              <div key={k} style={{ background:"#faf8f5", borderRadius:12, padding:"13px 14px", border:"1px solid #f0ede9" }}>
                <p style={{ fontSize:10.5, color:"#b0a89e", fontWeight:700, textTransform:"uppercase", letterSpacing:.6 }}>{k}</p>
                <p style={{ fontSize:13.5, fontWeight:600, color:c, marginTop:5, lineHeight:1.4 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="panel" style={{ padding:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:18 }}>
          <div style={{ width:3, height:18, background:"#1a1a1a", borderRadius:99 }}/>
          <h3 style={{ fontWeight:700, fontSize:15, color:"#1a1a1a" }}>Lecturer Remarks</h3>
          <span style={{ marginLeft:"auto", background:"#f5f2ee", color:"#7a7169", borderRadius:99, fontSize:11.5, fontWeight:600, padding:"2px 9px" }}>{s.remarks.length}</span>
        </div>
        {s.remarks.length===0 && <p style={{ color:"#b0a89e", fontSize:13.5 }}>No remarks yet.</p>}
        {s.remarks.map((r,i)=>(
          <div key={i} style={{ borderLeft:`2px solid ${s.color}55`, paddingLeft:14, paddingBottom:14, marginBottom:i<s.remarks.length-1?14:0, borderBottom:i<s.remarks.length-1?"1px solid #f5f2ee":"none" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontWeight:700, fontSize:13.5, color:"#1a1a1a" }}>{r.by}</span>
              <span style={{ fontSize:12, color:"#b0a89e" }}>{r.date}</span>
            </div>
            <p style={{ fontSize:13.5, color:"#4a4540", lineHeight:1.7, fontStyle:"italic" }}>"{r.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const COURSES   = ["All Courses",  ...Array.from(new Set([]))];
const FACULTIES = ["All Faculty",  "Dr. Afolabi","Prof. Adeleke","Dr. Bello","Prof. Salami","Dr. Okafor","Prof. Obi"];
const YEARS     = ["All Years",    "Year 1","Year 2","Year 3","Year 4","Year 5"];
const STATUSES  = ["All Status",   "In Progress","Concluded","Break"];

export default function Students() {
  const { students } = useApp();
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState("");
  const [course,   setCourse]   = useState("All Courses");
  const [faculty,  setFaculty]  = useState("All Faculty");
  const [year,     setYear]     = useState("All Years");
  const [status,   setStatus]   = useState("All Status");
  const [showF,    setShowF]    = useState(false);

  const courses = ["All Courses", ...Array.from(new Set(students.map(s=>s.course)))];

  if (selected) return <StudentProfile student={selected} onBack={()=>setSelected(null)}/>;

  const filtered = useMemo(()=>
    students.filter(s=>{
      const q=search.toLowerCase();
      return (!q||s.name.toLowerCase().includes(q)||s.regNo.toLowerCase().includes(q)) &&
        (course==="All Courses"||s.course===course) &&
        (faculty==="All Faculty"||s.faculty===faculty) &&
        (year==="All Years"||s.year===year) &&
        (status==="All Status"||s.status===status);
    })
  ,[students,search,course,faculty,year,status]);

  const activeF = [course,faculty,year,status].filter(f=>!f.startsWith("All")).length;
  const selS = { background:"#faf8f5", border:"1.5px solid #ede9e4", borderRadius:10, padding:"9px 13px", fontSize:13, outline:"none", fontFamily:"'DM Sans',sans-serif", color:"#1a1a1a", cursor:"pointer" };

  return (
    <div className="page-enter" style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, fontWeight:600, color:"#1a1a1a" }}>Students</h1>
          <p style={{ color:"#b0a89e", fontSize:13.5, marginTop:3 }}>{filtered.length} of {students.length} students</p>
        </div>
      </div>

      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <div className="search-wrap" style={{ flex:1, minWidth:200 }}>
          <Search size={15}/>
          <input className="search-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or reg. number…"/>
        </div>
        <button onClick={()=>setShowF(!showF)} className="btn-ghost" style={{ background:activeF>0?"#1a1a1a":"#f0ede9", color:activeF>0?"#fff":"#1a1a1a" }}>
          <Filter size={14}/> Filters {activeF>0&&`(${activeF})`}
        </button>
        {activeF>0&&<button onClick={()=>{setCourse("All Courses");setFaculty("All Faculty");setYear("All Years");setStatus("All Status");}} className="btn-ghost" style={{ background:"#fce4ec", color:"#c62828" }}><X size={13}/> Clear</button>}
      </div>

      {showF && (
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", background:"#fff", borderRadius:14, padding:16, border:"1px solid #ede9e4" }}>
          {[["Course",course,setCourse,courses],["Faculty",faculty,setFaculty,FACULTIES],["Year",year,setYear,YEARS],["Status",status,setStatus,STATUSES]].map(([l,v,set,opts])=>(
            <div key={l}>
              <p style={{ fontSize:11, fontWeight:700, color:"#b0a89e", textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>{l}</p>
              <select value={v} onChange={e=>set(e.target.value)} style={selS}>{opts.map(o=><option key={o}>{o}</option>)}</select>
            </div>
          ))}
        </div>
      )}

      <div className="panel" style={{ overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13.5, fontFamily:"'DM Sans',sans-serif" }}>
            <thead>
              <tr style={{ background:"#faf8f5", borderBottom:"1px solid #ede9e4" }}>
                {["Reg. No.","Student","Course","Attendance","CGA","Status","Lecture Time","Lecture Place","Remark",""].map(h=>(
                  <th key={h} style={{ padding:"11px 16px", textAlign:"left", fontWeight:600, fontSize:11, color:"#b0a89e", textTransform:"uppercase", letterSpacing:.7, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={10} style={{ padding:"40px", textAlign:"center", color:"#b0a89e" }}>No students match your filters.</td></tr>}
              {filtered.map((s,i)=>(
                <tr key={s.id} className="trow" style={{ borderBottom:"1px solid #f5f2ee", background:i%2===0?"#fff":"#fdfcfb" }}>
                  <td style={{ padding:"13px 16px", whiteSpace:"nowrap" }}>
                    <span style={{ fontFamily:"monospace", fontSize:12, color:"#7a7169", background:"#f5f2ee", padding:"2px 7px", borderRadius:6 }}>{s.regNo}</span>
                  </td>
                  <td style={{ padding:"13px 16px", whiteSpace:"nowrap" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:30, height:30, borderRadius:"50%", background:s.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10.5, fontWeight:700, color:"#fff", flexShrink:0 }}>{s.avatar}</div>
                      <span style={{ fontWeight:600, color:"#1a1a1a" }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:"13px 16px", whiteSpace:"nowrap", color:"#4a4540" }}>{s.course}</td>
                  <td style={{ padding:"13px 16px", whiteSpace:"nowrap" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:52, height:5, borderRadius:99, background:"#ede9e4", overflow:"hidden" }}>
                        <div style={{ width:`${s.attendance}%`, height:"100%", borderRadius:99, background:s.attendance>=80?"#4caf50":s.attendance>=60?"#ff9800":"#f44336" }}/>
                      </div>
                      <span style={{ fontWeight:600, color:"#1a1a1a", fontSize:13 }}>{s.attendance}%</span>
                    </div>
                  </td>
                  <td style={{ padding:"13px 16px", whiteSpace:"nowrap" }}>
                    <span style={{ fontWeight:700, fontSize:14.5, color:s.cga>=3.5?"#2e7d32":s.cga>=3.0?"#e65100":"#c62828" }}>{s.cga.toFixed(2)}</span>
                  </td>
                  <td style={{ padding:"13px 16px", whiteSpace:"nowrap" }}>
                    <span style={{ ...STATUS[s.status], padding:"3px 11px", borderRadius:99, fontSize:12, fontWeight:600 }}>{s.status}</span>
                  </td>
                  <td style={{ padding:"13px 16px", color:"#7a7169", whiteSpace:"nowrap", fontSize:13 }}>{s.lectureTime}</td>
                  <td style={{ padding:"13px 16px", maxWidth:180 }}>
                    <span style={{ display:"block", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:175, color:"#7a7169", fontSize:13 }}>{s.lecturePlace}</span>
                  </td>
                  <td style={{ padding:"13px 16px", maxWidth:220 }}>
                    <span style={{ fontSize:12, color:"#b0a89e", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", lineHeight:1.5 }}>
                      {s.remarks[0]?.text||"No remarks yet"}
                    </span>
                  </td>
                  <td style={{ padding:"13px 16px" }}>
                    <button onClick={()=>setSelected(s)} className="btn-ghost" style={{ padding:"5px 11px", fontSize:12 }}>
                      View <ChevronRight size={12}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"10px 18px", borderTop:"1px solid #f5f2ee", background:"#faf8f5", fontSize:12, color:"#b0a89e", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <span>Showing <strong style={{ color:"#1a1a1a" }}>{filtered.length}</strong> of <strong style={{ color:"#1a1a1a" }}>{students.length}</strong></span>
          <span>{students.filter(s=>s.status==="In Progress").length} active · {students.filter(s=>s.status==="Concluded").length} concluded · {students.filter(s=>s.status==="Break").length} on break</span>
        </div>
      </div>
    </div>
  );
}