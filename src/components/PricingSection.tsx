import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PricingSection = () => {
  const plans = [
    {
      name: 'Free Trial',
      price: '$0',
      period: '/3 days',
      icon: Sparkles,
      features: ['5 signals per day', 'Basic analysis'],
      buttonText: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Premium',
      price: '$39',
      period: '/month',
      icon: Zap,
      features: ['50% of all signals', 'Full analysis', 'Email support'],
      buttonText: 'Subscribe',
      popular: true,
    },
    {
      name: 'Pro',
      price: '$69',
      period: '/month',
      icon: Crown,
      features: ['100% of all signals', 'Full analysis', 'Priority support', 'API access'],
      buttonText: 'Subscribe',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-12 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">Simple Pricing</h2>
          <p className="text-muted-foreground">Choose the plan that fits your trading style</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl border bg-card text-center hover:shadow-hover hover:-translate-y-1 transition-all duration-300 group ${
                plan.popular ? 'border-2 border-success/50 relative' : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-success text-success-foreground text-xs font-medium rounded-full">
                  Popular
                </div>
              )}

              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-110">
                <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-success' : 'text-foreground'}`} />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>

              <div className="mb-4">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>

              <div className="space-y-2 text-left mb-5">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-success hover:bg-success/90 text-success-foreground'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
