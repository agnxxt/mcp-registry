import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { buildStaticUrl } from "../api.js";

export function registerMapsTools(server: McpServer) {
  server.tool(
    "static_map",
    "Generate a static map image URL. Returns a URL that can be embedded or opened in a browser.",
    {
      center: z.string().optional().describe("Center of the map (address or 'lat,lng'). Required if no markers."),
      zoom: z.number().optional().describe("Zoom level (0=world, 21=building). Required if no markers."),
      size: z.string().optional().default("600x400").describe("Image size as 'WxH' (max 640x640 for free)"),
      maptype: z.enum(["roadmap", "satellite", "terrain", "hybrid"]).optional().default("roadmap"),
      markers: z
        .string()
        .optional()
        .describe("Marker definitions. e.g. 'color:red|label:A|40.714,-74.006' — pipe-separated, multiple markers separated by '&markers='"),
      path: z
        .string()
        .optional()
        .describe("Draw a path on the map. e.g. 'color:0x0000ff|weight:5|40.714,-74.006|40.718,-74.012'"),
      scale: z.number().optional().describe("Image scale (1, 2, or 4 for high DPI)"),
      format: z.enum(["png", "png8", "png32", "gif", "jpg", "jpg-baseline"]).optional(),
      language: z.string().optional(),
    },
    async ({ center, zoom, size, maptype, markers, path, scale, format, language }) => {
      const url = buildStaticUrl("https://maps.googleapis.com/maps/api/staticmap", {
        center,
        zoom,
        size,
        maptype,
        markers,
        path,
        scale,
        format,
        language,
      });
      return {
        content: [
          { type: "text", text: `Static map URL:\n${url}` },
          { type: "image", data: url, mimeType: "text/uri-list" },
        ],
      };
    }
  );

  server.tool(
    "street_view_image",
    "Generate a Google Street View image URL for a location",
    {
      location: z.string().optional().describe("Location as 'lat,lng' or address"),
      pano: z.string().optional().describe("Specific panorama ID (alternative to location)"),
      size: z.string().optional().default("600x400").describe("Image size as 'WxH'"),
      heading: z.number().optional().describe("Camera heading (0-360, 0=north)"),
      pitch: z.number().optional().describe("Camera pitch (-90 to 90, 0=horizontal)"),
      fov: z.number().optional().describe("Field of view (10-120, default 90)"),
    },
    async ({ location, pano, size, heading, pitch, fov }) => {
      const url = buildStaticUrl("https://maps.googleapis.com/maps/api/streetview", {
        location,
        pano,
        size,
        heading,
        pitch,
        fov,
      });
      return {
        content: [{ type: "text", text: `Street View URL:\n${url}` }],
      };
    }
  );
}
