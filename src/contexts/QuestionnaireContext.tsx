import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuestionnaireData, MedicalScheme } from '@/types/questionnaire';

interface QuestionnaireState {
  currentStep: number;
  totalSteps: number;
  data: Partial<QuestionnaireData>;
  results: MedicalScheme[];
  isComplete: boolean;
}

type QuestionnaireAction = 
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_DATA'; payload: Partial<QuestionnaireData> }
  | { type: 'SET_RESULTS'; payload: MedicalScheme[] }
  | { type: 'RESET' };

const initialState: QuestionnaireState = {
  currentStep: 1,
  totalSteps: 8,
  data: {},
  results: [],
  isComplete: false,
};

const questionnaireReducer = (state: QuestionnaireState, action: QuestionnaireAction): QuestionnaireState => {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps),
        isComplete: state.currentStep === state.totalSteps,
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
        isComplete: false,
      };
    case 'UPDATE_DATA':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const QuestionnaireContext = createContext<{
  state: QuestionnaireState;
  dispatch: React.Dispatch<QuestionnaireAction>;
} | null>(null);

export const QuestionnaireProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(questionnaireReducer, initialState);

  return (
    <QuestionnaireContext.Provider value={{ state, dispatch }}>
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};