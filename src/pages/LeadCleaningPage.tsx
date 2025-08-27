import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, Save, X, User, MapPin, Users, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { leadsData } from '@/data/leadsData';
import type { Lead } from '@/types/leads';

export default function LeadCleaningPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { branches, salesmenByBranch } = useAdmin();
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [followUpDate, setFollowUpDate] = useState<Date>();
  const [lastContactDate, setLastContactDate] = useState<Date>();

  // Form state
  const [formData, setFormData] = useState({
    // Lead Details Section
    salutation: '',
    firstName: '',
    lastName: '',
    email: '',
    branch: '',
    phoneNumber: '',
    leadChannel: '',
    leadSource: '',
    status: '',
    leadSubStatus: '',
    leadStatusReason: '',
    purchasePeriod: 'Warm',
    paymentMethod: '',
    
    // Contact Information Section
    street: '',
    city: '',
    state: '',
    zipCode: '',
    secondaryPhone: '',
    preferredContact: 'Phone',
    timeZone: 'PST',
    
    // Assignment Section
    isQualified: 'NO',
    assignmentBranch: '',
    assignedSalesman: '',
    team: '',
    notes: '',
    
    // Ticket Details Section
    ticketId: '',
    issueCategory: '',
    resolutionStatus: 'Open',
    model: '',
  });

  useEffect(() => {
    // Find the lead by ID
    const foundLead = leadsData.find(l => l.id === id);
    if (foundLead) {
      setLead(foundLead);
      setFormData({
        salutation: '',
        firstName: foundLead.firstName,
        lastName: foundLead.lastName,
        email: foundLead.email,
        branch: '',
        phoneNumber: foundLead.phoneNumber,
        leadChannel: foundLead.leadSource,
        leadSource: '',
        status: foundLead.status,
        leadSubStatus: '',
        leadStatusReason: '',
        purchasePeriod: 'Warm',
        paymentMethod: '',
        street: foundLead.address || '',
        city: foundLead.city,
        state: foundLead.state || '',
        zipCode: '',
        secondaryPhone: '',
        preferredContact: 'Phone',
        timeZone: 'PST',
        isQualified: 'NO',
        assignmentBranch: '',
        assignedSalesman: foundLead.assignedSalesman || '',
        team: '',
        notes: '',
        ticketId: foundLead.id,
        issueCategory: '',
        resolutionStatus: 'Open',
        model: foundLead.model || '',
      });
      
      if (foundLead.lastContact) {
        setLastContactDate(new Date(foundLead.lastContact));
      }
    }
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Clear salesman selection when qualification changes to NO or branch changes
      if (field === 'isQualified' && value === 'NO') {
        newData.assignedSalesman = '';
      }
      if (field === 'assignmentBranch') {
        newData.assignedSalesman = '';
      }
      
      return newData;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    
    // Update the lead in leadsData
    if (lead) {
      const updatedLead = {
        ...lead,
        firstName: formData.firstName,
        lastName: formData.lastName,
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        leadSource: formData.leadSource,
        status: formData.status,
        model: formData.model,
        city: formData.city,
        state: formData.state,
        address: formData.street,
        assignedSalesman: formData.assignedSalesman,
        lastContact: lastContactDate ? lastContactDate.toISOString().split('T')[0] : lead.lastContact,
      };
      
      // Update the lead in the original leadsData array
      const leadIndex = leadsData.findIndex(l => l.id === lead.id);
      if (leadIndex !== -1) {
        leadsData[leadIndex] = updatedLead;
      }
      
      // Also trigger a custom event to notify other components of the update
      window.dispatchEvent(new CustomEvent('leadUpdated', { 
        detail: { leadId: lead.id, updatedLead } 
      }));
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Lead Not Found</h2>
          <Button onClick={() => navigate('/')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  const statusOptions = ['Lead Created', 'Lead Contacted', 'Lead Qualified'];
  const leadSubStatusOptions = ['New Lead', 'Duplicate Lead'];
  const leadStatusReasonOptions = ['Lead Duplicate', 'Proceed the older Record'];
  const salutationOptions = ['Mr', 'Mrs', 'Ms', 'Dr'];
  const branchOptions = ['Jeddah', 'Makkah', 'Madinas', 'Riyadh', 'Dammam', 'Khboer', 'Neom', 'Al Ula'];
  const leadChannelOptions = ['FB', 'Twitter', 'Instagram', 'YT', 'Google +', 'Linkedin'];
  const leadSourceOptions = ['Advertisement', 'Customer Event', 'Employee Referral', 'Google AdWords', 'Other', 'Partner', 'Purchased List', 'Trade Show', 'Webinar', 'Website', 'Social Media', 'Facebook Lead Gen', 'Walk In', 'Call Center', 'Event', 'Social Organic', 'Digital Brochure'];
  const purchasePeriodOptions = ['Hot', 'Warm', 'Cold'];
  const paymentMethodOptions = ['Cash', 'Finance'];
  const contactMethods = ['Phone', 'Email', 'SMS', 'WhatsApp'];
  const timeZones = ['PST', 'EST', 'MST', 'CST'];
  const teams = ['Sales Team A', 'Sales Team B', 'Premium Sales', 'Corporate Sales'];
  const assignmentBranchOptions = branches;
  const qualificationOptions = ['YES', 'NO'];
  
  const availableSalesmen = formData.assignmentBranch ? salesmenByBranch[formData.assignmentBranch] || [] : [];
  const isSalesmanEnabled = formData.isQualified === 'YES' && formData.assignmentBranch;
  const issueCategories = ['Technical', 'Billing', 'Product Inquiry', 'Support', 'Complaint'];
  const resolutionStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

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
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Lead Screening
                </h1>
                <p className="text-sm text-gray-500">
                  {lead.firstName} {lead.lastName} - ID: {lead.id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Lead Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Lead General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 flex-col items-start space-y-2"
                >
                  <Label className="text-sm font-medium">Salutation</Label>
                  <Select value={formData.salutation} onValueChange={(value) => handleInputChange('salutation', value)}>
                    <SelectTrigger className="border-0 p-0 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {salutationOptions.map(salutation => (
                        <SelectItem key={salutation} value={salutation}>{salutation}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 flex-col items-start space-y-2"
                >
                  <Label className="text-sm font-medium">First Name</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="border-0 p-0 h-8"
                  />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 flex-col items-start space-y-2"
                >
                  <Label className="text-sm font-medium">Last Name</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="border-0 p-0 h-8"
                  />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 flex-col items-start space-y-2"
                >
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="border-0 p-0 h-8"
                  />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 flex-col items-start space-y-2"
                >
                  <Label className="text-sm font-medium">Branch</Label>
                  <Select value={formData.branch} onValueChange={(value) => handleInputChange('branch', value)}>
                    <SelectTrigger className="border-0 p-0 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {branchOptions.map(branch => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Button>
              </div>
              
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 flex-col items-start space-y-2"
              >
                <Label className="text-sm font-medium">Phone Number</Label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="border-0 p-0 h-8"
                />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 flex-col items-start space-y-2"
                >
                  <Label className="text-sm font-medium">Lead Channel</Label>
                  <Select value={formData.leadChannel} onValueChange={(value) => handleInputChange('leadChannel', value)}>
                    <SelectTrigger className="border-0 p-0 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {leadChannelOptions.map(channel => (
                        <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 flex-col items-start space-y-2"
                >
                  <Label className="text-sm font-medium">Lead Source</Label>
                  <Select value={formData.leadSource} onValueChange={(value) => handleInputChange('leadSource', value)}>
                    <SelectTrigger className="border-0 p-0 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {leadSourceOptions.map(source => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Button>
              </div>
              
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 flex-col items-start space-y-2"
              >
                <Label className="text-sm font-medium">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="border-0 p-0 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 flex-col items-start space-y-2"
                >
                  <Label className="text-sm font-medium">Lead Sub Status</Label>
                  <Select value={formData.leadSubStatus} onValueChange={(value) => handleInputChange('leadSubStatus', value)}>
                    <SelectTrigger className="border-0 p-0 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {leadSubStatusOptions.map(subStatus => (
                        <SelectItem key={subStatus} value={subStatus}>{subStatus}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 flex-col items-start space-y-2"
                >
                  <Label className="text-sm font-medium">Lead Status Reason</Label>
                  <Select value={formData.leadStatusReason} onValueChange={(value) => handleInputChange('leadStatusReason', value)}>
                    <SelectTrigger className="border-0 p-0 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {leadStatusReasonOptions.map(reason => (
                        <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 flex-col items-start space-y-2"
                >
                  <Label className="text-sm font-medium">Purchase Period</Label>
                  <Select value={formData.purchasePeriod} onValueChange={(value) => handleInputChange('purchasePeriod', value)}>
                    <SelectTrigger className="border-0 p-0 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {purchasePeriodOptions.map(period => (
                        <SelectItem key={period} value={period}>{period}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 flex-col items-start space-y-2"
                >
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                    <SelectTrigger className="border-0 p-0 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethodOptions.map(method => (
                        <SelectItem key={method} value={method}>{method}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Button>
              </div>
              
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 flex-col items-start space-y-2"
              >
                <Label className="text-sm font-medium">Model</Label>
                <Input
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="border-0 p-0 h-8"
                />
              </Button>

              <div>
                <Label>Last Contact</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !lastContactDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {lastContactDate ? format(lastContactDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={lastContactDate}
                      onSelect={setLastContactDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                <Input
                  id="secondaryPhone"
                  value={formData.secondaryPhone}
                  onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Preferred Contact</Label>
                  <Select value={formData.preferredContact} onValueChange={(value) => handleInputChange('preferredContact', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contactMethods.map(method => (
                        <SelectItem key={method} value={method}>{method}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Time Zone</Label>
                  <Select value={formData.timeZone} onValueChange={(value) => handleInputChange('timeZone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeZones.map(tz => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Is this lead qualified?</Label>
                <Select value={formData.isQualified} onValueChange={(value) => handleInputChange('isQualified', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {qualificationOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Branch</Label>
                <Select value={formData.assignmentBranch} onValueChange={(value) => handleInputChange('assignmentBranch', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assignmentBranchOptions.map(branch => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Assigned Salesman</Label>
                <Select 
                  value={formData.assignedSalesman} 
                  onValueChange={(value) => handleInputChange('assignedSalesman', value)}
                  disabled={!isSalesmanEnabled}
                >
                  <SelectTrigger className={!isSalesmanEnabled ? 'opacity-50 cursor-not-allowed' : ''}>
                    <SelectValue placeholder={!isSalesmanEnabled ? 'Please qualify lead and select branch first' : 'Select salesman'} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSalesmen.map(salesman => (
                      <SelectItem key={salesman} value={salesman}>{salesman}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Team</Label>
                <Select value={formData.team} onValueChange={(value) => handleInputChange('team', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(team => (
                      <SelectItem key={team} value={team}>{team}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Follow Up Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !followUpDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {followUpDate ? format(followUpDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={followUpDate}
                      onSelect={setFollowUpDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter notes about this lead..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Ticket Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ticket className="h-5 w-5 mr-2" />
                Ticket Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ticketId">Ticket ID</Label>
                <Input
                  id="ticketId"
                  value={formData.ticketId}
                  onChange={(e) => handleInputChange('ticketId', e.target.value)}
                  disabled
                />
              </div>
              
              <div>
                <Label>Issue Category</Label>
                <Select value={formData.issueCategory} onValueChange={(value) => handleInputChange('issueCategory', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {issueCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Resolution Status</Label>
                <Select value={formData.resolutionStatus} onValueChange={(value) => handleInputChange('resolutionStatus', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {resolutionStatuses.map(status => (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center">
                          <Badge variant={status === 'Resolved' ? 'default' : 'secondary'} className="mr-2">
                            {status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Timeline</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Created</span>
                    <span>{lead.createdDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated</span>
                    <span>{format(new Date(), "MMM dd, yyyy")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}