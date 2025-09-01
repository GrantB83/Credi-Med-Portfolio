import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import ContactForm from '@/components/contact/ContactForm';

const Contact = () => {
  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Contact Us - CrediMed Medical Aid Comparison"
        description="Get in touch with our medical aid experts. Free consultation and personalized assistance to find the perfect healthcare coverage."
        keywords="contact medical aid, healthcare consultation, medical aid help, South Africa"
      />
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Get in touch with our medical aid experts for personalized assistance
          </p>
        </div>

        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;