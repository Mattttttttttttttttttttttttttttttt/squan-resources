// roadmap.js
// Source of truth for the progression roadmap.
//
// Structure:
//   ROADMAP = {
//     [tabName]: {
//       [timestamp]: progressionStep | progressionStep[]
//     }
//   }
//
// progressionStep = {
//   title:       string,
//   description: string,
//   url:         string   — relative URL into the main resources site
// }
//
// If a timestamp maps to an array, the steps are displayed in parallel (side by side).

const ROADMAP = {
  "2H": {
    "first solve": {
      title: "Learn Cubeshape",
      description: "Get the puzzle back into a cube shape. Most beginners start with a fixed set of intuitive cases.",
      url: "../?path=Cubeshape~2H"
    },
    "sub 60": {
      title: "Learn Basic CP",
      description: "Permute the corners of the top and bottom layers. There are only a handful of cases to start with.",
      url: "../?path=CP~2H"
    },
    "sub 40": {
      title: "Learn EPLL",
      description: "Finish the solve by permuting the edges. EPLL is the last step and has 12 recognizable cases.",
      url: "../?path=EP~EPLL"
    },
    "sub 30": [
      {
        title: "Full CSP",
        description: "Learn all cubeshape cases so you're never stuck or slow on the first step.",
        url: "../?path=Cubeshape~2H"
      },
      {
        title: "Full CP",
        description: "Expand your CP algorithm set to cover all cases efficiently.",
        url: "../?path=CP~2H"
      }
    ],
    "sub 20": {
      title: "Explore VDB",
      description: "The Vandenberghe-De Bruijn method integrates CP into cubeshape for fewer total moves. A major efficiency leap.",
      url: "../?path=VDB~Overview"
    },
    "sub 15": [
      {
        title: "VDB CP + CO",
        description: "Learn to orient and permute corners in one step as part of the VDB flow.",
        url: "../?path=VDB~CO"
      },
      {
        title: "VDB EP",
        description: "Learn the edge permutation cases that arise specifically from VDB solves.",
        url: "../?path=VDB~EP"
      }
    ],
    "once comfortable": {
      title: "Optimize Everything",
      description: "At this point, gains come from better lookahead, fingertrick efficiency, and eliminating pauses between steps.",
      url: "../?path=Methods"
    }
  },

  "OH": {
    "first OH solve": {
      title: "OH Cubeshape",
      description: "One-handed cubeshape requires different grip strategies. Start by learning which cases are awkward and how to handle them.",
      url: "../?path=Cubeshape~OH"
    },
    "sub 90": {
      title: "OH CP",
      description: "Learn the one-handed CP algorithm set, which prioritizes grip-friendly moves over move count.",
      url: "../?path=CP~OH"
    },
    "sub 60": {
      title: "OH EPLL",
      description: "EPLL for one-handed solving — the same cases as 2H but with OH-optimized execution.",
      url: "../?path=EP~EPLL"
    },
    "sub 40": [
      {
        title: "Full OH CSP",
        description: "Cover all cubeshape cases one-handed. Identify and drill your weakest shapes.",
        url: "../?path=Cubeshape~OH"
      },
      {
        title: "Expand OH CP",
        description: "Add more CP algorithms focused on grip efficiency and fewer regrips.",
        url: "../?path=CP~OH"
      }
    ],
    "sub 30": {
      title: "OH VDB",
      description: "Apply VDB principles to one-handed solving for a significant move count reduction.",
      url: "../?path=VDB~Overview"
    }
  }
};
