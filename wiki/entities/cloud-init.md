---
type: entity
id: cloud-init
title: "cloud-init"
created: 2026-09-21
updated: 2026-09-21
tags:
  - cloud-init
  - cloud
  - provisioning
  - ssh
sources: []
related:
  - { relation: relates-to, target: sshd-config-precedence, note: "写入 50-cloud-init.conf 干扰密码认证设置" }
  - { relation: relates-to, target: debian-13, note: "云镜像实例启动时的默认存在" }
status: active
schema_version: "0.1"
last_reviewed: 2026-09-21
---

# cloud-init

云实例的标准初始化服务：在实例首次（及后续）启动时执行用户数据与供应商配置，管理网络、用户、SSH 等初始状态。

## 关键属性

- **对 sshd 的干扰**：会写 `/etc/ssh/sshd_config.d/50-cloud-init.conf`（典型内容 `PasswordAuthentication yes`），且可能在实例启动时重新生成——直接编辑该文件来持久化不可靠 [unverified：重写时机为保守推断，未在实例实测]。
- **处置双保险**：(1) 自己的 drop-in 用 `00-` 前缀，靠 first-wins 排序取胜；(2) `/etc/cloud/cloud.cfg.d/99-ssh.cfg` 写 `ssh_pwauth: false` 断根。
- 机制背景见 [[concepts/sshd-config-precedence]]。

## 出现在

- `session-20260921-debian13-ssh-pubkey-hardening`（2026-09-21 会话捕获）

## 来源

行为经 cloud-init 仓库测试代码确认（路径与写入内容）。

> 需要参考级细节 → [[concepts/sshd-config-precedence]]（处置流程全文）。
