import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import ProgressBar from './ProgressBar';
import BudgetStep from './steps/BudgetStep';
import HospitalNetworkStep from './steps/HospitalNetworkStep';
import ChronicCoverStep from './steps/ChronicCoverStep';
import DependantsStep from './steps/DependantsStep';
import DayToDayStep from './steps/DayToDayStep';
import ProvinceStep from './steps/ProvinceStep';
import LifestyleStep from './steps/LifestyleStep';
import DSPStep from './steps/DSPStep';

const QuestionnaireFlow = () => {
  const { state } = useQuestionnaire();

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <BudgetStep />;
      case 2:
        return <HospitalNetworkStep />;
      case 3:
        return <ChronicCoverStep />;
      case 4:
        return <DependantsStep />;
      case 5:
        return <DayToDayStep />;
      case 6:
        return <ProvinceStep />;
      case 7:
        return <LifestyleStep />;
      case 8:
        return <DSPStep />;
      default:
        return <BudgetStep />;
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <ProgressBar />
          {renderStep()}
        </div>
      </div>
    </section>
  );
};

export default QuestionnaireFlow;