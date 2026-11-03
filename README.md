# vibe-cinematic-video

**让知识成为可观看的过程，让音乐参与理解。**

融合知识、动画与情绪表达的AI编码助手Skill，覆盖选题、科学依据、剧情与分镜、主题动画、音乐适配、Remotion渲染和交付。适合科学可视化、科普短剧、知识与生活思考短片，以及需要改善PPT感或重复动画的作品。

## 创作方式

每个主题重新设计对象、过程、尺度和镜头，不提供可套用全片的球体、点阵或随机游走场景。保留统一的时间轴、音乐分析、动态文字和渲染检查工具，将制作效率与视觉原创分开处理。

以“好奇—理解—顿悟—共鸣”检查观众的观看体验，按题材组织故事。生活问题可以引出知识，实验、工程与宇宙题材也可从异常、任务或悖论切入。动画展示条件与变化；科学事实、教学模型和生活类比分别说明。不强制哲理结尾，不固定知识与情绪比例。

默认美术偏好为深色空间、有限强调色与电影感；具体主体、动作、字体布局、材质和转场按本题材设计。Canvas、SVG、WebGL及Blender逐镜选择，不为追求统一技术而牺牲表达。

## 从认识到共鸣

知识与哲理融合在同一创作流程：用真实机制回答问题，让动画中的等待、变化、对照和修正带动情绪，结尾回应开场。科学事实、教学模型、生活类比和作者观点各有边界。默认不划分科普/哲理模式，不规定内容比例。

场景与文案确定后运行`npm run plan:shots`，填写creative-plan.json，再用`npm run check:creative`核对场景覆盖、原稿、事件及创作项。不会覆盖已有草稿，不要求先实现renderer，不影响旧工程原命令。结构通过后，表达质量仍需观看与审听。

完整示例与接口见[知识、动画与情绪](references/creative-narrative.md)。可在Skill根目录创建两个独立验证工程：

```bash
node scripts/create-study.mjs interference ../wave-study --music /path/to/your-music.mp3
node scripts/create-study.mjs feedback ../feedback-study --music /path/to/your-music.mp3
```

示范使用波的干涉和反馈纠偏，以不同对象和动作展示从疑问到理解、再到思考的推导。18秒、30fps仅服务本轮验证；它们不会进入普通新工程。公开包只提供源码与资料，不附私人音轨或验证成片。更换示范音乐后仍需重新选段和调整事件，不能保留不适合新曲的固定落点。

## 安装

安装Node.js后，可通过skills CLI安装：

```bash
npx skills add win520-1206/vibe-cinematic-video --skill vibe-cinematic-video
```

用户级Codex安装：

```bash
npx skills add win520-1206/vibe-cinematic-video --skill vibe-cinematic-video --agent codex --global
```

此命令通过npm运行skills安装器，从GitHub读取Skill；本仓库不需要另行发布同名npm包。也可手动将包含SKILL.md的整个文件夹放入助手的skills目录。发现网站的展示由其索引规则决定，安装命令并不等于已经被所有网站收录。

## 调用

在支持Skill的助手中调用 `$vibe-cinematic-video`，说明主题、受众用途、集数、各集时长、横竖屏、素材、音乐及先样片还是整片。缺少关键参数时助手会集中询问，已有选择继续沿用。题材、集数、片长和高潮时刻没有固定默认值。

```text
使用 $vibe-cinematic-video 做一部讲反馈与稳定性的知识短片。
先分析我给的音乐和参考，按机制设计对象变化。
避免沿用上一部的粒子球，先交可播放样片。
```

## 制作流程

1. 读取素材和参考，核验科学主张、适用条件和模型。
2. 写观众疑问与原稿，设计对象的初态、条件、变化和结果。
3. 填写视觉设计单，说明本题材的对象、尺度、镜头语言与旧作的区别。
4. 分析音乐、选择本次选段，把关键理解与揭示映射到声音事件。
5. 编写项目专属模型、状态与视图，实现文字分时呈现和镜头接续。
6. 用实际片段检查表达，再完成约定渲染、审看、审听及交付。

