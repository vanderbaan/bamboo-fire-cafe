import { FaqItem } from "@/components/FaqItem";
import type { RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

/**
 * FAQ section — server component. Static heading + list, with each row delegated to the
 * client-side FaqItem so only the toggle UI ships JS. Bails out cleanly when a merchant has
 * no FAQs configured.
 */
export function FAQ({ restaurant }: Props) {
  const { faqs } = restaurant;
  if (faqs.length === 0) return null;

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-surface py-20 md:py-28"
    >
      <div className="container">
        <header className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-brand-bamboo-700">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="font-serif text-3xl leading-tight text-ink md:text-4xl"
          >
            Frequently Asked Questions
          </h2>
        </header>

        <div className="mx-auto mt-12 max-w-3xl">
          {faqs.map((faq) => (
            <FaqItem key={faq.q} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
