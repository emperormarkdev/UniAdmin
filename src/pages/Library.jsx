import { useState, useMemo } from "react";
import {
  Search, BookOpen, Download, Eye, ArrowLeft, Check,
  ExternalLink, Plus, X, AlertCircle, Trash2, TrendingUp, Sparkles,
} from "lucide-react";

const CATS = ["All","Computer Science","Law","Business","Engineering","Medicine","Architecture","Mathematics","Physics","Economics","Literature","History","Social Sciences"];
const PALETTE = ["#4f46e5","#0ea5e9","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316","#6366f1","#84cc16","#a855f7","#dc2626","#0891b2","#7c3aed","#65a30d"];

// All readUrl → archive.org/details/ID  (the book landing page — always works, has real download button)
// All downloadUrl → same /details/ page for archive.org books; direct PDF for MIT/Caltech/Gutenberg/Axler
const BOOKS = [
  { id:1,  pop:true,  title:"Things Fall Apart",                             author:"Chinua Achebe",                     cat:"Literature",       pages:209,  year:1958, available:true,  color:"#84cc16", searches:97, size:"1.1 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780385474542-M.jpg",  description:"Achebe's landmark novel about Okonkwo and the collision of Igbo tradition with British colonialism in Nigeria. A cornerstone of African literature.",           readUrl:"https://archive.org/details/ThingsFallApart_201707",                                    downloadUrl:"https://archive.org/details/ThingsFallApart_201707" },
  { id:2,  pop:true,  title:"Introduction to Algorithms (CLRS)",             author:"Cormen, Leiserson, Rivest & Stein", cat:"Computer Science", pages:1292, year:2009, available:true,  color:"#4f46e5", searches:95, size:"7.1 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780262033848-M.jpg",  description:"The definitive algorithms textbook used in universities worldwide. Covers sorting, graphs, dynamic programming, data structures and complexity.",           readUrl:"https://archive.org/details/introductiontoa00corm_0",                                   downloadUrl:"https://archive.org/details/introductiontoa00corm_0" },
  { id:3,  pop:true,  title:"Sapiens: A Brief History of Humankind",         author:"Yuval Noah Harari",                 cat:"History",          pages:443,  year:2011, available:true,  color:"#0891b2", searches:94, size:"4.7 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780062316097-M.jpg",  description:"A sweeping narrative of human history from the Stone Age to the 21st century, exploring how Homo sapiens came to dominate Earth.",                         readUrl:"https://archive.org/details/sapiens-a-brief-history-of-humankind-by-yuval-noah-harari",downloadUrl:"https://archive.org/details/sapiens-a-brief-history-of-humankind-by-yuval-noah-harari" },
  { id:4,  pop:true,  title:"Gray's Anatomy",                                author:"Henry Gray",                        cat:"Medicine",         pages:1576, year:2016, available:true,  color:"#10b981", searches:93, size:"15.2 MB",      cover:"https://covers.openlibrary.org/b/isbn/9780702052309-M.jpg",  description:"The world-standard anatomy reference with full-colour detailed illustrations of every system of the human body. Essential for medical students.",            readUrl:"https://archive.org/details/GraysAnatomy41stEdition",                                  downloadUrl:"https://archive.org/details/GraysAnatomy41stEdition" },
  { id:5,  pop:true,  title:"The Feynman Lectures on Physics",               author:"Richard P. Feynman",                cat:"Physics",          pages:1552, year:1963, available:true,  color:"#0ea5e9", searches:91, size:"Free online",  cover:"https://covers.openlibrary.org/b/isbn/9780465023820-M.jpg",  description:"Feynman's legendary three-volume physics lectures, officially released free by Caltech. A masterpiece of physics pedagogy.",                              readUrl:"https://www.feynmanlectures.caltech.edu/",                                              downloadUrl:"https://www.feynmanlectures.caltech.edu/" },
  { id:6,  pop:true,  title:"Rich Dad Poor Dad",                             author:"Robert T. Kiyosaki",                cat:"Business",         pages:336,  year:1997, available:true,  color:"#f97316", searches:91, size:"2.9 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780751532715-M.jpg",  description:"What the rich teach their kids about money that the poor and middle class do not. A worldwide personal finance bestseller.",                              readUrl:"https://archive.org/details/rich-dad-poor-dad_202101",                                 downloadUrl:"https://archive.org/details/rich-dad-poor-dad_202101" },
  { id:7,  pop:true,  title:"SICP — Structure & Interpretation of Programs", author:"Harold Abelson & Gerald Sussman",   cat:"Computer Science", pages:657,  year:1996, available:true,  color:"#6366f1", searches:88, size:"4.2 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780262510875-M.jpg",  description:"The classic MIT programming fundamentals textbook — freely available in full online. One of the greatest CS books ever written.",                         readUrl:"https://web.mit.edu/6.001/6.037/sicp.pdf",                                              downloadUrl:"https://web.mit.edu/6.001/6.037/sicp.pdf" },
  { id:8,  pop:true,  title:"Linear Algebra Done Right",                     author:"Sheldon Axler",                     cat:"Mathematics",      pages:340,  year:2015, available:true,  color:"#6366f1", searches:87, size:"3.3 MB",       cover:"https://covers.openlibrary.org/b/isbn/9783319110806-M.jpg",  description:"A fresh approach to linear algebra emphasising understanding over computation. The official free abridged version is available from the author.",          readUrl:"https://linear.axler.net/LinearAbridged.pdf",                                           downloadUrl:"https://linear.axler.net/LinearAbridged.pdf" },
  { id:9,  pop:true,  title:"Principles of Economics",                       author:"N. Gregory Mankiw",                 cat:"Economics",        pages:880,  year:2020, available:true,  color:"#ef4444", searches:89, size:"9.7 MB",       cover:"https://covers.openlibrary.org/b/isbn/9781305585126-M.jpg",  description:"The world's most popular introductory economics textbook — clear, accessible and comprehensive covering micro and macroeconomics.",                      readUrl:"https://archive.org/details/principles-of-economics-9th",                              downloadUrl:"https://archive.org/details/principles-of-economics-9th" },
  { id:10, pop:true,  title:"A Pattern Language",                            author:"Christopher Alexander",             cat:"Architecture",     pages:1171, year:1977, available:true,  color:"#ec4899", searches:84, size:"10.3 MB",      cover:"https://covers.openlibrary.org/b/isbn/9780195019193-M.jpg",  description:"253 timeless patterns for designing buildings, towns and cities. One of the most influential architecture and design books ever written.",              readUrl:"https://archive.org/details/APatternLanguage",                                         downloadUrl:"https://archive.org/details/APatternLanguage" },
  { id:11, pop:true,  title:"Half of a Yellow Sun",                          author:"Chimamanda Ngozi Adichie",          cat:"Literature",       pages:433,  year:2006, available:true,  color:"#f59e0b", searches:85, size:"2.9 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780007200283-M.jpg",  description:"A gripping novel set during the Nigerian-Biafran War of the 1960s. One of the most celebrated works of contemporary African fiction.",                  readUrl:"https://archive.org/details/half-of-a-yellow-sun-chimamanda",                          downloadUrl:"https://archive.org/details/half-of-a-yellow-sun-chimamanda" },
  { id:12, pop:true,  title:"The Wealth of Nations",                         author:"Adam Smith",                        cat:"Economics",        pages:1264, year:1776, available:true,  color:"#0891b2", searches:64, size:"Public domain", cover:"https://covers.openlibrary.org/b/isbn/9780140432084-M.jpg",  description:"The foundational text of modern economics. Smith's masterwork on markets, division of labour and the nature of wealth. Full text freely available.", readUrl:"https://www.gutenberg.org/files/3300/3300-h/3300-h.htm",                                downloadUrl:"https://www.gutenberg.org/ebooks/3300" },
  { id:13, pop:false, title:"Clean Code",                                     author:"Robert C. Martin",                  cat:"Computer Science", pages:431,  year:2008, available:true,  color:"#0ea5e9", searches:76, size:"3.8 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg",  description:"A handbook of agile software craftsmanship. Teaches practical, real-world skills for writing clean, readable and maintainable code.",                    readUrl:"https://archive.org/details/clean-code-a-handbook-of-agile",                           downloadUrl:"https://archive.org/details/clean-code-a-handbook-of-agile" },
  { id:14, pop:false, title:"Artificial Intelligence: A Modern Approach",     author:"Russell & Norvig",                  cat:"Computer Science", pages:1151, year:2020, available:true,  color:"#0891b2", searches:84, size:"8.9 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780136042594-M.jpg",  description:"The world's leading AI textbook. Covers intelligent agents, search, knowledge representation, machine learning and robotics.",                           readUrl:"https://archive.org/details/artificial-intelligence-a-modern-approach-4th",             downloadUrl:"https://archive.org/details/artificial-intelligence-a-modern-approach-4th" },
  { id:15, pop:false, title:"The Pragmatic Programmer",                       author:"Andrew Hunt & David Thomas",        cat:"Computer Science", pages:352,  year:2019, available:false, color:"#7c3aed", searches:71, size:"3.1 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780135957059-M.jpg",  description:"A guide to the craft of software development with practical, career-defining advice from two industry veterans.",                                        readUrl:"https://archive.org/details/the-pragmatic-programmer-20th",                            downloadUrl:"https://archive.org/details/the-pragmatic-programmer-20th" },
  { id:16, pop:false, title:"Data Structures & Algorithms in Python",         author:"Goodrich, Tamassia & Goldwasser",   cat:"Computer Science", pages:748,  year:2013, available:true,  color:"#84cc16", searches:68, size:"5.8 MB",       cover:"https://covers.openlibrary.org/b/isbn/9781118290279-M.jpg",  description:"Comprehensive treatment of data structures and algorithms using Python. Covers arrays, trees, graphs, sorting and complexity analysis.",                readUrl:"https://archive.org/details/data-structures-algorithms-in-python",                     downloadUrl:"https://archive.org/details/data-structures-algorithms-in-python" },
  { id:17, pop:false, title:"Computer Networks",                              author:"Andrew S. Tanenbaum",               cat:"Computer Science", pages:960,  year:2011, available:true,  color:"#14b8a6", searches:62, size:"8.4 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780132126953-M.jpg",  description:"The classic networking textbook. Covers the full stack from physical layer to application layer with clarity and depth.",                                 readUrl:"https://archive.org/details/computernetworks0000tane_r5o8",                            downloadUrl:"https://archive.org/details/computernetworks0000tane_r5o8" },
  { id:18, pop:false, title:"Design Patterns (Gang of Four)",                 author:"Gamma, Helm, Johnson & Vlissides",  cat:"Computer Science", pages:395,  year:1994, available:true,  color:"#4f46e5", searches:75, size:"3.5 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780201633610-M.jpg",  description:"The seminal text on design patterns in object-oriented software. 23 reusable design patterns essential for any experienced developer.",                 readUrl:"https://archive.org/details/design-patterns-elements-of-reusable-oo",                  downloadUrl:"https://archive.org/details/design-patterns-elements-of-reusable-oo" },
  { id:19, pop:false, title:"Black's Law Dictionary",                         author:"Bryan A. Garner",                   cat:"Law",              pages:1920, year:2019, available:true,  color:"#f59e0b", searches:86, size:"12.4 MB",      cover:"https://covers.openlibrary.org/b/isbn/9781539229759-M.jpg",  description:"The most widely cited law book in the world. Defines over 50,000 legal terms used in courts and legal academia worldwide.",                            readUrl:"https://archive.org/details/blacks-law-dictionary-11th-edition",                       downloadUrl:"https://archive.org/details/blacks-law-dictionary-11th-edition" },
  { id:20, pop:false, title:"Nigerian Constitutional Law",                    author:"B.O. Nwabueze",                     cat:"Law",              pages:520,  year:2010, available:true,  color:"#b45309", searches:67, size:"5.2 MB",       cover:"https://covers.openlibrary.org/b/olid/OL17959353M-M.jpg",    description:"Comprehensive analysis of Nigeria's constitutional framework, legal history and the structure of federal and state governance.",                         readUrl:"https://archive.org/search?query=Nigerian+Constitutional+Law+Nwabueze",                downloadUrl:"https://archive.org/search?query=Nwabueze+Constitutional+Law+Nigeria" },
  { id:21, pop:false, title:"Principles of Criminal Law",                     author:"Glanville Williams",                cat:"Law",              pages:682,  year:2012, available:false, color:"#d97706", searches:55, size:"6.1 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780414022638-M.jpg",  description:"A leading text on criminal law doctrine covering actus reus, mens rea, causation, defences and sentencing principles.",                                  readUrl:"https://archive.org/search?query=Principles+Criminal+Law+Glanville+Williams",         downloadUrl:"https://archive.org/search?query=Criminal+Law+Glanville+Williams" },
  { id:22, pop:false, title:"Thinking, Fast and Slow",                        author:"Daniel Kahneman",                   cat:"Business",         pages:499,  year:2011, available:true,  color:"#8b5cf6", searches:82, size:"4.5 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780374533557-M.jpg",  description:"Nobel laureate Kahneman explores the two systems of thought driving our decisions. A landmark work in behavioural economics and psychology.",            readUrl:"https://archive.org/details/thinking-fast-and-slow-daniel-kahneman",                  downloadUrl:"https://archive.org/details/thinking-fast-and-slow-daniel-kahneman" },
  { id:23, pop:false, title:"Good to Great",                                  author:"Jim Collins",                       cat:"Business",         pages:300,  year:2001, available:true,  color:"#a855f7", searches:74, size:"2.8 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780066620992-M.jpg",  description:"Why some companies make the leap to greatness. Based on 5 years of rigorous research on 1,435 Fortune 500 companies.",                                   readUrl:"https://archive.org/details/good-to-great-jim-collins-2001",                          downloadUrl:"https://archive.org/details/good-to-great-jim-collins-2001" },
  { id:24, pop:false, title:"The Lean Startup",                               author:"Eric Ries",                         cat:"Business",         pages:336,  year:2011, available:true,  color:"#d946ef", searches:69, size:"3.2 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780307887894-M.jpg",  description:"How entrepreneurs use continuous innovation and validated learning to build successful businesses. The defining startup methodology book.",              readUrl:"https://archive.org/details/the-lean-startup-eric-ries-2011",                         downloadUrl:"https://archive.org/details/the-lean-startup-eric-ries-2011" },
  { id:25, pop:false, title:"Principles of Corporate Finance",                author:"Brealey, Myers & Allen",            cat:"Business",         pages:976,  year:2020, available:true,  color:"#8b5cf6", searches:67, size:"8.8 MB",       cover:"https://covers.openlibrary.org/b/isbn/9781260013900-M.jpg",  description:"The standard corporate finance textbook covering capital budgeting, risk and return, financing decisions and working capital management.",             readUrl:"https://archive.org/details/principles-corporate-finance-13th",                        downloadUrl:"https://archive.org/details/principles-corporate-finance-13th" },
  { id:26, pop:false, title:"Engineering Mechanics: Statics",                 author:"Meriam & Kraige",                   cat:"Engineering",      pages:560,  year:2016, available:true,  color:"#14b8a6", searches:63, size:"5.7 MB",       cover:"https://covers.openlibrary.org/b/isbn/9781118919736-M.jpg",  description:"The classic statics textbook used in engineering programs globally. Covers equilibrium, force systems and structural analysis.",                        readUrl:"https://archive.org/details/engineering-mechanics-statics-meriam",                    downloadUrl:"https://archive.org/details/engineering-mechanics-statics-meriam" },
  { id:27, pop:false, title:"Fundamentals of Electric Circuits",              author:"Alexander & Sadiku",                cat:"Engineering",      pages:880,  year:2017, available:false, color:"#0d9488", searches:58, size:"8.2 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780078028229-M.jpg",  description:"Clear, comprehensive introduction to circuit analysis. Covers DC/AC circuits, phasors, Laplace transforms and two-port networks.",                     readUrl:"https://archive.org/details/fundamentals-electric-circuits-alexander",                downloadUrl:"https://archive.org/details/fundamentals-electric-circuits-alexander" },
  { id:28, pop:false, title:"Mechanics of Materials",                         author:"Beer, Johnston & DeWolf",           cat:"Engineering",      pages:896,  year:2019, available:true,  color:"#06b6d4", searches:61, size:"9.1 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780073398235-M.jpg",  description:"Core textbook for understanding stress, strain, torsion, bending and deflection in engineering structures.",                                           readUrl:"https://archive.org/details/mechanics-of-materials-beer-johnston-7th",                downloadUrl:"https://archive.org/details/mechanics-of-materials-beer-johnston-7th" },
  { id:29, pop:false, title:"Fluid Mechanics",                                author:"Frank M. White",                    cat:"Engineering",      pages:794,  year:2021, available:true,  color:"#0ea5e9", searches:54, size:"6.7 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780073398273-M.jpg",  description:"Comprehensive treatment of fluid mechanics covering viscous flow, boundary layers, turbulence and compressible flow.",                                  readUrl:"https://archive.org/details/fluid-mechanics-frank-white-8th",                         downloadUrl:"https://archive.org/details/fluid-mechanics-frank-white-8th" },
  { id:30, pop:false, title:"Harrison's Principles of Internal Medicine",     author:"Jameson, Fauci et al.",             cat:"Medicine",         pages:3983, year:2018, available:true,  color:"#059669", searches:86, size:"28.4 MB",      cover:"https://covers.openlibrary.org/b/isbn/9781259644030-M.jpg",  description:"The gold-standard internal medicine reference used by physicians worldwide. Comprehensive coverage of all diseases and clinical management.",         readUrl:"https://archive.org/details/harrisons-principles-of-internal-medicine-20",            downloadUrl:"https://archive.org/details/harrisons-principles-of-internal-medicine-20" },
  { id:31, pop:false, title:"Robbins & Cotran Pathologic Basis of Disease",   author:"Kumar, Abbas & Aster",              cat:"Medicine",         pages:1392, year:2020, available:false, color:"#f43f5e", searches:79, size:"18.7 MB",      cover:"https://covers.openlibrary.org/b/isbn/9780323531139-M.jpg",  description:"The world's most widely used pathology textbook covering the mechanisms behind all major disease categories.",                                         readUrl:"https://archive.org/details/robbins-cotran-pathologic-basis-9th",                     downloadUrl:"https://archive.org/details/robbins-cotran-pathologic-basis-9th" },
  { id:32, pop:false, title:"Pharmacology: An Introduction",                  author:"Hitner & Nagle",                    cat:"Medicine",         pages:608,  year:2020, available:true,  color:"#be185d", searches:50, size:"4.8 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780073513775-M.jpg",  description:"Clear introduction to pharmacological principles, drug classifications, mechanisms of action and clinical applications for students.",                 readUrl:"https://archive.org/details/pharmacology-an-introduction-hitner",                     downloadUrl:"https://archive.org/details/pharmacology-an-introduction-hitner" },
  { id:33, pop:false, title:"Calculus: Early Transcendentals",                author:"James Stewart",                     cat:"Mathematics",      pages:1368, year:2015, available:true,  color:"#7c3aed", searches:93, size:"11.2 MB",      cover:"https://covers.openlibrary.org/b/isbn/9781285741550-M.jpg",  description:"The world's most popular calculus textbook. Combines rigorous theory with real-world applications. Covers single and multivariable calculus.",         readUrl:"https://archive.org/details/calculus-early-transcendentals-stewart-8th",              downloadUrl:"https://archive.org/details/calculus-early-transcendentals-stewart-8th" },
  { id:34, pop:false, title:"Discrete Mathematics and Its Applications",      author:"Kenneth Rosen",                     cat:"Mathematics",      pages:909,  year:2018, available:true,  color:"#10b981", searches:62, size:"7.5 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780073383095-M.jpg",  description:"Comprehensive guide to discrete math covering logic, sets, number theory, graphs, trees and combinatorics for CS students.",                          readUrl:"https://archive.org/details/discrete-mathematics-and-its-applications-rosen",         downloadUrl:"https://archive.org/details/discrete-mathematics-and-its-applications-rosen" },
  { id:35, pop:false, title:"Probability and Statistics",                     author:"DeGroot & Schervish",               cat:"Mathematics",      pages:892,  year:2012, available:false, color:"#4f46e5", searches:55, size:"8.8 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780321500465-M.jpg",  description:"Comprehensive probability theory and statistical inference for undergraduates covering distributions, estimation and hypothesis testing.",               readUrl:"https://archive.org/details/probability-statistics-degroot-schervish",                downloadUrl:"https://archive.org/details/probability-statistics-degroot-schervish" },
  { id:36, pop:false, title:"University Physics",                             author:"Young & Freedman",                  cat:"Physics",          pages:1598, year:2019, available:true,  color:"#0d9488", searches:75, size:"13.4 MB",      cover:"https://covers.openlibrary.org/b/isbn/9780133969290-M.jpg",  description:"The leading calculus-based physics text for science and engineering students. Covers mechanics, E&M, thermodynamics and modern physics.",             readUrl:"https://archive.org/details/university-physics-young-freedman-14th",                  downloadUrl:"https://archive.org/details/university-physics-young-freedman-14th" },
  { id:37, pop:false, title:"Concepts of Modern Physics",                     author:"Arthur Beiser",                     cat:"Physics",          pages:544,  year:2002, available:true,  color:"#6366f1", searches:58, size:"5.2 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780072448481-M.jpg",  description:"Accessible introduction to quantum mechanics, relativity, atomic and nuclear physics for undergraduate students.",                                     readUrl:"https://archive.org/details/concepts-of-modern-physics-beiser-6th",                   downloadUrl:"https://archive.org/details/concepts-of-modern-physics-beiser-6th" },
  { id:38, pop:false, title:"Freakonomics",                                   author:"Steven Levitt & Stephen Dubner",    cat:"Economics",        pages:315,  year:2005, available:true,  color:"#dc2626", searches:72, size:"2.6 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780061234002-M.jpg",  description:"A rogue economist explores the hidden side of everything, revealing surprising and counterintuitive truths about incentives and human behaviour.",     readUrl:"https://archive.org/details/freakonomics-revised-and-expanded-edition",               downloadUrl:"https://archive.org/details/freakonomics-revised-and-expanded-edition" },
  { id:39, pop:false, title:"The General Theory of Employment",               author:"John Maynard Keynes",               cat:"Economics",        pages:384,  year:1936, available:true,  color:"#0891b2", searches:55, size:"Public domain", cover:"https://covers.openlibrary.org/b/isbn/9781573921398-M.jpg",  description:"Keynes's revolutionary work that transformed macroeconomics and laid the foundation for modern fiscal policy and employment theory.",                  readUrl:"https://www.gutenberg.org/ebooks/32218",                                               downloadUrl:"https://www.gutenberg.org/ebooks/32218" },
  { id:40, pop:false, title:"Arrow of God",                                   author:"Chinua Achebe",                     cat:"Literature",       pages:286,  year:1964, available:true,  color:"#65a30d", searches:61, size:"1.8 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780385014809-M.jpg",  description:"Set in the 1920s, this novel depicts the collision of Igbo society and tradition with British colonial administration in Eastern Nigeria.",            readUrl:"https://archive.org/details/arrow-of-god-achebe-1964",                                downloadUrl:"https://archive.org/details/arrow-of-god-achebe-1964" },
  { id:41, pop:false, title:"Purple Hibiscus",                                author:"Chimamanda Ngozi Adichie",          cat:"Literature",       pages:307,  year:2003, available:true,  color:"#a855f7", searches:68, size:"2.2 MB",       cover:"https://covers.openlibrary.org/b/isbn/9781616202415-M.jpg",  description:"Adichie's debut novel about a privileged Nigerian girl whose sheltered life begins to crack. Winner of the Commonwealth Writers' Prize.",              readUrl:"https://archive.org/details/purple-hibiscus-chimamanda",                               downloadUrl:"https://archive.org/details/purple-hibiscus-chimamanda" },
  { id:42, pop:false, title:"Pride and Prejudice",                            author:"Jane Austen",                       cat:"Literature",       pages:432,  year:1813, available:true,  color:"#ec4899", searches:73, size:"Public domain", cover:"https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg",  description:"Austen's beloved novel of manners, marriage and social class. Full text freely available from Project Gutenberg. A timeless classic.",             readUrl:"https://www.gutenberg.org/files/1342/1342-h/1342-h.htm",                               downloadUrl:"https://www.gutenberg.org/ebooks/1342" },
  { id:43, pop:false, title:"Crime and Punishment",                           author:"Fyodor Dostoevsky",                 cat:"Literature",       pages:551,  year:1866, available:true,  color:"#6366f1", searches:69, size:"Public domain", cover:"https://covers.openlibrary.org/b/isbn/9780140449136-M.jpg",  description:"Dostoevsky's psychological masterpiece exploring a young man's crime and his mental and moral torment. Full public domain text.",                     readUrl:"https://www.gutenberg.org/files/2554/2554-h/2554-h.htm",                               downloadUrl:"https://www.gutenberg.org/ebooks/2554" },
  { id:44, pop:false, title:"A History of West Africa",                       author:"Basil Davidson",                    cat:"History",          pages:336,  year:1977, available:true,  color:"#b45309", searches:52, size:"3.1 MB",       cover:"https://covers.openlibrary.org/b/olid/OL5720682M-M.jpg",     description:"A landmark account of West African history from early civilisations and empires through the slave trade to the era of national independence.",         readUrl:"https://archive.org/details/historyofwestafrica00davi",                                downloadUrl:"https://archive.org/details/historyofwestafrica00davi" },
  { id:45, pop:false, title:"The Origin of Species",                          author:"Charles Darwin",                    cat:"History",          pages:502,  year:1859, available:true,  color:"#65a30d", searches:66, size:"Public domain", cover:"https://covers.openlibrary.org/b/isbn/9780140432053-M.jpg",  description:"Darwin's groundbreaking work on evolution by natural selection. One of the most influential books in scientific history. Full public domain text.", readUrl:"https://www.gutenberg.org/files/1228/1228-h/1228-h.htm",                               downloadUrl:"https://www.gutenberg.org/ebooks/1228" },
  { id:46, pop:false, title:"Towards a New Architecture",                     author:"Le Corbusier",                      cat:"Architecture",     pages:320,  year:1923, available:true,  color:"#6366f1", searches:42, size:"2.9 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780486250235-M.jpg",  description:"Le Corbusier's manifesto for modern architecture, arguing for pure rational design drawing on engineering and classical principles.",                 readUrl:"https://archive.org/details/towardsnewarchi00corb",                                    downloadUrl:"https://archive.org/details/towardsnewarchi00corb" },
  { id:47, pop:false, title:"The Architecture of Happiness",                  author:"Alain de Botton",                   cat:"Architecture",     pages:280,  year:2006, available:true,  color:"#db2777", searches:48, size:"3.8 MB",       cover:"https://covers.openlibrary.org/b/isbn/9780375424434-M.jpg",  description:"An exploration of the relationship between architecture and psychological wellbeing — why buildings and spaces matter for how we feel.",              readUrl:"https://archive.org/details/architecture-of-happiness-alain",                          downloadUrl:"https://archive.org/details/architecture-of-happiness-alain" },
  { id:48, pop:false, title:"Introduction to Sociology",                      author:"Anthony Giddens",                   cat:"Social Sciences",  pages:1120, year:2021, available:true,  color:"#a855f7", searches:43, size:"9.0 MB",       cover:"https://covers.openlibrary.org/b/isbn/9781509542222-M.jpg",  description:"Comprehensive and accessible introduction to sociology covering culture, stratification, gender, globalisation and collective action.",              readUrl:"https://archive.org/details/introduction-to-sociology-giddens-9th",                   downloadUrl:"https://archive.org/details/introduction-to-sociology-giddens-9th" },
  { id:49, pop:false, title:"The Republic",                                   author:"Plato",                             cat:"Social Sciences",  pages:416,  year:-380, available:true,  color:"#0891b2", searches:57, size:"Public domain", cover:"https://covers.openlibrary.org/b/isbn/9780140455113-M.jpg",  description:"Plato's masterwork on justice, the ideal state and the philosopher-king. One of the most influential texts in Western philosophy. Public domain.", readUrl:"https://www.gutenberg.org/files/1497/1497-h/1497-h.htm",                               downloadUrl:"https://www.gutenberg.org/ebooks/1497" },
  { id:50, pop:false, title:"Harrison's Manual of Medicine",                  author:"Longo, Fauci et al.",               cat:"Medicine",         pages:1200, year:2019, available:true,  color:"#14b8a6", searches:65, size:"9.4 MB",       cover:"https://covers.openlibrary.org/b/isbn/9781259835940-M.jpg",  description:"The portable companion to Harrison's Principles — concise diagnosis and treatment for internal medicine, ideal for clinical use.",                    readUrl:"https://archive.org/details/harrisons-manual-medicine-20th",                          downloadUrl:"https://archive.org/details/harrisons-manual-medicine-20th" },
];

