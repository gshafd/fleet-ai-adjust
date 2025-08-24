import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useClaims } from "@/context/ClaimsContext";
import { ArrowLeft, FileText, Shield, AlertTriangle, CheckCircle, Calculator, Mail, Eye, Clock, Zap, Car } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Save, X } from "lucide-react";

// Helper function to analyze file content and extract realistic damage information
const analyzeFileContent = (files: File[]) => {
  const fileNames = files.map(f => f.name.toLowerCase());
  const photoFiles = files.filter(f => /\.(jpg|jpeg|png|gif|bmp)$/i.test(f.name));
  const pdfFiles = files.filter(f => /\.(pdf)$/i.test(f.name));
  
  let damageAmount = 15000; // base amount
  let confidence = 70;
  let damageDetails: string[] = [];
  let cargoValue = 0;
  let isTotal = false;
  
  // Analyze photo files for damage assessment
  photoFiles.forEach(file => {
    const fileName = file.name.toLowerCase();
    if (fileName.includes('front') || fileName.includes('hood') || fileName.includes('bumper')) {
      damageAmount += 8000;
      damageDetails.push('Front-end collision damage: $8,000');
    }
    if (fileName.includes('side') || fileName.includes('door') || fileName.includes('quarter')) {
      damageAmount += 6000;
      damageDetails.push('Side panel damage: $6,000');
    }
    if (fileName.includes('rear') || fileName.includes('back')) {
      damageAmount += 4000;
      damageDetails.push('Rear damage: $4,000');
    }
    if (fileName.includes('interior') || fileName.includes('cabin') || fileName.includes('inside')) {
      damageAmount += 3000;
      damageDetails.push('Interior damage: $3,000');
    }
    if (fileName.includes('total') || fileName.includes('complete') || fileName.includes('destroyed')) {
      damageAmount += 25000;
      isTotal = true;
      damageDetails.push('Total loss indicators detected: +$25,000');
    }
    if (fileName.includes('engine') || fileName.includes('motor')) {
      damageAmount += 12000;
      damageDetails.push('Engine damage: $12,000');
    }
    confidence += 5; // More photos = higher confidence
  });
  
  // Analyze document files
  fileNames.forEach(fileName => {
    if (fileName.includes('police') || fileName.includes('report')) {
      confidence += 10;
      if (fileName.includes('theft')) {
        cargoValue = 65000 + Math.floor(Math.random() * 25000);
        damageAmount = cargoValue;
        damageDetails.push(`Cargo theft confirmed: $${cargoValue.toLocaleString()}`);
      }
    }
    if (fileName.includes('estimate') || fileName.includes('quote') || fileName.includes('appraisal')) {
      confidence += 15;
      // Extract estimated amount from filename patterns
      const match = fileName.match(/(\d+)k?/);
      if (match) {
        const amount = parseInt(match[1]) * (fileName.includes('k') ? 1000 : 1);
        if (amount > 5000 && amount < 100000) {
          damageAmount = amount;
          damageDetails.push(`Professional estimate found: $${amount.toLocaleString()}`);
        }
      }
    }
    if (fileName.includes('manifest') || fileName.includes('cargo') || fileName.includes('shipping')) {
      cargoValue = 85000 + Math.floor(Math.random() * 35000);
      damageAmount = cargoValue;
      damageDetails.push(`Cargo manifest analyzed: $${cargoValue.toLocaleString()}`);
    }
    if (fileName.includes('receipt') || fileName.includes('invoice')) {
      damageAmount += 2000;
      damageDetails.push('Supporting documentation: +$2,000');
    }
  });
  
  // Ensure realistic bounds and minimum confidence
  confidence = Math.min(95, Math.max(75, confidence));
  damageAmount = Math.max(8000, Math.min(120000, damageAmount));
  
  return {
    totalDamage: damageAmount,
    confidence,
    damageDetails,
    cargoValue,
    isTotal,
    hasPhotos: photoFiles.length > 0,
    hasDocuments: pdfFiles.length > 0,
    fileCount: files.length,
    photoCount: photoFiles.length
  };
};

