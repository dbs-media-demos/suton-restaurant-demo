import Link from "next/link";

/** Phones only: the words desktop's hero opens around its arch, as a plain block before the manifesto. */
export function PhoneStory({ eyebrow, tagline, sub, story }: { eyebrow: string; tagline: string; sub: string; story: { label: string; title: string; text: string; link: string; href: string } }) {
  return (
    <section className="phone-later [--later-h:360px] wrap hidden pb-5 pt-8 phone:order-6 phone:block" aria-labelledby="story-title">
      <p className="t-eyebrow text-cream/85">{eyebrow}</p>
      <p className="t-serif mt-3 text-[1.5rem] italic leading-tight text-candle">{tagline}</p>
      <p className="mt-2 text-cream/85">{sub}</p>
      <p className="t-eyebrow mt-7 text-candle">{story.label}</p>
      <h2 id="story-title" className="t-h2 mt-2.5">
        {story.title}
      </h2>
      <p className="mt-2.5 text-cream/85">{story.text}</p>
      <Link href={story.href} className="mt-2 inline-block text-candle">
        {story.link} →
      </Link>
    </section>
  );
}
