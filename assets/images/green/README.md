# 图片绿色增强

使用内置 imagegen 逐张编辑 14 张图片。保留黑色背景、原有主体、构图、材质及图中文字，在图表、玻璃棱边、节点与局部反射中增加草绿色和柔和翠绿高光。含字图片分别保留中文及英文版本；无文字图片两种语言共用。

详情页原有强制黑白滤镜改为 `brightness(.72) saturate(.9)`，显示图片自身的绿色，同时保留深色背景与标题对比度。页面内容、动画和前次修改的白底动画区域保持原样。

完整提示词与逐张编辑记录：

- [首页卡片：D.FRisk、D.FCP、RegLens 中英版](cards-a-prompts.md)
- [首页卡片：RegWiki、RegInsights、AIGovCube、D.QRM](cards-b-prompts.md)
- [详情头图：网络地图、知识库、财务预测](heroes-a-prompts.md)
- [详情头图：D.FRisk 中英版、监管走廊](heroes-b-prompts.md)

资源对应关系见 `assets/green-image-map.json`，含字图片的语言映射见 `assets/image-localization.json`。全部 PNG 保存在本目录，不依赖生成工具的临时输出路径。
