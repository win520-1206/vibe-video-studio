---
name: vibe-cinematic-video
description: 按主题原创设计科学可视化视频，结合故事、模型动画、动态文字和音乐互动，使用Remotion与按需选用的Canvas、WebGL或Blender完成工程与交付。适用于科普短剧、知识短片及改善PPT感或雷同动画的任务。
---

# vibe-cinematic-video

让观众看见问题、理解机制，再产生顿悟和共鸣。复用制作工具，每个作品重新设计视觉对象与过程；禁止把上一作品的球体、点阵或随机游走换标题当成新片。

首次应用时告知用户。新作先集中询问尚缺的主题/科学问题、受众用途、集数与各集片长、画幅帧率、资料素材、样片或整片、输出位置。已确认的参数沿用，不重复问。用户授权自行决定时记录本次选择。示例的时长、集数、节拍均不是默认值。

## 构思与参考

先读[主题设计](references/theme-led-design.md)。参考的重点是“文字说到什么，画面就让它发生”：对象、条件、变化、结果必须能被看见。生活疑问适合时采用；科学实验、工程任务可从异常或目标冲突开场。不强制人生哲理，不用科学术语证明生活类比。科普短剧保留角色目标、阻碍与验证，不做成资料轮播。

拆解用户参考，分别记录亲见的画面、实际听取的声音和算法推测。不要把关键帧观察说成逐秒审看，也不要复制具体文案、角色与画面。文档中的120秒、70%/30%仅为示例。主题模型和科学主张仍须查可靠来源。

在本次docs/visual-design.md中写主题对象、视觉隐喻、机制、尺度、动作语法、文字策略、音乐情绪与相较已有作品的区别。每镜写初态、条件、动作、结果、理解目标、依据、声音事件和接续方式。先设计主体，后设计相机、文字与光效。用装饰运动冒充解释性动作不合格。具体分镜见[scientific-shot-design.md](references/scientific-shot-design.md)。

## 音乐与文字

默认风格cinematic-spatial保留深色、电影感与有限强调色，但不预设球体、粒子或固定镜头。用户可覆盖风格。默认音乐以assets/defaults.json登记的本机下载版为准；优先使用本次用户音乐，其次已选登记曲目，再用默认曲。公开分发不附私人曲目，缺失时询问位置或替换素材。

新曲分析频段、瞬态、节奏、段落与高潮候选，区分算法建议和实际审听；按本次故事、时长、选段与帧率重新确定卡点。关键理解对应音乐揭示，留出阅读和余韵；不每拍切镜、不固定17秒、不颠倒因果。参见[music-adaptation.md](references/music-adaptation.md)。未分离混音不能称纯BGM；下载版也不自动等于无声乐音轨。

原稿先短句化；确认后保留完整内容及限制条件。画面文案分时呈现，叙事大字、对象标签和公式各有分工，不常驻“标题+底部整句+说明”。排版随对象与构图选择，不自动左右交替。字效后留稳定阅读，完整SRT仍用确认稿。详见[dynamic-text-and-motion.md](references/dynamic-text-and-motion.md)。

## 工程实现

读[scaffold.md](references/scaffold.md)创建独立工程：`node scripts/create-project.mjs <新目录>`。目标非空停止。模板只有制作管线，场景注册表为空；按本题材编写共享状态与renderer，同名注册模型和视图。无通用视觉回退。`--demo`为隔离的接口诊断，不是成片模板或默认参数。

React精确排字，Canvas/SVG解释图形，WebGL处理空间或大量对象，复杂实体、材质、剖切和装配可逐镜评估[Blender](references/blender.md)，不强制启用或自动安装。模型独立，时间由frame/fps计算，固定随机种子，支持乱序与局部渲染。动作、文字强调、音效引用同一事件。更多见[架构](references/architecture.md)、[工程](references/engineering.md)。

旧作品工程不覆盖。此版移除旧视觉组件，旧walk/distribution配置继续用其原工程；主动迁移需编写主题renderer，不宣称旧配置可直接套新模板。

## 推进与交付

需求和参考 → 科学依据 → 原稿与动作分镜 → 音乐选段/事件映射 → 主题镜头实现 → 代表片段 → 成片与验收。音乐分析可提前并行推进，不强制机械线性流程。已授权整片时不增加不必要的确认关卡。

验收包括模型、确认稿覆盖、稳定阅读、文字越界和遮挡、主体变化、镜头接缝、确定性、音乐位置与实际解码。看实际片段判断理解、审美和声画互动；自动检查不能代替科学核验、连续观看和审听。参见[verification.md](references/verification.md)、[scientific-integrity.md](references/scientific-integrity.md)。

交付约定的视频、SRT、工程、依据和验收记录；明确未做的检查。原输入、私人音乐与公开分发分别管理，不把本机路径、参考视频、成片或缓存带入公开包。任务授权范围外不自行推送GitHub。

## 按需资源

- [workflow.md](references/workflow.md)：需求与迭代；[project-contract.md](references/project-contract.md)：调用约定。
- [motion-and-audio.md](references/motion-and-audio.md)：运动与声音；[production-lessons.md](references/production-lessons.md)：制作经验。
- scripts/audio_features.py：PCM WAV按帧特征；scripts/music_structure.py：节拍和高能段候选；scripts/inspect_media.py：媒体规格。
- assets/defaults.json与assets/styles/：资源和美术偏好；assets/project-contract.example.json：待填项目配置。
