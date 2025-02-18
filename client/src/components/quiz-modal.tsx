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
import { RestConcept, QuizQuestion } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Brain, CheckCircle2, XCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface QuizModalProps {
  concept: RestConcept;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface QuizProgress {
  totalAttempts: number;
  correctAttempts: number;
}

export function QuizModal({ concept, isOpen, onClose, onComplete }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [explanation, setExplanation] = useState("");
  const { toast } = useToast();

  const { data: questions } = useQuery<Omit<QuizQuestion, "correctAnswer">[]>({
    queryKey: [`/api/concepts/${concept.id}/quiz`],
    enabled: isOpen,
  });

  const { data: progress } = useQuery<QuizProgress>({
    queryKey: [`/api/concepts/${concept.id}/quiz/progress`],
    enabled: isOpen,
  });

  const submitAnswer = useMutation({
    mutationFn: async (data: { questionId: number; selectedAnswer: number }) => {
      return apiRequest("POST", "/api/quiz/submit", data).then(res => res.json());
    },
    onSuccess: (response) => {
      setIsCorrect(response.isCorrect);
      setExplanation(response.explanation);
      setShowResult(true);
      queryClient.invalidateQueries({
        queryKey: [`/api/concepts/${concept.id}/quiz/progress`],
      });

      if (response.isCorrect) {
        toast({
          title: "Correct!",
          description: "Well done! Let's move to the next question.",
        });
      } else {
        toast({
          title: "Not quite right",
          description: "Review the explanation and try again!",
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = () => {
    if (!selectedAnswer || !questions) return;

    submitAnswer.mutate({
      questionId: questions[currentQuestion].id,
      selectedAnswer,
    });
  };

  const handleNext = () => {
    if (!questions) return;

    if (currentQuestion === questions.length - 1) {
      onComplete();
      onClose();
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No questions available</DialogTitle>
            <DialogDescription>
              Quiz questions for this concept are being prepared.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const currentQ = questions[currentQuestion];
  const progressPercentage = progress
    ? (progress.correctAttempts / Math.max(progress.totalAttempts, 1)) * 100
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Quiz: {concept.method} Requests
          </DialogTitle>
          <DialogDescription>
            Question {currentQuestion + 1} of {questions.length}
          </DialogDescription>
        </DialogHeader>

        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Your Progress</span>
              <span>{progress.correctAttempts}/{progress.totalAttempts} correct</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        <Card className="p-4">
          <p className="text-lg font-medium mb-4">{currentQ.question}</p>
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(Number(value))}
            className="space-y-3"
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                  disabled={showResult}
                />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </Card>

        {showResult && (
          <div className={`flex items-start gap-2 p-4 rounded-lg ${
            isCorrect ? "bg-green-500/10" : "bg-red-500/10"
          }`}>
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
            )}
            <div>
              <p className="font-medium">
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
              <p className="text-sm text-muted-foreground">{explanation}</p>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          {showResult ? (
            <Button onClick={handleNext}>
              {currentQuestion === questions.length - 1 ? "Complete" : "Next Question"}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
