import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';

const BudgetStep = () => {
  const { state, dispatch } = useQuestionnaire();
  const [budget, setBudget] = useState(state.data.budget || 2500);

  const handleNext = () => {
    dispatch({ type: 'UPDATE_DATA', payload: { budget } });
    dispatch({ type: 'NEXT_STEP' });
  };

  const formatCurrency = (amount: number) => {
    return `R${amount.toLocaleString()}`;
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">What's your monthly budget?</CardTitle>
        <CardDescription>
          Set your preferred monthly premium range to find schemes that fit your budget.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {formatCurrency(budget)}
            </div>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="budget-slider">Monthly Premium Range</Label>
            <Slider
              id="budget-slider"
              value={[budget]}
              onValueChange={(value) => setBudget(value[0])}
              max={10000}
              min={500}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>R500</span>
              <span>R10,000+</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1500, 2500, 4000, 6000].map((amount) => (
              <Button
                key={amount}
                variant={budget === amount ? "default" : "outline"}
                onClick={() => setBudget(amount)}
                className="text-sm"
              >
                {formatCurrency(amount)}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-accent/10 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Higher budgets typically include more comprehensive benefits like 
            day-to-day medical expenses, dental, and chronic medication cover.
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" disabled>
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

export default BudgetStep;