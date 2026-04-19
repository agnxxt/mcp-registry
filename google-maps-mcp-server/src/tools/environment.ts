import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { mapsGet, mapsPost } from "../api.js";

export function registerEnvironmentTools(server: McpServer) {
  // Elevation API
  server.tool(
    "get_elevation",
    "Get elevation (meters above sea level) for one or more locations",
    {
      locations: z.string().describe("Pipe-separated lat/lng pairs (e.g. '39.739,-104.984|36.455,-116.866')"),
    },
    async ({ locations }) => {
      const data = await mapsGet("https://maps.googleapis.com/maps/api/elevation/json", { locations });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "get_elevation_along_path",
    "Get elevation samples along a path between points",
    {
      path: z.string().describe("Pipe-separated lat/lng pairs defining the path"),
      samples: z.number().describe("Number of elevation samples along the path"),
    },
    async ({ path, samples }) => {
      const data = await mapsGet("https://maps.googleapis.com/maps/api/elevation/json", { path, samples });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // Air Quality API
  server.tool(
    "get_air_quality",
    "Get current air quality conditions for a location. Returns AQI, pollutant levels, and health recommendations.",
    {
      latitude: z.number().describe("Latitude"),
      longitude: z.number().describe("Longitude"),
      languageCode: z.string().optional().default("en").describe("Language for health recommendations"),
    },
    async ({ latitude, longitude, languageCode }) => {
      const data = await mapsPost(
        "https://airquality.googleapis.com/v1/currentConditions:lookup",
        {
          location: { latitude, longitude },
          languageCode,
          extraComputations: ["HEALTH_RECOMMENDATIONS", "DOMINANT_POLLUTANT_CONCENTRATION", "POLLUTANT_CONCENTRATION", "LOCAL_AQI", "POLLUTANT_ADDITIONAL_INFO"],
        }
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "get_air_quality_history",
    "Get historical air quality data for a location over a time range",
    {
      latitude: z.number().describe("Latitude"),
      longitude: z.number().describe("Longitude"),
      hours: z.number().optional().default(24).describe("Number of hours of history (max 720 = 30 days)"),
      languageCode: z.string().optional().default("en"),
    },
    async ({ latitude, longitude, hours, languageCode }) => {
      const data = await mapsPost(
        "https://airquality.googleapis.com/v1/history:lookup",
        {
          location: { latitude, longitude },
          hours,
          languageCode,
          extraComputations: ["DOMINANT_POLLUTANT_CONCENTRATION", "POLLUTANT_CONCENTRATION", "LOCAL_AQI"],
        }
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // Pollen API
  server.tool(
    "get_pollen_info",
    "Get pollen data for a location including tree, grass, and weed pollen levels",
    {
      latitude: z.number().describe("Latitude"),
      longitude: z.number().describe("Longitude"),
      days: z.number().optional().default(1).describe("Number of forecast days (1-5)"),
      languageCode: z.string().optional().default("en"),
    },
    async ({ latitude, longitude, days, languageCode }) => {
      const data = await mapsGet("https://pollen.googleapis.com/v1/forecast:lookup", {
        "location.latitude": latitude,
        "location.longitude": longitude,
        days,
        languageCode,
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // Solar API
  server.tool(
    "get_solar_info",
    "Get solar potential data for a building at a location. Returns roof area, sunlight hours, panel configurations, and energy estimates.",
    {
      latitude: z.number().describe("Latitude of the building"),
      longitude: z.number().describe("Longitude of the building"),
      requiredQuality: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().describe("Minimum data quality level"),
    },
    async ({ latitude, longitude, requiredQuality }) => {
      const data = await mapsGet("https://solar.googleapis.com/v1/buildingInsights:findClosest", {
        "location.latitude": latitude,
        "location.longitude": longitude,
        requiredQuality,
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );
}
