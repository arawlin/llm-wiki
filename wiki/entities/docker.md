---
type: entity
id: docker
title: "Docker"
created: 2026-09-25
updated: 2026-09-25
tags:
  - docker
  - container
  - platform
  - devops
sources: []
related:
  - { relation: relates-to, target: docker-compose, note: "Compose 属 Docker 工具链，负责多容器编排" }
  - { relation: relates-to, target: buildkit, note: "BuildKit 是 Docker 引擎的构建子系统" }
  - { relation: relates-to, target: docker-build-proxy-configuration, note: "构建期/运行期代理的三层配置模型" }
status: active
schema_version: "0.1"
last_reviewed: 2026-09-25
---

# Docker

容器平台，采用客户端（`docker` CLI）与守护进程（`dockerd`）分离的架构，负责镜像构建、分发与容器生命周期管理。

## 关键属性

- **构建链路**：`docker build` / `docker compose build` 的构建执行与代理注入经 [[entities/buildkit]]（buildx 前端）处理；构建期代理不读 shell 环境变量，唯一自动来源是客户端配置文件——详见 [[concepts/docker-build-proxy-configuration]]。
- **代理配置面**：daemon 侧（`daemon.json` / systemd drop-in）只管 dockerd 自身出口；客户端配置文件（`~/.docker/config.json`）管构建期与新容器 env；运行时由编排层决定。三层互不代偿。
- **配置生效方式**：`~/.docker/config.json` 保存即生效，无需重启 Docker（仅影响后续构建与新容器）。

## 出现在

- `session-20260925-docker-build-proxy-layers`（2026-09-25 会话捕获）

## 来源

三层代理模型经 docker/compose 与 docker/buildx 源码及 Docker 官方文档交叉验证，详见 [[concepts/docker-build-proxy-configuration]]。

> 需要参考级细节 → [[concepts/docker-build-proxy-configuration]]；会话捕获文档 `session-20260925-docker-build-proxy-layers`。
