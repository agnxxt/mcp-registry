import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { mapsGet } from "../api.js";

const BASE = "https://maps.googleapis.com/maps/api/geocode/json";

export function registerGeocodingTools(server: McpServer) {
  server.tool(
    "geocode",
    "Convert an address to geographic coordinates (latitude/longitude)",
    {
      address: z.string().describe("The street address to geocode"),
      language: z.string().optional().describe("Language for results (e.g. 'en', 'ja')"),
      region: z.string().optional().describe("Region bias ccTLD (e.g. 'us', 'uk')"),
    },
    async ({ address, language, region }) => {
      const data = await mapsGet(BASE, { address, language, region });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "reverse_geocode",
    "Convert coordinates to a human-readable address",
    {
      latitude: z.number().describe("Latitude"),
      longitude: z.number().describe("Longitude"),
      language: z.string().optional().describe("Language for results"),
      result_type: z.string().optional().describe("Filter by type (e.g. 'street_address', 'locality')"),
    },
    async ({ latitude, longitude, language, result_type }) => {
      const data = await mapsGet(BASE, {
        latlng: `${latitude},${longitude}`,
        language,
        result_type,
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );
}
