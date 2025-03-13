import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    id: "getting-started",
    question: "How do I start using LeadGreen?",
    answer: "Create an account and start logging your eco-friendly actions. You'll earn points and grow your virtual plant as you go!",
    icon: "🌱"
  },
  {
    id: "pricing",
    question: "Is LeadGreen free to use?",
    answer: "Yes, LeadGreen is free to sign up and use.",
    icon: "💰"
  },
  {
    id: "verification",
    question: "How does LeadGreen verify eco-friendly actions?",
    answer: "We use a combination of QR code scanning at various university locations, photo verification, and community moderation to ensure the authenticity of logged actions.",
    icon: "✅"
  },
  {
    id: "rewards",
    question: "What kind of rewards can I earn?",
    answer: "You can earn points to grow and customize your virtual plant, compete on leaderboards, and unlock special achievements. Some locations may also offer real-world rewards!",
    icon: "🏆"
  },
  {
    id: "lead-points",
    question: "How can I get more lead points?",
    answer: "You can earn more lead points by consistently logging eco-friendly actions, participating in special challenges, referring friends, and maintaining daily streaks of environmental activities.",
    icon: "💰"
  }
];

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  // Handle opening FAQ from URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const faqIndex = faqs.findIndex(faq => faq.id === hash);
      if (faqIndex !== -1) {
        setExpandedIndex(faqIndex);
        // Scroll to the element
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };
    
    // Check hash on initial load
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleQuestionClick = (index, id) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    // Update URL hash without full page reload
    if (expandedIndex !== index) {
      window.history.pushState(null, '', `#${id}`);
    } else {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  return (
    <section className="w-full py-16 md:py-1 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-black">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">Everything you need to know about LeadGreen</p>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              id={faq.id}
            >
              <motion.div
                className={`
                  bg-white rounded-2xl shadow-lg overflow-hidden
                  border-2 transition-colors duration-300
                  ${expandedIndex === index ? 'border-green-500' : 'border-transparent'}
                `}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => handleQuestionClick(index, faq.id)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{faq.icon}</span>
                    <h3 className="font-semibold text-xl text-gray-800">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus className={`w-6 h-6 ${expandedIndex === index ? 'text-green-500' : 'text-gray-400'}`} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-gray-600">
                        <motion.p
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="text-lg"
                        >
                          {faq.answer}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Help banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl p-6 text-center shadow-lg"
        >
          <div className="flex flex-col items-center gap-4">
            <HelpCircle className="w-12 h-12 text-green-600" />
            <h3 className="text-xl font-semibold text-green-800">Still have questions?</h3>
            <p className="text-green-700">Contact our support team and we'll be happy to help!</p>
            <button className="mt-2 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}