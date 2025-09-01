import { Check, Shield, FileText, Users2 } from "lucide-react";

const TrustMarkers = () => {
  const trustFeatures = [
    {
      icon: Shield,
      title: "POPIA Compliant",
      description: "Your personal information is protected according to South African privacy laws."
    },
    {
      icon: FileText,
      title: "No Spam Promise",
      description: "We only share your details with qualified representatives when you're ready."
    },
    {
      icon: Users2,
      title: "All Major Schemes",
      description: "Compare Discovery, Momentum, Medihelp, Bonitas, and all leading providers."
    },
    {
      icon: Check,
      title: "Transparent Results",
      description: "No hidden fees, no bias. Just honest comparisons to help you decide."
    }
  ];

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Why South Africans Trust CrediMed
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to transparency, security, and putting your needs first.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 bg-gradient-to-br from-success/10 to-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustMarkers;