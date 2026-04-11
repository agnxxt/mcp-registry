# MCP Server Marketplace

Community-contributed MCP servers. Anyone can publish their MCP server here via pull request.

## How to Submit

1. **Fork** this repo
2. **Create** your server directory: `marketplace/{your-name}/{server-name}/`
3. **Include** the required files (see below)
4. **Open a PR** using the MCP Server Submission template

## Required Files

```
marketplace/{your-name}/{server-name}/
  README.md        # Description, tools list, env vars, usage example
  package.json     # Name, version, dependencies
  tsconfig.json    # TypeScript config
  src/
    index.ts       # Entry point
    client.ts      # API client
    types.ts       # TypeScript interfaces
    tools/         # Tool definitions (one file per category)
```

## README Requirements

Your `README.md` must include:

- **Description** — what your server does
- **Environment Variables** — table with name, required/optional, description
- **Tools** — list of all tools with descriptions
- **Usage** — JSON config snippet for Claude Desktop / MCP client
- **Author** — your name/org and link
- **License** — must be open source (MIT, Apache-2.0, etc.)

## Package Naming

- Directory: `marketplace/{your-name}/{server-name}-mcp-server/`
- Package name in `package.json`: `@mcpmarket/{server-name}-mcp-server`

## Submission Checklist

- [ ] Server builds cleanly (`npm run build`)
- [ ] README includes all required sections
- [ ] No hardcoded secrets or API keys
- [ ] No `node_modules/` or `dist/` committed
- [ ] License file included
- [ ] NOTICE file if using third-party code

## Review Process

1. Submit PR with your server
2. Automated checks verify build and structure
3. **AgentNxt team** reviews for quality and security
4. Once approved, your server is listed in the marketplace

**Reviewers:** [@agentnxt/maintainers](https://github.com/orgs/agentnxt/teams/maintainers)

PRs that modify anything outside `marketplace/{your-name}/` will be rejected.

## Example Structure

```
marketplace/
  acme-corp/
    weather-mcp-server/
      README.md
      LICENSE
      package.json
      tsconfig.json
      src/
        index.ts
        client.ts
        types.ts
        tools/
          weather.ts
```

## Repo Structure — Author is the Distinction

```
agentnxt/mcpservers
  packages/              ← AgentNxt first-party servers (@mcphub/)
    lago-mcp-server/
    ghost-mcp-server/
    ...
  marketplace/           ← Community servers, organized by author
    acme-corp/
      weather-mcp-server/
    jane-doe/
      analytics-mcp-server/
```

| | `packages/` | `marketplace/{author}/` |
|---|---|---|
| **Author** | AgentNxt | Community (you!) |
| **Namespace** | `@mcphub/` | `@mcpmarket/` |
| **Support** | Official | Author-provided |
| **Review** | Internal | PR review |

The author directory is your identity in the marketplace. Use your GitHub username, org name, or brand.
