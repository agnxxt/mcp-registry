# @mcphub/marquez-mcp-server

MCP server for interacting with Marquez data lineage service via its REST API.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MARQUEZ_URL` | Yes | Marquez HTTP endpoint (e.g. `http://localhost:5000`) |
| `MARQUEZ_API_KEY` | No | API key for Bearer token authentication |

## Tools

### Namespaces
- **list_namespaces** - List all namespaces
- **get_namespace** - Get namespace details
- **create_namespace** - Create or update a namespace

### Sources
- **list_sources** - List all data sources
- **get_source** - Get source details
- **create_source** - Create or update a data source

### Datasets
- **list_datasets** - List datasets in a namespace
- **get_dataset** - Get dataset details

### Jobs
- **list_jobs** - List jobs in a namespace
- **get_job** - Get job details

### Runs
- **list_runs** - List runs for a job
- **get_run** - Get run details by ID
- **create_run** - Create a new run for a job

### Lineage
- **get_lineage** - Get lineage graph for a node

### Tags
- **list_tags** - List all tags
- **create_tag** - Create or update a tag

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
