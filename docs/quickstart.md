# Quickstart

## Running Locally in VS Code

The fastest way to interact with HaeronClaw is to run it locally in VS Code as a standard Copilot project.

1. Open the `src` folder in VS Code.
2. Enable the experimental setting `chat.useAgentSkills`.
3. Enable built-in tools in Copilot Chat.
4. Start chatting with your agent in Copilot Chat.

::: info
`AGENTS.md` instructions, `.github/skills/` skills, and `.vscode/mcp.json` MCP servers are loaded automatically. Python tools in `src/tools/` require cloud deployment.
:::

## Deploying to Azure Functions on ACA

This project deploys to **Azure Functions on Azure Container Apps**.

Use the unified deployment entry point:

```powershell
./scripts/deploy.ps1 -Mode aca -ResourceGroup <rg-name> -Location eastus2 -Prefix fmaaca -Model github:gpt-5.4 -ImageTag v3
```

Within minutes you'll have a deployed agent behind an HTTP API and a built-in chat UI.

### Main deployment inputs

| Parameter | Description |
| --- | --- |
| `-ResourceGroup` | Target Azure resource group |
| `-Location` | Azure region for deployment |
| `-Prefix` | Naming prefix for resources |
| `-Model` | Runtime model such as `github:gpt-5.4` |
| `-ImageTag` | Container image tag |

## Authentication for GitHub Models

When using `github:` models, the project supports two auth modes:

- Recommended: pass a per-user GitHub OAuth token (`gho_` / `ghu_`) on each request via `x-github-token`
- Backward compatibility: provide `GITHUB_TOKEN` during deployment to use a shared service token

## Model Configuration

The runtime uses a single environment variable: `COPILOT_MODEL`.

- Use full GitHub model IDs like `github:gpt-5.4`
- Use full Foundry model IDs like `foundry:gpt-5.2-codex`
- Avoid alias variables like `GHCP_MODEL_NAME`

### Model categories

| Category | Prefix | Infrastructure | Examples |
| --- | --- | --- | --- |
| GitHub Models | `github:` | None, uses GitHub API | `github:gpt-5.4`, `github:claude-sonnet-4.6` |
| Foundry Models | `foundry:` | Deploys Foundry resources in your subscription | `foundry:gpt-4.1-mini`, `foundry:o4-mini` |

## Session Persistence

When running in Azure, agent sessions are automatically persisted to an Azure Files share mounted into the container app runtime. Conversation state survives restarts and is shared across instances.

Locally, sessions are stored in `~/.copilot/session-state/`.

## Timer Triggers from `AGENTS.md`

You can define scheduled agent runs directly in `src/AGENTS.md` frontmatter:

```yaml
---
functions:
  - name: timerAgent
    trigger: timer
    schedule: "0 */2 * * * *"
    prompt: "What's the price of a Standard_D4s_v5 VM in East US?"
    logger: true
---
```

::: warning
Only `trigger: timer` is supported right now. Other trigger types are rejected at startup.
:::

## Building Custom Python Tools

Add custom tools by dropping plain Python files into `src/tools/`.

```python
from pydantic import BaseModel, Field


class CostEstimatorParams(BaseModel):
    unit_price: float = Field(description="Retail price per unit")
    unit_of_measure: str = Field(description="Unit of measure, e.g. '1 Hour'")
    quantity: float = Field(description="Monthly quantity")


async def cost_estimator(params: CostEstimatorParams) -> str:
    """Estimate monthly and annual costs from unit price and usage."""
    monthly_cost = params.unit_price * params.quantity
    annual_cost = monthly_cost * 12
    return f"Monthly: ${monthly_cost:.4f} | Annual: ${annual_cost:.4f}"
```

Tool discovery rules:

- The runtime scans `tools/*.py`
- It loads module-level functions and excludes names starting with `_`
- The function docstring becomes the tool description
- One function is registered per file
- Failed tool imports are logged and skipped
