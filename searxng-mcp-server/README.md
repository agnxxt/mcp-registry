# SearXNG MCP Server

MCP Server for SearXNG metasearch engine.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SEARXNG_URL` | Yes | SearXNG instance URL |

## Authentication

No authentication required. SearXNG instances are typically self-hosted.

## Tools (5)

### Search
- `searxng_search` - Search the web with query, categories, engines, language, pagination
- `searxng_autocomplete` - Get autocomplete suggestions
- `searxng_get_config` - Get instance configuration
- `searxng_get_engines` - Get available search engines
- `searxng_get_categories` - Get available search categories

## Usage

```json
{
  "mcpServers": {
    "searxng": {
      "command": "node",
      "args": ["path/to/searxng-mcp-server/dist/index.js"],
      "env": {
        "SEARXNG_URL": "http://localhost:8080"
      }
    }
  }
}
```

## Build

```bash
npm install
npm run build
```
