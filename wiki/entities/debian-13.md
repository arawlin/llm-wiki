---
type: entity
id: debian-13
title: "Debian 13（trixie）"
created: 2026-09-21
updated: 2026-09-21
tags:
  - debian
  - linux
  - distro
  - ssh
  - packaging
sources: []
related:
  - { relation: contains, target: openssh, note: "打包分发 OpenSSH 1:10.0p1-7+deb13u4" }
  - { relation: relates-to, target: sshd-config-precedence, note: "打包的 sshd_config 首行 Include 决定 drop-in 生效顺序" }
  - { relation: relates-to, target: ssh-pubkey-only-hardening, note: "SSH 默认值决定硬化需显式关闭的项" }
  - { relation: relates-to, target: cloud-init, note: "云镜像实例上 cloud-init 会影响 SSH 配置" }
status: active
schema_version: "0.1"
last_reviewed: 2026-09-21
---

# Debian 13（trixie）

Debian 的第 13 个稳定发行版（代号 trixie）。本页记录其 SSH 相关的打包行为（经官方包源码逐条验证）。

## 关键属性（SSH 相关）

**打包默认值**（OpenSSH `1:10.0p1-7+deb13u4`）：

| 参数 | 默认值 | 含义 |
|------|--------|------|
| `PasswordAuthentication` | `yes` | 需显式关闭 |
| `KbdInteractiveAuthentication` | `no` | PAM 键盘交互通道已默认堵上 |
| `PermitRootLogin` | `prohibit-password` | root 仅公钥 |
| `UsePAM` | `yes` | |
| `X11Forwarding` | `yes` | 硬化建议关闭 |

**服务形态**：

- 默认 `ssh.service`（非 socket activation）；
- `ssh.socket` 存在但需手动 opt-in：`systemctl disable --now ssh.service && systemctl start ssh.socket`（适合 minimal footprint 环境，如 cloud guests）；修改 `ListenStream` 后须 `daemon-reload` + `restart ssh.socket`；
- `systemctl reload ssh` = `sshd -t` + `kill -HUP`（不断现有连接）。

**配置加载**：`/etc/ssh/sshd_config` 首行 `Include /etc/ssh/sshd_config.d/*.conf`，drop-in 优先于主文件——见 [[concepts/sshd-config-precedence]]。

## 出现在

- `session-20260921-debian13-ssh-pubkey-hardening`（2026-09-21 会话捕获）

## 来源

打包事实经 sources.debian.org 源码浏览与 `.deb` 解包逐条验证。

> 需要参考级细节 → [[concepts/ssh-pubkey-only-hardening]]（操作流程）、[[entities/openssh]]（上游工具）。
