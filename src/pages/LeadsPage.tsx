import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Eye, EyeOff, Search, Filter, Settings, Shield } from 'lucide-react';
import { Lead, LeadFilters } from '@/types/leads';
import { leadsData, statusOptions, modelOptions, cityOptions, leadSourceOptions, campaignSourceOptions } from '@/data/leadsData';
import LeadJourneyModal from '@/components/LeadJourneyModal';
import LeadEditModal from '@/components/LeadEditModal';
import Sidebar from '@/components/Sidebar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AdminLogin from '@/components/auth/AdminLogin';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';

interface ColumnVisibility {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  phoneNumber: boolean;
  status: boolean;
  model: boolean;
  city: boolean;
  state: boolean;
  leadSource: boolean;
  campaignSource: boolean;
  createdDate: boolean;
  lastContact: boolean;
  actions: boolean;
  leadJourney: boolean;
}

export default function LeadsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { enabledFields, fieldOrder } = useAdmin();
  const { isAuthenticated } = useAuth();
  const [leads, setLeads] = useState<Lead[]>(leadsData);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Listen for lead updates from the lead cleaning page
  useEffect(() => {
    const handleLeadUpdated = (event: CustomEvent) => {
      const { leadId, updatedLead } = event.detail;
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId ? updatedLead : lead
        )
      );
    };
    
    window.addEventListener('leadUpdated', handleLeadUpdated as EventListener);
    
    return () => {
      window.removeEventListener('leadUpdated', handleLeadUpdated as EventListener);
    };
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLeadFilter, setCurrentLeadFilter] = useState('all');
  const [filters, setFilters] = useState<LeadFilters>({
    status: 'All',
    model: 'All',
    city: 'All',
    leadSource: 'All',
    campaignSource: 'All',
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    navigate('/admin');
  };
  
  // Use admin settings for column visibility
  const columnVisibility = useMemo(() => {
    const visibility: ColumnVisibility = {
      firstName: enabledFields.includes('firstName'),
      lastName: enabledFields.includes('lastName'),
      email: enabledFields.includes('email'),
      phoneNumber: enabledFields.includes('phoneNumber'),
      status: enabledFields.includes('status'),
      model: enabledFields.includes('model'),
      city: enabledFields.includes('city'),
      state: enabledFields.includes('state'),
      leadSource: enabledFields.includes('leadSource'),
      campaignSource: enabledFields.includes('campaignSource'),
      createdDate: enabledFields.includes('createdDate'),
      lastContact: enabledFields.includes('lastContact'),
      actions: true, // Always visible
      leadJourney: true, // Always visible
    };
    return visibility;
  }, [enabledFields]);

  const filteredLeads = useMemo(() => {
    let categoryFilteredLeads = leads;
    
    // Apply category filter first
    switch (currentLeadFilter) {
      case 'my':
        categoryFilteredLeads = leads.filter(lead => lead.status === 'Active'); // Mock: treating Active as "My Leads"
        break;
      case 'assigned':
        categoryFilteredLeads = leads.filter(lead => lead.status === 'Hot Lead'); // Mock: treating Hot Lead as "Assigned"
        break;
      case 'nextFollowUp':
        categoryFilteredLeads = leads.filter(lead => lead.subStatus === 'Follow Up'); // Mock: using sub-status
        break;
      case 'closed':
        categoryFilteredLeads = leads.filter(lead => lead.openCloseStatus === 'Closed' || lead.status === 'Closed');
        break;
      case 'transferredFromSM':
        categoryFilteredLeads = leads.filter(lead => lead.leadSource === 'Facebook'); // Mock: using Facebook as transferred
        break;
      case 'reopened':
        categoryFilteredLeads = leads.filter(lead => lead.subStatus === 'Considering'); // Mock: using Considering as reopened
        break;
      case 'all':
      default:
        categoryFilteredLeads = leads;
        break;
    }
    
    return categoryFilteredLeads.filter((lead) => {
      const matchesSearch = 
        lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phoneNumber.includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.id.includes(searchTerm);

      const matchesFilters = 
        (filters.status === 'All' || lead.status === filters.status) &&
        (filters.model === 'All' || lead.model === filters.model) &&
        (filters.city === 'All' || lead.city === filters.city) &&
        (filters.leadSource === 'All' || lead.leadSource === filters.leadSource) &&
        (filters.campaignSource === 'All' || lead.campaignSource === filters.campaignSource);

      return matchesSearch && matchesFilters;
    });
  }, [leads, searchTerm, filters, currentLeadFilter]);

  const handleFilterChange = (filterKey: keyof LeadFilters, value: string) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  const handleEditLead = (lead: Lead) => {
    navigate(`/leads/${lead.id}/clean`);
  };

  const handleViewJourney = (lead: Lead) => {
    setSelectedLead(lead);
    setIsJourneyModalOpen(true);
  };

  const handleSaveLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
  };



  const leadCounts = {
    all: leads.length,
    my: leads.filter(lead => lead.status === 'Active').length,
    assigned: leads.filter(lead => lead.status === 'Hot Lead').length,
    nextFollowUp: leads.filter(lead => lead.subStatus === 'Follow Up').length,
    closed: leads.filter(lead => lead.openCloseStatus === 'Closed' || lead.status === 'Closed').length,
    transferredFromSM: leads.filter(lead => lead.leadSource === 'Facebook').length,
    reopened: leads.filter(lead => lead.subStatus === 'Considering').length,
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Hot Lead':
        return 'destructive';
      case 'Warm Lead':
        return 'default';
      case 'Active':
        return 'default';
      case 'Cold Lead':
        return 'secondary';
      case 'Converted':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        currentFilter={currentLeadFilter}
        onFilterChange={setCurrentLeadFilter}
        leadCounts={leadCounts}
      />
      
      {/* Main Content */}
      <div className="md:ml-80">
        {/* Top Header with Logo */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="/assets/drivepass-logo.png" 
                  alt="Drivepass Logo" 
                  className="h-10 w-auto"
                  onError={(e) => {
                    // Fallback if logo doesn't load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'block';
                  }}
                />
                <div className="hidden text-2xl font-bold text-blue-600">{t('header.company')}</div>
                <div className="ml-4">
                  <h1 className="text-xl font-semibold text-gray-900">{t('header.title')}</h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleAdminClick}
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Button>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      
        <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('page.title')}</h1>
          <p className="text-gray-600">{t('page.subtitle')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t('stats.totalLeads')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t('stats.hotLeads')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {leads.filter(lead => lead.status === 'Hot Lead').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t('stats.activeLeads')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {leads.filter(lead => lead.status === 'Active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t('stats.converted')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {leads.filter(lead => lead.status === 'Converted').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              {t('filters.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('filters.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Column Management - Now controlled by Admin */}
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {t('filters.columns')} (Admin)
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.statusPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === 'All' ? t('common.all') : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filters.model} onValueChange={(value) => handleFilterChange('model', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.modelPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model === 'All' ? t('common.all') : model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filters.city} onValueChange={(value) => handleFilterChange('city', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.cityPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {cityOptions.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city === 'All' ? t('common.all') : city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filters.leadSource} onValueChange={(value) => handleFilterChange('leadSource', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.leadSourcePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {leadSourceOptions.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source === 'All' ? t('common.all') : source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filters.campaignSource} onValueChange={(value) => handleFilterChange('campaignSource', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.campaignSourcePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {campaignSourceOptions.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source === 'All' ? t('common.all') : source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('table.leads')} ({filteredLeads.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('table.serialNumber')}</TableHead>
                    {columnVisibility.createdDate && <TableHead>{t('table.firstContactedDate')}</TableHead>}
                    {columnVisibility.firstName && <TableHead>{t('table.firstName')}</TableHead>}
                    {columnVisibility.lastName && <TableHead>{t('table.lastName')}</TableHead>}
                    {columnVisibility.phoneNumber && <TableHead>{t('table.phoneNumber')}</TableHead>}
                    {columnVisibility.email && <TableHead>{t('table.email')}</TableHead>}
                    {columnVisibility.city && <TableHead>{t('table.city')}</TableHead>}
                    {columnVisibility.model && <TableHead>{t('table.model')}</TableHead>}
                    {columnVisibility.status && <TableHead>{t('table.status')}</TableHead>}
                    <TableHead>{t('table.subStatus')}</TableHead>
                    {columnVisibility.leadSource && <TableHead>{t('table.leadSource')}</TableHead>}
                    {columnVisibility.campaignSource && <TableHead>{t('table.campaignName')}</TableHead>}
                    {columnVisibility.actions && <TableHead>{t('table.actions')}</TableHead>}
                    {columnVisibility.leadJourney && <TableHead>{t('table.leadJourney')}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>{lead.sNo}</TableCell>
                      {columnVisibility.createdDate && <TableCell>{lead.firstContactedDate}</TableCell>}
                      {columnVisibility.firstName && <TableCell className="font-medium">{lead.firstName}</TableCell>}
                      {columnVisibility.lastName && <TableCell>{lead.lastName}</TableCell>}
                      {columnVisibility.phoneNumber && <TableCell>{lead.phoneNumber}</TableCell>}
                      {columnVisibility.email && <TableCell>{lead.email}</TableCell>}
                      {columnVisibility.city && <TableCell>{lead.city}</TableCell>}
                      {columnVisibility.model && <TableCell>{lead.model}</TableCell>}
                      {columnVisibility.status && (
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(lead.status)}>
                            {lead.status}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge variant="outline">{lead.subStatus}</Badge>
                      </TableCell>
                      {columnVisibility.leadSource && <TableCell>{lead.leadSource}</TableCell>}
                      {columnVisibility.campaignSource && <TableCell>{lead.campaignName}</TableCell>}
                      {columnVisibility.actions && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditLead(lead)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                      {columnVisibility.leadJourney && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewJourney(lead)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('table.viewLeadJourney')}</span>
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
        <LeadJourneyModal
          lead={selectedLead}
          isOpen={isJourneyModalOpen}
          onClose={() => setIsJourneyModalOpen(false)}
        />

        <LeadEditModal
          lead={selectedLead}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveLead}
        />

        <AdminLogin
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
        </div>
      </div>
    </div>
  );
}