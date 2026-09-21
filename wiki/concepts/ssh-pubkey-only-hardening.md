---
type: concept
id: ssh-pubkey-only-hardening
title: "SSH 纯公钥登录切换与硬化"
created: 2026-09-21
updated: 2026-09-21
tags:
  - ssh
  - security
  - hardening
  - authentication
  - ed25519
  - debian
sources: []
related:
  - { relation: relates-to, target: sshd-config-precedence, note: "关闭密码依赖 drop-in 写入（00- 前缀）与 sshd -T 验证机制" }
  - { relation: relates-to, target: openssh, note: "客户端兼容性受算法弃用时间线约束" }
  - { relation: relates-to, target: debian-13, note: "Debian 13 默认 PasswordAuthentication yes，决定必须显式关闭的项" }
status: active
schema_version: "0.1"
last_reviewed: 2026-09-21
---

# SSH 纯公钥登录切换与硬化

## 定义

把服务器从「密码 + 公钥」登录迁移到**纯公钥登录**（推荐 ed25519）并同步完成 SSH 硬化的操作模式。核心不是命令序列，而是两条原则：**验证前置于关闭**（先确认公钥能登录，再关密码）与**全程保有退路**（旧会话不关、带外控制台可用）。

## 核心思想：六步流程（含每步理由）

1. **本地生成密钥**：`ssh-keygen -t ed25519 -a 100 -C "you@laptop"`。ed25519 现代、短、快；仅需兼容极老客户端才选 `-t rsa -b 4096`。密钥应设 passphrase 并配合 ssh-agent 使用。
2. **上传公钥**：`ssh-copy-id -i ~/.ssh/id_ed25519.pub user@host`（或手动追加 `authorized_keys`）；随后 `chmod 700 ~/.ssh`、`chmod 600 ~/.ssh/authorized_keys`、`chmod g-w,o-w ~`。**权限错误（home / `.ssh` / `authorized_keys` 组或他人可写）会导致 sshd 静默拒绝公钥**（日志报 `bad ownership or modes`）——不要通过关闭 `StrictModes` 绕过。
3. **先验证公钥登录**（顺序关键）：新终端执行 `ssh -o PreferredAuthentications=publickey -o PasswordAuthentication=no user@host`；原会话保持不关（退路）。
4. **写 drop-in 关闭密码**：`/etc/ssh/sshd_config.d/00-hardening.conf` 写 `PasswordAuthentication no`、`KbdInteractiveAuthentication no`（双保险，防 PAM 密码通道被重新打开）、`PermitRootLogin prohibit-password`（或更严的 `no`）。
5. **校验并重载**：`sshd -t`（语法检查，失败不要重载）→ `sshd -T | grep -Ei 'passwordauth|kbdinteractive|permitrootlogin'`（最终生效值）→ `systemctl reload ssh`。
6. **复测**：`ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password user@host` 应返回 `Permission denied (publickey).`；云镜像机器再 `grep -r PasswordAuthentication /etc/ssh/sshd_config.d/` 排查 cloud-init 文件。

**一句话流程**：ed25519 密钥 → `ssh-copy-id` → 新终端验证公钥 → `00-hardening.conf` 关密码 → `sshd -T` 确认生效 → reload → 复测密码被拒 → 全程不关旧会话。

## 防锁死（lockout）三件套

1. 保留已登录会话，直到新终端验证通过；
2. 提前确认带外控制台（VNC / 串口）可用；
3. 顺序固定：**公钥可登录 → 再关密码**。

## 硬化清单（服务器侧）

| 项 | 建议 | 理由 |
|----|------|------|
| `AllowUsers` / `AllowGroups` | 限制可登录账号 | 缩小攻击面 |
| `MaxAuthTries` | 3 | 限制爆破尝试 |
| `LoginGraceTime` | 30 | 缩短未认证连接窗口 |
| `X11Forwarding` | no（Debian 默认 yes） | 减少暴露面 |
| fail2ban | 可选 | 纯公钥后价值降低，仅减少扫描噪音 |
| `unattended-upgrades` | 开启 | 保持补丁 |
| 改端口 | 不算安全措施 | 只减少噪音 |

## reload 语义（为何用 reload 不用 restart）

`systemctl reload ssh` 的 `ExecReload = sshd -t` + `kill -HUP $MAINPID`：现有连接不受影响、仅新连接使用新配置——这是修改认证配置后的正确操作。

## 客户端习惯与兼容性

- 多密钥环境用 `IdentitiesOnly=yes`（或 `.ssh/config` 配 `IdentityFile`），防止 agent 逐把密钥尝试撞上服务器 `MaxAuthTries`；备用密钥双份避免单点。
- SHA-1 的 `ssh-rsa` 自 OpenSSH 8.8 默认禁用、DSA 在 10.0 被移除；**老客户端应升级客户端软件，而非降级服务器算法**（如临时放开 `PubkeyAcceptedAlgorithms`）。

## 相关概念

- [[concepts/sshd-config-precedence]] — drop-in 写入与 first-wins 排序（本流程步骤 4–5 的机制基础）

## 出现在

- `session-20260921-debian13-ssh-pubkey-hardening`（2026-09-21 会话捕获）

## 来源

本概念提炼自 2026-09-21 会话捕获文档 `session-20260921-debian13-ssh-pubkey-hardening`（questions_approved/）；Debian 打包默认值经官方包源码验证。

> 需要参考级细节（完整会话叙述与逐条验证记录）→ 会话捕获文档；上游页面 → [[entities/debian-13]]。
