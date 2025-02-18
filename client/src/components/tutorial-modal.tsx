import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RestConcept } from "@shared/schema";
import { Code } from "lucide-react";

interface TutorialModalProps {
  concept: RestConcept;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface TutorialStep {
  title: string;
  description: string;
  code?: string;
}

export function TutorialModal({ concept, isOpen, onClose, onComplete }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const getTutorialSteps = (method: string): TutorialStep[] => {
    switch (method) {
      case "GET":
        return [
          {
            title: "Understanding GET Requests",
            description: "GET requests are used to retrieve data from a server. They are read-only and should not modify any data.",
            code: "fetch('/api/planets')\n  .then(response => response.json())\n  .then(data => console.log(data));"
          },
          {
            title: "Parameters in GET Requests",
            description: "You can include query parameters to filter or sort the data you want to retrieve.",
            code: "fetch('/api/planets?type=terrestrial')\n  .then(response => response.json());"
          },
          {
            title: "Practical Example",
            description: "Let's see how to use GET requests to fetch planet details from our solar system API.",
            code: "// Get details of Mercury\nfetch('/api/planets/1')\n  .then(response => response.json());"
          }
        ];
      case "POST":
        return [
          {
            title: "Understanding POST Requests",
            description: "POST requests are used to create new resources on the server.",
            code: "fetch('/api/planets', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'New Planet' })\n});"
          },
          {
            title: "Request Body",
            description: "POST requests typically include a body with the data for the new resource.",
            code: "const newPlanet = {\n  name: 'Kepler-186f',\n  type: 'Terrestrial',\n  description: 'An exoplanet'\n};"
          },
          {
            title: "Handling Responses",
            description: "The server usually responds with the created resource and a 201 status code.",
            code: "// Response example:\n{\n  \"id\": 9,\n  \"name\": \"Kepler-186f\",\n  \"type\": \"Terrestrial\"\n}"
          }
        ];
      case "PATCH":
        return [
          {
            title: "Understanding PATCH Requests",
            description: "PATCH requests are used to make partial updates to existing resources.",
            code: "fetch('/api/planets/1', {\n  method: 'PATCH',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ description: 'Updated description' })\n});"
          },
          {
            title: "Partial Updates",
            description: "Unlike PUT, PATCH only updates the specified fields, leaving others unchanged.",
            code: "// Only updating the description\nconst update = {\n  description: 'New description for Mercury'\n};"
          }
        ];
      case "DELETE":
        return [
          {
            title: "Understanding DELETE Requests",
            description: "DELETE requests are used to remove resources from the server.",
            code: "fetch('/api/planets/1', {\n  method: 'DELETE'\n});"
          },
          {
            title: "Handling Responses",
            description: "A successful DELETE usually returns a 204 No Content status.",
            code: "// Example DELETE request with error handling\nfetch('/api/planets/1', {\n  method: 'DELETE'\n})\n.then(response => {\n  if (response.ok) {\n    console.log('Resource deleted');\n  }\n});"
          }
        ];
      default:
        return [
          {
            title: `Understanding ${method} Requests`,
            description: `Learn how to use ${method} requests in REST APIs.`,
            code: concept.example
          }
        ];
    }
  };

  const steps = getTutorialSteps(concept.method);
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            {steps[currentStep].title}
          </DialogTitle>
          <DialogDescription>
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        {steps[currentStep].code && (
          <div className="bg-muted p-4 rounded-md overflow-x-auto">
            <pre className="text-sm">
              <code>{steps[currentStep].code}</code>
            </pre>
          </div>
        )}

        <DialogFooter className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <Button onClick={handleNext}>
              {isLastStep ? "Complete" : "Next"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}