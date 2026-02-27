import { createContext, useContext, useState, useEffect } from "react";

// ── Default data ─────────────────────────────────────────────────────────────
const DEFAULT_ADMIN = {
  firstName: "Ngozi",
  lastName:  "Eze",
  email:     "admin@univ.edu.ng",
  phone:     "+234 801 234 5678",
  role:      "Administrator",
  dept:      "Office of the Registrar",
  location:  "University of Technology, Lagos",
  bio:       "Senior administrator with 14 years experience in academic management and student affairs.",
  joinDate:  "January 2020",
  photo:     null,
  password:  "admin123",
  notifications: { email: true, sms: false, browser: true, reports: true },
  twoFactor: false,
};

const DEFAULT_BOOKS = [
  { id:1,  title:"Introduction to Algorithms (CLRS)",            author:"Cormen, Leiserson, Rivest & Stein", cat:"Computer Science", searches:980, color:"#4f46e5", pages:1292, year:2009, size:"~12 MB", available:true,  readUrl:"https://dl.ebooksworld.ir/books/Introduction.to.Algorithms.4th.Leiserson.Stein.Rivest.Cormen.MIT.Press.9780262046305.EBooksWorld.ir.pdf", downloadUrl:"https://dl.ebooksworld.ir/books/Introduction.to.Algorithms.4th.Leiserson.Stein.Rivest.Cormen.MIT.Press.9780262046305.EBooksWorld.ir.pdf" },
  { id:2,  title:"Think Python",                                  author:"Allen B. Downey",                   cat:"Computer Science", searches:870, color:"#0ea5e9", pages:292,  year:2015, size:"~3 MB",  available:true,  readUrl:"https://greenteapress.com/thinkpython2/thinkpython2.pdf", downloadUrl:"https://greenteapress.com/thinkpython2/thinkpython2.pdf" },
  { id:3,  title:"The Elements of Statistical Learning",          author:"Hastie, Tibshirani & Friedman",     cat:"Computer Science", searches:760, color:"#8b5cf6", pages:745,  year:2016, size:"~12 MB", available:true,  readUrl:"https://hastie.su.domains/ElemStatLearn/printings/ESLII_print12_toc.pdf", downloadUrl:"https://hastie.su.domains/ElemStatLearn/printings/ESLII_print12_toc.pdf" },
  { id:4,  title:"Constitution of the Federal Republic of Nigeria",author:"Federal Republic of Nigeria",      cat:"Law",              searches:820, color:"#f59e0b", pages:320,  year:2011, size:"~2 MB",  available:true,  readUrl:"https://constituteproject.org/constitution/Nigeria_2011.pdf", downloadUrl:"https://constituteproject.org/constitution/Nigeria_2011.pdf" },
  { id:5,  title:"Principles of Economics",                       author:"N. Gregory Mankiw",                 cat:"Business",         searches:690, color:"#10b981", pages:836,  year:2021, size:"~15 MB", available:true,  readUrl:"https://archive.org/download/principles-of-economics-mankiw/Principles%20of%20Economics%20-%20Mankiw.pdf", downloadUrl:"https://archive.org/download/principles-of-economics-mankiw/Principles%20of%20Economics%20-%20Mankiw.pdf" },
  { id:6,  title:"Business Model Generation",                     author:"Alexander Osterwalder",             cat:"Business",         searches:610, color:"#f97316", pages:288,  year:2010, size:"~25 MB", available:true,  readUrl:"https://archive.org/download/businessmodelgen0000oste/businessmodelgen0000oste.pdf", downloadUrl:"https://archive.org/download/businessmodelgen0000oste/businessmodelgen0000oste.pdf" },
  { id:7,  title:"Clean Code",                                    author:"Robert C. Martin",                  cat:"Computer Science", searches:590, color:"#14b8a6", pages:431,  year:2008, size:"~5 MB",  available:true,  readUrl:"https://archive.org/download/clean-code-a-handbook-of-agile-software-craftsmanship/Clean%20Code_%20A%20Handbook%20of%20Agile%20Software%20Craftsman%20-%20Robert%20C.%20Martin.pdf", downloadUrl:"https://archive.org/download/clean-code-a-handbook-of-agile-software-craftsmanship/Clean%20Code_%20A%20Handbook%20of%20Agile%20Software%20Craftsman%20-%20Robert%20C.%20Martin.pdf" },
  { id:8,  title:"Fundamentals of Electric Circuits",             author:"Charles Alexander & Matthew Sadiku",cat:"Engineering",      searches:540, color:"#ec4899", pages:984,  year:2016, size:"~20 MB", available:true,  readUrl:"https://archive.org/download/FundamentalsOfElectricCircuits5thEdition/Fundamentals%20of%20Electric%20Circuits%205th%20Edition.pdf", downloadUrl:"https://archive.org/download/FundamentalsOfElectricCircuits5thEdition/Fundamentals%20of%20Electric%20Circuits%205th%20Edition.pdf" },
  { id:9,  title:"Gray's Anatomy for Students",                   author:"Drake, Vogl & Mitchell",            cat:"Medicine",         searches:870, color:"#ef4444", pages:1192, year:2020, size:"~80 MB", available:true,  readUrl:"https://archive.org/download/grays-anatomy-for-students/Grays-Anatomy-for-Students.pdf", downloadUrl:"https://archive.org/download/grays-anatomy-for-students/Grays-Anatomy-for-Students.pdf" },
  { id:10, title:"Architecture: Form, Space, and Order",          author:"Francis D.K. Ching",                cat:"Architecture",     searches:540, color:"#84cc16", pages:438,  year:2015, size:"~35 MB", available:false, readUrl:"https://archive.org/download/architectureform0000chin/architectureform0000chin.pdf", downloadUrl:"https://archive.org/download/architectureform0000chin/architectureform0000chin.pdf" },
];

