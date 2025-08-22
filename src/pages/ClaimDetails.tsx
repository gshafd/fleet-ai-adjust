import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useClaims } from "@/context/ClaimsContext";
import { ArrowLeft, FileText, Shield, AlertTriangle, CheckCircle, Calculator, Mail, Eye, Clock, Zap, Car } from "lucide-react";
import { useEffect, useState } from "react";

const getAgentOutput = (agentId: string, claim: any) => {
  switch (agentId) {
    case "fnol-intake":
      return `EXTRACTED CLAIM INFORMATION:
✓ Policy Number: ${claim.policyNumber}
✓ Fleet Owner: ${claim.fleetOwner}
✓ Claimant Name: ${claim.name}
✓ Contact Phone: ${claim.phone}
✓ Contact Email: ${claim.email}
✓ Incident Date: ${claim.incidentDate}
✓ Incident Time: ${claim.incidentTime}
✓ Location: ${claim.location}
✓ Loss Type: ${claim.lossType}
✓ Vehicles Involved: ${claim.vehiclesInvolved.join(', ')}
✓ Description: ${claim.description}
✓ Files Processed: ${claim.files.length} documents analyzed`;

    case "validation":
      return `VALIDATION RESULTS:
✓ Policy verified as active
✓ Fleet registration confirmed for ${claim.fleetOwner}
✓ Driver license validated
✓ Vehicle VIN verification passed
✓ Coverage period validated
✓ Claim is valid for processing`;

    case "fraud-detection":
      return `FRAUD ANALYSIS COMPLETE:
✓ No duplicate claims found in system
✓ Incident location verified via GPS data
✓ Timeline analysis passed - consistent story
✓ No prior suspicious activity detected
✓ Fraud risk score: 15/100 (Low Risk)
✓ No flags detected - proceeding with claim`;

    case "claim-creation":
      return `CLAIM CREATED SUCCESSFULLY:
✓ Claim Number: ${claim.id}
✓ Created in system: ${claim.submittedAt.toLocaleDateString()}
✓ Assigned Adjuster: ${claim.assignedAdjuster}
✓ Priority Level: Standard
✓ SLA Target: 5 business days
✓ Workflow initiated`;

    case "coverage-verification":
      return `COVERAGE VERIFICATION:
✓ Policy Type: Commercial Fleet Insurance
✓ Coverage Active: Yes
✓ ${claim.lossType} coverage confirmed
✓ Deductible Amount: $2,500
✓ Policy limits verified
✓ Coverage applicable for this incident
✓ No exclusions apply`;

    case "damage-assessment":
      return `DAMAGE ASSESSMENT COMPLETE:
✓ Vehicle damage assessed from uploaded photos
✓ Repair estimate calculated: $18,000
✓ Total loss threshold: $25,000 (Not exceeded)
✓ Repairable damage confirmed
✓ Labor costs: $8,000
✓ Parts costs: $10,000
✓ Assessment confidence: 95%`;

    case "settlement-payout":
      return `SETTLEMENT CALCULATION:
✓ Gross settlement amount: $18,000
✓ Less deductible: -$2,500
✓ Net payout amount: $${claim.payoutEstimate.toLocaleString()}
✓ Payment method: Direct deposit
✓ Processing fee: $0
✓ Settlement approved for payment`;

    case "communication":
      return `COMMUNICATION DRAFTED:
✓ Settlement notification email prepared
✓ Payment instructions included
✓ Claim summary attached
✓ Next steps outlined for claimant
✓ Adjuster copy prepared
✓ Ready for claims representative review
✓ Estimated delivery: Within 24 hours`;

    default:
      return "Processing...";
  }
};

const agentPipeline = [
  { 
    id: "fnol-intake", 
    name: "FNOL Intake Agent", 
    icon: FileText, 
    color: "blue",
    description: "Captures loss details, claimant details, policy details from forms, images, PDFs"
  },
  { 
    id: "validation", 
    name: "Validation Agent", 
    icon: Shield, 
    color: "indigo",
    description: "Cross-checks policies, fleets, drivers and validates claim validity"
  },
  { 
    id: "fraud-detection", 
    name: "Fraud Detection Agent", 
    icon: AlertTriangle, 
    color: "orange",
    description: "Detects suspicious claims, staged accidents, and duplicate claims"
  },
  { 
    id: "claim-creation", 
    name: "Claim Creation Agent", 
    icon: Zap, 
    color: "purple",
    description: "Creates claim in system, generates claim number and assigns adjuster"
  },
  { 
    id: "coverage-verification", 
    name: "Coverage Verification Agent", 
    icon: CheckCircle, 
    color: "green",
    description: "Verifies coverage by cross-checking policy information"
  },
  { 
    id: "damage-assessment", 
    name: "Damage Assessment Agent", 
    icon: Car, 
    color: "emerald",
    description: "Assesses damage based on evidence and estimates repair costs"
  },
  { 
    id: "settlement-payout", 
    name: "Settlement Payout Agent", 
    icon: Calculator, 
    color: "cyan",
    description: "Estimates payout with deductibles and liability applied"
  },
  { 
    id: "communication", 
    name: "Communication Agent", 
    icon: Mail, 
    color: "rose",
    description: "Drafts professional payout email for claims representative"
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
                                    {getAgentOutput(agent.id, claim)}
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

        {/* Uploaded Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Uploaded Documents
            </CardTitle>
            <CardDescription>
              Files submitted with the claim and processed by AI agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Police Report</p>
                    <p className="text-sm text-muted-foreground">accident-report.pdf • 2.4 MB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Vehicle Photos</p>
                    <p className="text-sm text-muted-foreground">damage-photos.zip • 8.7 MB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Driver License</p>
                    <p className="text-sm text-muted-foreground">license-scan.jpg • 1.2 MB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  ✓ All {claim.files.length} documents have been processed and analyzed by AI agents
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}