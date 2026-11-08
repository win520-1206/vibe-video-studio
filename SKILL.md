---
name: vibe-video-studio
description: 按主题原创设计融合知识、模型动画与情绪表达的科学可视化视频，结合故事、动态文字和音乐互动，使用Remotion与按需选用的Canvas、WebGL或Blender完成工程与交付。适用于科普短剧、知识短片及改善PPT感或雷同动画的任务。
---

# vibe-video-studio

让知识成为可观看的过程，让音乐参与理解。复用制作管线，每个作品重新设计对象、运动与镜头；融合知识、动画和情绪，不划分科普/哲理模式，不固定故事结构或内容比例。

## 开始任务

首次应用时告知用户。集中询问尚缺的主题与科学问题、受众用途、希望传达的思考、集数与各集片长、画幅帧率、素材音乐、样片或整片以及输出位置。沿用已确认参数；用户授权自行决定时记录本次选择。没有默认集数、片长或高潮秒数。需求与迭代见[工作流](references/workflow.md)，字段见[调用约定](references/project-contract.md)。

阅读参考时分别记录亲见画面、实际听取与算法推测，不把抽帧当连续审看。借鉴表达机制，不复制文案、角色和画面；科学主张核验可靠来源。

## 创作与分镜

1. 用[主题设计](references/theme-led-design.md)选择对象、尺度、机制与动作语法，写入项目docs/visual-design.md。从生活疑问、异常、工程任务或冲突切入；科普短剧保留角色目标、阻碍与验证。
2. 按[融合叙事](references/creative-narrative.md)连接问题、机制、认识变化与情绪。共鸣可以贯穿过程，结尾回应开场；科学机制不能证明人生结论。事实、教学模型、类比与作者观点分别说明边界。
3. 依[科学镜头设计](references/scientific-shot-design.md)写每镜的初态、条件、动作、结果、理解目标、依据与接续。先让主体承担解释，再安排相机、材质与光效，不用装饰运动代替变化。
4. 原稿确认前完成短句化与删冗；确认后保留数字、条件与完整含义。按[动态文字](references/dynamic-text-and-motion.md)分时呈现叙事短句、对象标签和公式，留稳定阅读阶段，完整SRT仍用确认稿。不默认三层文字或底部整句。

场景、原稿和事件ID确定后运行`plan:shots`，填写creative-plan.json，再运行`check:creative`。创作表只引用已有配置，不建立重复时钟；不覆盖已有填写内容。科学边界见[科学核验](references/scientific-integrity.md)。

## 音乐适配

本次用户选曲优先，其次沿用已选曲，再使用assets/defaults.json登记的本机默认音乐。默认风格cinematic-spatial与选曲独立；公开包不附私人音轨，缺失时询问素材位置，不静默替换。

- 收到音乐时执行[可复现分析流程](references/music-analysis-workflow.md)：整曲分析→阅读报告与候选→必要试听→选段→项目分析→事件绑定→实际片段验证。助手将证据转成主题动作，不要求用户填写工程ID。大致高潮位置只是线索。
- 按[节奏导演](references/music-direction.md)设计蓄势、落点、衰减与落定；主揭示有具体的主体、景别、速度或密度反差，次级起音只在有表达收益时驱动动作。`plan:music`生成草稿，填写episode.musicDirection后用`check:music`核对；`ctx.accent(eventId)`供主题renderer使用。
- 默认素材、选段不足与缓存规则见[音乐资源适配](references/music-adaptation.md)，相机、音效与混音见[动作与声音](references/motion-and-audio.md)。科学因果与阅读优先，不为卡点伪造模型。

算法输出保持候选，未实际听取不标confirmed，不称已识别鼓、强拍或艺术高潮。换曲、选段、速度或fps变化后重算/核验。数值对齐不能代替实际声画冲击判断。

## 工程实现

用[脚手架](references/scaffold.md)创建独立工程：`node scripts/create-project.mjs <新目录>`，目标非空停止。普通工程的模型与视图注册表为空，按主题注册同名renderer，没有通用球体、点阵或固定片头回退。既有作品不覆盖；旧walk/distribution工程继续使用自己的引擎，迁移需明确实现与核验。

React负责精确文字，SVG/Canvas负责图解，WebGL负责空间与大量对象；复杂实体、装配、剖切与材质逐镜评估[Blender](references/blender.md)，不强制安装或静默替代。各层共享帧时间、模型状态、音乐与事件；模型独立、固定种子、支持乱序和局部渲染。架构见[architecture.md](references/architecture.md)，环境与渲染见[engineering.md](references/engineering.md)。

`--demo`仅用于隔离接口诊断；`create-study.mjs interference|feedback <新目录>`用于独立原创机制示范。示范的参数和场景都不自动进入新作。

## 验收与交付

已授权整片时持续推进，不新增不必要的确认关卡。按[验收规范](references/verification.md)检查确认稿覆盖、稳定阅读、越界遮挡、主体变化、接缝、确定性、音乐位置和完整解码。科学核验、连续观看和实际审听分别记录；自动通过不等于表达质量通过。排错经验按需读[production-lessons.md](references/production-lessons.md)。

交付约定的视频、SRT、工程、来源与验证记录，说明未做的检查。公开包排除私人音乐、参考视频、成片、缓存、凭证和本机绝对路径。没有本次发布授权不自行推送GitHub。
