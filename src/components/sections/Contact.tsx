export default function Contact() {
  return (
    <section id="hello" className="mx-auto mt-24 w-full max-w-[1200px] scroll-mt-6 px-6">
      <div className="flex flex-col gap-6 border-t border-line bg-paper-sunk p-6 md:p-12">
        <h2 className="t-h2 m-0">Say hello</h2>
        <p className="m-0 max-w-[640px] text-pretty">
          I&apos;m looking for an internship for summer 2027, ideally somewhere working on applied
          physics, mechanical design or aerospace. If that&apos;s you, I&apos;d love to hear what
          you&apos;re building. And if it isn&apos;t, write anyway. I like getting email that
          isn&apos;t a newsletter.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <a href="mailto:23rfs3@queensu.ca" className="btn btn-primary">
            Write to me
          </a>
          <a
            href="https://github.com/tojo-hung"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/thomas-hung-8a3082299"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
