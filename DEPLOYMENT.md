# 部署指南

## 🚀 推薦方式：使用 GitHub Actions 自動部署

由於 Windows 系統上 `gh-pages` 套件可能遇到路徑長度限制問題，建議使用 GitHub Actions 自動部署。

### 步驟 1: 推送程式碼到 GitHub

```bash
git add .
git commit -m "準備部署"
git push origin main
```

### 步驟 2: 設定 GitHub Pages

前往 GitHub repo 設定：
1. **Settings** → **Pages**
2. **Source** 選擇 `GitHub Actions`
3. 儲存設定

### 步驟 3: 自動部署

GitHub Actions 會自動觸發部署流程：
- 每次 push 到 `main` 分支時自動建構和部署
- 也可以在 Actions 頁面手動觸發

部署成功後即可訪問: `https://bbdai.github.io/09-letter-m/`

---

## 🔄 替代方式：手動部署（如果 gh-pages 遇到問題）

### 方案 A: 直接推送 dist 到 gh-pages 分支

```bash
# 建構專案
npm run build

# 進入 dist 資料夾
cd dist

# 初始化 git
git init
git add -A
git commit -m 'deploy'

# 推送到 gh-pages 分支
git push -f https://github.com/bbdai/09-letter-m.git main:gh-pages

# 回到專案根目錄
cd ..
```

### 方案 B: 使用 Vercel 或 Netlify

這些平台提供免費託管，設定更簡單：
- 連結 GitHub repo
- 自動偵測 Vite 專案
- 每次 push 自動部署

---

## 📦 提交材料

### 1. 可運作的 Demo
https://bbdai.github.io/09-letter-m/

### 2. 原始程式碼
GitHub Repo: https://github.com/bbdai/09-letter-m

### 3. 技術說明文件
[TECHNICAL_DOCUMENT.md](./TECHNICAL_DOCUMENT.md)

---

## ⚠️ 常見問題

### ENAMETOOLONG 錯誤
這是 Windows 系統的路徑限制問題，建議：
1. 使用 GitHub Actions（推薦）
2. 使用手動部署方式
3. 使用其他部署平台

### 部署後頁面空白
確認：
- `vite.config.js` 的 `base` 設定為 `/09-letter-m/`
- 所有資源路徑正確
