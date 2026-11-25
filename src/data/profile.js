// Single source of truth for site content. Update this file instead of
// hunting through components when something on the resume changes.

export const profile = {
  name: "Alejandro Lopez",
  firstName: "Alejandro",
  lastName: "Lopez",
  kicker: "Computer Science · Cal State LA",
  tagline: "I like CS and Bio :)",
  aboutShort:
    "CS student at Cal State LA with a minor in Biomedical Engineering. I like data, machine learning, and building things people can actually use.",
  location: "Los Angeles",
  gradYear: "Class of 2027",
  school: "Cal State LA",
  email: "alelopez929@outlook.com",
  github: "https://github.com/alexghyet",
  linkedin: "https://linkedin.com/in/alejandro-lopez-csula",
  resume: "/resume.pdf",
  repo: "https://github.com/alexghyet/alexghyet.github.io",
};

export const now = [
  { role: "President", org: "ACM @ Cal State LA" },
  { role: "Undergrad researcher", org: "PepSpace (CAHSI)" },
  { role: "Computer vision team", org: "RoboSub capstone" },
  { role: "Project lead", org: "Rehab Rhapsody (BMES)" },
];

export const education = [
  {
    school: "California State University, Los Angeles",
    degree: "B.S. Computer Science",
    detail: "Minor in Biomedical Engineering",
    date: "Expected May 2027",
  },
  {
    school: "Cerritos College",
    degree: "A.S. Natural Sciences",
    detail: "",
    date: "May 2025",
  },
];

export const research = {
  title: "PepSpace",
  role: "CAHSI Undergraduate Researcher",
  org: "California State University, Los Angeles",
  dates: "Dec 2025 – Apr 2026 · Nov 2026 – Present",
  summary:
    "An interactive explorer for antimicrobial peptide embeddings. PepSpace squeezes 1,280-dimensional protein-language-model vectors down to 2D and 3D so researchers can see which peptides live near each other.",
  bullets: [
    "Built a Python pipeline to explore 3,556 peptide sequences, each represented by a 1,280-dimensional embedding, comparing antimicrobial and non-antimicrobial peptides.",
    "Developed linked 2D and 3D views in Streamlit and Plotly so researchers can select peptides and inspect their neighbors across projections, with cached projections for repeat analysis.",
    "Tuned UMAP parameters with Optuna, reaching a trustworthiness score of about 0.84 on the original embeddings.",
    "Presented a research poster at the 2026 GMiS Conference on visualizing antimicrobial peptide embeddings with PepSpace.",
  ],
  pitch: "Making 1,280-dimensional peptide embeddings explorable with UMAP and linked 2D/3D views.",
  stats: [
    { value: 3556, label: "peptide sequences", short: "sequences" },
    { value: 1280, label: "dimensions per embedding", short: "dimensions" },
    { value: 0.84, decimals: 2, prefix: "≈", label: "UMAP trustworthiness", short: "trustworthiness" },
  ],
  tags: ["Python", "Streamlit", "Plotly", "UMAP", "Optuna", "NumPy"],
  writeup: "/blog/umap-peptides",
  poster: "/PepFinal.pdf",
};

export const publication = {
  authors: ["Morgan-Harper, D. L.", "Lopez, A.", "Copeland, J.", "Beltran, J. A."],
  me: "Lopez, A.",
  year: 2026,
  title:
    "Antimicrobial peptide classification using peptide language model embeddings and positive-unlabeled learning",
  venue: "2026 IEEE International Conference on Bioinformatics and Biomedicine (BIBM)",
  venueShort: "IEEE BIBM 2026",
  status: "Accepted workshop paper",
  apa: "Morgan-Harper, D. L., Lopez, A., Copeland, J., & Beltran, J. A. (2026). Antimicrobial peptide classification using peptide language model embeddings and positive-unlabeled learning. Accepted workshop paper, 2026 IEEE International Conference on Bioinformatics and Biomedicine (BIBM).",
};

