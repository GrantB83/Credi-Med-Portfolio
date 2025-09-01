import Navigation from "@/components/Navigation";
import { FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <Scale className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Please read these terms carefully before using CrediMed's medical aid comparison service.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: FileText,
                title: "Educational Service",
                description: "Our platform provides educational information to help you compare medical aid schemes."
              },
              {
                icon: CheckCircle,
                title: "Licensed Provider",
                description: "We are a licensed Financial Services Provider regulated by the FSCA."
              },
              {
                icon: AlertTriangle,
                title: "Not Financial Advice",
                description: "Our comparisons are informational. Always consult with licensed brokers for advice."
              }
            ].map((item, index) => (
              <Card key={index} className="p-6 text-center space-y-4">
                <item.icon className="h-10 w-10 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  By accessing and using CrediMed's website and services, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
                <p>
                  If you do not agree to these terms, you should not use our service.
                </p>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">2. Description of Service</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  CrediMed provides an online platform that:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Compares medical aid schemes available in South Africa</li>
                  <li>Collects user preferences through an online questionnaire</li>
                  <li>Provides educational information about medical aid options</li>
                  <li>Connects users with licensed financial services brokers</li>
                  <li>Facilitates the medical aid application process</li>
                </ul>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">3. User Responsibilities</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  When using our service, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Keep your personal information up to date</li>
                  <li>Use the service only for lawful purposes</li>
                  <li>Not share your access credentials with others</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not attempt to interfere with the service's operation</li>
                </ul>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">4. Financial Services Disclosure</h2>
              <div className="space-y-4">
                <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                  <p className="text-sm font-medium text-warning mb-2">Important Disclosure</p>
                  <p className="text-sm text-muted-foreground">
                    CrediMed is a licensed Financial Services Provider (FSP). We earn commission from medical schemes when users successfully join through our platform. This commission does not affect the premiums you pay.
                  </p>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>FSP License Number:</strong> [License Number]</p>
                  <p><strong>Regulatory Body:</strong> Financial Sector Conduct Authority (FSCA)</p>
                  <p><strong>Commission Structure:</strong> We receive commission from medical schemes, not from users</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">5. Limitation of Liability</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our service is provided "as is" and we make no warranties about:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>The accuracy or completeness of scheme information</li>
                  <li>The availability of specific medical aid products</li>
                  <li>The suitability of any particular scheme for your needs</li>
                  <li>The uninterrupted operation of our platform</li>
                </ul>
                <p>
                  We are not liable for any indirect, incidental, or consequential damages arising from your use of our service.
                </p>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">6. Privacy and Data Protection</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which complies with the Protection of Personal Information Act (POPIA).
                </p>
                <p>
                  By using our service, you consent to the collection and use of your information as outlined in our Privacy Policy.
                </p>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">7. Intellectual Property</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  All content on our platform, including text, graphics, logos, and software, is owned by CrediMed or our licensors and is protected by copyright and other intellectual property laws.
                </p>
                <p>
                  You may not reproduce, distribute, or create derivative works from our content without written permission.
                </p>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">8. Termination</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We reserve the right to terminate or suspend your access to our service at any time, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
                </p>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">9. Changes to Terms</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We may modify these terms at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of the service after changes are posted constitutes acceptance of the new terms.
                </p>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">10. Governing Law</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  These Terms of Service are governed by the laws of South Africa. Any disputes will be resolved in the courts of South Africa.
                </p>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Contact Information</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  If you have questions about these Terms of Service:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> legal@credimed.co.za</p>
                  <p><strong>Phone:</strong> 0800 CREDIMED (0800 273 346)</p>
                  <p><strong>Address:</strong> 123 Medical Centre, Cape Town, 8001</p>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;