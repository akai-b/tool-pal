# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language / 语言要求

**IMPORTANT: Always communicate, explain, and output content in Chinese (zh-CN).**
**重要：请始终使用中文（zh-CN）与我对话，任何解释、回答和输出的内容都必须使用中文。**

## Commands

All commands run from the repo root with `pnpm`.

### Dev (browser/Vite only)
```bash
pnpm dev:all-in-one         # all-in-one app on :5173
pnpm dev:image              # standalone image tool (compress + convert + GIF maker) on :5174
pnpm dev:font-compress      # standalone font compress
```

### Dev (full Electron desktop)
```bash
pnpm electron:all-in-one
pnpm electron:image
pnpm electron:font-compress
```

### Build / Type-check / Lint
```bash
pnpm build       # turbo build — all packages in dependency order
pnpm typecheck   # turbo typecheck — tsc --noEmit across all workspaces
pnpm lint        # turbo lint — declared but no linter config exists yet
```

### Per-workspace commands
```bash
pnpm --filter @pal/tool-image build
pnpm --filter app-all-in-one dev
```

No test suite is configured.

## Architecture

**pnpm workspace monorepo** orchestrated by **Turborepo**.

```
apps/          # Electron + Vite containers
  app-all-in-one/         # Sidebar nav aggregating all tools (primary distributable)
  app-image/              # Standalone image tool: tab nav for compress + convert + GIF maker
  app-font-compress/

packages/      # Shared libraries and business logic
  ui/            # @pal/ui       — shared React components (Button, DropZone, FileList, ProgressBar, ToolLayout)
  utils/         # @pal/utils    — pure utilities (nanoid, formatBytes, readFileAsArrayBuffer, downloadBytes, …)
  ipc-types/     # @pal/ipc-types — Electron IPC channel constants and request/response types
  tool-image/    # @pal/tool-image — image compress (src/compress/) + convert (src/convert/) (complete)
  tool-font-compress/   # @pal/tool-font-compress  — PLACEHOLDER, needs WASM font subsetting library
  tool-gif-maker/       # @pal/tool-gif-maker      — PLACEHOLDER, needs gif.js or gifenc
```

**Dependency flow:** `apps` → `@pal/tool-*` → `@pal/ui` + `@pal/utils` + `@pal/ipc-types`

**Packages export TypeScript source directly** (`main: ./src/index.ts`) — no per-package build step. Vite in each consuming app handles transpilation. Path aliases for all `@pal/*` packages are declared in the root `tsconfig.json` and repeated in each app's `vite.config.ts`.

**UnoCSS** via `unocss/vite` plugin — configuration in root `uno.config.ts`.

## Electron IPC

Each app's Electron entry (`electron/main.js`, CommonJS) registers handlers for `fs:readFile`, `fs:writeFile`, `fs:showSaveDialog`, `fs:showOpenDialog`, `app:version`, `app:platform`.

The preload script exposes a single bridge: `window.api.invoke(channel, req)` via `contextBridge`.

`@pal/ipc-types` defines the `IPC_CHANNELS` constant object and typed request/response interfaces. Use these types when adding new IPC channels to keep renderer and main process in sync.
