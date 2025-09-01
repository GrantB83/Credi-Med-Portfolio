import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Shield, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { findMatchingSchemes } from '@/utils/schemeMatching';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const dspOptions = [
  {
    id: 'high',
    title: 'High Comfort Level',
    description: 'Maximum coverage and peace of mind',
    features: [
      'Premium private hospital rooms',
      'Unlimited specialist consultations',
      'Comprehensive chronic medication',
      'International emergency cover',
      'Executive health screenings',
      'Concierge medical services'
    ],
    suitable: 'For those who want the best possible medical care without financial constraints'
  },
  {
    id: 'medium',
    title: 'Medium Comfort Level',
    description: 'Good balance of coverage and cost',
    features: [
      'Semi-private hospital accommodation',
      'Good specialist network access',
      'Standard chronic medication cover',
      'Regional emergency cover',
      'Annual health screenings',
      'Standard customer service'
    ],
    suitable: 'Perfect balance for most families seeking comprehensive care'
  },
  {
    id: 'basic',
    title: 'Basic Comfort Level',
    description: 'Essential coverage at affordable rates',
    features: [
      'Shared hospital accommodation',
      'Network specialist access',
      'Essential chronic medication',
      'Local emergency cover',
      'Basic preventive care',
      'Standard support services'
    ],
    suitable: 'Cost-effective option for essential medical protection'
  }
];

const DSPStep = () => {
  const { state, dispatch } = useQuestionnaire();
  const [selectedComfort, setSelectedComfort] = useState(state.data.dspComfort || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async () => {
    console.log('handleFinish called, selectedComfort:', selectedComfort);
    if (!selectedComfort) return;

    setLoading(true);
    
    try {
      // Update final data
      const finalData = { ...state.data, dspComfort: selectedComfort };
      console.log('Final questionnaire data:', finalData);
      dispatch({ type: 'UPDATE_DATA', payload: { dspComfort: selectedComfort } });

      // Submit questionnaire via API
      const sessionId = sessionStorage.getItem('session_id') || crypto.randomUUID();
      sessionStorage.setItem('session_id', sessionId);
      console.log('Session ID:', sessionId);

      console.log('Calling submit-questionnaire API...');
      const { data, error } = await supabase.functions.invoke('submit-questionnaire', {
        body: { 
          data: finalData, 
          sessionId 
        }
      });

      if (error) {
        console.error('API Error:', error);
        throw error;
      }

      console.log('API Response:', data);

      // Find matching schemes
      console.log('Finding matching schemes...');
      const matchingSchemes = await findMatchingSchemes(finalData);
      console.log('Matching schemes:', matchingSchemes);
      dispatch({ type: 'SET_RESULTS', payload: matchingSchemes });

      // Navigate to results
      console.log('Navigating to /results...');
      navigate('/results');
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      // Still try to show results with client-side matching
      try {
        console.log('Trying fallback client-side matching...');
        const matchingSchemes = await findMatchingSchemes({ ...state.data, dspComfort: selectedComfort });
        console.log('Fallback matching schemes:', matchingSchemes);
        dispatch({ type: 'SET_RESULTS', payload: matchingSchemes });
        console.log('Navigating to /results (fallback)...');
        navigate('/results');
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        toast.error('Failed to complete questionnaire. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Designated Service Provider (DSP) Comfort</CardTitle>
        <CardDescription>
          Choose your comfort level with DSP networks. This affects your coverage options and premiums.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {dspOptions.map((option) => (
            <div
              key={option.id}
              className={`relative border rounded-lg p-6 cursor-pointer transition-all hover:border-primary/50 ${
                selectedComfort === option.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted'
              }`}
              onClick={() => setSelectedComfort(option.id)}
            >
              {selectedComfort === option.id && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="h-5 w-5 text-primary fill-current" />
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                
                <ul className="space-y-2">
                  {option.features.map((feature, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    <strong>Best for:</strong> {option.suitable}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-accent/10 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>What is DSP?</strong> Designated Service Providers are medical facilities and 
            practitioners contracted with medical schemes to provide services at agreed rates. 
            Higher comfort levels typically mean more provider options and better facilities.
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button onClick={handleFinish} disabled={!selectedComfort || loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {loading ? 'Finding Your Perfect Match...' : 'Get My Results'}
            {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DSPStep;