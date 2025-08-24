import { createContext, useContext, useState, ReactNode } from "react";

export interface Claim {
  id: string;
  policyNumber: string;
  fleetOwner: string;
  driverName: string;
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
  fraudRiskScore: 'High' | 'Medium' | 'Low';
  // Agent outputs and edits
  agentOutputs?: Record<string, string>;
  editedData?: Record<string, any>;
  adjusterDetails?: {
    name: string;
    email: string;
    phone: string;
    location: string;
    expertise: string;
    assignedAt: Date;
  };
}

interface ClaimsContextType {
  claims: Claim[];
  addClaim: (claim: Omit<Claim, 'id' | 'submittedAt'>) => string;
  updateClaim: (id: string, updates: Partial<Claim>) => void;
  getClaim: (id: string) => Claim | undefined;
  saveAgentOutput: (claimId: string, agentId: string, output: string) => void;
  saveEditedData: (claimId: string, agentId: string, data: any) => void;
}

const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

export function ClaimsProvider({ children }: { children: ReactNode }) {
  const [claims, setClaims] = useState<Claim[]>([
    // Sample claims with various statuses and complete information
    {
      id: "CL-2024-001234",
      policyNumber: "POL-789456",
      fleetOwner: "ABC Logistics Inc.",
      driverName: "Michael Rodriguez",
      vehiclesInvolved: ["TRK-001", "VAN-045"],
      lossType: "Collision",
      status: "completed",
      assignedAdjuster: "Sarah Johnson",
      payoutEstimate: 23500,
      currentAgent: "completed",
      progress: 100,
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      name: "John Smith",
      phone: "(555) 123-4567",
      email: "john@abclogistics.com",
      incidentDate: "2024-01-15",
      incidentTime: "14:30",
      location: "Interstate 95, Mile Marker 127, Baltimore, MD",
      description: "Rear-end collision during heavy traffic causing front-end damage to vehicle",
      files: [],
      fraudRiskScore: 'Low',
      adjusterDetails: {
        name: "Sarah Johnson",
        email: "sarah.johnson@autosure.com",
        phone: "(555) 234-5671",
        location: "Chicago, IL",
        expertise: "Collision Claims",
        assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      agentOutputs: {
        'settlement-payout': 'Net Payout: $23,500'
      },
    },
    {
      id: "CL-2024-001235",
      policyNumber: "POL-789457",
      fleetOwner: "XYZ Transport Co.",
      driverName: "Carlos Martinez",
      vehiclesInvolved: ["TRK-002"],
      lossType: "Cargo Theft",
      status: "processing",
      assignedAdjuster: "Mike Chen",
      payoutEstimate: 65000,
      currentAgent: "damage-assessment",
      progress: 75,
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      name: "Jane Doe",
      phone: "(555) 987-6543",
      email: "jane@xyztransport.com",
      incidentDate: "2024-01-10",
      incidentTime: "03:15",
      location: "Warehouse District, Houston, TX",
      description: "Cargo theft from locked trailer overnight - electronics shipment stolen",
      files: [],
      fraudRiskScore: 'Medium',
      adjusterDetails: {
        name: "Mike Chen",
        email: "mike.chen@autosure.com",
        phone: "(555) 345-6782",
        location: "Denver, CO",
        expertise: "Cargo & Theft Claims",
        assignedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      agentOutputs: {
        'damage-assessment': 'Total Damage Amount: $65,000'
      },
    },
    {
      id: "CL-2024-001236",
      policyNumber: "POL-789458",
      fleetOwner: "Metro Delivery Services",
      driverName: "James Wilson",
      vehiclesInvolved: ["VAN-012"],
      lossType: "Vehicle Theft",
      status: "fraud-review",
      assignedAdjuster: "Lisa Rodriguez",
      payoutEstimate: 35000,
      currentAgent: "fraud-detection",
      progress: 45,
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      name: "Robert Chen",
      phone: "(555) 456-7890",
      email: "robert@metrodelivery.com",
      incidentDate: "2024-01-12",
      incidentTime: "22:00",
      location: "Downtown Parking Garage, Miami, FL",
      description: "Commercial van stolen from secured parking facility",
      files: [],
      fraudRiskScore: 'High',
      adjusterDetails: {
        name: "Lisa Rodriguez",
        email: "lisa.rodriguez@autosure.com",
        phone: "(555) 456-7893",
        location: "Phoenix, AZ",
        expertise: "Liability & Fraud Claims",
        assignedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    },
    {
      id: "CL-2024-001237",
      policyNumber: "POL-789459",
      fleetOwner: "Swift Cargo Solutions",
      driverName: "Robert Johnson",
      vehiclesInvolved: ["TRK-045", "TRL-089"],
      lossType: "Multi-Vehicle Collision",
      status: "processing",
      assignedAdjuster: "David Kim",
      payoutEstimate: 87500,
      currentAgent: "coverage-verification",
      progress: 60,
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      name: "Maria Garcia",
      phone: "(555) 234-5678",
      email: "maria@swiftcargo.com",
      incidentDate: "2024-01-18",
      incidentTime: "16:45",
      location: "Highway 10 West, Phoenix, AZ",
      description: "Multi-vehicle accident involving truck and trailer in heavy rain conditions",
      files: [],
      fraudRiskScore: 'Low',
      adjusterDetails: {
        name: "David Kim",
        email: "david.kim@autosure.com",
        phone: "(555) 567-8904",
        location: "Seattle, WA",
        expertise: "Fleet & Multi-Vehicle Claims",
        assignedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    },
    {
      id: "CL-2024-001238",
      policyNumber: "POL-789460",
      fleetOwner: "Urban Express LLC",
      driverName: "Thomas Anderson",
      vehiclesInvolved: ["VAN-023"],
      lossType: "Property Damage",
      status: "submitted",
      assignedAdjuster: "Sarah Johnson",
      payoutEstimate: 0,
      currentAgent: "fnol-intake",
      progress: 15,
      submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      name: "Alex Thompson",
      phone: "(555) 789-0123",
      email: "alex@urbanexpress.com",
      incidentDate: "2024-01-19",
      incidentTime: "11:20",
      location: "Broadway & 42nd Street, New York, NY",
      description: "Delivery van collided with building entrance causing structural damage",
      files: [],
      fraudRiskScore: 'Medium',
      adjusterDetails: {
        name: "Sarah Johnson",
        email: "sarah.johnson@autosure.com",
        phone: "(555) 234-5671",
        location: "Chicago, IL",
        expertise: "Property Damage Claims",
        assignedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
    },
    {
      id: "CL-2024-001239",
      policyNumber: "POL-789461",
      fleetOwner: "Coastal Transport Inc.",
      driverName: "David Thompson",
      vehiclesInvolved: ["TRK-067"],
      lossType: "Weather Damage",
      status: "completed",
      assignedAdjuster: "Mike Chen",
      payoutEstimate: 18750,
      currentAgent: "completed",
      progress: 100,
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      name: "Jennifer Lee",
      phone: "(555) 345-6789",
      email: "jennifer@coastaltransport.com",
      incidentDate: "2024-01-08",
      incidentTime: "19:30",
      location: "Interstate 4, Orlando, FL",
      description: "Hail damage to truck cab and cargo area during severe thunderstorm",
      files: [],
      fraudRiskScore: 'Low',
      adjusterDetails: {
        name: "Mike Chen",
        email: "mike.chen@autosure.com",
        phone: "(555) 345-6782",
        location: "Denver, CO",
        expertise: "Weather & Environmental Claims",
        assignedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      agentOutputs: {
        'settlement-payout': 'Net Payout: $18,750',
        'damage-assessment': 'Total Damage Amount: $21,250'
      },
    },
    {
      id: "CL-2024-001240",
      policyNumber: "POL-789462",
      fleetOwner: "Prime Logistics Group",
      driverName: "Steven Garcia",
      vehiclesInvolved: ["TRK-134", "TRL-456"],
      lossType: "Fire Damage",
      status: "processing",
      assignedAdjuster: "Lisa Rodriguez",
      payoutEstimate: 125000,
      currentAgent: "damage-assessment",
      progress: 80,
      submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      name: "Michael Brown",
      phone: "(555) 678-9012",
      email: "michael@primelogistics.com",
      incidentDate: "2024-01-14",
      incidentTime: "08:15",
      location: "Rest Area Mile 245, I-75 North, Georgia",
      description: "Engine fire spread to cargo area causing total loss of vehicle and partial cargo damage",
      files: [],
      fraudRiskScore: 'Medium',
      adjusterDetails: {
        name: "Lisa Rodriguez", 
        email: "lisa.rodriguez@autosure.com",
        phone: "(555) 456-7893",
        location: "Phoenix, AZ",
        expertise: "Total Loss & Fire Damage",
        assignedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      agentOutputs: {
        'damage-assessment': 'Total Damage Amount: $125,000'
      },
    },
    {
      id: "CL-2024-001241",
      policyNumber: "POL-789463",
      fleetOwner: "Reliable Freight Systems",
      driverName: "Mark Davis",
      vehiclesInvolved: ["VAN-078"],
      lossType: "Vandalism",
      status: "submitted",
      assignedAdjuster: "David Kim",
      payoutEstimate: 0,
      currentAgent: "validation",
      progress: 25,
      submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      name: "Sarah Wilson",
      phone: "(555) 890-1234",
      email: "sarah@reliablefreight.com",
      incidentDate: "2024-01-19",
      incidentTime: "02:45",
      location: "Industrial District, Detroit, MI",
      description: "Commercial van windows broken and tires slashed during overnight parking",
      files: [],
      fraudRiskScore: 'High',
      adjusterDetails: {
        name: "David Kim",
        email: "david.kim@autosure.com",
        phone: "(555) 567-8904",
        location: "Seattle, WA",
        expertise: "Vandalism & Theft Claims",
        assignedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
    },
    {
      id: "CL-2024-001242",
      policyNumber: "POL-789464",
      fleetOwner: "Express Route Partners",
      driverName: "Anthony Wilson",
      vehiclesInvolved: ["TRK-089"],
      lossType: "Mechanical Failure",
      status: "error",
      assignedAdjuster: "Sarah Johnson",
      payoutEstimate: 0,
      currentAgent: "claim-creation",
      progress: 30,
      submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      name: "Kevin Davis",
      phone: "(555) 012-3456",
      email: "kevin@expressroute.com",
      incidentDate: "2024-01-06",
      incidentTime: "13:40",
      location: "Highway 101, San Francisco, CA",
      description: "Engine failure during delivery route causing roadside breakdown and towing",
      files: [],
      fraudRiskScore: 'Low',
      adjusterDetails: {
        name: "Sarah Johnson",
        email: "sarah.johnson@autosure.com",
        phone: "(555) 234-5671",
        location: "Chicago, IL",
        expertise: "Mechanical & Breakdown Claims",
        assignedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
    },
    {
      id: "CL-2024-001243",
      policyNumber: "POL-789465",
      fleetOwner: "Northeast Shipping Co.",
      driverName: "Brian Miller",
      vehiclesInvolved: ["TRK-156", "TRL-234"],
      lossType: "Jackknife Accident",
      status: "processing",
      assignedAdjuster: "Mike Chen",
      payoutEstimate: 95000,
      currentAgent: "settlement-payout",
      progress: 90,
      submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      name: "Patricia Martinez",
      phone: "(555) 123-7890",
      email: "patricia@northeastshipping.com",
      incidentDate: "2024-01-09",
      incidentTime: "05:30",
      location: "I-95 North, Exit 47, Massachusetts",
      description: "Truck jackknifed on icy road conditions causing guardrail damage and cargo spill",
      files: [],
      fraudRiskScore: 'Low',
      adjusterDetails: {
        name: "Mike Chen",
        email: "mike.chen@autosure.com",
        phone: "(555) 345-6782",
        location: "Denver, CO",
        expertise: "Severe Weather & Accident Claims",
        assignedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      agentOutputs: {
        'damage-assessment': 'Total Damage Amount: $97,500',
        'settlement-payout': 'Net Payout: $95,000'
      },
    }
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

  const saveAgentOutput = (claimId: string, agentId: string, output: string) => {
    setClaims(prev => prev.map(claim => 
      claim.id === claimId ? { 
        ...claim, 
        agentOutputs: { 
          ...claim.agentOutputs, 
          [agentId]: output 
        }
      } : claim
    ));
  };

  const saveEditedData = (claimId: string, agentId: string, data: any) => {
    setClaims(prev => prev.map(claim => 
      claim.id === claimId ? { 
        ...claim, 
        editedData: { 
          ...claim.editedData, 
          [agentId]: data 
        }
      } : claim
    ));
  };

  return (
    <ClaimsContext.Provider value={{ claims, addClaim, updateClaim, getClaim, saveAgentOutput, saveEditedData }}>
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