import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Calendar, MapPin, FileText, DollarSign } from "lucide-react";

export default function TrackClaim() {
  const [claimId, setClaimId] = useState("");
  const [claimData, setClaimData] = useState<any>(null);

  const searchClaim = () => {
    // Mock claim data
    const mockClaim = {
      id: "CL-2024-001234",
      status: "processing",
      progress: 75,
      submitDate: "2024-01-15",
      estimatedCompletion: "2024-01-22",
      currentStage: "Settlement Calculation",
      claimant: "John Doe",
      policyNumber: "POL-789456",
      incidentDate: "2024-01-10",
      location: "Chicago, IL",
      lossType: "Collision",
      estimatedPayout: 45000,
      adjuster: "Sarah Johnson",
      timeline: [
        { stage: "FNOL Intake", status: "completed", date: "2024-01-15 09:00" },
        { stage: "Validation", status: "completed", date: "2024-01-15 09:15" },
        { stage: "Fraud Detection", status: "completed", date: "2024-01-15 09:30" },
        { stage: "Claim Creation", status: "completed", date: "2024-01-15 10:00" },
        { stage: "Coverage Verification", status: "completed", date: "2024-01-15 10:30" },
        { stage: "Damage Assessment", status: "completed", date: "2024-01-16 14:00" },
        { stage: "Settlement Calculation", status: "processing", date: "2024-01-17 11:00" },
        { stage: "Communication", status: "pending", date: null },
      ]
    };
    setClaimData(mockClaim);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "processing": return "secondary";
      case "pending": return "outline";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "processing": return "In Progress";
      case "pending": return "Pending";
      default: return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Track Your Claim</h1>
            <p className="text-muted-foreground">
              Enter your claim ID to see real-time processing status.
            </p>
          </div>

          {/* Search Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter Claim ID (e.g., CL-2024-001234)"
                    value={claimId}
                    onChange={(e) => setClaimId(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button onClick={searchClaim} className="h-12 px-6">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Claim Details */}
          {claimData && (
            <div className="space-y-6">
              {/* Status Overview */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{claimData.id}</CardTitle>
                      <CardDescription>Submitted on {claimData.submitDate}</CardDescription>
                    </div>
                    <Badge variant={getStatusColor(claimData.status)} className="text-sm">
                      {getStatusLabel(claimData.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Claim Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Claimant:</span>
                          <span className="font-medium">{claimData.claimant}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Policy Number:</span>
                          <span className="font-medium">{claimData.policyNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Loss Type:</span>
                          <span className="font-medium">{claimData.lossType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Assigned Adjuster:</span>
                          <span className="font-medium">{claimData.adjuster}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Processing Status</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Overall Progress</span>
                            <span>{claimData.progress}%</span>
                          </div>
                          <Progress value={claimData.progress} className="h-3" />
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Estimated Completion:</span>
                          <span className="font-medium">{claimData.estimatedCompletion}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Incident Location:</span>
                          <span className="font-medium">{claimData.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Estimated Payout:</span>
                          <span className="font-medium">${claimData.estimatedPayout.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Processing Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Processing Timeline</CardTitle>
                  <CardDescription>
                    Track the progress of your claim through our AI agent pipeline
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {claimData.timeline.map((stage: any, index: number) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          stage.status === "completed" 
                            ? "bg-primary border-primary" 
                            : stage.status === "processing"
                            ? "bg-warning border-warning animate-pulse"
                            : "bg-background border-border"
                        }`} />
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{stage.stage}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant={getStatusColor(stage.status)} className="text-xs">
                                {getStatusLabel(stage.status)}
                              </Badge>
                              {stage.date && (
                                <span className="text-xs text-muted-foreground">{stage.date}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Stage Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Current Stage: {claimData.currentStage}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm">
                      Your claim is currently in the Settlement Calculation stage. Our AI agent is analyzing 
                      coverage details, damage assessments, and applicable deductibles to determine the final 
                      settlement amount. This process typically takes 1-2 business days.
                    </p>
                  </div>
                  
                  <div className="mt-4 flex gap-4">
                    <Button variant="outline" size="sm">
                      Contact Adjuster
                    </Button>
                    <Button variant="outline" size="sm">
                      Upload Additional Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* No results state */}
          {claimId && !claimData && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Claim Found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find a claim with ID "{claimId}". Please check the ID and try again.
                </p>
                <Button variant="outline" onClick={() => setClaimId("")}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}