import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  HelpCircle, 
  FileText, 
  Clock, 
  Phone, 
  Mail, 
  MessageCircle,
  ChevronDown,
  Search
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const faqs = [
  {
    question: "How long does claim processing take?",
    answer: "With our AI-powered system, most claims are processed within 24-48 hours. Simple claims can be resolved in as little as 4 hours, while complex cases involving fraud investigation or extensive damage assessment may take up to 5 business days."
  },
  {
    question: "What documents do I need to submit a claim?",
    answer: "Essential documents include: police report (if applicable), photos of damage, repair estimates, driver's license, insurance card, and any medical reports for injury claims. Our AI can process various document formats including PDF, images, and even handwritten notes."
  },
  {
    question: "How do I track my claim status?",
    answer: "Use our Track Claim feature with your claim ID. You'll see real-time updates as your claim moves through our 8-stage AI processing pipeline, from initial intake to final communication."
  },
  {
    question: "What types of commercial auto claims do you handle?",
    answer: "We process all types of commercial auto claims including collision, comprehensive, cargo damage, liability, medical payments, and uninsured motorist claims for trucks, vans, trailers, and fleet vehicles."
  },
  {
    question: "How does the AI fraud detection work?",
    answer: "Our AI analyzes patterns in claims data, compares incident details against historical fraud cases, validates document authenticity, and flags suspicious activities. All flagged cases are reviewed by human adjusters."
  },
  {
    question: "Can I appeal a claim decision?",
    answer: "Yes, you can request a review of any claim decision. Our system will escalate your case to a senior adjuster who will conduct a manual review of the AI's decision and all supporting evidence."
  }
];

export default function Help() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (index: string) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-xl text-muted-foreground">
              Get answers to your questions about our AI-powered claims processing
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Submit a Claim</CardTitle>
                <CardDescription>
                  Start your claim process with our step-by-step wizard
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" asChild>
                  <a href="/report-claim">Start New Claim</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Track a Claim</CardTitle>
                <CardDescription>
                  Check the status of your existing claim
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full" asChild>
                  <a href="/track-claim">Track Status</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Contact Support</CardTitle>
                <CardDescription>
                  Speak with our support team directly
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full">
                  Get Help Now
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find answers to common questions about our claims process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search FAQs */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* FAQ Items */}
              <div className="space-y-2">
                {filteredFaqs.map((faq, index) => (
                  <Collapsible key={index}>
                    <CollapsibleTrigger 
                      className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 rounded-lg transition-colors"
                      onClick={() => toggleItem(index.toString())}
                    >
                      <span className="font-medium">{faq.question}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${
                        openItems.includes(index.toString()) ? 'transform rotate-180' : ''
                      }`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No FAQs match your search.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">1-800-CLAIMS (1-800-252-4677)</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>24/7 Emergency Claims</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Mon-Fri 8AM-8PM EST for General Support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">support@autosure-claims.ai</p>
                  <p className="text-sm text-muted-foreground">
                    Response within 4 hours during business hours
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Emergency claims: claims@autosure-claims.ai
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
              <CardDescription>
                Send us a message and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="What can we help you with?" />
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    placeholder="Please describe your question or issue in detail..."
                    rows={5}
                  />
                </div>
                <Button className="w-full md:w-auto">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}