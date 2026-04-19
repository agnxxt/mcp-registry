# @mcphub/erpnext-mcp-server

MCP (Model Context Protocol) server for ERPNext/Frappe REST API. Provides 27 tools covering documents, methods, reports, workflows, metadata, and file management.

## Setup

```bash
npm install
npm run build
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ERPNEXT_URL` | Yes | Base URL of your ERPNext instance (e.g. `https://your-site.erpnext.com`) |
| `ERPNEXT_API_KEY` | Yes | API key from ERPNext user settings |
| `ERPNEXT_API_SECRET` | Yes | API secret from ERPNext user settings |

## Running

```bash
ERPNEXT_URL=https://your-site.erpnext.com \
ERPNEXT_API_KEY=your-api-key \
ERPNEXT_API_SECRET=your-api-secret \
npm start
```

For development:

```bash
ERPNEXT_URL=https://your-site.erpnext.com \
ERPNEXT_API_KEY=your-api-key \
ERPNEXT_API_SECRET=your-api-secret \
npm run dev
```

## MCP Client Configuration

Add to your MCP client config (e.g. Claude Desktop `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "erpnext": {
      "command": "node",
      "args": ["/path/to/erpnext-mcp-server/dist/index.js"],
      "env": {
        "ERPNEXT_URL": "https://your-site.erpnext.com",
        "ERPNEXT_API_KEY": "your-api-key",
        "ERPNEXT_API_SECRET": "your-api-secret"
      }
    }
  }
}
```

## Tools (27 total)

### Documents (8 tools)
- **list_documents** - List documents of a DocType with filters, fields, ordering, pagination
- **get_document** - Get a single document by DocType and name
- **create_document** - Create a new document
- **update_document** - Update an existing document
- **delete_document** - Delete a document
- **get_count** - Get document count with optional filters
- **get_list** - Advanced list query via `frappe.client.get_list`
- **run_doc_method** - Run a whitelisted method on a document

### Methods (5 tools)
- **call_method** - Call any whitelisted Frappe method via GET
- **post_method** - Call any whitelisted Frappe method via POST
- **get_api_info** - Get API metadata for a DocType
- **search_link** - Autocomplete search for link field values
- **get_value** - Get specific field values from a document

### Reports (3 tools)
- **run_report** - Run a Query Report and return data
- **get_report_list** - List available reports
- **export_report** - Export a report as Excel or CSV

### Workflows (4 tools)
- **get_workflow** - Get a Workflow definition
- **apply_workflow_action** - Apply a workflow transition to a document
- **get_transitions** - Get available transitions for a document
- **list_workflow_actions** - List pending Workflow Action items

### Metadata (4 tools)
- **get_doctype_meta** - Get full metadata for a DocType
- **get_doctype_list** - List available DocTypes
- **get_print_format** - Download a document as PDF
- **get_report_builder** - Query data via Report Builder / reportview API

### Files (3 tools)
- **upload_file** - Upload a file (base64 or URL)
- **list_files** - List files with filters
- **get_file** - Get file metadata

## Authentication

Uses ERPNext token-based authentication via the `Authorization: token api_key:api_secret` header. Generate API keys from ERPNext > User Settings > API Access.

## API Reference

All tools map to the ERPNext/Frappe REST API:
- Document CRUD: `/api/resource/{doctype}[/{name}]`
- Methods: `/api/method/{dotted.path}`
- Reports: `/api/method/frappe.desk.query_report.run`
- Workflows: `/api/method/frappe.model.workflow.*`
