# @mcphub/surrealdb-mcp-server

MCP server for interacting with SurrealDB via its HTTP REST API.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SURREALDB_URL` | Yes | SurrealDB HTTP endpoint (e.g. `http://localhost:8000`) |
| `SURREALDB_USER` | Yes | Username for Basic auth |
| `SURREALDB_PASS` | Yes | Password for Basic auth |
| `SURREALDB_NS` | Yes | Namespace to use |
| `SURREALDB_DB` | Yes | Database to use |

## Tools

### Query
- **query** - Execute a raw SurrealQL query

### Records
- **list_records** - List all records in a table
- **get_record** - Get a specific record by table and ID
- **create_record** - Create a new record in a table
- **update_record** - Replace a record entirely
- **patch_record** - Partially update a record
- **delete_record** - Delete a record

### Admin
- **import_data** - Import SurrealQL data
- **export_data** - Export all data as SurrealQL
- **health** - Check instance health
- **version** - Get instance version
- **signin** - Sign in with credentials

## Usage

```bash
npm install
npm run build
npm start
```

## Development

```bash
npm run dev
```
