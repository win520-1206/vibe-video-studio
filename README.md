# vibe-video-studio

让知识成为可观看的过程，让音乐参与理解。

面向AI编码助手的视频制作Skill，覆盖选题、文案、科学依据、动作分镜、主题动画、音乐适配、Remotion合成与交付。适合科学可视化、科普短剧，以及融合知识与生活思考的短片。

## 创作方式

每个主题重新选择对象、尺度、动作与镜头，不用同一套粒子球或点阵换标题。动画呈现条件、变化和结果，文字分时解释，音乐参与蓄势与揭示；情绪来自过程，科学事实、教学模型、类比和作者观点各有边界。

默认美术偏好是深色空间、有限强调色与电影感，可按项目调整。普通新工程只有制作管线，场景注册表为空，需要按题材编写模型与视图。集数、各集片长、横竖屏、帧率和高潮位置均按本次任务确定。

## 安装与调用

Skill名称为`vibe-video-studio`，仓库地址为`win520-1206/vibe-video-studio`。

```bash
npx skills add win520-1206/vibe-video-studio --skill vibe-video-studio
```

用户级Codex安装：

```bash
npx skills add win520-1206/vibe-video-studio --skill vibe-video-studio --agent codex --global
```

命令通过npm运行skills安装器，从GitHub读取Skill，无需另发同名npm包。也可将整个Skill文件夹复制到助手的skills目录。其他网站是否展示取决于其索引规则。

```text
使用 $vibe-video-studio 做一部关于反馈与稳定性的知识短片。
面向大学生，结合生活中的反复修正，先交可播放样片。
分析我提供的音乐，按机制设计对象变化，不沿用上一部的动画。
```

助手会集中确认尚缺的主题、受众、思考、集数和片长、画幅帧率、素材音乐及交付位置，沿用已经确认的选择。

## 从想法到影片

1. 读取参考与资料，明确疑问、科学机制及适用条件。
2. 精简文案，推导主体的初态、条件、动作和结果，设计认识与情绪变化。
3. 分析音乐，结合本次时长选段，把关键理解与声音事件关联。
4. 编写主题模型与镜头，让主体持续演变；动态短句、对象标签与公式各司其职，保留稳定阅读。
5. 用真实片段检查动作与音乐，再完成渲染、科学复核、审看审听和约定交付。

完整确认稿与SRT保留全部含义、数字和条件；画面不默认长期堆叠标题、底部整句及说明。创作表引用原场景、文案和事件ID，不维护第二套时钟。

## 可复现的音乐适配

整曲分析可以先于分镜与工程完成：

```bash
python scripts/analyze_track.py --input "音乐文件" --output "新的分析目录" --ffmpeg "ffmpeg路径"
```

产物含特征、起音和节拍候选、段落变化、声画动作组、报告、试听页及源文件/代码哈希与工具版本。输出目录非空时停止，保留已有笔记。项目内也可用`npm run analyze:track -- --input ... --output ...`。

助手读取证据并结合主题选段，再用`analyze:music`重新分析实际选段，`plan:music`提出草稿，填写事件动作和反差后用`check:music`核验。起音检测独立于视频帧率；持续高能量不自动等于艺术高潮，不固定任何秒数。未实际听取时始终记录为候选。

主揭示设计蓄势、落点、衰减与落定。`ctx.accent(eventId)`把同一事件的包络提供给主体、文字或镜头，具体运动由题材决定，不默认每拍切镜或全屏闪光。换曲、选段或帧率后重新分析和核对。操作与数据边界见[音乐分析流程](references/music-analysis-workflow.md)。

## 工程使用

需要Node.js、Python与NumPy、可用的FFmpeg/ffprobe和Chrome/Edge/Chromium。工程依赖由package-lock.json锁定；工具路径可显式配置。Blender只在选定复杂三维镜头时使用，不作为基础依赖或自动安装。

在Skill根目录创建独立工程：

```bash
node scripts/create-project.mjs ../my-film
cd ../my-film
npm ci
python -m pip install -r requirements.txt
```

目标非空时停止。填写project-contract.json、script-manifest.json和docs；在shared/scene-registry.mjs及src/scenes.tsx注册同名主题renderer。科学模型与绘图分离，以帧、固定种子及共享状态重建任意时刻。React排字，SVG/Canvas画图解，WebGL处理空间与大量对象；Blender输出选定镜头，Remotion统一合成。

