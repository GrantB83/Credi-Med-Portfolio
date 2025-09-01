import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle } from 'lucide-react';

const stepLabels = [
  'Budget',
  'Hospital Network', 
  'Chronic Cover',
  'Family Size',
  'Day-to-Day Benefits',
  'Province',
  'Lifestyle',
  'DSP Comfort'
];

const ProgressBar = () => {
  const { state } = useQuestionnaire();
  const progress = (state.currentStep / state.totalSteps) * 100;

  return (
    <div className="mb-8 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Medical Aid Questionnaire</h1>
        <div className="text-sm text-muted-foreground">
          Step {state.currentStep} of {state.totalSteps}
        </div>
      </div>

      <Progress value={progress} className="h-2" />
      
      <div className="hidden md:flex justify-between items-center text-xs">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < state.currentStep;
          const isCurrent = stepNumber === state.currentStep;
          
          return (
            <div 
              key={label}
              className={`flex items-center gap-2 ${
                isCurrent 
                  ? 'text-primary font-medium' 
                  : isCompleted 
                    ? 'text-green-600' 
                    : 'text-muted-foreground'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Circle className={`h-4 w-4 ${isCurrent ? 'fill-current' : ''}`} />
              )}
              <span className="hidden lg:inline">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;