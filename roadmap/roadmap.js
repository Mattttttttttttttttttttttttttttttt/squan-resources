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
  "VDB": [
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
      description: "Helps you A LOT with memorizing algs. It's like the difference between" +
        "\"sexy move\" and \"turn the right layer 90°, top 90°, right -90°, top -90°\".",
      path: "start~karn"
    },
    {
      timestamp: "sub 1",
      title: "Just Do Solves",
      description: "",
    }
  ]
};
