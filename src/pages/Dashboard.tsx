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
    if (agentCount >= 8) return 'completed';
    if (agentCount >= 3) return 'processing';
    return claim.status || 'submitted';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "processing": return "status-processing";
      case "submitted": return "secondary";
      case "fraud-review": return "warning";
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
                      <th className="text-left p-3 font-medium">Fleet Owner</th>
                      <th className="text-left p-3 font-medium">Adjuster</th>
                      <th className="text-left p-3 font-medium">Created</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Progress</th>
                      <th className="text-left p-3 font-medium">Damage</th>
                      <th className="text-left p-3 font-medium">Payout</th>
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
                            <div>
                              <p className="font-medium">{claim.fleetOwner}</p>
                              <p className="text-xs text-muted-foreground">{claim.lossType}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{claim.adjusterDetails?.name || claim.assignedAdjuster}</p>
                              <p className="text-xs text-muted-foreground">{claim.adjusterDetails?.location || 'Remote'}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{claim.submittedAt.toLocaleDateString()}</p>
                              <p className="text-xs text-muted-foreground">{claim.submittedAt.toLocaleTimeString()}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant={getStatusColor(getCurrentStatus(claim)) as any}>
                              {getStatusLabel(getCurrentStatus(claim))}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="w-20">
                              <div className="flex justify-between text-xs mb-1">
                                <span>{claim.progress}%</span>
                              </div>
                              <Progress value={claim.progress} className="h-1" />
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-medium">
                              {extractDamageAmount(claim) > 0 ? `$${extractDamageAmount(claim).toLocaleString()}` : '-'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-medium text-green-600">
                              {extractPayoutAmount(claim) > 0 ? `$${extractPayoutAmount(claim).toLocaleString()}` : '-'}
                            </span>
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