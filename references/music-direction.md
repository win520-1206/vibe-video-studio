# 节奏导演：把变化落在音乐上

## 先确定音乐结构，再安排关键动作

原稿的知识、情绪目标明确后，先分析本次音乐选段，再确定镜头节奏。不要先均匀分镜，再给背景加音量响应。已经确认的文案、时长或必需时刻作为约束；科学过程的顺序与真实模型参数不能为卡点随意改写。

区分四层：持续能量影响运动强弱；频段起音候选用于局部动作；拍网格提供节奏参考；段落变化与局部能量抬升帮助选择主揭示。检测不等于辨认底鼓、军鼓、强拍或小节第一拍。复杂曲目、变速与半倍/倍速歧义必须结合审听，算法不能决定艺术高潮。

高分辨率rhythm约每5ms采样，独立于视频fps；视频画面仍量化到帧。低/中/高频分开记录，保持原始时间与候选ID，避免把平滑的30fps低频包络直接当鼓点。impactCandidates使用前后能量抬升与攻击强度，climaxCandidates仍只是持续能量窗口，不能把最响的12秒自动当主高潮。

方法参考：[librosa起音文档](https://librosa.org/doc/main/api/generated/librosa.onset.onset_detect.html)、[节拍追踪文档](https://librosa.org/doc/main/api/generated/librosa.beat.beat_track.html)。本实现用NumPy编写频带谱通量与能量上升细化，没有引入librosa依赖或复制其算法代码，不能宣称具有完整乐器识别或音乐理解能力。

## 先选择主揭示，再安排次级重音

挑选与知识答案、认知反转或主体结构变化对应的主揭示；长作品可分段设计。周围留出可感知的反差：尺度由收束到展开，运动由克制到短促加速，信息从隐去到显现，景别由局部到整体。主揭示写明具体前态、动作和后态，优先组合主体、景别、速度或密度上的变化。光效和音效辅助强调，不以全屏闪光代替主体动作。

次级起音可以带动接触、点亮、计数、局部路径或短语强调；不是每拍都切镜，也不强制每拍亮度脉冲。固定节拍段可按听取后的乐句安排动作组，未知拍号不自动声称第几小节。公式与阅读段降低音乐驱动幅度，结果落定后允许保持。附加冲击音先听混音再决定，避免遮盖原曲或声音叠加过密。

## 项目操作与接口

从整曲分析到项目选段、草稿绑定和人工标记的操作统一见[音乐分析流程](music-analysis-workflow.md)。本文维护导演判断与运行时字段。配置了musicDirection的工程，render/check同时核验绑定；旧工程未配置时继续工作。

musicDirection包含analysisFingerprint、mainEventId、bindings。每个binding包含eventId、featureId、offsetFrames、toleranceFrames、reviewStatus(candidate/confirmed)、action；主binding增加contrast:{before,after,channels}。channels可记录subject/camera/motion/density/light。特征来自generated音乐分析，换曲、选段或fps后指纹不符必须重新核对。

人工审听标记可放manualMarkers:[{id:'manual-1',sourceSeconds, note}]，用featureId引用；时间按分析内sourceStart映射到本片，不修改生成的分析文件。记录实际审听依据，不能把程序候选直接标为已听取。窗口外或无说明的人工标记报错。

事件可配置impact:{prepareSeconds,attackSeconds,decaySeconds,settleSeconds}，时间均可按本题材和音乐调整。运行时ctx.accent(eventId)输出anticipation、hit、reveal、phase；峰值落在event时刻，reveal逐步到1后保留结果。状态在其他时刻重采样时同步重算包络，支持乱序与局部渲染。

视图与模型自行决定如何使用包络，例如控制目标对象的展开、非物理示意的运动节奏、相机短促推进及后续落定，不默认叠加通用镜头或背景球。真实物理积分、测量数据不能被hit随意放大；可改变观察方式或揭示顺序。

## 验收边界

check:music能证明事件与候选的数值对齐，不能证明画面确实表达了高潮。VIBE_QA记录每个绑定的包络，关键帧自动覆盖蓄势、峰值和落定；仍需检查主体实际像素、构图反差、阅读可用性以及实际音轨位置。听取或连续观看未做时如实记录。示范及检测参数仅用于测试，不固定任何新作品的片长、高潮秒数或重音数量。
