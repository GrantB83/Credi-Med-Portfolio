import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, BarChart3, Users, FileText, UserCheck, Mail, Download, Upload } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import SchemeManager from './SchemeManager';
import LeadsManager from './LeadsManager';
import BrokerManager from '../admin/BrokerManager';
import SimpleEmailTemplateManager from '../SimpleEmailTemplateManager';
import DataExporter from '../DataExporter';
import DocumentUpload from '../DocumentUpload';

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <section className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">CrediMed Admin Portal</h1>
            <p className="text-muted-foreground">
              Manage medical scheme data, leads, and platform analytics
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="dashboard" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Leads
              </TabsTrigger>
              <TabsTrigger value="schemes" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Schemes
              </TabsTrigger>
              <TabsTrigger value="brokers" className="flex items-center gap-1">
                <UserCheck className="h-4 w-4" />
                Brokers
              </TabsTrigger>
              <TabsTrigger value="emails" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Export
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-1">
                <Upload className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <AdminDashboard />
            </TabsContent>

            <TabsContent value="leads" className="space-y-6">
              <LeadsManager />
            </TabsContent>

            <TabsContent value="schemes" className="space-y-6">
              <SchemeManager />
            </TabsContent>

            <TabsContent value="brokers" className="space-y-6">
              <BrokerManager />
            </TabsContent>

            <TabsContent value="emails" className="space-y-6">
              <SimpleEmailTemplateManager />
            </TabsContent>

            <TabsContent value="export" className="space-y-6">
              <DataExporter />
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <DocumentUpload />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <SystemSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

const SystemSettings = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>System Configuration</CardTitle>
        <CardDescription>
          Configure platform settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Broker Contact SLA (hours)</label>
            <input 
              type="number" 
              defaultValue="24" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Max File Upload Size (MB)</label>
            <input 
              type="number" 
              defaultValue="10" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Default Broker Email</label>
          <input 
            type="email" 
            defaultValue="broker@credimed.com" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          System maintenance and data operations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">Quarterly Data Refresh</p>
            <p className="text-sm text-muted-foreground">Update all scheme data and premiums</p>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Run Refresh
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">Monthly Validation Check</p>
            <p className="text-sm text-muted-foreground">Verify data accuracy and completeness</p>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Schedule Check
          </button>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AdminPortal;