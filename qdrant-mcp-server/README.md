# @mcphub/qdrant-mcp-server

MCP server for interacting with Qdrant vector database via its REST API.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `QDRANT_URL` | Yes | Qdrant HTTP endpoint (e.g. `http://localhost:6333`) |
| `QDRANT_API_KEY` | No | API key for authentication |

## Tools

### Collections
- **list_collections** - List all collections
- **get_collection** - Get collection details
- **create_collection** - Create a collection with vector config
- **delete_collection** - Delete a collection
- **create_index** - Create a payload field index
- **delete_index** - Delete a payload field index

### Points
- **upsert_points** - Upsert vectors with payloads
- **get_points** - Get points by IDs
- **delete_points** - Delete points by IDs or filter
- **scroll_points** - Scroll through points with filtering
- **count_points** - Count points with optional filter

### Search
- **search_points** - Vector similarity search
- **recommend_points** - Recommendation based on examples
- **search_batch** - Batch multiple searches

### Snapshots
- **list_snapshots** - List collection snapshots
- **create_snapshot** - Create a snapshot
- **delete_snapshot** - Delete a snapshot

### Cluster
- **cluster_info** - Get cluster info
- **collection_cluster_info** - Get collection cluster info
- **list_aliases** - List all aliases
- **create_alias** - Create a collection alias

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
