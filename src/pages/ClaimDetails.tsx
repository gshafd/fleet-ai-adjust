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
      return `EXTRACTED CLAIM INFORMATION FROM UPLOADED DOCUMENTS:

📄 POLICE REPORT ANALYSIS:
✓ Incident Date: ${claim.incidentDate} at ${claim.incidentTime}
✓ Location: ${claim.location}
✓ Weather Conditions: Clear, dry roads
✓ Officer Badge: #4721 - Officer Martinez
✓ Report Number: PR-2024-089456

📄 DRIVER LICENSE SCAN:
✓ License Number: DL789456123
✓ Expiry Date: 12/2026 (Valid)
✓ CDL Status: Commercial Driver License Active
✓ Restrictions: None
✓ Previous Violations: Clean record

📄 VEHICLE PHOTOS ANALYSIS:
✓ Damage Location: Front bumper, hood, left headlight
✓ Damage Severity: Moderate impact damage
✓ VIN Extracted: 1HGBH41JXMN109186
✓ License Plate: FL-ABC123
✓ Vehicle Make/Model: 2020 Ford Transit Van

STRUCTURED DATA EXTRACTED:
✓ Policy Number: ${claim.policyNumber}
✓ Fleet Owner: ${claim.fleetOwner}
✓ Driver Name: ${claim.name}
✓ Contact Phone: ${claim.phone}
✓ Contact Email: ${claim.email}
✓ Loss Type: ${claim.lossType}
✓ Vehicles Involved: ${claim.vehiclesInvolved.join(', ')}
✓ Incident Description: ${claim.description}`;

    case "validation":
      return `VALIDATION RESULTS:

POLICY VALIDATION:
✓ Policy ${claim.policyNumber} verified as ACTIVE
✓ Premium payments up to date
✓ Fleet registration confirmed for ${claim.fleetOwner}
✓ Coverage effective from: 01/01/2024 to 12/31/2024

DRIVER VALIDATION:
✓ Driver license DL789456123 validated with DMV
✓ Commercial driving privileges: ACTIVE
✓ No license suspensions found
✓ Driver authorized on policy roster

VEHICLE VALIDATION:
✓ VIN 1HGBH41JXMN109186 matches policy records
✓ Vehicle registration current and valid
✓ Safety inspection up to date
✓ Vehicle covered under commercial fleet policy

FINAL VALIDATION: ✅ CLAIM IS VALID FOR PROCESSING`;

    case "fraud-detection":
      return `FRAUD ANALYSIS COMPLETE:

DUPLICATE CLAIM ANALYSIS:
✓ No duplicate claims found for this incident
✓ No similar claims from same driver in past 12 months
✓ Location cross-reference: No pattern of claims at this location

INCIDENT VERIFICATION:
✓ GPS data confirms vehicle was at reported location
✓ Timeline analysis: Story is consistent and logical
✓ Weather data matches police report conditions
✓ Traffic camera footage request submitted

BEHAVIORAL ANALYSIS:
✓ Driver's claim history: 2 claims in 5 years (Normal)
✓ No suspicious activity patterns detected
✓ Claim amount reasonable for damage type
✓ Reporting time: 2 hours after incident (Normal)

FRAUD RISK ASSESSMENT:
✓ Overall Risk Score: 15/100 (LOW RISK)
✓ No red flags identified
✓ Recommended Action: PROCEED WITH STANDARD PROCESSING`;

    case "claim-creation":
      return `CLAIM CREATED SUCCESSFULLY:

CLAIM DETAILS:
✓ Claim Number: ${claim.id}
✓ Created Date: ${claim.submittedAt.toLocaleDateString()}
✓ Claim Type: Commercial Vehicle Collision
✓ Priority Level: Standard Processing

ADJUSTER ASSIGNMENT:
✓ Assigned Adjuster: ${claim.assignedAdjuster}
✓ Adjuster Experience: 8 years commercial claims
✓ Current Workload: 23 active claims
✓ Specialization: Fleet vehicle damages
✓ Contact: sarah.johnson@insurance.com

SERVICE LEVEL AGREEMENT:
✓ Initial Contact: Within 24 hours
✓ Inspection Scheduled: Within 72 hours
✓ Settlement Target: 5-7 business days
✓ Workflow Status: INITIATED AND ACTIVE`;

    case "coverage-verification":
      return `COVERAGE VERIFICATION:

POLICY ANALYSIS:
✓ Policy Type: Commercial Fleet Insurance - Premium Plan
✓ Policy Holder: ${claim.fleetOwner}
✓ Coverage Period: ACTIVE (Jan 1, 2024 - Dec 31, 2024)
✓ Annual Premium: $24,500 (Paid in full)

COVERAGE VERIFICATION REASONING:
✓ Collision Coverage: $50,000 limit - APPLIES to this claim
✓ Vehicle was being used for commercial purposes - COVERED
✓ Driver was authorized and properly licensed - COVERED
✓ Incident occurred during policy period - COVERED
✓ No policy exclusions apply to this type of loss

DEDUCTIBLE & LIMITS:
✓ Collision Deductible: $2,500 per incident
✓ Remaining Policy Limit: $47,500 available
✓ Previous Claims This Year: 1 ($3,200 paid)

COVERAGE DETERMINATION: ✅ INCIDENT IS FULLY COVERED
Reason: Standard collision during commercial use with authorized driver`;

    case "damage-assessment":
      return `DAMAGE ASSESSMENT COMPLETE:

PHOTO ANALYSIS RESULTS:
✓ Front bumper: Cracked and needs replacement - $1,200
✓ Hood: Dented and requires body work - $2,400
✓ Left headlight assembly: Damaged, needs replacement - $450
✓ Grille: Broken, replacement needed - $380
✓ Front left fender: Minor dents, paintwork needed - $800

ASSESSMENT METHODOLOGY:
The AI analyzed 12 high-resolution photos using computer vision:
• Damage severity scoring based on visual indicators
• Parts identification using vehicle database matching
• Cost estimation using regional labor rates ($95/hour)
• Parts pricing from OEM and aftermarket suppliers

REPAIR ESTIMATE BREAKDOWN:
✓ Labor Costs: $8,000 (84 hours @ $95/hour)
  - Body work: 45 hours
  - Paint preparation: 24 hours
  - Assembly/alignment: 15 hours
✓ Parts Costs: $10,000
  - OEM parts: $8,500
  - Paint materials: $1,500
✓ Total Repair Cost: $18,000

TOTAL LOSS ASSESSMENT:
✓ Vehicle Value (ACV): $32,000
✓ Total Loss Threshold: $25,000 (80% of ACV)
✓ Repair Cost: $18,000
✓ Status: REPAIRABLE (Cost below threshold)
✓ Assessment Confidence: 95% (High accuracy)`;

    case "settlement-payout":
      return `SETTLEMENT CALCULATION:

PAYOUT CALCULATION REASONING:
The settlement amount is calculated based on verified damage assessment, policy terms, and applicable deductibles:

GROSS SETTLEMENT:
✓ Total Repair Costs: $18,000
✓ Supplemental Estimates: $0 (None required)
✓ Gross Amount Before Deductions: $18,000

DEDUCTIONS APPLIED:
✓ Policy Deductible: -$2,500 (Per policy terms)
✓ Betterment/Depreciation: $0 (Not applicable)
✓ Previous Damage: $0 (None identified)

FINAL SETTLEMENT:
✓ Net Payout Amount: $15,500
✓ Payment Method: ACH Direct Deposit
✓ Tax Implications: Not applicable (vehicle repair)
✓ Processing Fee: $0

SETTLEMENT JUSTIFICATION:
This payout covers 100% of verified repair costs minus the contractual deductible. The amount is fair and within policy limits, ensuring the insured can restore their vehicle to pre-loss condition.

PAYMENT AUTHORIZATION: ✅ APPROVED FOR IMMEDIATE PROCESSING`;

    case "communication":
      return `COMMUNICATION DRAFTED:

EMAIL COMPOSITION:
Subject: Claim Settlement Approved - Payment Processing [Claim #${claim.id}]

Dear ${claim.name},

We are pleased to inform you that your insurance claim has been processed and approved for payment.

CLAIM SUMMARY:
• Claim Number: ${claim.id}
• Incident Date: ${claim.incidentDate}
• Vehicle: ${claim.vehiclesInvolved[0]}
• Settlement Amount: $15,500

PAYMENT DETAILS:
Your settlement check will be processed within 2-3 business days via direct deposit to your registered account. Please ensure your banking information is current.

NEXT STEPS:
1. You will receive payment confirmation via email
2. Retain all repair receipts for your records  
3. Contact us if you need assistance with repair shop recommendations

Best regards,
Claims Department

---

ADJUSTER SUMMARY & NOTES:

CASE SUMMARY FOR FILE:
• Straightforward collision claim with clear liability
• All documentation complete and verified
• No complications or disputes identified
• Standard processing timeline maintained

ADJUSTER ACTION ITEMS:
✓ Review and approve final settlement letter
✓ Verify banking details before payment release
✓ Schedule follow-up call in 30 days
✓ Update claim status to "Settlement Paid"
✓ Archive all documentation in claim file

RECOMMENDATIONS:
• Consider this claimant for preferred status (clean history)
• No fraud indicators - standard file closure
• Customer satisfaction survey recommended post-settlement

FILE STATUS: Ready for final review and payment authorization`;

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

  const handleViewDocument = (docName: string) => {
    // Create a mock document viewer - simulates opening the actual file
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${docName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
              .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-bottom: 20px; }
              .content { line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>${docName}</h1>
                <p style="color: #666;">Document Viewer - Claim ${claim.id}</p>
              </div>
              <div class="content">
                <p><strong>Document Type:</strong> ${docName.includes('report') ? 'Police Report' : docName.includes('photo') || docName.includes('damage') ? 'Vehicle Damage Photos' : docName.includes('license') ? 'Driver License' : 'Insurance Document'}</p>
                <p><strong>Upload Date:</strong> ${claim.submittedAt.toLocaleDateString()}</p>
                <p><strong>File Size:</strong> ${docName.includes('zip') ? '8.7 MB' : docName.includes('pdf') ? '2.4 MB' : '1.2 MB'}</p>
                <p><strong>Status:</strong> ✅ Processed by AI</p>
                <hr style="margin: 20px 0;">
                <p style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff;">
                  <strong>Note:</strong> This is a simulated document viewer. In a real application, this would display the actual document content, allow annotations, and provide download options.
                </p>
              </div>
            </div>
          </body>
        </html>
      `);
    }
  };

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
                  const isApproved = claim.status === "approved";
                  const isCompleted = isApproved || completedAgents >= index;
                  const isCurrent = !isApproved && claim.currentAgent === agent.id;
                  
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
                          {isCompleted && !isCurrent ? (
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
            </div>
          </CardContent>
        </Card>

        {/* Compact Uploaded Documents */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4" />
              Documents ({claim.files.length > 0 ? claim.files.length : 3})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-wrap gap-2">
              {claim.files.length > 0 ? (
                claim.files.map((file, index) => (
                  <div key={index} className="flex items-center gap-1 px-2 py-1 text-xs rounded border bg-muted/30">
                    <FileText className="w-3 h-3 text-primary" />
                    <span className="font-medium">{file.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleViewDocument(file.name)}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-1 px-2 py-1 text-xs rounded border bg-muted/30">
                    <FileText className="w-3 h-3 text-primary" />
                    <span className="font-medium">accident_report_PR089456.pdf</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleViewDocument("accident_report_PR089456.pdf")}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 text-xs rounded border bg-muted/30">
                    <FileText className="w-3 h-3 text-primary" />
                    <span className="font-medium">vehicle_damage_photos.zip</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleViewDocument("vehicle_damage_photos.zip")}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 text-xs rounded border bg-muted/30">
                    <FileText className="w-3 h-3 text-primary" />
                    <span className="font-medium">driver_license_scan.jpg</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleViewDocument("driver_license_scan.jpg")}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ✓ All documents processed and analyzed by AI agents
            </p>
          </CardContent>
        </Card>

        {/* Agent Processing Results - Always Visible */}
        {(completedAgents >= 0 || claim.status === "approved") && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold">AI Agent Processing Results</h2>
            </div>
            {agentPipeline.slice(0, claim.status === "approved" ? agentPipeline.length : completedAgents + 1).map((agent, index) => {
              const isCompleted = claim.status === "approved" || completedAgents > index;
              const isCurrent = claim.currentAgent === agent.id && claim.status !== "approved";
              
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
                          {isCompleted && !isCurrent && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Completed
                            </Badge>
                          )}
                        </div>
                        {/* Always show output once agent has been processed */}
                        <div className="bg-gray-50 rounded-lg p-3 mt-2">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                            {getAgentOutput(agent.id, claim)}
                          </pre>
                        </div>
                        {isCurrent && !isCompleted && (
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
    </div>
  );
}