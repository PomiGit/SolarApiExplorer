import { InsertPlanet, InsertRestConcept } from "@shared/schema";

export const planetData: InsertPlanet[] = [
  {
    name: "Mercury",
    description: "The smallest and innermost planet in the Solar System. A perfect example of a GET request to retrieve basic planetary data.",
    type: "Terrestrial",
    distanceFromSun: 57,
    imageUrl: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5"
  },
  {
    name: "Venus",
    description: "Often called Earth's sister planet due to similar size. Demonstrates PUT requests to update planetary information.",
    type: "Terrestrial",
    distanceFromSun: 108,
    imageUrl: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6"
  },
  {
    name: "Earth",
    description: "Our home planet. Shows POST requests for creating new resource entries in our planetary database.",
    type: "Terrestrial",
    distanceFromSun: 149,
    imageUrl: "https://images.unsplash.com/photo-1614728423169-3f65fd722b7e"
  },
  {
    name: "Mars",
    description: "The Red Planet. Illustrates PATCH requests for partial updates to existing planetary data.",
    type: "Terrestrial",
    distanceFromSun: 227,
    imageUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4"
  },
  {
    name: "Jupiter",
    description: "The largest planet in our solar system. Perfect for demonstrating filtering and query parameters in REST APIs.",
    type: "Gas Giant",
    distanceFromSun: 778,
    imageUrl: "https://images.unsplash.com/photo-1614732484003-ef9881555dc3"
  },
  {
    name: "Saturn",
    description: "Famous for its rings. Shows how to handle complex nested resources in REST APIs.",
    type: "Gas Giant",
    distanceFromSun: 1426,
    imageUrl: "https://images.unsplash.com/photo-1614314169000-4cf229a1db33"
  },
  {
    name: "Uranus",
    description: "An ice giant planet. Demonstrates DELETE operations in REST APIs.",
    type: "Ice Giant",
    distanceFromSun: 2870,
    imageUrl: "https://images.unsplash.com/photo-1614314913007-2b4ae8ce32d6"
  },
  {
    name: "Neptune",
    description: "The windiest planet. Shows how to handle pagination in REST APIs.",
    type: "Ice Giant",
    distanceFromSun: 4498,
    imageUrl: "https://images.unsplash.com/photo-1614728423169-3f65fd722b7e"
  }
];

export const restConceptsData: InsertRestConcept[] = [
  {
    title: "GET Request",
    description: "Used to retrieve resources from the server. Like asking about a specific planet's details.",
    method: "GET",
    example: "GET /api/planets/1 - Retrieves Mercury's data"
  },
  {
    title: "POST Request",
    description: "Creates new resources on the server. Similar to adding a newly discovered planet.",
    method: "POST",
    example: "POST /api/planets - Creates a new planet entry"
  },
  {
    title: "PUT Request",
    description: "Updates existing resources by replacing them entirely. Like updating all information about Venus.",
    method: "PUT",
    example: "PUT /api/planets/2 - Updates all Venus data"
  },
  {
    title: "PATCH Request",
    description: "Partially updates existing resources. Perfect for updating just the description of Mars.",
    method: "PATCH",
    example: "PATCH /api/planets/4 - Updates specific Mars fields"
  },
  {
    title: "DELETE Request",
    description: "Removes resources from the server. Like removing a planet from our database.",
    method: "DELETE",
    example: "DELETE /api/planets/7 - Removes Uranus entry"
  }
];
