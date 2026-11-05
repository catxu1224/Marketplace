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

所有图片内嵌在 HTML 中，无需另行上传图片，无需前端依赖或构建命令。各页面使用相对路径，可直接打开首页预览。

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

“进入产品体验”按钮链接到外部产品演示服务，其可用性由外部服务决定。附件中 D.FCP 的地址原文末尾为 `netlify anp`，目前暂按 `netlify.app` 整理，正式发布前请核对；RegInsights 能力说明部分存在截断，页面内容依据附件完整概述整理。
