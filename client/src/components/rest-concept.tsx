import { RestConcept } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Circle } from "lucide-react";

interface RestConceptCardProps {
  concept: RestConcept;
}

interface Progress {
  completed: boolean;
  notes: string | null;
}

export default function RestConceptCard({ concept }: RestConceptCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState("");

  const { data: progress } = useQuery<Progress>({
    queryKey: [`/api/progress/${concept.id}`],
    enabled: !!user,
  });

  const updateProgress = useMutation({
    mutationFn: async (data: Partial<Progress>) => {
      return apiRequest("POST", `/api/progress/${concept.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/progress/${concept.id}`] });
      toast({
        title: "Success",
        description: "Progress updated successfully",
      });
    },
  });

  const methodColors = {
    GET: "bg-blue-500",
    POST: "bg-green-500",
    PUT: "bg-yellow-500",
    DELETE: "bg-red-500",
    PATCH: "bg-purple-500",
  };

  const handleToggleComplete = () => {
    if (!user) return;
    updateProgress.mutate({ completed: !progress?.completed });
  };

  const handleSaveNotes = () => {
    if (!user || !notes.trim()) return;
    updateProgress.mutate({ notes });
    setNotes("");
  };

  return (
    <Card className="bg-black/30 border-accent">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleComplete}
                className="hover:bg-transparent"
              >
                {progress?.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </Button>
            )}
            {concept.title}
          </div>
          <Badge
            className={`${
              methodColors[concept.method as keyof typeof methodColors]
            } text-white`}
          >
            {concept.method}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{concept.description}</p>
        <code className="text-sm bg-muted p-2 rounded-md block">
          {concept.example}
        </code>
        {user && (
          <div className="space-y-2 mt-4">
            <Textarea
              placeholder="Add notes about this concept..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              onClick={handleSaveNotes}
              disabled={!notes.trim()}
              className="w-full"
            >
              Save Notes
            </Button>
            {progress?.notes && (
              <div className="mt-2 p-2 bg-muted rounded-md">
                <p className="text-sm font-medium">Your Notes:</p>
                <p className="text-sm text-muted-foreground">{progress.notes}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}