# 图片语言审查与本地化

生成方式：内置 `image_gen`，text-localization 编辑；四个变体分别调用。原图保留，新增图片存放在 `assets/images/`。一次 RegLens 中文生成因连接失败，使用同一内置工具重试成功。

## 审查范围

通过 12 张唯一源图的联系图审查整体，并单独查看 DFRisk hero、RegLens card、RegWiki card 的原尺寸。

| 源图 SHA-256 前 12 位 | 判断 | 处理 |
| --- | --- | --- |
| 31238a0953cb | 图表标题存在微小伪英文 | 制作中文、英文图表标题版 |
| b6d024080e0d | 纸质文档存在微小伪文字 | 制作中文、英文合规文档版 |
| 3a5ace20f1e7 | 图标、水平线与数字 04，无实际可辨单词 | 原图两语复用 |
| ae41e6cf9f3b | 图表、硬币与数字 01 | 原图两语复用 |
| 2f7075fbf581 | 金融图标与数字 02 | 原图两语复用 |
| a82ccea08499 | 天平与数字 05，无可辨单词 | 原图两语复用 |
| 7f95b02bd3f4 | 玻璃立方体，无文字 | 原图两语复用 |
| 83ac671b77dc | 风险曲线、对勾与几何图形，无文字 | 原图两语复用 |
| 5b3c3cceacdb | 放大镜与网络地图，无文字 | 原图两语复用 |
| ebfaf1334027 | 玻璃城市、书本，无文字 | 原图两语复用 |
| 9d57c09f7ee4 | 银行建筑与阶梯图表，无文字 | 原图两语复用 |
| 290777255b7c | 玻璃走廊，无文字 | 原图两语复用 |

## 最终提示词

### dfrisk-hero-cn.png

Use case: text-localization. Edit target: the provided DFRisk financial hero image. Preserve the original wide composition, exact object arrangement, globe, chart glass panels, lighting, black and silver tones, subtle pale green light, photorealistic glass and metal materials, and generous black left-side negative space. Change only the tiny garbled heading at the top left of the frontmost glass candlestick chart to the exact simplified Chinese words "风险监测". Make that heading clean, small, legible, and visually integrated in the glass chart. All other data labels should be numbers or neutral unlabeled chart marks; remove any other alphabetic text or pseudo-text. Do not add captions, logos, or other objects. Output one single localized hero image with the same landscape aspect ratio as the original.

### dfrisk-hero-en.png

Use case: text-localization. Edit target: the provided DFRisk financial hero image. Preserve the original wide composition, exact object arrangement, globe, chart glass panels, lighting, black and silver tones, subtle pale green light, photorealistic glass and metal materials, and generous black left-side negative space. Change only the tiny garbled heading at the top left of the frontmost glass candlestick chart to the exact English words "Risk Monitor". Make that heading clean, small, legible, and visually integrated in the glass chart. All other data labels should be numbers or neutral unlabeled chart marks; remove any other alphabetic pseudo-text. Do not add captions, logos, or other objects. Output one single localized hero image with the same landscape aspect ratio as the original.

### reglens-card-cn.png

Use case: text-localization. Edit only paper text in this vertical RegLens image. Preserve composition, magnifying glass, bank-and-shield emblem, documents, dark black-and-silver tones, lighting and material, framing and top-left "03". On the paper replace garbled lettering with exact simplified Chinese heading "监管合规" and three small lines "法规检索", "合规审查", "风险提示". Use neutral horizontal lines for the rest of the document. No English letters or pseudo-text. Keep text in perspective on paper, subordinate to the magnifying glass. No overlay or new objects. Same portrait aspect ratio.

### reglens-card-en.png

Use case: text-localization. Edit only paper text in this vertical RegLens image. Preserve composition, magnifying glass, bank-and-shield emblem, documents, dark black-and-silver tones, lighting and material, framing and top-left "03". On the paper replace garbled lettering with exact English heading "Regulatory Compliance" and three small lines "Regulation Search", "Compliance Review", "Risk Alerts". Use neutral horizontal lines for the rest of the document. No pseudo-text. Keep text in perspective on paper, subordinate to the magnifying glass. No overlay or new objects. Same portrait aspect ratio.

## 视觉验收

四张图均已检查生成结果：标题语言正确、原有金融视觉、灰黑色调、玻璃材质、横竖画幅保持一致；没有新增浮动文案。RegLens 的细小伪文字被替换为清晰且相关的中英文文案。生成式编辑使图表细节与文档线条略有变化，不用于表达真实金融数据。
