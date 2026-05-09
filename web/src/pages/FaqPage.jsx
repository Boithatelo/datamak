import PageHeader from "../components/PageHeader";

const FAQS = [
  {
    q: "Do you support both physical products and hosting subscriptions?",
    a: "Yes. Datamak supports integrated checkout for hardware, software, and hosting plans."
  },
  {
    q: "How does payment work in this project?",
    a: "Payment is simulated for demonstration but the flow mirrors real-world checkout UX."
  },
  {
    q: "Can I track my order status?",
    a: "Yes. Order timeline includes Pending, Paid, Processing, Shipped, and Delivered states."
  },
  {
    q: "Do you offer support after purchase?",
    a: "Yes. We provide support channels for hardware setup, software licensing, and hosting."
  }
];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "FAQ" }]}
        title="Frequently Asked Questions"
        subtitle="Quick answers about ordering, delivery, and hosting services."
        fallback="/"
      />
      <section className="panel faq-list">
        {FAQS.map((faq) => (
          <article key={faq.q} className="faq-item">
            <h3>{faq.q}</h3>
            <p className="muted">{faq.a}</p>
          </article>
        ))}
      </section>
    </>
  );
}
