import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Hospital, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const hospitalNetworks = [
  {
    id: 'comprehensive',
    title: 'Comprehensive Network',
    description: 'Access to all private hospitals and specialists',
    benefits: ['Premium private hospitals', 'Specialist doctors', 'Advanced procedures'],
    recommended: 'Best for comprehensive care'
  },
  {
    id: 'selective',
    title: 'Selective Network',
    description: 'Selected private hospitals with quality care',
    benefits: ['Selected private hospitals', 'Network specialists', 'Standard procedures'],
    recommended: 'Good balance of cost and quality'
  },
  {
    id: 'basic',
    title: 'Basic Network',
    description: 'Essential hospital network coverage',
    benefits: ['Basic private hospitals', 'Emergency care', 'Essential procedures'],
    recommended: 'Cost-effective option'
  }
];

const HospitalNetworkStep = () => {
  const { state, dispatch } = useQuestionnaire();
  const [selectedNetwork, setSelectedNetwork] = useState(state.data.hospitalNetwork || '');

  const handleNext = () => {
    if (selectedNetwork) {
      dispatch({ type: 'UPDATE_DATA', payload: { hospitalNetwork: selectedNetwork } });
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
          <Hospital className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Choose your hospital network</CardTitle>
        <CardDescription>
          Select the hospital network that best suits your medical needs and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          {hospitalNetworks.map((network) => (
            <div
              key={network.id}
              className={`relative border rounded-lg p-6 cursor-pointer transition-all hover:border-primary/50 ${
                selectedNetwork === network.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted'
              }`}
              onClick={() => setSelectedNetwork(network.id)}
            >
              {selectedNetwork === network.id && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="h-5 w-5 text-primary fill-current" />
                </div>
              )}
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{network.title}</h3>
                <p className="text-sm text-muted-foreground">{network.description}</p>
                
                <ul className="space-y-1">
                  {network.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                
                <div className="pt-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {network.recommended}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-accent/10 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> Your hospital network choice affects which hospitals and 
            specialists you can visit. You can usually upgrade during annual renewals.
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!selectedNetwork}>
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalNetworkStep;