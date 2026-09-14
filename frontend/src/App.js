import React from 'react';
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from 'sonner';
import { StoreProvider, useStore } from './oli/store';
import Layout from './oli/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyServices from './pages/MyServices';
import ServiceDetail from './pages/ServiceDetail';
import MyDocuments from './pages/MyDocuments';
import Certificates from './pages/Certificates';
import { InvoicesPage, ReceiptsPage } from './pages/Invoices';
import Callbacks from './pages/Callbacks';
import Explore from './pages/Explore';
import Recommended from './pages/Recommended';
import Profile from './pages/Profile';
import HowToUse from './pages/HowToUse';
import TicketTracking from './pages/TicketTracking';

function RequireAuth({ children }) {
  const { state } = useStore();
  const location = useLocation();
  if (!state.session.loggedIn) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function LoginGate() {
  const { state } = useStore();
  if (state.session.loggedIn) return <Navigate to="/dashboard" replace />;
  return <Login />;
}

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginGate />} />
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<MyServices />} />
            <Route path="/service/:oliId" element={<ServiceDetail />} />
            <Route path="/documents" element={<MyDocuments />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/receipts" element={<ReceiptsPage />} />
            <Route path="/callbacks" element={<Callbacks />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/recommended" element={<Recommended />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/ticket/:ticketId" element={<TicketTracking />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
