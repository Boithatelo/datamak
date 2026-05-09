import PageHeader from "../components/PageHeader";

export default function AboutPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
        title="About Datamak Technologies"
        subtitle="Datamak Technologies delivers modern ICT commerce experiences for businesses and professionals. Our platform combines enterprise hardware procurement with digital service subscriptions such as software and cloud hosting."
        fallback="/"
      />
      <section className="panel info-grid">
        <article>
          <h2>Mission</h2>
          <p>Enable smart digital growth through trusted technology products and services.</p>
        </article>
        <article>
          <h2>Vision</h2>
          <p>Become the preferred ICT commerce and hosting partner in the region.</p>
        </article>
        <article>
          <h2>Core Values</h2>
          <p>Innovation, reliability, security, and customer success.</p>
        </article>
      </section>
    </>
  );
}
