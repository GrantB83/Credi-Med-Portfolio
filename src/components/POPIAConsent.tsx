import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Info, Eye, Users, Database } from 'lucide-react';

interface POPIAConsentProps {
  onConsentChange: (consents: POPIAConsents) => void;
  required?: boolean;
  showDetails?: boolean;
}

export interface POPIAConsents {
  dataProcessing: boolean;
  marketing: boolean;
  thirdPartySharing: boolean;
  dataRetention: boolean;
}

const POPIAConsent = ({ onConsentChange, required = true, showDetails = false }: POPIAConsentProps) => {
  const [consents, setConsents] = useState<POPIAConsents>({
    dataProcessing: false,
    marketing: false,
    thirdPartySharing: false,
    dataRetention: false
  });

  const [showDetailedInfo, setShowDetailedInfo] = useState(showDetails);

  const handleConsentChange = (key: keyof POPIAConsents, value: boolean) => {
    const newConsents = { ...consents, [key]: value };
    setConsents(newConsents);
    onConsentChange(newConsents);
  };

  const isRequiredConsentsGiven = () => {
    return consents.dataProcessing && consents.thirdPartySharing;
  };

  return (
    <Card className="border-2 border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-accent" />
          POPIA Data Protection Consent
        </CardTitle>
        <CardDescription>
          In compliance with the Protection of Personal Information Act (POPIA), we need your consent to process your personal information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Required Consents */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Required Consents</h4>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="dataProcessing"
              checked={consents.dataProcessing}
              onCheckedChange={(checked) => handleConsentChange('dataProcessing', !!checked)}
            />
            <div className="space-y-1">
              <label htmlFor="dataProcessing" className="text-sm font-medium cursor-pointer">
                Data Processing for Medical Aid Services
              </label>
              <p className="text-xs text-muted-foreground">
                I consent to CrediMed processing my personal information to provide medical aid comparison and broker connection services.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="thirdPartySharing"
              checked={consents.thirdPartySharing}
              onCheckedChange={(checked) => handleConsentChange('thirdPartySharing', !!checked)}
            />
            <div className="space-y-1">
              <label htmlFor="thirdPartySharing" className="text-sm font-medium cursor-pointer">
                Broker and Medical Scheme Sharing
              </label>
              <p className="text-xs text-muted-foreground">
                I consent to sharing my information with authorized medical aid brokers and schemes for application processing.
              </p>
            </div>
          </div>
        </div>

        {/* Optional Consents */}
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-medium text-sm">Optional Consents</h4>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="marketing"
              checked={consents.marketing}
              onCheckedChange={(checked) => handleConsentChange('marketing', !!checked)}
            />
            <div className="space-y-1">
              <label htmlFor="marketing" className="text-sm font-medium cursor-pointer">
                Marketing Communications
              </label>
              <p className="text-xs text-muted-foreground">
                I consent to receive newsletters, product updates, and promotional offers via email and SMS.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="dataRetention"
              checked={consents.dataRetention}
              onCheckedChange={(checked) => handleConsentChange('dataRetention', !!checked)}
            />
            <div className="space-y-1">
              <label htmlFor="dataRetention" className="text-sm font-medium cursor-pointer">
                Extended Data Retention
              </label>
              <p className="text-xs text-muted-foreground">
                I consent to retaining my data for future service improvements and personalized recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Show/Hide Details */}
        <div className="border-t pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowDetailedInfo(!showDetailedInfo)}
            className="p-0 h-auto"
          >
            <Info className="h-4 w-4 mr-2" />
            {showDetailedInfo ? 'Hide' : 'Show'} detailed information
          </Button>
        </div>

        {/* Detailed Information */}
        {showDetailedInfo && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <h5 className="font-medium text-sm">Data We Collect</h5>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Personal details (name, contact info)</li>
                  <li>• Medical aid requirements</li>
                  <li>• Budget and preferences</li>
                  <li>• ID verification documents</li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <h5 className="font-medium text-sm">How We Use It</h5>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Personalized scheme recommendations</li>
                  <li>• Connecting you with qualified brokers</li>
                  <li>• Application assistance</li>
                  <li>• Service improvement analytics</li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h5 className="font-medium text-sm">Who We Share With</h5>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Licensed medical aid brokers</li>
                  <li>• Medical aid schemes (for applications)</li>
                  <li>• Service providers (with safeguards)</li>
                  <li>• Regulatory bodies (when required)</li>
                </ul>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Your Rights:</strong> You can access, correct, or delete your personal information at any time. 
                You may also withdraw consent (though this may affect our ability to provide services). 
                Contact us at privacy@credimed.com for data protection queries.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Validation Alert */}
        {required && !isRequiredConsentsGiven() && (
          <Alert variant="destructive">
            <AlertDescription className="text-xs">
              The required consents for data processing and broker sharing must be given to proceed with your application.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default POPIAConsent;