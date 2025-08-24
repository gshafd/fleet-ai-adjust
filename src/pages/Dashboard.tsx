import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useClaims } from "@/context/ClaimsContext";
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("claims");
  const navigate = useNavigate();
  const { claims } = useClaims();

  // Helper function to extract real payout amount from agent outputs
  const extractPayoutAmount = (claim: any) => {
    if (claim.agentOutputs?.['settlement-payout']) {
      const output = claim.agentOutputs['settlement-payout'];
      // Extract net payout amount from the agent output
      const payoutMatch = output.match(/Net Payout[:\s]*\$([0-9,]+)/i);
      if (payoutMatch) {
        return parseInt(payoutMatch[1].replace(/,/g, ''));
      }
    }
    return claim.payoutEstimate || 0;
  };

  // Helper function to extract damage amount from agent outputs
  const extractDamageAmount = (claim: any) => {
    if (claim.agentOutputs?.['damage-assessment']) {
      const output = claim.agentOutputs['damage-assessment'];
      // Extract total damage amount from the agent output
      const damageMatch = output.match(/Total Damage Amount[:\s]*\$([0-9,]+)/i) ||
                         output.match(/Total Repair[:\s]*\$([0-9,]+)/i) ||
                         output.match(/Cargo Value[:\s]*\$([0-9,]+)/i);
      if (damageMatch) {
        return parseInt(damageMatch[1].replace(/,/g, ''));
      }
    }
    return 0;
  };

  // Helper function to get current processing status from agent outputs
  const getCurrentStatus = (claim: any) => {
    const agentCount = claim.agentOutputs ? Object.keys(claim.agentOutputs).length : 0;
    if (claim.status === "approved" || claim.progress === 100 || agentCount >= 8) return 'completed';
    if (claim.status === "fraud-review") return 'fraud-review';
    if (claim.status === "error") return 'error';
    if (agentCount >= 3 || claim.progress > 50) return 'processing';
    return 'submitted';
  };

  // Helper function to get fleet owner from claim data or agent outputs
  const getFleetOwner = (claim: any) => {
    // Try to get from agent outputs first (more accurate)
    if (claim.agentOutputs?.['fnol-intake']) {
      const output = claim.agentOutputs['fnol-intake'];
      const fleetMatch = output.match(/Fleet Owner[:\s]*([^\n]+)/i);
      if (fleetMatch) {
        return fleetMatch[1].trim();
      }
    }
    return claim.fleetOwner || 'Processing...';
  };

  // Helper function to get incident description from claim or agent outputs
  const getIncidentDescription = (claim: any) => {
    if (claim.agentOutputs?.['fnol-intake']) {
      const output = claim.agentOutputs['fnol-intake'];
      const descMatch = output.match(/Incident Description[:\s]*([^\n]+)/i);
      if (descMatch) {
        return descMatch[1].trim();
      }
    }
    return claim.description || claim.lossType || 'Processing incident details...';
  };

  // Helper function to get adjuster from claim data
  const getAdjusterInfo = (claim: any) => {
    const adjuster = claim.adjusterDetails || {};
    return {
      name: adjuster.name || claim.assignedAdjuster || 'Assigning...',
      location: adjuster.location || 'Remote'
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "processing": return "secondary";
      case "submitted": return "outline";
      case "fraud-review": return "destructive";
      case "error": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "processing": return "Processing";
      case "submitted": return "Submitted";
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
            <p className="text-muted-foreground">Autonomous AI-powered claims processing • {claims.length} total claims</p>
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

        {/* Claims Overview */}
        {activeTab === "claims" && (
          <Card>
            <CardHeader>
              <CardTitle>Claims Management</CardTitle>
              <CardDescription>Complete overview of all claims with processing status and details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/20">
                      <th className="text-left p-3 font-medium">Claim ID</th>
                      <th className="text-left p-3 font-medium">Policy #</th>
                      <th className="text-left p-3 font-medium">Fleet Owner</th>
                      <th className="text-left p-3 font-medium">Driver</th>
                      <th className="text-left p-3 font-medium">Vehicle ID</th>
                      <th className="text-left p-3 font-medium">Accident Date</th>
                      <th className="text-left p-3 font-medium">Claim Type</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Fraud Risk</th>
                      <th className="text-left p-3 font-medium">Estimated Amount</th>
                      <th className="text-left p-3 font-medium">Approved Amount</th>
                      <th className="text-left p-3 font-medium">Adjuster</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...claims].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()).map((claim) => {
                      const isNewClaim = Date.now() - claim.submittedAt.getTime() < 24 * 60 * 60 * 1000;
                      return (
                        <tr key={claim.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{claim.id}</span>
                              {isNewClaim && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  NEW
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-medium">{claim.policyNumber}</span>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{getFleetOwner(claim)}</p>
                              <p className="text-xs text-muted-foreground">{claim.location}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-medium">{claim.driverName}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-medium">{claim.vehiclesInvolved.join(', ')}</span>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{new Date(claim.incidentDate).toLocaleDateString()}</p>
                              <p className="text-xs text-muted-foreground">Reported: {claim.submittedAt.toLocaleDateString()}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-medium">{claim.lossType}</span>
                          </td>
                          <td className="p-3">
                            <Badge variant={getStatusColor(getCurrentStatus(claim)) as any}>
                              {getStatusLabel(getCurrentStatus(claim))}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant={
                              claim.fraudRiskScore === 'High' ? 'destructive' : 
                              claim.fraudRiskScore === 'Medium' ? 'secondary' : 
                              'default'
                            }>
                              {claim.fraudRiskScore}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <span className="font-medium">
                              {extractDamageAmount(claim) > 0 ? `$${extractDamageAmount(claim).toLocaleString()}` : 
                               claim.payoutEstimate > 0 ? `$${claim.payoutEstimate.toLocaleString()}` : '-'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-medium text-green-600">
                              {extractPayoutAmount(claim) > 0 ? `$${extractPayoutAmount(claim).toLocaleString()}` : '-'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{getAdjusterInfo(claim).name}</p>
                              <p className="text-xs text-muted-foreground">{getAdjusterInfo(claim).location}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigate(`/claim/${claim.id}`)}
                                className="h-8 px-2"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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