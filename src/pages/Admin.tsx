import Navigation from '@/components/Navigation';
import AdminPortal from '@/components/admin/AdminPortal';
import AdminRoute from '@/components/admin/AdminRoute';

const Admin = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen">
        <Navigation />
        <AdminPortal />
      </div>
    </AdminRoute>
  );
};

export default Admin;