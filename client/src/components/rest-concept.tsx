import { RestConcept } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RestConceptCardProps {
  concept: RestConcept;
}

export default function RestConceptCard({ concept }: RestConceptCardProps) {
  const methodColors = {
    GET: "bg-blue-500",
    POST: "bg-green-500",
    PUT: "bg-yellow-500",
    DELETE: "bg-red-500",
    PATCH: "bg-purple-500",
  };

  return (
    <Card className="bg-black/30 border-accent">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          {concept.title}
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
      </CardContent>
    </Card>
  );
}
