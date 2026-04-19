# MLflow MCP Server

MCP server for the [MLflow](https://mlflow.org/) Tracking and Model Registry API.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MLFLOW_URL` | Yes | Base URL of your MLflow instance (e.g. `https://mlflow.example.com`) |
| `MLFLOW_TOKEN` | No | Bearer token for authentication |

## Tools (~20)

### Experiments
- `mlflow_search_experiments` - Search experiments with pagination
- `mlflow_get_experiment` - Get experiment by ID
- `mlflow_create_experiment` - Create a new experiment
- `mlflow_update_experiment` - Rename an experiment
- `mlflow_delete_experiment` - Delete an experiment

### Runs
- `mlflow_create_run` - Create a new run in an experiment
- `mlflow_get_run` - Get run details by ID
- `mlflow_update_run` - Update run status/end time
- `mlflow_delete_run` - Delete a run
- `mlflow_search_runs` - Search runs with filters and ordering
- `mlflow_log_metric` - Log a metric for a run
- `mlflow_log_param` - Log a parameter for a run
- `mlflow_log_batch` - Log a batch of metrics, params, and tags

### Models
- `mlflow_list_registered_models` - List registered models
- `mlflow_get_registered_model` - Get model details by name
- `mlflow_create_registered_model` - Register a new model
- `mlflow_list_model_versions` - Search model versions
- `mlflow_create_model_version` - Create a model version
- `mlflow_transition_model_version_stage` - Transition model version stage

### Artifacts
- `mlflow_list_artifacts` - List artifacts for a run

## Usage

```bash
MLFLOW_URL=https://your-mlflow.com MLFLOW_TOKEN=optional-token npx @mcphub/mlflow-mcp-server
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
