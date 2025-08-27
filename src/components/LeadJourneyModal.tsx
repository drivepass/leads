import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Lead } from '@/types/leads';
import { Calendar, Phone, Mail, MapPin, Car, DollarSign } from 'lucide-react';

interface LeadJourneyModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadJourneyModal({ lead, isOpen, onClose }: LeadJourneyModalProps) {
  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Lead Journey - {lead.customerName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{lead.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{lead.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{lead.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{lead.model}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{lead.salaryRange}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{lead.firstContactedDate}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Lead Status */}
          <div>
            <h3 className="font-semibold mb-3">Current Status</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge variant={lead.status === 'Hot Lead' ? 'destructive' : lead.status === 'Warm Lead' ? 'default' : 'secondary'}>
                {lead.status}
              </Badge>
              <Badge variant="outline">{lead.subStatus}</Badge>
              <Badge variant={lead.openCloseStatus === 'Open' ? 'default' : 'secondary'}>
                {lead.openCloseStatus}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Campaign Information */}
          <div>
            <h3 className="font-semibold mb-3">Campaign & Source</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Campaign Name</p>
                <p className="font-medium">{lead.campaignName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lead Source</p>
                <p className="font-medium">{lead.leadSource}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lead Channel</p>
                <p className="font-medium">{lead.leadChannel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Call Time</p>
                <p className="font-medium">{lead.callTime}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Engagement Details */}
          <div>
            <h3 className="font-semibold mb-3">Engagement Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Request Type</p>
                <p className="font-medium">{lead.requestType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Showroom Visit</p>
                <Badge variant={lead.showroomVisit === 'Yes' ? 'default' : 'secondary'}>
                  {lead.showroomVisit}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}