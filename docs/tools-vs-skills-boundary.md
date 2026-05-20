# Agent-Tools boundary

Agent-Tools owns executable tool definitions and tool adapters for AGenNext.

## Decision

Agent-Tools is distinct from Agent-Skills.

- Agent-Skills describes reusable capabilities.
- Agent-Tools provides executable tools that implement or support those capabilities.

## Boundary

| Component | Responsibility |
|---|---|
| Agent-Tools | Executable tool definitions, tool adapters, tool schemas |
| Agent-Skills | Reusable capability descriptions and contracts |
| Agent-Team | Composes skills into full agent products |
| Agent-Runtime | Executes workflows and invokes tools through adapters |
| Agent-Secrets | Stores credentials required by tools |
| AgentKube | Kubernetes SDK operations used by tools |

## Agent-Tools owns

- tool definitions
- tool input/output schemas
- tool adapters
- tool discovery metadata
- tool permission metadata
- tool execution wrappers
- integration-specific tool clients

Agent-Tools does not own:

- high-level skill definitions
- full agent team composition
- runtime orchestration
- identity verification
- secret storage

## Cloud agent tools

Initial cloud-agent tool categories:

```txt
ssh.run_command
ssh.run_script
kubernetes.apply_manifest
kubernetes.get_pods
kubernetes.get_logs
kubernetes.wait_for_deployment
ovh.list_servers
ovh.reboot_server
ovh.enter_rescue_mode
surrealdb.query
surrealdb.write_memory
security.scan_manifest
```

## Relationship

```txt
Agent-Skills declare capabilities
  ↓
Agent-Tools provide executable implementations
  ↓
Agent-Runtime invokes tools during workflow execution
```

## Example

```txt
Skill: k3s.install
  uses tools:
    - ssh.run_script
    - kubernetes.get_nodes
    - kubernetes.wait_for_deployment
```
