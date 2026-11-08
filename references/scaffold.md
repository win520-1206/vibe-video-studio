# 无预设视觉场景的工程底座

`node scripts/create-project.mjs <新目录>` 创建独立工程；目标非空停止。保留Remotion、统一帧时间、音乐分析、事件、完整确认稿、布局测量、局部渲染与打包工具。默认的 `shared/scene-registry.mjs` 与 `src/scenes.tsx` 注册表为空，不生成背景球、点阵、轨迹或固定片头。先读[主题设计](theme-led-design.md)。

## 编写本题材的镜头

配置使用 `kind: authored` 和项目自定的 `renderer` ID。先在 shared/scene-registry.mjs 注册 `{state(ctx), validate(scene)}`，再在 src/scenes.tsx 用同一ID注册React视图。科学模型放项目自己的shared模块，视图可选SVG、Canvas、WebGL或混合技术。状态是纯函数，可任意帧重建。

state返回 `{objects, protectedRegions, phase, expected, metrics}`。objects的每项为稳定id与归一化屏幕x/y；可另含worldX/worldY供排除相机运动的检查。protectedRegions用 `{id,x,y,w,h}`，保护主要对象。phase为prepare/develop/hold等语义阶段；expected为subject/hold/media。metrics只放解释过程的可审查量，不能靠逐帧时间戳让静止主体通过检查。复杂形变须提供代表性特征点和模型量；Blender要结合最终抽帧。

场景声明 `anchorIds: []`，使用锚定时填入对应稳定ID，运行时对象缺失会报错。main文字在阅读开始位置冻结，label可跟随。完整确认稿仍使用captions及script-manifest；textCues引用sourceId。先规范原稿，再按动作设计位置、出现时间和字效，不自动交替左右布局。

上下文包含frame/fps/width/height/time/localTime/scene/episode/seed/style/signal/event。跨镜接续由本题材共享模型和全片时间设计，不默认切换后重复入场。换曲/选段/帧率变化需重算特征；局部渲染仍按全片绝对帧取音频。

## 命令与诊断

生成后运行npm ci；安装requirements.txt；填写本次配置与科学依据。`doctor`检查环境并实渲染；`analyze:music`生成音乐特征和混音；`dev`预览；`stills`抽帧；`render`导出；`check`检查实际文件；`package`打包。字体、编码器、浏览器通过实际检测或环境变量指定。未实现renderer时报错，不用通用场景补位。

`--demo`仅将assets/diagnostics中的两个原创接口测试复制到独立工程：一条传播波形与多路径展开，用于验证不同renderer、时间轴、文字与音乐管线。它们不解释科学，也不是成片质量样板。正常创建不会带入这些视图或模型。演示的8秒/24fps/横屏不是项目默认值。

## 迁移与Blender

此版清除旧视觉组件，旧walk/distribution配置不能直接交给新底座渲染。既有作品的工程与依赖原样保留，继续使用自己的引擎。主动迁移时需为其主题重新实现renderer并核验模型，禁止静默替换。新配置schemaVersion为3。

Blender仍是可选逐镜路线，kind为blender时沿用media帧率、帧数、源起始帧与事件映射，详见[Blender](blender.md)。没选Blender不检测或安装它。其他技术检查和手工审看范围见[验收](verification.md)。


## 创作表

plan:shots和check:creative用于创作表。前者从原始配置生成不覆盖的创作表，后者核查并刷新qa阅读版，无需先实现renderer。独立示范用scripts/create-study.mjs按ID创建，正常项目不自动复制；详见[融合叙事](creative-narrative.md)。

音乐分析操作见[分析流程](music-analysis-workflow.md)，事件字段与包络见[节奏导演](music-direction.md)。
