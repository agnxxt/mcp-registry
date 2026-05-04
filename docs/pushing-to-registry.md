# How to Push to the MCP Registry

This guide explains how to add or update an MCP server package in `AGenNext/mcp-registry` and submit it for review.

## Overview

The registry stores MCP server packages primarily under the `packages/` directory. Each new server should include a `package.json` file, an `mcp-server.json` manifest for machine-readable metadata, and setup documentation.

Use this workflow when you want to:

- add a new MCP server to the registry
- update an existing registered MCP server
- publish a new server version
- fix metadata, docs, examples, tools, Docker configuration, or packaging issues

## Prerequisites

Before pushing to the registry, make sure you have:

- access to the `AGenNext/mcp-registry` GitHub repository
- Git installed locally
- Node.js and npm installed if the server uses the workspace toolchain
- a tested MCP server package ready to add under `packages/`
- permission to publish any source code, tool definitions, assets, or third-party materials included in the package

## Recommended server package layout

```text
packages/
└── your-server-name/
    ├── mcp-server.json
    ├── README.md
    ├── package.json
    ├── Dockerfile             # recommended if published as a container
    ├── src/
    │   ├── index.ts
    │   ├── tools/
    │   └── api/
    ├── examples/              # optional
    └── CHANGELOG.md           # recommended for versioned changes
```

At minimum, new packages should include `package.json`, `mcp-server.json`, and a README or equivalent setup documentation.

## MCP server documentation checklist

Each server should answer these questions:

- What service, system, or data source does the MCP server expose?
- What MCP transports does it support?
- What tools, resources, or prompts does it provide?
- What inputs do its tools expect?
- What outputs do its tools return?
- What APIs, databases, filesystems, cloud services, or local services does it require?
- What environment variables or secrets are required?
- Does it read files, write files, run shell commands, browse, or call external services?
- What are its known limitations?
- How should users report issues or request improvements?

## Step 1: Clone the registry

```bash
git clone https://github.com/AGenNext/mcp-registry.git
cd mcp-registry
```

If you already have a local copy, update it first:

```bash
git checkout main
git pull origin main
```

## Step 2: Create a working branch

```bash
git checkout -b add-your-server-name
```

Examples:

```bash
git checkout -b add-linear-mcp-server
git checkout -b update-filesystem-manifest
git checkout -b fix-n8n-server-docs
```

## Step 3: Add or update the package

For a new server:

```bash
mkdir -p packages/your-server-name
```

Copy your MCP server files into that folder.

Do not commit files such as:

```text
.env
.env.local
node_modules/
dist/
build/
coverage/
*.log
.DS_Store
```

If the server is distributed through Docker, keep the source, Dockerfile, and manifest in the registry. Do not commit large generated artifacts that can be rebuilt.

## Step 4: Add `mcp-server.json`

Create a manifest at:

```text
packages/your-server-name/mcp-server.json
```

See [`docs/mcp-server-manifest.md`](mcp-server-manifest.md) for the schema and examples.

## Step 5: Validate locally

Run registry validation:

```bash
npm run validate:registry
```

For strict validation across all server folders:

```bash
npm run validate:registry -- --strict
```

If the server has its own tests or build steps, run those too:

```bash
npm run build --workspace=packages/your-server-name
npm test --workspace=packages/your-server-name --if-present
```

## Step 6: Rebuild the registry index

```bash
npm run build:index
```

This regenerates:

```text
registry.json
```

Commit `registry.json` with the server changes.

## Step 7: Review the diff

```bash
git status
git diff
```

Confirm that the diff includes only intentional source, docs, metadata, and index changes.

## Step 8: Commit the change

```bash
git add packages/your-server-name registry.json
git commit -m "registry: add your-server-name"
```

For updates:

```bash
git commit -m "registry: update filesystem manifest"
git commit -m "docs: improve n8n server setup guide"
```

## Step 9: Push and open a pull request

```bash
git push origin add-your-server-name
```

Your PR description should include:

- server name
- summary of what changed
- whether this is a new server or an update
- validation commands you ran
- supported transports
- exposed tools/resources/prompts
- required secrets, APIs, databases, services, or local mounts
- security notes for external content, files, shell commands, browser use, network access, or customer data
- examples or screenshots if useful

## Maintainer direct-push workflow

Maintainers with write access may push directly to `main` for small documentation or metadata fixes.

Use pull requests for new servers, large updates, security-sensitive changes, or changes that affect runtime behavior.

## Security checklist

Before pushing, confirm that:

- no API keys, tokens, cookies, private keys, or credentials are committed
- `.env` files are excluded or replaced with `.env.example`
- network, filesystem, shell, and browser access are disclosed in `mcp-server.json`
- tools that mutate data are clearly documented
- customer-data access is documented in `security.dataAccessNotes`
- third-party assets and dependencies are allowed to be redistributed
- generated files and local caches are excluded unless intentionally published

Search for accidental secrets:

```bash
grep -R "API_KEY\|SECRET\|TOKEN\|PASSWORD\|PRIVATE KEY" packages/your-server-name || true
```

## Troubleshooting

### Push rejected because branch is behind

```bash
git fetch origin
git rebase origin/main
git push --force-with-lease
```

### Wrong files were committed

```bash
git rm --cached path/to/file
git commit --amend
git push --force-with-lease
```

### Secret was committed

Rotate the secret immediately. Do not simply delete it in a later commit. Ask a maintainer to remove it from Git history if needed.

### Package is too large

Remove generated outputs, caches, dependency folders, large binaries, and packaged artifacts that can be rebuilt from source.

## Final pre-push checklist

- [ ] Server lives under `packages/<server-id>/`
- [ ] `package.json` is present
- [ ] `mcp-server.json` is present
- [ ] README or setup docs are present
- [ ] Runtime, transport, and dependencies are documented
- [ ] Tools/resources/prompts are documented
- [ ] Required environment variables are documented by name only
- [ ] Permissions are accurate
- [ ] Local validation passed
- [ ] `registry.json` was regenerated
- [ ] No secrets are included
- [ ] PR description includes validation and security notes
