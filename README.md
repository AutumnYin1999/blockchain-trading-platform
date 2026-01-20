# 区块链交易数据面板

一个现代化的区块链交易产品原型，包含实时数据展示、价格图表和交易记录。

## 功能特性

- 📊 实时价格展示和24小时变化
- 📈 交互式价格趋势图表
- 💰 交易量和市值统计
- 📋 实时交易记录列表
- 🎨 现代化的深色主题UI设计
- 📱 响应式布局，支持多种屏幕尺寸

## 技术栈

- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **Recharts** - React图表库

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 部署到 GitHub Pages

项目已配置好 GitHub Actions 工作流，可以自动部署到 GitHub Pages。

### 快速部署步骤

1. **创建 GitHub 仓库**（如果还没有）
2. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git branch -M main
   git push -u origin main
   ```
3. **配置 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"
4. **等待自动部署完成**
   - 进入 Actions 标签页查看部署进度
   - 部署完成后访问：`https://你的用户名.github.io/你的仓库名/`

### 详细部署指南

查看 [GITHUB_PAGES_DEPLOY.md](./GITHUB_PAGES_DEPLOY.md) 获取完整的部署说明和常见问题解答。

## 项目结构

```
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx      # 主面板组件
│   │   ├── PriceCard.tsx      # 价格卡片
│   │   ├── VolumeCard.tsx     # 交易量卡片
│   │   ├── MarketStats.tsx    # 市场统计
│   │   ├── PriceChart.tsx     # 价格图表
│   │   └── TransactionList.tsx # 交易列表
│   ├── App.tsx                # 根组件
│   ├── main.tsx               # 应用入口
│   └── index.css              # 全局样式
├── index.html                 # HTML模板
├── package.json               # 项目配置
├── vite.config.ts             # Vite配置
└── tsconfig.json              # TypeScript配置
```

## 开发说明

当前版本使用模拟数据来展示界面效果。在生产环境中，你需要：

1. 连接到真实的区块链API或后端服务
2. 使用WebSocket实现实时数据更新
3. 添加用户认证和权限管理
4. 实现更多的交易功能（下单、撤单等）

## 许可证

MIT
