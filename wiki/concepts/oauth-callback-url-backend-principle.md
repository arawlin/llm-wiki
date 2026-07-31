---
type: concept
id: oauth-callback-url-backend-principle
title: "OAuth 回调 URL 的后端配置原则"
created: 2026-07-31
updated: 2026-07-31
tags:
  - oauth
  - authentication
  - better-auth
  - google-oauth
  - security
sources: []
related:
  - better-auth-google-oauth-callback-flow
status: active
last_reviewed: 2026-07-31
---

# OAuth 回调 URL 的后端配置原则

## 核心原则

OAuth 2.0 Authorization Code Flow 中，**OAuth Provider（如 Google）配置的 Authorized Redirect URI 必须指向后端服务地址，而非前端 SPA 地址**。

## 原因

Google OAuth 授权完成后，会带着 `code` 参数回调到配置的 URL。这个 `code` 需要服务端用 `clientSecret` 去 Google 的 token endpoint 换取 `accessToken`——整个过程**必须发生在服务端**，因为 `clientSecret` 绝不能暴露给浏览器。

## 核心内容

### 问题来源

用户在开发 BitRes Auth Service 时询问："OAuth 回调 url 是填前端的 url 还是后端的呢？google 登录完成后，怎么回调呢？"

### 讨论要点

1. **回调 URL 填后端**：Google Cloud Console → APIs & Services → Credentials → Authorized redirect URIs 中填 `http://localhost:<AUTH_PORT>/api/auth/callback/google`（本地）或 `https://<domain>/api/auth/callback/google`（生产）。

2. **baseURL 是关键配置**：better-auth 使用 `baseURL`（即 `BETTER_AUTH_URL` 环境变量）来构造发给 Google 的 `redirect_uri` 参数。不设置或设置错误会导致 `redirect_uri_mismatch` 错误。

3. **完整流程（7 步）**：
   - ① 前端调用 `authClient.signIn.social({ provider: "google" })`
   - ② 浏览器重定向到后端 `GET /api/auth/sign-in/google`
   - ③ 后端构造 Google OAuth URL，`redirect_uri` = `baseURL + /api/auth/callback/google`，302 重定向到 Google
   - ④ 用户在 Google 授权页面确认
   - ⑤ Google 回调后端 `GET /api/auth/callback/google?code=xxx`
   - ⑥ 后端用 `code` + `clientSecret` 向 Google 换 token，创建/关联用户，设置 HttpOnly Session Cookie
   - ⑦ 后端 302 重定向回前端（`trustedOrigins` 中配置的地址），用户处于已登录状态

4. **为什么不能是前端**：如果回调 URL 指向前端，`code` 会暴露在浏览器 URL 中；前端无法用 `clientSecret` 换取 token（secret 不能下发到浏览器）；整个流程安全性被破坏。

### 官方文档验证

此结论已通过 better-auth 官方文档双重验证（2026-07-31）：

- **better-auth Google 文档**（https://www.better-auth.com/docs/authentication/google）明确指出：
  > "For local development, use `http://localhost:3000/api/auth/callback/google`"
  > "You must configure the `baseURL` to avoid `redirect_uri_mismatch` errors. Better Auth uses this to construct the OAuth callback URL sent to Google."

- **Context7 代码库查询**确认回调 URL 模式为 `${baseURL}/api/auth/callback/:provider`。

## 适用范围

此原则适用于所有 OAuth 2.0 Authorization Code Flow 的场景，不仅限于 better-auth 或 Google：
- GitHub OAuth
- GitLab OAuth
- Microsoft Entra ID (Azure AD)
- 任何使用 Authorization Code Grant 的 OAuth Provider

## 常见错误

- ❌ 把前端地址（如 `http://localhost:5173`）填到 Google Cloud Console 的 redirect URI
- ❌ 生产环境忘记更新 redirect URI，仍指向 localhost
- ❌ `baseURL` 未设置或设置错误（如缺少协议、端口不对）
- ✅ 正确做法：redirect URI = `${BETTER_AUTH_URL}/api/auth/callback/google`
