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
        answer:
          "LogicQuest is a single-player logic puzzle game that challenges your reasoning skills with cause-and-effect puzzles, rewards achievements as NFTs, and integrates Starknet for on-chain gameplay.",
      },
      {
        question: "How do I start playing?",
        answer:
          "To start playing LogiQuest, simply download the game from our website, create an account, and follow the tutorial to learn the basics.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship our merchandise internationally. Please check our shipping policy for more details on delivery times and costs.",
      },
      {
        question: "What game modes are available?",
        answer:
          "LogiQuest offers several game modes including Solo Mode, Challenge Mode, and Time Attack Mode, each providing a unique gameplay experience.",
      },
      {
        question: "How are scores calculated?",
        answer:
          "Scores in LogiQuest are calculated based on the number of puzzles solved, the time taken to complete them, and any bonuses earned through achievements.",
      },
      {
        question: "Can I play with friends?",
        answer:
          "Currently, LogiQuest is a single-player game, but we are exploring options for multiplayer features in future updates.",
      },
      {
        question: "What are lifelines?",
        answer:
          "Lifelines are special hints that can help you solve puzzles. You can earn them by completing challenges or purchasing them in the game store.",
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
    <section className="flex flex-col gap-[115px] bg-slate-950 text-white font-inter">
      <h2 className="font-bold text-[45px]">FAQs</h2>
      {/* FAQ container */}
      <div className="flex flex-col">
        {faqs.map((faq, index) => (
          <div key={index} className="flex flex-col">
            <div
              className="cursor-pointer flex justify-between py-6 px-8"
              onClick={() => toggleAccordion(index)}
            >
              <h3 className="text-[33px] font-semibold">{faq.question}</h3>
              <span>
              <svg
          className={`w-8 h-8 transition-transform duration-300 ${
            index == expandedIndex ? "rotate-180" : "rotate-0"
          }`}
          viewBox="0 0 180 100"
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          stroke="white"
          strokeWidth="6"
          strokeLinejoin="round"
        >
          <polygon points="10,10 170,10 90,90" />
        </svg>
              </span>
            </div>
            <div
              className={`mx-5 bg-gradient-to-t rounded-md from-gray-800 to-transparent transition-all duration-500 ease-out overflow-hidden text-lg text-gray-300 ${
                expandedIndex === index
                  ? "max-h-max opacity-100 p-4"
                  : "max-h-0 opacity-0 p-0"
              }`}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqsSection;
