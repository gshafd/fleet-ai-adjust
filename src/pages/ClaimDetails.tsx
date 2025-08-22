import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useClaims } from "@/context/ClaimsContext";
import { ArrowLeft, FileText, Shield, AlertTriangle, CheckCircle, Calculator, Mail, Eye, Clock, Zap, Car } from "lucide-react";
import { useEffect, useState } from "react";

const agentPipeline = [
  { 
    id: "fnol-intake", 
    name: "FNOL Intake Agent", 
    icon: FileText, 
    color: "blue",
    description: "Captures loss details, claimant details, policy details from forms, images, PDFs",
    output: "✓ Extracted incident date: 2024-01-15\n✓ Captured claimant: John Smith\n✓ Policy number: POL-789456\n✓ Loss type: Collision identified"
  },
  { 
    id: "validation", 
    name: "Validation Agent", 
    icon: Shield, 
    color: "indigo",
    description: "Cross-checks policies, fleets, drivers and validates claim validity",
    output: "✓ Policy verified as active\n✓ Driver license validated\n✓ Fleet registration confirmed\n✓ Claim is valid for processing"
  },
  { 
    id: "fraud-detection", 
    name: "Fraud Detection Agent", 
    icon: AlertTriangle, 
    color: "orange",
    description: "Detects suspicious claims, staged accidents, and duplicate claims",
    output: "✓ No duplicate claims found\n✓ Incident location verified\n✓ Timeline analysis passed\n✓ Low fraud risk score: 15/100"
  },
  { 
    id: "claim-creation", 
    name: "Claim Creation Agent", 
    icon: Zap, 
    color: "purple",
    description: "Creates claim in system, generates claim number and assigns adjuster",
    output: "✓ Claim created: CL-2024-757070\n✓ Assigned adjuster: Sarah Johnson\n✓ Priority level: Standard\n✓ SLA: 5 business days"
  },
  { 
    id: "coverage-verification", 
    name: "Coverage Verification Agent", 
    icon: CheckCircle, 
    color: "green",
    description: "Verifies coverage by cross-checking policy information",
    output: "✓ Collision coverage confirmed\n✓ Deductible: $2,500\n✓ Policy limits verified\n✓ Coverage applicable for this incident"
  },
  { 
    id: "damage-assessment", 
    name: "Damage Assessment Agent", 
    icon: Car, 
    color: "emerald",
    description: "Assesses damage based on evidence and estimates repair costs",
    output: "✓ Vehicle damage assessed\n✓ Repair estimate: $18,000\n✓ Total loss threshold: Not exceeded\n✓ Repairable damage confirmed"
  },
  { 
    id: "settlement-payout", 
    name: "Settlement Payout Agent", 
    icon: Calculator, 
    color: "cyan",
    description: "Estimates payout with deductibles and liability applied",
    output: "✓ Gross settlement: $18,000\n✓ Less deductible: $2,500\n✓ Net payout: $15,500\n✓ Payment approved"
  },
  { 
    id: "communication", 
    name: "Communication Agent", 
    icon: Mail, 
    color: "rose",
    description: "Drafts professional payout email for claims representative",
    output: "✓ Settlement letter drafted\n✓ Payment instructions included\n✓ Next steps outlined\n✓ Ready for review and sending"
  },
];

