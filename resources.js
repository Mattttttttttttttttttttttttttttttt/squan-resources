// resources.js
// Source of truth for all the resources and folder structures.
//
// NODE  = object  (has label, description metadata; optionally gridLayout: true)
// LEAF  = array   (list of resource objects)
//
// node object:
// {
//    label:          string,
//    bait:           string,
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
    bait: "Welcome to your squan journey! Click me to learn the basics.",
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
        "90째, top 90째, right -90째, top -90째\".",
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
  },
  "cs": {
    label: "CS & CSP",
    bait: "solve your cube into a cubeshape, and avoid parity",
    "cs": {
      label: "CS",
      bait: "solve cubeshape",
      description: "Be more efficient at cubeshape.</br>NOTE: once you get used to how to " +
        "think for CS, going to watch any of the CSP tutorials and picking the better " +
        "alg would be much more efficient.",
      resources: [
        {
          title: "Scallop/Kite Tutorial",
          url: "https://youtu.be/-fYJTvNSCdo",
          type: "video",
          credit: "- Cube Master",
          path: "sk",
          description: "Explains how to the thinking behind CS. Make sure to experiment " +
            "with the other way to solve scallops and scallop/kite, so you don't get " +
            "stuck on algs you don't like.",
          featured: true
        },
        {
          title: "Full CS Tutorial",
          url: "https://youtu.be/GwlHUS7e-go",
          type: "video",
          credit: "- Cube Master",
          path: "full",
          description: "A little repetitive, but again check for the other way to solve " +
            "all the 3 slicers, so you don't get stuck on algs you don't like.",
          featured: true
        },
        {
          title: "Full CS Flowchart",
          url: "https://imgur.com/a/full-cubeshape-chart-square-1-toXxlEv",
          type: "image",
          credit: "- u/olimo",
          path: "chart",
          description: "A neat flowchart that has questionable algs and is impossible to " +
            "read. But it does teach you how to think about CS, and where the names came from."
        },
        {
          title: "CS Trainer",
          url: "https://cstimer.net",
          type: "trainer",
          credit: "- Chen Shuang",
          path: "cstimer",
          description: "Just the CSTimer you know and love. Switch the scramble type to " +
            "\"Square-1\" for the left dropdown and \"CSP\" for the right dropdown, and " +
            "use the gear icon immediately to the right to choose CS cases.",
          featured: true
        },
      ]
    },
    "csp": {
      label: "CSP",
      bait: "Avoid parity by solving cubeshape differently. Basis of VDB and Lin.",
      description: "By tracing the parity of the cube during inspection, you can distinguish" +
        "between the two parities of the cube, and do different algs for this. This " +
        "(theoretically) ensures you NEVER get parity.",
      resources: [
        {
          title: "SquanGo CSP Algs",
          url: "https://squan-go.web.app/csp/",
          type: "website",
          credit: "- Abid & Matt",
          path: "sqgalg",
          description: "Does everything you can imagine. Integrates seamlessly with Matt's " +
            "tutorials. Provides trainer, progress tracker, parity tracer, and more.",
          featured: true
        },
        {
          title: "CSP Tutorials",
          url: "https://www.youtube.com/watch?v=GNmrLHw86ss&list=PL8Izpzk-6zizm3E5icawyJ637EJyaIwrB&index=1",
          type: "video",
          credit: "- Matt",
          path: "matt",
          description: "Shapes sorted by frequency. Includes a full tutorial and explains " +
            "the algs.",
          featured: true
        },
        {
          title: "SquanGo CSP Tools",
          url: "https://squan-go.web.app/csp/",
          type: "trainer",
          credit: "- Abid",
          path: "sqgtool",
          description: "Does everything you can imagine. Integrates seamlessly with Matt's " +
            "tutorials. Provides trainer, progress tracker, parity tracer, and more.",
          featured: true
        },
        {
          title: "CSP Sheet",
          url: "https://docs.google.com/spreadsheets/d/1F627bYHNPyVpD-zqvEXeq7W1_Xod27wnQ6fPMaGVXmg/edit",
          type: "doc/sheet",
          credit: "- BlueAcidBall",
          path: "bab",
          description: "Shapes sorted by frequency. Includes everything apart from tracing. " +
            "Algorithms displayed with images."
        },
        {
          title: "CSP Site",
          url: "https://wo0fle.github.io/square-1/cs/ezcsp",
          type: "website",
          credit: "- Seby",
          path: "seby",
          description: "Shapes sorted by frequency. Includes a full tutorial. Has non-standard" +
            "naming though."
        },
        {
          title: "CSP Sheet",
          url: "https://docs.google.com/spreadsheets/d/1eB4gjEUYEOWKnMvimfReXuzsWBPhLqbMp_tgWrFO3DA/edit",
          type: "doc/sheet",
          credit: "- Matt",
          path: "matt2",
          description: "Shapes sorted by frequency. A probably outdated version of the " +
            "CSP tutorials. Includes everything apart from tracing."
        },
        {
          title: "CSP Doc",
          url: "https://docs.google.com/document/d/1_PWDmEZKot5MV7bJ1qWDxhTQyLBQGKqgsBeh3FgW6tU/edit",
          type: "doc/sheet",
          credit: "- Lorenzo",
          path: "lorenzo",
          description: "Shapes organized by symmetry. Includes a full tutorial."
        },
        {
          title: "CSP Doc",
          url: "https://drive.google.com/file/d/1fm7cZEYs46LzrWroh4Vd6AJFsGDJ9mnq/view",
          type: "doc/sheet",
          credit: "- SAC2",
          path: "sac2",
          description: "Shapes sorted by shape. Includes everything apart from tracing. " +
            "Clean graphics, but includes no explanation of the algs."
        },
        {
          title: "CSP Sheet",
          url: "https://docs.google.com/spreadsheets/d/1SvFjP5UiiJYJ4Wls341NmP_PKEd2skFyMXHm6Qsk2go/edit",
          type: "doc/sheet",
          credit: "- Marco",
          path: "marco",
          description: "Shapes sorted by shape. Includes everything apart from tracing. " +
            "Outdated and not maintained."
        },
        {
          title: "CSP Tutorials",
          url: "https://youtube.com/playlist?list=PLF0mfn_ogsH_mGKR9j4mR-USh7CnBxec-",
          type: "video",
          credit: "- Cube Master",
          path: "cm",
          description: "Shapes sorted by shape. Includes a full tutorial, but outdated."
        },
        {
          title: "CSP Tutorial",
          url: "https://youtu.be/pXXr87kwZuI",
          type: "video",
          credit: "- Eva",
          path: "eva",
          description: "Only teaches tracing. Outdated."
        }
      ]
    }
  },
  "VDB": {
    title: "Vandenberg",
    bait: "the most popular method, with the highest ceiling and most resources",
    "5look": {
      title: "5 Look",
      bait: "Solve the whole squan in 5 steps. The logical step after beginners.",
      description: "The 5 steps of 5 look are: CS, CO, EO, CP, EP. These stand for cubeshape, " +
        "corner orientation, edge orientation, corner permutation, edge permutation. " +
        "You are also encouraged to do CSP for CS.</br>Find CS under its folder in the " +
        "homepage. ",
      "CO": {
        title: "CO",
        bait: "First step after CS: corner orientation.",
        description: "A very intuitive step: very similar to 2x2.",
        resources: [
          {
            title: "CO sheet",
            url: "https://docs.google.com/spreadsheets/d/1q-CmTEhda9E6bkPqADygln7BdymHLXUmaHtidtyywfY/edit",
            type: "doc/sheet",
            credit: "- Matt",
            path: "matt",
            description: "",
            featured: true
          },
          {
            title: "CO Tutorial",
            url: "https://youtu.be/9msR6Ss1Epw",
            type: "video",
            credit: "- Cube Master",
            path: "cm",
            description: "Outdated."
          }
        ]
      },
      "EO": {
        title: "EO",
        bait: "Second step after CS: edge orientation",
        description: "For an easier version, you can M2 to either 1/1 or L/L. Everything " +
          "is just some combo of M2s or setup to M2s. If all the EO solutions you use " +
          "don't move the corners, then you can predict CP and maybe even cancel into it.",
        resources: [
          {
            title: "EO Sheet",
            url: "https://docs.google.com/spreadsheets/d/1q-CmTEhda9E6bkPqADygln7BdymHLXUmaHtidtyywfY/edit",
            type: "doc/sheet",
            credit: "- Matt",
            path: "matt",
            description: "",
            featured: true
          },
          {
            title: "EO Sheet",
            url: "https://docs.google.com/spreadsheets/d/1S95zSl49vUd51hiu2vCt2yjVzFQMWTm349-JJLjeXb8/edit",
            type: "doc/sheet",
            credit: "- Stepan",
            path: "stepan",
            description: "Contains optimal algs that are probably not needed for starters, " +
              "but worth getting into if you want to get faster."
          },
          {
            title: "EO video",
            url: "https://youtu.be/KOCYNsDGxU4",
            type: "video",
            credit: "- Cube Master",
            path: "cm",
            description: "Outdated with little explanation of the algs."
          }
        ]
      },
      "CP": {
        title: "CP",
        bait: "The first step after you solve orientation of both layer (OBL).",
        description: "To get faster at this step, you can do EOCP, which is basically " +
          "predicting CP before you do EO, and eliminating the pause in between.",
        resources: [
          {
            title: "CP Sheet",
            url: "https://docs.google.com/spreadsheets/d/1q-CmTEhda9E6bkPqADygln7BdymHLXUmaHtidtyywfY/edit",
            type: "doc/sheet",
            credit: "- Matt",
            path: "matt",
            description: "",
            featured: true
          },
          {
            title: "CP Tutorial",
            url: "https://youtu.be/kUpSACA-VJU",
            type: "video",
            credit: "- Cube Master",
            path: "cm",
            description: "Outdated terminology and concepts, but touches on how to preserve" +
              "blocks during CP."
          },
          {
            title: "CP Algs and CP Parity Algs",
            url: "https://sarah.cubing.net/square-1/cp",
            type: "website",
            credit: "- Sarah",
            path: "sarah",
            description: "Could be useful if you decides you want to learn CP parity, but " +
              "otherwise, no."
          }
        ]
      },
      "EP": {
        title: "EP",
        bait: "Last step to 5 look: permute the remaining edges.",
        description: "It is important that you learn EP while paying attention to HOW the " +
          "algs work. Squan algs are quite intuitive, and it's best if you get that earlier " +
          "rather than later.",
        resources: [
          {
            title: "EP sheet",
            url: "https://docs.google.com/spreadsheets/d/1q-CmTEhda9E6bkPqADygln7BdymHLXUmaHtidtyywfY/edit",
            type: "doc/sheet",
            credit: "- Matt",
            path: "matt",
            description: "",
            featured: true
          },
          {
            title: "EP tutorial",
            url: "https://youtu.be/JsuYDfhUkmE",
            type: "video",
            credit: "- Cube Master",
            path: "cm",
            description: "Good ideas, but incredibly outdated fingertricks AND notation."
          }
        ]
      }
    }
  }
};
