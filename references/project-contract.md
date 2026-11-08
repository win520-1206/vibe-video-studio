# 项目约定与调用

## 新会话提示词

```text
使用 $vibe-video-studio 制作科学可视化短剧。
主题：光合作用与能量转换。
受众：大学生；2集，每集90秒；16:9，1080p30。
沿用cinematic-spatial美术偏好，按本主题设计动态文字与声画互动，不配机械人声。
音乐和参考资料见本工作目录。
为本作建立独立目录，先核验资料，拆解参考，制作包含科学过程的代表性样片，再按我的后续确认完成全片。
```

若用户已明确直接完成全片，继承授权，不再次强制样片确认。用户只要重剪某几秒时，不扩大为整片风格重做。

## 调用问答协议

每个新作品先询问未给出的：主题/受众/用途、希望传达的思考、几集、每集或总时长、画幅/平台/输出规格、先样片还是直接整片、材料和输出目录。已在本次请求给出的值不重复问。音乐使用assets/defaults.json登记曲目，风格默认cinematic-spatial；两者可覆盖，不强制为已有默认项停下来等确认。

不要用历史案例填集数、片长或卡点。用户未决定时可以先讨论或给方案，未获本次参数前不启动依赖时长的全片渲染。

## 项目约定内容

assets/project-contract.example.json提供待收集参数的空配置：集数、时长、fps、宽高和输出目录均为null，keyEvents为空。确认问答并分析音乐后才填入。字段分成：project/输出规格/story/音乐与风格/关键事件/工作阶段。脚本inspect_media只使用其中视频规格与音频要求，不验证剧情、科学来源或主观质量。

运行配置用episodes[].durationSeconds表达各集片长，scenes[].start/end与events[].atSeconds均是本集绝对秒数。events是动作、文字与音效的唯一时钟；同一动作引用同一ID，音乐绑定放在该集musicDirection。顶层keyEvents可留作需求备注，不作为第二份运行事件表。音频特征fps与视频一致，Composition与检查目标由归一化配置生成。实际镜头、文字和包络字段见[脚手架](scaffold.md)、[动态文字](dynamic-text-and-motion.md)与[节奏导演](music-direction.md)。

不得把null变成历史案例值来绕过问答。inspect_media.py只用于参数已经确定的成片；未收集完的空配置应先完成问答，不自动注入案例人物或素材。

## 可维护的项目文档

按规模选择文件，不强制空目录：

- BRIEF.md：目标、范围、已确认风格、输出与边界。
- project-contract.json：运行参数、场景、完整文案与唯一事件表。
- creative-plan.json：引用场景、原稿和事件的创作意图，不重复存时间。
- sources.md：说法、原始来源、日期、假设、画面引用方式。
- assets.json：本地/生成/用户素材的路径、用途与真实来源。
- PROGRESS.md：已完成、用户确认、正在进行、阻碍和下一步。
- qa.json：实际文件规格、关键帧证据、解码与音轨结果。

## 事件表示例

```json
{
  "id": "result-reveal",
  "atSeconds": 2,
  "impact": {
    "prepareSeconds": 0.8,
    "attackSeconds": 0.08,
    "decaySeconds": 0.3,
    "settleSeconds": 1
  }
}
```

示例放在对应episode.events中，时刻和包络仅演示接口，不是默认卡点。镜头的before/action/after说明本题材过程，文字的eventId及musicDirection绑定引用此ID。需要音效时配置实际file或合成参数、durationSeconds与gainDb，不使用未实现的效果名称。

## 输出与复现

成片按版本分目录，保存实际文件名清单。输出总览应说明片长、画幅、音频方案、模拟边界、有效渲染入口和验收位置。localhost播放器可重新启动；MP4和源工程才是持久交付物。

复现前核对资产清单、依赖版本、系统字体、Python库、浏览器与编码器路径，不把“之前成功”当作当前机器可运行的证明。