| 阶段 | 命令 | 作用 |
| --- | --- | --- |
| 音乐勘察 | `analyze:track` | 未完成分镜时也可分析音轨 |
| 创作表 | `plan:shots` / `check:creative` | 草稿、覆盖与引用检查 |
| 项目音频 | `analyze:music` | 实际选段、特征与混音 |
| 声画设计 | `plan:music` / `check:music` | 事件候选、指纹与落点核验 |
| 环境和预览 | `doctor` / `dev` | 工具检查、实际检查帧及预览 |
| 输出 | `stills` / `render` | 关键帧、全片或绝对帧范围渲染 |
| 验收交付 | `check` / `package` | 技术检查、视频、SRT与工程打包 |
| 可选三维 | `blender:render` | 指定镜头的离线三维渲染 |
| 开发验证 | `typecheck` / `test` / `test:audio` | 类型、状态与音频管线回归 |

分析入口共用music_pipeline.py。缓存只复用相同PCM、参数、实现与环境的结果；整曲报告和项目混音保持各自的时间映射。详见[资源与缓存](references/music-adaptation.md)。

## 诊断与机制示范

只验证制作接口时，可用`node scripts/create-project.mjs ../pipeline-test --demo`创建独立诊断。波形/分支视图和合成测试音乐不进入普通项目，不是成片质量模板。

```bash
node scripts/create-study.mjs interference ../wave-study --music /path/to/music.mp3
node scripts/create-study.mjs feedback ../feedback-study --music /path/to/music.mp3
```

两个原创示范分别使用波的干涉与反馈纠偏，展示不同主题的对象、动作与表达；示范参数仅用于验证，更换音乐仍需重新选段和设计事件。[融合叙事](references/creative-narrative.md)记录从文案推导动作的过程。旧作品保留原工程，旧walk/distribution配置迁入新底座时需要主题renderer，不自动改写。

## 文档导航

| 需要解决的问题 | 阅读 |
| --- | --- |
| 需求、调用与修改范围 | [工作流](references/workflow.md)、[项目约定](references/project-contract.md) |
| 主题原创、文案与情绪 | [主题设计](references/theme-led-design.md)、[融合叙事](references/creative-narrative.md) |
| 分镜、文字与科学边界 | [科学镜头](references/scientific-shot-design.md)、[动态文案](references/dynamic-text-and-motion.md)、[科学核验](references/scientific-integrity.md) |
| 分析音乐和复核候选 | [分析流程](references/music-analysis-workflow.md) |
| 主揭示、事件与包络 | [节奏导演](references/music-direction.md) |
| 选曲、长度与缓存 | [音乐资源](references/music-adaptation.md) |
| 运动、相机、声音与混音 | [动作与声音](references/motion-and-audio.md) |
| 接口、环境与三维 | [脚手架](references/scaffold.md)、[架构](references/architecture.md)、[工程](references/engineering.md)、[Blender](references/blender.md) |
| 验收、交付与排错 | [验收](references/verification.md)、[制作经验](references/production-lessons.md) |

## 文件职责与交付边界

```text
SKILL.md                  助手入口与按需文档路由
agents/                   助手界面元数据
references/               分工明确的创作、音乐、工程与验收说明
scripts/                  创建工程、分析音频及检查媒体
assets/defaults.json      本机默认资源和偏好
assets/styles/            美术方向
assets/project-template/  无预设镜头的可运行管线
assets/diagnostics/       隔离接口诊断
assets/studies/           独立原创机制示范
```

技术检查覆盖配置、完整稿、阅读窗口、越界遮挡、模型状态、事件、确定性和媒体。科学准确、连续观看、实际审听与主观冲击分别记录，自动通过不能替代人工判断。具体已运行范围见[验证记录](assets/validation-report.json)。

私人音乐只保存在本地。公开包排除音乐原文件、参考视频、成片、依赖缓存、凭证和本机绝对路径。交付根据约定包含视频、SRT、工程、素材来源及验收记录。

参考与第三方依赖见[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。仓库尚未单独声明整体代码许可证；第三方组件遵循各自许可证。
