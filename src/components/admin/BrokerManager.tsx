import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, UserPlus, Settings, AlertCircle, CheckCircle, Loader2, TrendingUp, TrendingDown } from 'lucide-react';

interface Broker {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  license_number?: string;
  specialization: string[];
  active: boolean;
  capacity_score: number;
  created_at: string;
  updated_at: string;
}

const BrokerManager = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    license_number: '',
    specialization: [] as string[],
    capacity_score: 100
  });

  const specializationOptions = [
    'Medical Aid',
    'Gap Cover',
    'Hospital Plans',
    'Chronic Benefits',
    'Savings Plans',
    'International Cover',
    'Student Plans',
    'Senior Plans'
  ];

  useEffect(() => {
    fetchBrokers();
  }, []);

  const fetchBrokers = async () => {
    try {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBrokers(data || []);
    } catch (error) {
      console.error('Error fetching brokers:', error);
      toast({
        title: "Error",
        description: "Failed to load brokers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (selectedBroker) {
        // Update existing broker
        const { error } = await supabase
          .from('brokers')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedBroker.id);

        if (error) throw error;
        toast({
          title: "Broker updated",
          description: "Broker information has been successfully updated."
        });
      } else {
        // Create new broker
        const { error } = await supabase
          .from('brokers')
          .insert(formData);

        if (error) throw error;
        toast({
          title: "Broker added",
          description: "New broker has been successfully added to the system."
        });
      }

      await fetchBrokers();
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save broker information.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleBrokerStatus = async (broker: Broker) => {
    try {
      const { error } = await supabase
        .from('brokers')
        .update({ 
          active: !broker.active,
          updated_at: new Date().toISOString()
        })
        .eq('id', broker.id);

      if (error) throw error;

      await fetchBrokers();
      toast({
        title: broker.active ? "Broker deactivated" : "Broker activated",
        description: `${broker.first_name} ${broker.last_name} has been ${broker.active ? 'deactivated' : 'activated'}.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update broker status.",
        variant: "destructive"
      });
    }
  };

  const updateCapacity = async (brokerId: string, newCapacity: number) => {
    try {
      const { error } = await supabase
        .from('brokers')
        .update({ 
          capacity_score: Math.max(0, Math.min(100, newCapacity)),
          updated_at: new Date().toISOString()
        })
        .eq('id', brokerId);

      if (error) throw error;
      await fetchBrokers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update capacity.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      license_number: '',
      specialization: [],
      capacity_score: 100
    });
    setSelectedBroker(null);
  };

  const openEditDialog = (broker: Broker) => {
    setSelectedBroker(broker);
    setFormData({
      first_name: broker.first_name,
      last_name: broker.last_name,
      email: broker.email,
      phone: broker.phone,
      license_number: broker.license_number || '',
      specialization: broker.specialization || [],
      capacity_score: broker.capacity_score
    });
    setDialogOpen(true);
  };

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 80) return 'text-green-600';
    if (capacity >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCapacityStatus = (capacity: number) => {
    if (capacity >= 80) return 'Available';
    if (capacity >= 50) return 'Moderate';
    return 'Limited';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading brokers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Broker Management</h2>
          <p className="text-muted-foreground">Manage broker network and capacity allocation</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Broker
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedBroker ? 'Edit Broker' : 'Add New Broker'}
              </DialogTitle>
              <DialogDescription>
                {selectedBroker ? 'Update broker information and specializations.' : 'Add a new broker to the network.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license_number">License Number</Label>
                  <Input
                    id="license_number"
                    value={formData.license_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity_score">Capacity Score</Label>
                  <Input
                    id="capacity_score"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.capacity_score}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity_score: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Specializations</Label>
                <div className="grid grid-cols-2 gap-2">
                  {specializationOptions.map((spec) => (
                    <label key={spec} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.specialization.includes(spec)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              specialization: [...prev.specialization, spec]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              specialization: prev.specialization.filter(s => s !== spec)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {selectedBroker ? 'Update Broker' : 'Add Broker'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Brokers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brokers.map((broker) => (
          <Card key={broker.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {broker.first_name} {broker.last_name}
                  </CardTitle>
                  <CardDescription>{broker.email}</CardDescription>
                </div>
                <Badge variant={broker.active ? "default" : "secondary"}>
                  {broker.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Capacity</span>
                  <span className={`text-sm font-medium ${getCapacityColor(broker.capacity_score)}`}>
                    {getCapacityStatus(broker.capacity_score)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          broker.capacity_score >= 80 ? 'bg-green-600' :
                          broker.capacity_score >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${broker.capacity_score}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 w-6 p-0"
                      onClick={() => updateCapacity(broker.id, broker.capacity_score - 10)}
                    >
                      <TrendingDown className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 w-6 p-0"
                      onClick={() => updateCapacity(broker.id, broker.capacity_score + 10)}
                    >
                      <TrendingUp className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{broker.capacity_score}% available</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{broker.phone}</p>
              </div>

              {broker.license_number && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">License</p>
                  <p className="text-sm text-muted-foreground">{broker.license_number}</p>
                </div>
              )}

              {broker.specialization.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Specializations</p>
                  <div className="flex flex-wrap gap-1">
                    {broker.specialization.slice(0, 3).map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {broker.specialization.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{broker.specialization.length - 3} more
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
                  onClick={() => openEditDialog(broker)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant={broker.active ? "destructive" : "default"}
                  onClick={() => toggleBrokerStatus(broker)}
                >
                  {broker.active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {brokers.length === 0 && (
        <div className="text-center py-12">
          <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No brokers found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first broker to the network.
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Broker
          </Button>
        </div>
      )}
    </div>
  );
};

export default BrokerManager;