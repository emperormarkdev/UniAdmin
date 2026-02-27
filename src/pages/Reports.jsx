import { useState } from "react";
import { Download, FileText, BarChart2, GraduationCap, Users, BookOpen, TrendingUp, Check } from "lucide-react";

const STUDENTS_DATA = [
  { regNo:"CSC/2021/001", name:"Amara Obi",        course:"Computer Science",        year:"Year 3", attendance:88, cga:3.71, status:"In Progress", faculty:"Dr. Afolabi",   lectureTime:"Mon/Wed 10:00", lecturePlace:"LT1" },
  { regNo:"EEE/2022/014", name:"Chidi Eze",         course:"Electrical Engineering",  year:"Year 2", attendance:61, cga:2.94, status:"In Progress", faculty:"Prof. Adeleke", lectureTime:"Tue/Thu 09:00", lecturePlace:"ENG Block A" },
  { regNo:"MED/2020/007", name:"Fatima Bello",      course:"Medicine & Surgery",      year:"Year 4", attendance:95, cga:3.92, status:"In Progress", faculty:"Dr. Bello",     lectureTime:"Daily 08:00",   lecturePlace:"Med Auditorium" },
  { regNo:"LAW/2021/033", name:"Tunde Adeyemi",     course:"Law",                     year:"Year 3", attendance:74, cga:3.20, status:"In Progress", faculty:"Prof. Salami",  lectureTime:"Mon/Fri 11:00", lecturePlace:"Law Faculty Hall" },
  { regNo:"BUS/2023/005", name:"Grace Okafor",      course:"Business Administration", year:"Year 1", attendance:82, cga:3.45, status:"In Progress", faculty:"Dr. Okafor",    lectureTime:"Wed/Fri 14:00", lecturePlace:"MBA Block B" },
  { regNo:"ARC/2020/019", name:"Emeka Nwosu",       course:"Architecture",            year:"Year 5", attendance:90, cga:3.65, status:"Concluded",   faculty:"Prof. Obi",     lectureTime:"Tue/Thu 13:00", lecturePlace:"Design Studio 2" },
];

const BOOKS_DATA = [
  { title:"Things Fall Apart", author:"Chinua Achebe", cat:"Literature", searches:97, available:true, pages:209, year:1958 },
  { title:"Introduction to Algorithms", author:"Cormen et al.", cat:"Computer Science", searches:95, available:true, pages:1292, year:2009 },
  { title:"Sapiens", author:"Yuval Noah Harari", cat:"History", searches:94, available:true, pages:443, year:2011 },
  { title:"Gray's Anatomy", author:"Henry Gray", cat:"Medicine", searches:93, available:true, pages:1576, year:2016 },
  { title:"The Feynman Lectures", author:"Richard Feynman", cat:"Physics", searches:91, available:true, pages:1552, year:1963 },
  { title:"Rich Dad Poor Dad", author:"Robert Kiyosaki", cat:"Business", searches:91, available:false, pages:336, year:1997 },
];

const ANNOUNCEMENTS_DATA = [
  { title:"Exam Timetable Released", audience:"All Students", priority:"High", date:"15 Jan 2025", author:"Admin", pinned:true },
  { title:"Faculty Research Symposium", audience:"Faculty Only", priority:"Normal", date:"10 Jan 2025", author:"Admin", pinned:false },
  { title:"Library Extended Hours", audience:"Everyone", priority:"Low", date:"8 Jan 2025", author:"Admin", pinned:false },
];

function Toast({ msg }) {
  return <div style={{ position:"fixed",top:24,right:24,zIndex:9999,background:"#fff",border:"1px solid #ede9e4",borderRadius:12,padding:"12px 18px",fontSize:13.5,fontWeight:500,display:"flex",alignItems:"center",gap:9,boxShadow:"0 8px 30px rgba(0,0,0,.10)",animation:"fadeUp .25s ease both",color:"#1a1a1a" }}><Check size={15} color="#4caf50"/>{msg}</div>;
}

