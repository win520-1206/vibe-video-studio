# 任意新音乐的可复现分析与画面适配

## 调用时实际执行

用户提供新音乐或更换音乐后，助手执行本流程并阅读产物，再设计镜头。不要求用户填写候选ID或先判断高潮在哪；用户给的大致位置仅帮助复核，不写成固定配置。此前音轨的任何秒数、BPM或段落不能直接迁移。已经确认的时长、原稿和科学条件继续作为本次约束。

分析可在工程、分镜尚未完成时进行。先记录源文件SHA256和工具环境，检查可用FFmpeg及NumPy。Skill根目录运行：

```text
python scripts/analyze_track.py --input "输入音乐绝对路径" --output "新的分析目录" --ffmpeg "实际ffmpeg可执行路径"
```

已创建的作品工程也可运行：

```text
npm run analyze:track -- --input "输入音乐绝对路径" --output "新的分析目录"
```

无需先实现renderer。默认30fps只用于报告波形采样，不成为作品默认帧率；起音分析仍为约5ms步长。可用--start和--duration分析指定选段，用--fps改变报告采样。输出目录非空时停止，保留已有试听笔记，不悄悄覆盖。

## 读取证据再判断

产物包括features.json、track-analysis.json、beat-map.json、section-map.json、report.md、review.html、preview.wav及provenance.json。最后一项记录源哈希、分析参数、代码哈希、Python/NumPy/FFmpeg版本，支持重新运行与比对。preview是分析用单声道PCM，不替代原音乐母本。

先看节奏周期的多个候选与起音分布，再看段落前后能量、频段变化，以及持续高能段。区别局部重音、段落进入、持续推进和回落。报告中的sections及visualPhrases均为候选：稳态或平缓曲目可能没有明显转折，不强行制造高潮。不自动确认具体乐器、拍号、和声或情绪。

每个动作组给出参考蓄势区、进入featureId、进入后的延展区及变化证据。助手把它们转换为本题材的具体对象动作、景别和文字安排：为什么在这里收束，什么知识在此揭示，后续几拍对象如何继续演化。不要照抄报告里的抽象建议当成最终分镜，也不把每个检测点都变成切镜。

## 试听与修正

打开review.html，可点击波形定位，从候选前两秒开始试听，对照段落和起音。用户或具备实际听取能力的制作人员可以记录当前播放位置、说明听到的变化并导出music-review.json。没有人工标记时不导出“已复核”结论。导出包含源哈希与原曲时间；它是供助手阅读的证据，不会自动改写影片事件。

助手核对复核JSON的sourceSha256与实际选用原音乐一致，按sourceSeconds与选段起点换算，再填入musicDirection.manualMarkers。不同歌曲或不在选段内的标记不能直接使用；也不能把整曲featureId误用于裁剪后重新生成的分析。没有实际审听条件时明确保持candidate，可继续制作候选方案，不能把波形分析说成已经听过。

## 从整曲到作品

结合主题、原稿与目标时长选择音乐段落，记录原曲到本片的映射。运行analyze:music重新分析作品实际选段，自动生成本片sections、sectionTransitions和visualPhrases。再运行plan:music生成不覆盖的music-direction-draft.json。草稿只提议featureId，mainEventId留空，不改事件时间。助手选择主揭示、填具体动作与反差，将musicDirection写入对应episode，并把选定本片featureId绑定唯一eventId；需要时明确调整原event.atSeconds，最后运行check:music。事件建议可删减，不要求所有知识事件都卡拍。字段见[节奏导演](music-direction.md)。

动作、文字强调和音效继续共享事件时钟。ctx.accent提供蓄势、冲击和落定的确定性包络，由主题renderer决定实际表达。科学模型和因果顺序不为卡点改变；受限时调整观察方式或换到更合适的音乐段落。

渲染前后取证：峰前、峰值、衰减、结果帧，以及包含声音的连续短片。核验实际主体峰值、文字阅读、局部渲染音乐位置。记载数值对齐和主观声画复核各自的状态。换曲、换选段、变速或改fps后重新运行相关分析与绑定检查；不复用旧指纹或固定高潮秒数。

## 交付与边界

交付本次报告、节拍表、段落表、声画事件设计和验证结论；需要用户判断时提供实际片段或试听页，不增加无意义的确认关卡。分析目录包含用户音频衍生PCM，只保留在作品私有目录，公开Skill仅包含分析器和空底座，不附音轨、报告缓存或验证成片。

## 分析入口与复用

整曲analyze_track.py与项目prepare_audio.py共用music_pipeline.py：PCM特征→节奏与结构→段落与动作组。前者负责可独立运行的报告和试听页，后者负责实际选段与混音，不互相替代。高分辨率节奏可用时跳过旧逐帧节拍计算；旧特征格式保留原路径。缓存匹配条件见[资源适配](music-adaptation.md)。低层audio_features.py和music_structure.py仍可单独调用用于诊断。
