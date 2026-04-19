import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { mapsPostWithFieldMask, mapsGet } from "../api.js";

const PLACES_BASE = "https://places.googleapis.com/v1/places";

export function registerPlacesTools(server: McpServer) {
  server.tool(
    "search_places_text",
    "Search for places using a text query (e.g. 'restaurants in Sydney'). Uses Places API (New).",
    {
      query: z.string().describe("Text search query"),
      maxResultCount: z.number().optional().default(10).describe("Max results (1-20)"),
      languageCode: z.string().optional().describe("Language code (e.g. 'en')"),
      locationBias: z
        .object({
          latitude: z.number(),
          longitude: z.number(),
          radius: z.number().describe("Radius in meters"),
        })
        .optional()
        .describe("Bias results toward this location"),
      openNow: z.boolean().optional().describe("Only return places that are open now"),
      minRating: z.number().optional().describe("Minimum user rating (1.0-5.0)"),
    },
    async ({ query, maxResultCount, languageCode, locationBias, openNow, minRating }) => {
      const body: Record<string, unknown> = { textQuery: query, maxResultCount, languageCode, openNow, minRating };
      if (locationBias) {
        body.locationBias = {
          circle: {
            center: { latitude: locationBias.latitude, longitude: locationBias.longitude },
            radius: locationBias.radius,
          },
        };
      }
      const data = await mapsPostWithFieldMask(
        `${PLACES_BASE}:searchText`,
        body,
        "places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types,places.websiteUri,places.regularOpeningHours,places.priceLevel,places.id"
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "search_places_nearby",
    "Find places near a location within a given radius. Uses Places API (New).",
    {
      latitude: z.number().describe("Center latitude"),
      longitude: z.number().describe("Center longitude"),
      radius: z.number().describe("Search radius in meters (max 50000)"),
      includedTypes: z.array(z.string()).optional().describe("Place types to include (e.g. ['restaurant', 'cafe'])"),
      excludedTypes: z.array(z.string()).optional().describe("Place types to exclude"),
      maxResultCount: z.number().optional().default(10).describe("Max results (1-20)"),
      languageCode: z.string().optional().describe("Language code"),
    },
    async ({ latitude, longitude, radius, includedTypes, excludedTypes, maxResultCount, languageCode }) => {
      const data = await mapsPostWithFieldMask(
        `${PLACES_BASE}:searchNearby`,
        {
          locationRestriction: {
            circle: { center: { latitude, longitude }, radius },
          },
          includedTypes,
          excludedTypes,
          maxResultCount,
          languageCode,
        },
        "places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types,places.websiteUri,places.id"
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "get_place_details",
    "Get detailed information about a specific place by its place ID",
    {
      placeId: z.string().describe("The Google Maps place ID"),
      languageCode: z.string().optional().describe("Language code"),
    },
    async ({ placeId, languageCode }) => {
      // Place Details uses GET with field mask header
      const url = new URL(`${PLACES_BASE}/${placeId}`);
      url.searchParams.set("key", process.env.GOOGLE_MAPS_API_KEY!);
      if (languageCode) url.searchParams.set("languageCode", languageCode);
      const res = await fetch(url.toString(), {
        headers: {
          "X-Goog-FieldMask":
            "displayName,formattedAddress,location,rating,userRatingCount,types,websiteUri,regularOpeningHours,internationalPhoneNumber,reviews,photos,priceLevel,editorialSummary,accessibilityOptions",
        },
      });
      if (!res.ok) throw new Error(`Places API error ${res.status}: ${await res.text()}`);
      const details = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(details, null, 2) }] };
    }
  );

  server.tool(
    "autocomplete_places",
    "Get place autocomplete suggestions for partial input text",
    {
      input: z.string().describe("The text to autocomplete"),
      locationBias: z
        .object({
          latitude: z.number(),
          longitude: z.number(),
          radius: z.number(),
        })
        .optional()
        .describe("Bias results toward this location"),
      languageCode: z.string().optional().describe("Language code"),
      includedPrimaryTypes: z.array(z.string()).optional().describe("Limit to these place types"),
    },
    async ({ input, locationBias, languageCode, includedPrimaryTypes }) => {
      const body: Record<string, unknown> = { input, languageCode, includedPrimaryTypes };
      if (locationBias) {
        body.locationBias = {
          circle: {
            center: { latitude: locationBias.latitude, longitude: locationBias.longitude },
            radius: locationBias.radius,
          },
        };
      }
      const data = await mapsPostWithFieldMask(
        `${PLACES_BASE}:autocomplete`,
        body,
        "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat"
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );
}
