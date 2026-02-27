import { LayoutDashboard, BookOpen, Users, GraduationCap, Library, MessageSquare, LogOut, Bell, BarChart2, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const NAV = [
  { id:"dashboard",     label:"Dashboard",     Icon:LayoutDashboard, count:null },
  { id:"students",      label:"Students",      Icon:GraduationCap,   count:12   },
  { id:"courses",       label:"Courses",       Icon:BookOpen,        count:null },
  { id:"faculty",       label:"Faculty",       Icon:Users,           count:null },
  { id:"library",       label:"Library",       Icon:Library,         count:null },
  { id:"chat",          label:"Messages",      Icon:MessageSquare,   count:6    },
  { id:"announcements", label:"Announcements", Icon:Bell,            count:null },
  { id:"reports",       label:"Reports",       Icon:BarChart2,       count:null },
];

export default function Sidebar({ page, onNavigate, collapsed, onToggle, onLogout }) {
  const { user, profile } = useAuth();

  const displayName = profile?.displayName || user?.displayName || user?.email || "Admin";
  const role        = profile?.role || "Administrator";
  const photo       = profile?.photo || user?.photoURL || null;
  const parts       = displayName.trim().split(" ");
  const initials    = parts.length >= 2 ? `${parts[0][0]}${parts[parts.length-1][0]}`.toUpperCase() : displayName.slice(0,2).toUpperCase();

  return (
    <aside style={{ width:collapsed?64:230, height:"100%", flexShrink:0, background:"#fff", borderRight:"1px solid #ede9e4", display:"flex", flexDirection:"column", transition:"width .22s cubic-bezier(.4,0,.2,1)", overflow:"hidden", position:"relative", zIndex:10 }}>

      <div style={{ height:60, display:"flex", alignItems:"center", padding:"0 16px", gap:10, borderBottom:"1px solid #f0ede9", flexShrink:0 }}>
        <div style={{ width:32, height:32, borderRadius:9, background:"#1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <GraduationCap size={17} color="#fff"/>
        </div>
        {!collapsed && <span style={{ fontSize:16, fontWeight:700, color:"#1a1a1a", whiteSpace:"nowrap", letterSpacing:"-0.3px" }}>UniAdmin</span>}
        <button onClick={onToggle} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:"#b0a89e", display:"flex", borderRadius:7, padding:4, flexShrink:0 }}>
          {collapsed ? <ChevronRight size={15}/> : <ChevronLeft size={15}/>}
        </button>
      </div>

      {!collapsed && (
        <div style={{ padding:"14px 14px 6px", flexShrink:0 }}>
          <button className="compose-btn" onClick={() => onNavigate("announcements")}>
            <Pencil size={14}/> New Announcement
          </button>
        </div>
      )}

      <nav style={{ flex:1, padding:"10px 10px", display:"flex", flexDirection:"column", gap:2, overflowY:"auto" }}>
        {!collapsed && <p className="section-label">Menu</p>}
        {NAV.map(({ id, label, Icon, count }) => (
          <button key={id} onClick={() => onNavigate(id)}
            className={`nav-item ${page===id?"active":""}`}
            style={{ justifyContent:collapsed?"center":"flex-start", paddingLeft:collapsed?0:14 }}
            title={collapsed?label:""}>
            <Icon size={16} style={{ flexShrink:0 }}/>
            {!collapsed && (
              <>
                <span style={{ flex:1 }}>{label}</span>
                {count && <span style={{ background:page===id?"rgba(255,255,255,0.2)":"#f0ede9", color:page===id?"#fff":"#7a7169", borderRadius:99, fontSize:11, fontWeight:700, padding:"1px 7px", flexShrink:0 }}>{count}</span>}
              </>
            )}
          </button>
        ))}
      </nav>

      <div style={{ padding:"10px 10px 14px", borderTop:"1px solid #f0ede9", display:"flex", flexDirection:"column", gap:2, flexShrink:0 }}>
        <button onClick={() => onNavigate("profile")} className={`nav-item ${page==="profile"?"active":""}`} style={{ justifyContent:collapsed?"center":"flex-start" }} title={collapsed?"Profile":""}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"#1a1a1a", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>
            {photo ? <img src={photo} alt="" referrerPolicy="no-referrer" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : initials}
          </div>
          {!collapsed && (
            <div style={{ minWidth:0, flex:1 }}>
              <p style={{ fontSize:13, fontWeight:600, color:page==="profile"?"#fff":"#1a1a1a", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{displayName}</p>
              <p style={{ fontSize:11, color:page==="profile"?"rgba(255,255,255,.6)":"#b0a89e" }}>{role}</p>
            </div>
          )}
        </button>
        <button onClick={onLogout} className="nav-item" style={{ color:"#e57373", justifyContent:collapsed?"center":"flex-start" }} title={collapsed?"Sign out":""}>
          <LogOut size={16} style={{ flexShrink:0 }}/>
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}