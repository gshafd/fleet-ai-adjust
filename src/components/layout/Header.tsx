import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, FileText, BarChart3, Users, HelpCircle } from "lucide-react";

export function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              AutoSure Claims AI
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/report-claim"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/report-claim") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Report a Claim
            </Link>
            <Link
              to="/track-claim"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/track-claim") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Track Claim
            </Link>
            <Link
              to="/help"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/help") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Help Center
            </Link>
          </nav>

          {/* CTA Button */}
          <Button asChild className="bg-primary hover:bg-primary-hover">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}