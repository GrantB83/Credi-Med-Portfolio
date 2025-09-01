import { useState } from 'react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TreePine, GraduationCap, ChevronRight, ChevronLeft, Upload } from 'lucide-react';

interface LifestyleData {
  area: 'urban' | 'rural' | '';
  isStudent: boolean;
  studentProof?: File | null;
}

const LifestyleStep = () => {
  const { state, dispatch } = useQuestionnaire();
  const [lifestyle, setLifestyle] = useState<LifestyleData>({
    area: (state.data.lifestyle?.area as 'urban' | 'rural') || '',
    isStudent: state.data.lifestyle?.isStudent || false,
    studentProof: null
  });

  const areaOptions = [
    {
      id: 'urban' as const,
      title: 'Urban / City',
      description: 'Living in major cities or metropolitan areas',
      icon: Building2,
      benefits: ['More specialists available', 'Private hospital networks', 'Shorter wait times']
    },
    {
      id: 'rural' as const,
      title: 'Rural / Small Town',
      description: 'Living in rural areas or smaller communities',
      icon: TreePine,
      benefits: ['Government hospital access', 'Regional specialist networks', 'Travel benefits for specialists']
    }
  ];

  const handleNext = () => {
    if (lifestyle.area) {
      dispatch({ 
        type: 'UPDATE_DATA', 
        payload: { 
          lifestyle: {
            area: lifestyle.area as 'urban' | 'rural',
            isStudent: lifestyle.isStudent,
            studentProof: lifestyle.studentProof
          }
        } 
      });
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const handleAreaSelect = (area: 'urban' | 'rural') => {
    setLifestyle(prev => ({ ...prev, area }));
  };

  const handleStudentToggle = () => {
    setLifestyle(prev => ({ ...prev, isStudent: !prev.isStudent }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLifestyle(prev => ({ ...prev, studentProof: file }));
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto animate-fade-in">
      <CardHeader className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl md:text-3xl">Tell us about your lifestyle</CardTitle>
        <CardDescription className="text-lg">
          This helps us recommend schemes with the right provider networks and benefits for your situation.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Area Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Where do you live?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {areaOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = lifestyle.area === option.id;
              
              return (
                <div
                  key={option.id}
                  className={`p-6 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleAreaSelect(option.id)}
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{option.title}</h4>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Benefits:</p>
                      <ul className="space-y-1">
                        {option.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Student Status</h3>
          <div 
            className={`p-6 rounded-lg border cursor-pointer transition-all duration-200 ${
              lifestyle.isStudent
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={handleStudentToggle}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                lifestyle.isStudent ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold">I am a registered student</h4>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    lifestyle.isStudent 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : 'border-muted-foreground'
                  }`}>
                    {lifestyle.isStudent && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Students often qualify for special rates and discounts on medical aid premiums
                </p>
              </div>
            </div>
          </div>

          {/* Student Proof Upload */}
          {lifestyle.isStudent && (
            <div className="bg-muted/30 border rounded-lg p-4">
              <h4 className="font-medium mb-3">Student Verification</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Upload proof of student status (student card, enrollment letter, or transcript) 
                to qualify for student discounts.
              </p>
              <div className="flex items-center gap-4">
                <label htmlFor="student-proof" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg hover:bg-muted/50 transition-colors">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">
                      {lifestyle.studentProof ? lifestyle.studentProof.name : 'Upload student proof'}
                    </span>
                  </div>
                  <input
                    id="student-proof"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                {lifestyle.studentProof && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLifestyle(prev => ({ ...prev, studentProof: null }))}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Optional: You can also provide this later during registration
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handlePrev} className="min-w-[120px]">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={!lifestyle.area}
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

export default LifestyleStep;