const getAgentOutput = (agentId: string, claim: any, editedData?: any) => {
  // Use edited data if available
  const data = editedData || claim;
  
  // Analyze uploaded files to customize outputs
  const hasFiles = claim.files && claim.files.length > 0;
  const fileNames = hasFiles ? claim.files.map((f: File) => f.name) : [];
  const hasPoliceReport = fileNames.some((name: string) => name.toLowerCase().includes('police') || name.toLowerCase().includes('report'));
  const hasPhotos = fileNames.some((name: string) => name.toLowerCase().includes('photo') || name.toLowerCase().includes('image') || /\.(jpg|jpeg|png|bmp)$/i.test(name));
  const hasLicense = fileNames.some((name: string) => name.toLowerCase().includes('license') || name.toLowerCase().includes('dl'));
  const hasInsurance = fileNames.some((name: string) => name.toLowerCase().includes('insurance') || name.toLowerCase().includes('policy'));
  
  // Analyze files for realistic damage assessment
  const fileAnalysis = hasFiles ? analyzeFileContent(claim.files) : {
    totalDamage: 15000,
    confidence: 75,
    damageDetails: ['Standard assessment based on description only'],
    cargoValue: 0,
    isTotal: false,
    hasPhotos: false,
    hasDocuments: false,
    fileCount: 0,
    photoCount: 0
  };
  
  // Generate dynamic data based on claim specifics
  const generateDynamicData = () => {
    const locations = [
      'Interstate 95, Mile Marker 127, Baltimore, MD',
      'Highway 101, Exit 42, San Francisco, CA',
      'I-75 North, Detroit, MI',
      'Route 66, Flagstaff, AZ',
      'Broadway & 5th Street, New York, NY'
    ];
    
    const weatherConditions = ['Clear, dry roads', 'Light rain, wet pavement', 'Foggy conditions', 'Snow, icy roads', 'Heavy rain, poor visibility'];
    const damageTypes = ['Front-end collision damage', 'Side impact damage', 'Rear-end damage', 'Multiple impact points', 'Rollover damage'];
    const vehicleTypes = ['2020 Ford Transit Van', '2019 Chevrolet Silverado', '2021 Ram ProMaster', '2018 Mercedes Sprinter', '2022 Ford F-150'];
    
    // Use claim ID as seed for consistent "randomization"
    const seed = claim.id ? parseInt(claim.id.slice(-3)) : 123;
    
    return {
      location: claim.location || locations[seed % locations.length],
      weather: weatherConditions[seed % weatherConditions.length],
      damageType: damageTypes[seed % damageTypes.length],
      vehicleType: vehicleTypes[seed % vehicleTypes.length],
      reportNumber: `PR-2024-${String(seed).padStart(6, '0')}`,
      officerBadge: `#${4000 + (seed % 999)} - Officer ${['Martinez', 'Johnson', 'Williams', 'Brown', 'Davis'][seed % 5]}`,
      licenseNumber: `DL${seed}${String(seed * 123).slice(-6)}`,
      vin: `1HGBH41JXMN${String(seed * 1000).slice(-6)}`,
      licensePlate: `${['FL', 'CA', 'TX', 'NY', 'MI'][seed % 5]}-${String(seed).toUpperCase()}${String(seed * 2).slice(-2)}`,
    };
  };
  
  const dynamicData = generateDynamicData();
  
  switch (agentId) {
    case "fnol-intake":
      let output = `EXTRACTED CLAIM INFORMATION FROM UPLOADED DOCUMENTS:\n\n`;
      
      if (hasFiles) {
        output += `📁 ANALYZED FILES (${claim.files.length} documents):\n`;
        fileNames.forEach((name: string, index: number) => {
          output += `${index + 1}. ${name}\n`;
        });
        output += `\n`;
      }
      
      if (hasPoliceReport || !hasFiles) {
        output += `📄 POLICE REPORT ANALYSIS:\n`;
        output += `✓ Incident Date: ${claim.incidentDate || '2024-01-15'} at ${claim.incidentTime || '14:30'}\n`;
        output += `✓ Location: ${dynamicData.location}\n`;
        output += `✓ Weather Conditions: ${dynamicData.weather}\n`;
        output += `✓ Officer Badge: ${dynamicData.officerBadge}\n`;
        output += `✓ Report Number: ${dynamicData.reportNumber}\n\n`;
      }
      
      if (hasLicense || !hasFiles) {
        output += `📄 DRIVER LICENSE SCAN:\n`;
        output += `✓ License Number: ${dynamicData.licenseNumber}\n`;
        output += `✓ Expiry Date: 12/2026 (Valid)\n`;
        output += `✓ CDL Status: Commercial Driver License Active\n`;
        output += `✓ Restrictions: None\n`;
        output += `✓ Previous Violations: Clean record\n\n`;
      }
      
      if (hasPhotos || !hasFiles) {
        output += `📄 VEHICLE PHOTOS ANALYSIS:\n`;
        output += `✓ Damage Location: ${dynamicData.damageType}\n`;
        output += `✓ Damage Severity: ${hasPhotos ? 'Analyzed from uploaded photos' : 'Moderate impact damage'}\n`;
        output += `✓ VIN Extracted: ${dynamicData.vin}\n`;
        output += `✓ License Plate: ${dynamicData.licensePlate}\n`;
        output += `✓ Vehicle Make/Model: ${dynamicData.vehicleType}\n\n`;
      }
      
      output += `STRUCTURED DATA EXTRACTED:\n`;
      output += `✓ Policy Number: ${data.policyNumber || claim.policyNumber || 'POL-789456'}\n`;
      output += `✓ Fleet Owner: ${data.fleetOwner || claim.fleetOwner || 'ABC Logistics Inc.'}\n`;
      output += `✓ Driver Name: ${data.driverName || claim.name || 'John Smith'}\n`;
      output += `✓ Contact Phone: ${data.phone || claim.phone || '(555) 123-4567'}\n`;
      output += `✓ Contact Email: ${data.email || claim.email || 'john@abclogistics.com'}\n`;
      output += `✓ Loss Type: ${data.lossType || claim.lossType || 'Auto Collision'}\n`;
      output += `✓ Vehicles Involved: ${data.vehiclesInvolved || (claim.vehiclesInvolved?.length > 0 ? claim.vehiclesInvolved.join(', ') : 'AUTO-001')}\n`;
      output += `✓ Incident Description: ${data.description || claim.description || 'Rear-end collision during heavy traffic causing front-end damage to vehicle'}`;
      
      if (hasFiles) {
        output += `\n\n✅ DOCUMENT ANALYSIS: Successfully processed ${claim.files.length} uploaded documents with ${hasPhotos ? 'computer vision' : 'OCR'} technology`;
      }
      
      return output;

    case "validation":
      const validationOutput = `VALIDATION RESULTS:

${hasFiles ? `📁 VALIDATION SOURCE: Analyzing ${claim.files.length} uploaded documents\n` : ''}POLICY VALIDATION:
✓ Policy ${data.policyNumber || claim.policyNumber || 'POL-789456'} verified as ACTIVE
✓ Premium payments up to date
✓ Fleet registration confirmed for ${data.fleetOwner || claim.fleetOwner || 'ABC Logistics Inc.'}
✓ Coverage effective from: 01/01/2024 to 12/31/2024

DRIVER VALIDATION:
✓ Driver license ${dynamicData.licenseNumber} validated with DMV
✓ Commercial driving privileges: ACTIVE
✓ No license suspensions found
✓ Driver authorized on policy roster

VEHICLE VALIDATION:
✓ VIN ${dynamicData.vin} matches policy records
✓ Vehicle registration current and valid
✓ Safety inspection up to date
✓ Vehicle covered under commercial fleet policy

${hasInsurance ? '✅ INSURANCE DOCUMENTS: Policy documents cross-referenced and validated\n' : ''}FINAL VALIDATION: ✅ CLAIM IS VALID FOR PROCESSING`;
      return validationOutput;

    case "fraud-detection":
      const fraudAnalysis = `FRAUD ANALYSIS COMPLETE:

${hasFiles ? `📊 ANALYSIS SCOPE: ${claim.files.length} documents processed for fraud indicators\n` : ''}DUPLICATE CLAIM ANALYSIS:
✓ No duplicate claims found for this incident
✓ No similar claims from same driver in past 12 months
✓ Location cross-reference: No pattern of claims at ${dynamicData.location}

INCIDENT VERIFICATION:
✓ GPS data confirms vehicle was at reported location
✓ Timeline analysis: Story is consistent and logical
✓ Weather data matches conditions: ${dynamicData.weather}
${hasPhotos ? '✓ Photo metadata analysis: Consistent timestamps and GPS coordinates\n' : ''}✓ Traffic camera footage request submitted

BEHAVIORAL ANALYSIS:
✓ Driver's claim history: ${Math.floor((parseInt(claim.id?.slice(-3) || '123') % 5) + 1)} claims in 5 years (${(parseInt(claim.id?.slice(-3) || '123') % 5) < 2 ? 'Low' : 'Normal'})
✓ No suspicious activity patterns detected
✓ Claim amount reasonable for damage type: ${dynamicData.damageType}
✓ Reporting time: ${Math.floor((parseInt(claim.id?.slice(-3) || '123') % 6) + 1)} hours after incident (Normal)

FRAUD RISK ASSESSMENT:
✓ Overall Risk Score: ${Math.floor((parseInt(claim.id?.slice(-3) || '123') % 25) + 10)}/100 (LOW RISK)
✓ No red flags identified
✓ Recommended Action: PROCEED WITH STANDARD PROCESSING`;
      return fraudAnalysis;

    case "claim-creation":
      const creationOutput = `CLAIM CREATED SUCCESSFULLY:

CLAIM DETAILS:
✓ Claim Number: ${claim.id}
✓ Created Date: ${claim.submittedAt.toLocaleDateString()}
✓ Claim Type: Commercial Vehicle ${claim.lossType === 'Cargo Theft' ? 'Cargo Theft' : 'Collision'}
✓ Priority Level: ${hasFiles && claim.files.length > 5 ? 'High Priority' : 'Standard Processing'}

ADJUSTER ASSIGNMENT:
✓ Assigned Adjuster: ${claim.assignedAdjuster}
✓ Adjuster Experience: ${Math.floor((parseInt(claim.id?.slice(-3) || '123') % 8) + 5)} years commercial claims
✓ Current Workload: ${Math.floor((parseInt(claim.id?.slice(-3) || '123') % 15) + 15)} active claims
✓ Specialization: ${claim.lossType === 'Cargo Theft' ? 'Cargo and theft claims' : 'Fleet vehicle damages'}
✓ Contact: ${claim.assignedAdjuster?.toLowerCase().replace(' ', '.')}@insurance.com

SERVICE LEVEL AGREEMENT:
✓ Initial Contact: Within ${hasFiles && hasPhotos ? '12' : '24'} hours
✓ Inspection Scheduled: Within ${hasFiles && hasPhotos ? '48' : '72'} hours  
✓ Settlement Target: ${claim.lossType === 'Cargo Theft' ? '7-10' : '5-7'} business days
✓ Workflow Status: INITIATED AND ACTIVE`;
      return creationOutput;

    case "coverage-verification":
      const coverageOutput = `COVERAGE VERIFICATION:

POLICY ANALYSIS:
✓ Policy Type: Commercial Fleet Insurance - ${hasInsurance ? 'Premium Plan (verified from uploaded policy)' : 'Premium Plan'}
✓ Policy Holder: ${claim.fleetOwner}
✓ Coverage Period: ACTIVE (Jan 1, 2024 - Dec 31, 2024)
✓ Annual Premium: $${(parseInt(claim.id?.slice(-3) || '123') % 30 + 20) * 1000} (Paid in full)

COVERAGE VERIFICATION REASONING:
✓ ${claim.lossType === 'Cargo Theft' ? 'Cargo Coverage' : 'Collision Coverage'}: $${(parseInt(claim.id?.slice(-3) || '123') % 50 + 25) * 1000} limit - APPLIES to this claim
✓ Vehicle was being used for commercial purposes - COVERED
✓ Driver was authorized and properly licensed - COVERED
✓ Incident occurred during policy period - COVERED
✓ No policy exclusions apply to this type of loss

DEDUCTIBLE & LIMITS:
✓ ${claim.lossType === 'Cargo Theft' ? 'Cargo' : 'Collision'} Deductible: $${Math.floor((parseInt(claim.id?.slice(-3) || '123') % 3 + 1) * 1000)} per incident
✓ Remaining Policy Limit: $${(parseInt(claim.id?.slice(-3) || '123') % 45 + 30) * 1000} available
✓ Previous Claims This Year: ${Math.floor((parseInt(claim.id?.slice(-3) || '123') % 3))} ($${Math.floor((parseInt(claim.id?.slice(-3) || '123') % 10 + 1) * 1000)} paid)

COVERAGE DETERMINATION: ✅ INCIDENT IS FULLY COVERED
Reason: ${claim.lossType === 'Cargo Theft' ? 'Cargo theft during authorized commercial transport' : 'Standard collision during commercial use with authorized driver'}`;
      return coverageOutput;

    case "damage-assessment":
      const damageOutput = `DAMAGE ASSESSMENT ANALYSIS COMPLETE:

${fileAnalysis.hasPhotos ? `📸 VISUAL DAMAGE ANALYSIS: Analyzed ${fileAnalysis.photoCount} photos using AI computer vision\n` : ''}${fileAnalysis.hasDocuments ? `📄 DOCUMENT ANALYSIS: Professional estimates and reports reviewed\n` : ''}
DAMAGE BREAKDOWN FROM FILE ANALYSIS:
${fileAnalysis.damageDetails.map(detail => `✓ ${detail}`).join('\n')}

${claim.lossType === 'Cargo Theft' && fileAnalysis.cargoValue > 0 ? `CARGO LOSS ASSESSMENT:
✓ Cargo Value (from manifests): $${fileAnalysis.cargoValue.toLocaleString()}
✓ Recovery Probability: ${Math.floor(Math.random() * 30 + 15)}%
✓ Net Loss Estimate: $${Math.floor(fileAnalysis.cargoValue * 0.85).toLocaleString()}` : 
`REPAIR COST ANALYSIS:
✓ Labor Costs: $${Math.floor(fileAnalysis.totalDamage * 0.6).toLocaleString()} (${Math.floor(fileAnalysis.totalDamage * 0.6 / 95)} hours @ $95/hour)
✓ Parts Costs: $${Math.floor(fileAnalysis.totalDamage * 0.4).toLocaleString()}
✓ Total Repair Estimate: $${fileAnalysis.totalDamage.toLocaleString()}

TOTAL LOSS EVALUATION:
✓ Vehicle ACV: $${Math.floor(fileAnalysis.totalDamage * 2.2).toLocaleString()}
✓ Total Loss Threshold (80%): $${Math.floor(fileAnalysis.totalDamage * 1.76).toLocaleString()}
✓ Repair Cost: $${fileAnalysis.totalDamage.toLocaleString()}
✓ Decision: ${fileAnalysis.isTotal || fileAnalysis.totalDamage > 45000 ? 'TOTAL LOSS - Vehicle exceeds repair threshold' : 'REPAIRABLE - Cost below threshold'}`}

ASSESSMENT METHODOLOGY:
${fileAnalysis.hasPhotos ? 'Computer vision analysis of uploaded damage photos' : 'Standard industry assessment protocols'}
• Damage pattern recognition and severity scoring
• Real-time parts pricing from OEM suppliers
• Regional labor rate calculations ($95/hour average)
${fileAnalysis.hasDocuments ? '• Cross-validation with uploaded professional estimates' : ''}

FINAL ASSESSMENT:
✓ Total Damage Amount: $${fileAnalysis.totalDamage.toLocaleString()}
✓ Assessment Confidence: ${fileAnalysis.confidence}% (${fileAnalysis.confidence > 90 ? 'Very High' : fileAnalysis.confidence > 80 ? 'High' : 'Standard'})
✓ Basis: ${fileAnalysis.hasPhotos && fileAnalysis.hasDocuments ? 'Photos + Professional estimates' : fileAnalysis.hasPhotos ? 'Photo analysis' : fileAnalysis.hasDocuments ? 'Document review' : 'Standard assessment'}`;
      return damageOutput;

    case "settlement-payout":
      const deductible = 2500;
      const grossSettlement = claim.lossType === 'Cargo Theft' && fileAnalysis.cargoValue > 0 ? 
        Math.floor(fileAnalysis.cargoValue * 0.85) : 
        fileAnalysis.totalDamage;
      const netPayout = Math.max(0, grossSettlement - deductible);
      
      return `SETTLEMENT CALCULATION COMPLETE:

DAMAGE ASSESSMENT REFERENCE:
✓ Total Assessed Damage: $${fileAnalysis.totalDamage.toLocaleString()}
✓ Assessment Confidence: ${fileAnalysis.confidence}%
✓ Based on: ${fileAnalysis.fileCount} uploaded documents (${fileAnalysis.photoCount} photos)

PAYOUT CALCULATION:
${claim.lossType === 'Cargo Theft' && fileAnalysis.cargoValue > 0 ? 
`CARGO THEFT SETTLEMENT:
✓ Cargo Value (manifests): $${fileAnalysis.cargoValue.toLocaleString()}
✓ Recovery Deduction (15%): -$${Math.floor(fileAnalysis.cargoValue * 0.15).toLocaleString()}
✓ Gross Settlement: $${grossSettlement.toLocaleString()}` :
`VEHICLE REPAIR SETTLEMENT:
✓ Total Repair Costs: $${fileAnalysis.totalDamage.toLocaleString()}
✓ Supplemental Estimates: $0 (None required)
✓ Gross Settlement: $${grossSettlement.toLocaleString()}`}

DEDUCTIONS APPLIED:
✓ Policy Deductible: -$${deductible.toLocaleString()} (Per policy terms)
✓ Betterment/Depreciation: $0 (Not applicable)
✓ Previous Damage: $0 (None identified in photos)
${fileAnalysis.isTotal ? '✓ Salvage Value: -$0 (Retained by insured)' : ''}

FINAL SETTLEMENT AMOUNT:
✓ Net Payout: $${netPayout.toLocaleString()}
✓ Payment Method: ACH Direct Deposit
✓ Processing Fee: $0
✓ Tax Implications: Not applicable

SETTLEMENT JUSTIFICATION:
This settlement is calculated using AI-analyzed damage assessment from ${fileAnalysis.photoCount > 0 ? 'uploaded photos and ' : ''}professional documentation. The amount covers ${fileAnalysis.isTotal ? 'total loss compensation' : '100% of verified repair costs'} minus contractual deductible.

${fileAnalysis.confidence > 90 ? 'HIGH CONFIDENCE ASSESSMENT' : 'STANDARD ASSESSMENT'} - Settlement amount aligns with industry standards and policy terms.

PAYMENT AUTHORIZATION: ✅ APPROVED FOR IMMEDIATE PROCESSING
Expected Payment Date: ${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}`;

    case "communication":
      const settlementAmount = Math.max(0, (claim.lossType === 'Cargo Theft' && fileAnalysis.cargoValue > 0 ? 
        Math.floor(fileAnalysis.cargoValue * 0.85) : 
        fileAnalysis.totalDamage) - 2500);
      
      return data.emailContent && data.adjusterNotes ? 
        `${data.emailContent}

---

ADJUSTER SUMMARY & NOTES:

${data.adjusterNotes}` :
        `COMMUNICATION DRAFTED BASED ON ASSESSMENT:

EMAIL COMPOSITION:
Subject: Claim Settlement Approved - Payment Processing [Claim #${claim.id}]

Dear ${claim.name},

We are pleased to inform you that your insurance claim has been processed and approved for payment based on our comprehensive analysis of your ${fileAnalysis.fileCount} uploaded documents.

CLAIM SUMMARY:
• Claim Number: ${claim.id}
• Incident Date: ${claim.incidentDate}
• Assessment Basis: ${fileAnalysis.photoCount} photos + ${fileAnalysis.fileCount - fileAnalysis.photoCount} documents
• Final Settlement: $${settlementAmount.toLocaleString()}

PAYMENT DETAILS:
Your settlement payment of $${settlementAmount.toLocaleString()} will be processed within 2-3 business days via direct deposit. This amount reflects our AI-powered damage assessment with ${fileAnalysis.confidence}% confidence rating.

NEXT STEPS:
1. Payment confirmation will be sent via email
2. ${fileAnalysis.isTotal ? 'Vehicle title transfer documents will follow' : 'Retain all repair receipts for your records'}
3. Contact us for approved repair shop network if needed

Best regards,
Claims Department

---

ADJUSTER SUMMARY & NOTES:

CASE ANALYSIS:
• File Assessment: ${fileAnalysis.fileCount} documents analyzed with ${fileAnalysis.confidence}% confidence
• Damage Amount: $${fileAnalysis.totalDamage.toLocaleString()} (${fileAnalysis.isTotal ? 'Total Loss' : 'Repairable'})
• Settlement: $${settlementAmount.toLocaleString()} after $2,500 deductible

PROCESSING NOTES:
✓ ${fileAnalysis.hasPhotos ? 'Photo analysis completed - clear damage documentation' : 'Standard assessment - no photos available'}
✓ ${fileAnalysis.hasDocuments ? 'Professional estimates reviewed and validated' : 'No external estimates provided'}
✓ Settlement amount verified against policy limits and coverage
✓ No fraud indicators detected during assessment

RECOMMENDATIONS:
• ${fileAnalysis.confidence > 90 ? 'Excellent documentation - fast-track for payment' : 'Standard processing recommended'}
• Customer satisfaction survey scheduled post-settlement
• File ready for final review and payment authorization

FILE STATUS: Ready for immediate payment processing`;

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
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [agentEditedData, setAgentEditedData] = useState<Record<string, any>>({});
  
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

  const getAgentEditFields = (agentId: string) => {
    switch (agentId) {
      case "fnol-intake":
        return {
          incidentDate: claim?.incidentDate || '2024-01-15',
          incidentTime: claim?.incidentTime || '14:30',
          location: claim?.location || 'Interstate 95, Mile Marker 127, Baltimore, MD',
          reportNumber: 'PR-2024-089456',
          officerBadge: '#4721 - Officer Martinez',
          licenseNumber: 'DL789456123',
          licenseExpiry: '12/2026',
          vehicleVin: '1HGBH41JXMN109186',
          licensePlate: 'FL-ABC123',
          vehicleMakeModel: '2020 Ford Transit Van',
          policyNumber: claim?.policyNumber || 'POL-789456',
          fleetOwner: claim?.fleetOwner || 'ABC Logistics Inc.',
          driverName: claim?.name || 'John Smith',
          phone: claim?.phone || '(555) 123-4567',
          email: claim?.email || 'john@abclogistics.com',
          lossType: claim?.lossType || 'Auto Collision',
          vehiclesInvolved: claim?.vehiclesInvolved?.join(', ') || 'AUTO-001',
          description: claim?.description || 'Rear-end collision during heavy traffic causing front-end damage to vehicle'
        };
      case "validation":
        return {
          policyStatus: 'ACTIVE',
          premiumStatus: 'Up to date',
          coveragePeriod: '01/01/2024 to 12/31/2024',
          licenseStatus: 'ACTIVE',
          driverAuthorized: 'Yes',
          vehicleVin: '1HGBH41JXMN109186',
          registrationStatus: 'Current and valid',
          safetyInspection: 'Up to date'
        };
      case "fraud-detection":
        return {
          duplicateClaims: 'No duplicate claims found',
          similarClaims: 'No similar claims in past 12 months',
          locationPattern: 'No pattern at this location',
          gpsVerified: 'Vehicle confirmed at reported location',
          timelineConsistent: 'Story is consistent and logical',
          weatherData: 'Matches police report conditions',
          claimHistory: '2 claims in 5 years (Normal)',
          reportingTime: '2 hours after incident (Normal)',
          riskScore: '15/100 (LOW RISK)',
          recommendedAction: 'PROCEED WITH STANDARD PROCESSING'
        };
      case "claim-creation":
        return {
          claimNumber: claim?.id || '',
          createdDate: claim?.submittedAt.toLocaleDateString() || '',
          claimType: 'Commercial Vehicle Collision',
          priorityLevel: 'Standard Processing',
          assignedAdjuster: claim?.assignedAdjuster || 'Sarah Johnson',
          adjusterExperience: '8 years commercial claims',
          currentWorkload: '23 active claims',
          specialization: 'Fleet vehicle damages',
          adjusterContact: 'sarah.johnson@insurance.com'
        };
      case "coverage-verification":
        return {
          policyType: 'Commercial Fleet Insurance - Premium Plan',
          policyHolder: claim?.fleetOwner || 'ABC Logistics Inc.',
          coveragePeriod: 'ACTIVE (Jan 1, 2024 - Dec 31, 2024)',
          annualPremium: '$24,500',
          collisionCoverage: '$50,000 limit',
          deductible: '$2,500 per incident',
          remainingLimit: '$47,500 available',
          previousClaims: '1 ($3,200 paid)',
          coverageDecision: 'INCIDENT IS FULLY COVERED'
        };
      case "damage-assessment":
        return {
          frontBumper: 'Cracked - $1,200',
          hood: 'Dented - $2,400',
          leftHeadlight: 'Damaged - $450',
          grille: 'Broken - $380',
          frontLeftFender: 'Minor dents - $800',
          laborCosts: '$8,000 (84 hours @ $95/hour)',
          partsCosts: '$10,000',
          totalRepairCost: '$18,000',
          vehicleValue: '$32,000',
          totalLossThreshold: '$25,000',
          repairStatus: 'REPAIRABLE',
          confidenceLevel: '95%'
        };
      case "settlement-payout":
        return {
          totalRepairCosts: '$18,000',
          supplementalEstimates: '$0',
          grossAmount: '$18,000',
          policyDeductible: '$2,500',
          betterment: '$0',
          previousDamage: '$0',
          netPayoutAmount: '$15,500',
          paymentMethod: 'ACH Direct Deposit',
          taxImplications: 'Not applicable',
          processingFee: '$0'
        };
      case "communication":
        return {
          emailContent: `EMAIL COMPOSITION:
Subject: Claim Settlement Approved - Payment Processing [Claim #${claim?.id}]

Dear ${claim?.name || 'John Smith'},

We are pleased to inform you that your insurance claim has been processed and approved for payment.

CLAIM SUMMARY:
• Claim Number: ${claim?.id || ''}
• Incident Date: ${claim?.incidentDate || '2024-01-15'}
• Vehicle: ${claim?.vehiclesInvolved?.[0] || 'AUTO-001'}
• Settlement Amount: $15,500

PAYMENT DETAILS:
Your settlement check will be processed within 2-3 business days via direct deposit to your registered account. Please ensure your banking information is current.

NEXT STEPS:
1. You will receive payment confirmation via email
2. Retain all repair receipts for your records  
3. Contact us if you need assistance with repair shop recommendations

Best regards,
Claims Department`,
          adjusterNotes: `CASE SUMMARY FOR FILE:
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

FILE STATUS: Ready for final review and payment authorization`
        };
      default:
        return {};
    }
  };

  const handleEditAgent = (agentId: string) => {
    setEditingAgent(agentId);
    setEditData(getAgentEditFields(agentId));
  };

  const handleSaveAgent = () => {
    if (!claim || !editingAgent) return;
    
    // Store edited data for this agent
    setAgentEditedData(prev => ({
      ...prev,
      [editingAgent]: { ...editData }
    }));
    
    // Update core claim data if FNOL agent is being edited
    if (editingAgent === 'fnol-intake') {
      const updatedClaim = {
        ...claim,
        policyNumber: editData.policyNumber || claim.policyNumber,
        fleetOwner: editData.fleetOwner || claim.fleetOwner,
        name: editData.driverName || claim.name,
        phone: editData.phone || claim.phone,
        email: editData.email || claim.email,
        incidentDate: editData.incidentDate || claim.incidentDate,
        incidentTime: editData.incidentTime || claim.incidentTime,
        location: editData.location || claim.location,
        lossType: editData.lossType || claim.lossType,
        description: editData.description || claim.description,
        vehiclesInvolved: editData.vehiclesInvolved ? 
          editData.vehiclesInvolved.split(',').map((v: string) => v.trim()).filter(Boolean) : 
          claim.vehiclesInvolved
      };
      updateClaim(claim.id, updatedClaim);
    }
    
    setEditingAgent(null);
    setEditData({});
    
    toast({
      title: "Information Updated",
      description: `${agentPipeline.find(a => a.id === editingAgent)?.name} output has been successfully updated.`
    });
  };

  const handleCancelEdit = () => {
    setEditingAgent(null);
    setEditData({});
  };

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

  const renderEditableAgentOutput = (agentId: string, claim: any) => {
    if (editingAgent === agentId) {
      // Special handling for communication agent
      if (agentId === 'communication') {
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email Content</label>
              <Textarea 
                value={editData.emailContent || ''}
                onChange={(e) => setEditData({...editData, emailContent: e.target.value})}
                className="mt-1 font-mono text-sm"
                rows={15}
                placeholder="Enter email content..."
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Adjuster Notes</label>
              <Textarea 
                value={editData.adjusterNotes || ''}
                onChange={(e) => setEditData({...editData, adjusterNotes: e.target.value})}
                className="mt-1 font-mono text-sm"
                rows={12}
                placeholder="Enter adjuster notes..."
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveAgent}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        );
      }
      
      // Regular form for other agents
      const fields = getAgentEditFields(agentId);
      const fieldNames = Object.keys(fields);
      
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldNames.map((fieldName) => {
              const fieldValue = fields[fieldName];
              const isTextArea = fieldName.includes('description') || fieldName.includes('notes') || fieldName.includes('reasoning');
              
              return (
                <div key={fieldName} className={isTextArea ? "md:col-span-2" : ""}>
                  <label className="text-xs font-medium text-muted-foreground">
                    {fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  {isTextArea ? (
                    <Textarea 
                      value={editData[fieldName] || ''}
                      onChange={(e) => setEditData({...editData, [fieldName]: e.target.value})}
                      className="mt-1"
                      rows={3}
                    />
                  ) : fieldName.includes('Date') && !fieldName.includes('Time') ? (
                    <Input 
                      type="date"
                      value={editData[fieldName] || ''}
                      onChange={(e) => setEditData({...editData, [fieldName]: e.target.value})}
                      className="mt-1"
                    />
                  ) : fieldName.includes('Time') ? (
                    <Input 
                      type="time"
                      value={editData[fieldName] || ''}
                      onChange={(e) => setEditData({...editData, [fieldName]: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <Input 
                      value={editData[fieldName] || ''}
                      onChange={(e) => setEditData({...editData, [fieldName]: e.target.value})}
                      className="mt-1"
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveAgent}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      );
    } else {
      // Render static output with edit button
      const hasEdits = agentEditedData[agentId];
      return (
        <div>
          {hasEdits && (
            <div className="mb-2 flex items-center gap-2 text-xs text-blue-600">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                Edited
              </Badge>
              <span>This output has been modified</span>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {getAgentOutput(agentId, claim, agentEditedData[agentId])}
            </pre>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleEditAgent(agentId)}
            className="text-xs"
          >
            <Pencil className="w-3 h-3 mr-2" />
            Edit Information
          </Button>
        </div>
      );
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
                        <div className="mt-2">
                          {renderEditableAgentOutput(agent.id, claim)}
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