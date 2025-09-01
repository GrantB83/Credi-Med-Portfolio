// Temporary email template manager using direct interface until types are updated
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Plus, Mail, Edit, Eye, Loader2, AlertCircle } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  template_type: string;
  variables: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

const SimpleEmailTemplateManager = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock data for now until database types are updated
  useEffect(() => {
    const mockTemplates: EmailTemplate[] = [
      {
        id: '1',
        name: 'Welcome Email',
        subject: 'Welcome to CrediMed - Your Medical Aid Journey Starts Here',
        content: 'Dear {{first_name}}, Welcome to CrediMed! We\'re excited to help you find the perfect medical aid solution.',
        template_type: 'welcome',
        variables: ['{{first_name}}', '{{email}}', '{{phone}}'],
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Questionnaire Confirmation',
        subject: 'Thank you for completing your medical aid assessment',
        content: 'Hi {{first_name}}, Thank you for completing your medical aid needs assessment.',
        template_type: 'questionnaire_confirmation',
        variables: ['{{first_name}}', '{{scheme_count}}', '{{budget}}'],
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Broker Notification',
        subject: 'New Lead Assignment - {{first_name}} {{last_name}}',
        content: 'Hello {{broker_name}}, You have been assigned a new lead that matches your specialization.',
        template_type: 'broker_notification',
        variables: ['{{broker_name}}', '{{first_name}}', '{{last_name}}'],
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    setTemplates(mockTemplates);
    setLoading(false);
  }, []);

  const templateTypes = [
    { value: 'welcome', label: 'Welcome Email' },
    { value: 'questionnaire_confirmation', label: 'Questionnaire Confirmation' },
    { value: 'broker_notification', label: 'Broker Notification' },
    { value: 'lead_packet', label: 'Lead Packet' },
    { value: 'contact_confirmation', label: 'Contact Confirmation' },
    { value: 'application_followup', label: 'Application Follow-up' },
    { value: 'reminder', label: 'Reminder' },
    { value: 'newsletter', label: 'Newsletter' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading email templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Email Templates</h2>
          <p className="text-muted-foreground">Manage email templates for automated communications</p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Create Template (Demo Mode)
        </Button>
      </div>

      {/* Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Email template management is currently in demo mode. Database integration will be available after schema updates.
        </AlertDescription>
      </Alert>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>
                    {templateTypes.find(t => t.value === template.template_type)?.label || template.template_type}
                  </CardDescription>
                </div>
                <Badge variant={template.active ? "default" : "secondary"}>
                  {template.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Subject</p>
                <p className="text-sm text-muted-foreground truncate">{template.subject}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Content Preview</p>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {template.content.substring(0, 120)}...
                </p>
              </div>

              {template.variables && template.variables.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Variables</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.slice(0, 3).map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                    {template.variables.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.variables.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  disabled
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SimpleEmailTemplateManager;