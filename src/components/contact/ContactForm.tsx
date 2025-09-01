import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getStoredUTMParams } from '@/components/UTMTracker';
import POPIAConsent, { POPIAConsents } from '@/components/POPIAConsent';
import { Loader2, Mail, Phone, MapPin } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [consents, setConsents] = useState<POPIAConsents>({
    dataProcessing: false,
    marketing: false,
    thirdPartySharing: false,
    dataRetention: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consents.dataProcessing) {
      toast({
        title: "POPIA Consent Required",
        description: "Please provide consent for data processing to submit your inquiry.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const utmParams = getStoredUTMParams();
      // Send email confirmation to user
      const { error: emailError } = await supabase.functions.invoke('send-contact-confirmation', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          consents: consents,
          utm_params: utmParams
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
      }

      // Insert into notifications table for admin review
      const { error } = await supabase
        .from('notifications')
        .insert({
          type: 'email',
          recipient: 'admin@credimed.com',
          subject: `Contact Form: ${formData.subject}`,
          content: `
            New contact form submission:
            
            Name: ${formData.name}
            Email: ${formData.email}
            Phone: ${formData.phone}
            Subject: ${formData.subject}
            
            Message:
            ${formData.message}
          `,
          status: 'pending'
        });

      if (error) throw error;

      // Track the contact event
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'contact_form_submitted',
          event_data: {
            subject: formData.subject,
            has_phone: !!formData.phone,
            marketing_consent: consents.marketing,
            utm_source: utmParams.utm_source,
            utm_campaign: utmParams.utm_campaign
          },
          page_url: window.location.href,
          user_agent: navigator.userAgent
        });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setConsents({
        dataProcessing: false,
        marketing: false,
        thirdPartySharing: false,
        dataRetention: false
      });
      
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you soon. Check your email for confirmation.",
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Thank you for your message!</h3>
          <p className="text-muted-foreground mb-4">
            We've received your inquiry and will get back to you within 24 hours.
          </p>
          <Button onClick={() => setSuccess(false)} variant="outline">
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Send us a message</CardTitle>
          <CardDescription>
            Have questions about medical aid? We're here to help you find the perfect plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+27 XX XXX XXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What can we help with?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us more about your medical aid needs..."
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <POPIAConsent 
              onConsentChange={setConsents}
              required={true}
              showDetails={false}
            />
            
            <Button type="submit" className="w-full" disabled={loading || !consents.dataProcessing}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending Message...
                </>
              ) : (
                'Send Message'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Get in touch</CardTitle>
            <CardDescription>
              Reach out to our medical aid specialists for personalized assistance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-muted-foreground">0860 123 456</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">hello@credimed.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Office</p>
                <p className="text-muted-foreground">
                  Cape Town, South Africa<br />
                  Monday - Friday, 8AM - 5PM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            <strong>Quick response guaranteed:</strong> We typically respond to inquiries within 2-4 hours during business hours.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default ContactForm;