import FaqList from '../Components/FaqList';

const faqItems = [
  { question: 'How long does shipping take?', answer: 'Standard shipping takes 3-6 business days across most cities.' },
  { question: 'What is your return policy?', answer: 'You can request returns within 30 days if items are unworn and tags are intact.' },
  { question: 'How can I track my order?', answer: 'Once your order ships, we email a tracking link to your registered email address.' },
  { question: 'Which payment methods do you accept?', answer: 'We accept UPI, credit/debit cards, net banking, and selected wallets.' },
  { question: 'Where can I find the size guide?', answer: 'Each product page includes a size guide section with fit notes and measurements.' },
  { question: 'Do I need an account to place an order?', answer: 'You can checkout as a guest, but creating an account helps track and manage orders faster.' }
];

const FaqPage = () => (
  <main className="section section-alt">
    <section className="container">
      <header className="page-heading">
        <h1 className="section-title">Frequently Asked Questions</h1>
        <p className="section-subtitle">Everything you need to know before you shop.</p>
      </header>
      <FaqList items={faqItems} />
    </section>
  </main>
);

export default FaqPage;
