# Architecture

## Design Principle

HaeronClaw separates the **authoring surface** from the **hosting runtime**.

- `src/` is the agent itself: instructions, skills, MCP config, tools, and knowledge
- `infra/assets/` is the Azure-specific runtime that hosts that agent in the cloud

## Project Structure

```text
src/                          # Agent definition, skills, tools, and work memory
├── AGENTS.md                 # HaeronClaw instructions + optional function frontmatter
├── .github/skills/           # Markdown skills loaded by the runtime
├── .vscode/mcp.json          # MCP server configuration
├── tools/
│   ├── cost_estimator.py     # Pricing math helpers
│   ├── create_eml.py         # EML generation helper
│   ├── fetch_url.py          # URL ingestion helper
│   └── m365_cli.py           # Mail, calendar, OneDrive, SharePoint operations
├── work_memory/              # Domain knowledge and internal FAQ content
└── index_memory/             # Indexed content for retrieval workflows

infra/assets/                 # Azure Functions + Teams runtime implementation
├── function_app.py           # HTTP/function entrypoints
├── teams_bot.py              # Teams bot orchestration and proactive replies
├── file_upload.py            # Azure Blob upload and download-link pipeline
├── sharepoint_graph.py       # Graph-based SharePoint/OneDrive access
├── speech_service.py         # Azure Speech integration for audio transcription
├── scripts/                  # Install-time helpers for bundled runtime dependencies
└── vendor/m365-cli/          # Repository-owned overrides applied after npm install

teams-app/                    # Teams app manifests and sideload packages
```

## Three Surfaces

### Authoring surface

`AGENTS.md`, skills, MCP servers, Python tools, and work memory are authored in VS Code and tested locally with Copilot Chat.

### Delivery surface

The same agent is delivered through:

- HTTP API
- SSE streaming
- Browser Chat UI
- Teams bot
- MCP endpoint

### Deployment surface

`deploy.ps1` provisions ACR, ACA, Storage, and optionally Foundry resources. Infrastructure is defined under `infra/`.

## Bundled Dependency Patches

The repository patches selected `m365-cli` files used by the Azure runtime.

- Source-controlled overrides live under `infra/assets/vendor/m365-cli/`
- `apply-m365-cli-patches.mjs` copies them into `node_modules/` after install
- `infra/assets/package.json` applies the patch step through `postinstall`

## Known Limitations

- Python tools in `src/tools/` do not work locally; they are fully functional only after deploying to ACA
- Windows is not supported for packaging hooks; the shell scripts require macOS, Linux, or WSL
