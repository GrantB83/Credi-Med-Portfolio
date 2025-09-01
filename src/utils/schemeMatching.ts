import { SchemeService, type MedicalScheme, type SchemeFilters } from '@/lib/schemeService';
import type { QuestionnaireData } from '@/types/questionnaire';

export const findMatchingSchemes = async (data: Partial<QuestionnaireData>): Promise<MedicalScheme[]> => {
  const filters: SchemeFilters = {
    budget: data.budget,
    chronic: data.chronicCover,
    dependants: data.dependants ? 
      (data.dependants.adults || 0) + (data.dependants.children || 0) : 0,
    dayToDayBenefits: data.dayToDayBenefits,
    dspComfort: data.dspComfort,
    hospitalNetwork: data.hospitalNetwork
  };

  try {
    const schemes = await SchemeService.getSchemes(filters);
    return schemes.slice(0, 3); // Return top 3 matches for results
  } catch (error) {
    console.error('Error finding matching schemes:', error);
    // Return empty array if service fails
    return [];
  }
};