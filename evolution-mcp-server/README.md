# Evolution MCP Server

MCP server for the Evolution API (WhatsApp gateway). Provides tools for managing instances, sending messages, contacts, groups, and webhooks.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `EVOLUTION_URL` | Evolution API base URL (e.g. `https://evolution.example.com`) |
| `EVOLUTION_API_KEY` | Evolution API key (sent via `apikey` header) |

## Tools (18)

### Instances (7)
- `list_instances` - List all instances
- `create_instance` - Create a new instance (instanceName, token, number)
- `connect_instance` - Connect an instance (returns QR code)
- `get_instance_status` - Get connection state of an instance
- `logout_instance` - Logout/disconnect an instance
- `delete_instance` - Delete an instance permanently
- `restart_instance` - Restart an instance

### Messages (3)
- `send_text` - Send a text message (instanceName, number, text)
- `send_media` - Send media message (instanceName, number, mediatype, media, caption)
- `send_location` - Send location message (instanceName, number, latitude, longitude, locName)

### Contacts (3)
- `list_contacts` - List all contacts for an instance
- `get_contact_profile` - Get profile for a WhatsApp number
- `check_whatsapp_number` - Check if numbers are registered on WhatsApp

### Groups (3)
- `list_groups` - List all WhatsApp groups for an instance
- `create_group` - Create a new group (subject, participants)
- `get_group_info` - Get information about a specific group

### Webhooks (2)
- `list_webhooks` - List webhooks for an instance
- `set_webhook` - Set/update a webhook (url, events, enabled)

## Setup

```bash
npm install
npm run build
```

## Usage

```json
{
  "mcpServers": {
    "evolution": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "EVOLUTION_URL": "https://evolution.example.com",
        "EVOLUTION_API_KEY": "your-api-key"
      }
    }
  }
}
```