// `links` is optional on every project. Add repo or demo URLs as they go public.
export const projects = [
  {
    id: "rehab",
    visual: "rhythm",
    title: "Rehab Rhapsody",
    short: "BMES lead",
    role: "BMES Project Lead",
    date: "2026 – Present",
    blurb:
      "A rhythm game for post-stroke arm exercises. Players trigger musical notes by moving a motion-sensing baton through guided arm movements.",
    bullets: [
      "Integrated a Seeed XIAO nRF52840 Sense baton with a Flutter game over Bluetooth Low Energy.",
      "Lead a multidisciplinary team, refined 3 play modes, and documented setup for the web demo and iOS builds.",
    ],
    tags: ["Flutter", "Dart", "Bluetooth LE", "nRF52840"],
    hint: "sweep across · click to play a note",
  },
  {
    id: "stemtective",
    visual: "lens",
    title: "STEMtective",
    short: "LA Hacks '26",
    role: "Hackathon build",
    date: "LA Hacks 2026",
    blurb:
      "A detective-themed learning game built in roughly 14 hours, with cases across 3 subjects and 3 difficulty levels.",
    bullets: [
      "Gemini generates questions from player-chosen topics and KaTeX renders the math.",
      "Firebase Authentication and Firestore save player progress.",
    ],
    tags: ["React", "TypeScript", "Gemini", "Firebase", "KaTeX"],
    hint: "hover to investigate",
  },
  {
    id: "robosub",
    visual: "sonar",
    title: "RoboSub",
    short: "CV team",
    role: "Computer Vision Team · Senior Capstone",
    date: "Fall 2026 – Present",
    blurb:
      "Member of the computer vision subteam for an autonomous underwater vehicle, built as a yearlong senior capstone.",
    bullets: [
      "Working on camera and onboard inference requirements for detecting underwater navigation targets on an NVIDIA Jetson Nano.",
    ],
    tags: ["Python", "OpenCV", "Jetson Nano"],
    hint: "hover to track a target",
  },
  {
    id: "site",
    visual: "site",
    title: "This website",
    short: "React",
    role: "Design + build",
    date: "2026",
    blurb:
      "The page you're on: a bento-grid portfolio with a live embedding-space demo and hand-built canvas visuals, made with React and Vite.",
    bullets: [],
    tags: ["React", "Vite", "Canvas 2D"],
    links: [{ label: "Source", href: "https://github.com/alexghyet/alexghyet.github.io" }],
    hint: "you are here",
  },
];

export const leadership = {
  role: "President",
  org: "Association for Computing Machinery",
  school: "Cal State LA chapter",
  dates: "Dec 2025 – Present",
  cabinet: 18,
  bullets: [
    "Oversee chapter operations and lead an 18-member executive cabinet planning technical workshops and outreach events.",
    "Track chapter spending and review event proposals and budgets with the treasurer.",
    "Organized a chapter hackathon in Fall 2025 and recruited participants from multiple community colleges.",
  ],
};

export const skills = [
  { lane: "Languages", items: ["Python", "Java", "C", "SQL", "Kotlin", "TypeScript", "Dart"] },
  { lane: "ML & Data", items: ["pandas", "NumPy", "scikit-learn", "UMAP", "Optuna", "Plotly", "OpenCV"] },
  { lane: "Dev Tools", items: ["Git", "GitHub", "Streamlit", "Docker", "Android Studio", "Firebase", "Flutter"] },
];

export const coursework = [
  "Analysis of Algorithms",
  "Operating Systems",
  "Software Engineering",
  "Automata Theory",
  "Intro to Biomedical Engineering",
  "Artificial Intelligence",
  "Data Science",
  "Relational Databases",
];

export const sections = [
  { id: "about", label: "about" },
  { id: "research", label: "research" },
  { id: "projects", label: "projects" },
  { id: "leadership", label: "leadership" },
  { id: "skills", label: "skills" },
  { id: "blog", label: "blog" },
  { id: "contact", label: "contact" },
];
