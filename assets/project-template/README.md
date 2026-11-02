# Subject-authored video project

Install locked dependencies with npm ci and requirements.txt. Fill the invocation parameters, approved script, scientific sources and docs/visual-design.md. Normal projects have empty scene registries; author a model/state module and matching view for this subject before rendering.

Register state(ctx) in shared/scene-registry.mjs and its React view in src/scenes.tsx with the same ID. Use kind: authored, renderer: your ID, and anchorIds in the scene. State exposes objects, protectedRegions, phase, expected and explanatory metrics. Objects use stable IDs and normalized screen coordinates, with optional worldX/worldY for motion checks. Keep simulation separate from visual mapping and reconstruct any frame deterministically.

Full approved captions and script-manifest.json drive coverage and SRT; textCues reference sourceId. Choose position and effect against the action; no mandatory bottom subtitles or automatic alternating layouts. Stable reading windows exclude entry and exit effects.

Commands: doctor, dev, analyze:music, stills, render, check, package. Configure PYTHON, FFMPEG, FFPROBE and BROWSER_EXECUTABLE if automatic discovery fails. Music features must be regenerated after crop/fps/music changes. Partial render ranges are inclusive absolute episode frame indices.

The --demo creator option copies isolated wave/branch diagnostics and a synthesized test track; these are not scientific scenes or production defaults. Existing projects retain their own engine; old walk/distribution scenes are not included here.

Blender is optional. Selected media must record source frame, fps, frames and scientific benefit/cost. Do not silently substitute missing assets. Technical checks do not replace scientific review, continuous viewing or listening.