const DEFAULT_STUDENTS = [
  { id:1,  regNo:"CSC/2022/001", name:"Amara Obi",       avatar:"AO", color:"#4f46e5", course:"Computer Science",        faculty:"Dr. Afolabi",   year:"Year 2", attendance:87,  cga:3.80, status:"In Progress", lectureTime:"Mon & Wed 10:00–12:00",   lecturePlace:"Engineering Block B, Room 204",         remarks:[{by:"Dr. Afolabi",text:"Outstanding in Algorithms. Consistently top of class.",date:"Nov 20, 2024"},{by:"Dr. Chukwu",text:"Excellent lab participation.",date:"Oct 10, 2024"}] },
  { id:2,  regNo:"EEE/2021/047", name:"Emeka Nwosu",     avatar:"EN", color:"#0ea5e9", course:"Electrical Engineering",  faculty:"Prof. Adeleke", year:"Year 3", attendance:61,  cga:3.20, status:"In Progress", lectureTime:"Tue & Thu 08:00–10:00",   lecturePlace:"Faculty of Engineering, Hall 1",        remarks:[{by:"Prof. Adeleke",text:"Strong theoretical grasp but attendance is a serious concern.",date:"Nov 15, 2024"}] },
  { id:3,  regNo:"MBB/2020/012", name:"Fatima Hassan",   avatar:"FH", color:"#10b981", course:"Medicine & Surgery",      faculty:"Dr. Bello",     year:"Year 4", attendance:95,  cga:3.90, status:"In Progress", lectureTime:"Mon–Fri 07:30–13:00",     lecturePlace:"College of Medicine, Clinical Block",   remarks:[{by:"Dr. Bello",text:"Outstanding clinical aptitude. Highest scores in cohort.",date:"Nov 22, 2024"}] },
  { id:4,  regNo:"LAW/2023/088", name:"Chidi Eze",       avatar:"CE", color:"#f59e0b", course:"Law",                    faculty:"Prof. Salami",  year:"Year 1", attendance:72,  cga:2.90, status:"In Progress", lectureTime:"Wed & Fri 14:00–16:00",   lecturePlace:"Faculty of Law, Moot Court",            remarks:[{by:"Prof. Salami",text:"Legal writing and research need urgent attention.",date:"Nov 18, 2024"}] },
  { id:5,  regNo:"BUS/2022/034", name:"Ngozi Adeyemi",   avatar:"NA", color:"#8b5cf6", course:"Business Administration", faculty:"Dr. Okafor",    year:"Year 2", attendance:90,  cga:3.50, status:"In Progress", lectureTime:"Tue & Thu 12:00–14:00",   lecturePlace:"Management Sciences Building, Room 101",remarks:[{by:"Dr. Okafor",text:"Exceptional leadership qualities.",date:"Oct 30, 2024"}] },
  { id:6,  regNo:"CSC/2021/019", name:"Tunde Bakare",    avatar:"TB", color:"#ec4899", course:"Computer Science",        faculty:"Dr. Afolabi",   year:"Year 3", attendance:82,  cga:3.70, status:"In Progress", lectureTime:"Mon & Wed 10:00–12:00",   lecturePlace:"Engineering Block B, Room 204",         remarks:[{by:"Dr. Afolabi",text:"One of the finest problem solvers in recent memory.",date:"Nov 05, 2024"}] },
  { id:7,  regNo:"ARC/2022/056", name:"Kemi Ola",        avatar:"KO", color:"#14b8a6", course:"Architecture",            faculty:"Prof. Obi",     year:"Year 2", attendance:78,  cga:3.40, status:"In Progress", lectureTime:"Fri 09:00–13:00",         lecturePlace:"Environmental Design Studio, Floor 3",  remarks:[{by:"Prof. Obi",text:"Brilliant creative instincts. Structural analysis needs work.",date:"Nov 12, 2024"}] },
  { id:8,  regNo:"MBB/2021/031", name:"Segun Alabi",     avatar:"SA", color:"#ef4444", course:"Medicine & Surgery",      faculty:"Dr. Bello",     year:"Year 3", attendance:74,  cga:3.10, status:"In Progress", lectureTime:"Mon–Fri 07:30–13:00",     lecturePlace:"College of Medicine, Clinical Block",   remarks:[{by:"Dr. Bello",text:"Steady progress. Additional clinical rotation recommended.",date:"Oct 25, 2024"}] },
  { id:9,  regNo:"BUS/2019/002", name:"Yusuf Ibrahim",   avatar:"YI", color:"#f97316", course:"Business Administration", faculty:"Dr. Okafor",    year:"Year 4", attendance:100, cga:3.95, status:"Concluded",   lectureTime:"—", lecturePlace:"—", remarks:[{by:"Dr. Okafor",text:"Graduated with distinction.",date:"Jul 15, 2024"}] },
  { id:10, regNo:"EEE/2020/071", name:"Aisha Mohammed",  avatar:"AM", color:"#6366f1", course:"Electrical Engineering",  faculty:"Prof. Adeleke", year:"Year 3", attendance:55,  cga:2.70, status:"Break",       lectureTime:"—", lecturePlace:"—", remarks:[{by:"Prof. Adeleke",text:"Student is on approved medical break.",date:"Sep 01, 2024"}] },
  { id:11, regNo:"LAW/2021/044", name:"Blessing Eze",    avatar:"BE", color:"#84cc16", course:"Law",                    faculty:"Prof. Salami",  year:"Year 3", attendance:88,  cga:3.60, status:"In Progress", lectureTime:"Wed & Fri 14:00–16:00",   lecturePlace:"Faculty of Law, Moot Court",            remarks:[{by:"Prof. Salami",text:"Excellent advocacy skills.",date:"Nov 10, 2024"}] },
  { id:12, regNo:"ARC/2019/008", name:"Dare Fashola",    avatar:"DF", color:"#a855f7", course:"Architecture",            faculty:"Prof. Obi",     year:"Year 5", attendance:91,  cga:3.85, status:"Concluded",   lectureTime:"—", lecturePlace:"—", remarks:[{by:"Prof. Obi",text:"Thesis was exceptional. Recommended for publication.",date:"Aug 20, 2024"}] },
];