export default function ClaimDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClaim, updateClaim } = useClaims();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const claim = getClaim(id!);
  
  useEffect(() => {
    if (claim && (claim.status === "submitted" || claim.status === "processing")) {
      setIsProcessing(true);
      startAIProcessing();
    }
  }, [claim?.id]);

  const startAIProcessing = () => {
    if (!claim || claim.status === "approved") return;
    
    let currentAgentIndex = agentPipeline.findIndex(agent => agent.id === claim.currentAgent);
    if (currentAgentIndex === -1) currentAgentIndex = 0;
    
    const processNextAgent = () => {
      if (currentAgentIndex >= agentPipeline.length) {
        // Processing complete
        updateClaim(claim.id, {
          status: "approved",
          currentAgent: "completed",
          progress: 100,
          payoutEstimate: 15500
        });
        setIsProcessing(false);
        return;
      }

      const currentAgent = agentPipeline[currentAgentIndex];
      const progress = ((currentAgentIndex + 1) / agentPipeline.length) * 100;
      
      updateClaim(claim.id, {
        status: "processing",
        currentAgent: currentAgent.id,
        progress: Math.round(progress)
      });

      // Simulate processing time for each agent
      setTimeout(() => {
        currentAgentIndex++;
        processNextAgent();
      }, 3000 + Math.random() * 2000); // 3-5 seconds per agent
    };

    processNextAgent();
  };

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
      case "approved": return "success";
      case "processing": return "default";
      case "submitted": return "secondary";
      case "fraud-review": return "warning";
      case "error": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved": return "Approved";
      case "processing": return "Processing";
      case "submitted": return "Submitted";
      case "fraud-review": return "Fraud Review";
      case "error": return "Error";
      default: return "Pending";
    }
  };

  const currentAgentIndex = agentPipeline.findIndex(agent => agent.id === claim.currentAgent);
  const completedAgents = currentAgentIndex >= 0 ? currentAgentIndex : -1;

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
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              AI Agent Pipeline {isProcessing && <span className="text-sm font-normal">(Processing...)</span>}
            </CardTitle>
            <CardDescription>
              Our AI agents are processing your claim automatically
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(claim.progress)}%</span>
              </div>
              <Progress value={claim.progress} className="w-full" />
              
              {/* Agent Pipeline Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                {agentPipeline.map((agent, index) => {
                  const isCompleted = completedAgents >= index;
                  const isCurrent = claim.currentAgent === agent.id;
                  const isPending = completedAgents < index;
                  
                  return (
                    <div
                      key={agent.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCurrent 
                          ? "border-primary bg-primary/10 animate-pulse" 
                          : isCompleted 
                          ? "border-green-500 bg-green-50" 
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                          isCurrent 
                            ? "bg-primary text-primary-foreground" 
                            : isCompleted 
                            ? "bg-green-500 text-white" 
                            : "bg-gray-300 text-gray-600"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : isCurrent ? (
                            <Clock className="w-6 h-6 animate-spin" />
                          ) : (
                            <agent.icon className="w-6 h-6" />
                          )}
                        </div>
                        <h4 className={`font-medium text-sm mb-2 ${
                          isCurrent ? "text-primary" : isCompleted ? "text-green-700" : "text-gray-600"
                        }`}>
                          {agent.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {agent.description}
                        </p>
                        {isCurrent && (
                          <div className="mt-2">
                            <Badge variant="default" className="text-xs">
                              Processing...
                            </Badge>
                          </div>
                        )}
                        {isCompleted && !isCurrent && (
                          <div className="mt-2">
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Completed
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Agent Outputs */}
              {completedAgents >= 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold">Agent Processing Results</h3>
                  {agentPipeline.slice(0, completedAgents + 1).map((agent, index) => {
                    const isCompleted = completedAgents > index;
                    const isCurrent = claim.currentAgent === agent.id;
                    
                    if (!isCompleted && !isCurrent) return null;
                    
                    return (
                      <Card key={agent.id} className={`${isCurrent ? 'border-primary' : 'border-green-200'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${
                              isCurrent 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-green-500 text-white"
                            }`}>
                              {isCurrent ? (
                                <Clock className="w-5 h-5 animate-spin" />
                              ) : (
                                <CheckCircle className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{agent.name}</h4>
                                {isCurrent && (
                                  <Badge variant="default" className="text-xs">
                                    Processing...
                                  </Badge>
                                )}
                                {isCompleted && (
                                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                    Completed
                                  </Badge>
                                )}
                              </div>
                              {(isCompleted || (isCurrent && Math.random() > 0.5)) && (
                                <div className="bg-gray-50 rounded-lg p-3 mt-2">
                                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                                    {agent.output}
                                  </pre>
                                </div>
                              )}
                              {isCurrent && Math.random() <= 0.5 && (
                                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                  <Clock className="w-4 h-4 animate-spin" />
                                  Processing documents and analyzing data...
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
               )}
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