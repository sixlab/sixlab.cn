# 自动部署说明（SSH Key 认证）

## 配置步骤

### 1. 在服务器上生成部署专用 SSH 密钥对

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

执行后会在 `~/.ssh/` 目录下生成两个文件：
- `github_actions_deploy` —— **私钥**（不要泄露）
- `github_actions_deploy.pub` —— **公钥**

### 2. 将公钥添加到服务器授权列表

```bash
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. 在 GitHub 仓库中添加 Secrets

进入仓库页面：**Settings > Secrets and variables > Actions > New repository secret**

依次添加：

| Secret 名称 | 说明 | 内容来源 |
|------------|------|---------|
| `SERVER_HOST` | 服务器公网 IP | 你的服务器 IP |
| `SERVER_USER` | SSH 登录用户名 | 如 `root` |
| `SERVER_SSH_KEY` | SSH 私钥全文 | 复制 `~/.ssh/github_actions_deploy` 的完整内容 |
| `SERVER_PORT`（可选）| SSH 端口，默认 22 | 如 `22` |

**复制私钥的方法**：

```bash
cat ~/.ssh/github_actions_deploy
```

把输出的完整内容（包括 `-----BEGIN OPENSSH PRIVATE KEY-----` 和 `-----END OPENSSH PRIVATE KEY-----`）粘贴到 GitHub Secret 中。

### 4. 服务器前置条件

确保服务器上已初始化 git 仓库：

```bash
cd /opt/1panel/www/sites/sixlab.cn/index
git init
git remote add origin https://github.com/nianqinianyi/sixlab.git
```

### 5. 触发方式

每次向 `main` 分支 push 代码时，会自动触发部署。

也可以手动触发：**Actions > Deploy to Server > Run workflow**

---

## 安全提示

- 私钥文件 `github_actions_deploy` 只保留在服务器上，**不要上传到 GitHub 或任何其他地方**
- 如需撤销部署权限，删除 `~/.ssh/authorized_keys` 中对应的公钥行即可
- 建议为 GitHub Actions 单独创建密钥对，不要复用你日常登录服务器的私钥
