# Features

## Cloud-Hosted Runtime

HaeronClaw deploys to Azure Functions on Azure Container Apps. After deployment, the agent is available as:

- **HTTP API**: `POST /agent/chat` and `POST /agent/chatstream`
- **Chat UI**: built-in browser experience at the app root
- **MCP endpoint**: `/runtime/webhooks/mcp` for remote MCP clients

The same source code runs locally in VS Code Copilot Chat and in the cloud with no rewrite.

## Remote MCP Endpoint

The deployed app exposes an MCP server at `/runtime/webhooks/mcp`.

```json
{
  "inputs": [
    {
      "type": "promptString",
      "id": "functions-mcp-extension-system-key",
      "description": "Azure Functions MCP Extension System Key",
      "password": true
    },
    {
      "type": "promptString",
      "id": "functionapp-host",
      "description": "Container app host"
    }
  ],
  "servers": {
    "remote-mcp-function": {
      "type": "http",
      "url": "https://${input:functionapp-host}/runtime/webhooks/mcp",
      "headers": {
        "x-functions-key": "${input:functions-mcp-extension-system-key}"
      }
    }
  }
}
```

## Teams Integration

HaeronClaw integrates deeply with Microsoft Teams:

- Async execution for long-running jobs
- Proactive replies delivered back into the conversation
- Typing indicators while the agent is working
- Heartbeat-style progress updates
- Voice transcription for audio attachments through Azure Speech

## Artifact Delivery

Generated files such as PPTX, DOCX, XLSX, and PDF are automatically uploaded to Azure Blob Storage and exposed through application-owned download links. Users do not need to handle SAS tokens directly.

Binary email attachments can also be staged to Blob Storage and rewritten into clean download links when direct attachment delivery is not appropriate.

## M365 Workflows

The `m365_cli` tool provides Microsoft 365 operations from the runtime.

| Capability | Description |
| --- | --- |
| Email | Send and read email via Microsoft Graph |
| Calendar | Inspect calendar events |
| OneDrive | Browse and download files |
| SharePoint | Query sites and document libraries via OBO flow |

## Session Persistence

When running in Azure, agent sessions are automatically persisted to an Azure Files share mounted into the container app. Conversation state survives restarts and is shared across instances.

Locally, sessions are stored in `~/.copilot/session-state/`.

## Knowledge-Backed Responses

Storage-backed `work_memory/`, `index_memory/`, and Microsoft Learn sources can be combined for source-grounded answers. The agent retrieves from indexed content and can return citation-backed responses.
