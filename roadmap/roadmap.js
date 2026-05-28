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
//   Desktop: all lanes visible simultaneously (git-graph style).
//   Mobile:  one lane at a time, ← → arrows to flip between them.
//   Branches can contain further branchGroups (infinite depth).
//   Items placed after a branchGroup in the parent branch are the rejoined path.

const ROADMAP = {
  "2H": [
    {
      timestamp: "first solve",
      title: "Learn Cubeshape",
      description: "Get the puzzle back into a cube shape. Most beginners start with a fixed set of intuitive cases.",
      path: "Cubeshape~2H"
    },
    {
      timestamp: "sub 60",
      title: "Learn Basic CP",
      description: "Permute the corners of the top and bottom layers. There are only a handful of cases to start with.",
      path: "CP~2H"
    },
    {
      timestamp: "sub 40",
      title: "Learn EPLL",
      description: "Finish the solve by permuting the edges. EPLL is the last step and has 12 recognizable cases.",
      path: "EP~EPLL"
    },
    [
      [
        {
          timestamp: "sub 30",
          title: "Full CSP",
          description: "Learn all cubeshape cases so you're never stuck or slow on the first step.",
          path: "Cubeshape~2H"
        },
        {
          timestamp: "sub 30",
          title: "Full CSP",
          description: "Learn all cubeshape cases so you're never stuck or slow on the first step.",
          path: "Cubeshape~2H"
        }
      ],
      [
        {
          timestamp: "sub 30",
          title: "Full CP",
          description: "Expand your CP algorithm set to cover all cases efficiently.",
          path: "CP~2H"
        }
      ]
    ],
    {
      timestamp: "sub 20",
      title: "Explore VDB",
      description: "The Vandenberghe-De Bruijn method integrates CP into cubeshape for fewer total moves. A major efficiency leap.",
      path: "VDB~Overview"
    },
    [
      [
        {
          timestamp: "sub 15",
          title: "VDB CP + CO",
          description: "Learn to orient and permute corners in one step as part of the VDB flow.",
          path: "VDB~CO"
        }
      ],
      [
        {
          timestamp: "sub 15",
          title: "VDB EP",
          description: "Learn the edge permutation cases that arise specifically from VDB solves.",
          path: "VDB~EP"
        }
      ]
    ],
    {
      timestamp: "once comfortable",
      title: "Optimize Everything",
      description: "At this point, gains come from better lookahead, fingertrick efficiency, and eliminating pauses between steps.",
      path: "Methods"
    }
  ],

  "OH": [
    {
      timestamp: "first OH solve",
      title: "OH Cubeshape",
      description: "One-handed cubeshape requires different grip strategies. Start by learning which cases are awkward and how to handle them.",
      path: "Cubeshape~OH"
    },
    {
      timestamp: "sub 90",
      title: "OH CP",
      description: "Learn the one-handed CP algorithm set, which prioritizes grip-friendly moves over move count.",
      path: "CP~OH"
    },
    {
      timestamp: "sub 60",
      title: "OH EPLL",
      description: "EPLL for one-handed solving — the same cases as 2H but with OH-optimized execution.",
      path: "EP~EPLL"
    },
    [
      [
        {
          timestamp: "sub 40",
          title: "Full OH CSP",
          description: "Cover all cubeshape cases one-handed. Identify and drill your weakest shapes.",
          path: "Cubeshape~OH"
        }
      ],
      [
        {
          timestamp: "sub 40",
          title: "Expand OH CP",
          description: "Add more CP algorithms focused on grip efficiency and fewer regrips.",
          path: "CP~OH"
        }
      ]
    ],
    {
      timestamp: "sub 30",
      title: "OH VDB",
      description: "Apply VDB principles to one-handed solving for a significant move count reduction.",
      path: "VDB~Overview"
    }
  ]
};
