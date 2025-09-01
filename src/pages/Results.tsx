import Navigation from '@/components/Navigation';
import { QuestionnaireProvider } from '@/contexts/QuestionnaireContext';
import ResultsPage from '@/components/results/ResultsPage';

const Results = () => {
  return (
    <QuestionnaireProvider>
      <Navigation />
      <ResultsPage />
    </QuestionnaireProvider>
  );
};

export default Results;