import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search,
  Filter,
  Phone,
  Mail,
  User,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Download,
  Loader2,
  Eye,
  UserCheck
} from 'lucide-react';

interface Lead {
  id: string;
  status: string;
  priority: string;
  created_at: string;
  last_contacted_at?: string;
  notes?: string;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  questionnaire_responses?: {
    budget: number;
    chronic_cover: boolean;
    hospital_network: string;
    day_to_day_benefits: string;
    dependants: any;
  };
  brokers?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

const LeadsManager = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [assigningBroker, setAssigningBroker] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          profiles!inner (first_name, last_name, email, phone),
          questionnaire_responses!inner (budget, chronic_cover, hospital_network, day_to_day_benefits, dependants),
          brokers (first_name, last_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads((data as any) || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to load leads data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const assignBroker = async (leadId: string) => {
    setAssigningBroker(leadId);
    try {
      const { data, error } = await supabase.functions.invoke('assign-broker', {
        body: { leadId }
      });

      if (error) throw error;

      await fetchLeads();
      toast({
        title: "Success",
        description: "Broker assigned successfully and notifications sent."
      });
    } catch (error) {
      console.error('Error assigning broker:', error);
      toast({
        title: "Error",
        description: "Failed to assign broker.",
        variant: "destructive"
      });
    } finally {
      setAssigningBroker(null);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

      if (error) throw error;

      await fetchLeads();
      toast({
        title: "Success",
        description: "Lead status updated successfully."
      });
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast({
        title: "Error",
        description: "Failed to update lead status.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      lead.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Leads Management</h2>
          <p className="text-muted-foreground">Track and manage customer leads</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Leads
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contacted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.converted}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
          <CardDescription>
            Manage customer leads and broker assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Broker</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {lead.profiles?.first_name} {lead.profiles?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {lead.profiles?.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    R{lead.questionnaire_responses?.budget?.toLocaleString() || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(lead.status)} variant="secondary">
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(lead.priority)} variant="secondary">
                      {lead.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {lead.brokers ? (
                      <div className="text-sm">
                        {lead.brokers.first_name} {lead.brokers.last_name}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedLead(lead);
                          setDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!lead.brokers && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => assignBroker(lead.id)}
                          disabled={assigningBroker === lead.id}
                        >
                          {assigningBroker === lead.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <Select 
                        value={lead.status} 
                        onValueChange={(value) => updateLeadStatus(lead.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLeads.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No leads found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              Detailed information about the lead
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedLead.profiles?.first_name} {selectedLead.profiles?.last_name}</p>
                    <p><strong>Email:</strong> {selectedLead.profiles?.email}</p>
                    <p><strong>Phone:</strong> {selectedLead.profiles?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Lead Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Status:</strong> {selectedLead.status}</p>
                    <p><strong>Priority:</strong> {selectedLead.priority}</p>
                    <p><strong>Created:</strong> {new Date(selectedLead.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Questionnaire Responses</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Budget:</strong> R{selectedLead.questionnaire_responses?.budget?.toLocaleString() || 'N/A'}</p>
                  <p><strong>Chronic Cover:</strong> {selectedLead.questionnaire_responses?.chronic_cover ? 'Required' : 'Not required'}</p>
                  <p><strong>Hospital Network:</strong> {selectedLead.questionnaire_responses?.hospital_network || 'N/A'}</p>
                  <p><strong>Day-to-Day Benefits:</strong> {selectedLead.questionnaire_responses?.day_to_day_benefits || 'N/A'}</p>
                </div>
              </div>

              {selectedLead.brokers && (
                <div>
                  <h4 className="font-semibold">Assigned Broker</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedLead.brokers.first_name} {selectedLead.brokers.last_name}</p>
                    <p><strong>Email:</strong> {selectedLead.brokers.email}</p>
                    <p><strong>Phone:</strong> {selectedLead.brokers.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsManager;