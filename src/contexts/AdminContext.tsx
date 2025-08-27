import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface FieldConfig {
  id: string;
  label: string;
  enabled: boolean;
  order: number;
}

interface AdminContextType {
  // Field management
  availableFields: FieldConfig[];
  enabledFields: string[];
  fieldOrder: string[];
  updateFieldVisibility: (fieldId: string, enabled: boolean) => void;
  updateFieldOrder: (newOrder: string[]) => void;
  resetFieldsToDefault: () => void;
  
  // Branch management
  branches: string[];
  addBranch: (name: string) => void;
  editBranch: (oldName: string, newName: string) => void;
  deleteBranch: (name: string) => void;
  
  // Salesman management
  salesmenByBranch: Record<string, string[]>;
  addSalesman: (branch: string, name: string) => void;
  editSalesman: (branch: string, oldName: string, newName: string) => void;
  deleteSalesman: (branch: string, name: string) => void;
  moveSalesman: (fromBranch: string, toBranch: string, name: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const defaultFields: FieldConfig[] = [
  { id: 'serialNumber', label: 'Serial Number', enabled: true, order: 0 },
  { id: 'createdDate', label: 'First Contacted Date', enabled: true, order: 1 },
  { id: 'firstName', label: 'First Name', enabled: true, order: 2 },
  { id: 'lastName', label: 'Last Name', enabled: true, order: 3 },
  { id: 'phoneNumber', label: 'Phone Number', enabled: true, order: 4 },
  { id: 'email', label: 'Email', enabled: true, order: 5 },
  { id: 'city', label: 'City', enabled: true, order: 6 },
  { id: 'model', label: 'Model', enabled: true, order: 7 },
  { id: 'status', label: 'Status', enabled: true, order: 8 },
  { id: 'subStatus', label: 'Sub Status', enabled: true, order: 9 },
  { id: 'leadSource', label: 'Lead Source', enabled: true, order: 10 },
  { id: 'campaignSource', label: 'Campaign Name', enabled: true, order: 11 },
  { id: 'actions', label: 'Actions', enabled: true, order: 12 },
  { id: 'leadJourney', label: 'Lead Journey', enabled: true, order: 13 }
];

const defaultBranches = ['Jeddah', 'Riyadh', 'Dammam'];

const defaultSalesmenByBranch = {
  'Jeddah': ['Ahmed Al-Rashid', 'Khalid Al-Mahmoud', 'Omar Al-Farid'],
  'Riyadh': ['Hassan Al-Saud', 'Mohammed Al-Otaibi', 'Abdullah Al-Dosari'],
  'Dammam': ['Saeed Al-Ghamdi', 'Fahad Al-Harbi', 'Nasser Al-Qahtani']
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [availableFields, setAvailableFields] = useState<FieldConfig[]>(defaultFields);
  const [branches, setBranches] = useState<string[]>(defaultBranches);
  const [salesmenByBranch, setSalesmenByBranch] = useState<Record<string, string[]>>(defaultSalesmenByBranch);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFields = localStorage.getItem('adminFields');
    const savedBranches = localStorage.getItem('adminBranches');
    const savedSalesmen = localStorage.getItem('adminSalesmen');

    if (savedFields) {
      setAvailableFields(JSON.parse(savedFields));
    }
    if (savedBranches) {
      setBranches(JSON.parse(savedBranches));
    }
    if (savedSalesmen) {
      setSalesmenByBranch(JSON.parse(savedSalesmen));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('adminFields', JSON.stringify(availableFields));
  }, [availableFields]);

  useEffect(() => {
    localStorage.setItem('adminBranches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('adminSalesmen', JSON.stringify(salesmenByBranch));
  }, [salesmenByBranch]);

  const enabledFields = availableFields.filter(field => field.enabled).map(field => field.id);
  const fieldOrder = availableFields.sort((a, b) => a.order - b.order).map(field => field.id);

  const updateFieldVisibility = (fieldId: string, enabled: boolean) => {
    setAvailableFields(prev => 
      prev.map(field => 
        field.id === fieldId ? { ...field, enabled } : field
      )
    );
  };

  const updateFieldOrder = (newOrder: string[]) => {
    setAvailableFields(prev => 
      prev.map(field => ({
        ...field,
        order: newOrder.indexOf(field.id)
      }))
    );
  };

  const resetFieldsToDefault = () => {
    setAvailableFields(defaultFields);
  };

  const addBranch = (name: string) => {
    if (!branches.includes(name)) {
      setBranches(prev => [...prev, name]);
      setSalesmenByBranch(prev => ({ ...prev, [name]: [] }));
    }
  };

  const editBranch = (oldName: string, newName: string) => {
    setBranches(prev => prev.map(branch => branch === oldName ? newName : branch));
    setSalesmenByBranch(prev => {
      const { [oldName]: salesmen, ...rest } = prev;
      return { ...rest, [newName]: salesmen || [] };
    });
  };

  const deleteBranch = (name: string) => {
    setBranches(prev => prev.filter(branch => branch !== name));
    setSalesmenByBranch(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const addSalesman = (branch: string, name: string) => {
    setSalesmenByBranch(prev => ({
      ...prev,
      [branch]: [...(prev[branch] || []), name]
    }));
  };

  const editSalesman = (branch: string, oldName: string, newName: string) => {
    setSalesmenByBranch(prev => ({
      ...prev,
      [branch]: prev[branch]?.map(name => name === oldName ? newName : name) || []
    }));
  };

  const deleteSalesman = (branch: string, name: string) => {
    setSalesmenByBranch(prev => ({
      ...prev,
      [branch]: prev[branch]?.filter(salesman => salesman !== name) || []
    }));
  };

  const moveSalesman = (fromBranch: string, toBranch: string, name: string) => {
    setSalesmenByBranch(prev => ({
      ...prev,
      [fromBranch]: prev[fromBranch]?.filter(salesman => salesman !== name) || [],
      [toBranch]: [...(prev[toBranch] || []), name]
    }));
  };

  const value: AdminContextType = {
    availableFields,
    enabledFields,
    fieldOrder,
    updateFieldVisibility,
    updateFieldOrder,
    resetFieldsToDefault,
    branches,
    addBranch,
    editBranch,
    deleteBranch,
    salesmenByBranch,
    addSalesman,
    editSalesman,
    deleteSalesman,
    moveSalesman
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}