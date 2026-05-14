// resources.js
// Source of truth for all the resources and folder structures.
//
// NODE  = object  (has label, description metadata; optionally gridLayout: true)
// LEAF  = array   (list of resource objects)
//
// node object:
// {
//    label:          string,
//    description:    string,
//    subfolder-name: {another node},
//  OR, this is a node that contains resources:
//    resources:      [resource objects]
//    ...
// }
//
// Resource object shape:
//   {
//     title:       string,
//     url:         string,
//     type:        "doc/sheet" | "video" | "trainer" | "image" | "website" | something else?,
//     credit:      string, // put attributions here
//     description: string,
//     featured:    boolean
//   }
//
// gridLayout: true on a NODE means all descendent leaf pages render as a
// single unified grid instead of the two-column Learn / Train split.
// Intended for the Misc section.

const RESOURCES = {
  "start": {
    label: "Getting Started",
    description: "Welcome to your squan journey! Click me to learn the basics.",
    "solve": {
      label: "Solve the Cube",
      description: "Get your cube solved.",
      resources: [
        {
          title: "Beginner tutorial",
          url: "https://youtu.be/IkmlMEHYyzI",
          type: "video",
          credit: "- Cube Master",
          path: "cm",
          description: "Teaches foundations and goes very in detail, and gets a little " +
            "too repetitive. Outdated and weird way to do both EO and CP, but not " +
            "too bad, and it's the best we've got.",
          featured: true
        },
        {
          title: "How to memorize the Adj/- parity alg",
          url: "https://youtu.be/PfL4BzxJhCs",
          type: "video",
          credit: "- zzRouxfop",
          path: "adj",
          description: "Breaks down the standard Adj/- parity alg for you. Good for " +
            "getting a grip on the alg at the beginning."
        },
        {
          title: "Beginner tutorial",
          url: "https://youtu.be/xITr2WFqado",
          type: "video",
          credit: "- Tingman",
          path: "tingman",
          description: "Aside from a great beginner cubeshape tutorial, this is much harder " +
            "than cube master's. Lots of outdated algs, "
        },
        {
          title: "Beginner tutorial",
          url: "https://youtu.be/OvRIkA4MztM",
          type: "video",
          credit: "- NOBLE CUBES",
          path: "nc",
          description: "Very short, but complicated and TERRIBLE fingertricks and algs. " +
            "Does not explain how things work, and will lead you down the wrong path. " +
            "Please do NOT watch this."
        }
      ]
    },
    "fingertricks": {
      label: "Fingertricks",
      bait: "ABSOLUTELY ESSENTIAL for a smooth start to squan!",
      description: "ABSOLUTELY ESSENTIAL! Most people spend a LONG time correcting bad " +
        "turning habits that they picked up from the beginning. Learning these will " +
        "also make squan just much more enjoyable in general.",
      resources: [
        {
          title: "Fingertrick tutorial",
          url: "https://youtu.be/jIkM_LuWc5M",
          type: "video",
          credit: "- Matt",
          path: "matt",
          description: "",
          featured: true
        },
        {
          title: "Fingertrick tutorial",
          url: "https://youtu.be/Tjb2bcN4XlE",
          type: "video",
          credit: "- Cube Master",
          path: "cm",
          description: "Seems like more fingertricks, but either outdated, bad, or " +
            "just different ways of talking about the same thing."
        }
      ]
    },
    "karn": {
      label: "Notation",
      bait: "makes learning algs SO much easier",
      description: "Learn karnotation, which will help you A LOT with memorizing algs. " +
        "It's like the difference between \"sexy move\" and \"turn the right layer " +
        "90°, top 90°, right -90°, top -90°\".",
      resources: [
        {
          title: "Karn sheet",
          url: "https://docs.google.com/spreadsheets/d/11WRdlUpMJMd2vMloNvz2pp_AYKO1XFeCErpmx5wUKvQ/edit",
          type: "doc/sheet",
          credit: "- Matt",
          path: "sheet",
          description: "the most up-to-date information",
          featured: true
        }
      ]
    }
  }
};
