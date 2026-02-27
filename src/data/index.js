export const ACCENT_PALETTE = ["#4f46e5","#0ea5e9","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6"];

export const STUDENTS = [
  { id:1, name:"Amara Obi",      course:"Computer Science",       year:2, gpa:3.8, status:"Active",    avatar:"AO", color:"#4f46e5",
    remarks:[{ by:"Dr. Afolabi", text:"Outstanding performance in Algorithms. Consistently top of class.", date:"Nov 20, 2024"},
             { by:"Dr. Chukwu",  text:"Excellent lab participation. Shows real potential.", date:"Oct 10, 2024"}] },
  { id:2, name:"Emeka Nwosu",    course:"Electrical Engineering",  year:3, gpa:3.2, status:"Active",    avatar:"EN", color:"#0ea5e9",
    remarks:[{ by:"Prof. Adeleke", text:"Strong theoretical grasp. Attendance needs improvement.", date:"Nov 15, 2024"}] },
  { id:3, name:"Fatima Hassan",  course:"Medicine & Surgery",     year:4, gpa:3.9, status:"Active",    avatar:"FH", color:"#10b981",
    remarks:[{ by:"Dr. Bello", text:"Outstanding clinical aptitude. Top-performing student.", date:"Nov 22, 2024"}] },
  { id:4, name:"Chidi Eze",      course:"Law",                    year:1, gpa:2.9, status:"Probation", avatar:"CE", color:"#f59e0b",
    remarks:[{ by:"Prof. Salami", text:"Legal writing and research skills need urgent attention.", date:"Nov 18, 2024"}] },
  { id:5, name:"Ngozi Adeyemi",  course:"Business Administration", year:2, gpa:3.5, status:"Active",    avatar:"NA", color:"#8b5cf6",
    remarks:[{ by:"Dr. Okafor", text:"Exceptional leadership qualities demonstrated in group projects.", date:"Oct 30, 2024"}] },
  { id:6, name:"Tunde Bakare",   course:"Computer Science",       year:3, gpa:3.7, status:"Active",    avatar:"TB", color:"#ec4899",
    remarks:[{ by:"Dr. Afolabi", text:"One of the best problem solvers I've taught.", date:"Nov 05, 2024"}] },
  { id:7, name:"Kemi Ola",       course:"Architecture",           year:2, gpa:3.4, status:"Active",    avatar:"KO", color:"#14b8a6",
    remarks:[{ by:"Prof. Obi", text:"Brilliant design sense. Structural calculations need more practice.", date:"Nov 12, 2024"}] },
  { id:8, name:"Segun Alabi",    course:"Medicine & Surgery",     year:3, gpa:3.1, status:"Active",    avatar:"SA", color:"#ef4444",
    remarks:[{ by:"Dr. Bello", text:"Steady progress. More clinical exposure required.", date:"Oct 25, 2024"}] },
];

export const FACULTY = [
  { id:1, name:"Dr. Chukwuemeka Afolabi", title:"Associate Professor", dept:"Computer Science",        avatar:"CA", color:"#4f46e5",
    students:120, rating:4.8, courses:["Algorithms","Data Structures","AI Fundamentals"],
    email:"c.afolabi@univ.edu.ng", phone:"+234 803 xxx xxxx",
    bio:"PhD from MIT. 14 years in academia. Specialises in machine learning and distributed systems. 32 internationally peer-reviewed publications." },
  { id:2, name:"Prof. Rasheed Adeleke",   title:"Full Professor",       dept:"Electrical Engineering", avatar:"RA", color:"#0ea5e9",
    students:95,  rating:4.6, courses:["Power Systems","Circuit Analysis","Control Theory"],
    email:"r.adeleke@univ.edu.ng", phone:"+234 806 xxx xxxx",
    bio:"PhD from Cambridge. 22 years experience. Pioneer in renewable energy systems across West Africa. IEEE fellow." },
  { id:3, name:"Dr. Amina Bello",         title:"Senior Lecturer",      dept:"Medicine & Surgery",     avatar:"AB", color:"#10b981",
    students:60,  rating:4.9, courses:["Clinical Medicine","Pharmacology","Anatomy"],
    email:"a.bello@univ.edu.ng", phone:"+234 802 xxx xxxx",
    bio:"MBBS + PhD UCL. 18 years clinical and teaching experience. Specialises in internal medicine and medical education." },
  { id:4, name:"Prof. Yemi Salami",       title:"Full Professor",       dept:"Law",                    avatar:"YS", color:"#8b5cf6",
    students:110, rating:4.7, courses:["Constitutional Law","Criminal Law","Legal Writing"],
    email:"y.salami@univ.edu.ng", phone:"+234 807 xxx xxxx",
    bio:"LLB, LLM, PhD Harvard. 26 years in legal academia. Former Supreme Court consultant. Author of 4 landmark legal texts." },
  { id:5, name:"Dr. Grace Okafor",        title:"Lecturer I",           dept:"Business Administration",avatar:"GO", color:"#f59e0b",
    students:140, rating:4.5, courses:["Marketing","Entrepreneurship","Strategic Management"],
    email:"g.okafor@univ.edu.ng", phone:"+234 805 xxx xxxx",
    bio:"MBA Harvard, PhD LSE. 10 years industry before academia. Forbes Africa contributor. Founded 2 successful startups." },
  { id:6, name:"Prof. Emeka Obi",         title:"Associate Professor",  dept:"Architecture",           avatar:"EO", color:"#ec4899",
    students:72,  rating:4.6, courses:["Structural Design","Urban Planning","Construction Tech"],
    email:"e.obi@univ.edu.ng", phone:"+234 801 xxx xxxx",
    bio:"B.Arch, M.Arch, PhD ETH Zurich. Award-winning architect. Designed 3 landmark buildings in Lagos and Abuja." },
];

