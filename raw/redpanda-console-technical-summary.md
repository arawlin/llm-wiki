# Redpanda Console 技术知识总结

## 来源

- Context7: `/redpanda-data/console` (233 snippets) — 源码级功能文档
- Context7: `/redpanda-data/docs` (4,665 snippets) — 官方 Self-Managed 部署文档
  - `modules/deploy/pages/console/linux/deploy.adoc` — Console Docker 部署
  - `modules/console/pages/config/configure-console.adoc` — Console 配置指南
  - `modules/get-started/pages/quick-start.adoc` — 官方 Quickstart（含 Console）
- GitHub: `redpanda-data/console` README — 功能概览

---

## 1. Redpanda Console 概述

**定位**：Redpanda Console（旧名 Kowl）是 Kafka/Redpanda 的 Web 管理 UI。Go 后端 + React 前端，以单个 Docker 镜像分发（`docker.redpanda.com/redpandadata/console:latest`），端口 8080，镜像体积 ~50MB，运行时内存 <256MB。

**核心功能矩阵**：

| 功能 | 说明 |
|------|------|
| Topic 管理 | 增删查改、配置审计（Retention/Compaction/Replication/Tiered Storage 等分组展示）、Web UI produce 测试消息 |
| Message Viewer | 浏览/搜索/过滤消息，支持按 partition、offset、timestamp 过滤 |
| Consumer Group 管理 | CG 列表、每分区 offset/lag 可视化、offset 编辑/删除 |
| Cluster 概览 | Broker 列表、集群健康状态 |
| ACL 管理 | 创建/编辑/删除 Kafka ACL |
| SASL-SCRAM 用户管理 | 管理认证用户 |
| Schema Registry | 管理 Avro / Protobuf / JSON Schema |
| Kafka Connect 管理 | 查看/管理 Connect 集群和连接器 |
| Redpanda Transforms | 管理 WebAssembly 数据转换 |

**Topic 详情页 Tabs**：Messages → Configuration → Partitions → Consumer Groups → Produce Record

**Console 自身安全**：支持 Google/GitHub OAuth + JWT session + RBAC（Role/RoleBinding）+ 审计日志。

**依赖**：需要 Redpanda/Kafka ≥ v1.0.0。

**配置方式**（三种，可混合使用）：
1. 环境变量 `KAFKA_BROKERS=redpanda-0:9092`（简单场景）
2. YAML 配置文件 `console.config.yaml`（推荐，功能完整）
3. `CONSOLE_CONFIG_FILE` 环境变量内联 YAML（Docker Compose 官方推荐模式）

---

## 2. 消息反序列化能力矩阵

Console 的 Message Viewer 支持 **9 种编码格式**的自动反序列化，这是 Console 相比纯 CLI `rpk topic consume` 最大的开发体验提升点。

| 编码 | 反序列化方式 | 配置复杂度 | 说明 |
|------|-------------|-----------|------|
| **JSON** | 内置，零配置 | 无 | 自动识别 JSON 并格式化展示 |
| **Avro** | Schema Registry | 中 | 需配置 Schema Registry 连接 |
| **Protobuf** | Schema Registry / BSR / 本地文件 / Git 仓库 | 高 | 4 种 schema 来源可选 |
| **CBOR** | 内置 | 无 | Concise Binary Object Representation |
| **XML** | 内置 | 无 | |
| **MessagePack** | 内置 | 无 | |
| **Text** | 内置 | 无 | 纯文本展示 |
| **Binary** | 内置 | 无 | Hex dump 展示 |
| **自定义过滤器** | JavaScript 表达式 | 低 | 支持 ad-hoc 查询和动态过滤 |

### Protobuf 的四种 Schema 来源

1. **Schema Registry**：从消息 payload 中提取 schema ID，自动查找对应 schema——无需 topic mapping
2. **Buf Schema Registry (BSR)**：通过 Kafka record headers（`buf.registry.value.schema.message` + `buf.registry.value.schema.commit`）获取 schema 信息——无需 topic mapping
3. **本地文件系统**：指定 `.proto` 文件路径，需配置 topic→proto type 映射
4. **Git 仓库**：从 Git 仓库拉取 `.proto` 文件（深度 5 层搜索），需配置 topic→proto type 映射

### JSON 编码的实用价值

对于使用 JSON 编码的消息（如 REST API 响应、事件日志等），Console 中**零配置即可直接浏览、搜索、过滤**。不需要 Schema Registry、不需要 Protobuf 映射、不需要任何额外配置。开发者可以在 Web UI 中：
- 按 partition/offset/timestamp 定位特定消息
- 搜索特定字段内容
- 查看消息的完整 JSON 结构
- 无需终端、无需 `jq`、无需记忆 `rpk` 命令

---

## 3. Docker Compose 配置注入模式

官方 Docker Compose 模板使用了一种特殊的 shell 注入模式来传递 Console 的 YAML 配置：

```yaml
console:
  container_name: redpanda-console
  image: docker.redpanda.com/redpandadata/console:latest
  entrypoint: /bin/sh
  command: -c 'echo "$$CONSOLE_CONFIG_FILE" > /tmp/config.yml; /app/console'
  environment:
    CONFIG_FILEPATH: /tmp/config.yml
    CONSOLE_CONFIG_FILE: |
      kafka:
        brokers: ["redpanda-0:9092"]
      redpanda:
        adminApi:
          enabled: true
          urls: ["http://redpanda-0:9644"]
  ports:
    - "8080:8080"
  depends_on:
    redpanda-0:
      condition: service_healthy
```

### 关键机制

- **`entrypoint: /bin/sh`**：覆盖镜像默认 entrypoint，使用 shell 而非直接启动 Console 二进制
- **`command: -c 'echo "$$CONSOLE_CONFIG_FILE" > /tmp/config.yml; /app/console'`**：两步——先将环境变量值写入临时文件，再启动 Console
- **`$$` 双美元符号**：Docker Compose 会将 `$$` 转义为单个 `$`，使得 `$CONSOLE_CONFIG_FILE` 不被 Compose 展开，而是在容器内由 shell 展开
- **`CONFIG_FILEPATH`**：告诉 Console 从哪里读取 YAML 配置
- **`CONSOLE_CONFIG_FILE`**：内联 YAML 内容，通过 Compose 的 `|` 多行字符串语法传递

### 替代方案

除了内联 YAML，也可以：
1. 挂载配置文件：`volumes: - ./console.config.yaml:/tmp/config.yml`
2. 纯环境变量：`KAFKA_BROKERS=redpanda-0:9092`（功能有限，无法配置 Admin API、Kafka Connect 等高级选项）

### 内联 YAML 的优势

- 无需额外维护独立的配置文件——所有基础设施配置集中在 `docker-compose.yml`
- 配置简洁、一目了然
- 与官方 quickstart 模板一致
