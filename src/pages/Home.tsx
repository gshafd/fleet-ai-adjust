import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Link } from "react-router-dom";
import { Shield, Clock, Brain, Users, FileText, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-insurance.jpg";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative py-20 px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-primary/90"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary-foreground">
              Autonomous Claims Processing
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Experience the future of commercial auto insurance with AI-powered claims management. 
              Fast, accurate, and completely automated processing from intake to settlement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/report-claim">Report a Claim Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose AutoSure Claims AI?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our autonomous system processes claims 10x faster than traditional methods while maintaining accuracy and compliance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast Processing</CardTitle>
                <CardDescription>
                  Claims processed in minutes, not days. Automated workflows reduce processing time by 90%.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Intelligence</CardTitle>
                <CardDescription>
                  Advanced AI agents handle fraud detection, damage assessment, and settlement calculations automatically.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Compliance & Security</CardTitle>
                <CardDescription>
                  Built-in compliance checks ensure all regulations are met while maintaining enterprise-grade security.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our 8-agent orchestration system handles every aspect of your claim automatically.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: "FNOL Intake", desc: "Automated document processing and data extraction" },
              { icon: Shield, title: "Validation & Fraud", desc: "AI-powered fraud detection and policy validation" },
              { icon: BarChart3, title: "Assessment", desc: "Damage assessment and coverage verification" },
              { icon: Users, title: "Settlement", desc: "Automated settlement calculation and communication" },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Claims Process?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of fleet operators who have revolutionized their claims management with our AI-powered platform.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/report-claim">Start Your First Claim</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}