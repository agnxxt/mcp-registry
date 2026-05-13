# MCP Registry

**The Skill Registry for MCP-compatible AI agents.**

MCP Registry is an open catalog of reusable skills that agents can discover, deploy, and compose through the Model Context Protocol. Each skill packages a focused capability, MCP tools, deployment metadata, and runtime instructions.

---

## Why Skill Registry?

Traditional MCP projects describe integrations as servers. MCP Registry organizes them as reusable **skills**:

| Traditional MCP View | Skill Registry View |
| --- | --- |
| MCP server | Skill package |
| Tool endpoint | Skill action |
| Server metadata | Skill manifest |
| Docker image | Skill runtime |
| Server list | Discoverable skill catalog |

---

## What is included

- 58+ MCP-compatible skills
- 1000+ tools across SaaS, developer tools, infrastructure, data, automation, and monitoring
- Docker-ready runtimes
- Workspace-based package structure
- Skill manifest schema and validation workflow

---

## Quick Start

```bash
git clone https://github.com/AGenNext/mcp-registry.git
cd mcp-registry
npm install
npm run check
```

Build every workspace:

```bash
npm run build
```

Build one skill:

```bash
npm run build --workspace=packages/<skill-name>
```

Run a built MCP skill:

```bash
node packages/<skill-name>/dist/index.js
```

---

## Docker

```bash
docker run -d \
  -e SERVICE_URL="https://your-service.com" \
  -e SERVICE_API_KEY="your-api-key" \
  agentnxt/<skill-name>
```

Published images are available on Docker Hub:

https://hub.docker.com/u/agentnxt

---

## Skill Manifest

Each skill should include a `skill.json` manifest:

```json
{
  "name": "github-repo-search",
  "title": "GitHub Repository Search",
  "description": "Search repositories, issues, and pull requests.",
  "category": "development",
  "docker_image": "agentnxt/github-mcp-server",
  "tools": ["search_repositories", "list_issues"],
  "auth": ["github_token"],
  "tags": ["github", "code", "search"]
}
```

---

## Recommended Skill Layout

```text
packages/<skill-name>/
  skill.json
  README.md
  Dockerfile
  src/
    index.ts
    tools/
    api/
  package.json
  tsconfig.json
```

---

## Validate the Registry

```bash
npm run validate
```

The validator checks for required skill packaging files where applicable.

---

## Claude Desktop Configuration

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-registry/packages/filesystem-mcp-server/dist/index.js"],
      "env": {
        "ALLOWED_DIRECTORIES": "/data"
      }
    }
  }
}
```

Use absolute paths so your MCP client can find the runtime reliably.

---

## Contributing

Contributions are welcome. Please read `CONTRIBUTING.md` before opening a pull request.

---

## Security

Please report vulnerabilities privately using the instructions in `SECURITY.md`.

---

## Website

The marketing site lives in `website/` and can be deployed with GitHub Pages.

---

Copyright 2026 AgentNxt. An Autonomyx Platform.
