# 🚀 GitHub Pages 快速部署指南

## 5 分钟快速部署

### 1️⃣ 创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角 "+" → "New repository"
3. 填写信息：
   - **Repository name**: 例如 `blockchain-trading-platform`
   - 选择 **Public**（免费版需要公开）
   - **不要**勾选 README
4. 点击 "Create repository"

### 2️⃣ 推送代码

在项目根目录运行：

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

### 3️⃣ 启用 GitHub Pages

1. 进入你的仓库页面
2. 点击 **Settings** → **Pages**
3. 在 "Source" 部分：
   - 选择 **"GitHub Actions"**
4. 保存设置

### 4️⃣ 选择部署工作流

根据你的仓库名称：

- **如果是 `username.github.io`**（个人主页）
  - 使用 `.github/workflows/deploy.yml`
  - 需要修改 `vite.config.ts` 中的 `base: '/'`

- **如果是其他名称**（项目页面，推荐）
  - 使用 `.github/workflows/deploy-with-base.yml`
  - 会自动配置正确的 base 路径

**如何选择**：
- 将 `deploy-with-base.yml` 重命名为 `deploy.yml`（覆盖原来的）
- 或者删除 `deploy.yml`，将 `deploy-with-base.yml` 重命名为 `deploy.yml`

```bash
# 在项目根目录运行
mv .github/workflows/deploy-with-base.yml .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
git commit -m "Use deploy-with-base workflow"
git push
```

### 5️⃣ 等待部署完成

1. 推送代码后，GitHub Actions 会自动开始部署
2. 进入仓库 → **Actions** 标签页查看进度
3. 看到绿色的 ✅ 表示部署成功

### 6️⃣ 访问你的网站

部署完成后，访问：
- **项目页面**: `https://你的用户名.github.io/你的仓库名/`
- **个人主页**: `https://你的用户名.github.io/`

## ⚠️ 重要提示

1. **首次部署需要 2-5 分钟**，请耐心等待
2. **如果页面空白**，检查 `vite.config.ts` 中的 `base` 配置是否正确
3. **更新代码**：只需 `git push`，GitHub Actions 会自动重新部署

## 🆘 遇到问题？

查看 [GITHUB_PAGES_DEPLOY.md](./GITHUB_PAGES_DEPLOY.md) 获取详细说明和常见问题解答。
