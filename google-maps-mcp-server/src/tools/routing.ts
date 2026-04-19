import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { mapsGet, mapsPostWithFieldMask, mapsPost } from "../api.js";

export function registerRoutingTools(server: McpServer) {
  // Directions API (legacy but widely used)
  server.tool(
    "get_directions",
    "Get directions between two locations with turn-by-turn steps. Returns routes with distance, duration, and steps.",
    {
      origin: z.string().describe("Starting point (address, place ID prefixed with 'place_id:', or 'lat,lng')"),
      destination: z.string().describe("Ending point (same formats as origin)"),
      mode: z.enum(["driving", "walking", "bicycling", "transit"]).optional().default("driving"),
      avoid: z.string().optional().describe("Comma-separated: tolls, highways, ferries, indoor"),
      waypoints: z.string().optional().describe("Pipe-separated intermediate stops (e.g. 'place1|place2')"),
      departure_time: z.string().optional().describe("Departure time as Unix timestamp or 'now'"),
      alternatives: z.boolean().optional().describe("Return alternative routes"),
      language: z.string().optional().describe("Language code"),
      units: z.enum(["metric", "imperial"]).optional(),
    },
    async ({ origin, destination, mode, avoid, waypoints, departure_time, alternatives, language, units }) => {
      const data = await mapsGet("https://maps.googleapis.com/maps/api/directions/json", {
        origin,
        destination,
        mode,
        avoid,
        waypoints,
        departure_time,
        alternatives,
        language,
        units,
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // Distance Matrix API
  server.tool(
    "distance_matrix",
    "Get travel distance and time for a matrix of origins and destinations",
    {
      origins: z.string().describe("Pipe-separated origins (addresses or 'lat,lng')"),
      destinations: z.string().describe("Pipe-separated destinations"),
      mode: z.enum(["driving", "walking", "bicycling", "transit"]).optional().default("driving"),
      avoid: z.string().optional().describe("Comma-separated: tolls, highways, ferries"),
      departure_time: z.string().optional().describe("Unix timestamp or 'now'"),
      language: z.string().optional(),
      units: z.enum(["metric", "imperial"]).optional(),
    },
    async ({ origins, destinations, mode, avoid, departure_time, language, units }) => {
      const data = await mapsGet("https://maps.googleapis.com/maps/api/distancematrix/json", {
        origins,
        destinations,
        mode,
        avoid,
        departure_time,
        language,
        units,
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // Routes API (New)
  server.tool(
    "compute_routes",
    "Compute an optimized route between origin and destination using the Routes API (New). Supports traffic-aware routing.",
    {
      origin_address: z.string().optional().describe("Origin as address"),
      origin_lat: z.number().optional().describe("Origin latitude (use with origin_lng)"),
      origin_lng: z.number().optional().describe("Origin longitude"),
      destination_address: z.string().optional().describe("Destination as address"),
      destination_lat: z.number().optional().describe("Destination latitude"),
      destination_lng: z.number().optional().describe("Destination longitude"),
      travelMode: z.enum(["DRIVE", "BICYCLE", "WALK", "TWO_WHEELER", "TRANSIT"]).optional().default("DRIVE"),
      routingPreference: z.enum(["TRAFFIC_UNAWARE", "TRAFFIC_AWARE", "TRAFFIC_AWARE_OPTIMAL"]).optional(),
      computeAlternativeRoutes: z.boolean().optional(),
      avoidTolls: z.boolean().optional(),
      avoidHighways: z.boolean().optional(),
      avoidFerries: z.boolean().optional(),
    },
    async (args) => {
      const origin: Record<string, unknown> = {};
      if (args.origin_address) origin.address = args.origin_address;
      else if (args.origin_lat !== undefined) origin.location = { latLng: { latitude: args.origin_lat, longitude: args.origin_lng } };

      const destination: Record<string, unknown> = {};
      if (args.destination_address) destination.address = args.destination_address;
      else if (args.destination_lat !== undefined) destination.location = { latLng: { latitude: args.destination_lat, longitude: args.destination_lng } };

      const routeModifiers: Record<string, boolean> = {};
      if (args.avoidTolls) routeModifiers.avoidTolls = true;
      if (args.avoidHighways) routeModifiers.avoidHighways = true;
      if (args.avoidFerries) routeModifiers.avoidFerries = true;

      const data = await mapsPostWithFieldMask(
        "https://routes.googleapis.com/directions/v2:computeRoutes",
        {
          origin: { ...origin },
          destination: { ...destination },
          travelMode: args.travelMode,
          routingPreference: args.routingPreference,
          computeAlternativeRoutes: args.computeAlternativeRoutes,
          routeModifiers: Object.keys(routeModifiers).length > 0 ? routeModifiers : undefined,
        },
        "routes.duration,routes.distanceMeters,routes.legs,routes.polyline,routes.description,routes.warnings,routes.travelAdvisory"
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // Route Optimization API
  server.tool(
    "optimize_tours",
    "Optimize vehicle routes for a fleet with shipments/visits. Solves vehicle routing problems (VRP).",
    {
      model: z.object({
        shipments: z.array(z.object({
          pickups: z.array(z.object({
            arrivalLocation: z.object({ latitude: z.number(), longitude: z.number() }),
            duration: z.string().optional().describe("Service time, e.g. '300s'"),
          })).optional(),
          deliveries: z.array(z.object({
            arrivalLocation: z.object({ latitude: z.number(), longitude: z.number() }),
            duration: z.string().optional(),
          })).optional(),
        })).describe("Shipments to fulfill"),
        vehicles: z.array(z.object({
          startLocation: z.object({ latitude: z.number(), longitude: z.number() }),
          endLocation: z.object({ latitude: z.number(), longitude: z.number() }).optional(),
          costPerKilometer: z.number().optional(),
          costPerHour: z.number().optional(),
        })).describe("Available vehicles"),
      }).describe("The optimization model"),
    },
    async ({ model }) => {
      const data = await mapsPost(
        "https://routeoptimization.googleapis.com/v1/projects/-:optimizeTours",
        { model }
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // Roads API — Snap to Roads
  server.tool(
    "snap_to_roads",
    "Snap GPS coordinates to the nearest road segments. Useful for cleaning up noisy GPS traces.",
    {
      path: z.string().describe("Pipe-separated lat/lng pairs (e.g. '60.17,-24.94|60.18,-24.95')"),
      interpolate: z.boolean().optional().describe("Interpolate additional points along the road"),
    },
    async ({ path, interpolate }) => {
      const data = await mapsGet("https://roads.googleapis.com/v1/snapToRoads", { path, interpolate });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );
}
