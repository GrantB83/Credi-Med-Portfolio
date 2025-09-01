import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Plus, 
  Eye,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MedicalScheme {
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
  created_at: string;
  updated_at: string;
}

const SchemeManager = () => {
  const [schemes, setSchemes] = useState<MedicalScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingScheme, setEditingScheme] = useState<MedicalScheme | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const [newScheme, setNewScheme] = useState({
    scheme_name: '',
    plan_name: '',
    monthly_premium: 0,
    key_highlights: [''],
    coverage_indicators: {
      hospital: 80,
      chronic: 80,
      dayToDay: 60,
      dental: 60
    },
    active: true
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_schemes')
        .select('*')
        .order('scheme_name', { ascending: true });

      if (error) throw error;
      
      // Transform data to match interface
      const transformedData = (data || []).map(scheme => ({
        ...scheme,
        coverage_indicators: typeof scheme.coverage_indicators === 'object' && scheme.coverage_indicators !== null
          ? scheme.coverage_indicators as any
          : { hospital: 80, chronic: 80, dayToDay: 60, dental: 60 }
      }));
      
      setSchemes(transformedData);
    } catch (error) {
      console.error('Error fetching schemes:', error);
      toast({
        title: "Error",
        description: "Failed to load medical schemes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, schemeId: string, type: 'pdf' | 'logo') => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${schemeId}_${type}_${Date.now()}.${fileExt}`;
      const bucket = type === 'pdf' ? 'scheme-brochures' : 'scheme-logos';
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      // Update scheme record
      const updateField = type === 'pdf' ? 'pdf_url' : 'logo_url';
      const { error: updateError } = await supabase
        .from('medical_schemes')
        .update({ [updateField]: publicUrl })
        .eq('id', schemeId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `${type === 'pdf' ? 'Brochure' : 'Logo'} uploaded successfully`
      });

      fetchSchemes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Upload failed',
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddScheme = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_schemes')
        .insert([newScheme])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Medical scheme added successfully"
      });

      setNewScheme({
        scheme_name: '',
        plan_name: '',
        monthly_premium: 0,
        key_highlights: [''],
        coverage_indicators: {
          hospital: 80,
          chronic: 80,
          dayToDay: 60,
          dental: 60
        },
        active: true
      });
      setShowAddDialog(false);
      fetchSchemes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to add scheme',
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (scheme: MedicalScheme) => {
    try {
      const { error } = await supabase
        .from('medical_schemes')
        .update({ active: !scheme.active })
        .eq('id', scheme.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Scheme ${!scheme.active ? 'activated' : 'deactivated'}`
      });

      fetchSchemes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to update scheme',
        variant: "destructive"
      });
    }
  };

  const addHighlight = () => {
    setNewScheme(prev => ({
      ...prev,
      key_highlights: [...prev.key_highlights, '']
    }));
  };

  const updateHighlight = (index: number, value: string) => {
    setNewScheme(prev => ({
      ...prev,
      key_highlights: prev.key_highlights.map((h, i) => i === index ? value : h)
    }));
  };

  const removeHighlight = (index: number) => {
    setNewScheme(prev => ({
      ...prev,
      key_highlights: prev.key_highlights.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading medical schemes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Scheme Management</h2>
          <p className="text-muted-foreground">Manage medical schemes, upload brochures, and update coverage information</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchSchemes} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Scheme
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Medical Scheme</DialogTitle>
                <DialogDescription>
                  Create a new medical scheme entry with coverage details
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheme_name">Scheme Name</Label>
                    <Input
                      id="scheme_name"
                      value={newScheme.scheme_name}
                      onChange={(e) => setNewScheme(prev => ({ ...prev, scheme_name: e.target.value }))}
                      placeholder="e.g., Discovery Health"
                    />
                  </div>
                  <div>
                    <Label htmlFor="plan_name">Plan Name</Label>
                    <Input
                      id="plan_name"
                      value={newScheme.plan_name}
                      onChange={(e) => setNewScheme(prev => ({ ...prev, plan_name: e.target.value }))}
                      placeholder="e.g., Executive Plan"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="monthly_premium">Monthly Premium (R)</Label>
                  <Input
                    id="monthly_premium"
                    type="number"
                    value={newScheme.monthly_premium}
                    onChange={(e) => setNewScheme(prev => ({ ...prev, monthly_premium: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Key Highlights</Label>
                  {newScheme.key_highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={highlight}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                        placeholder="Enter benefit highlight"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeHighlight(index)}
                        disabled={newScheme.key_highlights.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addHighlight} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Highlight
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Hospital Coverage (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newScheme.coverage_indicators.hospital}
                      onChange={(e) => setNewScheme(prev => ({
                        ...prev,
                        coverage_indicators: { ...prev.coverage_indicators, hospital: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Chronic Coverage (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newScheme.coverage_indicators.chronic}
                      onChange={(e) => setNewScheme(prev => ({
                        ...prev,
                        coverage_indicators: { ...prev.coverage_indicators, chronic: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Day-to-Day Coverage (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newScheme.coverage_indicators.dayToDay}
                      onChange={(e) => setNewScheme(prev => ({
                        ...prev,
                        coverage_indicators: { ...prev.coverage_indicators, dayToDay: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Dental Coverage (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newScheme.coverage_indicators.dental}
                      onChange={(e) => setNewScheme(prev => ({
                        ...prev,
                        coverage_indicators: { ...prev.coverage_indicators, dental: Number(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddScheme}>
                  Add Scheme
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme) => (
          <Card key={scheme.id} className={`relative ${!scheme.active ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{scheme.scheme_name}</CardTitle>
                  <CardDescription>{scheme.plan_name}</CardDescription>
                </div>
                <Badge variant={scheme.active ? "default" : "secondary"}>
                  {scheme.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-primary">
                R{scheme.monthly_premium.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Coverage Indicators */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Coverage Overview</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Hospital: {scheme.coverage_indicators?.hospital || 0}%</div>
                  <div>Chronic: {scheme.coverage_indicators?.chronic || 0}%</div>
                  <div>Day-to-Day: {scheme.coverage_indicators?.dayToDay || 0}%</div>
                  <div>Dental: {scheme.coverage_indicators?.dental || 0}%</div>
                </div>
              </div>

              {/* File Management */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Brochure</span>
                  {scheme.pdf_url ? (
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" asChild>
                        <a href={scheme.pdf_url} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-3 w-3" />
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={scheme.pdf_url} download>
                          <Download className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="secondary">Not uploaded</Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Upload New Brochure (PDF)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, scheme.id, 'pdf');
                    }}
                    className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    disabled={uploading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Upload Logo</label>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, scheme.id, 'logo');
                    }}
                    className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/90"
                    disabled={uploading}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleActive(scheme)}
                  className="flex-1"
                >
                  {scheme.active ? (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Activate
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {schemes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No medical schemes found. Add your first scheme to get started.</p>
        </div>
      )}
    </div>
  );
};

export default SchemeManager;