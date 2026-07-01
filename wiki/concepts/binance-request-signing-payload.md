---
type: concept
id: binance-request-signing-payload
title: "Binance 请求签名 Payload 构建"
created: 2026-07-01
updated: 2026-07-01
tags:
  - binance
  - api
  - security
  - signing
  - cryptography
sources:
  - binance-api-docs
related:
  - binance-api-authentication
  - entities/binance
status: active
schema_version: "0.1"
---

# Binance 请求签名 Payload 构建

## 定义

Binance SIGNED 接口的请求签名 payload 构建流程——将请求参数按特定规则序列化、百分比编码后，使用 API 密钥进行签名。签名算法支持 HMAC-SHA256、RSA（RSASSA-PKCS1-v1_5 + SHA-256）和 Ed25519 三种。

> 来源：`raw/binance-api-doc-llms-full.txt`，文档 `/products/wallet/general-info` 的三种签名示例章节。

## 核心思想

### 通用三步流程

```
参数 (key=value 对)
    │
    ▼
Step 1: 序列化 → "key1=val1&key2=val2&..."
    │
    ▼
Step 2: 百分比编码 → 非 ASCII 字符 → %XX
    │
    ▼
Step 3: 签名
    ├── HMAC-SHA256(secretKey, payload) → hex
    ├── RSA-SHA256 + PKCS#8 private key → base64 → urlencode
    └── Ed25519 private key → base64 → urlencode
    │
    ▼
附加 signature 参数到 query string
```

> 来源：三种签名类型的"第一步/第二步/第三步"通用流程。

### HMAC 签名（Bash 示例）

```bash
apiKey="vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A"
secretKey="NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"

payload="symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559"

signature=$(echo -n "$payload" | openssl dgst -sha256 -hmac "$secretKey")
signature=${signature#*= }

curl -H "X-MBX-APIKEY: $apiKey" -X POST \
  "https://api.binance.com/api/v3/order?$payload&signature=$signature"
```

> 来源：文档 HMAC Keys 章节的完整 Bash 脚本示例。

### RSA 签名（Bash 示例）

```bash
# 签名：RSASSA-PKCS1-v1_5 + SHA-256
# 私钥格式：PKCS#8 PEM
rawSignature=$(echo -n $api_params_with_timestamp \
  | openssl dgst -keyform PEM -sha256 -sign $PRIVATE_KEY_PATH \
  | openssl enc -base64 | tr -d '\n')

# 必须对 Base64 签名进行百分比编码！
signature=$(rawurlencode "$rawSignature")
```

> 来源：文档 RSA Keys 章节。

### Ed25519 签名（Python 示例）

```python
from cryptography.hazmat.primitives.serialization import load_pem_private_key

with open(PRIVATE_KEY_PATH, 'rb') as f:
    private_key = load_pem_private_key(f.read(), password=None)

payload = urllib.parse.urlencode(params, encoding='UTF-8')
signature = base64.b64encode(private_key.sign(payload.encode('ASCII')))
params['signature'] = signature
```

> 来源：文档 Ed25519 Keys 章节的完整 Python 脚本示例。

### 关键注意事项

1. **查询字符串与 HTTP body 直接拼接**（无分隔符）构成签名 payload
2. **非 ASCII 字符必须先百分比编码再签名**（如全角符号 `１２３４５６` → `%EF%BC%91...`）
3. **HMAC 签名不区分大小写**，RSA 和 Ed25519 签名**大小写敏感**
4. **RSA/Ed25519 的 Base64 签名必须再进行一次百分比编码**（`+` → `%2B`，`/` → `%2F`，`=` → `%3D`）
5. **timestamp 必须发送**，`recvWindow` 最大 60000ms
6. 参数顺序无要求，但如果 query string 和 body 同名，query string 优先

> 来源：文档基本信息章节和三种签名示例中的注意事项。

## 出现在

- [[sources/binance-api-docs]] — Binance 开发者文档
- [[concepts/binance-api-authentication]] — API 鉴权与签名
