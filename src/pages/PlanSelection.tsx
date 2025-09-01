import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowLeft, Download, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import SEOHead from '@/components/SEOHead';
import type { MedicalScheme } from '@/lib/schemeService';

const PlanSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [schemes, setSchemes] = useState<MedicalScheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<MedicalScheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get schemes from navigation state
    const schemesFromState = location.state?.schemes;
    if (schemesFromState && Array.isArray(schemesFromState)) {
      setSchemes(schemesFromState);
      setSelectedScheme(schemesFromState[0] || null);
    } else {
      // Redirect to questionnaire if no schemes data
      navigate('/questionnaire');
      return;
    }
    setLoading(false);
  }, [location.state, navigate]);

  const handleProceed = () => {
    if (!selectedScheme) {
      toast({
        title: "Please select a plan",
        description: "Choose one of the medical schemes to proceed with registration.",
        variant: "destructive"
      });
      return;
    }

    // Store selected scheme for registration
    sessionStorage.setItem('selected_scheme', JSON.stringify(selectedScheme));
    navigate('/registration');
  };

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCoverageText = (percentage: number) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 70) return 'Good'; 
    return 'Basic';
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading your plan options...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Select Your Medical Aid Plan | CrediMed"
        description="Choose from our top recommended medical aid plans that match your needs and budget. Compare coverage and benefits to make the best decision."
        keywords="medical aid plan selection, compare medical schemes, choose medical aid, South Africa health insurance"
      />
      <Navigation />
      
      <section className="py-20 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Results
              </Button>
              
              <h1 className="text-3xl md:text-4xl font-bold">Select Your Medical Aid Plan</h1>
              <p className="text-xl text-muted-foreground">
                Choose the plan that best fits your needs, then complete your registration to connect with a qualified broker.
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {schemes.map((scheme, index) => (
                <Card 
                  key={scheme.id} 
                  className={`relative p-6 space-y-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    selectedScheme?.id === scheme.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedScheme(scheme)}
                >
                  {/* Best Match Badge */}
                  {index === 0 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1">
                        Recommended
                      </Badge>
                    </div>
                  )}

                  {/* Selection Indicator */}
                  <div className="absolute top-4 right-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedScheme?.id === scheme.id 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'border-muted-foreground'
                    }`}>
                      {selectedScheme?.id === scheme.id && (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  {/* Scheme Details */}
                  <div className="text-center space-y-2 pt-4">
                    {scheme.logo_url && (
                      <img 
                        src={scheme.logo_url} 
                        alt={`${scheme.scheme_name} logo`}
                        className="h-12 mx-auto mb-2"
                      />
                    )}
                    <h3 className="text-xl font-bold">{scheme.scheme_name}</h3>
                    <p className="text-muted-foreground">{scheme.plan_name}</p>
                    <div className="text-3xl font-bold text-primary">
                      R{scheme.monthly_premium.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                  </div>

                  {/* Coverage Overview */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Coverage Overview</h4>
                    {[
                      { label: 'Hospital', value: scheme.coverage_indicators.hospital },
                      { label: 'Chronic', value: scheme.coverage_indicators.chronic },
                      { label: 'Day-to-Day', value: scheme.coverage_indicators.dayToDay },
                      { label: 'Dental', value: scheme.coverage_indicators.dental },
                    ].map(({ label, value }) => (
                      <div key={label} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{label}</span>
                          <span className={getCoverageColor(value)}>
                            {getCoverageText(value)}
                          </span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    ))}
                  </div>

                  {/* Key Benefits */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Key Benefits</h4>
                    <ul className="space-y-2">
                      {scheme.key_highlights.slice(0, 3).map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Download Brochure */}
                  {scheme.pdf_url && (
                    <Button variant="outline" className="w-full" size="sm" asChild>
                      <a href={scheme.pdf_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download Brochure
                      </a>
                    </Button>
                  )}
                </Card>
              ))}
            </div>

            {/* Proceed Button */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Continue with your selected plan</h2>
              <p className="text-muted-foreground">
                {selectedScheme 
                  ? `Proceed with ${selectedScheme.scheme_name} - ${selectedScheme.plan_name} to complete your registration.`
                  : 'Please select a medical scheme above to continue.'
                }
              </p>
              <Button 
                onClick={handleProceed} 
                size="lg" 
                className="min-w-[250px]" 
                disabled={!selectedScheme}
              >
                {selectedScheme ? 'Continue with This Plan' : 'Select a Plan to Continue'}
              </Button>
              {selectedScheme && (
                <p className="text-sm text-muted-foreground">
                  Selected: <strong>{selectedScheme.scheme_name} - {selectedScheme.plan_name}</strong> 
                  (R{selectedScheme.monthly_premium.toLocaleString()}/month)
                </p>
              )}
            </div>

            {/* Important Notice */}
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <p className="text-sm text-center text-muted-foreground">
                <strong>Important:</strong> Plan selection is non-binding until final application completion. 
                Our qualified representatives will help you finalize all details during the registration process.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlanSelection;