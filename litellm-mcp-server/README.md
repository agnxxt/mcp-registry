# LiteLLM MCP Server

MCP Server for LiteLLM proxy management.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LITELLM_URL` | Yes | LiteLLM proxy URL |
| `LITELLM_MASTER_KEY` | Yes | Master API key |

## Tools (20)

### Chat
- `litellm_chat_completion` - Create a chat completion

### Keys
- `litellm_generate_key` - Generate a new API key
- `litellm_delete_key` - Delete an API key
- `litellm_list_keys` - Get key info
- `litellm_update_key` - Update an API key

### Models
- `litellm_list_models` - List all models
- `litellm_get_model_info` - Get model details
- `litellm_add_model` - Add a model
- `litellm_delete_model` - Delete a model

### Teams
- `litellm_create_team` - Create a team
- `litellm_list_teams` - List teams
- `litellm_delete_team` - Delete a team
- `litellm_add_team_member` - Add team member

### Users
- `litellm_create_user` - Create a user
- `litellm_list_users` - List users
- `litellm_get_user` - Get user info

### Budgets
- `litellm_get_budget` - Get budget info
- `litellm_set_budget` - Create a budget
- `litellm_list_budgets` - List budgets

### Spend
- `litellm_spend_logs` - Get spend/usage logs

## Usage

```json
{
  "mcpServers": {
    "litellm": {
      "command": "node",
      "args": ["path/to/litellm-mcp-server/dist/index.js"],
      "env": {
        "LITELLM_URL": "http://localhost:4000",
        "LITELLM_MASTER_KEY": "sk-your-master-key"
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
