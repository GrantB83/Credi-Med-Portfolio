import { Button } from "@/components/ui/button";
import { Shield, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-medical-aid.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />
      <div className="absolute top-20 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 py-20 min-h-screen flex items-center">
        {/* Main Content */}
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
              <Shield className="h-4 w-4" />
              <span>POPIA Secure & Trusted</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-5xl mx-auto">
                Find the right medical aid for you,{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  based on facts
                </span>
                <br />
                – not sales talk
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                24/7 intelligent, unbiased guidance on medical scheme options. 
                Explore plans at your own pace without pressure from brokers.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                <Shield className="h-5 w-5 text-success" />
                <span className="font-medium">POPIA Secure</span>
              </div>
              <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                <Clock className="h-5 w-5 text-success" />
                <span className="font-medium">24/7 Available</span>
              </div>
              <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                <Users className="h-5 w-5 text-success" />
                <span className="font-medium">All Major Schemes</span>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="hero" 
                  size="xl" 
                  className="min-w-[220px] text-lg h-14"
                  onClick={() => navigate('/questionnaire')}
                >
                  Compare Plans
                </Button>
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="min-w-[180px] text-lg h-14"
                  onClick={() => {
                    const element = document.querySelector('#how-it-works');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  How It Works
                </Button>
              </div>
              
              {/* Disclaimer */}
              <div className="max-w-4xl mx-auto">
                <p className="text-sm text-muted-foreground bg-muted/30 backdrop-blur-sm p-4 rounded-xl border border-border/30">
                  <strong>Important Disclaimer:</strong> This platform provides factual comparisons, not personalised financial advice. 
                  We'll never sell your data. Licensed brokers will assist with final decisions and compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Hero Visual Element */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={heroImage} 
                  alt="South African family exploring medical aid options"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 bg-card p-6 rounded-2xl shadow-xl border animate-float">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Always Available</div>
              </div>
              
              <div className="absolute -bottom-8 -left-8 bg-card p-6 rounded-2xl shadow-xl border animate-float" style={{ animationDelay: '1s' }}>
                <div className="text-2xl font-bold text-secondary">100+</div>
                <div className="text-sm text-muted-foreground">Medical Schemes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;