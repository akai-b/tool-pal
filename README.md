# Tool Pal

Tool Pal 是一个基于 `pnpm` workspace 和 `Turborepo` 构建的跨平台 Monorepo 桌面端工具箱，集成了多种实用的开发者工具，如图像压缩、格式转换、字体压缩以及 GIF 制作。

## ✨ 核心技术栈

- **前端框架**: [React 19](https://react.dev/) + TypeScript
- **构建生态**: [Vite 6](https://vitejs.dev/) + [Turborepo](https://turbo.build/)
- **桌面端**: [Electron 34](https://www.electronjs.org/)
- **样式与 UI 组件**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **包管理**: [pnpm](https://pnpm.io/) (要求 >=9.0.0)

## 📁 目录结构

项目架构采用了工具包与运行时解耦的设计。具体的业务逻辑被抽离为独立的 package，而 App 仅充当运行这些工具的 Electron/Vite 容器，支持单个工具单独打包或组合发布。

### Apps (客户端容器)

基于 Vite 和 Electron 运行环境，可以直接作为桌面应用构建发布。

- `app-all-in-one`: 聚合了所有工具的综合客户端
- `app-image-compress`: 图像压缩独立客户端
- `app-image-convert`: 图像格式转换独立客户端
- `app-font-compress`: 字体压缩独立客户端
- `app-gif-maker`: GIF 制作独立客户端

### Packages (共享包与业务模块)

- **UI 与工具**
  - `@pal/ui`: 基于 **shadcn/ui** 构建的共享 React 组件库。
  - `@pal/utils`: 共享的纯业务/通用工具函数集合。
  - `@pal/ipc-types`: 统一管理的 Electron IPC (进程间通信) TypeScript 类型定义，保障主进程与渲染进程通信的类型安全。
- **业务组件 (Tools)**
  - `@pal/tool-image-compress`: 图像压缩业务模块
  - `@pal/tool-image-convert`: 图像转换业务模块
  - `@pal/tool-font-compress`: 字体压缩业务模块
  - `@pal/tool-gif-maker`: GIF 制作业务模块

## 🚀 快速开始

### 安装依赖

```bash
# Node.js 需 >= 20.0.0
pnpm install
```

### 开发环境调试

根目录的 `package.json` 提供了便捷的启动命令，通过 Turborepo 可极速启动：

**Web 浏览器模式开发**

- 运行聚合应用: `pnpm dev:all-in-one`
- 运行图像压缩: `pnpm dev:image-compress`
- 运行图像转换: `pnpm dev:image-convert`
- 运行字体压缩: `pnpm dev:font-compress`
- 运行 GIF 制作: `pnpm dev:gif-maker`

**Electron 桌面端开发**

- 运行聚合应用桌面端: `pnpm electron:all-in-one`
- 各独立工具的桌面端命令同理，将 `dev:` 前缀换为 `electron:` 即可。

### 构建与检查

- 构建整个项目: `pnpm build`
- TypeScript 类型检查: `pnpm typecheck`
- 代码静态检查: `pnpm lint`

## 💡 架构理念

- **可复用性**: 业务功能（如 GIF 制作）完全内聚在对应的 `@pal/tool-*` 中。既可以作为独立 App 运行，也可以集成进 `app-all-in-one` 中，达到最少的代码冗余。
- **UI 一致性**: 所有的 UI 组件统一下沉到 `@pal/ui` 并强制使用 `shadcn/ui` 方案，不仅使得构建极为迅速，也能保证所有子应用拥有一致的用户体验。
- **简单扁平**: 结构层次分明，拒绝过度封装与复杂的继承体系，每个 App 的依赖清单一目了然。
