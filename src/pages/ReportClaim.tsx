import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/layout/Header";
import { WizardSteps } from "@/components/ui/wizard-steps";
import { FileUpload } from "@/components/ui/file-upload";
import { ArrowLeft, ArrowRight, MapPin, Calendar, User, FileText, Upload, CheckCircle } from "lucide-react";
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

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex < steps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      
      // If user chose document upload method, skip to review after method selection
      if (currentStep === "method" && submissionMethod === "documents" && formData.files.length > 0) {
        setCurrentStep("review");
      } else {
        setCurrentStep(steps[stepIndex + 1].id);
      }
    }
  };

  const prevStep = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id);
    }
  };

  const submitClaim = () => {
    toast({
      title: "Claim Submitted Successfully!",
      description: "Your claim has been submitted to our AI agents. Claim ID: CL-2024-001234",
    });
    // Here you would typically send the data to your backend
    console.log("Submitting claim:", formData);
  };

  const handleDocumentExtraction = (files: File[]) => {
    if (files.length === 0) return;
    
    setIsExtracting(true);
    updateFormData("files", files);
    
    // Simulate AI extraction
    setTimeout(() => {
      // Mock extracted data from documents
      updateFormData("name", "John Smith");
      updateFormData("phone", "(555) 987-6543");
      updateFormData("email", "john.smith@company.com");
      updateFormData("policyNumber", "POL-789456123");
      updateFormData("incidentDate", "2024-01-15");
      updateFormData("incidentTime", "14:30");
      updateFormData("location", "Interstate 95, Mile Marker 127, Baltimore, MD");
      updateFormData("description", "Rear-end collision occurred during heavy traffic. Commercial vehicle struck from behind by passenger car while stopped at traffic signal.");
      
      setIsExtracting(false);
      setCompletedSteps(["method", "details", "incident", "evidence"]);
      setCurrentStep("review");
      
      toast({
        title: "Documents Processed!",
        description: "AI has successfully extracted claim details from your documents.",
      });
    }, 3000);
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
                    onFilesChange={handleDocumentExtraction}
                    maxFiles={15}
                  />
                  
                  {isExtracting && (
                    <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <div>
                          <p className="font-medium text-primary">Processing Documents...</p>
                          <p className="text-sm text-muted-foreground">AI is extracting claim details from your uploaded files</p>
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

            {currentStep === "review" ? (
              <Button onClick={submitClaim} className="flex items-center gap-2">
                Submit Claim to AI Agent
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : currentStep === "method" ? (
              <Button 
                onClick={nextStep} 
                className="flex items-center gap-2"
                disabled={!submissionMethod || (submissionMethod === "documents" && !isExtracting && formData.files.length === 0)}
              >
                {submissionMethod === "form" ? "Continue with Form" : submissionMethod === "documents" ? "Processing..." : "Choose Method"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}