import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/layout/Header";
import { WizardSteps } from "@/components/ui/wizard-steps";
import { FileUpload } from "@/components/ui/file-upload";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useClaims } from "@/context/ClaimsContext";
import { ArrowLeft, ArrowRight, MapPin, Calendar, User, FileText, Upload, CheckCircle, Sparkles, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: "method", title: "Choose Method", description: "How to submit" },
  { id: "details", title: "Claimant Details", description: "Basic information" },
  { id: "incident", title: "Incident Details", description: "What happened" },
  { id: "evidence", title: "Upload Evidence", description: "Supporting documents" },
  { id: "review", title: "Review & Submit", description: "Final confirmation" },
];

export default function ReportClaim() {
  const [currentStep, setCurrentStep] = useState("method");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [submissionMethod, setSubmissionMethod] = useState<"form" | "documents" | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [submittedClaimId, setSubmittedClaimId] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    policyNumber: "",
    incidentDate: "",
    incidentTime: "",
    location: "",
    description: "",
    files: [] as File[],
  });
  const { toast } = useToast();
  const { addClaim } = useClaims();
  const navigate = useNavigate();

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex < steps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      
      setCurrentStep(steps[stepIndex + 1].id);
    }
  };

  const prevStep = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id);
    }
  };

  const submitClaim = () => {
    setIsSubmitting(true);
    
    // Create new claim with initial processing status
    const claimId = addClaim({
      ...formData,
      fleetOwner: formData.name || "Unknown Fleet",
      vehiclesInvolved: ["AUTO-001"], // Default for now
      lossType: "Auto Collision", // Default for now  
      status: "submitted",
      assignedAdjuster: "AI Agent",
      payoutEstimate: 0,
      currentAgent: "document-review",
      progress: 5,
      adjusterDetails: {
        name: "AI Agent",
        email: "ai.agent@autosure.com",
        phone: "(555) 000-0000",
        location: "Virtual Processing Center",
        expertise: "Automated Claims Processing",
        assignedAt: new Date(),
      },
      agentOutputs: {},
      editedData: {},
    });

    setSubmittedClaimId(claimId);
    
    // Show submission dialog first
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSubmissionDialog(true);
    }, 1500);
  };

  const startAIPipeline = () => {
    setShowSubmissionDialog(false);
    
    // Navigate to claim details to show AI pipeline processing
    navigate(`/claim/${submittedClaimId}`);
    
    // Start AI pipeline processing in the background
    setTimeout(() => {
      // This will be handled by the ClaimDetails page
    }, 500);
  };

  const goToDashboard = () => {
    setShowSubmissionDialog(false);
    navigate('/dashboard');
  };

  const handleDocumentUpload = (files: File[]) => {
    if (files.length === 0) return;
    
    updateFormData("files", files);
    
    toast({
      title: "Documents Uploaded!",
      description: `${files.length} document(s) uploaded successfully. Ready to submit.`,
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "method":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Choose Submission Method</CardTitle>
              <CardDescription>
                How would you like to submit your claim information?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer border-2 transition-colors ${submissionMethod === "form" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  onClick={() => setSubmissionMethod("form")}
                >
                  <CardContent className="p-6 text-center">
                    <User className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Fill Out Form</h3>
                    <p className="text-sm text-muted-foreground">
                      Step-by-step guided form to enter claim details manually
                    </p>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer border-2 transition-colors ${submissionMethod === "documents" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  onClick={() => setSubmissionMethod("documents")}
                >
                  <CardContent className="p-6 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Upload Documents</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload documents and let AI extract all claim details automatically
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {submissionMethod === "documents" && (
                <div className="mt-6">
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Upload Your Claim Documents</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our AI will automatically extract all necessary information from your documents.
                    </p>
                  </div>
                  
                  <FileUpload
                    title="Upload All Claim Documents"
                    description="Upload police reports, photos, insurance cards, driver's licenses, etc."
                    onFilesChange={handleDocumentUpload}
                    maxFiles={15}
                  />
                  
                  {formData.files.length > 0 && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">{formData.files.length} Document(s) Uploaded</p>
                          <p className="text-sm text-green-700">Ready to submit for AI processing</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Recommended Documents for AI Extraction:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Police Report (PDF)</li>
                  <li>• Insurance ID Cards</li>
                  <li>• Driver's License</li>
                  <li>• Photos of damage and accident scene</li>
                  <li>• Vehicle registration</li>
                  <li>• Any correspondence or emails about the incident</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );
      case "details":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Claimant Details
              </CardTitle>
              <CardDescription>
                Please provide your contact information and policy details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <Input
                    id="policyNumber"
                    value={formData.policyNumber}
                    onChange={(e) => updateFormData("policyNumber", e.target.value)}
                    placeholder="POL-123456789"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "incident":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Incident Details
              </CardTitle>
              <CardDescription>
                Tell us what happened and when it occurred.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="incidentDate">Date of Incident</Label>
                  <Input
                    id="incidentDate"
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => updateFormData("incidentDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="incidentTime">Time of Incident</Label>
                  <Input
                    id="incidentTime"
                    type="time"
                    value={formData.incidentTime}
                    onChange={(e) => updateFormData("incidentTime", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location of Incident
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateFormData("location", e.target.value)}
                  placeholder="123 Main Street, Springfield, IL 62701"
                />
              </div>
              <div>
                <Label htmlFor="description">Description of Incident</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  placeholder="Please describe what happened in detail..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        );

      case "evidence":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Upload Evidence
              </CardTitle>
              <CardDescription>
                Upload supporting documents, photos, and reports to support your claim.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                title="Upload Supporting Documents"
                description="Drag and drop files here, or click to select (PDF, Images, Excel, CSV)"
                onFilesChange={(files) => updateFormData("files", files)}
                maxFiles={10}
              />
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Helpful Documents to Include:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Police Report (PDF)</li>
                  <li>• Photos of damage and accident scene</li>
                  <li>• Repair estimates or invoices</li>
                  <li>• Driver's license and insurance information</li>
                  <li>• Medical reports (if applicable)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case "review":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Claim</CardTitle>
              <CardDescription>
                Please review the information below before submitting your claim.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">CLAIMANT INFORMATION</h4>
                  <div className="mt-2">
                    <p className="font-medium">{formData.name}</p>
                    <p className="text-sm text-muted-foreground">{formData.email}</p>
                    <p className="text-sm text-muted-foreground">{formData.phone}</p>
                    <p className="text-sm text-muted-foreground">Policy: {formData.policyNumber}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">INCIDENT DETAILS</h4>
                  <div className="mt-2">
                    <p className="text-sm"><strong>Date:</strong> {formData.incidentDate}</p>
                    <p className="text-sm"><strong>Time:</strong> {formData.incidentTime}</p>
                    <p className="text-sm"><strong>Location:</strong> {formData.location}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">DESCRIPTION</h4>
                <p className="text-sm mt-2">{formData.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">UPLOADED DOCUMENTS</h4>
                <p className="text-sm mt-2">{formData.files.length} file(s) uploaded</p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Report a Claim</h1>
            <p className="text-muted-foreground">
              Follow these simple steps to submit your claim to our AI processing system.
            </p>
          </div>

          <WizardSteps
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />

          <div className="max-w-4xl mx-auto">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === "method"}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* For document submission method, show submit button after upload */}
            {submissionMethod === "documents" && currentStep === "method" && formData.files.length > 0 ? (
              <Button
                onClick={submitClaim}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Submit Documents
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={currentStep === "review" ? submitClaim : nextStep}
                disabled={
                  !submissionMethod ||
                  (currentStep === "review" && isSubmitting) ||
                  (submissionMethod === "documents" && formData.files.length === 0 && currentStep === "method")
                }
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : currentStep === "review" ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Submit Claim
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Submission Success Dialog */}
      <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Documents Submitted Successfully!
            </DialogTitle>
            <DialogDescription className="space-y-4">
              <div>
                Your documents have been uploaded and your reference ID is:
              </div>
              <div className="p-3 bg-primary/10 rounded-lg text-center">
                <span className="font-mono font-bold text-lg text-primary">
                  {submittedClaimId}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Our AI agents are now taking over to process your claim automatically.</span>
              </div>
            </DialogDescription>
          </DialogHeader>
           <div className="flex flex-col gap-3">
             <Button onClick={startAIPipeline} className="flex items-center gap-2">
               <Sparkles className="w-4 h-4" />
               Watch AI Agents Process Your Claim
             </Button>
             <Button variant="outline" onClick={goToDashboard} className="flex items-center gap-2">
               <Eye className="w-4 h-4" />
               View Claims Dashboard
             </Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}