const DEFAULT_ANNOUNCEMENTS = [
  { id:1, title:"End of Semester Examination Schedule Released", body:"The timetable for 2024/2025 first semester examinations has been published. All students should confirm their exam dates immediately.", audience:"All Students", priority:"High",   date:"Nov 24, 2024", pinned:true,  author:"Dr. Ngozi Eze" },
  { id:2, title:"Library Extended Hours — December",             body:"The library will operate extended hours from December 1st–20th: 7:00 AM – 11:00 PM daily to support students during revision.",           audience:"All Students", priority:"Normal", date:"Nov 22, 2024", pinned:false, author:"Dr. Ngozi Eze" },
  { id:3, title:"Faculty Senate Meeting — Agenda Circulated",    body:"The agenda for the December Faculty Senate meeting has been circulated. Submit additional items by November 30.",                         audience:"Faculty Only", priority:"Normal", date:"Nov 20, 2024", pinned:false, author:"Dr. Ngozi Eze" },
];

// ── Helper: load from localStorage with fallback ─────────────────────────────
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Context ───────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [admin,         setAdminRaw]         = useState(() => load("uni_admin",         DEFAULT_ADMIN));
  const [books,         setBooksRaw]         = useState(() => load("uni_books",         DEFAULT_BOOKS));
  const [students,      setStudentsRaw]      = useState(() => load("uni_students",      DEFAULT_STUDENTS));
  const [announcements, setAnnouncementsRaw] = useState(() => load("uni_announcements", DEFAULT_ANNOUNCEMENTS));

  // Every setter also persists to localStorage
  const setAdmin         = v => { const n = typeof v==="function"?v(admin):v;         save("uni_admin",         n); setAdminRaw(n); };
  const setBooks         = v => { const n = typeof v==="function"?v(books):v;         save("uni_books",         n); setBooksRaw(n); };
  const setStudents      = v => { const n = typeof v==="function"?v(students):v;      save("uni_students",      n); setStudentsRaw(n); };
  const setAnnouncements = v => { const n = typeof v==="function"?v(announcements):v; save("uni_announcements", n); setAnnouncementsRaw(n); };

  return (
    <AppContext.Provider value={{ admin, setAdmin, books, setBooks, students, setStudents, announcements, setAnnouncements }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);