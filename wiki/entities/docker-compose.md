---
type: entity
id: docker-compose
title: "Docker Compose"
created: 2026-09-25
updated: 2026-09-25
tags:
  - docker
  - docker-compose
  - orchestration
  - tool
sources: []
related:
  - { relation: part-of, target: docker, note: "Compose 属 Docker 工具链（v2 起为 CLI 插件）" }
  - { relation: relates-to, target: docker-build-proxy-configuration, note: "compose build 的代理在构建期的注入与合并规则" }
  - { relation: relates-to, target: console-docker-compose-config-injection, note: "Console 部署使用 compose 的配置注入模式" }
status: active
schema_version: "0.1"
last_reviewed: 2026-09-25
---

# Docker Compose

用声明式 YAML 定义与运行多容器应用的编排工具（`docker compose`，v2 起为 Docker CLI 插件）。

## 关键属性

- **构建期代理行为**：`build` 的代理参数取自 **Docker 客户端配置文件**——实现链：`getProxyConfig()` → `configFile().ParseProxyConfig(daemonHost)`，再由 `resolveAndMergeBuildArgs` 生成 "standard proxy variables based on the Docker client configuration"。
- **合并优先级（坑）**：
  - `build.args` 中已出现的键**不会被** config.json 代理覆盖（"will not overwrite any values if already present"）——空值声明（如 `HTTP_PROXY: ${HTTP_PROXY:-}` 未设值）会抑制注入；
  - 容器 env：`proxyConfig.OverrideBy(service.Environment)`——服务自身 `environment` 优先。
- **运行时层**：compose `environment`（可经 `.env` 插值）只决定运行期容器出网，与构建期无关。

## 出现在

- `session-20260925-docker-build-proxy-layers`（2026-09-25 会话捕获）

## 来源

行为经 docker/compose 源码（`getProxyConfig`、`resolveAndMergeBuildArgs`、`getCreateConfigs`）与官方文档确认，详见 [[concepts/docker-build-proxy-configuration]]。

> 需要参考级细节 → [[concepts/docker-build-proxy-configuration]]；相关模式 → [[concepts/console-docker-compose-config-injection]]。
