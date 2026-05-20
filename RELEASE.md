# Release Readiness

Agent-Tools owns tool adapters and execution interfaces.

## Boundary

A tool is the execution medium for demonstrating or delivering a skill. A tool is not the skill itself.

## Release Requirements

- Explicit tool adapter contracts
- Clear input/output schemas
- Runtime-agnostic interfaces
- No hidden cloud dependency
- Minimal dependency surface
- Airgap-compatible adapters where possible

## Primitive Rule

Tools must remain pluggable and replaceable.
