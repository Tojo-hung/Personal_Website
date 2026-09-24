import type { ProjectRecord, TimelineEntry } from "@/types/projects";

export const projects: ProjectRecord[] = [
  {
    id: "aquafoil",
    title: "aQuaFoil",
    when: "2026 to 2027",
    role: "Co-founder",
    image: null,
    summary:
      "Some friends and I started a team at Queen's to build a foiling Moth for the SuMoth Challenge 2027. It's one of the fastest, fussiest little sailboats there is, and we're trying to make it out of greener materials.",
    bullets: [
      "There are twenty-odd of us now, from all over the faculty. Keeping everyone pointed the same way is most of my week.",
      "I'm setting up the CFD in OpenFOAM, chasing drag down one mesh at a time.",
      "Ansys tells us how our composites should hold up under about 400 kg of load. We'll find out for real on the water.",
    ],
    gallery: [],
    tools: "OpenFOAM · Ansys · Rhino · Python",
    links: [
      { label: "aquafoil.ca", href: "https://www.aquafoil.ca/" },
      { label: "Hull design on GitHub", href: "https://github.com/Tojo-hung/Hull_Design" },
    ],
  },
  {
    id: "aquatonomous",
    title: "aQuatonomous",
    when: "2024 to 2026",
    role: "Mechanical director",
    image: "/images/aquatonomous-hero.jpg",
    summary:
      "Queen's autonomous boat team, for the RoboBoat competition. I looked after everything mechanical, from the first SolidWorks sketch to the first wet test.",
    bullets: [
      "We printed the hull mold in segments on ordinary FDM printers and glued them into one full-size mold. It worked better than it had any right to.",
      "An aluminium crossbeam carries the IMU, the electronics and the thrusters, and comes apart when we need it to.",
      "A lot of the job was making sure the electrical team's wires had somewhere sensible to go.",
    ],
    gallery: ["/images/aq-layup.jpg", "/images/aq-water.jpg", "/images/aq-mold.jpg"],
    tools: "SolidWorks · FDM printing · Fibreglass",
    links: [
      { label: "Team site", href: "https://aquatonomous.vercel.app/" },
      { label: "GitHub", href: "https://github.com/aQuatonomous" },
    ],
    model3d: {
      src: "/models/Frontenac_Assembly.glb",
      poster: "/images/aq-assembly.png",
      alt: "Interactive CAD of the aQuatonomous RoboBoat hull assembly",
      label: "Frontenac hull assembly · SolidWorks",
      cameraOrbit: "35deg 68deg 130%",
      cameraTarget: "auto auto auto",
      fieldOfView: "28deg",
    },
  },
  {
    id: "csa-arm",
    title: "CSA robotic arm",
    when: "Winter 2025",
    role: "Designer",
    image: "/images/csa-arm-hero.jpg",
    summary:
      "With the Canadian Space Agency, we designed an end-effector that can hang on to oddly shaped payloads, inside a strict size and mass budget.",
    bullets: [
      "FEA led us to fingers based on a fish fin: stiff PLA+ frames with soft TPU pads that wrap around whatever they grab.",
      "We went round the loop many times to shave weight and size.",
      "Then we tested it, and it held on.",
    ],
    gallery: ["/images/csa-fea.png", "/images/csa-assembly.png"],
    tools: "SolidWorks · FEA · FDM printing",
    links: [],
  },
  {
    id: "foil-gauge",
    title: "Windsurf foil gauge",
    when: "2023",
    role: "Maker",
    image: "/images/iqfoil-start.JPG",
    summary:
      "When I was racing iQFOiL, there was no good way to check a wing's angle of attack, and it matters a lot. So I 3D scanned a foil and made a gauge for it.",
    bullets: [
      "It clips on without calibration and gives you a reading in under 30 seconds.",
      "I kept reshaping it until it was easy to use on a cold beach with wet hands.",
      "Then I sold a batch to sailors I'd met at regattas abroad, which was a nice surprise.",
    ],
    gallery: [],
    tools: "3D scanning · Fusion 360 · FDM printing",
    links: [],
    model3d: {
      src: "/models/foil-gauge.glb",
      poster: "/images/hero-4.jpg",
      alt: "Interactive CAD of the windsurf foil gauge",
      label: "Foil gauge · Fusion 360",
      cameraOrbit: "20deg 70deg 120%",
      cameraTarget: "auto auto auto",
      fieldOfView: "22deg",
    },
  },
];

export const timeline: TimelineEntry[] = [
  {
    when: "May to Sept 2026",
    role: "Research assistant, NSERC USRA",
    place: "Queen's University",
    image: "/images/NSERC.jpg",
    line: "A summer with Dr. Brad Diak, looking at crystallographic texture in high-purity ytterbium and how stacking fault energy shapes it. More microscope time than I expected, and I loved it.",
  },
  {
    when: "Summers 2024 and 2025",
    role: "Sailing instructor",
    place: "Royal Vancouver Yacht Club",
    image: "/images/RVYC.jpg",
    line: "I taught kids and teens to sail performance dinghies. Planning lessons is fine; watching someone capsize, laugh and get back on is the good part.",
  },
  {
    when: "Dec 2023 and July 2024",
    role: "Team Canada",
    place: "Youth Sailing World Championships",
    image: "/images/ISAF.jpg",
    line: "Raced iQFOiL windsurfing for Canada in Brazil and then Italy. I learned a lot about training plans, and more about jet lag.",
  },
  {
    when: "2022 to 2024",
    role: "Alpine ski racer",
    place: "Vancouver Ski Team, FIS",
    image: "/images/FIS.JPG",
    line: "Top five nationally in U18 across a few disciplines, with downhill and super-G at the 2023 and 2024 NORAM Finals. I waxed my own skis, badly at first.",
  },
];
