---
type: concept
id: sshd-config-precedence
title: "sshd 配置生效顺序：drop-in 优先（first-wins）"
created: 2026-09-21
updated: 2026-09-21
tags:
  - ssh
  - sshd
  - configuration
  - debian
  - cloud-init
sources: []
related:
  - { relation: relates-to, target: ssh-pubkey-only-hardening, note: "硬化操作依赖本机制：写 drop-in、00- 前缀命名、sshd -T 验证" }
  - { relation: relates-to, target: openssh, note: "first-wins 解析规则由 OpenSSH sshd 定义" }
  - { relation: relates-to, target: cloud-init, note: "50-cloud-init.conf 干扰是本机制的典型实战场景" }
  - { relation: relates-to, target: debian-13, note: "Debian 打包的 sshd_config 首行 Include 决定该目录的加载" }
status: active
schema_version: "0.1"
last_reviewed: 2026-09-21
---

# sshd 配置生效顺序：drop-in 优先（first-wins）

## 定义

Debian 打包的 `/etc/ssh/sshd_config` 首行有效指令是 `Include /etc/ssh/sshd_config.d/*.conf`；sshd 对同一参数取**第一个获得的值**（first obtained value wins）。因此 **drop-in 目录的设置优先于主文件正文**，目录内按文件名字典序、靠前者优先；`Include` 仅匹配 `.conf` 后缀文件。这正是「改了 `/etc/ssh/sshd_config` 却不生效」的根因。

## 核心思想

**加载机制（三条事实）**：

| # | 规则 | 含义 |
|---|------|------|
| 1 | `Include` 位于主文件首行 | drop-in 目录的设置优先于主文件正文 |
| 2 | 同一参数 first-wins | 目录内按文件名字典序，靠前者胜出 |
| 3 | 仅匹配 `*.conf` | 其他后缀文件被忽略 |

**操作推论（三条）**：

1. **新配置写入 `sshd_config.d/`，不要改主文件**——写进主文件的修改会被 drop-in 压制。
2. **命名用 `00-` 前缀**——压过云镜像常见的 `50-cloud-init.conf` / `60-cloudimg-settings.conf`。
3. **验证必须用 `sshd -T`（需 root）**——查看最终生效值，而非肉眼读文件。

## 云镜像场景：cloud-init 干扰与处置

cloud-init 会写 `/etc/ssh/sshd_config.d/50-cloud-init.conf`（典型内容 `PasswordAuthentication yes`），且可能在实例启动时重新生成——直接编辑它来持久化不可靠 [unverified：重写时机为保守推断，未在实例实测]。处置双保险：

1. **排序取胜（主要手段）**：自己的配置用 `00-` 前缀，靠 first-wins 压过它。
2. **断根**：`/etc/cloud/cloud.cfg.d/99-ssh.cfg` 写入 `ssh_pwauth: false`，让 cloud-init 不再打开密码认证。

## 相关概念

- [[concepts/ssh-pubkey-only-hardening]] — 利用本机制关闭密码登录的完整操作流程
- [[entities/openssh]]、[[entities/cloud-init]]、[[entities/debian-13]] — 机制所属实现与典型环境

## 出现在

- `session-20260921-debian13-ssh-pubkey-hardening`（2026-09-21 会话捕获）

## 来源

本概念提炼自 2026-09-21 会话捕获文档 `session-20260921-debian13-ssh-pubkey-hardening`（questions_approved/）。机制事实（Include 位置、first-wins、cloud-init 写入路径）经 Debian 官方包源码与 cloud-init 仓库测试代码逐条验证。

> 需要参考级细节（具体命令与会话原文）→ 会话捕获文档；上游页面 → [[entities/openssh]]、[[entities/cloud-init]]。
