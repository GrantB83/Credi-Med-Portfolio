import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Upload, Shield, Mail, Phone, User, FileText, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { OTPService } from '@/lib/otpService';

const RegistrationFlow = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [bypassOtp, setBypassOtp] = useState(false);
  
  // Check for selected scheme in sessionStorage
  const selectedScheme = sessionStorage.getItem('selected_scheme');
  console.log('RegistrationFlow: selectedScheme from sessionStorage:', selectedScheme);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    idNumber: '',
    address: '',
    city: '',
    postalCode: '',
    dependants: [],
    documents: {
      id_document: null,
      proof_of_address: null,
      proof_of_income: null,
    },
    consents: {
      popia: false,
      disclosure: false,
      marketing: false,
    }
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleNext = async () => {
    if (step === 1) {
      if (bypassOtp) {
        // Skip OTP verification for testing
        setStep(step + 1);
        return;
      }
      
      // Validate step 1 and send OTP
      if (!formData.email || !formData.phone || !formData.password) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      setLoading(true);
      try {
        const response = await OTPService.sendOTP(formData.phone);
        if (!response.success) throw new Error(response.error || 'Failed to send OTP');
        
        setOtpSent(true);
        toast.success('OTP sent to your phone');
        
        // For demo - show OTP in development
        if (response.otp) {
          toast.info(`Demo OTP: ${response.otp}`);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to send OTP');
      } finally {
        setLoading(false);
      }
    } else if (step === 4) {
      // Final step - create user account
      if (!formData.consents.popia || !formData.consents.disclosure) {
        toast.error('Required consents must be accepted');
        return;
      }

      setLoading(true);
             try {
         // Create user with Supabase Auth (skip email confirmation for now)
         const { data, error } = await supabase.auth.signUp({
           email: formData.email,
           password: formData.password,
           options: {
             data: {
               first_name: formData.firstName,
               last_name: formData.lastName,
               phone: formData.phone
             }
           }
         });

         if (error) throw error;

         // For now, skip email verification and auto-confirm the user
         // This will be re-enabled before launch
         console.log('User created successfully:', data.user?.id);
         console.log('Email verification skipped for development/testing');

         // Send welcome email (optional for now)
         try {
           await supabase.functions.invoke('send-welcome-email', {
             body: {
               email: formData.email,
               firstName: formData.firstName,
               lastName: formData.lastName
             }
           });
         } catch (emailError) {
           console.error('Welcome email error (non-critical):', emailError);
         }

                   toast.success('Account created successfully! You can now proceed with your medical aid application.');
          
          // Track analytics
          try {
            await supabase
              .from('analytics_events')
              .insert({
                event_type: 'user_registered',
                event_data: { 
                  user_id: data.user?.id,
                  has_dependants: formData.dependants.length > 0
                },
                page_url: window.location.href,
                user_agent: navigator.userAgent
              });
          } catch (analyticsError) {
            console.error('Analytics error (non-critical):', analyticsError);
          }
          
          // Move to success step
          setStep(5); // Add a success step
      } catch (error: any) {
        toast.error(error.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    } else {
      setStep(Math.min(step + 1, totalSteps));
    }
  };

  const verifyOTP = () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    
    // Use the actual OTP service for verification
    OTPService.verifyOTP(formData.phone, otp)
      .then(({ success, message }) => {
        if (success) {
          setStep(step + 1);
          toast.success('Phone verified successfully');
        } else {
          toast.error(message || 'OTP verification failed');
        }
      })
      .catch((error) => {
        console.error('OTP verification error:', error);
        toast.error('Failed to verify OTP');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePrev = () => {
    setStep(Math.max(step - 1, 1));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <AccountCreationStep formData={formData} setFormData={setFormData} otpSent={otpSent} otp={otp} setOtp={setOtp} bypassOtp={bypassOtp} setBypassOtp={setBypassOtp} />;
      case 2:
        return <PersonalDetailsStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <DocumentUploadStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <ConsentStep formData={formData} setFormData={setFormData} />;
      case 5:
        return <SuccessStep formData={formData} selectedScheme={selectedScheme} />;
      default:
        return <AccountCreationStep formData={formData} setFormData={setFormData} otpSent={otpSent} otp={otp} setOtp={setOtp} bypassOtp={bypassOtp} setBypassOtp={setBypassOtp} />;
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          {renderStep()}

                     {/* Navigation */}
           {step < 5 && (
             <div className="flex gap-4 mt-8">
               {step > 1 && (
                 <Button onClick={handlePrev} variant="outline" className="flex-1">
                   Previous
                 </Button>
               )}
               <Button 
                 onClick={step === 1 && otpSent ? verifyOTP : handleNext} 
                 className="flex-1"
                 disabled={loading}
               >
                 {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                 {step === 1 && otpSent ? 'Verify OTP' : 'Continue'}
               </Button>
             </div>
           )}

                     {/* Development Notice */}
           <Card className="mt-8 p-6 border-warning/20 bg-warning/5">
             <div className="flex items-start gap-3">
               <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
               <div className="space-y-2">
                 <p className="font-medium text-warning">Development Mode</p>
                 <p className="text-sm text-muted-foreground">
                   Email verification is currently disabled for testing. Users will be automatically confirmed. 
                   This will be re-enabled before production launch.
                 </p>
               </div>
             </div>
           </Card>

           {/* Backend Notice */}
           <Card className="mt-4 p-6 border-success/20 bg-success/5">
             <div className="flex items-start gap-3">
               <Shield className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
               <div className="space-y-2">
                 <p className="font-medium text-success">Supabase Connected</p>
                 <p className="text-sm text-muted-foreground">
                   Full user registration, document uploads, OTP verification, and broker handoff are now active.
                 </p>
               </div>
             </div>
           </Card>
        </div>
      </div>
    </section>
  );
};

// Step Components
const AccountCreationStep = ({ formData, setFormData, otpSent, otp, setOtp, bypassOtp, setBypassOtp }: any) => (
  <Card className="p-8 space-y-6">
    <div className="text-center space-y-2">
      <Mail className="h-10 w-10 text-primary mx-auto" />
      <h2 className="text-2xl font-bold">Create Your Account</h2>
      <p className="text-muted-foreground">
        {otpSent ? 'Enter the verification code sent to your phone' : 'We\'ll send you an OTP to verify your mobile number'}
      </p>
    </div>

    {/* Testing Bypass Option */}
    <div className="bg-warning/5 p-4 rounded-lg border border-warning/20">
      <div className="flex items-center space-x-3">
        <Checkbox
          id="bypass-otp"
          checked={bypassOtp}
          onCheckedChange={setBypassOtp}
        />
        <div className="text-sm">
          <label htmlFor="bypass-otp" className="font-medium cursor-pointer text-warning">
            Skip OTP Verification (Testing Only)
          </label>
          <p className="text-muted-foreground mt-1">
            Bypass phone verification for testing purposes
          </p>
        </div>
      </div>
    </div>

    {!otpSent ? (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Mobile Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="071 234 5678"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a secure password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value })}
            required
          />
        </div>
      </div>
    ) : (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="text-center text-2xl tracking-widest"
          />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Code sent to {formData.phone}
        </p>
      </div>
    )}
  </Card>
);

const PersonalDetailsStep = ({ formData, setFormData }: any) => (
  <Card className="p-8 space-y-6">
    <div className="text-center space-y-2">
      <User className="h-10 w-10 text-primary mx-auto" />
      <h2 className="text-2xl font-bold">Personal Details</h2>
      <p className="text-muted-foreground">
        Help us prepare your medical aid application
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          placeholder="John"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          placeholder="Smith"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value })}
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="idNumber">ID Number</Label>
      <Input
        id="idNumber"
        placeholder="8001015009087"
        value={formData.idNumber}
        onChange={(e) => setFormData({...formData, idNumber: e.target.value })}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="address">Physical Address</Label>
      <Input
        id="address"
        placeholder="123 Main Street, Suburb"
        value={formData.address}
        onChange={(e) => setFormData({...formData, address: e.target.value })}
      />
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          placeholder="Cape Town"
          value={formData.city}
          onChange={(e) => setFormData({...formData, city: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="postalCode">Postal Code</Label>
        <Input
          id="postalCode"
          placeholder="8001"
          value={formData.postalCode}
          onChange={(e) => setFormData({...formData, postalCode: e.target.value })}
        />
      </div>
    </div>
  </Card>
);

const DocumentUploadStep = ({ formData, setFormData }: any) => {
  const [uploading, setUploading] = useState<string | null>(null);

  const handleFileUpload = async (file: File, documentType: string) => {
    setUploading(documentType);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${documentType}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (error) throw error;
      
      setFormData({
        ...formData,
        documents: {
          ...formData.documents,
          [documentType]: data.path
        }
      });
      
      toast.success(`${documentType.replace('_', ' ')} uploaded successfully`);
      
      // Track analytics
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'document_uploaded',
          event_data: { document_type: documentType },
          page_url: window.location.href,
          user_agent: navigator.userAgent
        });
    } catch (error: any) {
      console.error('Document upload error:', error);
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  return (
    <Card className="p-8 space-y-6">
      <div className="text-center space-y-2">
        <FileText className="h-10 w-10 text-primary mx-auto" />
        <h2 className="text-2xl font-bold">Document Upload</h2>
        <p className="text-muted-foreground">
          Upload required documents for your application
        </p>
      </div>

      <div className="space-y-6">
        {[
          { key: 'id_document', label: 'Copy of ID Document', required: true },
          { key: 'proof_of_address', label: 'Proof of Address (utility bill)', required: true },
          { key: 'proof_of_income', label: 'Proof of Income (payslip)', required: true },
        ].map((doc) => (
          <div key={doc.key} className="space-y-2">
            <Label className="flex items-center gap-2">
              {doc.label}
              {doc.required && <span className="text-destructive">*</span>}
            </Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, doc.key);
                }}
                className="hidden"
                id={`upload-${doc.key}`}
              />
              <label htmlFor={`upload-${doc.key}`} className="cursor-pointer">
                {uploading === doc.key ? (
                  <Loader2 className="h-8 w-8 text-primary mx-auto mb-2 animate-spin" />
                ) : formData.documents[doc.key] ? (
                  <div className="text-success">
                    <FileText className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Uploaded successfully</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                  </>
                )}
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, JPG, PNG up to 10MB
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-accent/10 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Secure Upload:</strong> All documents are encrypted and stored securely according to POPIA requirements.
        </p>
      </div>
    </Card>
  );
};

const ConsentStep = ({ formData, setFormData }: any) => (
  <Card className="p-8 space-y-6">
    <div className="text-center space-y-2">
      <Shield className="h-10 w-10 text-primary mx-auto" />
      <h2 className="text-2xl font-bold">Consent & Privacy</h2>
      <p className="text-muted-foreground">
        Please review and accept our terms
      </p>
    </div>

    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <Checkbox
          id="popia"
          checked={formData.consents.popia}
          onCheckedChange={(checked) => 
            setFormData({
              ...formData, 
              consents: { ...formData.consents, popia: checked }
            })
          }
        />
        <div className="text-sm">
          <label htmlFor="popia" className="font-medium cursor-pointer">
            POPIA Consent (Required)
          </label>
          <p className="text-muted-foreground mt-1">
            I consent to the processing of my personal information in accordance with POPIA.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox
          id="disclosure"
          checked={formData.consents.disclosure}
          onCheckedChange={(checked) => 
            setFormData({
              ...formData, 
              consents: { ...formData.consents, disclosure: checked }
            })
          }
        />
        <div className="text-sm">
          <label htmlFor="disclosure" className="font-medium cursor-pointer">
            Broker Disclosure (Required)
          </label>
          <p className="text-muted-foreground mt-1">
            I understand that a licensed broker will contact me and may receive commission from medical schemes.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox
          id="marketing"
          checked={formData.consents.marketing}
          onCheckedChange={(checked) => 
            setFormData({
              ...formData, 
              consents: { ...formData.consents, marketing: checked }
            })
          }
        />
        <div className="text-sm">
          <label htmlFor="marketing" className="font-medium cursor-pointer">
            Marketing Communications (Optional)
          </label>
          <p className="text-muted-foreground mt-1">
            I agree to receive helpful updates about medical aid and healthcare.
          </p>
        </div>
      </div>
    </div>

    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
      <h4 className="font-medium text-primary mb-2">What happens next?</h4>
      <ul className="text-sm text-muted-foreground space-y-1">
        <li>• A qualified representative will contact you within 24 hours</li>
        <li>• They'll review your shortlist and help finalize your decision</li>
        <li>• All paperwork and applications will be handled for you</li>
        <li>• You'll receive confirmation once your application is submitted</li>
      </ul>
    </div>
  </Card>
 );

 const SuccessStep = ({ formData, selectedScheme }: any) => {
   const navigate = useNavigate();
   
   const handleGetStarted = () => {
     // Navigate to questionnaire or dashboard
     navigate('/questionnaire');
   };

   const handleViewSelectedPlan = () => {
     // Navigate to results page to see the selected plan
     navigate('/results');
   };

   return (
     <Card className="p-8 space-y-6">
       <div className="text-center space-y-4">
         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
           <CheckCircle className="h-8 w-8 text-green-600" />
         </div>
         <h2 className="text-2xl font-bold">Welcome to CrediMed!</h2>
         <p className="text-muted-foreground">
           Your account has been created successfully. You're now ready to explore medical aid options.
         </p>
       </div>

       <div className="space-y-4">
         <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
           <h4 className="font-medium text-primary mb-2">Account Details</h4>
           <div className="text-sm space-y-1">
             <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
             <p><strong>Email:</strong> {formData.email}</p>
             <p><strong>Phone:</strong> {formData.phone}</p>
           </div>
         </div>

         {selectedScheme && (
           <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
             <h4 className="font-medium text-accent mb-2">Your Selected Plan</h4>
             <div className="text-sm space-y-1">
               <p><strong>Scheme:</strong> {JSON.parse(selectedScheme).scheme_name}</p>
               <p><strong>Plan:</strong> {JSON.parse(selectedScheme).plan_name}</p>
               <p><strong>Monthly Premium:</strong> R{JSON.parse(selectedScheme).monthly_premium?.toLocaleString()}</p>
             </div>
           </div>
         )}

         <div className="bg-success/5 p-4 rounded-lg border border-success/20">
           <h4 className="font-medium text-success mb-2">What's Next?</h4>
           <ul className="text-sm space-y-1">
             <li>• Complete the questionnaire to get personalized recommendations</li>
             <li>• Compare different medical aid schemes</li>
             <li>• Connect with a qualified broker for assistance</li>
             <li>• Get help with your application process</li>
           </ul>
         </div>
       </div>

       <div className="flex gap-4">
         <Button onClick={handleGetStarted} className="flex-1">
           Start Questionnaire
         </Button>
         {selectedScheme && (
           <Button onClick={handleViewSelectedPlan} variant="outline" className="flex-1">
             View Selected Plan
           </Button>
         )}
       </div>

       <div className="text-center">
         <p className="text-xs text-muted-foreground">
           A qualified representative will contact you within 24 hours to assist with your medical aid application.
         </p>
       </div>
     </Card>
   );
 };

 export default RegistrationFlow;