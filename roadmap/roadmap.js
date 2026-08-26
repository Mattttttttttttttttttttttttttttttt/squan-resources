// roadmap.js
// Source of truth for the progression roadmap.
//
// ROADMAP = {
//   [tabName]: branch
// }
//
// branch = item[]
//
// item = progressionStep | branchGroup
//
// progressionStep = {
//   timestamp:   string,
//   title:       string,
//   description: string,
//   path:        string,    — path into the main resources site (e.g. "Cubeshape~2H")
//   resources:   string[]   — optional; overrides automatic featured-resource lookup
// }
//
// branchGroup = branch[]   — array of 2+ branches shown side by side.
//   One lane at a time, ← → arrows to flip between them.
//   Branches can contain further branchGroups (infinite depth).
//   Items placed after a branchGroup in the parent branch are the rejoined path.

const ROADMAP = {
  "VDB": [
    "Roadmap for the most popular method, with the highest ceiling and most resources.",
    {
      timestamp: "first solve",
      title: "Learn To Solve",
      description: "Solve the puzzle before anything.",
      path: "start~solve"
    },
    {
      timestamp: "once you can solve",
      title: "Learn The Fingertricks",
      description: "VERY IMPORTANT!!!",
      path: "start~fingertricks"
    },
    {
      timestamp: "in your free time",
      title: "Learn The Notation",
      description: "Helps you <b>A LOT</b> with memorizing algs. It's like the " +
        "difference between \"sexy move\" and \"turn the right layer 90°, top 90°, " +
        "right -90°, top -90°\".",
      path: "karn"
    },
    {
      timestamp: "for sub 1",
      title: "Just Do Solves™",
    },
    {
      timestamp: "sub 1",
      title: "Learn CO, EO, CP",
      description: "Learn the basis for 5 look. <b>VERY INTUITIVE</b> if you learn it right.",
      path: ["vdb~5look~co", "vdb~5look~eo", "vdb~5look~cp"]
    },
    {
      timestamp: "for sub 30",
      title: "Learn Scallop/Kite CS",
      description: "Learn the intermediate CS method, which will also teach you how to " +
        "<b>think</b> about CS in general, helping you with CS methods in the future.",
      path: "cs~cs",
      resources: ["cs~cs~sk", "cs~cs~cstimer"]
    },
    {
      timestamp: "for sub 20",
      title: "Start Learning EP",
      description: "Start learning the basic cases of EP and instantly get more efficient. " +
        "Pay <b>EXTRA</b> attention to the explanations, because ALL of the solutions " +
        "are intuitive.",
      path: "vdb~5look~ep"
    },
    [
      [
        {
          timestamp: "sub 20",
          title: "Learn Full CS",
          description: "Again, the key is to <b>understand</b> how the solutions work. " +
            "Pay attention to how pieces move and how shapes reduce to each other.",
          path: "cs~cs",
          resources: ["cs~cs~full", "cs~cs~cstimer"]
        },
        {
          timestamp: "for sub 15",
          title: "Learn CSP",
          description: "Take it step by step. Ask in the discord server for help.",
          path: "cs~csp"
        }
      ],
      [
        {
          timestamp: "for sub 15",
          title: "Learn CSP",
          description: "Alternatively, skip full CS and go straight to CSP—a very solid " +
            "alternative. Take it step by step. Ask in the discord server for help.",
          path: "cs~csp"
        }
      ]
    ],
    {
      timestamp: "sub 15",
      title: "Finish EP",
      description: "By this time, you should go over all non-parity EPs and learn them. " +
        "Again pay <b>EXTRA</b> attention to the explanations, because ALL of the solutions " +
        "are intuitive.",
      path: "vdb~5look~ep"
    },
    {
      timestamp: "sub 15",
      title: "Fix Your Turning",
      description: "Now is the time to do it. <b>Smooth > Spam</b>, and this is especially " +
        "important for squan. If you are breaking pieces on a regular basis, that's a " +
        "red flag to you."
    },
    {
      timestamp: "for sub 10",
      title: "Now is the time to decide...",
      description: "Do you like squan? If so, you will <b>100%</b> like the next steps. " +
        "If not, it's up to you whether you just want to do solves and not learn anything new."
    },
    [
      [
        {
          timestamp: "for sub 10",
          title: "Learn OBL",
          description: "OBL recog is famously weird at the beginning, so stick with it!",
          path: "vdb~csbl~obl"
        },
        {
          timestamp: "whenever you want",
          title: "Start Your PBL Journey",
          description: "In one sentence, <b>PBL is a journey</b>. You can never \"be done " +
            "with it\". Which sounds intimidating, but it's fun once you get past " +
            "the basics. It's unlike anything else.",
          path: "vdb~csbl~pbl"
        }
      ],
      [
        {
          timestamp: "right after CSP",
          title: "learn PBL base cases",
          description: "In Dalton's tutorials, this is \"part 3a: 3, 4&5 slicers\". In " +
            "Matt's PBL Doc, this is the tab called \"BASE CASES\". Learn these, and " +
            "drill them into your muscle memory while you are learning OBL. Also helps " +
            "with getting familiar with PBL recog early.",
          path: "vdb~csbl~pbl"
        },
        {
          timestamp: "for sub 10",
          title: "Learn OBL",
          description: "Now learn OBL. OBL recog is famously weird at the beginning, so " +
            "stick with it!",
          path: "vdb~csbl~obl"
        },
        {
          timestamp: "right after",
          title: "Continue Your PBL Journey",
          description: "In one sentence, <b>PBL is a journey</b>. You can never \"be done " +
            "with it\". Which sounds intimidating, but it's fun once you get past " +
            "the basics. It's unlike anything else.",
          path: "vdb~csbl~pbl"
        }
      ]
    ],
    {
      timestamp: "for sub 8",
      title: "Work on Your Recog",
      description: "Believe it or not, often you are losing time on recog more than " +
        "anything. If you don't already, use <b>3 sided PBL recog</b>."
    },
    {
      timestamp: "around 7",
      title: "Learn OBLP",
      description: "Currently this is the most advanced method, and the dust is not settled " +
        "yet. You'll be a pioneer!",
      path: "vdb~csbl~oblp"
    },
    {
      timestamp: "and then?",
      title: "...?",
      description: "You could write the future of squan, if you want to!"
    }
  ],
  "Lin": [
    {
      timestamp: "first solve",
      title: "Learn To Solve",
      description: "Solve the puzzle before anything.",
      path: "start~solve"
    },
    {
      timestamp: "throughout",
      title: "Improve Your Blocks",
      description: "Block solutions are something you start learning from the very " +
        "beginning, then just gradually improve upon through experience, all the way " +
        "from sup 1:00 to sub 7 and beyond.",
      path: "lin~f2b"
    },
    {
      timestamp: "for sub 30",
      title: "Learn Scallop/Kite CS",
      description: "Learn the intermediate CS method, which will also teach you how to " +
        "<b>think</b> about CS in general, helping you with CS methods in the future.",
      path: "cs~cs",
      resources: ["cs~cs~sk", "cs~cs~cstimer"]
    },
    {
      timestamp: "sub 30",
      title: "Learn CP+DF",
      description: "Learn how to do CP at the same time as solving the DF edge.",
      path: "lin~l9p",
      resources: ["lin~l9p~riccicpdf", "lin~l9p~ab", "lin~l9p~squanmate"]
    },
    {
      timestamp: "for sub 20",
      title: "Learn EPLL",
      description: "Don't forget to learn the cases both with and without barflip!",
      path: "lin~l9p",
      resources: ["lin~l9p~ab", "lin~l9p~ricciepll", "lin~l9p~squanmate"]
    },
    [
      [
        {
          timestamp: "sub 20",
          title: "Learn Full CS",
          description: "Again, the key is to <b>understand</b> how the solutions work. " +
            "Pay attention to how pieces move and how shapes reduce to each other.",
          path: "cs~cs",
          resources: ["cs~cs~full", "cs~cs~cstimer", "lin~l9p~squanmate"]
        },
        {
          timestamp: "around 15",
          title: "Learn CSP",
          description: "Take it step by step. Ask in the discord server for help.",
          path: "cs~csp"
        }
      ],
      [
        {
          timestamp: "around 15",
          title: "Learn CSP",
          description: "Alternatively, skip full CS and go straight to CSP—a very solid " +
            "alternative. Take it step by step. Ask in the discord server for help.",
          path: "cs~csp"
        }
      ]
    ],
    {
      timestamp: "anytime after CSP",
      title: "Learn RSB",
      description: "RSB, or Ricci's Second Block, allows you to solve the DB edge along with SB, " +
        "and you should learn this ASAP.",
      path: "lin~f2b"
    },
    {
      timestamp: "for sub 12",
      title: "Learn PLL",
      description: ""
    },
    {
      timestamp: "when comfortable with CSP",
      title: "Learn PLL+1",
      description: "Recog is pretty hard, and the first set is always the hardest, so " +
        "hang in there. Be sure to learn the 72 optimal slicer first before you learn " +
        "the alt barflip algs! It doesn't matter much what set you learn first, but you " + "could do solved, diag, adjf, adjr, adjb, adjl, in that order.",
      path: "lin~l9p"
    },
    {
      timestamp: "and then?",
      title: "...?",
      description: "You could write the future of squan, if you want to!"
    }
  ]
};
