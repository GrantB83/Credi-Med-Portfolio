import Navigation from '@/components/Navigation';
import { QuestionnaireProvider } from '@/contexts/QuestionnaireContext';
import QuestionnaireFlow from '@/components/questionnaire/QuestionnaireFlow';

const Questionnaire = () => {
  return (
    <QuestionnaireProvider>
      <Navigation />
      <QuestionnaireFlow />
    </QuestionnaireProvider>
  );
};

export default Questionnaire;