import { useState } from "react";
import { GraduationCap, BookOpen, Star, ArrowLeft, Mail, Phone, Search } from "lucide-react";

const FACULTY = [
  { id:1,  name:"Dr. Chukwuemeka Afolabi",   title:"Associate Professor", dept:"Computer Science",        avatar:"CA", color:"#4f46e5", students:120, rating:4.8, courses:["Algorithms","Data Structures","AI Fundamentals"],         email:"c.afolabi@univ.edu.ng",   phone:"+234 803 xxx xxxx", bio:"PhD from MIT. 14 years in academia. Specialises in machine learning and distributed systems. 32 internationally peer-reviewed publications." },
  { id:2,  name:"Prof. Rasheed Adeleke",      title:"Full Professor",       dept:"Electrical Engineering", avatar:"RA", color:"#0ea5e9", students:95,  rating:4.6, courses:["Power Systems","Circuit Analysis","Control Theory"],       email:"r.adeleke@univ.edu.ng",   phone:"+234 806 xxx xxxx", bio:"PhD from Cambridge. 22 years experience. Pioneer in renewable energy systems across West Africa. IEEE fellow." },
  { id:3,  name:"Dr. Amina Bello",            title:"Senior Lecturer",      dept:"Medicine & Surgery",     avatar:"AB", color:"#10b981", students:60,  rating:4.9, courses:["Clinical Medicine","Pharmacology","Anatomy"],             email:"a.bello@univ.edu.ng",     phone:"+234 802 xxx xxxx", bio:"MBBS + PhD UCL. 18 years clinical and teaching experience. Specialises in internal medicine and medical education." },
  { id:4,  name:"Prof. Yemi Salami",          title:"Full Professor",       dept:"Law",                    avatar:"YS", color:"#f59e0b", students:110, rating:4.7, courses:["Constitutional Law","Criminal Law","Legal Writing"],       email:"y.salami@univ.edu.ng",    phone:"+234 807 xxx xxxx", bio:"LLB, LLM, PhD Harvard. 26 years in legal academia. Former Supreme Court consultant. Author of 4 landmark legal texts." },
  { id:5,  name:"Dr. Grace Okafor",           title:"Lecturer I",           dept:"Business Administration",avatar:"GO", color:"#8b5cf6", students:140, rating:4.5, courses:["Marketing","Entrepreneurship","Strategic Management"],    email:"g.okafor@univ.edu.ng",    phone:"+234 805 xxx xxxx", bio:"MBA Harvard, PhD LSE. 10 years industry before academia. Forbes Africa contributor. Founded 2 successful startups." },
  { id:6,  name:"Prof. Emeka Obi",            title:"Associate Professor",  dept:"Architecture",           avatar:"EO", color:"#ec4899", students:72,  rating:4.6, courses:["Structural Design","Urban Planning","Construction Tech"],  email:"e.obi@univ.edu.ng",       phone:"+234 801 xxx xxxx", bio:"B.Arch, M.Arch, PhD ETH Zurich. Award-winning architect. Designed 3 landmark buildings in Lagos and Abuja." },
  { id:7,  name:"Dr. Ngozi Eze",              title:"Senior Lecturer",      dept:"Computer Science",       avatar:"NE", color:"#6366f1", students:98,  rating:4.7, courses:["Cybersecurity","Database Systems","Cloud Computing"],     email:"n.eze@univ.edu.ng",       phone:"+234 808 xxx xxxx", bio:"PhD Carnegie Mellon. Cybersecurity researcher with 12 years experience. Consulted for NITDA and major Nigerian banks." },
  { id:8,  name:"Prof. Tunde Adeyemi",        title:"Full Professor",       dept:"Civil Engineering",      avatar:"TA", color:"#14b8a6", students:88,  rating:4.5, courses:["Soil Mechanics","Structural Analysis","Bridge Design"],   email:"t.adeyemi@univ.edu.ng",   phone:"+234 809 xxx xxxx", bio:"PhD from Imperial College. 20 years in both academia and industry. Led design of several federal highway bridges." },
  { id:9,  name:"Dr. Fatima Usman",           title:"Lecturer II",          dept:"Pharmacy",               avatar:"FU", color:"#06b6d4", students:75,  rating:4.8, courses:["Pharmacognosy","Drug Metabolism","Clinical Pharmacy"],    email:"f.usman@univ.edu.ng",     phone:"+234 812 xxx xxxx", bio:"BPharm, MSc, PhD Aberdeen. Specialises in drug formulation and natural product pharmacology. 18 publications." },
  { id:10, name:"Dr. Olumide Fashola",        title:"Lecturer I",           dept:"Mechanical Engineering", avatar:"OF", color:"#f97316", students:105, rating:4.4, courses:["Thermodynamics","Fluid Mechanics","Machine Design"],      email:"o.fashola@univ.edu.ng",   phone:"+234 814 xxx xxxx", bio:"PhD University of Pretoria. Expert in renewable energy engineering and sustainable manufacturing systems." },
  { id:11, name:"Prof. Chidinma Okonkwo",     title:"Full Professor",       dept:"Medicine & Surgery",     avatar:"CO", color:"#e11d48", students:55,  rating:4.9, courses:["Surgery","Obstetrics","Medical Ethics"],                  email:"c.okonkwo@univ.edu.ng",   phone:"+234 811 xxx xxxx", bio:"MBBS, FWACS, PhD Johns Hopkins. Chief surgeon and professor. Author of leading textbook on West African surgical practice." },
  { id:12, name:"Dr. Babatunde Lawal",        title:"Senior Lecturer",      dept:"Economics",              avatar:"BL", color:"#a855f7", students:130, rating:4.5, courses:["Macroeconomics","Development Economics","Econometrics"],  email:"b.lawal@univ.edu.ng",     phone:"+234 815 xxx xxxx", bio:"PhD from Warwick. Economic policy consultant to the Federal Government. Published in top 10 economics journals." },
  { id:13, name:"Dr. Hauwa Ibrahim",          title:"Lecturer I",           dept:"Mass Communication",     avatar:"HI", color:"#fb923c", students:115, rating:4.6, courses:["Broadcast Journalism","Media Ethics","Digital PR"],       email:"h.ibrahim@univ.edu.ng",   phone:"+234 816 xxx xxxx", bio:"MA, PhD Leeds. Former BBC correspondent. Award-winning journalist with 9 years media industry experience." },
  { id:14, name:"Prof. Solomon Adekunle",     title:"Full Professor",       dept:"Mathematics",            avatar:"SA", color:"#0f766e", students:82,  rating:4.7, courses:["Real Analysis","Linear Algebra","Numerical Methods"],     email:"s.adekunle@univ.edu.ng",  phone:"+234 817 xxx xxxx", bio:"PhD from Oxford. Fields Medal nominee. Research focus on algebraic topology and applied computational mathematics." },
  { id:15, name:"Dr. Blessing Nwosu",         title:"Lecturer II",          dept:"Nursing Science",        avatar:"BN", color:"#be185d", students:90,  rating:4.8, courses:["Community Health","Midwifery","Pediatric Nursing"],       email:"b.nwosu@univ.edu.ng",     phone:"+234 818 xxx xxxx", bio:"BNSc, MSc, PhD Edinburgh. ICN fellow. Specialist in maternal-child health and community nursing practice in Nigeria." },
  { id:16, name:"Dr. Ikenna Obiora",          title:"Senior Lecturer",      dept:"Chemistry",              avatar:"IO", color:"#b45309", students:78,  rating:4.5, courses:["Organic Chemistry","Spectroscopy","Green Chemistry"],     email:"i.obiora@univ.edu.ng",    phone:"+234 819 xxx xxxx", bio:"PhD from Uppsala. Research in green synthesis and computational chemistry. Collaborates with NNPC on petrochemicals." },
  { id:17, name:"Prof. Adaeze Oguike",        title:"Associate Professor",  dept:"Biochemistry",           avatar:"AO", color:"#059669", students:86,  rating:4.7, courses:["Molecular Biology","Enzymology","Medical Biochemistry"],  email:"a.oguike@univ.edu.ng",    phone:"+234 820 xxx xxxx", bio:"PhD from UCL. Pioneer in sickle cell disease research. Recipient of the WHO West Africa Research Excellence Award." },
  { id:18, name:"Dr. Emeka Nnamdi",           title:"Lecturer I",           dept:"Political Science",      avatar:"EN", color:"#dc2626", students:125, rating:4.4, courses:["African Politics","International Relations","Diplomacy"], email:"e.nnamdi@univ.edu.ng",    phone:"+234 821 xxx xxxx", bio:"PhD from Ghana. AU election observer. Author of two books on West African political transitions and governance." },
  { id:19, name:"Dr. Kemi Adunola",           title:"Lecturer II",          dept:"Psychology",             avatar:"KA", color:"#9333ea", students:95,  rating:4.8, courses:["Cognitive Psychology","Counselling","Research Methods"],  email:"k.adunola@univ.edu.ng",   phone:"+234 822 xxx xxxx", bio:"PhD from Sheffield. Practices clinical psychology. Founder of Lagos Mental Health Initiative. 14 publications." },
  { id:20, name:"Prof. Danjuma Garba",        title:"Full Professor",       dept:"Agricultural Science",   avatar:"DG", color:"#4d7c0f", students:68,  rating:4.5, courses:["Crop Science","Soil Science","Agricultural Economics"],   email:"d.garba@univ.edu.ng",     phone:"+234 823 xxx xxxx", bio:"PhD from Wageningen. Led national food security research projects. FAO consultant for West African states." },
  { id:21, name:"Dr. Uchenna Igwe",           title:"Lecturer I",           dept:"Information Technology", avatar:"UI", color:"#7c3aed", students:110, rating:4.6, courses:["Network Security","IoT Systems","Software Engineering"],  email:"u.igwe@univ.edu.ng",      phone:"+234 824 xxx xxxx", bio:"PhD from Georgia Tech. Former engineer at Google. Research interests include IoT security and machine learning." },
  { id:22, name:"Prof. Bisi Adebayo",         title:"Full Professor",       dept:"Estate Management",      avatar:"BA", color:"#9d174d", students:62,  rating:4.6, courses:["Property Valuation","Real Estate Finance","Facilities"],  email:"b.adebayo@univ.edu.ng",   phone:"+234 825 xxx xxxx", bio:"PhD from Lund. Chartered surveyor with 25 years practice. Author of Nigeria Real Estate Standards handbook." },
  { id:23, name:"Dr. Stella Osei",            title:"Lecturer II",          dept:"Microbiology",           avatar:"SO", color:"#15803d", students:74,  rating:4.7, courses:["Bacteriology","Virology","Immunology"],                   email:"s.osei@univ.edu.ng",      phone:"+234 826 xxx xxxx", bio:"PhD from Erasmus. Infectious disease researcher. Collaborated with WHO on malaria and cholera outbreak response." },
  { id:24, name:"Dr. Musa Aliyu",             title:"Lecturer I",           dept:"Physics",                avatar:"MA", color:"#1d4ed8", students:80,  rating:4.5, courses:["Quantum Mechanics","Electromagnetism","Astrophysics"],    email:"m.aliyu@univ.edu.ng",     phone:"+234 827 xxx xxxx", bio:"PhD from CERN fellowship. Research in particle physics and renewable energy physics. 20 journal publications." },
];

