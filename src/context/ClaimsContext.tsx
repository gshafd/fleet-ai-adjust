import { createContext, useContext, useState, ReactNode } from "react";

export interface Claim {
  id: string;
  policyNumber: string;
  fleetOwner: string;
  vehiclesInvolved: string[];
  lossType: string;
  status: string;
  assignedAdjuster: string;
  payoutEstimate: number;
  currentAgent: string;
  progress: number;
  submittedAt: Date;
  name: string;
  phone: string;
  email: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  description: string;
  files: File[];
}

interface ClaimsContextType {
  claims: Claim[];
  addClaim: (claim: Omit<Claim, 'id' | 'submittedAt'>) => string;
  updateClaim: (id: string, updates: Partial<Claim>) => void;
  getClaim: (id: string) => Claim | undefined;
}

const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

export function ClaimsProvider({ children }: { children: ReactNode }) {
  const [claims, setClaims] = useState<Claim[]>([
    // Mock existing claims
    {
      id: "CL-2024-001234",
      policyNumber: "POL-789456",
      fleetOwner: "ABC Logistics Inc.",
      vehiclesInvolved: ["TRK-001", "VAN-045"],
      lossType: "Collision",
      status: "processing",
      assignedAdjuster: "Sarah Johnson",
      payoutEstimate: 45000,
      currentAgent: "fnol-intake",
      progress: 60,
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      name: "John Smith",
      phone: "(555) 123-4567",
      email: "john@abclogistics.com",
      incidentDate: "2024-01-15",
      incidentTime: "14:30",
      location: "Interstate 95, Mile Marker 127, Baltimore, MD",
      description: "Rear-end collision during heavy traffic",
      files: [],
    },
    {
      id: "CL-2024-001235",
      policyNumber: "POL-789457",
      fleetOwner: "XYZ Transport",
      vehiclesInvolved: ["TRK-002"],
      lossType: "Cargo Theft",
      status: "completed",
      assignedAdjuster: "Mike Chen",
      payoutEstimate: 85000,
      currentAgent: "communication",
      progress: 100,
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      name: "Jane Doe",
      phone: "(555) 987-6543",
      email: "jane@xyztransport.com",
      incidentDate: "2024-01-10",
      incidentTime: "03:15",
      location: "Warehouse District, Houston, TX",
      description: "Cargo theft from locked trailer overnight",
      files: [],
    },
  ]);

  const addClaim = (claimData: Omit<Claim, 'id' | 'submittedAt'>): string => {
    const newId = `CL-2024-${String(Date.now()).slice(-6)}`;
    const newClaim: Claim = {
      ...claimData,
      id: newId,
      submittedAt: new Date(),
    };
    
    setClaims(prev => [newClaim, ...prev]);
    return newId;
  };

  const updateClaim = (id: string, updates: Partial<Claim>) => {
    setClaims(prev => prev.map(claim => 
      claim.id === id ? { ...claim, ...updates } : claim
    ));
  };

  const getClaim = (id: string) => {
    return claims.find(claim => claim.id === id);
  };

  return (
    <ClaimsContext.Provider value={{ claims, addClaim, updateClaim, getClaim }}>
      {children}
    </ClaimsContext.Provider>
  );
}

export function useClaims() {
  const context = useContext(ClaimsContext);
  if (context === undefined) {
    throw new Error('useClaims must be used within a ClaimsProvider');
  }
  return context;
}