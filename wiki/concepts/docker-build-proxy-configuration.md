---
type: concept
id: docker-build-proxy-configuration
title: "Docker 构建期代理：三层模型与配置机制"
created: 2026-09-25
updated: 2026-09-25
tags:
  - docker
  - proxy
  - buildkit
  - docker-compose
  - configuration
sources: []
related:
  - { relation: part-of, target: docker, note: "本机制属于 Docker 的代理配置体系" }
  - { relation: relates-to, target: docker-compose, note: "compose build 的代理注入实现（getProxyConfig / resolveAndMergeBuildArgs）" }
  - { relation: relates-to, target: buildkit, note: "预定义代理参数由 BuildKit 前端处理，默认不进缓存键" }
status: active
schema_version: "0.1"
last_reviewed: 2026-09-25
---

# Docker 构建期代理：三层模型与配置机制

## 定义

`docker build` / `docker compose build` 的构建期代理**不读 shell 环境变量**——唯一自动来源是 Docker 客户端配置文件 `~/.docker/config.json` 的 `proxies` 段（构建时预填充为预定义构建参数）；其次为显式 `--build-arg`。结论经 docker/compose 与 docker/buildx 源码及官方文档交叉确认。

## 三层代理模型（互不代偿）

| # | 层 | 配置位置 | 作用范围 |
|---|----|----------|----------|
| 1 | daemon 层 | `daemon.json` 或 systemd drop-in（`docker.service.d/http-proxy.conf`） | 仅 dockerd 自身出口（拉镜像、push）；**不进入构建容器** |
| 2 | 客户端配置层 | `~/.docker/config.json` 的 `proxies` 段 | **构建期代理的唯一自动来源**；也决定新容器（未自行定义时）的代理 env |
| 3 | 运行时容器层 | compose `environment`（可经 `.env` 插值） | 仅运行期容器出网；**与构建期无关** |

`default` 键对所有 daemon 生效，也可按 daemon 地址分键；保存即生效，无需重启 Docker（仅影响后续构建与新容器）。

## 构建期注入机制

- **无环境变量通道**：官方文档措辞为 "based on the proxy settings in your Docker client configuration file"；唯一涉及环境变量的通道是**不带值**的 `--build-arg HTTP_PROXY`（此时才从本地环境取值）——显式行为，非自动注入。
- **预定义代理参数**：`HTTP_PROXY` / `HTTPS_PROXY` / `FTP_PROXY` / `NO_PROXY` / `ALL_PROXY`（大小写不敏感）；无需在 Dockerfile 声明 `ARG`；默认不计入构建缓存键、不进 `docker history`。
- **缓存注意**：Dockerfile 显式引用这些参数会使代理值进入构建缓存——应避免。
- **合并优先级（反向坑）**：compose `build.args` 中已出现的键不会被 config.json 覆盖（"will not overwrite any values if already present"）——空值声明（如 `HTTP_PROXY: ${HTTP_PROXY:-}` 未设值）会抑制注入；容器 env 则 `proxyConfig.OverrideBy(service.Environment)`，服务自身 `environment` 优先。

## 配置示例

```json
{ "proxies": { "default": {
    "httpProxy": "http://<proxy-ip>:<port>",
    "httpsProxy": "http://<proxy-ip>:<port>",
    "noProxy": "localhost,127.0.0.1,<内部服务名列表>" } } }
```

- 代理地址写 **IP:port** 以规避容器 DNS 问题；`noProxy` 覆盖内部服务名。

## 诊断信号

- **错误形态学**：报目标域名 DNS/网络不可达 ⇒ 容器内根本没用代理；若有代理 env，错误形态为代理连接类（拒绝/超时/407）。
- **构建步进定位**：`builder N/N` 最后阶段失败 ⇒ FROM/COPY 与基础镜像均已就绪，问题局限在 RUN 内网络。
- **DNS 不可达场景**：容器对外 DNS 依赖链路本地 IPv6 解析器且不可达（错误含 `fe80::` 地址）⇒ 代理写 IP；若只能用域名，先独立验证容器可解析。

## 修复流程

1. 以执行构建的用户写入/合并 `~/.docker/config.json`（root 运行则为 `/root/.docker/config.json`；勿覆盖已有文件，`chmod 600`）。
2. 探针：最小 Dockerfile 执行 `RUN env | grep -i _proxy` 构建一次，确认代理变量进入构建容器。
3. 重建 `docker compose … up -d --build`；首次构建需下载全部依赖，cache mount 暖后依赖不变的重建免网。

## 相关概念

- [[entities/docker]]、[[entities/docker-compose]]、[[entities/buildkit]] — 机制所属平台、注入路径与构建后端
- [[concepts/console-docker-compose-config-injection]] — compose 配置注入的另一模式（对照）

## 出现在

- `session-20260925-docker-build-proxy-layers`（2026-09-25 会话捕获）

## 来源

本概念提炼自 2026-09-25 会话捕获文档 `session-20260925-docker-build-proxy-layers`（questions_approved/）。机制事实经 docker/compose（`getProxyConfig`、`resolveAndMergeBuildArgs`）与 docker/buildx（`storeutil.GetProxyConfig`、`build/opt.go`）源码及 Docker 官方文档交叉验证；服务器端应用效果 [unverified]（机制 high，端到端效果待验证）。

> 需要参考级细节（完整会话原文）→ 会话捕获文档；上游页面 → [[entities/docker]]、[[entities/docker-compose]]、[[entities/buildkit]]。
