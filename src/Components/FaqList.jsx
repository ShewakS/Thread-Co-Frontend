import { useState } from 'react';

const FaqList = ({ items }) => {
  const [openMap, setOpenMap] = useState({});

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = Boolean(openMap[index]);
        return (
          <article key={item.question} className={`faq-item ${isOpen ? 'open' : ''}`}>
            <button
              className="faq-question"
              onClick={() => setOpenMap((prev) => ({ ...prev, [index]: !isOpen }))}
              aria-expanded={isOpen}
            >
              {item.question}
            </button>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default FaqList;
