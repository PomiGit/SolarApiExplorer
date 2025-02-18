import { Link } from "wouter";
import { Planet } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlanetCardProps {
  planet: Planet;
}

export default function PlanetCard({ planet }: PlanetCardProps) {
  return (
    <Link href={`/planet/${planet.id}`}>
      <Card className="hover:border-primary transition-colors cursor-pointer bg-black/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {planet.name}
            <Badge variant="outline">{planet.type}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src={planet.imageUrl}
            alt={planet.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <p className="text-sm text-muted-foreground line-clamp-2">
            {planet.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
