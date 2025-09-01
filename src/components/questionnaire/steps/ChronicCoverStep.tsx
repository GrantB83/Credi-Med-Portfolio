import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Heart, ArrowRight, ArrowLeft, CheckCircle, X } from 'lucide-react';

const chronicOptions = [
  {
    value: true,
    title: 'Yes, I need chronic medication cover',
    description: 'I have chronic conditions that require ongoing medication',
    benefits: [
      'Chronic Disease List (CDL) medicines covered',
      'Regular specialist consultations',
      'Pathology and radiology for chronic conditions',
      'Preventive care and screenings'
    ],
    note: 'Essential for diabetes, hypertension, asthma, and other chronic conditions'
  },
  {
    value: false,
    title: 'No chronic medication needed',
    description: 'I don\'t currently take chronic medication',
    benefits: [
      'Lower monthly premiums',
      'Focus on hospital and emergency cover',
      'Basic preventive care included',
      'Can add chronic cover later if needed'
    ],
    note: 'You can upgrade to include chronic cover during annual renewals'
  }
];

const ChronicCoverStep = () => {
  const { state, dispatch } = useQuestionnaire();
  const [needsChronic, setNeedsChronic] = useState<boolean | null>(
    state.data.chronicCover !== undefined ? state.data.chronicCover : null
  );

  const handleNext = () => {
    if (needsChronic !== null) {
      dispatch({ type: 'UPDATE_DATA', payload: { chronicCover: needsChronic } });
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Do you need chronic medication cover?</CardTitle>
        <CardDescription>
          Chronic medication cover helps with ongoing treatment costs for long-term health conditions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {chronicOptions.map((option) => (
            <div
              key={option.value.toString()}
              className={`relative border rounded-lg p-6 cursor-pointer transition-all hover:border-primary/50 ${
                needsChronic === option.value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted'
              }`}
              onClick={() => setNeedsChronic(option.value)}
            >
              {needsChronic === option.value && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="h-5 w-5 text-primary fill-current" />
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    option.value ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {option.value ? (
                      <Heart className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {option.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> {option.note}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-accent/10 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Common chronic conditions:</strong> Diabetes, Hypertension, Asthma, 
            Arthritis, Heart Disease, Thyroid disorders, and other conditions requiring 
            regular medication and specialist care.
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button onClick={handleNext} disabled={needsChronic === null}>
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChronicCoverStep;