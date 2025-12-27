import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: 'What markets do you track?',
      answer:
        'We track prediction markets on Kalshi and crypto markets on Binance. This includes politics, economics, technology events, and major cryptocurrencies like BTC, ETH, SOL, and more.',
    },
    {
      question: 'How often is the data updated?',
      answer:
        'Crypto signals update every 5 minutes, and prediction market signals update every 10 minutes. Our AI continuously monitors and recalculates based on the latest data.',
    },
    {
      question: 'What does "Edge" mean?',
      answer:
        'Edge is the percentage difference between our AI prediction and market odds. A higher edge means the market is mispriced, giving you a potential profit opportunity.',
    },
    {
      question: 'What is the difference between Free, Premium, and Pro plans?',
      answer:
        'Free Trial gives you 3 days with 5 signal polls per day. Premium ($39/month) gives you 50% of all signals with full analysis. Pro ($69/month) gives you 100% of all signals plus API access and priority support.',
    },
    {
      question: 'What are signal polls?',
      answer:
        'Signal polls are the number of trading signals you can view per day. Free users get 5, Premium gets half of all available signals, and Pro gets unlimited access to all signals.',
    },
    {
      question: 'How does the AI analysis work?',
      answer:
        'Our AI uses multiple techniques: technical analysis (RSI, MACD, Bollinger Bands), Monte Carlo algorithm for probability estimation, news sentiment analysis, and Kelly criterion for optimal position sizing.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer:
        'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
    },
    {
      question: 'Do you execute trades for me?',
      answer:
        'No, we provide analysis and signals only. You execute trades directly on Kalshi or Binance. We help you make informed decisions with AI-powered insights.',
    },
  ];

  return (
    <section id="faq" className="py-12 lg:py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Got questions? We've got answers.</p>
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
