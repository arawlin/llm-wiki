---
type: entity
id: openssh
title: "OpenSSH"
created: 2026-09-21
updated: 2026-09-21
tags:
  - ssh
  - openssh
  - sshd
  - tool
  - cryptography
sources: []
related:
  - { relation: relates-to, target: debian-13, note: "Debian 13 打包分发（1:10.0p1-7+deb13u4）" }
  - { relation: relates-to, target: sshd-config-precedence, note: "sshd 的 first-wins 配置解析规则来源" }
  - { relation: relates-to, target: ssh-pubkey-only-hardening, note: "算法弃用时间线约束客户端兼容策略" }
  - { relation: relates-to, target: cloud-init, note: "cloud-init 写入其 sshd drop-in 配置" }
status: active
schema_version: "0.1"
last_reviewed: 2026-09-21
---

# OpenSSH

SSH 协议的开源实现套件，包含 `sshd`（服务端守护进程）、`ssh`（客户端）、`ssh-keygen`、`ssh-agent`、`ssh-copy-id` 等工具；是 Debian 等主流发行版默认的 SSH 实现。

## 关键属性

- **Debian 13 打包版本**：`1:10.0p1-7+deb13u4`（上游 10.0p1）
- **算法弃用时间线**：
  - `ssh-rsa`（SHA-1 验签）自 8.8 起默认禁用；
  - DSA 密钥在 10.0 被移除；
  - 推论：老客户端应升级客户端软件，而非降级服务器端算法（如临时放开 `PubkeyAcceptedAlgorithms`）。
- **sshd 配置解析**：first-wins——先加载者生效，详见 [[concepts/sshd-config-precedence]]。
- **密钥类型建议**：ed25519（现代、短、快）；仅兼容极老客户端才用 `rsa -b 4096`。
- **权限要求**：home / `.ssh` / `authorized_keys` 组或他人可写会致公钥被静默拒绝（`bad ownership or modes`）；不应关闭 `StrictModes` 绕过。

## 出现在

- `session-20260921-debian13-ssh-pubkey-hardening`（2026-09-21 会话捕获）

## 来源

事实经 Debian 官方包源码（sources.debian.org、`.deb` 解包）验证。

> 需要参考级细节 → [[entities/debian-13]]（打包配置）、[[concepts/ssh-pubkey-only-hardening]]（使用流程）。
