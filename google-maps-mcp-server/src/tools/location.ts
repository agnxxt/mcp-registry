import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { mapsGet, mapsPost } from "../api.js";

export function registerLocationTools(server: McpServer) {
  // Address Validation API
  server.tool(
    "validate_address",
    "Validate and standardize a postal address. Returns corrected address, geocode, and metadata about each component.",
    {
      addressLines: z.array(z.string()).describe("Address lines (e.g. ['1600 Amphitheatre Pkwy', 'Mountain View, CA 94043'])"),
      regionCode: z.string().optional().describe("ISO 3166-1 alpha-2 country code (e.g. 'US')"),
      locality: z.string().optional().describe("City/town name"),
      administrativeArea: z.string().optional().describe("State/province"),
      postalCode: z.string().optional(),
      languageCode: z.string().optional(),
    },
    async ({ addressLines, regionCode, locality, administrativeArea, postalCode, languageCode }) => {
      const address: Record<string, unknown> = { addressLines, regionCode, locality, administrativeArea, postalCode, languageCode };
      const data = await mapsPost("https://addressvalidation.googleapis.com/v1:validateAddress", { address });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // Time Zone API
  server.tool(
    "get_timezone",
    "Get the time zone for a location at a given time",
    {
      latitude: z.number().describe("Latitude"),
      longitude: z.number().describe("Longitude"),
      timestamp: z.number().optional().describe("Unix timestamp (seconds). Defaults to current time."),
      language: z.string().optional(),
    },
    async ({ latitude, longitude, timestamp, language }) => {
      const ts = timestamp ?? Math.floor(Date.now() / 1000);
      const data = await mapsGet("https://maps.googleapis.com/maps/api/timezone/json", {
        location: `${latitude},${longitude}`,
        timestamp: ts,
        language,
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // Geolocation API
  server.tool(
    "geolocate",
    "Estimate device location from cell tower and WiFi access point data. Useful for IP-based or network-based location.",
    {
      homeMobileCountryCode: z.number().optional().describe("Mobile country code (MCC)"),
      homeMobileNetworkCode: z.number().optional().describe("Mobile network code (MNC)"),
      considerIp: z.boolean().optional().default(true).describe("Use IP address for location estimation"),
      wifiAccessPoints: z
        .array(
          z.object({
            macAddress: z.string().describe("MAC address of the WiFi AP"),
            signalStrength: z.number().optional(),
            channel: z.number().optional(),
          })
        )
        .optional()
        .describe("WiFi access points visible to the device"),
      cellTowers: z
        .array(
          z.object({
            cellId: z.number(),
            locationAreaCode: z.number(),
            mobileCountryCode: z.number(),
            mobileNetworkCode: z.number(),
            signalStrength: z.number().optional(),
          })
        )
        .optional()
        .describe("Cell towers visible to the device"),
    },
    async ({ homeMobileCountryCode, homeMobileNetworkCode, considerIp, wifiAccessPoints, cellTowers }) => {
      const data = await mapsPost("https://www.googleapis.com/geolocation/v1/geolocate", {
        homeMobileCountryCode,
        homeMobileNetworkCode,
        considerIp,
        wifiAccessPoints,
        cellTowers,
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );
}
