import { useState } from 'react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ChevronRight, ChevronLeft } from 'lucide-react';

const ProvinceStep = () => {
  const { state, dispatch } = useQuestionnaire();
  const [selectedProvince, setSelectedProvince] = useState(state.data.province || '');

  const provinces = [
    { id: 'gauteng', name: 'Gauteng', cities: 'Johannesburg, Pretoria, Soweto' },
    { id: 'western-cape', name: 'Western Cape', cities: 'Cape Town, Stellenbosch, George' },
    { id: 'kwazulu-natal', name: 'KwaZulu-Natal', cities: 'Durban, Pietermaritzburg, Newcastle' },
    { id: 'eastern-cape', name: 'Eastern Cape', cities: 'Port Elizabeth, East London, Mthatha' },
    { id: 'limpopo', name: 'Limpopo', cities: 'Polokwane, Tzaneen, Thohoyandou' },
    { id: 'mpumalanga', name: 'Mpumalanga', cities: 'Nelspruit, Witbank, Middelburg' },
    { id: 'north-west', name: 'North West', cities: 'Mahikeng, Klerksdorp, Rustenburg' },
    { id: 'free-state', name: 'Free State', cities: 'Bloemfontein, Welkom, Kroonstad' },
    { id: 'northern-cape', name: 'Northern Cape', cities: 'Kimberley, Upington, Springbok' }
  ];

  const handleNext = () => {
    if (selectedProvince) {
      dispatch({ 
        type: 'UPDATE_DATA', 
        payload: { province: selectedProvince } 
      });
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto animate-fade-in">
      <CardHeader className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl md:text-3xl">Which province do you live in?</CardTitle>
        <CardDescription className="text-lg">
          This helps us show you medical schemes available in your area and relevant provider networks.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {provinces.map((province) => (
            <div
              key={province.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedProvince === province.id
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedProvince(province.id)}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedProvince === province.id 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground'
                  }`}>
                    {selectedProvince === province.id && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <h3 className="font-semibold">{province.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{province.cities}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-accent">Location Benefits</p>
              <p className="text-sm text-muted-foreground">
                Different provinces have varying healthcare provider networks. 
                We'll show you schemes with strong networks in your area.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handlePrev} className="min-w-[120px]">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={!selectedProvince}
            className="min-w-[120px]"
          >
            Continue
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProvinceStep;