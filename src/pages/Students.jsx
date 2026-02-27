import { useState, useMemo } from "react";
import { Search, ChevronRight, ArrowLeft, Filter, X } from "lucide-react";

const STATUS = {
  "In Progress":{ bg:"#e3f2fd", color:"#1565c0" },
  "Concluded":  { bg:"#e8f5e9", color:"#2e7d32" },
  "Break":      { bg:"#fff8e1", color:"#e65100" },
};

const INITIAL_STUDENTS = [
  { id:1,  regNo:"CSC/2021/001", name:"Amara Obi",          course:"Computer Science",        year:"Year 3", attendance:88, cga:3.71, status:"In Progress", faculty:"Dr. Afolabi",   lectureTime:"Mon/Wed 10:00", lecturePlace:"Lecture Theatre 1",         avatar:"AO", color:"#4f46e5", remarks:[{by:"Dr. Afolabi",   date:"Jan 2025", text:"Excellent performance in algorithms. Shows great analytical thinking."}] },
  { id:2,  regNo:"EEE/2022/014", name:"Chidi Eze",           course:"Electrical Engineering",  year:"Year 2", attendance:61, cga:2.94, status:"In Progress", faculty:"Prof. Adeleke", lectureTime:"Tue/Thu 09:00", lecturePlace:"Engineering Block A",        avatar:"CE", color:"#0ea5e9", remarks:[{by:"Prof. Adeleke", date:"Jan 2025", text:"Needs improvement in circuit analysis. Attendance is a concern."}] },
  { id:3,  regNo:"MED/2020/007", name:"Fatima Bello",        course:"Medicine & Surgery",      year:"Year 4", attendance:95, cga:3.92, status:"In Progress", faculty:"Dr. Bello",     lectureTime:"Daily 08:00",   lecturePlace:"Medical Auditorium",         avatar:"FB", color:"#10b981", remarks:[{by:"Dr. Bello",     date:"Jan 2025", text:"Outstanding clinical performance. Top of her cohort."}] },
  { id:4,  regNo:"LAW/2021/033", name:"Tunde Adeyemi",       course:"Law",                     year:"Year 3", attendance:74, cga:3.20, status:"In Progress", faculty:"Prof. Salami",  lectureTime:"Mon/Fri 11:00", lecturePlace:"Law Faculty Hall",           avatar:"TA", color:"#f59e0b", remarks:[{by:"Prof. Salami",  date:"Jan 2025", text:"Good grasp of constitutional law. Should focus more on criminal procedure."}] },
  { id:5,  regNo:"BUS/2023/005", name:"Grace Okafor",        course:"Business Administration", year:"Year 1", attendance:82, cga:3.45, status:"In Progress", faculty:"Dr. Okafor",    lectureTime:"Wed/Fri 14:00", lecturePlace:"MBA Block B",                avatar:"GO", color:"#8b5cf6", remarks:[] },
  { id:6,  regNo:"ARC/2020/019", name:"Emeka Nwosu",         course:"Architecture",            year:"Year 5", attendance:90, cga:3.65, status:"Concluded",   faculty:"Prof. Obi",     lectureTime:"Tue/Thu 13:00", lecturePlace:"Design Studio 2",            avatar:"EN", color:"#ec4899", remarks:[{by:"Prof. Obi",     date:"Dec 2024", text:"Graduated with distinction. Excellent design portfolio."}] },
  { id:7,  regNo:"CSC/2022/044", name:"Ngozi Adeyemi",       course:"Computer Science",        year:"Year 2", attendance:77, cga:3.10, status:"In Progress", faculty:"Dr. Afolabi",   lectureTime:"Mon/Wed 10:00", lecturePlace:"Lecture Theatre 1",         avatar:"NA", color:"#14b8a6", remarks:[] },
  { id:8,  regNo:"PHY/2021/008", name:"Musa Garba",          course:"Physics",                 year:"Year 3", attendance:85, cga:3.55, status:"In Progress", faculty:"Dr. Aliyu",     lectureTime:"Tue/Thu 11:00", lecturePlace:"Science Block C",            avatar:"MG", color:"#f97316", remarks:[{by:"Dr. Aliyu",     date:"Jan 2025", text:"Strong understanding of quantum mechanics. Excellent in lab work."}] },
  { id:9,  regNo:"LAW/2023/017", name:"Ifeoma Okonkwo",      course:"Law",                     year:"Year 1", attendance:69, cga:2.80, status:"Break",       faculty:"Prof. Salami",  lectureTime:"Mon/Fri 11:00", lecturePlace:"Law Faculty Hall",           avatar:"IO", color:"#dc2626", remarks:[{by:"Prof. Salami",  date:"Nov 2024", text:"Currently on medical leave. Will resume next semester."}] },
  { id:10, regNo:"BIO/2020/031", name:"Samuel Adekunle",     course:"Biochemistry",            year:"Year 4", attendance:92, cga:3.80, status:"In Progress", faculty:"Prof. Oguike",  lectureTime:"Mon/Wed/Fri 9:00", lecturePlace:"Biochemistry Lab 1",     avatar:"SA", color:"#0891b2", remarks:[{by:"Prof. Oguike",  date:"Jan 2025", text:"One of the best students in the department. Research potential is exceptional."}] },
  { id:11, regNo:"MEC/2022/025", name:"Blessing Lawal",      course:"Mechanical Engineering",  year:"Year 2", attendance:71, cga:3.05, status:"In Progress", faculty:"Dr. Fashola",   lectureTime:"Tue/Thu 10:00", lecturePlace:"Engineering Block B",        avatar:"BL", color:"#7c3aed", remarks:[] },
  { id:12, regNo:"MED/2021/041", name:"Precious Nwachukwu",  course:"Medicine & Surgery",      year:"Year 3", attendance:88, cga:3.68, status:"In Progress", faculty:"Prof. Okonkwo", lectureTime:"Daily 08:00",   lecturePlace:"Medical Auditorium",         avatar:"PN", color:"#059669", remarks:[{by:"Prof. Okonkwo", date:"Jan 2025", text:"Excellent bedside manner and strong clinical reasoning."}] },
];

const FACULTIES = ["All Faculty","Dr. Afolabi","Prof. Adeleke","Dr. Bello","Prof. Salami","Dr. Okafor","Prof. Obi","Dr. Aliyu","Prof. Oguike","Dr. Fashola","Prof. Okonkwo"];
const YEARS     = ["All Years","Year 1","Year 2","Year 3","Year 4","Year 5"];
const STATUSES  = ["All Status","In Progress","Concluded","Break"];

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
              <div style={{ width:56, height:56, borderRadius:"50%", background:s.color, border:"3px solid #fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:"#fff" }}>{s.avatar}</div>
              <div style={{ paddingBottom:4 }}>
                <h2 style={{ fontSize:20, fontWeight:700, color:"#1a1a1a" }}>{s.name}</h2>
                <p style={{ fontSize:13, color:"#b0a89e", marginTop:2 }}>{s.regNo} · {s.course} · {s.year}</p>
              </div>
            </div>
            <span style={{ ...STATUS[s.status], padding:"4px 13px", borderRadius:99, fontSize:12, fontWeight:700, marginBottom:4 }}>{s.status}</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:12, marginTop:20 }}>
            {[["CGA",s.cga.toFixed(2),"#1a1a1a"],["Attendance",`${s.attendance}%`,"#63a47a"],["Faculty",s.faculty,"#b0a89e"],["Year",s.year,"#b0a89e"],["Lecture Time",s.lectureTime,"#b0a89e"],["Lecture Place",s.lecturePlace,"#b0a89e"]].map(([k,v,c])=>(
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

export default function Students() {
  const [students]  = useState(INITIAL_STUDENTS);
  const [selected,  setSelected]  = useState(null);
  const [search,    setSearch]    = useState("");
  const [course,    setCourse]    = useState("All Courses");
  const [faculty,   setFaculty]   = useState("All Faculty");
  const [year,      setYear]      = useState("All Years");
  const [status,    setStatus]    = useState("All Status");
  const [showF,     setShowF]     = useState(false);

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
  const selS = { background:"#faf8f5", border:"1.5px solid #ede9e4", borderRadius:10, padding:"9px 13px", fontSize:13, outline:"none", fontFamily:"'Inter',sans-serif", color:"#1a1a1a", cursor:"pointer" };

  return (
    <div className="page-enter" style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:700, color:"#1a1a1a", letterSpacing:"-0.5px" }}>Students</h1>
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
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13.5 }}>
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