const DEPTS = ["All", ...Array.from(new Set(FACULTY.map(f => f.dept))).sort()];

function Stars({ rating }) {
  return (
    <div style={{ display:"flex", gap:3, alignItems:"center" }}>
      {[1,2,3,4,5].map(s=>(
        <Star key={s} size={13} fill={s<=Math.floor(rating)?"#f59e0b":"none"} color={s<=Math.floor(rating)?"#f59e0b":"#ddd"}/>
      ))}
      <span style={{ fontSize:12.5, color:"#7a7169", marginLeft:4 }}>{rating}</span>
    </div>
  );
}

export default function Faculty() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");

  const filtered = FACULTY.filter(f => {
    const q = search.toLowerCase();
    return (dept === "All" || f.dept === dept) &&
      (!q || f.name.toLowerCase().includes(q) || f.dept.toLowerCase().includes(q));
  });

  if (selected) {
    const f = selected;
    return (
      <div className="page-enter">
        <button onClick={()=>setSelected(null)} style={{ display:"flex", alignItems:"center", gap:6, color:"#1a1a1a", fontWeight:600, fontSize:13.5, background:"none", border:"none", cursor:"pointer", marginBottom:22, fontFamily:"'Inter',sans-serif" }}>
          <ArrowLeft size={15}/> Back to Faculty
        </button>
        <div className="panel" style={{ overflow:"hidden" }}>
          <div style={{ height:110, background:`linear-gradient(135deg,${f.color},${f.color}66)` }}/>
          <div style={{ padding:"0 30px 30px", marginTop:-32 }}>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
              <div style={{ width:64, height:64, borderRadius:"50%", background:f.color, border:"3px solid #fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:700, color:"#fff" }}>{f.avatar}</div>
              <Stars rating={f.rating}/>
            </div>
            <h2 style={{ fontSize:20, fontWeight:700, color:"#1a1a1a", marginTop:14 }}>{f.name}</h2>
            <p style={{ color:f.color, fontWeight:600, fontSize:14 }}>{f.title}</p>
            <p style={{ color:"#b0a89e", fontSize:13 }}>{f.dept}</p>
            <p style={{ fontSize:13.5, color:"#4a4540", lineHeight:1.8, marginTop:14 }}>{f.bio}</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:12, marginTop:20 }}>
              {[["Email",f.email,<Mail size={13}/>],["Phone",f.phone,<Phone size={13}/>],["Students",f.students,<GraduationCap size={13}/>],["Courses",f.courses.length,<BookOpen size={13}/>]].map(([k,v,icon])=>(
                <div key={k} style={{ background:"#faf8f5", borderRadius:12, padding:"13px 14px", border:"1px solid #f0ede9" }}>
                  <p style={{ fontSize:10.5, color:"#b0a89e", fontWeight:700, textTransform:"uppercase", letterSpacing:.6, display:"flex", alignItems:"center", gap:5 }}>{icon}{k}</p>
                  <p style={{ fontSize:13.5, fontWeight:600, color:"#1a1a1a", marginTop:5 }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop:20 }}>
              <p style={{ fontWeight:700, fontSize:13.5, color:"#1a1a1a", marginBottom:10 }}>Courses Assigned</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {f.courses.map(c=>(
                  <span key={c} style={{ background:f.color+"16", color:f.color, padding:"5px 14px", borderRadius:99, fontSize:13, fontWeight:600 }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h1 style={{ fontFamily:"'Inter',sans-serif", fontSize:26, fontWeight:700, color:"#1a1a1a", letterSpacing:"-0.5px" }}>Faculty</h1>
        <p style={{ color:"#b0a89e", fontSize:13.5, marginTop:3 }}>{filtered.length} of {FACULTY.length} staff members — click a card for full profile</p>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1, minWidth:200 }}>
          <Search size={15} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#b0a89e", pointerEvents:"none" }}/>
          <input className="search-input" style={{ paddingLeft:36 }} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or department…"/>
        </div>
        <select className="field-select" value={dept} onChange={e=>setDept(e.target.value)}>
          {DEPTS.map(d=><option key={d}>{d}</option>)}
        </select>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))", gap:16 }}>
        {filtered.map((f,i)=>(
          <div key={f.id} className="panel"
            onClick={()=>setSelected(f)}
            style={{ overflow:"hidden", cursor:"pointer", animation:"fadeUp .3s ease both", animationDelay:`${i*.04}s`, transition:"transform .18s, box-shadow .18s" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 10px 30px rgba(0,0,0,.09)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
            <div style={{ height:6, background:`linear-gradient(90deg,${f.color},${f.color}88)` }}/>
            <div style={{ padding:20, display:"flex", gap:14 }}>
              <div style={{ width:50, height:50, borderRadius:"50%", background:f.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:"#fff", flexShrink:0 }}>{f.avatar}</div>
              <div style={{ flex:1 }}>
                <h3 style={{ fontWeight:700, fontSize:15, color:"#1a1a1a" }}>{f.name}</h3>
                <p style={{ fontSize:12.5, color:f.color, fontWeight:600 }}>{f.title}</p>
                <p style={{ fontSize:12, color:"#b0a89e" }}>{f.dept}</p>
                <div style={{ marginTop:8 }}><Stars rating={f.rating}/></div>
                <div style={{ display:"flex", gap:12, marginTop:9 }}>
                  <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#7a7169" }}><GraduationCap size={12}/>{f.students}</span>
                  <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#7a7169" }}><BookOpen size={12}/>{f.courses.length} courses</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!filtered.length && (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#b0a89e" }}>
          <GraduationCap size={38} style={{ margin:"0 auto 12px" }}/>
          <p style={{ fontWeight:600, color:"#7a7169" }}>No faculty match your search</p>
        </div>
      )}
    </div>
  );
}