# Letter M - 技術說明文件

## 一、專案概述

這是一個基於 Three.js 的 3D 互動字母 M 展示專案，實現了滑鼠互動、材質切換、自定義游標等功能。

**線上 Demo:** https://bbdai.github.io/letterM/  
**技術棧:** Vite + Three.js + GSAP

---

## 二、專案架構

### 2.1 目錄結構

```
09-letter-m/
├── src/
│   ├── index.html         # 主要 HTML
│   ├── style.css          # 全域樣式與自定義 cursor
│   ├── script.js          # 應用入口，初始化 Three.js
│   ├── three.js           # Three.js 核心邏輯
│   └── config.js          # 全域配置常數
├── static/
│   ├── letter_m1.glb      # 3D 字母 M 模型
│   ├── warehouse.hdr      # HDR 環境貼圖
│   ├── texture/           # 材質貼圖
│   ├── fonts/             # 字體
│   └── draco/             # Draco 解碼器
├── vite.config.js         # Vite 建構配置
└── package.json
```


## 三、動畫邏輯

### 3.1 基礎旋轉動畫

- 在 `tick()` 方法中持續更新：
  - 字母 M 的 Z 軸旋轉
  - 點光源位置（跟隨滑鼠）
  - 字母 M 位置（反向跟隨滑鼠，產生視差效果）

### 3.2 滑鼠互動加速

**技術實現:**
- 使用 `Raycaster` 檢測滑鼠是否懸停在 3D 物件上
- 使用 **GSAP** 實現旋轉速度的平滑過渡
- 懸停時：0.002 → 0.02（加速 10 倍）
- 過渡時間：0.8 秒，緩動函數：`power2.out`


### 3.3 材質切換動畫

**技術實現:** 
- 滾輪滾動觸發材質切換
- 使用 **GSAP** 實現 3 種材質(金屬、透明玻璃、磨砂)切換動畫


---

## 四、效能考量

### 4.1 模型優化

- **Draco 壓縮**: GLB 模型使用 Draco 壓縮，減少 50-90% 檔案大小
- **解碼器路徑**: 使用相對路徑 `./draco/` 確保部署後正確載入
- **幾何體共用**: 所有材質共用同一個 geometry，節省記憶體

### 4.2 貼圖優化

- 使用 WebP 格式（壓縮率比 JPG/PNG 更高）
- 貼圖尺寸適中，平衡品質與效能

### 4.3 渲染優化

```javascript
// 限制裝置像素比，避免過度渲染
this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// 啟用抗鋸齒
antialias: true

// 視窗 resize 時更新渲染器尺寸
window.addEventListener('resize', () => this.resize())
```

---

## 五、使用的 Library 與理由

### 核心框架與理由

| Library      | 用途      | 選擇理由                            |
| ------------ | --------- | ------------------------------- |
| **Three.js** | 3D 渲染引擎 | WebGL 熱門的封裝庫，生態豐富，文檔完整         |
| **GSAP**     | 動畫庫     | 效能優異，API 直觀，支援時間軸，控制程度高 |
| **Vite**     | 建構工具    | 開發伺服器快，原生 ESM，熱更新體驗佳          |


---

## 六、專案特色

### 6.1 互動設計

- **滑鼠 Hover**: 字母 M 旋轉加速
- **滾輪**: 3D 翻轉動畫 + 材質切換
- **滑鼠移動**: 
  - 字母 M 反向跟隨（視差效果）
  - 點光源跟隨滑鼠位置

---

## 七、如何執行專案

### 7.1 安裝依賴
```bash
npm install
```

### 7.2 開發模式
```bash
npm run dev
```
啟動本地開發伺服器（預設 http://localhost:5173/）

### 7.3 建構生產版本
```bash
npm run build
```
輸出到 `dist/` 資料夾

### 7.4 部署到 GitHub Pages
```bash
npm run deploy
```
自動建構並推送到 `gh-pages` 分支

---


**製作者:** Dai  
**完成日期:** 2025-12-11  
**Demo:** https://bbdai.github.io/letterM/
