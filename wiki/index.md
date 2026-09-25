---
type: index
id: wiki-index
title: "LLM Wiki — 索引"
created: 2026-06-29
updated: 2026-09-25
last_commit: null
schema_version: "0.1"
freshness_policy:
  source: 30
  synthesis: 60
  entity: 90
  concept: 180
deprecated_fields: []
---

# LLM Wiki 索引

> 全局索引页面，维护 Wiki 元数据和目录。

## Schema 版本

- **当前版本**：`0.1`
- **废弃字段**：无

## Freshness 策略

| 页面类型 | 复查周期（天） | 说明 |
|----------|---------------|------|
| `source` | 30 | 来源页面，需频繁复查 |
| `synthesis` | 60 | 综合问答，中频复查 |
| `entity` | 90 | 实体页面，低频复查 |
| `concept` | 180 | 概念页面，最低频复查 |

## 页面目录

### Sources（来源）

- [[sources/redpanda-console-technical-summary]] — Redpanda Console 技术知识总结（2026-06-29）
- [[sources/binance-api-docs]] — Binance 开发者文档（2026-07-01） | tags: binance, api, cryptocurrency, trading, web3

<!-- LLM: 按 tags 分组列出所有 sources 页面 -->

### Entities（实体）

- [[entities/redpanda-console]] — Redpanda Console | tags: redpanda, kafka, web-ui, dev-tools, observability
- [[entities/binance]] — Binance 交易平台 | tags: binance, cryptocurrency, exchange, trading, api
- [[entities/binance-web3-wallet]] — Binance Web3 钱包 | tags: binance, web3, wallet, multi-chain, mpc
- [[entities/binance-skills-hub]] — AI Agent 技能市场 | tags: binance, ai, agent, skills, mcp
- [[entities/binance-cli]] — 命令行工具 | tags: binance, cli, tool, trading
- [[entities/binance-fix-api]] — FIX 协议接入 | tags: binance, fix, trading, institutional, low-latency
- [[entities/binance-sbe]] — Simple Binary Encoding | tags: binance, sbe, binary-encoding, low-latency, serialization
- [[entities/binance-agent-native]] — Agent 原生设计 | tags: binance, ai, agent, llm, mcp
- [[entities/openssh]] — OpenSSH：SSH 协议实现套件（sshd/ssh/ssh-keygen） | tags: ssh, openssh, sshd, tool, cryptography
- [[entities/cloud-init]] — 云实例初始化服务（写入 sshd drop-in 配置） | tags: cloud-init, cloud, provisioning, ssh
- [[entities/debian-13]] — Debian 13（trixie）SSH 打包默认值与服务形态 | tags: debian, linux, distro, ssh, packaging
- [[entities/docker]] — Docker：容器平台（客户端/守护进程架构） | tags: docker, container, platform, devops
- [[entities/docker-compose]] — Docker Compose：多容器编排工具（构建期代理注入路径） | tags: docker, docker-compose, orchestration, tool
- [[entities/buildkit]] — BuildKit：Docker 构建子系统（预定义代理参数与缓存） | tags: docker, buildkit, build, tool

<!-- LLM: 按 tags 分组列出所有 entities 页面 -->

### Concepts（概念）

- [[concepts/console-deserialization-matrix]] — 消息反序列化能力矩阵 | tags: redpanda-console, serialization, kafka
- [[concepts/console-docker-compose-config-injection]] — Docker Compose 配置注入模式 | tags: redpanda-console, docker-compose, configuration
- [[concepts/binance-api-authentication]] — API 鉴权与签名 | tags: binance, api, authentication, security, cryptography
- [[concepts/binance-rate-limiting]] — 速率限制与可靠性 | tags: binance, api, rate-limiting, reliability, throttling
- [[concepts/binance-api-types-comparison]] — API 类型对比 | tags: binance, api, architecture, rest, websocket, fix, sbe
- [[concepts/llms-txt-standard]] — llms.txt 标准 | tags: ai, llm, documentation, web-standard, agent
- [[concepts/binance-web3-multi-chain-provider]] — 多链钱包 Provider 模式 | tags: binance, web3, wallet, multi-chain, provider-pattern
- [[concepts/agentic-wallet-skills]] — Agentic 钱包技能 | tags: ai, agent, wallet, skills, mcp, cryptocurrency
- [[concepts/binance-request-signing-payload]] — 请求签名 Payload 构建 | tags: binance, api, security, signing, cryptography
- [[concepts/conventional-commits]] — Conventional Commits（约定式提交） | tags: git, commit, convention, semantic-versioning, changelog
- [[concepts/planning-doc-hierarchy]] — 项目规划文档体系：职责边界 | tags: requirements-engineering, documentation, prd, architecture, spike, implementation-plan, ddd
- [[concepts/better-auth-google-oauth-callback-flow]] — better-auth Google OAuth 完整回调流程 | tags: better-auth, google-oauth, oauth, callback, authentication, nestjs
- [[concepts/oauth-callback-url-backend-principle]] — OAuth 回调 URL 的后端配置原则 | tags: oauth, authentication, better-auth, google-oauth, security
- [[concepts/go-package-organization]] — Go 包结构组织：按行为而非分层 | tags: go, package, architecture, project-structure, best-practice, yagni, design
- [[concepts/trade-signal-model]] — 买卖策略模型：信号共振 + 加权净资金流评分 + 仓位分层 | tags: trading, crypto, meme-coin, signal, smart-money, kol-tracking, position-sizing, risk-management, gmgn
- [[concepts/weight-vs-position]] — 权重只排序、不直接定仓位（信号-决策-执行分层） | tags: trading, risk-management, position-sizing, architecture, decision
- [[concepts/sshd-config-precedence]] — sshd 配置生效顺序：drop-in 优先（first-wins） | tags: ssh, sshd, configuration, debian, cloud-init
- [[concepts/ssh-pubkey-only-hardening]] — SSH 纯公钥登录切换与硬化（六步流程 + 防锁死） | tags: ssh, security, hardening, authentication, ed25519, debian
- [[concepts/docker-build-proxy-configuration]] — Docker 构建期代理：三层模型与配置机制 | tags: docker, proxy, buildkit, docker-compose, configuration

<!-- LLM: 按 tags 分组列出所有 concepts 页面 -->

### Synthesis（综合）

<!-- LLM: 按 tags 分组列出所有 synthesis 页面 -->

---

*此文件由 LLM 自动维护，请勿手动编辑目录部分。*
