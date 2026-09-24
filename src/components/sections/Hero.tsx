"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import Typewriter from "@/components/Typewriter";
import { useReducedMotion } from "@/lib/useReducedMotion";

const WORDS = [
  "boats.",
  "hydrofoils.",
  "hull molds out of 3D printed plastic.",
  "grippers for the Canadian Space Agency.",
  "the odd tool for my friends.",
];

const BLINK_MS = 530;

function kingstonNow(now: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Toronto",
      hour: "numeric",
      hourCycle: "h23",
    }).format(now),
  );
  const clock = now
    .toLocaleTimeString("en-US", {
      timeZone: "America/Toronto",
      hour: "numeric",
      minute: "2-digit",
    })
    .toLowerCase();
  const doing =
    hour < 7
      ? "asleep"
      : hour < 9
        ? "looking for coffee"
        : hour < 12
          ? "in class"
          : hour < 13
            ? "eating lunch at my desk"
            : hour < 18
              ? "in the workshop, covered in fibreglass dust"
              : hour < 21
                ? "on the water, or wishing I were"
                : "answering email";
  return { clock, doing };
}

export default function Hero() {
  const still = useReducedMotion();
  const [caretOn, setCaretOn] = useState(true);
  // Client only: the time is unknown during server rendering.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const first = setTimeout(() => setNow(new Date()), 0);
    const id = setInterval(() => {
      setCaretOn((on) => !on);
      setNow(new Date());
    }, BLINK_MS);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const blinkOn = still || caretOn;
  const kingston = now ? kingstonNow(now) : null;

  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-end gap-12">
      <div className="flex max-w-[560px] flex-col gap-6">
        <span className="t-label text-ink-muted">Engineering physics · Queen&apos;s University</span>
        <h1 className="m-0 min-h-[208px] text-[40px] leading-[52px] font-normal tracking-[0.02em] md:min-h-[216px] md:text-[64px] md:leading-[72px]">
          Hi, I&apos;m Thomas. I build{" "}
          <Typewriter
            words={WORDS}
            stillText="boats, foils and the odd tool."
            still={still}
            caretOn={caretOn}
          />
        </h1>
        <p className="m-0 text-ink-muted text-pretty">
          I&apos;m curious about most things, but especially what materials do under load, and how
          to make something fast that doesn&apos;t cost the lake. Have a look around.
        </p>
        <p
          className="m-0 flex items-baseline gap-2 text-[13px] leading-[22px] text-ink-muted"
          style={{ visibility: kingston ? "visible" : "hidden" }}
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 flex-none rounded-full bg-ai"
            style={{ opacity: blinkOn ? 1 : 0.35 }}
          />
          <span>
            Right now it&apos;s{" "}
            <span className="text-ink tabular-nums">{kingston?.clock ?? "12:00 pm"}</span>{" "}
            in Kingston, so I&apos;m probably {kingston?.doing ?? "in class"}.
          </span>
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#work" className="btn btn-primary">
            See what I&apos;m making
          </a>
          <a href="#hello" className="btn btn-secondary">
            Say hello
          </a>
        </div>
      </div>
      <div className="relative aspect-[4/5] w-full max-w-[440px] justify-self-end bg-hinoki">
        <Image
          src="/images/Profile_Photo.jpg"
          alt="Thomas, smiling, outdoors"
          fill
          priority
          sizes="(min-width: 768px) 440px, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
