# Argilla MCP Server

MCP server for the [Argilla](https://argilla.io/) data labeling platform API (v1).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ARGILLA_URL` | Yes | Base URL of your Argilla instance (e.g. `https://argilla.example.com`) |
| `ARGILLA_API_KEY` | Yes | Argilla API key for authentication |

## Tools (18)

### Workspaces
- **list_workspaces** - List all workspaces
- **create_workspace** - Create a new workspace
- **delete_workspace** - Delete a workspace by ID

### Datasets
- **list_datasets** - List all datasets
- **get_dataset** - Get a dataset by ID
- **create_dataset** - Create a new dataset with fields and questions
- **delete_dataset** - Delete a dataset by ID
- **publish_dataset** - Publish a dataset for annotation
- **list_dataset_fields** - List fields of a dataset
- **list_dataset_questions** - List questions of a dataset

### Records
- **list_records** - List records in a dataset (paginated)
- **get_record** - Get a single record by ID
- **create_records_bulk** - Create multiple records at once
- **update_record** - Update record fields/metadata
- **delete_records_bulk** - Delete multiple records at once
- **create_record_response** - Submit an annotation response

### Users
- **list_users** - List all users
- **get_current_user** - Get the authenticated user profile

## Usage

```json
{
  "mcpServers": {
    "argilla": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "ARGILLA_URL": "https://argilla.example.com",
        "ARGILLA_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```
