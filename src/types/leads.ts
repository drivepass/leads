export interface Lead {
  id: string;
  sNo: number;
  firstContactedDate: string;
  customerName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  city: string;
  state: string;
  vehicle: string;
  salaryRange: string;
  showroomVisit: string;
  requestType: string;
  model: string;
  status: string;
  subStatus: string;
  openCloseStatus: string;
  leadChannel: string;
  leadSource: string;
  campaignName: string;
  campaignSource: string;
  callTime: string;
  createdDate: string;
  lastContact: string;
  assignedSalesman?: string;
}

export interface LeadFilters {
  status: string;
  model: string;
  city: string;
  leadSource: string;
  campaignSource: string;
}