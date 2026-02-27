import { useState } from "react";
import GlobalStyles   from "./components/GlobalStyles.jsx";
import Sidebar        from "./components/Sidebar.jsx";
import SignIn         from "./pages/SignIn.jsx";
import Dashboard      from "./pages/Dashboard.jsx";
import Courses        from "./pages/Courses.jsx";
import Faculty        from "./pages/Faculty.jsx";
import Library        from "./pages/Library.jsx";
import Students       from "./pages/Students.jsx";
import Chat           from "./pages/Chat.jsx";
import Announcements  from "./pages/Announcements.jsx";
import Reports        from "./pages/Reports.jsx";
import Profile        from "./pages/Profile.jsx";
import { useAuth }    from "./context/AuthContext.jsx";

function LoadingScreen() {
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#f9e8d8 0%,#f5dece 25%,#ecddd4 50%,#e8d5d0 75%,#e4d0d8 100%)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:22, height:22, border:"2.5px solid #e2ddd8", borderTopColor:"#1a1a1a", borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
      <p style={{ fontSize:13.5, color:"#b0a89e" }}>Loading UniAdmin…</p>
    </div>
  );
}

export default function App() {
  const { user, loading, logout } = useAuth();
  const [page,      setPage]      = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  if (loading) return <LoadingScreen/>;
  if (!user)   return <><GlobalStyles/><SignIn/></>;

  const renderPage = () => {
    switch (page) {
      case "dashboard":     return <Dashboard onNavigate={setPage}/>;
      case "courses":       return <Courses/>;
      case "faculty":       return <Faculty/>;
      case "library":       return <Library/>;
      case "students":      return <Students/>;
      case "chat":          return <Chat/>;
      case "announcements": return <Announcements/>;
      case "reports":       return <Reports/>;
      case "profile":       return <Profile/>;
      default:              return <Dashboard onNavigate={setPage}/>;
    }
  };

  const isChatPage = page === "chat";

  return (
    <>
      <GlobalStyles/>
      <div style={{ position:"fixed", inset:0, zIndex:0, background:"linear-gradient(135deg,#f9e8d8 0%,#f5dece 25%,#ecddd4 50%,#e8d5d0 75%,#e4d0d8 100%)" }}/>
      <div style={{ position:"relative", zIndex:1, display:"flex", height:"100vh", overflow:"hidden" }}>
        <div style={{ padding:"12px 0 12px 12px", flexShrink:0 }}>
          <div style={{ height:"100%", borderRadius:20, overflow:"hidden", boxShadow:"0 2px 20px rgba(0,0,0,.07)" }}>
            <Sidebar page={page} onNavigate={setPage} collapsed={collapsed} onToggle={() => setCollapsed(c=>!c)} onLogout={logout}/>
          </div>
        </div>
        <main style={{ flex:1, margin:"12px 12px 12px 10px", background:"#faf8f5", borderRadius:20, overflow:"hidden", boxShadow:"0 2px 20px rgba(0,0,0,.06)", display:"flex", flexDirection:"column" }}>
          <div style={{ flex:1, overflowY:"auto", padding:isChatPage?0:"28px 32px", height:"100%" }}>
            <div style={{ maxWidth:isChatPage?"none":1080, margin:"0 auto", height:isChatPage?"100%":"auto" }}>
              {renderPage()}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}