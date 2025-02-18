import { useQuery } from "@tanstack/react-query";
import { Planet, RestConcept } from "@shared/schema";
import PlanetCard from "@/components/planet-card";
import RestConceptCard from "@/components/rest-concept";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { data: planets, isLoading: planetsLoading } = useQuery<Planet[]>({
    queryKey: ["/api/planets"],
  });

  const { data: concepts, isLoading: conceptsLoading } = useQuery<RestConcept[]>({
    queryKey: ["/api/concepts"],
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Learn REST APIs with the Solar System
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore REST API concepts through an interactive journey across our solar system.
            Each planet represents different API endpoints and operations.
          </p>
        </header>

        <Card className="bg-black/50 border-accent">
          <CardHeader>
            <CardTitle>REST API Concepts</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {conceptsLoading ? (
              <div>Loading concepts...</div>
            ) : (
              concepts?.map((concept) => (
                <RestConceptCard key={concept.id} concept={concept} />
              ))
            )}
          </CardContent>
        </Card>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {planetsLoading ? (
            <div>Loading planets...</div>
          ) : (
            planets?.map((planet) => (
              <PlanetCard key={planet.id} planet={planet} />
            ))
          )}
        </section>
      </div>
    </div>
  );
}
