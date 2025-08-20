import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useClaims } from "@/context/ClaimsContext";
import { ArrowLeft, FileText, Shield, AlertTriangle, CheckCircle, Calculator, Mail, Eye, Clock } from "lucide-react";

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

export default function ClaimDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClaim } = useClaims();
  
  const claim = getClaim(id!);

  if (!claim) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Claim Not Found</h1>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

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

  const currentAgentIndex = agentPipeline.findIndex(agent => agent.id === claim.currentAgent);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{claim.id}</h1>
              <p className="text-muted-foreground">{claim.fleetOwner}</p>
            </div>
            <Badge variant={getStatusColor(claim.status) as any} className="text-sm px-3 py-1">
              {getStatusLabel(claim.status)}
            </Badge>
          </div>
        </div>

        {/* Agent Pipeline Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Processing Pipeline</CardTitle>
            <CardDescription>Current progress through AI agent workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              {agentPipeline.map((agent, index) => (
                <div key={agent.id} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-colors ${
                      index <= currentAgentIndex 
                        ? `bg-${agent.color}/20 border-${agent.color}` 
                        : 'bg-muted border-muted-foreground/20'
                    }`}
                  >
                    <agent.icon className={`w-6 h-6 ${
                      index <= currentAgentIndex 
                        ? `text-${agent.color}` 
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                  <p className="text-xs font-medium text-center">{agent.name}</p>
                  {index === currentAgentIndex && (
                    <div className="mt-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      Current
                    </div>
                  )}
                  {index < agentPipeline.length - 1 && (
                    <div className={`w-full h-0.5 mt-4 ${
                      index < currentAgentIndex ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Progress</span>
                <span>{claim.progress}%</span>
              </div>
              <Progress value={claim.progress} className="h-3" />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Currently processing: {agentPipeline[currentAgentIndex]?.name || 'Unknown'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Claim Details */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Claim Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Policy Number</p>
                    <p className="font-medium">{claim.policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loss Type</p>
                    <p className="font-medium">{claim.lossType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned Adjuster</p>
                    <p className="font-medium">{claim.assignedAdjuster}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Payout</p>
                    <p className="font-medium">${claim.payoutEstimate.toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Vehicles Involved</p>
                  <div className="flex gap-2 mt-1">
                    {claim.vehiclesInvolved.map((vehicle) => (
                      <Badge key={vehicle} variant="outline">{vehicle}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incident Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{claim.incidentDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{claim.incidentTime}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{claim.location}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{claim.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{claim.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{claim.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{claim.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">{claim.submittedAt.toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {claim.files.length} file(s) uploaded and processed by AI
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}