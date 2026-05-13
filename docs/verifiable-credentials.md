# Verifiable Credentials for MCPHub

MCPHub can use Verifiable Credentials (VCs) to describe and prove trust-related metadata for MCP servers, maintainers, builds, and deployments.

A Verifiable Credential is a cryptographically verifiable statement made by an issuer about a subject. In this registry, the subject is usually an MCP server package, a published container image, or a deployment endpoint.

---

## Why use Verifiable Credentials?

Verifiable Credentials help MCP clients and operators answer questions such as:

- Who maintains this MCP server?
- Which organization issued or approved it?
- What version or container image does this credential apply to?
- Has the package passed review, security checks, or production-readiness checks?
- Which capabilities or scopes does the server claim to provide?

VCs do not replace source review, dependency scanning, or runtime sandboxing. They add a portable trust layer that can be checked before installing or running a server.

---

## Recommended credential subjects

Use one credential per trust boundary:

| Subject | Example identifier | Purpose |
|---|---|---|
| Package | `pkg:npm/@mcphub/n8n-mcp-server@1.0.0` | Prove package metadata, maintainer, and capability claims. |
| Container image | `docker:agentnxt/n8n-mcp-server:1.0.0` | Prove published image provenance and review status. |
| Deployment | `https://mcp.example.com/n8n` | Prove runtime endpoint ownership and approved environment. |
| Maintainer | `did:web:agennext.com` | Prove organization or maintainer identity. |

---

## Credential type

Recommended type name:

```json
[
  "VerifiableCredential",
  "MCPServerCredential"
]
```

Recommended schema fields:

```json
{
  "serverName": "n8n-mcp-server",
  "packageName": "@mcphub/n8n-mcp-server",
  "version": "1.0.0",
  "repository": "https://github.com/AGenNext/mcp-registry",
  "entrypoint": "packages/n8n-mcp-server/dist/index.js",
  "capabilities": ["workflow", "automation", "integration"],
  "reviewStatus": "approved",
  "securityReview": {
    "dependencyScan": "passed",
    "secretScan": "passed",
    "humanReview": "passed"
  }
}
```

---

## Example credential

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2"
  ],
  "type": [
    "VerifiableCredential",
    "MCPServerCredential"
  ],
  "issuer": "did:web:agennext.com",
  "validFrom": "2026-01-01T00:00:00Z",
  "credentialSubject": {
    "id": "pkg:npm/@mcphub/n8n-mcp-server@1.0.0",
    "serverName": "n8n-mcp-server",
    "packageName": "@mcphub/n8n-mcp-server",
    "version": "1.0.0",
    "repository": "https://github.com/AGenNext/mcp-registry",
    "entrypoint": "packages/n8n-mcp-server/dist/index.js",
    "capabilities": [
      "workflow",
      "automation",
      "integration"
    ],
    "reviewStatus": "approved",
    "securityReview": {
      "dependencyScan": "passed",
      "secretScan": "passed",
      "humanReview": "passed"
    }
  }
}
```

The credential above is an unsigned example. Production credentials must be signed by the issuer DID before they are trusted.

---

## Suggested file layout

Store issued credentials close to the server package they describe:

```text
packages/<server-name>/
  credentials/
    server.vc.json
    image.vc.json
    deployment.vc.json
```

For registry-wide credentials, use:

```text
credentials/
  registry.vc.json
  maintainers.vc.json
```

---

## Issuing flow

Recommended issuing flow:

1. Build the target server.
2. Run metadata validation and security checks.
3. Create the unsigned credential payload.
4. Sign the credential with the organization issuer DID.
5. Commit the signed credential to the package `credentials/` directory.
6. Publish the package or container image.
7. Verify the credential before runtime installation or deployment.

---

## Verification flow

Before trusting a server, a client or deployment pipeline should verify:

1. The credential signature is valid.
2. The issuer DID is trusted by the deployment policy.
3. The `credentialSubject.id` matches the package or image being installed.
4. The credential has not expired or been revoked.
5. The declared capabilities match the expected server behavior.
6. The review status is acceptable for the environment.

---

## Trust policy example

A production deployment may require:

```json
{
  "trustedIssuers": [
    "did:web:agennext.com"
  ],
  "requiredCredentialTypes": [
    "MCPServerCredential"
  ],
  "requiredReviewStatus": "approved",
  "requireHumanReview": true,
  "allowUnsignedCredentials": false
}
```

A development environment may allow unsigned credentials for testing, but production should not.

---

## Implementation notes

This repository does not currently enforce VC verification during `npm run build`. Treat the examples in this document as the recommended trust model and integration target.

Future implementation can add scripts such as:

```bash
npm run vc:issue --workspace=packages/<server-name>
npm run vc:verify --workspace=packages/<server-name>
npm run vc:verify:all
```

Do not add these commands until the corresponding scripts exist.
