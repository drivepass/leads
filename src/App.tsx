import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from './pages/Index';
import LeadCleaningPage from './pages/LeadCleaningPage';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';
import LeadsPage from './pages/LeadsPage';
import { AdminProvider } from './contexts/AdminContext';
import './i18n';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminProvider>
        <TooltipProvider>
          <Toaster />
          <Suspense fallback={<div>Loading...</div>}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LeadsPage />} />
                <Route path="/leads" element={<LeadsPage />} />
                <Route path="/leads/:id/clean" element={<LeadCleaningPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/welcome" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </Suspense>
        </TooltipProvider>
      </AdminProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
