import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "What markets do you track?",
      answer: "We track 50+ prediction markets on Kalshi, including politics, economics, technology, and various important events.",
    },
    {
      question: "How often is the data updated?",
      answer: "Every 10 minutes. Our system continuously monitors and recalculates odds based on the latest data.",
    },
    {
      question: "What does \"Edge\" mean?",
      answer: "Edge is the difference between our AI prediction and market odds. The higher the edge, the greater your potential profit relative to risk.",
    },
    {
      question: "Do I bet through Clairvoyance?",
      answer: "No. We only display analysis. All betting is done directly on the Kalshi platform. We'll redirect you there.",
    },
    {
      question: "How accurate is the AI?",
      answer: "Our AI has a 72% average win rate across all predictions, significantly higher than typical market odds.",
    },
    {
      question: "What's the minimum bet?",
      answer: "Minimum bet is determined by Kalshi, not us. To view analysis on Clairvoyance, there's no minimum at all—it's free!",
    },
  ];

  return (
    <section id="faq" className="py-12 lg:py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-5 bg-card transition-all duration-200 hover:shadow-soft hover:border-accent/50 data-[state=open]:shadow-card data-[state=open]:border-accent/50"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-4 text-foreground transition-colors duration-200 [&[data-state=open]]:text-success">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed animate-fade-in">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
