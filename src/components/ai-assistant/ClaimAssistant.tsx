import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send, CheckCircle, AlertTriangle, FileText } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const mockMessages: Message[] = [
  {
    id: "1",
    type: "assistant",
    content: "Hello! I'm your AI Claims Assistant. I can help you with claim processing, document analysis, and provide suggestions based on uploaded evidence.",
    timestamp: new Date(Date.now() - 5 * 60000),
  },
];

export function ClaimAssistant() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes("upload") || input.includes("document")) {
      return {
        content: "I can see you're ready to upload documents. Based on the claim type, I recommend uploading: police reports, photos of damage, repair estimates, and any medical reports if applicable. This will help expedite the processing.",
        suggestions: ["Upload police report", "Take damage photos", "Get repair estimate"]
      };
    }
    
    if (input.includes("damage") || input.includes("repair")) {
      return {
        content: "I notice this involves vehicle damage. From the photos you might upload, I can automatically estimate repair costs and identify if this requires special handling. Would you like me to analyze any damage photos?",
        suggestions: ["Analyze damage photos", "Get repair estimate", "Check coverage"]
      };
    }
    
    if (input.includes("fraud") || input.includes("suspicious")) {
      return {
        content: "I understand your concern about potential fraud. Our AI system automatically flags suspicious patterns, but I can also help you identify red flags. What specific aspects seem unusual?",
        suggestions: ["Review incident details", "Check claimant history", "Verify documents"]
      };
    }
    
    return {
      content: "I'm here to help with your claim processing. I can assist with document analysis, damage assessment, fraud detection, and provide recommendations for faster processing. What would you like help with?",
      suggestions: ["Upload documents", "Review claim details", "Check processing status"]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <Card className="w-full max-w-md h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bot className="w-4 h-4 text-primary" />
          AI Claims Assistant
          <Badge variant="secondary" className="ml-auto">Live</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === "user" ? "bg-primary" : "bg-muted"
                  }`}>
                    {message.type === "user" ? (
                      <User className="w-3 h-3 text-primary-foreground" />
                    ) : (
                      <Bot className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.type === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    {message.suggestions && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs hover:bg-background/20"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your claim..."
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button size="sm" onClick={sendMessage} disabled={!inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}