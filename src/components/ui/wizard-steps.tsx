import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface WizardStepsProps {
  steps: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
  currentStep: string;
  completedSteps: string[];
}

export function WizardSteps({ steps, currentStep, completedSteps }: WizardStepsProps) {
  return (
    <div className="flex items-center justify-between w-full mb-8">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  isCompleted
                    ? "bg-success border-success text-success-foreground"
                    : isCurrent
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-card border-border text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors",
                  isCompleted
                    ? "bg-success"
                    : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}