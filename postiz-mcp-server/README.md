# Postiz MCP Server

MCP server for the Postiz social media scheduling API. Provides tools for managing posts, channels, media, and analytics.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `POSTIZ_URL` | Postiz instance URL (e.g. `https://postiz.example.com`) |
| `POSTIZ_API_KEY` | Postiz API key (Bearer token) |

## Tools (13)

### Posts (6)
- `list_posts` - List posts with pagination (page, limit)
- `get_post` - Get a single post by ID
- `create_post` - Create a new post (content, platforms, scheduledDate)
- `update_post` - Update an existing post
- `delete_post` - Delete a post
- `schedule_post` - Schedule an existing post for publishing

### Channels (3)
- `list_channels` - List all connected channels
- `connect_channel` - Connect a new channel (type, credentials)
- `disconnect_channel` - Disconnect a channel

### Media (2)
- `list_media` - List all media files
- `upload_media` - Upload media (url or base64 content)

### Analytics (2)
- `get_analytics` - Get analytics for a date range and optional channel
- `get_post_analytics` - Get analytics for a specific post

## Setup

```bash
npm install
npm run build
```

## Usage

```json
{
  "mcpServers": {
    "postiz": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "POSTIZ_URL": "https://postiz.example.com",
        "POSTIZ_API_KEY": "your-api-key"
      }
    }
  }
}
```
