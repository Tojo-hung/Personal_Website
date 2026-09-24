import Image from "next/image";

import { timeline } from "@/data/site";

export default function Experience() {
  return (
    <section id="timeline" className="flex scroll-mt-6 flex-col">
      <h2 className="t-h2 m-0 mb-6">Where I&apos;ve been</h2>
      {timeline.map((entry) => (
        <div
          key={entry.role}
          className="grid grid-cols-[64px_minmax(0,1fr)] items-start gap-x-4 gap-y-1 border-t border-line py-4 md:grid-cols-[64px_180px_minmax(0,1fr)] md:gap-6"
        >
          <div className="relative row-span-2 h-16 w-16 bg-paper-sunk md:row-span-1">
            <Image src={entry.image} alt="" fill sizes="64px" className="object-cover" />
          </div>
          <span className="text-[13px] leading-[22px] text-ink-muted">{entry.when}</span>
          <div className="max-w-[640px]">
            <div className="font-medium">
              {entry.role} <span className="font-normal text-ink-muted">· {entry.place}</span>
            </div>
            <p className="m-0 mt-1 text-pretty">{entry.line}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
