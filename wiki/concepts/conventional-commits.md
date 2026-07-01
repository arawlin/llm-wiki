---
type: concept
id: conventional-commits
title: "Conventional Commits（约定式提交）"
created: 2026-07-01
updated: 2026-07-01
tags:
  - git
  - commit
  - convention
  - semantic-versioning
  - changelog
sources: []
related: []
status: active
schema_version: "0.1"
---

# Conventional Commits（约定式提交）

## 定义

Conventional Commits 是一种结构化的 Git 提交信息（commit message）格式规范。它规定了 `<type>(<scope>): <subject>` 的三段式结构，是业界最广泛采用的提交规范之一，也是语义化版本（SemVer）自动化工具链的基础。

## 核心思想

### 格式结构

```
<type>(<scope>): <subject>
```

| 部分 | 说明 | 必填 |
|------|------|------|
| **type** | 变更类型 | 是 |
| **scope** | 影响的模块/组件 | 否 |
| **subject** | 简短描述 | 是 |

### 标准 Types（11 种）

| Type | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `style` | 格式调整，不影响代码逻辑 |
| `refactor` | 代码重构，不改变功能 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `build` | 构建系统变更 |
| `ci` | CI/CD 配置变更 |
| `chore` | 杂项维护 |
| `revert` | 回滚变更 |

### Subject 规范

- 使用**祈使语气**（imperative mood）：`add` 而非 `added`，`fix` 而非 `fixed`
- 首字母小写
- 末尾不加句号
- 固定使用英文

### BREAKING CHANGE

重大变更时在 footer 标注 `BREAKING CHANGE:` 或在 type/scope 后加 `!`：

```
feat(auth)!: remove legacy login
```

### 示例对照

| ✅ 正确 | ❌ 错误 | 问题 |
|---------|---------|------|
| `feat(auth): add OAuth2 login support` | `feat(auth): Added OAuth2 login support.` | 非祈使语气、多了句号 |
| `fix(api): handle null response in user endpoint` | `fix: 修复用户接口空响应问题` | 用了中文 |
| `docs(readme): update installation steps` | `Docs(readme): update installation steps` | type 首字母大写 |

### 优势

- 提交历史可读性强
- 支持自动化 changelog 生成
- 与语义化版本（SemVer）工具链无缝集成（如 `semantic-release`）

## 相关概念

- **Semantic Versioning（语义化版本）**：Conventional Commits 是 SemVer 自动化的输入源，`feat` → MINOR，`fix` → PATCH，`BREAKING CHANGE` → MAJOR
- **Changelog 自动生成**：基于 commit 历史自动生成发布说明（release notes）

## 出现在

- 用户全局记忆 `/memories/git-conventions.md`（2026-07-01 捕获）
- 业界规范网站 [conventionalcommits.org](https://www.conventionalcommits.org)
