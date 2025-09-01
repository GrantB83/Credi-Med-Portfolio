import { Shield, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">CrediMed</h3>
            <p className="text-background/80 text-sm">
              South Africa's trusted medical aid comparison platform. 
              Find the right coverage, transparently and securely.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4" />
              <span>POPIA Compliant</span>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <div className="space-y-2 text-sm text-background/80">
              <a href="/about" className="block hover:text-background transition-colors">
                About Us
              </a>
              <a href="/contact" className="block hover:text-background transition-colors">
                Contact
              </a>
              <a href="/questionnaire" className="block hover:text-background transition-colors">
                Get Started
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal & Support</h4>
            <div className="space-y-2 text-sm text-background/80">
              <a href="/privacy" className="block hover:text-background transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="block hover:text-background transition-colors">
                Terms of Service
              </a>
              <div className="flex items-center gap-2 pt-2">
                <Phone className="h-4 w-4" />
                <a href="tel:0800273346" className="hover:text-background transition-colors">
                  0800 CREDIMED
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@credimed.co.za" className="hover:text-background transition-colors">
                  hello@credimed.co.za
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 pt-8 text-center text-sm text-background/60">
          <p>&copy; 2024 CrediMed by Credi. All rights reserved.</p>
          <p className="mt-2">
            Educational information only. Not financial advice. 
            Terms & Conditions apply.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;