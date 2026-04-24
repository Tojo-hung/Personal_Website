"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

type ExperienceEntry = {
  step: string;
  title: string;
  subtitle: string;
  description: ReactNode;
  imageSrc?: string;
  imageAlt: string;
};

const experienceItems: ExperienceEntry[] = [
  {
    step: "May - September 2026",
    title: "USRA Grant Holder",
    subtitle: "Summer Student Research Assistant",
    description: (
      <>
        Summer research position working for{" "}
        <a
          href="https://smithengineering.queensu.ca/directory/faculty/bradley-j-diak.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary-hover"
        >
          Dr. Brad Diak
        </a>
        {" "}researching the crystallographic texture and the role of stacking fault energy effects on texture in high purity Ytterbium (YB).
      </>
    ),
    imageSrc: "/images/NSERC.jpg",
    imageAlt: "USRA Grant Holder - Research Assistant",
  },
  {
    step: "Summer 2024 / Summer 2025",
    title: "Sailing Instructor",
    subtitle: "Sailing Instructor at the Royal Vancouver Yacht Club",
    description: (
      <>
        Coached youth and children sailing camps at the{" "}
        <a
          href="https://www.royalvan.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary-hover"
        >
          Royal Vancouver Yacht Club
        </a>
        {", "}designing lesson plans and leading groups in high-performance dinghy sailing to build technical skills, confidence, and teamwork.
      </>
    ),
    imageSrc: "/images/RVYC.jpg",
    imageAlt: "Sailing Instructor at the Royal Vancouver Yacht Club",
  },
  {
    step: "December 2023 / July 2024",
    title: "ISAF Youth Sailing World Championships",
    subtitle: "Team Canada Representative",
    description:
      "Represented Canada in youth iQFOiL windsurfing at an international level, competing in Brazil (2023) and Italy (2024) while managing elite training plans and performance goals.",
    imageSrc: "/images/ISAF.jpg",
    imageAlt: "ISAF Youth Sailing World Championships",
  },
  {
    step: "2022-2024",
    title: "FIS Alpine Ski Racing",
    subtitle: "Member of the Vancouver Ski Team",
    description:
      "Nationally ranked top-five alpine ski racer (U18) across multiple disciplines. Competed in events including Downhill and Super-G at the 2023 and 2024 NORAM Finals. Sets and pursues performance and fitness goals, demonstrates team leadership, and manages personal equipment.",
    imageSrc: "/images/FIS.JPG",
    imageAlt: "FIS Alpine Ski Racing",
  },
];

function ExperienceMedia({
  item,
  isInView,
  index,
  align,
}: {
  item: ExperienceEntry;
  isInView: boolean;
  index: number;
  align: "left" | "right";
}) {
  const initialX = align === "left" ? -36 : 36;

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: initialX }}
      transition={{
        duration: 0.7,
        delay: 0.28 + index * 0.18,
        ease: "easeOut",
      }}
      className={`relative w-full order-2 pl-16 md:col-span-1 md:row-start-1 md:pl-0 ${align === "left" ? "md:col-start-1 md:mr-auto" : "md:col-start-3 md:ml-auto"
        }`}
    >
      <div className="relative w-full max-w-[36rem] overflow-hidden rounded-[1.65rem] border border-primary/15 bg-surface/70 shadow-[0_18px_55px_rgba(0,0,0,0.28)]">
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            width={0}
            height={0}
            sizes="(min-width: 768px) 40vw, 100vw"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        ) : (
          <div
            role="img"
            aria-label={item.imageAlt}
            style={{ aspectRatio: '4/3' }}
            className="relative flex h-full w-full items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(115,158,201,0.18),_transparent_55%),linear-gradient(135deg,rgba(86,130,177,0.16),transparent_50%,rgba(255,255,255,0.02))]" />
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="absolute inset-[1.15rem] rounded-[1.1rem] border border-dashed border-primary/25 bg-black/20" />
            <div className="relative z-10 rounded-full border border-primary/25 bg-black/45 px-4 py-2 text-center font-mono text-[0.7rem] uppercase tracking-[0.32em] text-primary/80 backdrop-blur-sm">
              Image Placeholder
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 rounded-[1.65rem] ring-1 ring-inset ring-white/6" />
      </div>
    </motion.div>
  );
}

function ExperienceCard({
  item,
  isInView,
  index,
  align,
}: {
  item: ExperienceEntry;
  isInView: boolean;
  index: number;
  align: "left" | "right";
}) {
  const initialX = align === "left" ? -48 : 48;

  return (
    <motion.article
      initial={{ opacity: 0, x: initialX }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: initialX }}
      transition={{
        duration: 0.7,
        delay: 0.16 + index * 0.18,
        ease: "easeOut",
      }}
      className={`relative w-full order-1 pl-16 md:col-span-1 md:row-start-1 md:pl-0 ${align === "left" ? "md:col-start-1 md:mr-auto" : "md:col-start-3 md:ml-auto"
        }`}
    >
      <div className="group relative w-full max-w-[32rem] overflow-hidden rounded-[1.5rem] border border-primary/18 bg-[linear-gradient(180deg,rgba(12,18,25,0.95),rgba(9,13,19,0.88))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.32)] transition-colors duration-300 hover:border-primary/32 md:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(86,130,177,0.18),_transparent_45%)] opacity-80" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="relative z-10 mb-6">
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.32em] text-primary/90">
            {item.step}
          </div>
        </div>

        <div className="relative z-10 space-y-3">
          <h3 className="text-2xl font-bold tracking-tight text-foreground md:text-[2rem]">
            {item.title}
          </h3>
          <p className="text-sm uppercase tracking-[0.22em] text-primary/75">
            {item.subtitle}
          </p>

          <div className="max-w-xl text-base leading-7 text-foreground/72 md:text-[1.02rem]">
            {item.description}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Experience() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="relative overflow-hidden py-24">
      <div className="relative z-10 mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 text-center md:mb-20"
        >
          <div className="mb-3 font-mono text-sm uppercase tracking-[0.34em] text-primary">
            Timeline
          </div>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="pointer-events-none absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/65 via-primary/30 to-transparent md:left-1/2 md:-translate-x-1/2" />
          <div className="pointer-events-none absolute left-6 top-0 bottom-0 w-8 -translate-x-1/2 bg-[radial-gradient(circle,_rgba(86,130,177,0.14),_transparent_70%)] blur-md md:left-1/2" />

          <div className="space-y-10 md:space-y-16">
            {experienceItems.map((item, index) => {
              const textAlign = index % 2 === 0 ? "left" : "right";
              const mediaAlign = textAlign === "left" ? "right" : "left";

              return (
                <div
                  key={item.step}
                  className="relative grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] md:items-center"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.85 }
                    }
                    transition={{
                      duration: 0.45,
                      delay: 0.22 + index * 0.18,
                      ease: "easeOut",
                    }}
                    className="pointer-events-none absolute left-6 top-10 z-20 -translate-x-1/2 md:left-1/2 md:top-1/2 md:-translate-y-1/2"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/35 bg-background/90 shadow-[0_0_26px_rgba(86,130,177,0.28)] backdrop-blur-sm">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_16px_rgba(115,158,201,0.75)]" />
                    </div>
                  </motion.div>

                  <ExperienceCard
                    item={item}
                    isInView={isInView}
                    index={index}
                    align={textAlign}
                  />
                  <ExperienceMedia
                    item={item}
                    isInView={isInView}
                    index={index}
                    align={mediaAlign}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
