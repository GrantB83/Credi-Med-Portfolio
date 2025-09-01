import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Stethoscope, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const dayToDayOptions = [
  {
    id: 'comprehensive',
    title: 'Comprehensive Day-to-Day Benefits',
    description: 'Full coverage for routine medical expenses',
    benefits: [
      'GP consultations (unlimited)',
      'Specialist consultations',
      'Basic dentistry and optometry',
      'Pathology and radiology',
      'Prescribed medication',
      'Physiotherapy and other therapies'
    ],
    suitable: 'Ideal for families and those who visit doctors regularly',
    premium: 'Higher monthly premium'
  },
  {
    id: 'basic',
    title: 'Basic Day-to-Day Benefits',
    description: 'Essential day-to-day medical cover',
    benefits: [
      'Limited GP consultations',
      'Basic pathology and radiology',
      'Essential prescribed medication',
      'Emergency consultations',
      'Preventive care screenings'
    ],
    suitable: 'Good for healthy individuals with occasional medical needs',
    premium: 'Moderate monthly premium'
  },
  {
    id: 'none',
    title: 'Hospital Cover Only',
    description: 'Focus on hospital and emergency cover',
    benefits: [
      'In-hospital treatment',
      'Emergency medical care',
      'Surgical procedures',
      'Specialist hospital consultations',
      'Hospital medication'
    ],
    suitable: 'Suitable for young, healthy individuals',
    premium: 'Lowest monthly premium'
  }
];

const DayToDayStep = () => {
  const { state, dispatch } = useQuestionnaire();
  const [selectedOption, setSelectedOption] = useState(state.data.dayToDayBenefits || '');

  const handleNext = () => {
    if (selectedOption) {
      dispatch({ type: 'UPDATE_DATA', payload: { dayToDayBenefits: selectedOption } });
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Day-to-Day Medical Benefits</CardTitle>
        <CardDescription>
          Choose the level of day-to-day medical benefits that suits your healthcare needs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {dayToDayOptions.map((option) => (
            <div
              key={option.id}
              className={`relative border rounded-lg p-6 cursor-pointer transition-all hover:border-primary/50 ${
                selectedOption === option.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted'
              }`}
              onClick={() => setSelectedOption(option.id)}
            >
              {selectedOption === option.id && (
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
                  {option.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-2 pt-4 border-t">
                  <div className="text-xs text-muted-foreground">
                    <strong>Best for:</strong> {option.suitable}
                  </div>
                  <div className={`text-xs font-medium px-2 py-1 rounded ${
                    option.id === 'comprehensive' 
                      ? 'bg-red-100 text-red-700'
                      : option.id === 'basic'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {option.premium}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-accent/10 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> Day-to-day benefits have annual limits and may require 
            co-payments. Hospital-only plans offer the most affordable option for emergency coverage.
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!selectedOption}>
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DayToDayStep;