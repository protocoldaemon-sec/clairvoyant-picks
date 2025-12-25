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
      answer: "50+ Kalshi prediction markets across politics, economics, and events",
    },
    {
      question: "How often do you update?",
      answer: "Every 10 minutes with fresh AI analysis and edge calculations",
    },
    {
      question: "What does \"edge\" mean?",
      answer: "The difference between AI win rate and market odds—your advantage",
    },
    {
      question: "Do I bet through you?",
      answer: "No—we show you the best markets, you bet directly on Kalshi",
    },
    {
      question: "How accurate is the AI?",
      answer: "Our AI has 72% average win rate across all predictions, significantly higher than market odds",
    },
    {
      question: "What's the minimum bet?",
      answer: "Depends on Kalshi's requirements—we have no minimum to use our platform",
    },
  ];

  return (
    <section id="faq" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
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
