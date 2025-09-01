import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Users, ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';

const DependantsStep = () => {
  const { state, dispatch } = useQuestionnaire();
  const [dependants, setDependants] = useState({
    adults: state.data.dependants?.adults || 0,
    children: state.data.dependants?.children || 0
  });

  const handleNext = () => {
    dispatch({ type: 'UPDATE_DATA', payload: { dependants } });
    dispatch({ type: 'NEXT_STEP' });
  };

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const updateDependants = (type: 'adults' | 'children', change: number) => {
    setDependants(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + change)
    }));
  };

  const totalDependants = dependants.adults + dependants.children;
  const totalMembers = totalDependants + 1; // +1 for main member

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Family members to cover</CardTitle>
        <CardDescription>
          How many family members will be covered under your medical aid plan?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">
            {totalMembers}
          </div>
          <p className="text-sm text-muted-foreground">
            total member{totalMembers !== 1 ? 's' : ''} (including you)
          </p>
        </div>

        <div className="space-y-6">
          {/* Adults */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Adult Dependants</Label>
            <p className="text-sm text-muted-foreground">
              Spouse, partner, or adult children (over 21)
            </p>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateDependants('adults', -1)}
                  disabled={dependants.adults === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-8 text-center">
                  {dependants.adults}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateDependants('adults', 1)}
                  disabled={dependants.adults >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Children */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Child Dependants</Label>
            <p className="text-sm text-muted-foreground">
              Children under 21 years of age
            </p>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateDependants('children', -1)}
                  disabled={dependants.children === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-8 text-center">
                  {dependants.children}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateDependants('children', 1)}
                  disabled={dependants.children >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick selection buttons */}
        <div className="space-y-3">
          <Label>Common family sizes:</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => setDependants({ adults: 0, children: 0 })}
              className={totalDependants === 0 ? 'border-primary bg-primary/5' : ''}
            >
              Single
            </Button>
            <Button
              variant="outline"
              onClick={() => setDependants({ adults: 1, children: 0 })}
              className={dependants.adults === 1 && dependants.children === 0 ? 'border-primary bg-primary/5' : ''}
            >
              Couple
            </Button>
            <Button
              variant="outline"
              onClick={() => setDependants({ adults: 1, children: 1 })}
              className={dependants.adults === 1 && dependants.children === 1 ? 'border-primary bg-primary/5' : ''}
            >
              Young Family
            </Button>
            <Button
              variant="outline"
              onClick={() => setDependants({ adults: 1, children: 2 })}
              className={dependants.adults === 1 && dependants.children === 2 ? 'border-primary bg-primary/5' : ''}
            >
              Family of 4
            </Button>
          </div>
        </div>

        <div className="bg-accent/10 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Family size affects your monthly premium. 
            Child dependants are typically cheaper to cover than adult dependants.
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button onClick={handleNext}>
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DependantsStep;