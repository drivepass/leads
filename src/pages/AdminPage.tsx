import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Settings, Building, Users } from 'lucide-react';
import FieldManager from '@/components/admin/FieldManager';
import BranchManager from '@/components/admin/BranchManager';
import SalesmanManager from '@/components/admin/SalesmanManager';

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('fields');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Leads
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Manage system settings and configurations
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fields" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Field Management
            </TabsTrigger>
            <TabsTrigger value="branches" className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Branch Management
            </TabsTrigger>
            <TabsTrigger value="salesmen" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Salesman Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fields">
            <FieldManager />
          </TabsContent>

          <TabsContent value="branches">
            <BranchManager />
          </TabsContent>

          <TabsContent value="salesmen">
            <SalesmanManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}