import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { makeUserAdmin } from '@/lib/adminUtils';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';

const AdminSetup = () => {
  const { user, refreshUserRole, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleMakeAdmin = async () => {
    if (!user) {
      setMessage('Please log in first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await makeUserAdmin(user.id);
      
      if (result.success) {
        setSuccess(true);
        setMessage('Successfully granted admin access! Refreshing permissions...');
        
        // Refresh user role after a short delay
        setTimeout(async () => {
          await refreshUserRole();
          setMessage('Admin access granted successfully!');
        }, 1000);
      } else {
        setMessage('Failed to grant admin access. You may already be an admin or lack permissions.');
      }
    } catch (error) {
      setMessage('An error occurred while granting admin access');
      console.error('Admin setup error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <CardTitle>Admin Access Active</CardTitle>
                <CardDescription>
                  You already have admin privileges and can access the admin panel.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => window.location.href = '/admin'}>
                  Go to Admin Panel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
              <CardTitle>Admin Setup</CardTitle>
              <CardDescription>
                Grant yourself admin access to manage the CrediMed platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>One-time Setup:</strong> This allows you to become an admin user for managing brokers, leads, and medical schemes.
                </AlertDescription>
              </Alert>

              {!user && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please log in first before setting up admin access.
                  </AlertDescription>
                </Alert>
              )}

              {user && (
                <div className="space-y-4">
                  <div className="text-sm">
                    <p><strong>Current User:</strong> {user.email}</p>
                  </div>
                  
                  <Button 
                    onClick={handleMakeAdmin} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Setting up Admin Access...' : 'Grant Admin Access'}
                  </Button>
                </div>
              )}

              {message && (
                <Alert variant={success ? "default" : "destructive"}>
                  {success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;