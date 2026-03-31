# API Reference

## Overview

Once deployed, HaeronClaw exposes two HTTP chat endpoints, an MCP server endpoint, and a built-in browser Chat UI. All chat endpoints accept JSON requests and GitHub OAuth tokens for authentication.

## Getting the Base URL

After deployment, get the container app hostname using the Azure CLI:

```bash
APP_NAME=<container-app-name>
RG=<resource-group>
HOST=$(az containerapp show --name "$APP_NAME" --resource-group "$RG" \
  --query properties.configuration.ingress.fqdn -o tsv)
echo "https://$HOST"
```

Use that value as the base URL for all API calls.

## Authentication

All chat endpoints require a GitHub OAuth token. Pass it in both headers:

```http
Authorization: Bearer <gho_or_ghu_token>
x-github-token: <gho_or_ghu_token>
```

::: tip
In secure environments, prefer per-user OAuth tokens over shared service tokens.
:::

## `POST /agent/chat`

Standard JSON request-response endpoint for agent chat.

### Request

```bash
curl -X POST "https://<host>/agent/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <gho_or_ghu_token>" \
  -H "x-github-token: <gho_or_ghu_token>" \
  -d '{"prompt": "What is the price of a Standard_D4s_v5 VM in East US?"}'
```

### Response

```json
{
  "session_id": "abc123-def456-...",
  "response": "The agent's final response text",
  "response_intermediate": "Any intermediate responses",
  "tool_calls": ["list of tools invoked during the response"]
}
```

The response always includes a `session_id`, also returned via the `x-ms-session-id` response header.

## Multi-Turn Conversations

To resume an existing session, pass the session ID in the `x-ms-session-id` request header:

```bash
curl -X POST "https://<host>/agent/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <gho_or_ghu_token>" \
  -H "x-github-token: <gho_or_ghu_token>" \
  -H "x-ms-session-id: abc123-def456-..." \
  -d '{"prompt": "If I run that VM 24/7 for a month, what would it cost?"}'
```

If you omit `x-ms-session-id`, a new session is created automatically.

## `POST /agent/chatstream`

Use `POST /agent/chatstream` to receive responses incrementally as Server-Sent Events.

### Request

```bash
curl -N -X POST "https://<host>/agent/chatstream" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <gho_or_ghu_token>" \
  -H "x-github-token: <gho_or_ghu_token>" \
  -d '{"prompt": "Give me a quick summary of Azure Functions pricing."}'
```

## SSE Event Types

| Event Type | Description |
| --- | --- |
| `session` | Contains the `session_id` for the conversation |
| `delta` | Incremental text chunks |
| `intermediate` | Intermediate reasoning or response snippets |
| `tool_start` | Tool invocation started |
| `tool_end` | Tool invocation completed |
| `message` | Final full response text |
| `done` | Stream completion signal |

### Example SSE sequence

```text
data: {"type":"session","session_id":"..."}

data: {"type":"delta","content":"Hello"}

data: {"type":"tool_start","tool_name":"bash","tool_call_id":"..."}

data: {"type":"tool_end","tool_name":"bash","tool_call_id":"..."}

data: {"type":"message","content":"Hello...final"}

data: {"type":"done"}
```

## MCP Server Endpoint

The deployed app also exposes an MCP endpoint:

```text
https://<host>/runtime/webhooks/mcp
```

If your environment enables function keys for the MCP extension endpoint, pass the key in the `x-functions-key` header.

### VS Code `mcp.json` example

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
      "description": "Container app host, e.g. fmaaca-xxxx.<env>.<region>.azurecontainerapps.io"
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

## Chat UI

After deployment, open the app root URL:

```text
https://<host>/
```

At first load, enter:

- Base URL, usually your ACA app URL
- GitHub OAuth token, usually a `gho_` or `ghu_` token

The base URL is stored in local storage. The GitHub token is stored in session storage only.

### URL hash prefill

```text
https://<host>/#baseUrl=https%3A%2F%2F<host>&token=<url-encoded-token>
```

On load, the page reads these values, stores them, and removes the hash from the address bar.
