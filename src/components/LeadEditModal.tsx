import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lead } from '@/types/leads';
import { statusOptions, modelOptions, cityOptions, leadSourceOptions } from '@/data/leadsData';

interface LeadEditModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
}

export default function LeadEditModal({ lead, isOpen, onClose, onSave }: LeadEditModalProps) {
  const [editedLead, setEditedLead] = useState<Lead | null>(lead);

  const handleSave = () => {
    if (editedLead) {
      onSave(editedLead);
      onClose();
    }
  };

  const handleInputChange = (field: keyof Lead, value: string) => {
    if (editedLead) {
      setEditedLead({ ...editedLead, [field]: value });
    }
  };

  if (!editedLead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lead - {editedLead.customerName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={editedLead.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={editedLead.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editedLead.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="city">City</Label>
            <Select value={editedLead.city} onValueChange={(value) => handleInputChange('city', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cityOptions.filter(city => city !== 'All').map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="model">Model</Label>
            <Select value={editedLead.model} onValueChange={(value) => handleInputChange('model', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.filter(model => model !== 'All').map((model) => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={editedLead.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.filter(status => status !== 'All').map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="subStatus">Sub Status</Label>
            <Input
              id="subStatus"
              value={editedLead.subStatus}
              onChange={(e) => handleInputChange('subStatus', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="leadSource">Lead Source</Label>
            <Select value={editedLead.leadSource} onValueChange={(value) => handleInputChange('leadSource', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {leadSourceOptions.filter(source => source !== 'All').map((source) => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="salaryRange">Salary Range</Label>
            <Input
              id="salaryRange"
              value={editedLead.salaryRange}
              onChange={(e) => handleInputChange('salaryRange', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="requestType">Request Type</Label>
            <Input
              id="requestType"
              value={editedLead.requestType}
              onChange={(e) => handleInputChange('requestType', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="campaignName">Campaign Name</Label>
            <Input
              id="campaignName"
              value={editedLead.campaignName}
              onChange={(e) => handleInputChange('campaignName', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="callTime">Call Time</Label>
            <Input
              id="callTime"
              value={editedLead.callTime}
              onChange={(e) => handleInputChange('callTime', e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}