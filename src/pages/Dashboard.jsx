import { useState } from "react";
import { GraduationCap, BookOpen, Users, Library, ArrowUpRight, Search } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAuth } from "../context/AuthContext.jsx";

const enrollData = [{m:"Jan",v:1120},{m:"Feb",v:1180},{m:"Mar",v:1240},{m:"Apr",v:1195},{m:"May",v:1320},{m:"Jun",v:1280},{m:"Jul",v:1100},{m:"Aug",v:1380},{m:"Sep",v:1450},{m:"Oct",v:1510},{m:"Nov",v:1490},{m:"Dec",v:1560}];
const gpaData    = [{d:"CS",v:3.6},{d:"EEE",v:3.2},{d:"Med",v:3.8},{d:"Law",v:3.1},{d:"Bus",v:3.4},{d:"Arc",v:3.3}];
const genderData = [{name:"Male",value:58},{name:"Female",value:42}];
const statusData = [{name:"Active",value:87},{name:"Probation",value:8},{name:"Suspended",value:3},{name:"Graduated",value:2}];

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid #ede9e4", borderRadius:10, padding:"8px 14px", fontSize:13, boxShadow:"0 4px 16px rgba(0,0,0,.08)" }}>
      <p style={{ color:"#b0a89e", marginBottom:2 }}>{label}</p>
      <p style={{ fontWeight:700, color:"#1a1a1a" }}>{payload[0].value}</p>
    </div>
  );
};

const QUICK_LINKS = [
  { label:"Student Records", page:"students"      },
  { label:"Course Catalog",  page:"courses"       },
  { label:"Faculty List",    page:"faculty"       },
  { label:"Library",         page:"library"       },
  { label:"Reports",         page:"reports"       },
  { label:"Announcements",   page:"announcements" },
];

export default function Dashboard({ onNavigate }) {
  const { user, profile } = useAuth();
  const firstName = profile?.displayName?.split(" ")[0] || user?.displayName?.split(" ")[0] || "Admin";

  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? QUICK_LINKS.filter(l => l.label.toLowerCase().includes(search.toLowerCase()))
    : [];

  const STATS = [
    { label:"Total Students",  value:12,  sub:"6 active",      Icon:GraduationCap, color:"#1a1a1a" },
    { label:"Active Courses",  value:24,  sub:"8 departments", Icon:BookOpen,      color:"#6b63d4" },
    { label:"Faculty Members", value:32,  sub:"6 departments", Icon:Users,         color:"#d46363" },
    { label:"Library Books",   value:50,  sub:"open access",   Icon:Library,       color:"#63a4d4" },
  ];

  return (
    <div className="page-enter" style={{ display:"flex", flexDirection:"column", gap:24 }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, flexWrap:"wrap" }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:700, color:"#1a1a1a", letterSpacing:"-0.5px" }}>
            Good morning, {firstName} 👋
          </h1>
          <p style={{ color:"#b0a89e", fontSize:14, marginTop:4 }}>Here's what's happening at your institution today.</p>
        </div>
        <div style={{ fontSize:13, color:"#b0a89e", background:"#fff", border:"1px solid #ede9e4", borderRadius:10, padding:"8px 14px", flexShrink:0 }}>
          {new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
        </div>
      </div>

      {/* Search */}
      <div style={{ position:"relative", maxWidth:520 }}>
        <Search size={16} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#b0a89e", pointerEvents:"none" }}/>
        <input
          className="search-input"
          style={{ width:"100%", paddingLeft:40, fontSize:14, borderRadius:12, background:"#fff", border:"1.5px solid #ede9e4", padding:"11px 14px 11px 40px" }}
          placeholder="Search students, courses, faculty, reports…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {filtered.length > 0 && (
          <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, background:"#fff", border:"1px solid #ede9e4", borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,.1)", zIndex:100, overflow:"hidden" }}>
            {filtered.map(l => (
              <button key={l.page} onClick={() => { onNavigate?.(l.page); setSearch(""); }}
                style={{ width:"100%", padding:"10px 16px", background:"none", border:"none", cursor:"pointer", textAlign:"left", fontSize:13.5, color:"#1a1a1a", display:"flex", alignItems:"center", gap:8 }}
                onMouseEnter={e => e.currentTarget.style.background="#faf8f5"}
                onMouseLeave={e => e.currentTarget.style.background="none"}>
                <Search size={13} color="#b0a89e"/> {l.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14 }}>
        {STATS.map((s,i) => (
          <div key={i} className="stat-card" style={{ animationDelay:`${i*.06}s`, animation:"fadeUp .3s ease both" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ width:38, height:38, borderRadius:11, background:`${s.color}14`, display:"flex", alignItems:"center", justifyContent:"center", color:s.color }}>
                <s.Icon size={18}/>
              </div>
              <ArrowUpRight size={15} color="#b0a89e"/>
            </div>
            <div style={{ marginTop:14 }}>
              <p style={{ fontSize:26, fontWeight:700, color:"#1a1a1a", lineHeight:1 }}>{s.value}</p>
              <p style={{ fontSize:13, color:"#b0a89e", marginTop:5 }}>{s.label}</p>
              <p style={{ fontSize:12, color:"#63a47a", marginTop:3, fontWeight:600 }}>↑ {s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:16 }}>
        <div className="panel" style={{ padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <p style={{ fontWeight:600, fontSize:15, color:"#1a1a1a" }}>Enrollment 2024</p>
            <span style={{ fontSize:12, color:"#63a47a", fontWeight:600, background:"#e8f5e9", padding:"3px 9px", borderRadius:99 }}>+12% ↑</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={enrollData}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#1a1a1a" stopOpacity={.12}/>
                  <stop offset="100%" stopColor="#1a1a1a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede9" vertical={false}/>
              <XAxis dataKey="m" tick={{ fontSize:11, fill:"#b0a89e" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11, fill:"#b0a89e" }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CT/>}/>
              <Area type="monotone" dataKey="v" stroke="#1a1a1a" strokeWidth={2} fill="url(#ag)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="panel" style={{ padding:22 }}>
          <p style={{ fontWeight:600, fontSize:15, color:"#1a1a1a", marginBottom:18 }}>Gender Split</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={genderData} cx="50%" cy="50%" outerRadius={65} innerRadius={38} dataKey="value" paddingAngle={3}>
                <Cell fill="#1a1a1a"/><Cell fill="#e4d0d8"/>
              </Pie>
              <Tooltip/><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div className="panel" style={{ padding:22 }}>
          <p style={{ fontWeight:600, fontSize:15, color:"#1a1a1a", marginBottom:18 }}>Avg GPA by Department</p>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={gpaData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede9" vertical={false}/>
              <XAxis dataKey="d" tick={{ fontSize:11, fill:"#b0a89e" }} axisLine={false} tickLine={false}/>
              <YAxis domain={[2.5,4]} tick={{ fontSize:11, fill:"#b0a89e" }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CT/>}/>
              <Bar dataKey="v" radius={[7,7,0,0]}>
                {gpaData.map((_,i)=><Cell key={i} fill={i%2===0?"#1a1a1a":"#e4d0d8"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel" style={{ padding:22 }}>
          <p style={{ fontWeight:600, fontSize:15, color:"#1a1a1a", marginBottom:18 }}>Enrollment Status</p>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={65} innerRadius={38} dataKey="value" paddingAngle={3}>
                {["#1a1a1a","#f9e8d8","#e4d0d8","#d4e0e4"].map((c,i)=><Cell key={i} fill={c}/>)}
              </Pie>
              <Tooltip/><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}