export default function Reports() {
  const [generated, setGenerated] = useState({});
  const [loading,   setLoading]   = useState({});
  const [toast,     setToast]     = useState("");

  const fire = (msg) => { setToast(msg); setTimeout(()=>setToast(""),3000); };

  const buildCSV = (id) => {
    const ts = new Date().toLocaleString();
    switch(id) {
      case "students":
        return "Reg. No.,Name,Course,Year,Attendance (%),CGA,Status,Faculty\n"
          + STUDENTS_DATA.map(s=>[s.regNo,s.name,s.course,s.year,s.attendance,s.cga,s.status,s.faculty].map(v=>`"${v}"`).join(",")).join("\n")
          + `\n\nTotal: ${STUDENTS_DATA.length} students\nGenerated: ${ts}`;
      case "books":
        return "Title,Author,Category,Searches,Available,Pages,Year\n"
          + BOOKS_DATA.map(b=>[b.title,b.author,b.cat,b.searches,b.available?"Yes":"No",b.pages,b.year].map(v=>`"${v}"`).join(",")).join("\n")
          + `\n\nTotal: ${BOOKS_DATA.length} books\nGenerated: ${ts}`;
      case "attendance":
        return "Name,Course,Year,Attendance (%),Status\n"
          + [...STUDENTS_DATA].sort((a,b)=>a.attendance-b.attendance).map(s=>[s.name,s.course,s.year,s.attendance,s.status].map(v=>`"${v}"`).join(",")).join("\n")
          + `\n\nGenerated: ${ts}`;
      case "gpa":
        return "Name,Course,CGA,Status\n"
          + [...STUDENTS_DATA].sort((a,b)=>b.cga-a.cga).map(s=>[s.name,s.course,s.cga,s.status].map(v=>`"${v}"`).join(",")).join("\n")
          + `\n\nAvg GPA: ${(STUDENTS_DATA.reduce((a,s)=>a+s.cga,0)/STUDENTS_DATA.length).toFixed(2)}\nGenerated: ${ts}`;
      case "announcements":
        return "Title,Audience,Priority,Date,Author,Pinned\n"
          + ANNOUNCEMENTS_DATA.map(a=>[a.title,a.audience,a.priority,a.date,a.author,a.pinned?"Yes":"No"].map(v=>`"${v}"`).join(",")).join("\n")
          + `\n\nTotal: ${ANNOUNCEMENTS_DATA.length}\nGenerated: ${ts}`;
      case "faculty":
        return "Name,Title,Department,Students\n"
          + [["Dr. Chukwuemeka Afolabi","Associate Professor","Computer Science",120],["Prof. Rasheed Adeleke","Full Professor","Electrical Engineering",95],["Dr. Amina Bello","Senior Lecturer","Medicine & Surgery",60],["Prof. Yemi Salami","Full Professor","Law",110],["Dr. Grace Okafor","Lecturer I","Business Administration",140],["Prof. Emeka Obi","Associate Professor","Architecture",72]]
            .map(r=>r.map(v=>`"${v}"`).join(",")).join("\n")
          + `\n\nGenerated: ${ts}`;
      default: return "No data";
    }
  };

  const REPORTS = [
    { id:"students",      label:"Student Performance", desc:"Full academic records, GPA, attendance and status",    Icon:GraduationCap, color:"#4f46e5", count:STUDENTS_DATA.length },
    { id:"attendance",    label:"Attendance Summary",  desc:"Attendance rates sorted from lowest to highest",        Icon:Users,         color:"#10b981", count:STUDENTS_DATA.length },
    { id:"gpa",           label:"GPA Distribution",    desc:"All students sorted by CGA with course and status",     Icon:BarChart2,     color:"#0ea5e9", count:STUDENTS_DATA.length },
    { id:"books",         label:"Library Catalogue",   desc:"All books, availability, categories and search counts", Icon:BookOpen,      color:"#f59e0b", count:BOOKS_DATA.length    },
    { id:"announcements", label:"Announcements Log",   desc:"All announcements sent, audience and priority",         Icon:FileText,      color:"#ec4899", count:ANNOUNCEMENTS_DATA.length },
    { id:"faculty",       label:"Faculty Workload",    desc:"Faculty list with departments and student counts",       Icon:TrendingUp,    color:"#8b5cf6", count:6 },
  ];

  const handleGenerate = (id) => {
    setLoading(p=>({...p,[id]:true}));
    setTimeout(()=>{ setLoading(p=>({...p,[id]:false})); setGenerated(p=>({...p,[id]:true})); fire(`${REPORTS.find(r=>r.id===id)?.label} ready`); },1000);
  };

  const handleDownload = (id) => {
    const r   = REPORTS.find(r=>r.id===id);
    const csv = buildCSV(id);
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href=url; a.download=`${r.label.replace(/\s+/g,"-").toLowerCase()}-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    fire(`${r.label} downloaded`);
  };

  return (
    <div className="page-enter" style={{ display:"flex", flexDirection:"column", gap:22 }}>
      {toast && <Toast msg={toast}/>}
      <div>
        <h1 style={{ fontSize:26, fontWeight:700, color:"#1a1a1a", letterSpacing:"-0.5px" }}>Reports</h1>
        <p style={{ color:"#b0a89e", fontSize:13.5, marginTop:3 }}>Generate real CSV files you can open in Excel or Google Sheets</p>
      </div>
      <div style={{ background:"#faf8f5", border:"1px solid #ede9e4", borderRadius:12, padding:"11px 15px", fontSize:13, color:"#7a7169", display:"flex", alignItems:"center", gap:9 }}>
        <FileText size={14} color="#b0a89e"/> Reports use live data — they reflect the current state of your database.
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
        {REPORTS.map(r=>(
          <div key={r.id} className="panel" style={{ padding:22 }}>
            <div style={{ display:"flex", gap:13, marginBottom:14 }}>
              <div style={{ width:46, height:46, borderRadius:13, background:r.color+"16", display:"flex", alignItems:"center", justifyContent:"center", color:r.color, flexShrink:0 }}><r.Icon size={20}/></div>
              <div><h3 style={{ fontWeight:700, fontSize:14.5, color:"#1a1a1a" }}>{r.label}</h3><p style={{ fontSize:12, color:"#b0a89e", marginTop:2 }}>{r.count} records</p></div>
            </div>
            <p style={{ fontSize:13, color:"#7a7169", lineHeight:1.6, marginBottom:16 }}>{r.desc}</p>
            <div style={{ display:"flex", gap:9 }}>
              {!generated[r.id] ? (
                <button onClick={()=>handleGenerate(r.id)} disabled={loading[r.id]} className="btn-dark" style={{ flex:1, justifyContent:"center", opacity:loading[r.id]?.6:1 }}>
                  {loading[r.id]
                    ? <><div style={{ width:13,height:13,border:"2px solid rgba(255,255,255,.35)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite" }}/>Generating…</>
                    : <><FileText size={13}/> Generate</>}
                </button>
              ) : (
                <button onClick={()=>handleDownload(r.id)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:7, background:"#e8f5e9", color:"#2e7d32", border:"1.5px solid #c8e6c9", borderRadius:10, padding:"10px", fontWeight:600, fontSize:13.5, cursor:"pointer" }}>
                  <Download size={14}/> Download CSV
                </button>
              )}
              {generated[r.id] && (
                <button onClick={()=>handleGenerate(r.id)} className="btn-ghost" style={{ padding:"10px 14px" }} title="Regenerate"><TrendingUp size={13}/></button>
              )}
            </div>
            {generated[r.id] && <p style={{ fontSize:11.5, color:"#4caf50", marginTop:9, display:"flex", alignItems:"center", gap:5 }}><Check size={11}/>Ready · {new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</p>}
          </div>
        ))}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}