import { useState } from "react";
import { Download, FileText, BarChart2, GraduationCap, Users, BookOpen, TrendingUp, Check } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

function Toast({ msg }) {
  return <div style={{ position:"fixed",top:24,right:24,zIndex:9999,background:"#fff",border:"1px solid #ede9e4",borderRadius:12,padding:"12px 18px",fontSize:13.5,fontWeight:500,display:"flex",alignItems:"center",gap:9,boxShadow:"0 8px 30px rgba(0,0,0,.10)",animation:"fadeUp .25s ease both",color:"#1a1a1a" }}><Check size={15} color="#4caf50"/>{msg}</div>;
}

export default function Reports() {
  const { students, books, announcements } = useApp();
  const [generated, setGenerated] = useState({});
  const [loading,   setLoading]   = useState({});
  const [toast,     setToast]     = useState("");

  const fire = (msg) => { setToast(msg); setTimeout(()=>setToast(""),3000); };

  const buildCSV = (id) => {
    const ts = new Date().toLocaleString();
    switch(id) {
      case "students":
        return "Reg. No.,Name,Course,Year,Attendance (%),CGA,Status,Faculty,Lecture Time,Lecture Place\n"
          + students.map(s=>[s.regNo,s.name,s.course,s.year,s.attendance,s.cga,s.status,s.faculty,s.lectureTime,s.lecturePlace].map(v=>`"${v}"`).join(",")).join("\n")
          + `\n\nTotal: ${students.length} students\nGenerated: ${ts}`;
      case "books":
        return "Title,Author,Category,Searches,Available,Pages,Year\n"
          + books.map(b=>[b.title,b.author,b.cat,b.searches,b.available?"Yes":"No",b.pages,b.year].map(v=>`"${v}"`).join(",")).join("\n")
          + `\n\nTotal: ${books.length} books\nGenerated: ${ts}`;
      case "attendance":
        return "Name,Course,Year,Attendance (%),Status\n"
          + students.sort((a,b)=>a.attendance-b.attendance).map(s=>[s.name,s.course,s.year,s.attendance,s.status].map(v=>`"${v}"`).join(",")).join("\n")
          + `\n\nGenerated: ${ts}`;
      case "gpa":
        return "Name,Course,CGA,Status\n"
          + students.sort((a,b)=>b.cga-a.cga).map(s=>[s.name,s.course,s.cga,s.status].map(v=>`"${v}"`).join(",")).join("\n")
          + `\n\nAvg GPA: ${(students.reduce((a,s)=>a+s.cga,0)/students.length).toFixed(2)}\nGenerated: ${ts}`;
      case "announcements":
        return "Title,Audience,Priority,Date,Author,Pinned\n"
          + announcements.map(a=>[a.title,a.audience,a.priority,a.date,a.author,a.pinned?"Yes":"No"].map(v=>`"${v}"`).join(",")).join("\n")
          + `\n\nTotal: ${announcements.length}\nGenerated: ${ts}`;
      case "faculty":
        return "Name,Title,Department,Students\n"
          + [["Dr. Chukwuemeka Afolabi","Associate Professor","Computer Science",120],["Prof. Rasheed Adeleke","Full Professor","Electrical Engineering",95],["Dr. Amina Bello","Senior Lecturer","Medicine & Surgery",60],["Prof. Yemi Salami","Full Professor","Law",110],["Dr. Grace Okafor","Lecturer I","Business Administration",140],["Prof. Emeka Obi","Associate Professor","Architecture",72]]
            .map(r=>r.map(v=>`"${v}"`).join(",")).join("\n")
          + `\n\nGenerated: ${ts}`;
      default: return "No data";
    }
  };

  const handleGenerate = (id) => {
    setLoading(p=>({...p,[id]:true}));
    setTimeout(()=>{ setLoading(p=>({...p,[id]:false})); setGenerated(p=>({...p,[id]:true})); fire(`${REPORTS.find(r=>r.id===id)?.label} ready`); },1000);
  };

  const handleDownload = (id) => {
    const r    = REPORTS.find(r=>r.id===id);
    const csv  = buildCSV(id);
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href=url; a.download=`${r.label.replace(/\s+/g,"-").toLowerCase()}-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    fire(`${r.label} downloaded — check your Downloads folder`);
  };

  const REPORTS = [
    { id:"students",      label:"Student Performance", desc:"Full academic records, GPA, attendance and status",     Icon:GraduationCap, color:"#4f46e5", count:students.length       },
    { id:"attendance",    label:"Attendance Summary",  desc:"Attendance rates sorted from lowest to highest",         Icon:Users,         color:"#10b981", count:students.length       },
    { id:"gpa",           label:"GPA Distribution",    desc:"All students sorted by CGA with course and status",      Icon:BarChart2,     color:"#0ea5e9", count:students.length       },
    { id:"books",         label:"Library Catalogue",   desc:"All books, availability, categories and search counts",  Icon:BookOpen,      color:"#f59e0b", count:books.length          },
    { id:"announcements", label:"Announcements Log",   desc:"All announcements sent, audience and priority",          Icon:FileText,      color:"#ec4899", count:announcements.length  },
    { id:"faculty",       label:"Faculty Workload",    desc:"Faculty list with departments and student counts",        Icon:TrendingUp,    color:"#8b5cf6", count:6                     },
  ];

  return (
    <div className="page-enter" style={{ display:"flex", flexDirection:"column", gap:22 }}>
      {toast && <Toast msg={toast}/>}

      <div>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, fontWeight:600, color:"#1a1a1a" }}>Reports</h1>
        <p style={{ color:"#b0a89e", fontSize:13.5, marginTop:3 }}>Generate real CSV files you can open in Excel or Google Sheets</p>
      </div>

      <div style={{ background:"#faf8f5", border:"1px solid #ede9e4", borderRadius:12, padding:"11px 15px", fontSize:13, color:"#7a7169", display:"flex", alignItems:"center", gap:9 }}>
        <FileText size={14} color="#b0a89e"/> Reports use your live data — adding students or books will reflect in the next download.
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
        {REPORTS.map(r=>(
          <div key={r.id} className="panel" style={{ padding:22 }}>
            <div style={{ display:"flex", gap:13, marginBottom:14 }}>
              <div style={{ width:46, height:46, borderRadius:13, background:r.color+"16", display:"flex", alignItems:"center", justifyContent:"center", color:r.color, flexShrink:0 }}>
                <r.Icon size={20}/>
              </div>
              <div>
                <h3 style={{ fontWeight:700, fontSize:14.5, color:"#1a1a1a" }}>{r.label}</h3>
                <p style={{ fontSize:12, color:"#b0a89e", marginTop:2 }}>{r.count} records</p>
              </div>
            </div>
            <p style={{ fontSize:13, color:"#7a7169", lineHeight:1.6, marginBottom:16 }}>{r.desc}</p>
            <div style={{ display:"flex", gap:9 }}>
              {!generated[r.id] ? (
                <button onClick={()=>handleGenerate(r.id)} disabled={loading[r.id]} className="btn-dark" style={{ flex:1, justifyContent:"center", opacity:loading[r.id]?.6:1 }}>
                  {loading[r.id]
                    ? <><div style={{ width:13,height:13,border:"2px solid rgba(255,255,255,.35)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite" }}/>Generating…</>
                    : <><FileText size={13}/> Generate</>
                  }
                </button>
              ) : (
                <button onClick={()=>handleDownload(r.id)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:7, background:"#e8f5e9", color:"#2e7d32", border:"1.5px solid #c8e6c9", borderRadius:10, padding:"10px", fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                  <Download size={14}/> Download CSV
                </button>
              )}
              {generated[r.id] && (
                <button onClick={()=>handleGenerate(r.id)} className="btn-ghost" style={{ padding:"10px 14px" }} title="Regenerate">
                  <TrendingUp size={13}/>
                </button>
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