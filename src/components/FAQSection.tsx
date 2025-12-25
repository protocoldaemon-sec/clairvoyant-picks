import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "Pasar apa saja yang dipantau?",
      answer: "Kami memantau 50+ pasar prediksi di Kalshi, termasuk politik, ekonomi, teknologi, dan berbagai event penting lainnya.",
    },
    {
      question: "Seberapa sering data di-update?",
      answer: "Setiap 10 menit. Sistem kami terus memantau dan menghitung ulang peluang berdasarkan data terbaru.",
    },
    {
      question: "Apa itu \"Edge\"?",
      answer: "Edge adalah selisih antara prediksi AI kami dengan odds pasar. Semakin tinggi edge, semakin besar potensi keuntungan Anda dibanding risiko.",
    },
    {
      question: "Apakah saya taruhan melalui Clairvoyance?",
      answer: "Tidak. Kami hanya menampilkan analisis. Semua taruhan dilakukan langsung di platform Kalshi. Kami akan mengarahkan Anda ke sana.",
    },
    {
      question: "Seberapa akurat prediksi AI-nya?",
      answer: "AI kami memiliki rata-rata win rate 72% di semua prediksi, jauh lebih tinggi dari odds pasar pada umumnya.",
    },
    {
      question: "Berapa minimum taruhan?",
      answer: "Minimum taruhan ditentukan oleh Kalshi, bukan kami. Untuk melihat analisis di Clairvoyance, tidak ada minimum sama sekali - gratis!",
    },
  ];

  return (
    <section id="faq" className="py-12 lg:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">
            Pertanyaan Umum
          </h2>
          <p className="text-muted-foreground">
            Punya pertanyaan? Kami punya jawabannya.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-5 bg-card"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-4 text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
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
