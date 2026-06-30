---
type: concept
id: console-docker-compose-config-injection
title: "Redpanda Console Docker Compose 配置注入模式"
created: 2026-06-29
updated: 2026-06-29
tags: ["redpanda-console", "docker-compose", "configuration", "pattern"]
sources:
  - redpanda-console-technical-summary
related:
  - redpanda-console
status: active
---

# Redpanda Console Docker Compose 配置注入模式

官方 Docker Compose 模板使用了一种特殊的 shell 注入模式来传递 [[entities/redpanda-console]] 的 YAML 配置。

## 配置模板

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

## 关键机制

| 配置项 | 作用 |
|--------|------|
| `entrypoint: /bin/sh` | 覆盖镜像默认 entrypoint，使用 shell 而非直接启动 Console 二进制 |
| `command: -c 'echo "$$CONSOLE_CONFIG_FILE" > /tmp/config.yml; /app/console'` | 两步：先将环境变量值写入临时文件，再启动 Console |
| `$$` 双美元符号 | Docker Compose 会将 `$$` 转义为单个 `$`，使得 `$CONSOLE_CONFIG_FILE` 不被 Compose 展开，而是在容器内由 shell 展开 |
| `CONFIG_FILEPATH` | 告诉 Console 从哪里读取 YAML 配置 |
| `CONSOLE_CONFIG_FILE` | 内联 YAML 内容，通过 Compose 的 `\|` 多行字符串语法传递 |

## 替代方案

| 方案 | 配置方式 | 适用场景 |
|------|----------|----------|
| 内联 YAML | `CONSOLE_CONFIG_FILE` 环境变量 | 推荐，配置集中在 docker-compose.yml |
| 挂载配置文件 | `volumes: - ./console.config.yaml:/tmp/config.yml` | 需要外部管理配置文件时 |
| 纯环境变量 | `KAFKA_BROKERS=redpanda-0:9092` | 简单场景，无法配置 Admin API、Kafka Connect 等高级选项 |

## 内联 YAML 的优势

- 无需额外维护独立的配置文件——所有基础设施配置集中在 `docker-compose.yml`
- 配置简洁、一目了然
- 与官方 quickstart 模板一致

## 来源

- Context7: `/redpanda-data/docs` → `modules/console/pages/config/configure-console.adoc`
- Context7: `/redpanda-data/docs` → `modules/get-started/pages/quick-start.adoc`（官方 quickstart 模板）
