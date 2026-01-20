# Git 安装指南

## 问题
PowerShell 提示：`git : 无法将"git"项识别为 cmdlet、函数、脚本文件或可运行程序的名称`

这说明你的电脑还没有安装 Git，或者 Git 没有添加到系统环境变量中。

## 解决方案

### 方法 1：安装 Git for Windows（推荐）

#### 步骤 1: 下载 Git
1. 访问：https://git-scm.com/download/win
2. 点击下载按钮（会自动下载适合你系统的版本）

#### 步骤 2: 安装 Git
1. 运行下载的安装程序（例如：`Git-2.xx.x-64-bit.exe`）
2. **重要**：在安装过程中，当看到 "Adjusting your PATH environment" 页面时：
   - 选择 **"Git from the command line and also from 3rd-party software"**（推荐）
   - 或者至少选择 **"Use Git and optional Unix tools from the Command Prompt"**
3. 其他选项保持默认即可
4. 点击 "Next" 完成安装

#### 步骤 3: 验证安装
1. **关闭当前的 PowerShell 窗口**
2. **重新打开 PowerShell**
3. 运行命令：
   ```powershell
   git --version
   ```
4. 如果显示版本号（如 `git version 2.xx.x`），说明安装成功！

#### 步骤 4: 配置 Git（首次使用）
```powershell
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

### 方法 2：使用 GitHub Desktop（图形界面，更简单）

如果你不想使用命令行，可以使用 GitHub Desktop：

1. **下载 GitHub Desktop**
   - 访问：https://desktop.github.com/
   - 点击 "Download for Windows"

2. **安装并登录**
   - 安装完成后打开 GitHub Desktop
   - 使用你的 GitHub 账号登录

3. **添加仓库**
   - 点击 "File" → "Add Local Repository"
   - 选择你的项目文件夹：`E:\HKBU\Trimester 2\2 Blockchain and Virtual Asset\Group work\Prototype`
   - 如果提示需要初始化，点击 "Create a Repository"

4. **推送到 GitHub**
   - 在 GitHub Desktop 中点击 "Publish repository"
   - 输入仓库名称
   - 选择 "Keep this code private" 或取消（公开仓库）
   - 点击 "Publish Repository"

### 方法 3：如果 Git 已安装但无法识别

如果之前安装过 Git，但 PowerShell 无法识别，可能是环境变量问题：

1. **检查 Git 安装位置**
   - 通常在：`C:\Program Files\Git\cmd\git.exe`
   - 或在：`C:\Program Files (x86)\Git\cmd\git.exe`

2. **手动添加到 PATH**
   - 按 `Win + R`，输入 `sysdm.cpl`，回车
   - 点击 "高级" → "环境变量"
   - 在 "系统变量" 中找到 `Path`，点击 "编辑"
   - 点击 "新建"，添加 Git 的路径（例如：`C:\Program Files\Git\cmd`）
   - 点击 "确定" 保存
   - **重启 PowerShell**

## 安装完成后

安装 Git 后，回到项目目录，运行：

```powershell
cd "E:\HKBU\Trimester 2\2 Blockchain and Virtual Asset\Group work\Prototype"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

## 需要帮助？

如果安装过程中遇到问题，可以：
1. 查看 Git 官方文档：https://git-scm.com/book/zh/v2
2. 或者使用 GitHub Desktop（图形界面更简单）
