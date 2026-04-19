# @mcphub/nocodb-mcp-server

MCP server for the NocoDB API. Provides 33 tools for managing bases, tables, records, fields, views, filters, sorts, and webhooks.

## Setup

```bash
npm install
npm run build
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NOCODB_URL` | Yes | NocoDB instance URL (e.g. `https://nocodb.example.com`) |
| `NOCODB_API_TOKEN` | Yes | NocoDB API token |

## MCP Configuration

```json
{
  "mcpServers": {
    "nocodb": {
      "command": "node",
      "args": ["path/to/nocodb-mcp-server/dist/index.js"],
      "env": {
        "NOCODB_URL": "https://nocodb.example.com",
        "NOCODB_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

## Tools (33 total)

### Records (6)
- `list_records` - List records with filtering, sorting, pagination
- `get_record` - Get a single record by ID
- `create_record` - Create a new record
- `update_record` - Update an existing record
- `delete_record` - Delete a record
- `bulk_create_records` - Create multiple records at once

### Tables (5)
- `list_tables` - List all tables in a base
- `get_table` - Get table details with columns
- `create_table` - Create a new table with columns
- `update_table` - Update table metadata
- `delete_table` - Delete a table

### Bases (4)
- `list_bases` - List all bases/projects
- `get_base` - Get base details
- `create_base` - Create a new base
- `delete_base` - Delete a base

### Fields (4)
- `list_fields` - List all columns of a table
- `get_field` - Get column details
- `create_field` - Create a new column
- `delete_field` - Delete a column

### Views (5)
- `list_views` - List all views for a table
- `create_grid_view` - Create a grid view
- `create_form_view` - Create a form view
- `create_gallery_view` - Create a gallery view
- `delete_view` - Delete a view

### Filters (3)
- `list_filters` - List filters on a view
- `create_filter` - Add a filter to a view
- `delete_filter` - Remove a filter

### Sorts (3)
- `list_sorts` - List sorts on a view
- `create_sort` - Add a sort to a view
- `delete_sort` - Remove a sort

### Webhooks (3)
- `list_webhooks` - List webhooks on a table
- `create_webhook` - Create a webhook
- `delete_webhook` - Delete a webhook

## API Reference

All tools use NocoDB API v2 (`/api/v2`). Authentication is via `xc-token` header with the provided API token.
