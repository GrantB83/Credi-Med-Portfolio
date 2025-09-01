import { MessageCircle, BarChart3, UserCheck } from "lucide-react";

const ProcessSteps = () => {
  const steps = [
    {
      icon: MessageCircle,
      title: "Answer",
      description: "Complete our simple questionnaire about your healthcare needs and budget.",
      step: "01"
    },
    {
      icon: BarChart3,
      title: "Compare", 
      description: "Get your personalised shortlist of the most suitable medical schemes.",
      step: "02"
    },
    {
      icon: UserCheck,
      title: "Connect",
      description: "Speak with a qualified representative to finalise your application.",
      step: "03"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How CrediMed Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting the right medical aid coverage shouldn't be complicated. 
            Our transparent process makes it simple.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 z-0" />
                )}
                
                {/* Step Card */}
                <div className="relative bg-card p-8 rounded-2xl card-shadow border text-center hover:shadow-lg transition-all duration-300 group hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;