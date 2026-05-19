import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Layout from './Layout';
import RegistrationForm from './RegistrationForm';
import OTPVerification from './OTPVerification';
import Login from './Login';
import Home from './Home';
import PropertyList from './PropertyList';
import PropertyDetail from './PropertyDetail';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import Messaging from './Messaging';
import AddProperty from './AddProperty';
import EditProperty from './EditProperty';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="accounts/login/" element={<Login />} />
          <Route path="accounts/register/" element={<RegistrationForm />} />
          <Route path="accounts/verify-otp/" element={<OTPVerification />} />
          <Route path="dashboard/" element={<Dashboard />} />
          <Route path="admin/" element={<AdminDashboard />} />
          <Route path="messaging/" element={<Messaging />} />
          <Route path="properties/" element={<PropertyList />} />
          <Route path="properties/add/" element={<AddProperty />} />
          <Route path="properties/:id/" element={<PropertyDetail />} />
          <Route path="properties/:id/edit/" element={<EditProperty />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
