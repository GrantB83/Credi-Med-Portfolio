import Navigation from "@/components/Navigation";
import { Shield, Users, Award, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="text-primary">CrediMed</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            South Africa's trusted medical aid comparison platform, helping thousands find the right healthcare coverage since 2020.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe healthcare should be accessible and affordable for all South Africans. Our mission is to simplify the complex world of medical aid schemes, empowering you to make informed decisions about your family's healthcare coverage.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Trust & Transparency",
                description: "We provide unbiased comparisons with complete transparency about our commission structure."
              },
              {
                icon: Users,
                title: "Expert Guidance",
                description: "Our licensed financial advisors have decades of experience in the medical aid industry."
              },
              {
                icon: Award,
                title: "Quality Service",
                description: "We're committed to providing exceptional service throughout your medical aid journey."
              },
              {
                icon: Heart,
                title: "Client First",
                description: "Your healthcare needs come first. We match you with schemes that truly fit your lifestyle."
              }
            ].map((value, index) => (
              <Card key={index} className="p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
                <value.icon className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary">50,000+</p>
              <p className="text-muted-foreground">Families Helped</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary">15+</p>
              <p className="text-muted-foreground">Medical Schemes</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary">98%</p>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Medical Aid?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let our experts guide you through the process. Get personalized recommendations in just 3 minutes.
          </p>
          <a 
            href="/questionnaire" 
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start Your Journey
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;