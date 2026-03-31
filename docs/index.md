---
layout: home

hero:
  name: HaeronClaw
  text: Hosted agent runtime on Azure Functions
  tagline: A cloud-hosted markdown agent for Microsoft and Azure workflows, with Teams delivery, enterprise integrations, and artifact generation.
  actions:
    - theme: brand
      text: Quickstart
      link: /quickstart
    - theme: alt
      text: GitHub
      link: https://github.com/haxudev/haeronclaw

features:
  - title: Cloud-hosted runtime
    details: Deploy the same agent you author in VS Code to Azure Functions on Azure Container Apps, with HTTP chat, streaming, and built-in web UI.
  - title: MCP and API ready
    details: Expose both /runtime/webhooks/mcp and chat endpoints for remote MCP clients, browser access, and service-to-service integration.
  - title: Enterprise workflows
    details: Connect email, calendar, SharePoint, OneDrive, Teams, Azure Speech, and storage-backed knowledge in one runtime.
  - title: Artifact delivery
    details: Generate decks, spreadsheets, PDFs, and other files, then deliver them through Blob-backed application-owned links.
---

## Product Overview

HaeronClaw is a branded, cloud-hosted markdown agent built for Microsoft and Azure workflows. The overall implementation approach is derived from [Azure-Samples/functions-markdown-agent](https://github.com/Azure-Samples/functions-markdown-agent), then extended with Azure hosting, Teams delivery, enterprise integrations, and artifact handling so the same agent can run beyond local Copilot Chat.

HaeronClaw is positioned as a team-level or department-level agent. It can use storage-backed `index_memory/` and `work_memory/` to build shared knowledge for a team, business unit, or domain workflow instead of relying only on per-user chat context.

::: tip Why this project exists
You author the agent as markdown, skills, MCP config, and tools under `src/`, but run it as a real cloud service with APIs, Teams, and storage-backed session state.
:::

## Core Capabilities

- Deploy HaeronClaw to Azure Functions on Azure Container Apps
- Choose from GitHub models or Microsoft Foundry models to power the runtime
- Built-in HTTP APIs for agent chat: `POST /agent/chat`, `POST /agent/chatstream`
- Built-in MCP server endpoint for remote MCP clients: `/runtime/webhooks/mcp`
- Built-in browser chat UI for direct access
- Persistent multi-turn session state in Azure-hosted storage
- Timer-triggered scheduled runs from `AGENTS.md` frontmatter
- Custom Python tools loaded from `src/tools/`

## Advanced Features Added in This Project

- Azure Blob artifact delivery for generated files without SAS token handling
- Email workflows with Microsoft 365 through `m365_cli`
- Blob-backed rewriting of binary email attachments into clean download links
- Teams async execution with proactive replies, typing indicators, and heartbeat progress
- Voice transcription for Teams audio attachments through Azure Speech
- SharePoint and OneDrive ingestion through Graph OBO flows
- Document generation for PPTX, DOCX, XLSX, PDF, and more
- Knowledge-backed responses from `work_memory/`, `index_memory/`, and Microsoft Learn

## Development Workflow

1. Define and test your agent in VS Code as a standard Copilot project.
2. Deploy the same project to Azure Functions on Azure Container Apps.
3. Use it as a cloud-hosted HTTP API, MCP endpoint, chat UI, or Teams bot.

## Model Support

| Category | Prefix | Examples |
| --- | --- | --- |
| GitHub Models | `github:` | `github:gpt-5.4`, `github:claude-sonnet-4.6` |
| Foundry Models | `foundry:` | `foundry:gpt-4.1-mini`, `foundry:o4-mini` |

## Next Steps

- Start with [Quickstart](/quickstart)
- Review [Features](/features)
- Integrate against the [API Reference](/api)
- Understand the [Architecture](/architecture)