// ── Cover image with colour fallback ─────────────────────────────────────────
function BookCover({ book, height = 115 }) {
  const [failed, setFailed] = useState(false);
  if (book.cover && !failed) {
    return (
      <img src={book.cover} alt={book.title} onError={() => setFailed(true)}
        style={{ width:"100%", height, objectFit:"cover", display:"block" }} loading="lazy"/>
    );
  }
  return (
    <div style={{ height, background:`linear-gradient(135deg,${book.color}22,${book.color}55)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <BookOpen size={36} color={book.color}/>
    </div>
  );
}

function Toast({ msg }) {
  return (
    <div style={{ position:"fixed", top:24, right:24, zIndex:9999, background:"#fff", border:"1px solid #ede9e4", borderRadius:12, padding:"12px 18px", fontSize:13.5, fontWeight:500, display:"flex", alignItems:"center", gap:9, boxShadow:"0 8px 30px rgba(0,0,0,.10)", animation:"fadeUp .25s ease both", color:"#1a1a1a" }}>
      <Check size={15} color="#4caf50"/> {msg}
    </div>
  );
}

// ── Detail view (separate component so hooks are always called) ───────────────
function BookDetail({ book, onBack, onRead, onDownload }) {
  const [coverFailed, setCoverFailed] = useState(false);
  return (
    <div className="page-enter">
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:6, color:"#1a1a1a", fontWeight:600, fontSize:13.5, background:"none", border:"none", cursor:"pointer", marginBottom:22, fontFamily:"'DM Sans',sans-serif" }}>
        <ArrowLeft size={15}/> Back to Library
      </button>
      <div className="panel" style={{ padding:30 }}>
        <div style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
          <div style={{ width:140, height:200, borderRadius:14, overflow:"hidden", flexShrink:0, boxShadow:`0 16px 40px ${book.color}33` }}>
            {book.cover && !coverFailed
              ? <img src={book.cover} alt={book.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={() => setCoverFailed(true)}/>
              : <div style={{ width:"100%", height:"100%", background:`linear-gradient(135deg,${book.color},${book.color}88)`, display:"flex", alignItems:"center", justifyContent:"center" }}><BookOpen size={48} color="#fff"/></div>
            }
          </div>
          <div style={{ flex:1, minWidth:220 }}>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, fontWeight:400, color:"#1a1a1a", lineHeight:1.3 }}>{book.title}</h2>
            <p style={{ color:book.color, fontWeight:700, marginTop:7, fontSize:14.5 }}>{book.author}</p>
            <div style={{ display:"flex", gap:9, marginTop:12, flexWrap:"wrap" }}>
              <span style={{ background:book.color+"18", color:book.color, padding:"3px 11px", borderRadius:99, fontSize:12, fontWeight:600 }}>{book.cat}</span>
              <span style={{ padding:"3px 11px", borderRadius:99, fontSize:12, fontWeight:600, background:book.available?"#e8f5e9":"#fce4ec", color:book.available?"#2e7d32":"#c62828" }}>
                {book.available ? "Available" : "Borrowed"}
              </span>
            </div>
            <p style={{ fontSize:13.5, color:"#7a7169", lineHeight:1.75, marginTop:14 }}>{book.description}</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:18 }}>
              {[["Pages", book.pages], ["Year", book.year < 0 ? `${Math.abs(book.year)} BC` : book.year], ["File Size", book.size]].map(([k,v]) => (
                <div key={k} style={{ background:"#faf8f5", borderRadius:11, padding:13, border:"1px solid #f0ede9" }}>
                  <p style={{ fontSize:10.5, color:"#b0a89e", fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>{k}</p>
                  <p style={{ fontSize:15, fontWeight:700, color:"#1a1a1a", marginTop:4 }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:11, marginTop:22, flexWrap:"wrap" }}>
              <button className="btn-dark" onClick={() => onRead(book)}>
                <Eye size={15}/> Read Online <ExternalLink size={13}/>
              </button>
              {book.available && (
                <button className="btn-ghost" onClick={() => onDownload(book)}>
                  <Download size={15}/> Download / Access PDF
                </button>
              )}
            </div>
            <p style={{ fontSize:11.5, color:"#b0a89e", marginTop:10 }}>
              Opens Archive.org · Project Gutenberg · MIT · Caltech — all free and legal. On Archive.org pages, click the <strong>PDF</strong> format in the download panel on the right.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Library() {
  const [books,    setBooks]    = useState(BOOKS);
  const [search,   setSearch]   = useState("");
  const [cat,      setCat]      = useState("All");
  const [avail,    setAvail]    = useState("All");
  const [selected, setSelected] = useState(null);
  const [toast,    setToast]    = useState("");
  const [showAdd,  setShowAdd]  = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [newBook,  setNewBook]  = useState({ title:"", author:"", cat:"Computer Science", pages:"", year:new Date().getFullYear(), readUrl:"", downloadUrl:"", available:true });
  const [addErr,   setAddErr]   = useState("");

  const fire = msg => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const isSearching = search.trim() !== "" || cat !== "All" || avail !== "All";

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const base = isSearching
      ? books.filter(b =>
          (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.cat.toLowerCase().includes(q)) &&
          (cat === "All" || b.cat === cat) &&
          (avail === "All" || (avail === "Available" ? b.available : !b.available))
        )
      : books.filter(b => b.pop);
    return [...base].sort((a, b) => b.searches - a.searches);
  }, [books, search, cat, avail, isSearching]);

  const handleAdd = () => {
    if (!newBook.title.trim())  { setAddErr("Title is required.");  return; }
    if (!newBook.author.trim()) { setAddErr("Author is required."); return; }
    const b = { ...newBook, id:Date.now(), pop:false, searches:0, color:PALETTE[books.length % PALETTE.length], cover:null, pages:parseInt(newBook.pages)||0, size:"—", description:`${newBook.title} by ${newBook.author}.`, downloadUrl:newBook.downloadUrl||newBook.readUrl };
    setBooks(prev => [b, ...prev]);
    setNewBook({ title:"", author:"", cat:"Computer Science", pages:"", year:new Date().getFullYear(), readUrl:"", downloadUrl:"", available:true });
    setShowAdd(false); setAddErr(""); fire(`"${b.title}" added to library`);
  };

  const removeBook = id => {
    const b = books.find(x => x.id === id);
    setBooks(prev => prev.filter(x => x.id !== id));
    setDeleteId(null);
    if (selected?.id === id) setSelected(null);
    fire(`"${b?.title}" removed`);
  };

  const handleRead     = b => { window.open(b.readUrl,     "_blank", "noopener,noreferrer"); fire(`Opening "${b.title}"…`); };
  const handleDownload = b => { window.open(b.downloadUrl, "_blank", "noopener,noreferrer"); fire(`Opening download page for "${b.title}"…`); };

  // ── Detail view ──────────────────────────────────────────────────────────
  if (selected) {
    return (
      <>
        {toast && <Toast msg={toast}/>}
        <BookDetail book={selected} onBack={() => setSelected(null)} onRead={handleRead} onDownload={handleDownload}/>
      </>
    );
  }

  // ── Main grid ─────────────────────────────────────────────────────────────
  return (
    <div className="page-enter" style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {toast && <Toast msg={toast}/>}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,.4)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:"#fff", borderRadius:18, padding:28, maxWidth:380, width:"100%", boxShadow:"0 24px 60px rgba(0,0,0,.18)" }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"#fce4ec", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}><Trash2 size={20} color="#c62828"/></div>
            <h3 style={{ fontSize:17, fontWeight:700, color:"#1a1a1a", marginBottom:6 }}>Remove Book?</h3>
            <p style={{ fontSize:13.5, color:"#7a7169", lineHeight:1.6, marginBottom:20 }}>This will remove <strong>{books.find(b=>b.id===deleteId)?.title}</strong> from the library.</p>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-dark" style={{ background:"#c62828" }} onClick={() => removeBook(deleteId)}><Trash2 size={14}/> Remove</button>
              <button className="btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Book modal */}
      {showAdd && (
        <div style={{ position:"fixed", inset:0, zIndex:9998, background:"rgba(0,0,0,.4)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:"#fff", borderRadius:20, padding:30, maxWidth:520, width:"100%", boxShadow:"0 24px 60px rgba(0,0,0,.18)", maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
              <h3 style={{ fontSize:18, fontWeight:700, color:"#1a1a1a" }}>Add Book to Library</h3>
              <button onClick={() => { setShowAdd(false); setAddErr(""); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#b0a89e" }}><X size={20}/></button>
            </div>
            {addErr && <div style={{ background:"#fce4ec", border:"1px solid #f8bbd0", borderRadius:10, padding:"9px 13px", marginBottom:14, color:"#c62828", fontSize:13, display:"flex", alignItems:"center", gap:8 }}><AlertCircle size={14}/>{addErr}</div>}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
              {[["Title","title","text","span 2",true],["Author","author","text","span 2",true],["Pages","pages","number","span 1",false],["Year","year","number","span 1",false]].map(([l,k,t,col,req]) => (
                <div key={k} style={{ gridColumn:col }}>
                  <label style={{ fontSize:11, fontWeight:700, color:"#b0a89e", textTransform:"uppercase", letterSpacing:.6, display:"block", marginBottom:5 }}>{l}{req?" *":""}</label>
                  <input type={t} value={newBook[k]} onChange={e => setNewBook(p=>({...p,[k]:e.target.value}))} className="field-input" placeholder={req?"Required":""}/>
                </div>
              ))}
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:"#b0a89e", textTransform:"uppercase", letterSpacing:.6, display:"block", marginBottom:5 }}>Category</label>
                <select className="field-select" value={newBook.cat} onChange={e => setNewBook(p=>({...p,cat:e.target.value}))} style={{ width:"100%" }}>
                  {CATS.filter(c=>c!=="All").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:"#b0a89e", textTransform:"uppercase", letterSpacing:.6, display:"block", marginBottom:5 }}>Status</label>
                <select className="field-select" value={newBook.available?"Available":"Borrowed"} onChange={e => setNewBook(p=>({...p,available:e.target.value==="Available"}))} style={{ width:"100%" }}>
                  <option>Available</option><option>Borrowed</option>
                </select>
              </div>
              <div style={{ gridColumn:"span 2" }}>
                <label style={{ fontSize:11, fontWeight:700, color:"#b0a89e", textTransform:"uppercase", letterSpacing:.6, display:"block", marginBottom:5 }}>Read / PDF URL</label>
                <input type="url" value={newBook.readUrl} onChange={e => setNewBook(p=>({...p,readUrl:e.target.value,downloadUrl:e.target.value}))} className="field-input" placeholder="https://archive.org/details/… or any direct link"/>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:22 }}>
              <button className="btn-dark" onClick={handleAdd}><Plus size={15}/> Add Book</button>
              <button className="btn-ghost" onClick={() => { setShowAdd(false); setAddErr(""); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, fontWeight:400, color:"#1a1a1a" }}>Library</h1>
          <p style={{ color:"#b0a89e", fontSize:13.5, marginTop:3 }}>
            {books.length} books · {books.filter(b=>b.available).length} available
            {!isSearching && <span> · search or filter to explore all {books.length} books</span>}
          </p>
        </div>
        <button className="btn-dark" onClick={() => setShowAdd(true)}><Plus size={15}/> Add Book</button>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <div className="search-wrap" style={{ flex:1, minWidth:200 }}>
          <Search size={15}/>
          <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search all ${books.length} books — title, author or subject…`}/>
        </div>
        <select className="field-select" value={cat}   onChange={e => setCat(e.target.value)}>{CATS.map(c => <option key={c}>{c}</option>)}</select>
        <select className="field-select" value={avail} onChange={e => setAvail(e.target.value)}>{["All","Available","Borrowed"].map(a => <option key={a}>{a}</option>)}</select>
        {isSearching && (
          <button className="btn-ghost" onClick={() => { setSearch(""); setCat("All"); setAvail("All"); }}>
            <X size={13}/> Clear
          </button>
        )}
      </div>

      {/* Label */}
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {isSearching
          ? <><Sparkles size={14} color="#b0a89e"/><span style={{ fontSize:13, color:"#b0a89e", fontWeight:600 }}>{filtered.length} result{filtered.length!==1?"s":""} across all {books.length} books</span></>
          : <><TrendingUp size={14} color="#b0a89e"/><span style={{ fontSize:13, color:"#b0a89e", fontWeight:600 }}>Showing most popular — search or filter to explore all {books.length} books</span></>
        }
      </div>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:14 }}>
        {filtered.map((b, i) => (
          <div key={b.id} className="panel"
            onClick={() => setSelected(b)}
            style={{ cursor:"pointer", transition:"transform .18s,box-shadow .18s", animation:"fadeUp .22s ease both", animationDelay:`${Math.min(i,8)*.03}s`, overflow:"hidden", position:"relative", display:"flex", flexDirection:"column" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 10px 30px rgba(0,0,0,.10)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>

            <button onClick={e => { e.stopPropagation(); setDeleteId(b.id); }}
              style={{ position:"absolute", top:7, right:7, zIndex:2, background:"rgba(255,255,255,.9)", border:"none", borderRadius:6, padding:4, cursor:"pointer", color:"#ccc", display:"flex", transition:"color .15s" }}
              onMouseEnter={e => e.currentTarget.style.color="#c62828"}
              onMouseLeave={e => e.currentTarget.style.color="#ccc"}>
              <Trash2 size={12}/>
            </button>

            <div style={{ height:140, overflow:"hidden", flexShrink:0, position:"relative" }}>
              <BookCover book={b} height={140}/>
              {!b.available && <div style={{ position:"absolute", top:7, left:7, background:"rgba(198,40,40,.9)", color:"#fff", fontSize:9.5, fontWeight:700, padding:"2px 8px", borderRadius:99 }}>OUT</div>}
            </div>

            <div style={{ padding:"12px 12px 13px", flex:1, display:"flex", flexDirection:"column" }}>
              <h4 style={{ fontWeight:600, fontSize:12.5, color:"#1a1a1a", lineHeight:1.4, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{b.title}</h4>
              <p style={{ fontSize:11.5, color:"#b0a89e", marginTop:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{b.author.split(",")[0]}</p>
              <span style={{ display:"inline-block", marginTop:6, background:b.color+"18", color:b.color, padding:"2px 8px", borderRadius:99, fontSize:10.5, fontWeight:600 }}>{b.cat}</span>
              <div style={{ display:"flex", gap:7, marginTop:"auto", paddingTop:10 }}>
                <button onClick={e => { e.stopPropagation(); handleRead(b); }}
                  style={{ flex:1, background:"#1a1a1a", color:"#fff", border:"none", borderRadius:7, padding:"6px 0", fontSize:11, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontFamily:"'DM Sans',sans-serif" }}>
                  <Eye size={11}/> Read
                </button>
                {b.available && (
                  <button onClick={e => { e.stopPropagation(); handleDownload(b); }}
                    style={{ flex:1, background:"#f0ede9", color:"#1a1a1a", border:"none", borderRadius:7, padding:"6px 0", fontSize:11, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontFamily:"'DM Sans',sans-serif" }}>
                    <Download size={11}/> Save
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!filtered.length && (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#b0a89e" }}>
          <BookOpen size={38} style={{ margin:"0 auto 12px", display:"block" }}/>
          <p style={{ fontWeight:600, color:"#7a7169", fontSize:15 }}>No books found</p>
          <p style={{ fontSize:13, marginTop:5 }}>Try different keywords, or <button onClick={() => setShowAdd(true)} style={{ background:"none", border:"none", color:"#1a1a1a", fontWeight:600, cursor:"pointer", textDecoration:"underline", fontFamily:"'DM Sans',sans-serif" }}>add a new book</button></p>
        </div>
      )}
    </div>
  );
}