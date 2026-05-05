// resources.js
// Source of truth for all Square-1 resources and folder structure.
//
// NODE  = object  (has label, description metadata; optionally gridLayout: true)
// LEAF  = array   (list of resource objects)
//
// Resource object shape:
//   {
//     title:       string,
//     url:         string,
//     type:        "doc/sheet" | "video" | "trainer" | "image" | "website",
//     description: string,
//     section:     "learn" | "train"   (ignored for gridLayout nodes)
//   }
//
// gridLayout: true on a NODE means all descendent leaf pages render as a
// single unified grid instead of the two-column Learn / Train split.
// Intended for the Misc section.

const RESOURCES = {

  "Cubeshape": {
    label: "Cubeshape",
    description: "Make the puzzle into a cube shape. The first step of Square-1.",
    "2H": [
      {
        title: "SquanGo CSP",
        url: "https://squango.net/csp",
        type: "trainer",
        description: "Interactive cubeshape trainer with visual diagrams, algorithm lookup by shape name, and probability data. The go-to CSP reference.",
        section: "train"
      },
      {
        title: "Cubeshape Algorithm Spreadsheet",
        url: "https://docs.google.com/spreadsheets/d/example-csp-sheet/edit",
        type: "doc/sheet",
        description: "Comprehensive sheet listing all cubeshape cases, algorithms, and recommended execution order for 2-handed solving.",
        section: "learn"
      },
      {
        title: "Cubeshape Tutorial — Rowe Hessler",
        url: "https://www.youtube.com/watch?v=example1",
        type: "video",
        description: "Rowe walks through the intuitive method for solving cubeshape, covering the main cases and how to approach unfamiliar shapes.",
        section: "learn"
      },
      {
        title: "CSP Alg Trainer",
        url: "https://squanmaster.net/csp-trainer",
        type: "trainer",
        description: "Drill specific cubeshape cases or random scrambles. Tracks your times per case.",
        section: "train"
      }
    ],
    "OH": [
      {
        title: "OH Cubeshape Guide",
        url: "https://docs.google.com/document/d/example-oh-csp/edit",
        type: "doc/sheet",
        description: "One-handed cubeshape approach — which cases require different handling, and OH-friendly algorithm choices.",
        section: "learn"
      },
      {
        title: "OH CSP in Practice — Video",
        url: "https://www.youtube.com/watch?v=example2",
        type: "video",
        description: "Watch-along breakdown of OH cubeshape execution, with slow-motion segments for grip changes.",
        section: "learn"
      }
    ]
  },

  "CP": {
    label: "Corner Permutation",
    description: "Permute the corners of Square-1 after cubeshape is achieved.",
    "2H": [
      {
        title: "CP Algorithm Doc",
        url: "https://docs.google.com/document/d/example-cp-doc/edit",
        type: "doc/sheet",
        description: "All corner permutation cases with recommended algorithms. Includes mirror and inverse variants.",
        section: "learn"
      },
      {
        title: "CP Trainer",
        url: "https://squanmaster.net/cp-trainer",
        type: "trainer",
        description: "Practice CP recognition and execution with this interactive drill tool.",
        section: "train"
      },
      {
        title: "CP Overview — Tutorial",
        url: "https://www.youtube.com/watch?v=example3",
        type: "video",
        description: "A breakdown of the CP step: how to recognize cases, when to use which alg, and how to integrate with the rest of the solve.",
        section: "learn"
      }
    ],
    "OH": [
      {
        title: "OH CP Algorithms",
        url: "https://docs.google.com/spreadsheets/d/example-oh-cp/edit",
        type: "doc/sheet",
        description: "OH-optimized CP alg set with grip-change notes and fingertrick suggestions.",
        section: "learn",
        featured: true
      }
    ]
  },

  "EP": {
    label: "Edge Permutation",
    description: "Permute the edges of Square-1. The final step before the solve is complete.",
    "EPLL": [
      {
        title: "EPLL Algorithm Sheet",
        url: "https://docs.google.com/spreadsheets/d/example-epll/edit",
        type: "doc/sheet",
        description: "All 12 EPLL cases with at least one algorithm each. Includes AUF-optimal selection notes.",
        section: "learn"
      },
      {
        title: "EPLL Trainer",
        url: "https://squanmaster.net/epll",
        type: "trainer",
        description: "Practice EPLL recognition and execution speed. Configurable to target specific cases.",
        section: "train"
      },
      {
        title: "EPLL in Context — Video",
        url: "https://www.youtube.com/watch?v=example4",
        type: "video",
        description: "Understanding EPLL setup moves, which algs to learn first, and recognition tricks for fast execution.",
        section: "learn"
      }
    ],
    "Other EP": [
      {
        title: "Non-EPLL EP Cases Doc",
        url: "https://docs.google.com/document/d/example-ep-other/edit",
        type: "doc/sheet",
        description: "Edge permutation cases that arise outside of EPLL — including split EP cases common in VDB and similar methods.",
        section: "learn"
      }
    ]
  },

  "VDB": {
    label: "VDB",
    description: "The Vandenberghe-De Bruijn system — a highly efficient modern method for Square-1.",
    "Overview": [
      {
        title: "VDB Introduction — Video",
        url: "https://www.youtube.com/watch?v=example5",
        type: "video",
        description: "An accessible introduction to the VDB method: what it is, why it's fast, and what you need to learn to use it.",
        section: "learn"
      },
      {
        title: "VDB Method Overview Doc",
        url: "https://docs.google.com/document/d/example-vdb-overview/edit",
        type: "doc/sheet",
        description: "Written breakdown of the VDB method steps, notation conventions, and what distinguishes it from linear approaches.",
        section: "learn"
      }
    ],
    "CSP": [
      {
        title: "VDB CSP Algorithms",
        url: "https://docs.google.com/spreadsheets/d/example-vdb-csp/edit",
        type: "doc/sheet",
        description: "CSP alg set tailored for VDB — includes recommended algs for good CP/CO setup.",
        section: "learn"
      },
      {
        title: "SquanGo CSP Trainer",
        url: "https://squango.net/csp",
        type: "trainer",
        description: "Full CSP trainer usable for VDB CSP practice. Filter by case type to focus on your problem areas.",
        section: "train"
      }
    ],
    "CO": [
      {
        title: "CO Algorithm Doc",
        url: "https://docs.google.com/document/d/example-vdb-co/edit",
        type: "doc/sheet",
        description: "Corner orientation cases and algorithms for VDB. Covers all CO cases after the cubeshape step.",
        section: "learn"
      },
      {
        title: "CO Trainer",
        url: "https://squanmaster.net/co",
        type: "trainer",
        description: "Drill corner orientation recognition and algorithm execution in VDB.",
        section: "train"
      }
    ],
    "EP": [
      {
        title: "VDB EP Algorithms",
        url: "https://docs.google.com/spreadsheets/d/example-vdb-ep/edit",
        type: "doc/sheet",
        description: "Edge permutation alg set for VDB solves, accounting for the EP cases that arise from VDB's preceding steps.",
        section: "learn"
      },
      {
        title: "EP Trainer — VDB",
        url: "https://squanmaster.net/ep-vdb",
        type: "trainer",
        description: "Practice VDB EP cases specifically.",
        section: "train"
      }
    ]
  },

  "Methods": [
    {
      title: "Square-1 Methods Overview",
      url: "https://docs.google.com/document/d/example-methods/edit",
      type: "doc/sheet",
      description: "A comparison of major Square-1 solving methods: Layer-by-layer, Vandenberghe, Lin, and others. Helps you decide where to start.",
      section: "learn"
    },
    {
      title: "Method Selection for Beginners — Video",
      url: "https://www.youtube.com/watch?v=example6",
      type: "video",
      description: "A cuber who switched methods multiple times shares what they'd recommend for people at each stage of their Square-1 journey.",
      section: "learn"
    },
    {
      title: "Progression Roadmap Doc",
      url: "https://docs.google.com/document/d/example-roadmap/edit",
      type: "doc/sheet",
      description: "Step-by-step progression guide from beginner to advanced Square-1. Covers what to learn, when, and in what order.",
      section: "learn"
    }
  ],

  // ── Misc ─────────────────────────────────────────────────────────────────
  // gridLayout: true → all leaves under this node render as a unified grid,
  // no Learn / Train split.
  "Misc": {
    label: "Misc",
    description: "Tools, references, and community resources that don't fit elsewhere.",
    gridLayout: true,

    "References": [
      {
        title: "Square-1 Wiki",
        url: "https://www.speedsolving.com/wiki/index.php/Square-1",
        type: "website",
        description: "The Speedsolving Wiki's Square-1 article — notation, history, and links to method pages."
      },
      {
        title: "Notation Guide",
        url: "https://docs.google.com/document/d/example-notation/edit",
        type: "doc/sheet",
        description: "Complete Square-1 notation reference, including WCA-standard moves, slice notation, and how to read algorithms."
      },
      {
        title: "Squan-1 Cheat Sheet",
        url: "https://example.com/cheatsheet.png",
        type: "image",
        description: "A concise one-page visual cheat sheet covering cubeshape, CP, and EPLL with diagrams."
      }
    ],
    "Tools": [
      {
        title: "CSTimer",
        url: "https://cstimer.net",
        type: "website",
        description: "The standard timing tool with a Square-1 scramble option built in."
      },
      {
        title: "SquanGo CSP",
        url: "https://squango.net/csp",
        type: "website",
        description: "The cubeshape trainer and reference used throughout this site."
      }
    ],
    "Community": [
      {
        title: "Speedsolving Square-1 Forum",
        url: "https://www.speedsolving.com/forums/categories/square-1.html",
        type: "website",
        description: "The main forum thread for Square-1 discussion, alg sharing, and community help."
      },
      {
        title: "Finger Tricks and Flow — Video",
        url: "https://www.youtube.com/watch?v=example7",
        type: "video",
        description: "Tips on improving execution speed through better finger technique, lookahead, and algorithm flow for Square-1.",
        section: "learn"
      }
    ]
  }
};
