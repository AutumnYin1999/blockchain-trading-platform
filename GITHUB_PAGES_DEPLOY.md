# GitHub Pages 部署指南

本指南将帮助你将项目部署到 GitHub Pages。

## 📋 前置要求

1. 拥有 GitHub 账号
2. 已安装 Git
3. 项目已初始化 Git 仓库（如果没有，运行 `git init`）

## 🚀 部署步骤

### 方法一：使用 GitHub Actions 自动部署（推荐）

#### 步骤 1: 创建 GitHub 仓库

1. 登录 GitHub
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - Repository name: 例如 `blockchain-trading-platform`
   - 选择 Public（GitHub Pages 免费版需要公开仓库）
   - **不要**勾选 "Initialize this repository with a README"
4. 点击 "Create repository"

#### 步骤 2: 配置仓库设置

1. 进入仓库页面
2. 点击 "Settings" → "Pages"
3. 在 "Source" 部分：
   - 选择 "GitHub Actions"
4. 保存设置

#### 步骤 3: 选择部署工作流

根据你的仓库名称选择合适的工作流：

**选项 A：如果你的仓库名是 `username.github.io`（个人主页）**
- 使用 `deploy.yml`（已配置 base: './'）
- 或者手动修改 `vite.config.ts` 中的 `base: '/'`

**选项 B：如果你的仓库名是其他名称（项目页面）**
- 使用 `deploy-with-base.yml`（会自动设置正确的 base 路径）
- 或者手动修改 `vite.config.ts` 中的 `base: '/repository-name/'`

#### 步骤 4: 推送代码到 GitHub

```bash
# 如果还没有初始化 Git
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

#### 步骤 5: 触发部署

1. 推送代码后，GitHub Actions 会自动开始构建和部署
2. 进入仓库页面 → "Actions" 标签页查看部署进度
3. 部署完成后，访问：`https://你的用户名.github.io/你的仓库名/`
   - 如果是 `username.github.io` 仓库，访问：`https://你的用户名.github.io/`

### 方法二：手动部署

如果你不想使用 GitHub Actions，可以手动构建并推送 `dist` 文件夹：

#### 步骤 1: 构建项目

```bash
npm run build
```

#### 步骤 2: 配置 base 路径

根据你的仓库名称，修改 `vite.config.ts`：

```typescript
// 如果是 username.github.io 仓库
base: '/'

// 如果是其他仓库名
base: '/你的仓库名/'
```

然后重新构建：
```bash
npm run build
```

#### 步骤 3: 推送到 gh-pages 分支

```bash
# 进入 dist 目录
cd dist

# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Deploy to GitHub Pages"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送到 gh-pages 分支
git branch -M gh-pages
git push -u origin gh-pages
```

#### 步骤 4: 配置 GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 `gh-pages`，文件夹选择 `/ (root)`
4. 点击 Save

## 🔧 常见问题

### 1. 页面显示空白

**原因**：`base` 路径配置不正确

**解决方案**：
- 检查 `vite.config.ts` 中的 `base` 配置
- 如果是项目页面（非 username.github.io），base 应该是 `/repository-name/`
- 如果是个人主页，base 应该是 `/`

### 2. 资源文件 404 错误

**原因**：构建时 base 路径不正确

**解决方案**：
- 使用 `deploy-with-base.yml` 工作流（会自动配置）
- 或手动修改 `vite.config.ts` 后重新构建

### 3. GitHub Actions 部署失败

**检查项**：
- 确保仓库 Settings → Pages → Source 选择了 "GitHub Actions"
- 检查 Actions 标签页中的错误信息
- 确保 `package.json` 中有 `build` 脚本

### 4. 如何更新部署

**使用 GitHub Actions**：
- 只需推送新的代码到 main/master 分支
- GitHub Actions 会自动重新构建和部署

**手动部署**：
- 运行 `npm run build`
- 进入 `dist` 目录
- 提交并推送到 `gh-pages` 分支

## 📝 注意事项

1. **公开仓库**：GitHub Pages 免费版需要公开仓库
2. **构建时间**：首次部署可能需要几分钟
3. **自定义域名**：可以在 Settings → Pages 中配置自定义域名
4. **HTTPS**：GitHub Pages 自动提供 HTTPS

## 🎉 部署完成后

访问你的网站：
- 项目页面：`https://你的用户名.github.io/你的仓库名/`
- 个人主页：`https://你的用户名.github.io/`

## 📚 相关资源

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#github-pages)