export const COURSES = [
  { id:1, name:"Computer Science",         dept:"Technology",          students:312, duration:"4 yrs", code:"CSC", color:"#4f46e5", desc:"Algorithms, AI, distributed systems and software engineering." },
  { id:2, name:"Electrical Engineering",   dept:"Engineering",         students:278, duration:"5 yrs", code:"EEE", color:"#0ea5e9", desc:"Power systems, electronics, telecoms and control engineering." },
  { id:3, name:"Medicine & Surgery",       dept:"Medical Sciences",    students:180, duration:"6 yrs", code:"MBB", color:"#10b981", desc:"Clinical medicine, surgery, pharmacology and patient care." },
  { id:4, name:"Law",                      dept:"Social Sciences",     students:220, duration:"5 yrs", code:"LAW", color:"#8b5cf6", desc:"Constitutional, corporate, criminal and international law." },
  { id:5, name:"Business Administration",  dept:"Management",          students:340, duration:"4 yrs", code:"BUS", color:"#f59e0b", desc:"Entrepreneurship, finance, marketing and strategic management." },
  { id:6, name:"Architecture",             dept:"Environmental Design", students:145, duration:"5 yrs", code:"ARC", color:"#ec4899", desc:"Structural design, urban planning and architectural aesthetics." },
];

export const BOOKS = [
  { id:1,  title:"Introduction to Algorithms",       author:"Cormen, Leiserson et al.",  cat:"CS",          searches:980, color:"#4f46e5", pages:1292, year:2009, size:"12 MB", available:true  },
  { id:2,  title:"Gray's Anatomy",                   author:"Henry Gray",                cat:"Medicine",    searches:870, color:"#10b981", pages:1576, year:2015, size:"45 MB", available:true  },
  { id:3,  title:"Black's Law Dictionary",           author:"Bryan A. Garner",           cat:"Law",         searches:820, color:"#8b5cf6", pages:1920, year:2019, size:"8 MB",  available:true  },
  { id:4,  title:"Principles of Economics",          author:"N. Gregory Mankiw",         cat:"Business",    searches:760, color:"#f59e0b", pages:836,  year:2021, size:"15 MB", available:true  },
  { id:5,  title:"Engineering Electromagnetics",     author:"William H. Hayt",           cat:"Engineering", searches:690, color:"#0ea5e9", pages:752,  year:2018, size:"20 MB", available:false },
  { id:6,  title:"The Design of Everyday Things",    author:"Don Norman",                cat:"Architecture",searches:540, color:"#ec4899", pages:368,  year:2013, size:"6 MB",  available:true  },
  { id:7,  title:"Clean Code",                       author:"Robert C. Martin",          cat:"CS",          searches:490, color:"#14b8a6", pages:431,  year:2008, size:"5 MB",  available:true  },
  { id:8,  title:"Pharmacology Illustrated Review",  author:"Paul Krogsgaard-Larsen",    cat:"Medicine",    searches:430, color:"#ef4444", pages:580,  year:2017, size:"28 MB", available:true  },
  { id:9,  title:"Constitutional Law",               author:"Kathleen M. Sullivan",      cat:"Law",         searches:380, color:"#6366f1", pages:1200, year:2020, size:"11 MB", available:false },
  { id:10, title:"The Art of Architecture",          author:"Francis D.K. Ching",        cat:"Architecture",searches:310, color:"#84cc16", pages:480,  year:2014, size:"35 MB", available:true  },
  { id:11, title:"Database System Concepts",         author:"Silberschatz, Galvin",      cat:"CS",          searches:290, color:"#a855f7", pages:904,  year:2019, size:"18 MB", available:true  },
  { id:12, title:"Competitive Strategy",             author:"Michael E. Porter",         cat:"Business",    searches:250, color:"#f97316", pages:422,  year:2020, size:"9 MB",  available:true  },
];

