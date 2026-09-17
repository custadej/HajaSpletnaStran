export type RefImage = { id: string; src: string; w: number; h: number };

export type RefCategory = {
  key: "rubber" | "robots" | "automation";
  pathname: "/reference/gumarska-industrija" | "/reference/robotske-celice" | "/reference/avtomatizacija";
  cover: RefImage;
  sections: { id: string; images: RefImage[] }[];
};

const img = (id: string, src: string, w: number, h: number): RefImage => ({ id, src: `/images/${src}`, w, h });

export const referenceCategories: RefCategory[] = [
  {
    key: "rubber",
    pathname: "/reference/gumarska-industrija",
    cover: img("calenderFront", "ref-calender-front.jpg", 780, 585),
    sections: [
      {
        id: "pneumatic",
        images: [
          img("studio5000", "rubber-studio5000-trend.jpg", 1080, 510),
          img("ftview", "rubber-ftview-silos.jpg", 1080, 608),
          img("cabinetPowerflex", "rubber-cabinet-powerflex.jpg", 810, 1080),
        ],
      },
      {
        id: "mixing",
        images: [
          img("cabinetSiemens", "rubber-cabinet-siemens.jpg", 1080, 1920),
          img("cabinetDrives", "rubber-cabinet-drives.jpg", 810, 1080),
          img("calenderLine", "rubber-calender-line.jpg", 1080, 810),
          img("calenderDrive", "ref-calender-drive.jpg", 780, 586),
          img("calenderFront", "ref-calender-front.jpg", 780, 585),
        ],
      },
    ],
  },
  {
    key: "robots",
    pathname: "/reference/robotske-celice",
    cover: img("lrmate", "robot-lrmate-haas.jpg", 810, 1080),
    sections: [
      {
        id: "tending",
        images: [
          img("lrmate", "robot-lrmate-haas.jpg", 810, 1080),
          img("m20ia", "robot-m20ia-tending.jpg", 810, 1080),
          img("m710ic", "robot-m710ic-lathe.jpg", 674, 504),
          img("overhead", "robot-overhead-cell.jpg", 1080, 810),
          img("gantry", "robot-gantry-line.jpg", 810, 1080),
          img("greyBench", "robot-grey-bench.jpg", 810, 1080),
          img("hmiWelding", "ref-hmi-welding.jpg", 780, 585),
        ],
      },
    ],
  },
  {
    key: "automation",
    pathname: "/reference/avtomatizacija",
    cover: img("liftConveyor", "auto-lift-conveyor.jpg", 1080, 1920),
    sections: [
      {
        id: "lines",
        images: [
          img("controllogix", "auto-cabinet-ab-controllogix.jpg", 810, 1080),
          img("controllogixIo", "auto-controllogix-io.jpg", 810, 1080),
          img("powerflexMcc", "auto-cabinet-powerflex-mcc.jpg", 810, 1080),
          img("mixingPlant", "auto-mixing-plant.jpg", 810, 1080),
          img("panelButtons1", "auto-panel-buttons-1.jpg", 810, 1080),
          img("panelButtons2", "auto-panel-buttons-2.jpg", 810, 1080),
          img("beckhoff", "auto-cabinet-beckhoff.jpg", 810, 1080),
          img("lan", "auto-cabinet-lan.jpg", 810, 1080),
          img("labeling", "auto-labeling-machine.jpg", 810, 1080),
          img("gantryPick", "auto-gantry-pick.jpg", 810, 1080),
          img("dryingLine", "auto-drying-line.jpg", 1080, 1440),
          img("liftConveyor", "auto-lift-conveyor.jpg", 1080, 1920),
          img("siemensEt200", "auto-cabinet-siemens-et200.jpg", 1080, 1920),
        ],
      },
    ],
  },
];

export const referenceByKey = Object.fromEntries(
  referenceCategories.map((c) => [c.key, c]),
) as Record<RefCategory["key"], RefCategory>;
