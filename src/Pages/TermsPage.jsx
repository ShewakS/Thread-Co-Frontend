const TermsPage = () => (
  <main className="section section-alt">
    <section className="container">
      <header className="page-heading">
        <h1 className="section-title">Terms and Conditions</h1>
        <p className="section-subtitle">Please read these terms before using our website.</p>
      </header>

      <article className="content-block">
        <h3>Orders and Availability</h3>
        <p>
          All orders are subject to stock availability and payment confirmation. We reserve the right to limit
          quantities or cancel orders with incomplete details.
        </p>
      </article>

      <article className="content-block">
        <h3>Payments</h3>
        <p>
          Prices are listed in INR and may change without notice. We process payments through secure gateways and
          require valid payment authorization.
        </p>
      </article>

      <article className="content-block">
        <h3>Returns and Refunds</h3>
        <p>
          Returned products must meet our return condition policy. Approved refunds are processed to the original
          payment method within standard banking timelines.
        </p>
      </article>

      <article className="content-block">
        <h3>Cancellation</h3>
        <p>
          Order cancellations are allowed before dispatch. Once shipped, cancellation may not be possible and return
          policy will apply instead.
        </p>
      </article>

      <article className="content-block">
        <h3>Website Usage and User Responsibility</h3>
        <p>
          Users must provide accurate information and avoid misuse of website content, systems, or services. Any
          fraudulent activity may result in account suspension.
        </p>
      </article>
    </section>
  </main>
);

export default TermsPage;
