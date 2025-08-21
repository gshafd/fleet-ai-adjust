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
      <section className="relative min-h-[80vh] flex items-center px-4 overflow-hidden">
        {/* Background with subtle overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-primary/20"></div>
        
        {/* Content */}
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
              <Brain className="w-4 h-4" />
              AI-Powered Claims Processing
            </div>
            <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent leading-tight">
              Autonomous Claims Processing
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform your commercial auto insurance workflow with AI agents that process claims 
              <span className="text-primary font-semibold"> 10x faster</span> than traditional methods
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover-scale" asChild>
                <Link to="/report-claim">
                  <FileText className="w-5 h-5 mr-2" />
                  Report a Claim Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 hover:bg-muted/50 hover-scale" asChild>
                <Link to="/dashboard">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Dashboard
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">90%</div>
                <div className="text-sm text-muted-foreground">Faster Processing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Automated Service</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">8</div>
                <div className="text-sm text-muted-foreground">AI Agents</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              Why Choose AutoSure?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Revolutionize Your Claims Process</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Our autonomous system processes claims 10x faster than traditional methods while maintaining 
              accuracy and compliance through advanced AI orchestration.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl mb-3">Lightning Fast Processing</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Claims processed in minutes, not days. Automated workflows reduce processing time by 90% 
                  with real-time status updates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl mb-3">AI-Powered Intelligence</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  8 specialized AI agents handle fraud detection, damage assessment, and settlement calculations 
                  with human-level accuracy.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:from-green-500/30 group-hover:to-green-600/30 transition-all duration-300">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl mb-3">Compliance & Security</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Built-in compliance checks ensure all regulations are met while maintaining enterprise-grade 
                  security and audit trails.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              AI Agent Workflow
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Our 8-agent orchestration system handles every aspect of your claim automatically, 
              from intake to settlement in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: FileText, title: "FNOL Intake", desc: "Automated document processing and intelligent data extraction from any format", color: "from-blue-500/20 to-blue-600/20", iconColor: "text-blue-600" },
              { icon: Shield, title: "Validation & Fraud", desc: "AI-powered fraud detection and comprehensive policy validation", color: "from-red-500/20 to-red-600/20", iconColor: "text-red-600" },
              { icon: BarChart3, title: "Assessment", desc: "Damage assessment and automated coverage verification", color: "from-green-500/20 to-green-600/20", iconColor: "text-green-600" },
              { icon: Users, title: "Settlement", desc: "Automated settlement calculation and customer communication", color: "from-purple-500/20 to-purple-600/20", iconColor: "text-purple-600" },
            ].map((step, index) => (
              <div key={index} className="text-center group hover-scale">
                <div className="relative mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto group-hover:shadow-lg transition-all duration-300`}>
                    <step.icon className={`w-10 h-10 ${step.iconColor}`} />
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-10 left-full w-8 h-0.5 bg-gradient-to-r from-primary/40 to-transparent"></div>
                  )}
                </div>
                <div className="bg-card/50 rounded-xl p-6 h-full border border-border/50">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/5 to-transparent"></div>
        </div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Transform Your Claims Process?
            </h2>
            <p className="text-lg md:text-xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Join thousands of fleet operators who have revolutionized their claims management 
              with our AI-powered platform. Experience the future today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg hover-scale" asChild>
                <Link to="/report-claim">
                  <FileText className="w-5 h-5 mr-2" />
                  Start Your First Claim
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover-scale" asChild>
                <Link to="/dashboard">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Live Demo
                </Link>
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-primary-foreground/20">
              <p className="text-sm opacity-75 mb-4">Trusted by leading insurance companies</p>
              <div className="flex justify-center items-center gap-8 opacity-60">
                <div className="text-sm font-medium">Enterprise Grade Security</div>
                <div className="w-1 h-1 bg-primary-foreground/40 rounded-full"></div>
                <div className="text-sm font-medium">SOC 2 Compliant</div>
                <div className="w-1 h-1 bg-primary-foreground/40 rounded-full"></div>
                <div className="text-sm font-medium">99.9% Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}