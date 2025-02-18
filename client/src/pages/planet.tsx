import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Planet } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PlanetPage() {
  const { id } = useParams();
  const { data: planet, isLoading } = useQuery<Planet>({
    queryKey: [`/api/planets/${id}`],
  });

  if (isLoading) {
    return <div>Loading planet...</div>;
  }

  if (!planet) {
    return <div>Planet not found</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-black/50 border-accent">
          <CardHeader>
            <CardTitle className="text-3xl">{planet.name}</CardTitle>
            <Badge variant="outline">{planet.type}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <img
              src={planet.imageUrl}
              alt={planet.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            <p className="text-muted-foreground">{planet.description}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">API Endpoint</CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="text-sm bg-muted p-2 rounded-md block">
                    GET /api/planets/{planet.id}
                  </code>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Distance from Sun</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{planet.distanceFromSun} million km</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
