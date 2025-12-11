# Letter M - 技術說明文件

## 專案概述

這是一個基於 Three.js 的 3D 互動字母 M 展示專案，結合了多種材質切換、滑鼠互動效果

---

## 專案架構

### 目錄結構

```
09-letter-m/
├── src/
│   ├── index.html          # 主要 HTML 結構
│   ├── style.css           # 全域樣式與自定義 cursor 樣式
│   ├── script.js           # 應用程式入口
│   ├── three.js            # Three.js 核心邏輯
│   └── config.js           # 全域配置常數
├── static/
│   ├── letter_m1.glb       # 3D 字母 M 模型
│   ├── warehouse.hdr       # HDR 環境貼圖
│   ├── texture/            # 材質貼圖
│   ├── fonts/              # 字體
│   └── draco/              # Draco 壓縮解碼器
├── vite.config.js          # Vite 建構配置
└── package.json
```

### 架構設計 

1. **`script.js`** - 應用程式入口，負責初始化與自定義 cursor
2. **`three.js`** - 核心 3D 場景邏輯
3. **`config.js`** - 全域配置常數

---

## 動畫邏輯

### 滑鼠互動加速旋轉

使用 **Raycaster** 檢測滑鼠是否懸停在字母 M 上，搭配 **GSAP** 實現平滑的旋轉速度過渡：

- **懸停時**: 旋轉速度從 `0.002` 加速到 `0.02`
- **離開時**: 旋轉速度恢復到 `0.002`
- **過渡動態**: 0.5 秒，使用 `power2.out` 做為過渡動態曲線

### 材質切換動畫

滾輪滾動時切換 3 種預設材質，並搭配 360 度旋轉動畫


---

## 效能考量

### 1. 模型優化

- **Draco 壓縮**: 使用 DRACOLoader 載入壓縮的 GLB 模型，減少 50-90% 檔案大小

### 2. 貼圖優化

- 所有貼圖使用 **WEBP 格式**，減少檔案大小
- HDR 環境貼圖使用較小的解析度

### 3. 渲染優化

- 啟用抗鋸齒 (antialias)
- 限制裝置像素比為最大 2，避免在高解析度螢幕上過度渲染

---

## 使用的 Library 與理由

### 核心 Libraries

| Library | 用途 | 選擇理由 |
|---------|------|----------|
| **Three.js** | 3D 渲染引擎 | 熱門的 WebGL library，生態系統完整，文檔豐富 |
| **GSAP** | 動畫庫 | 效能優異，API 直觀，且有時間軸功能，適合複雜動畫控制 |
| **Vite** | 建構工具 | 快速的開發伺服器，熱更新體驗佳 |


---

## 如何執行專案

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

**製作者:** Dai  
**建立日期:** 2025-12-11
**模型來源:** [https://skfb.ly/oNO9V](https://skfb.ly/oNO9V)
