import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Download, Calendar as CalendarIcon, FileSpreadsheet, FileText, Database, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface ExportConfig {
  dataType: string;
  format: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  includeFields: string[];
  filters: Record<string, any>;
}

const DataExporter = () => {
  const [config, setConfig] = useState<ExportConfig>({
    dataType: '',
    format: 'csv',
    dateRange: {
      from: null,
      to: null
    },
    includeFields: [],
    filters: {}
  });
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const dataTypes = [
    { value: 'leads', label: 'Leads Data', icon: Database },
    { value: 'questionnaires', label: 'Questionnaire Responses', icon: FileText },
    { value: 'analytics', label: 'Analytics Events', icon: FileSpreadsheet },
    { value: 'brokers', label: 'Broker Information', icon: Database },
    { value: 'schemes', label: 'Medical Schemes', icon: FileText }
  ];

  const formatOptions = [
    { value: 'csv', label: 'CSV (Excel Compatible)', extension: '.csv' },
    { value: 'json', label: 'JSON (Developer Friendly)', extension: '.json' },
    { value: 'xlsx', label: 'Excel Workbook', extension: '.xlsx' }
  ];

  const getAvailableFields = (dataType: string) => {
    switch (dataType) {
      case 'leads':
        return [
          'id', 'status', 'priority', 'created_at', 'updated_at',
          'first_name', 'last_name', 'email', 'phone', 'budget',
          'chronic_cover', 'broker_name', 'scheme_selected'
        ];
      case 'questionnaires':
        return [
          'id', 'session_id', 'user_id', 'budget', 'chronic_cover',
          'dependants', 'hospital_network', 'day_to_day_benefits',
          'dsp_comfort', 'created_at', 'completed_at'
        ];
      case 'analytics':
        return [
          'id', 'event_type', 'event_data', 'user_id', 'session_id',
          'page_url', 'user_agent', 'ip_address', 'created_at'
        ];
      case 'brokers':
        return [
          'id', 'first_name', 'last_name', 'email', 'phone',
          'license_number', 'specialization', 'active', 'capacity_score',
          'created_at', 'updated_at'
        ];
      case 'schemes':
        return [
          'id', 'scheme_name', 'plan_name', 'monthly_premium',
          'coverage_indicators', 'key_highlights', 'active',
          'created_at', 'updated_at'
        ];
      default:
        return [];
    }
  };

  const handleFieldToggle = (field: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      includeFields: checked 
        ? [...prev.includeFields, field]
        : prev.includeFields.filter(f => f !== field)
    }));
  };

  const selectAllFields = () => {
    const allFields = getAvailableFields(config.dataType);
    setConfig(prev => ({
      ...prev,
      includeFields: allFields
    }));
  };

  const clearAllFields = () => {
    setConfig(prev => ({
      ...prev,
      includeFields: []
    }));
  };

  const handleExport = async () => {
    if (!config.dataType || config.includeFields.length === 0) {
      toast({
        title: "Configuration Required",
        description: "Please select a data type and at least one field to export.",
        variant: "destructive"
      });
      return;
    }

    setExporting(true);
    try {
      // Build query filters
      const filters: Record<string, any> = { ...config.filters };
      
      if (config.dateRange.from) {
        filters.created_at_gte = config.dateRange.from.toISOString();
      }
      if (config.dateRange.to) {
        filters.created_at_lte = config.dateRange.to.toISOString();
      }

      // Call export function
      const { data, error } = await supabase.functions.invoke('export-data', {
        body: {
          dataType: config.dataType,
          format: config.format,
          fields: config.includeFields,
          filters: filters
        }
      });

      if (error) throw error;

      // Create and download file
      const blob = new Blob([data.content], { 
        type: config.format === 'csv' ? 'text/csv' : 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${config.dataType}_export_${format(new Date(), 'yyyy-MM-dd')}${
        formatOptions.find(f => f.value === config.format)?.extension || '.csv'
      }`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${data.recordCount} records exported successfully.`
      });

      // Track export event
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'data_exported',
          event_data: {
            data_type: config.dataType,
            format: config.format,
            record_count: data.recordCount,
            fields_exported: config.includeFields
          },
          page_url: window.location.href,
          user_agent: navigator.userAgent
        });

    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Data Export</h2>
        <p className="text-muted-foreground">Export your data for analysis and reporting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Export Configuration</CardTitle>
            <CardDescription>
              Configure what data to export and in which format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Data Type Selection */}
            <div className="space-y-2">
              <Label>Data Type</Label>
              <Select value={config.dataType} onValueChange={(value) => {
                setConfig(prev => ({
                  ...prev,
                  dataType: value,
                  includeFields: [] // Reset fields when data type changes
                }));
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data type to export" />
                </SelectTrigger>
                <SelectContent>
                  {dataTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Format Selection */}
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={config.format} onValueChange={(value) => setConfig(prev => ({ ...prev, format: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map(format => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range (Optional)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {config.dateRange.from ? format(config.dateRange.from, 'PPP') : 'From date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={config.dateRange.from || undefined}
                      onSelect={(date) => setConfig(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, from: date || null }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {config.dateRange.to ? format(config.dateRange.to, 'PPP') : 'To date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={config.dateRange.to || undefined}
                      onSelect={(date) => setConfig(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, to: date || null }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Status Filter for Leads */}
            {config.dataType === 'leads' && (
              <div className="space-y-2">
                <Label>Lead Status Filter (Optional)</Label>
                <Select 
                  value={config.filters.status || ''} 
                  onValueChange={(value) => setConfig(prev => ({
                    ...prev,
                    filters: { ...prev.filters, status: value || undefined }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Field Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Field Selection</CardTitle>
            <CardDescription>
              Choose which fields to include in the export
            </CardDescription>
          </CardHeader>
          <CardContent>
            {config.dataType ? (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={selectAllFields}>
                    Select All
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearAllFields}>
                    Clear All
                  </Button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {getAvailableFields(config.dataType).map(field => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox
                        id={field}
                        checked={config.includeFields.includes(field)}
                        onCheckedChange={(checked) => handleFieldToggle(field, !!checked)}
                      />
                      <label htmlFor={field} className="text-sm font-medium cursor-pointer">
                        {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="text-sm text-muted-foreground">
                  {config.includeFields.length} field(s) selected
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Select a data type to see available fields</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Export Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Ready to Export</h3>
              <p className="text-sm text-muted-foreground">
                {config.dataType && config.includeFields.length > 0
                  ? `Export ${config.dataType} data with ${config.includeFields.length} fields in ${config.format.toUpperCase()} format`
                  : 'Configure your export settings above'
                }
              </p>
            </div>
            <Button 
              onClick={handleExport} 
              disabled={!config.dataType || config.includeFields.length === 0 || exporting}
              size="lg"
            >
              {exporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataExporter;