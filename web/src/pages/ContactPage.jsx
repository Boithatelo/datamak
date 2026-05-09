import { useState } from "react";
import PageHeader from "../components/PageHeader";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
        title="Contact & Support"
        subtitle="Need assistance with orders, hosting plans, or enterprise procurement? Send us a message."
        fallback="/"
      />

      <section className="panel info-grid">
        <article>
          <h2>Support Channels</h2>
          <p>Email: support@datamak.local</p>
          <p>Phone: +266 0000 0000</p>
          <p>Hours: Mon - Fri, 08:00 - 18:00</p>
        </article>
        <article className="full">
          <h2>Send Message</h2>
          {submitted ? (
            <p className="hint notice">Your message has been submitted successfully.</p>
          ) : (
            <form
              className="form-grid"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <label>
                Full Name
                <input required />
              </label>
              <label>
                Email
                <input type="email" required />
              </label>
              <label>
                Subject
                <input required />
              </label>
              <label>
                Message
                <textarea rows="4" required />
              </label>
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </form>
          )}
        </article>
      </section>
    </>
  );
}
