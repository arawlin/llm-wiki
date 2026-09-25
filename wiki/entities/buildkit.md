---
type: entity
id: buildkit
title: "BuildKit"
created: 2026-09-25
updated: 2026-09-25
tags:
  - docker
  - buildkit
  - build
  - tool
sources: []
related:
  - { relation: part-of, target: docker, note: "BuildKit 是 Docker 引擎的构建子系统" }
  - { relation: relates-to, target: docker-build-proxy-configuration, note: "预定义代理构建参数的缓存行为与注入机制" }
status: active
schema_version: "0.1"
last_reviewed: 2026-09-25
---

# BuildKit

Docker 的构建子系统——`docker build` / `docker buildx` 的现代构建后端，执行 Dockerfile 前端解析、构建参数注入与缓存管理。

## 关键属性

- **预定义代理构建参数**：`HTTP_PROXY` / `HTTPS_PROXY` / `FTP_PROXY` / `NO_PROXY` / `ALL_PROXY`（大小写不敏感）由构建前端直接处理（`storeutil.GetProxyConfig`、`build/opt.go` frontend attrs），**无需 Dockerfile 声明 `ARG`**；默认不计入构建缓存键、不进 `docker history`。
- **缓存污染注意**：若 Dockerfile 显式引用这些参数，代理值会进入构建缓存——应避免。
- **cache mount**：依赖下载缓存于 cache mount，暖缓存下依赖不变的重建免网；`docker builder prune` 清缓存后需重新下载。

## 出现在

- `session-20260925-docker-build-proxy-layers`（2026-09-25 会话捕获）

## 来源

行为经 docker/buildx 源码（`storeutil.GetProxyConfig`、`build/opt.go`）与 Docker 官方文档确认，详见 [[concepts/docker-build-proxy-configuration]]。

> 需要参考级细节 → [[concepts/docker-build-proxy-configuration]]；会话捕获文档 `session-20260925-docker-build-proxy-layers`。
