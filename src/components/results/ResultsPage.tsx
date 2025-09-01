import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { findMatchingSchemes } from '@/utils/schemeMatching';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, Phone, Mail, Star, TrendingUp, Shield, Heart, Stethoscope, Baby, Pill, CheckCircle, AlertCircle, Users, Calendar, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import type { MedicalScheme } from '@/lib/schemeService';

const ResultsPage = () => {
  const { state } = useQuestionnaire();
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState<MedicalScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<MedicalScheme | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchemes = async () => {
      console.log('ResultsPage: fetchSchemes called with state.data:', state.data);
      try {
        // Use the new service to get matching schemes
        const matchedSchemes = await findMatchingSchemes(state.data);
        console.log('ResultsPage: matchedSchemes received:', matchedSchemes);
        setSchemes(matchedSchemes);
        setSelectedScheme(matchedSchemes[0] || null);
        
        // Track results view
        try {
          await supabase
            .from('analytics_events')
            .insert({
              event_type: 'results_viewed',
              event_data: {
                results_count: matchedSchemes.length,
                budget: state.data.budget,
                chronic_cover: state.data.chronicCover
              },
              page_url: window.location.href,
              user_agent: navigator.userAgent
            });
        } catch (analyticsError) {
          console.error('Analytics error (non-critical):', analyticsError);
        }
      } catch (error) {
        console.error('Error fetching schemes:', error);
        toast({
          title: "Error",
          description: "Failed to load medical schemes. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [state.data, toast]);

  const handleSignup = async () => {
    if (!selectedScheme) {
      toast({
        title: "Please select a scheme",
        description: "Choose one of the medical schemes above to proceed.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      // Submit questionnaire to backend with selected scheme
      const sessionId = sessionStorage.getItem('session_id') || crypto.randomUUID();
      sessionStorage.setItem('session_id', sessionId);
      sessionStorage.setItem('selected_scheme', JSON.stringify(selectedScheme));
      
      const { data, error } = await supabase.functions.invoke('submit-questionnaire', {
        body: { 
          data: { ...state.data, selectedScheme: selectedScheme.id }, 
          sessionId 
        }
      });
      
      if (error) throw error;

      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'scheme_selected',
          event_data: {
            questionnaire_id: data.questionnaire_id,
            lead_id: data.lead_id,
            selected_scheme: selectedScheme.id,
            scheme_name: selectedScheme.scheme_name,
            monthly_premium: selectedScheme.monthly_premium
          },
          page_url: window.location.href,
          user_agent: navigator.userAgent
        });

      toast({
        title: "Plan selected!",
        description: "Complete registration to connect with a broker for your chosen plan.",
      });
      console.log('Navigating directly to registration with selected scheme:', selectedScheme);
      // Store selected scheme for registration
      sessionStorage.setItem('selected_scheme', JSON.stringify(selectedScheme));
      navigate('/registration');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to save your selection',
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your personalized results...</p>
        </div>
      </div>
    );
  }

  const matchedSchemes = schemes;

  return (
    <section className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <h1 className="text-3xl md:text-4xl font-bold">Your Personalized Medical Aid Options</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Based on your preferences, here are the top medical schemes that best match your needs.
            </p>
          </div>

          {/* Disclaimer Banner */}
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-accent">Educational Results</p>
                <p className="text-sm text-muted-foreground">
                  These results are educational and help you explore options. 
                  A qualified representative will assist you to finalize your choice and ensure compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {matchedSchemes.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {matchedSchemes.map((scheme, index) => (
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
                        Best Match
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

                  {/* Scheme Header */}
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
                    {scheme.recommendation_reason && (
                      <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 mt-3">
                        <p className="text-sm text-accent font-medium">Why this matches:</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {scheme.recommendation_reason}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Coverage Indicators */}
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

                  {/* Key Highlights */}
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

                  {/* Actions */}
                  <div className="space-y-3">
                    {scheme.pdf_url ? (
                      <Button variant="outline" className="w-full" size="sm" asChild>
                        <a href={scheme.pdf_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Download Brochure
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" size="sm" disabled>
                        <FileText className="h-4 w-4 mr-2" />
                        Brochure Coming Soon
                      </Button>
                    )}
                    <div className="text-xs text-muted-foreground text-center">
                      {scheme.pdf_url ? 'Official scheme documentation' : 'Contact broker for detailed information'}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground">Loading your personalized results...</p>
              </div>
            </div>
          )}

          {/* Summary Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Your Requirements</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monthly Budget:</span>
                  <span className="font-medium">R{state.data.budget?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Members:</span>
                  <span className="font-medium">
                    {((state.data.dependants?.adults || 0) + (state.data.dependants?.children || 0)) || 1}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Chronic Cover:</span>
                  <span className="font-medium">
                    {state.data.chronicCover ? 'Required' : 'Not needed'}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Next Steps</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Review and compare your shortlisted options</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Register to connect with a qualified broker</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Get personalized assistance within 24 hours</span>
                </div>
              </div>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to proceed with your selection?</h2>
            <p className="text-muted-foreground">
              {selectedScheme 
                ? `You've selected ${selectedScheme.scheme_name} - ${selectedScheme.plan_name}. Connect with a qualified broker to finalize your application.`
                : 'Select a medical scheme above to proceed with your application.'
              }
            </p>
            <Button 
              onClick={handleSignup} 
              size="lg" 
              className="min-w-[200px]" 
              disabled={submitting || !selectedScheme}
            >
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {selectedScheme ? 'Proceed with This Plan' : 'Select a Plan to Continue'}
            </Button>
            {selectedScheme && (
              <p className="text-sm text-muted-foreground">
                Selected: <strong>{selectedScheme.scheme_name} - {selectedScheme.plan_name}</strong> 
                (R{selectedScheme.monthly_premium.toLocaleString()}/month)
              </p>
            )}
          </div>

          {/* Final Disclaimer */}
          <p className="text-xs text-center text-muted-foreground bg-muted/30 p-4 rounded-lg">
            <strong>Important:</strong> These results are for educational purposes. 
            Final decisions require guidance from licensed financial services providers. 
            A qualified representative will contact you within 24 hours to assist with your application.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResultsPage;