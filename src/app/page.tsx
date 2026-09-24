import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <div className="mx-auto flex max-w-[1200px] flex-col gap-24 px-6 pt-16">
        <Hero />
        <Projects />
        <Experience />
      </div>
      <Contact />
    </>
  );
}
