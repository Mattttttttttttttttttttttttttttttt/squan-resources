// resources.js
// Source of truth for all the resources and folder structures.
//
// NODE  = object  (has title, description metadata; optionally gridLayout: true)
// LEAF  = array   (list of resource objects)
//
// node object:
// {
//    title:          string,
//    bait:           string,
//    description:    string,
//    subfolder-path: {another node},
//  OR, this is a node that contains resources:
//    resources:      [resource objects]
//    ...
// }
//
// Resource object shape:
//   {
//     title:       string,
//     url:         string,
//     type:        "doc/sheet" | "video" | "trainer" | "image" | "website" | "code" |"other",
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
    title: "Getting Started",
    bait: "Welcome to your squan journey! Click me to learn the basics.",
    "solve": {
      title: "Solve the Cube",
      description: "There are good tutorials and bad tutorials. <b>Anything not listed " +
        "here</b> is very likely going to lead you astray in some way.",
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
      title: "Fingertricks",
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
    }
  },
  "cs": {
    title: "CS & CSP",
    bait: "solve your cube into a cubeshape, and avoid parity",
    "cs": {
      title: "CS",
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
          url: "https://i.imgur.com/Apg1NQ7.png",
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
      title: "CSP",
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
          url: "https://www.youtube.com/watch?v=GNmrLHw86ss&list=PL8Izpzk-6zizm3E5icawyJ637EJyaIwrB",
          type: "video",
          credit: "- Matt",
          path: "mattv",
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
          description: "Shapes sorted by frequency. Includes a full tutorial. Has " +
            "non-standard naming though."
        },
        {
          title: "CSP Sheet",
          url: "https://docs.google.com/spreadsheets/d/1eB4gjEUYEOWKnMvimfReXuzsWBPhLqbMp_tgWrFO3DA/edit",
          type: "doc/sheet",
          credit: "- Matt",
          path: "matts",
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
  "vdb": {
    title: "Vandenbergh",
    bait: "the most popular method, with the highest ceiling and most resources",
    "5look": {
      title: "5 look",
      bait: "Solve the whole squan in 5 steps. The logical step after beginners.",
      description: "The 5 steps of 5 look are: CS, CO, EO, CP, EP. These stand for cubeshape, " +
        "corner orientation, edge orientation, corner permutation, edge permutation. " +
        "You are also encouraged to do CSP for CS.</br>Find CS under its folder in the " +
        "homepage. ",
      "co": {
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
      "eo": {
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
              "but worth getting into if you want to get faster. But it's also pretty " +
              "outdated for those optimal algs."
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
      "cp": {
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
      "ep": {
        title: "EP",
        bait: "Last step to 5 look: permute the remaining edges.",
        description: "It is important that you learn EP while paying attention to HOW the " +
          "algs work. Squan algs are quite intuitive, and it's best if you get that earlier " +
          "rather than later.",
        resources: [
          {
            title: "EP Sheet",
            url: "https://docs.google.com/spreadsheets/d/1q-CmTEhda9E6bkPqADygln7BdymHLXUmaHtidtyywfY/edit",
            type: "doc/sheet",
            credit: "- Matt",
            path: "matt",
            description: "",
            featured: true
          },
          {
            title: "EP Tutorial",
            url: "https://youtu.be/JsuYDfhUkmE",
            type: "video",
            credit: "- Cube Master",
            path: "cm",
            description: "Good ideas, but incredibly outdated fingertricks AND notation."
          },

        ]
      }
    },
    "csbl": {
      title: "3 look and 2 look",
      bait: "Click me if you want to get faster at squan and go past 5 look!",
      description: "3 look consists of CSP → OBL → PBL, and 2 look consists of OBLP → PBL. " +
        "</br>You can find resources for both of them here.",
      "obl": {
        title: "OBL",
        bait: "Orientation of Both Layers. Solve CO and EO in one step.",
        description: "OBL is very like CS: you have a recognition system that you need to " +
          "get used to, and cases reduce to each other in a tree-like structure. Start " +
          "learning from 1 slicers all the way up to 6 slicers.",
        resources: [
          {
            title: "OBL Tutorial",
            url: "https://youtu.be/pv2RgznaHgY&list=PLlEIANnLzI5ON2bbw9e2v0X4HyeX3eZd-",
            type: "video",
            credit: "- Oxzowachi",
            path: "ox",
            description: "The most in depth tutorial. Perfect aside from a few solutions.",
            featured: true
          },
          {
            title: "SquanGo OBL Trainer",
            url: "https://squan-go.web.app/oblpbl/",
            type: "trainer",
            credit: "- Matt & Abid & Le Kit",
            path: "sqg",
            description: "OBL and PBL trainers in one. Click on the all-caps text at the top " +
              "of the website to switch between the two trainers. Incorporates Matt's OBL " +
              "Sheet and Daniel's OBL Sheet.",
            featured: true
          },
          {
            title: "OBL Tutorial",
            url: "https://sq1obl.com/",
            type: "website",
            credit: "- Michael Young",
            path: "sq1obl",
            description: "Very in detail, but also very old with outdated names for cases. " +
              "Contains alg memorization tips."
          },
          {
            title: "OBL Sheet",
            url: "https://docs.google.com/spreadsheets/d/172Vy9q4WNEvmI2FHkH96XzfXJHdTqeSWBMiANhWbXYA/edit",
            type: "doc/sheet",
            credit: "- Matt",
            path: "matt",
            description: "Similar in style to Matt's PBL Doc, complete with angle and alg " +
              "explanations. In his opinion, you should switch to his solutions for these " +
              "OBLs: kite/T, bad bunnies, bad thumbs, 1e1e, shells, bad Ts, bad ties, bad " +
              "pairs, gem/knight, yoshi/hazard, 1c1c, yoshis, bad axes, bad birds, bad " +
              "cut/N, bad cuts and bad cut/kite."
          },
          {
            title: "OBL Trainer",
            url: "https://jdsolano02.github.io/OBLTrainer/",
            type: "trainer",
            credit: "- Jose",
            path: "jose",
            description: "OBL trainer with time tracking, but not maintained."
          },
          {
            title: "OBL Sheet",
            url: "https://docs.google.com/spreadsheets/d/1BZQxg11RD829O0tKagGVC65b3s57Hd7Y0GplDCR7--w/edit",
            type: "doc/sheet",
            credit: "- Daniel",
            path: "derpy",
            description: "Just lots of algs. Has errors and organized confusingly."
          }
        ]
      },
      "pbl": {
        title: "PBL",
        bait: "Permutation of Both Layers. Solve CP and EP in one step.",
        description: "PBL is a journey. You never stop learning. Knowing full optimal PBL " +
          "would be like knowing 1LLL—it's a bit ridiculous. Makanaming and karnotation are" +
          "prerequisites.",
        resources: [
          {
            title: "Makanaming Tutorial",
            url: "https://docs.google.com/spreadsheets/d/19Pr0r425ygxU2JjAw0YCjBBZVrOcDM8gmtv6kZi2Ya8/edit",
            type: "doc/sheet",
            credit: "- Oxzowachi",
            path: "maka",
            description: "Learn how the PBL faces are named. Not knowing this would be like " +
              "trying to learn PLL without knowing what the cases are called.",
            featured: true
          },
          {
            title: "2-Alg PBL Tutorial",
            url: "https://youtu.be/r8l3U9K9R_I&list=PLIAD7bABu3ZvDSkS82y06-6O9lhg4js1F",
            type: "video",
            credit: "- Dalton",
            path: "daltonv",
            description: "The most updated tutorial we have.",
            featured: true
          },
          {
            title: "SquanGo PBL Trainer",
            url: "https://squan-go.web.app/oblpbl/",
            type: "trainer",
            credit: "- Matt & Abid & Le Kit",
            path: "sqg",
            description: "OBL and PBL trainers in one. Click on the all-caps text at the top " +
              "of the website to switch between the two trainers. Incorporates Matt's PBL " +
              "Doc, Daniel's PBL Sheet, and JLMinx's PBL Sheet.",
            featured: true
          },
          {
            title: "PBL Doc",
            url: "https://docs.google.com/document/d/1bLCZGcQn4Or9uZZWK8Z4cdg8AkP2l7Ljm5xwEGH97BI/edit",
            type: "doc/sheet",
            credit: "- Matt",
            path: "mattd",
            description: "With explanations",
            featured: true
          },
          {
            title: "PBL Sheet",
            url: "https://docs.google.com/spreadsheets/d/10yJdudCtT-zIt7YVjhgPv4VfOuqXHa3u1fxYhaBPP8s/edit",
            type: "doc/sheet",
            credit: "- JL Minx",
            path: "jlminx",
            description: "Speed optimal solutions that are really hard to learn. Reference " +
              "this sheet only for cases you don't like. With no explanations."
          },
          {
            title: "PBL Organizer",
            url: "https://docs.google.com/spreadsheets/d/1knBnskgfCIkdd6E67q6uFqCYcHFeOEAVju0uHp4QkZA/edit",
            type: "doc/sheet",
            credit: "- 2009HILD01 & Matt",
            path: "hild",
            description: "A spreadsheet to help you track your PBL progress, complete with a " +
              "heatmap that tells you what cases you should learn."
          },
          {
            title: "PBL Sheet",
            url: "https://docs.google.com/spreadsheets/d/1VQNYNwdOLqqBkacHcfYtEBst22FOVhH9EAhTOYOZTgo/edit",
            type: "doc/sheet",
            credit: "- Daniel et al.",
            path: "derpy",
            description: "An extensive community project of speed optimal algs. With no " +
              "explanations."
          },
          {
            title: "PBL Sheet",
            url: "https://docs.google.com/spreadsheets/d/1Ttr7R2IYFLOR1BA3rh-hj_ELQGnGLgAp9n1G_jqhVFE/edit",
            type: "doc/sheet",
            credit: "- Brian",
            path: "brian",
            description: "An incomplete collection of good algs. Less optimal than JL Minx, " +
              "but more optimal than Matt. With no explanations."
          },
          {
            title: "2-Alg PBL Cheat Sheet",
            url: "https://drive.google.com/file/d/1jZBtssPGyn5uGRpSHVmF-qFNepyHW3-Y/view",
            type: "doc/sheet",
            credit: "- Dalton",
            path: "daltonp",
            description: "Neat looking PDF for 2 alg angles, but not very useful in practice."
          }
          ,
          {
            title: "2-Alg PBL Introduction",
            url: "https://youtu.be/ASyErFJ-O6Y",
            type: "video",
            credit: "- Oxzowachi",
            path: "oxv",
            description: "Very outdated in terms of resources it mentions, but good " +
              "explanation of what 2-alg PBL is."
          },
          {
            title: "PBL Tutorial",
            url: "https://youtu.be/uPDbHQQwLtM&list=PLh8G8F13X7w8fvip0BX9gQ1vJPRRKR94k",
            type: "video",
            credit: "- Chen Yen-An",
            path: "cya",
            description: "In Chinese, but it's another possible video tutorial series."
          },
          {
            title: "PBL Sheet",
            url: "https://docs.google.com/spreadsheets/d/1lVzeINDKFXTk40ah7PEEMcML-7DENsqtk_hBMNDJpdg/edit",
            type: "doc/sheet",
            credit: "- Dubi",
            path: "dubi",
            description: "A personal project with lots of statistics."
          },
          {
            title: "PBL Tutorial",
            url: "https://youtu.be/vVN_eFiYB88&list=PLF0mfn_ogsH_ogg-ffsVVPvOMD6yRtBzf",
            type: "video",
            credit: "- Cube Master",
            path: "cm",
            description: "The OG tutorial for PBL, but outdated."
          },
          {
            title: "PBL Sheet",
            url: "https://docs.google.com/spreadsheets/d/1GTt_6yO2go_a929AvfY14rUtDwTse8atZsPi4JkQH_E/edit",
            type: "doc/sheet",
            credit: "- Rasmus",
            path: "rasmus",
            description: "A spreadsheet version of Cube Master's videos. No makanaming " +
              "and unconventional naming."
          },
          {
            title: "PBL Sheet",
            url: "https://docs.google.com/spreadsheets/d/11a1vnUpp-aiMmRuO7IiN78ZosQHhFi9E-zDBg8-qSSM/edit",
            type: "doc/sheet",
            credit: "- Oxzowachi",
            path: "oxs",
            description: "A really random list of algs."
          },
          {
            title: "PBL Sheet",
            url: "https://docs.google.com/spreadsheets/d/1bLhYXaW1HGGTypOQGOJvnS2L40gKXHlbc8zJ3ZXYeTE/edit",
            type: "doc/sheet",
            credit: "- Cube Master",
            path: "cms",
            description: "A really outdated spreadsheet version of Cube Master's videos. " +
              "No makanaming."
          },
          {
            title: "PBL Statistics",
            url: "https://docs.google.com/spreadsheets/d/1wscfNtPwNv_lkK8IVxFkYgVecOdg6Fs0PFFSMyXVo34/edit",
            type: "doc/sheet",
            credit: "- Michael",
            path: "michael",
            description: "A spreadsheet with interesting PBL statistics."
          },
          {
            title: "PBL Sheet",
            url: "https://docs.google.com/spreadsheets/d/1G1HOhOUFSyr_qPhDj4HD5sSI8DaQbgbJ5O3motKAO3Q/edit",
            type: "doc/sheet",
            credit: "- Stepan",
            path: "stepan",
            description: "DISCONTINUED"
          },
          {
            title: "PBL Trainer & Manager",
            url: "https://pbl-manager.netlify.app/",
            type: "trainer",
            credit: "- Charlie",
            path: "charlie",
            description: "A very old trainer and PBL manager."
          }
        ]
      },
      "oblp": {
        title: "OBLP",
        bait: "OBL Prediction. Predict OBL during inspection and 2 look every scramble.",
        description: "The most cutting-edge method right now. Requires strong foundation " +
          "of CSP and fast tracing. If you are trying to learn it, you almost certainly " +
          "go off the major tutorials and tweak things to your liking at some point. " +
          "You can also use the concepts from OBLP to do CO prediction (COP) or partial " +
          "COP (PCOP).",
        resources: [
          {
            title: "OBLP Tutorial",
            url: "https://youtu.be/Y5i1ZeHtrCY&list=PL8Izpzk-6ziyXXgFj8zuBfGFpduPSI2av",
            type: "video",
            credit: "- Matt",
            path: "mattv",
            description: "",
            featured: true
          },
          {
            title: "OBLP Organizer",
            url: "https://docs.google.com/spreadsheets/d/1xvVfpSOhPmbBlxMmQDn9CIr3XFOiThlHFZvKn8BtOSM/edit",
            type: "doc/sheet",
            credit: "- Matt",
            path: "matto",
            description: ""
          },
          {
            title: "OBLP Sheet",
            url: "https://docs.google.com/spreadsheets/d/13S_-ylwRx7UbaNvzWgwpIoAoxIufZtk9y9SDtWDBXK8/edit",
            type: "doc/sheet",
            credit: "- Matt",
            path: "matts",
            description: "Spreadsheet version of the video tutorials."
          },
          {
            title: "OBLP Trainer",
            url: "https://squan-go.web.app/oblp/",
            type: "website",
            credit: "- Abid",
            path: "sqg",
            description: "Under development."
          },
          {
            title: "OBLP Visualization Trainer",
            url: "https://oblp.cubegym.net/#/",
            type: "trainer",
            credit: "- Calvin",
            path: "calvinv",
            description: "A visualization trainer supporting 3 different naming schemes."
          },
          {
            title: "OBLP Scheme Generator",
            url: "https://oblp.cubegym.net/#/generate",
            type: "website",
            credit: "- Calvin",
            path: "calvins",
            description: "Visually see the schemes that your alg generates, in 3 different " +
              "naming schemes."
          },
          {
            title: "OBLP Sheet",
            url: "https://docs.google.com/spreadsheets/d/1tSjXvXOwTlrqMaFGRucWFQnrQZAgxuFKbMCizTxJRko/edit",
            type: "doc/sheet",
            credit: "- Oxzowachi",
            path: "ox",
            description: "The OG tutorial for OBLP."
          }
        ]
      }
    },
  },
  "lin": {
    title: "Lin",
    bait: "A fun method, kinda like Roux. Also fast.",
    description: "The steps of Lin doesn't have much variation. They are: CSP, FB, SB, PLL+1.",
    "f2b": {
      title: "First Two Blocks",
      bait: "Build two Roux-style blocks on the bottom.",
      description: "Efficiency is key.",
      resources: [
        {
          title: "FB Tutorial",
          url: "https://youtu.be/6rLfvkKNG4U&list=PLDueljRn_QcuuyX1_F9XJRtZGkVbP45ZJ",
          type: "video",
          credit: "- Ricci",
          path: "riccifb",
          description: "Explains the basics of lin blockbuilding well to a beginner.",
          featured: true
        },
        {
          title: "SB Tutorial",
          url: "https://youtu.be/JJPezT2rUMg&list=PLDueljRn_QcuuyX1_F9XJRtZGkVbP45ZJ",
          type: "video",
          credit: "- Ricci",
          path: "riccisb",
          description: "Does well to explain how SB solving works, as well as introducing " +
            "the concept of solving the DB edge along with SB, which is something that " +
            "becomes very, very important to learn as you get better at lin.",
          featured: true
        },
        {
          title: "Blockbuilding Tips",
          url: "https://youtu.be/vFUJsh98SMI",
          type: "video",
          credit: "- Helmer",
          path: "helmer",
          description: "A very useful video with good tips on how to solve blocks " +
            "efficiently. This talks about SBEC as well, though it is debatable how " +
            "useful that is these days."
        },
        {
          title: "Blockbuilding Trick",
          url: "https://youtu.be/DRdXLxoex7A&",
          type: "video",
          credit: "- Ricci",
          path: "riccit",
          description: "A trick that's touched upon in Ricci's SB video and Helmer's " +
            "video, but expanded upon here. This is a very, very important trick to learn " +
            "and get used to, as it just makes your solves so much smoother without " +
            "having to pause to recognize how to M2 your DB edge into its slot. Getting " +
            "used to it also helps transition you into using OPLL+1 in your solves."
        },
        {
          title: "FB walkthrough",
          url: "https://youtu.be/DmYYwFBrd7c",
          type: "video",
          credit: "- Ricci",
          path: "riccif",
          description: "Shows you every single FB case, and how best to solve them. " +
            "These are very useful in showing you strategies and techniques to solve " +
            "blocks. It is more useful to watch them and see the general patterns in " +
            "solving, rather than trying to learn every single solution individually."
        },
        {
          title: "SB walkthrough",
          url: "https://youtu.be/MbWln-qty68",
          type: "video",
          credit: "- Ricci",
          path: "riccis",
          description: "Shows you every single SB case, and how best to solve them. " +
            "These are very useful in showing you strategies and techniques to solve " +
            "blocks. It is more useful to watch them and see the general patterns in " +
            "solving, rather than trying to learn every single solution individually."
        },
        {
          title: "SB + SBEC Doc",
          url: "https://docs.google.com/document/d/13GrwFubdDdS0RwIPnyAWzjhsncpvlPWexx9jpYvX09g/edit",
          type: "doc/sheet",
          credit: "- Marco",
          path: "sbec",
          description: "A useful resource for looking up optimal SB solutions when " +
            "you're struggling to come up with one yourself. The utility of SBEC these " +
            "days is very debatable, perhaps not useful at all."
        }
      ]
    },
    "l9p": {
      title: "PLL / PLL+1",
      bait: "Solve the cube after F2B.",
      description: "You can either do CP+DF and EPLL, or PLL+1.",
      resources: [
        {
          title: "Lin Algs",
          url: "https://docs.google.com/spreadsheets/d/1ur-PKtSKZgyADCqAoSYEopCjRjMNliRStA6y2GJhlcY/edit",
          type: "doc/sheet",
          credit: "- Adrien & Ben",
          path: "ab",
          description: "The big one. Has just about every lin algset you might need, " +
            "including PLL, PLL+1, OPLL, OPll+1, SBEC, and beginner algs.",
          featured: true
        },
        {
          title: "CP+DF Tutorial",
          url: "https://youtu.be/432HNoTKLWg&list=PLDueljRn_QcuuyX1_F9XJRtZGkVbP45ZJ",
          type: "video",
          credit: "- Ricci",
          path: "riccicpdf",
          description: "Perfectly fine algs, explained well. Does its job.",
          featured: true
        },
        {
          title: "EPLL Tutorial",
          url: "https://youtu.be/NyUiDwjC0fo&list=PLDueljRn_QcuuyX1_F9XJRtZGkVbP45ZJ",
          type: "video",
          credit: "- Ricci",
          path: "ricciepll",
          description: "Perhaps a bit outdated, the only problems being that it shows " +
            "the 8 slice H perm and the shield/square U perm algs.",
          featured: true
        },
        {
          title: "PLL Algs",
          url: "https://www.sonyc-cuber.com/tutorials/PLL.html",
          type: "website",
          credit: "- Ricci",
          path: "riccipll",
          description: "A good source of algs that you should use in conjunction with " +
            "Adrien and Ben's sheet to find algs that suit you."
        },
        {
          title: "PLL+1 Algs",
          url: "https://www.sonyc-cuber.com/tutorials/PLL+1.html",
          type: "website",
          credit: "- Ricci",
          path: "riccipll1",
          description: "A good source of algs that you should use in conjunction with " +
            "Adrien and Ben's sheet to find algs that suit you."
        },
        {
          title: "Lin Algs",
          url: "https://docs.google.com/spreadsheets/d/1xdMMw402OPVOKW2cGhnz4wPgWWGo51pJlRQpKlNk4xY/edit",
          type: "doc/sheet",
          credit: "- Ben",
          path: "ben",
          description: "A good source of some alternative algs if you feel the ones " +
            "from Adrien's Lin algs aren't to your liking."
        },
        {
          title: "EPLL, PLL, PLL+1, CP Trainer",
          url: "https://squanmate.cuber.pro/#/algorithm-trainer",
          type: "trainer",
          credit: "- Squanmate",
          path: "squanmate",
          description: "The only lin trainer out there, and serves its purpose well with " +
            "just a few kinks here and there. The PLL+1 trainer gives you the wrong D " +
            "layer angle, which you have to adjust every time, and the cases are all in a " +
            "weird naming scheme that nobody uses anymore. Adrien's sheet has numbers " +
            "next to each PLL+1 case, which tells you which case in this trainer it is. " +
            "There are also numbers for the OPLL+1 cases as well, which tell you the " +
            "equivalent PLL+1 cases that you can turn into OPLL+1 cases by M2ing the top " +
            "edge into the DB.",
          featured: true
        }
      ]
    }
  },
  "karn": {
    title: "Notation",
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
  },
  "misc": {
    gridLayout: true,
    title: "Miscellaneous Resources",
    bait: "Solvers, image genners, and more!",
    "alg": {
      gridLayout: true,
      title: "Alg Genners",
      bait: "Generate your own algs!",
      description: "All the alg genners and helpers out there.",
      resources: [
        {
          title: "Sq1Optim v2",
          url: "https://github.com/Mattttttttttttttttttttttttttttttt/sq1opt",
          type: "code",
          credit: "- Matt & Abid & Michael & Jaap",
          path: "v2",
          description: "Best solver currently.",
          featured: true
        },
        {
          title: "Alg Genner Library",
          url: "https://github.com/Abid-speedcuber/sq1-scramble-genner",
          type: "code",
          credit: "- Abid & Matt & Shuang Chen",
          path: "lib",
          description: "A ton of tools for programmers."
        },
        {
          title: "Alg Normalizer",
          url: "https://github.com/Mattttttttttttttttttttttttttttttt/rubiks-cube-tools/blob/main/sq1normalizer.py",
          type: "code",
          credit: "- Matt",
          path: "norm",
          description: "honestly useless, will be making a better one soon",
        },
        {
          title: "Sq1Optim v1",
          url: "https://www.jaapsch.net/puzzles/square1.htm#progs",
          type: "code",
          credit: "- Jaap",
          path: "v1",
          description: "DO NOT USE. Use the v2 instead.",
        }
      ]
    },
    "draw": {
      gridLayout: true,
      title: "Image Genners",
      bait: "Generate squan images!",
      resources: [
        {
          title: "SquanGo Image Genner",
          url: "https://squan-go.web.app/draw/",
          type: "website",
          credit: "- Abid & Matt",
          path: "das",
          description: "The best image genner, complete with two designs.",
          featured: true
        },
        {
          title: "Image Genner",
          url: "https://sq1-img-gen-gold-grass.reflex.run/",
          type: "website",
          credit: "- Seby",
          path: "seby",
          description: "Has weird unresponsive glitches, but gets the job done most of the " +
            "time."
        },
        {
          title: "Image Genner 1",
          url: "https://wol4rwwr5d.execute-api.us-east-1.amazonaws.com/default/get_image?alg=",
          type: "website",
          credit: "- Stepan",
          path: "stepanh",
          description: "This is where all the OG images came from. Edit URL to use."
        },
        {
          title: "Image Genner 2",
          url: "https://wol4rwwr5d.execute-api.us-east-1.amazonaws.com/default/get_image3?alg=",
          type: "website",
          credit: "- Stepan",
          path: "stepanv",
          description: "This is... another one. Edit URL to use."
        }
      ]
    },
    "mods": {
      gridLayout: true,
      title: "Squan Mods",
      bait: "Mod your squan to make it better.",
      description: "Some common mods you will hear mentioned (in order): maglev, slice " +
        "mod, edge magnets, full U/D, DSR (Double Slice Repulsion), corner-to-edge.",
      resources: [
        {
          title: "Paper Polishing Tutorial",
          url: "https://youtu.be/N8A_WZMMEMk",
          type: "video",
          credit: "- Michal",
          path: "polish",
          description: "Polish your matte cubes to make them feel A LOT better!",
          featured: true
        },
        {
          title: "Maglev Tutorial",
          url: "https://youtu.be/_Ew54m8614M",
          type: "video",
          credit: "- Cube Master",
          path: "maglev",
          description: "Maglev is an ABSOLUTE essential to high level solving.",
          featured: true
        },
        {
          title: "Slice Mod Tutorial",
          url: "https://youtu.be/focj2OUFCF8",
          type: "video",
          credit: "- Oxzowachi",
          path: "slice",
          description: "Takes out ONE slice magnet to make slice magnets weaker, thereby " +
            "making the slice feel smoother.",
          featured: true
        },
        {
          title: "Partial U/D & Edge Magnets Tutorial",
          url: "https://youtu.be/5pbvZje4RH0",
          type: "video",
          credit: "- Isaac",
          path: "isaac",
          description: "Basically teaches you how to mod a /B squan. Includes polishing, " +
            "partial U/D, and edge magnets."
        },
        {
          title: "Full Mod Tutorial",
          url: "https://youtu.be/X74OVvD8OYs",
          type: "video",
          credit: "- Jad",
          path: "jad",
          description: "Includes maglev, edge magnets, U/D repulsion, and slice repulsion."
        }
      ]
    },
    "lore": {
      gridLayout: true,
      title: "Squan Lore",
      bait: "Are you ready to go down this rabbit hole?",
      resources: [
        {
          title: "Squan Puzzle Page",
          url: "https://www.jaapsch.net/puzzles/square1.htm",
          type: "website",
          credit: "- Jaap",
          path: "og",
          description: "In one word: lore."
        },
        {
          title: "Podcase Episode with Lars Vandenbergh",
          url: "https://youtu.be/qpvMovvSpTE",
          type: "video",
          credit: "- Jaap & Brandon",
          path: "podcast",
          description: "A hour-long podcast with the inventer of the VDB method."
        }
      ]
    },
    resources: [
      {
        title: "SquanGo Everything Trainer",
        url: "https://squan-go.web.app/squanGo/",
        type: "trainer",
        credit: "- Abid",
        path: "sqx",
        description: "IN DEVELOPMENT"
      }
    ]
  }
};
