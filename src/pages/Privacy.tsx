import Navigation from "@/components/Navigation";
import { Shield, Eye, Lock, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your privacy is our priority. Learn how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Eye,
                title: "Transparent",
                description: "We clearly explain what data we collect and why we need it."
              },
              {
                icon: Lock,
                title: "Secure",
                description: "Your data is encrypted and stored using industry-leading security measures."
              },
              {
                icon: FileText,
                title: "POPIA Compliant",
                description: "We fully comply with South Africa's Protection of Personal Information Act."
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

      {/* Privacy Policy Content */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                  <p className="text-muted-foreground">
                    We collect personal information you provide during our questionnaire process, including:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li>Full name and contact details (email, phone number)</li>
                    <li>Age and family composition</li>
                    <li>Healthcare needs and budget preferences</li>
                    <li>ID number and physical address (for applications)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Automatically Collected Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Website usage data and analytics</li>
                    <li>IP address and browser information</li>
                    <li>Cookies for website functionality</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">How We Use Your Information</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We use your personal information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Medical Aid Matching:</strong> To recommend suitable medical aid schemes based on your needs</li>
                  <li><strong>Broker Services:</strong> To connect you with licensed brokers for application assistance</li>
                  <li><strong>Communication:</strong> To send you relevant scheme information and updates</li>
                  <li><strong>Legal Compliance:</strong> To meet regulatory requirements for financial services</li>
                  <li><strong>Service Improvement:</strong> To enhance our platform and comparison tools</li>
                </ul>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Information Sharing</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We may share your information with:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Licensed Brokers:</strong> To facilitate your medical aid application</li>
                  <li><strong>Medical Schemes:</strong> When you apply for coverage through our platform</li>
                  <li><strong>Service Providers:</strong> Third parties who help us operate our platform</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                </ul>
                <p className="text-muted-foreground">
                  We never sell your personal information to third parties for marketing purposes.
                </p>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Data Security</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We implement comprehensive security measures to protect your information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure servers with regular security updates</li>
                  <li>Access controls and staff training</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Secure document upload and storage</li>
                </ul>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Your Rights (POPIA)</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Under the Protection of Personal Information Act, you have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access your personal information we hold</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Object to the processing of your information</li>
                  <li>Request deletion of your information (where applicable)</li>
                  <li>Lodge a complaint with the Information Regulator</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  To exercise these rights, contact us at privacy@credimed.co.za
                </p>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Contact Information</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy or our data practices:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> privacy@credimed.co.za</p>
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

export default Privacy;