参考方法见[主题设计](references/theme-led-design.md)。保留完整确认稿及SRT；画面按动作呈现短语、大字、对象标签与公式，不默认“顶部标题＋底部整句＋常驻说明”。字效后保留稳定阅读，不用复杂运动掩盖信息不足。

## 工程底座

需要Node.js、Python与NumPy、Chrome/Edge/Chromium，以及可用的FFmpeg/ffprobe。依赖锁在工程模板内；工具路径支持显式配置。Blender按镜头需要启用，不自动安装。

从Skill根目录创建独立工程：

```bash
node scripts/create-project.mjs ../my-film
```

目标非空时停止。正常创建的 `shared/scene-registry.mjs` 与 `src/scenes.tsx` 均为空，需要按主题编写同名renderer。状态暴露稳定对象ID、位置、保护区域和解释性指标；视图选择React/SVG/Canvas/WebGL。未实现时明确报错，没有通用动画回退。

仅验证制作管线时可创建隔离的接口诊断：

```bash
node scripts/create-project.mjs ../pipeline-test --demo
cd ../pipeline-test
npm ci
python -m pip install -r requirements.txt
npm run analyze:music
npm run doctor
npm run stills
```

诊断用波形与分支两种不同视图，不是科学解释或视觉质量样板，普通工程不携带它们。诊断的参数不用于新片默认值。

| 命令 | 用途 |
| --- | --- |
| `plan:shots` | 生成不覆盖的创作表草稿与阅读版 |
| `check:creative` | 核查创作覆盖和引用，输出人工复核项 |
| `doctor` | 工具、依赖、素材及实际检查帧 |
| `dev` | Remotion预览 |
| `analyze:music` | 预计算音频特征、候选节奏与混音 |
| `stills` | 关键帧和布局取证 |
| `render` | 全片或按绝对帧局部渲染 |
| `check` | 配置、文案、布局、主体变化与实际媒体检查 |
| `package` | 已验收视频、SRT、工程与资料打包 |

接口与迁移见[脚手架](references/scaffold.md)，职责见[架构](references/architecture.md)。此版清除旧视觉组件，旧walk/distribution配置继续使用既有工程；迁移需重新编写主题renderer，不能直接把旧配置交给新模板。原作品不会自动更改。

## 音乐与可选Blender

本机默认使用用户指定的下载版，位置由assets/defaults.json登记。用户提供新曲时优先使用新曲；换曲、选段或帧率变化后重算特征。算法给出节拍、段落和高能区候选，关键卡点仍须结合实际听取与剧情确定。不会把某个秒数当成所有作品的高潮。

公开仓库与公开ZIP不附私人音乐和参考视频。可提供自己有权使用的音轨，或放到登记位置；缺失时助手会询问，不会擅自换歌。下载版不自动等于纯伴奏，未做音源分离时如实记录。

Blender适合复杂实体、装配、剖切、材质与照明；输出无声片段或透明序列，Remotion负责编排与文字。记录帧号映射、事件、源文件与参数。详见[音乐适配](references/music-adaptation.md)和[Blender](references/blender.md)。

## 验收与交付

自动检查配置、原稿覆盖、稳定阅读、越界遮挡、事件、主体状态、确定性及输出媒体。背景或相机运动不能证明主体在解释知识。实际观看判断叙事、主题差异与视觉效果，实际审听判断声画配合，科学依据需另行核验。

具体已运行项目和未验证范围见[验证记录](assets/validation-report.json)。技术通过不代表成片审美或科学结论自动通过。交付按用户约定包含视频、SRT、工程、素材来源与验收记录。

## 文件结构

```text
SKILL.md                  助手入口
references/               主题设计、科学表达、音乐、工程与验收
scripts/                  创建项目和音频/媒体分析
assets/defaults.json      默认资源与偏好
assets/styles/            美术方向
assets/project-template/  无预设视觉场景的运行底座
assets/diagnostics/       隔离接口测试
```

创作参考与许可边界见[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。仓库尚未单独声明整体代码许可证；第三方依赖与素材遵循各自许可。
