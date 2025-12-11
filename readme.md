# Letter M - 技術說明文件

## 📋 專案概述

這是一個基於 Three.js 的 3D 互動字母 M 展示專案，結合了多種材質切換、滑鼠互動效果。

---

## 🏗️ 專案架構

### 目錄結構

```
09-letter-m/
├── src/
│   ├── index.html          # 主要 HTML 結構
│   ├── style.css           # 全域樣式與自定義 cursor 樣式
│   ├── script.js           # 應用程式入口
│   ├── three.js            # Three.js 核心邏輯類別
│   ├── config.js           # 全域配置常數
│   └── shaders/            # GLSL Shader 檔案
├── static/
│   ├── letter_m1.glb       # 3D 字母 M 模型
│   ├── warehouse.hdr       # HDR 環境貼圖
│   ├── texture/            # 各種材質貼圖
│   ├── fonts/              # 自定義字體
│   └── draco/              # Draco 壓縮解碼器
├── vite.config.js          # Vite 建構配置
└── package.json
```

### 架構設計

專案採用**單一職責原則**設計：

1. **`script.js`** - 應用程式入口，負責初始化與自定義 cursor
2. **`Three` 類別 (`three.js`)** - 核心 3D 場景邏輯
3. **`config.js`** - 全域配置常數

---

## 🎬 動畫邏輯

### 1. 基礎旋轉動畫

使用 `requestAnimationFrame` 實現流暢的 60fps 動畫循環，在 `tick()` 方法中持續更新字母 M 的旋轉、星星粒子系統位置、以及點光源位置。

### 2. 滑鼠互動加速旋轉

使用 **Raycaster** 檢測滑鼠是否懸停在字母 M 上，搭配 **GSAP** 實現平滑的旋轉速度過渡：

- **懸停時**: 旋轉速度從 `0.002` 加速到 `0.02`
- **離開時**: 旋轉速度恢復到 `0.002`
- **過渡時間**: 0.5 秒，使用 `power2.out` 緩動函數

### 3. 材質切換動畫

滾輪滾動時切換 5 種預設材質，並搭配 360 度旋轉動畫：

- 使用 `isAnimating` 標誌防止動畫進行中重複觸發
- 每次切換執行 1.5 秒的旋轉動畫
- 動畫開始時立即切換材質

**5 種材質類型:**
1. 基礎材質 (白色)
2. 噪點材質 (noise.jpg)
3. 法線貼圖材質 (normal.jpg)
4. 霧面玻璃材質 (frosted.jpg)
5. 大理石材質 (marble.jpg)

---

## ⚡ 效能考量

### 1. 模型優化

- **Draco 壓縮**: 使用 DRACOLoader 載入壓縮的 GLB 模型，減少 50-90% 檔案大小
- **模型簡化**: 字母 M 模型經過拓撲優化，平衡視覺品質與多邊形數量

### 2. 貼圖優化

- 所有貼圖使用 **JPG 格式**，平衡品質與檔案大小
- HDR 環境貼圖提供真實的光照效果

### 3. 渲染優化

- 啟用抗鋸齒 (antialias)
- 限制裝置像素比為最大 2，避免在高解析度螢幕上過度渲染
- 設定 `powerPreference: 'high-performance'` 優先使用高效能 GPU

### 4. 事件節流

- 滑鼠移動事件受 `requestAnimationFrame` 自然節流
- 滾輪事件使用 `isAnimating` 標誌防止連續觸發

---

## 📚 使用的 Library 與理由

### 核心 Libraries

| Library | 版本 | 用途 | 選擇理由 |
|---------|------|------|----------|
| **Three.js** | ^0.174.0 | 3D 渲染引擎 | 最流行的 WebGL library，生態系統完整，文檔豐富 |
| **GSAP** | ^3.12.7 | 動畫庫 | 業界標準的動畫庫，效能優異，API 直觀 |
| **Vite** | ^6.2.2 | 建構工具 | 快速的開發伺服器，原生 ES Modules 支援，熱更新體驗極佳 |

### Three.js Addons

- **GLTFLoader**: 載入 GLTF/GLB 3D 模型格式
- **DRACOLoader**: 解碼 Draco 壓縮的模型，大幅減少檔案大小
- **RGBELoader**: 載入 HDR 環境貼圖，提供真實光照

### 開發工具

- **vite-plugin-glsl**: 支援直接 import GLSL shader 檔案
- **lil-gui**: 輕量級的 GUI 調試工具

---

## 🚀 如何執行專案

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

### 建構生產版本
```bash
npm run build
```

### 部署到 GitHub Pages
```bash
npm run deploy
```

---

## 🎨 功能特色

1. ✨ **自定義 Cursor**: 跟隨滑鼠的自定義游標
2. 🎯 **滑鼠互動**: Hover 字母 M 時旋轉加速
3. 🎨 **材質切換**: 滾輪滾動切換 5 種不同材質
4. ⭐ **背景粒子**: 視差效果的星星背景
5. 💡 **動態光源**: 點光源跟隨滑鼠移動
6. 🌟 **環境光照**: HDR 環境貼圖提供真實反射

---

**製作者:** Dai  
**建立日期:** 2025-12-11
