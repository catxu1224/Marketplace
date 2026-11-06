# Marketplace · 金融行业解决方案

黑白灰风格的静态多页面网站。总览页采用原版简洁小图，详情页包含主题头图、缓慢放大效果与产品动画。

## 页面

- `index.html`：默认总览首页。
- `financial_solutions_first_concept.html`：保留原总览地址，详情页的返回入口指向此页。
- `DFRisk_product_detail.html`：金融资产风险监测。
- `DFCP_product_detail.html`：银行财务与资本预测分析。
- `RegLens_product_detail.html`：金融业监管处罚分析。
- `RegWiki_product_detail.html`：银行监管数据报送知识百科。
- `RegInsights_product_detail.html`：金融外规内化对标分析洞察。

网站无需前端依赖或构建命令。各页面使用相对路径，可直接打开首页预览。图片、双语脚本和样式均位于 `assets/`，部署或复制网站时请一并保留该目录。

## 中英文切换

两个总览入口和七个产品详情页均提供右上角 `EN / CN` 切换，默认中文。切换会同步更新正文、导航、动画标签、暂停/播放按钮、页面标题、描述、无障碍标签和含文字图片。产品名及必要的技术缩写保留。

语言选择保存在浏览器中，站内页面链接也会携带语言。可以使用 `index.html?lang=en` 或 `index.html?lang=cn` 直接分享指定语言；URL 参数优先于已保存的偏好。禁止浏览器存储时，站内导航仍通过 URL 保留语言。

- `assets/locales.js`：共用的中英文文案词典；新增或修改文案时同步维护两种语言。
- `assets/i18n.js`、`assets/i18n.css`：切换行为与响应式样式，保留原页面的结构和动画交互。
- `assets/images/green/`：首页及详情页最新的绿色增强图片，共 14 张，保留黑底并增加绿色图表、节点、玻璃棱边和反射。D.FRisk 主图及 RegLens 文档图通过 `data-src-cn` / `data-src-en` 切换中英文；无文字图片两语共用。编辑提示词见该目录的 `README.md`。
- `assets/green-image-map.json`：原图片与绿色增强资源的对应关系。
- `assets/image-localization.json`、`assets/image-prompts.md`：图片映射、审查记录及内置 imagegen 的最终编辑提示词。

首页各产品卡片的“试用产品”和详情页的“申请试用”统一打开扫码弹窗，不跳转到真实产品服务。“了解产品”保留详情导航。弹窗支持中英文、关闭按钮、Esc、点击遮罩关闭，并在关闭后恢复焦点和滚动。

弹窗由 `assets/trial-dialog.js` 与 `assets/trial-dialog.css` 共用维护。`assets/trial-qr-reference.png` 是用户提供的原始截图，使用 CSS 仅显示其中的二维码区域，未重新生成二维码。

验证命令（Python 3.9+ 与 Node.js）：

```sh
python3 tests/check_localization.py
node --check assets/locales.js
node --check assets/i18n.js
node --check assets/trial-dialog.js
```

## Zeabur 部署

1. 在 Zeabur 创建项目，添加服务，选择从 GitHub 仓库部署。
2. 授权访问 `catxu1224/Marketplace` 并选择 `main` 分支。
3. 根目录使用仓库根目录；Zeabur 会自动识别根目录的 `Dockerfile`。无需设置安装命令或构建命令。
4. 服务默认监听 `8080` 端口；如平台提供 `PORT` 环境变量，Nginx 会自动使用该值。
5. 部署完成后，在网络设置中生成 Zeabur 域名，或绑定自定义域名。访问域名根路径即可进入总览页。
6. 后续提交到 `main`，可通过 Zeabur 的 GitHub 自动部署更新。

健康检查路径：`/healthz`。

本地容器预览（已安装 Docker 时）：

```sh
docker build -t marketplace .
docker run --rm -p 8080:8080 marketplace
```

随后访问 `http://localhost:8080`。

官方部署文档：https://zeabur.com/docs/en-US/deploy/methods/dockerfile

## 后续维护

修改总览时，请同步更新 `index.html` 和 `financial_solutions_first_concept.html`；修改详情时保留原文件名，即可继续使用现有导航。

试用申请统一通过扫码弹窗受理。RegInsights 能力说明部分存在截断，页面内容依据附件完整概述整理。


## 新增产品

- AIGovCube：AI治理魔方（AI应用风险评估）。
- D.QRM：风险量化模型智能体验证平台（英文简称暂定）。

两者保留站内产品动画入口，并提供统一的扫码申请试用入口。