export const CHAT_CONTACTS = [
  { id:1, name:"Dr. Afolabi",    role:"Faculty · CS",        avatar:"CA", color:"#4f46e5", online:true,  last:"I've uploaded Amara's grades.",    time:"09:41",    unread:2 },
  { id:2, name:"Prof. Adeleke",  role:"Faculty · EEE",       avatar:"RA", color:"#0ea5e9", online:false, last:"Please see the attached report.",  time:"Yesterday",unread:0 },
  { id:3, name:"Dr. Bello",      role:"Faculty · Medicine",  avatar:"AB", color:"#10b981", online:true,  last:"Fatima is excelling this term.",   time:"08:20",    unread:1 },
  { id:4, name:"Amara Obi",      role:"Student · Year 2",    avatar:"AO", color:"#6366f1", online:true,  last:"Thank you ma'am!",                 time:"10:03",    unread:0 },
  { id:5, name:"Emeka Nwosu",    role:"Student · Year 3",    avatar:"EN", color:"#0ea5e9", online:false, last:"Can I get an extension please?",   time:"Mon",      unread:3 },
  { id:6, name:"Prof. Salami",   role:"Faculty · Law",       avatar:"YS", color:"#8b5cf6", online:false, last:"Chidi's progress is concerning.",  time:"Sun",      unread:0 },
  { id:7, name:"Dr. Okafor",     role:"Faculty · Business",  avatar:"GO", color:"#f59e0b", online:true,  last:"New semester plan attached.",      time:"Fri",      unread:1 },
  { id:8, name:"Tunde Bakare",   role:"Student · Year 3",    avatar:"TB", color:"#ec4899", online:true,  last:"Project submitted!",               time:"Fri",      unread:0 },
];

export const INIT_MESSAGES = {
  1: [
    { id:1, from:"them", type:"text", text:"Good morning Dr. Eze. I've just uploaded Amara Obi's mid-semester grades to the portal.", time:"09:38", status:"read" },
    { id:2, from:"them", type:"text", text:"She scored 91/100 in Algorithms. Top of class by a wide margin.", time:"09:39", status:"read" },
    { id:3, from:"me",   type:"text", text:"That's excellent news. Her parents will be very pleased when they visit.", time:"09:41", status:"read" },
    { id:4, from:"them", type:"text", text:"I've also prepared a detailed progress report. Want me to send it over?", time:"09:41", status:"read" },
  ],
  3: [
    { id:1, from:"them", type:"text", text:"Dr. Eze, just wanted to flag that Fatima Hassan is absolutely excelling this term.", time:"08:15", status:"read" },
    { id:2, from:"them", type:"text", text:"Her clinical examination scores are the highest in her cohort.", time:"08:18", status:"read" },
    { id:3, from:"me",   type:"text", text:"Wonderful. I'll make note of this in her profile for parental review.", time:"08:20", status:"read" },
  ],
  5: [
    { id:1, from:"them", type:"text", text:"Good afternoon, ma. Please I'm having difficulty with the Thermodynamics assignment.", time:"Mon 14:00", status:"read" },
    { id:2, from:"them", type:"text", text:"Can I get a 48-hour extension please?", time:"Mon 14:01", status:"read" },
    { id:3, from:"them", type:"text", text:"I promise I will submit quality work.", time:"Mon 14:02", status:"read" },
  ],
};

export const enrollData  = [{m:"Jan",v:1120},{m:"Feb",v:1180},{m:"Mar",v:1240},{m:"Apr",v:1195},{m:"May",v:1320},{m:"Jun",v:1280},{m:"Jul",v:1100},{m:"Aug",v:1380},{m:"Sep",v:1450},{m:"Oct",v:1510},{m:"Nov",v:1490},{m:"Dec",v:1560}];
export const gpaData     = [{d:"CS",v:3.6},{d:"EEE",v:3.2},{d:"Med",v:3.8},{d:"Law",v:3.1},{d:"Bus",v:3.4},{d:"Arc",v:3.3}];
export const genderData  = [{name:"Male",value:58},{name:"Female",value:42}];
export const statusData  = [{name:"Active",value:87},{name:"Probation",value:8},{name:"Suspended",value:3},{name:"Graduated",value:2}];
export const PIE_COLORS_G = ["#4f46e5","#ec4899"];
export const PIE_COLORS_S = ["#10b981","#f59e0b","#ef4444","#6366f1"];