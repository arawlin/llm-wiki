---
type: entity
id: redpanda-console
title: "Redpanda Console"
created: 2026-06-29
updated: 2026-06-29
tags: ["redpanda", "kafka", "web-ui", "dev-tools", "observability"]
sources:
  - redpanda-console-technical-summary
related:
  - console-deserialization-matrix
  - console-docker-compose-config-injection
status: active
---

# Redpanda Console

Redpanda Console（旧名 Kowl）是 Kafka/Redpanda 的 Web 管理 UI。

## 技术概况

- **架构**：Go 后端 + React 前端
- **分发**：单个 Docker 镜像 `docker.redpanda.com/redpandadata/console:latest`
- **端口**：8080
- **资源占用**：镜像体积 ~50MB，运行时内存 <256MB
- **依赖**：Redpanda/Kafka ≥ v1.0.0

## 核心功能

| 功能 | 说明 |
|------|------|
| Topic 管理 | 增删查改、配置审计（Retention/Compaction/Replication/Tiered Storage 等分组展示）、Web UI produce 测试消息 |
| Message Viewer | 浏览/搜索/过滤消息，支持按 partition、offset、timestamp 过滤 |
| Consumer Group 管理 | CG 列表、每分区 offset/lag 可视化、offset 编辑/删除 |
| Cluster 概览 | Broker 列表、集群健康状态 |
| ACL 管理 | 创建/编辑/删除 Kafka ACL |
| SASL-SCRUM 用户管理 | 管理认证用户 |
| Schema Registry | 管理 Avro / Protobuf / JSON Schema |
| Kafka Connect 管理 | 查看/管理 Connect 集群和连接器 |
| Redpanda Transforms | 管理 WebAssembly 数据转换 |

Topic 详情页 Tabs：Messages → Configuration → Partitions → Consumer Groups → Produce Record。

## 配置方式

三种方式，可混合使用：

1. **环境变量**：`KAFKA_BROKERS=redpanda-0:9092`（简单场景）
2. **YAML 配置文件**：`console.config.yaml`（推荐，功能完整）
3. **`CONSOLE_CONFIG_FILE` 内联 YAML**：Docker Compose 官方推荐模式，详见 [[concepts/console-docker-compose-config-injection]]

## 安全机制

- Google / GitHub OAuth 认证
- JWT session 管理
- RBAC 角色权限控制（Role / RoleBinding）
- 审计日志

## 消息浏览

Console 的 Message Viewer 支持 9 种编码格式的自动反序列化，详见 [[concepts/console-deserialization-matrix]]。

## 来源

- Context7: `/redpanda-data/console` — 源码级功能文档
- Context7: `/redpanda-data/docs` — 官方 Self-Managed 部署文档
- GitHub: `redpanda-data/console` README
