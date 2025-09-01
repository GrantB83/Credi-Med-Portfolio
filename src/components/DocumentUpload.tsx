import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface DocumentVerification {
  id: string;
  file_name: string;
  file_path: string;
  document_type: string;
  verification_status?: 'pending' | 'verified' | 'rejected';
  extracted_data?: any;
  created_at?: string;
  uploaded_at?: string;
  verified?: boolean;
}

const DocumentUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<DocumentVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Map database records to our interface
      const mappedDocs = (data || []).map(doc => ({
        ...doc,
        verification_status: doc.verified ? 'verified' : 'pending',
        created_at: doc.uploaded_at
      }));
      setDocuments(mappedDocs as DocumentVerification[]);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, JPEG, or PNG file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Call document processing function
      const { data: processResult, error: processError } = await supabase.functions.invoke('process-document', {
        body: {
          fileName,
          documentType,
          originalName: file.name
        }
      });

      if (processError) throw processError;

      toast({
        title: "Document uploaded",
        description: "Document uploaded and processing started. Verification results will be available shortly."
      });

      await fetchDocuments();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Document Verification</h2>
        <p className="text-muted-foreground">Upload and verify identity documents using AI-powered parsing</p>
      </div>

      {/* Upload Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              ID Document
            </CardTitle>
            <CardDescription>
              Upload South African ID, passport, or driver's license
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="id-upload" className="block">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload ID document</p>
                  <p className="text-xs text-muted-foreground">PDF, JPEG, PNG up to 10MB</p>
                </div>
              </Label>
              <Input
                id="id-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e, 'id_document')}
                disabled={uploading}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Proof of Income
            </CardTitle>
            <CardDescription>
              Upload payslip, bank statement, or employment letter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="income-upload" className="block">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload income proof</p>
                  <p className="text-xs text-muted-foreground">PDF, JPEG, PNG up to 10MB</p>
                </div>
              </Label>
              <Input
                id="income-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e, 'proof_of_income')}
                disabled={uploading}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Status */}
      {uploading && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Uploading and processing document... This may take a few moments.
          </AlertDescription>
        </Alert>
      )}

      {/* Document List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>Track the verification status of your documents</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className={`p-4 rounded-lg border ${getStatusColor(doc.verification_status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{doc.file_name}</p>
                        <p className="text-sm opacity-75">
                          {doc.document_type.replace('_', ' ').toUpperCase()} • 
                          {new Date(doc.created_at || doc.uploaded_at || '').toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.verification_status || 'pending')}
                      <span className="text-sm font-medium capitalize">
                        {doc.verification_status || 'pending'}
                      </span>
                    </div>
                  </div>
                  
                  {doc.extracted_data && (
                    <div className="mt-3 pt-3 border-t border-current/20">
                      <p className="text-sm font-medium mb-2">Extracted Information:</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(doc.extracted_data).map(([key, value]) => (
                          <div key={key} className="flex">
                            <span className="font-medium mr-2">{key}:</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents uploaded</h3>
              <p className="text-muted-foreground">Upload your documents to get started with verification.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy & Security:</strong> All documents are encrypted and processed securely. 
          Personal information is extracted only for verification purposes and is not stored permanently. 
          Documents are automatically deleted after 30 days.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DocumentUpload;