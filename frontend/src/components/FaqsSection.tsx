import { useEffect, useState } from "react";

interface Faq {
  question: string;
  answer: string;
}

const FaqsSection = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const loadFaqs = async () => {
    // Simulating an API call to fetch FAQs
    const fetchedFaqs: Faq[] = [
      {
        question: "What is LogiQuest?",
        answer: "Example answer",
      },
      {
        question: "How do I start playing?",
        answer: "Example answer",
      },
      {
        question: "Do you ship internationally?",
        answer: "Example answer",
      },
      {
        question: "What game modes are available?",
        answer: "Example answer",
      },
      {
        question: "How are scores calculated?",
        answer: "Example answer",
      },
      {
        question: "Can I play with friends?",
        answer: "Example answer",
      },
      {
        question: "What are lifelines?",
        answer: "Example answer",
      },
    ];
    setFaqs(fetchedFaqs);
  };

  // Function to fetch the data when component is loaded
  useEffect(() => {
    loadFaqs();
  }, []);

  const toggleAccordion = (index: number) => {
    // this way if you click again it will close the accordion
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="flex flex-col gap-[115px] bg-slate-950 text-white">
      <h2 className="font-bold text-[45px]">FAQs</h2>
      {/* FAQ container */}
      <div className="flex flex-col">
        {faqs.map((faq, index) => (
          <div key={index} className="flex flex-col">
            <div
              className="flex justify-between"
              onClick={() => toggleAccordion(index)}
            >
              <h3 className="text-[33px] font-semibold">{faq.question}</h3>
              <span>{expandedIndex === index ? "-" : "+"}</span>
            </div>
            {expandedIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqsSection;
