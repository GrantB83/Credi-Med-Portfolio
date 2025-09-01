export interface QuestionnaireData {
  budget: number;
  hospitalNetwork: string;
  chronicCover: boolean;
  dependants: {
    adults: number;
    children: number;
  };
  dayToDayBenefits: string;
  dspComfort: string;
  province: string;
  lifestyle: {
    area: 'urban' | 'rural';
    isStudent: boolean;
    studentProof?: File | null;
  };
}

export interface MedicalScheme {
  id: string;
  scheme_name: string;
  plan_name: string;
  monthly_premium: number;
  key_highlights: string[];
  coverage_indicators: {
    hospital: number;
    chronic: number;
    dayToDay: number;
    dental: number;
  };
  logo_url?: string;
  pdf_url?: string;
  active: boolean;
  match_score?: number;
  recommendation_reason?: string;
}