import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Calculator, 
  Mail, 
  Clock, 
  Eye,
  TrendingUp,
  Users,
  Car
} from "lucide-react";

// Mock data for demonstration
const mockClaims = [
  {
    id: "CL-2024-001234",
    policyNumber: "POL-789456",
    fleetOwner: "ABC Logistics Inc.",
    vehiclesInvolved: ["TRK-001", "VAN-045"],
    lossType: "Collision",
    status: "processing",
    assignedAdjuster: "Sarah Johnson",
    payoutEstimate: 45000,
    currentAgent: "damage-assessment",
    progress: 60,
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
  },
  {
    id: "CL-2024-001236",
    policyNumber: "POL-789458",
    fleetOwner: "DEF Shipping",
    vehiclesInvolved: ["VAN-012", "TRL-008"],
    lossType: "Liability",
    status: "fraud-review",
    assignedAdjuster: "Lisa Park",
    payoutEstimate: 125000,
    currentAgent: "fraud-detection",
    progress: 30,
  },
];

const agentPipeline = [
  { id: "fnol-intake", name: "FNOL Intake", icon: FileText, color: "agent-intake" },
  { id: "validation", name: "Validation", icon: Shield, color: "agent-validation" },
  { id: "fraud-detection", name: "Fraud Detection", icon: AlertTriangle, color: "agent-fraud" },
  { id: "claim-creation", name: "Claim Creation", icon: CheckCircle, color: "agent-claim" },
  { id: "coverage-verification", name: "Coverage Verification", icon: Shield, color: "agent-coverage" },
  { id: "damage-assessment", name: "Damage Assessment", icon: Eye, color: "agent-damage" },
  { id: "settlement-calculation", name: "Settlement Calculation", icon: Calculator, color: "agent-settlement" },
  { id: "communication", name: "Communication", icon: Mail, color: "agent-communication" },
];

export default function Dashboard() {
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pipeline");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "processing": return "status-processing";
      case "fraud-review": return "warning";
      case "error": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "processing": return "Processing";
      case "fraud-review": return "Fraud Review";
      case "error": return "Error";
      default: return "Pending";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Claims Management Dashboard</h1>
            <p className="text-muted-foreground">Autonomous AI-powered claims processing</p>
          </div>
          <div className="flex gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Processing Time</p>
                  <p className="text-lg font-bold">4.2 min avg</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-lg font-bold">98.5%</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "pipeline", label: "Agent Pipeline" },
            { id: "claims", label: "Claims Overview" },
            { id: "fleet", label: "Fleet Management" },
            { id: "adjusters", label: "Adjuster Allocation" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Agent Pipeline View */}
        {activeTab === "pipeline" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sub-Agent Orchestration Pipeline</CardTitle>
                <CardDescription>
                  Real-time status of AI agents processing claims end-to-end
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-8">
                  {agentPipeline.map((agent, index) => (
                    <div key={agent.id} className="flex flex-col items-center flex-1">
                      <div 
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 bg-${agent.color}/20 border-${agent.color}`}
                      >
                        <agent.icon className={`w-6 h-6 text-${agent.color}`} />
                      </div>
                      <p className="text-xs font-medium text-center">{agent.name}</p>
                      {index < agentPipeline.length - 1 && (
                        <div className="w-full h-0.5 bg-border mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Claims in Pipeline */}
            <div className="grid gap-4">
              {mockClaims.map((claim) => (
                <Card key={claim.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{claim.id}</h3>
                        <p className="text-sm text-muted-foreground">{claim.fleetOwner}</p>
                      </div>
                      <Badge variant={getStatusColor(claim.status) as any}>
                        {getStatusLabel(claim.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Policy Number</p>
                        <p className="font-medium">{claim.policyNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Loss Type</p>
                        <p className="font-medium">{claim.lossType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Assigned Adjuster</p>
                        <p className="font-medium">{claim.assignedAdjuster}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Estimated Payout</p>
                        <p className="font-medium">${claim.payoutEstimate.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{claim.progress}%</span>
                      </div>
                      <Progress value={claim.progress} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Currently at: {agentPipeline.find(a => a.id === claim.currentAgent)?.name}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Claims Overview */}
        {activeTab === "claims" && (
          <Card>
            <CardHeader>
              <CardTitle>Claims Summary</CardTitle>
              <CardDescription>All claims with status and processing information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Claim ID</th>
                      <th className="text-left p-2">Fleet Owner</th>
                      <th className="text-left p-2">Vehicles</th>
                      <th className="text-left p-2">Loss Type</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Adjuster</th>
                      <th className="text-left p-2">Estimate</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockClaims.map((claim) => (
                      <tr key={claim.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{claim.id}</td>
                        <td className="p-2">{claim.fleetOwner}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            {claim.vehiclesInvolved.map((vehicle) => (
                              <Badge key={vehicle} variant="outline" className="text-xs">
                                {vehicle}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-2">{claim.lossType}</td>
                        <td className="p-2">
                          <Badge variant={getStatusColor(claim.status) as any}>
                            {getStatusLabel(claim.status)}
                          </Badge>
                        </td>
                        <td className="p-2">{claim.assignedAdjuster}</td>
                        <td className="p-2">${claim.payoutEstimate.toLocaleString()}</td>
                        <td className="p-2">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fleet Management */}
        {activeTab === "fleet" && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Fleet Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Vehicles</span>
                    <span className="font-bold">245</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Claims</span>
                    <span className="font-bold text-warning">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Claims This Month</span>
                    <span className="font-bold">28</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>High-Risk Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["TRK-001", "VAN-045", "TRL-008"].map((vehicle) => (
                    <div key={vehicle} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span className="font-medium">{vehicle}</span>
                      <Badge variant="destructive">High Risk</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p>• TRK-001: Claim submitted</p>
                  <p>• VAN-045: Damage assessment complete</p>
                  <p>• TRL-008: Settlement approved</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Adjuster Allocation */}
        {activeTab === "adjusters" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Adjuster Workload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Sarah Johnson", workload: 85, location: "Chicago, IL", expertise: "Collision" },
                    { name: "Mike Chen", workload: 62, location: "Denver, CO", expertise: "Cargo" },
                    { name: "Lisa Park", workload: 94, location: "Phoenix, AZ", expertise: "Liability" },
                  ].map((adjuster) => (
                    <div key={adjuster.name} className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{adjuster.name}</p>
                          <p className="text-xs text-muted-foreground">{adjuster.location} • {adjuster.expertise}</p>
                        </div>
                        <span className="text-sm">{adjuster.workload}%</span>
                      </div>
                      <Progress value={adjuster.workload} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assignment Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="font-medium text-sm">CL-2024-001237</p>
                    <p className="text-xs text-muted-foreground">
                      Recommended: Mike Chen (Location match, 62% workload)
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="font-medium text-sm">CL-2024-001238</p>
                    <p className="text-xs text-muted-foreground">
                      Recommended: Sarah Johnson (Expertise match, available capacity)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}