# Subject-authored video project

Install locked dependencies with npm ci and requirements.txt. Fill the invocation parameters, approved script, scientific sources and docs/visual-design.md. Normal projects have empty scene registries; author a model/state module and matching view for this subject before rendering.

Register state(ctx) in shared/scene-registry.mjs and its React view in src/scenes.tsx with the same ID. Use kind: authored, renderer: your ID, and anchorIds in the scene. State exposes objects, protectedRegions, phase, expected and explanatory metrics. Objects use stable IDs and normalized screen coordinates, with optional worldX/worldY for motion checks. Keep simulation separate from visual mapping and reconstruct any frame deterministically.

Full approved captions and script-manifest.json drive coverage and SRT; textCues reference sourceId. Choose position and effect against the action; no mandatory bottom subtitles or automatic alternating layouts. Stable reading windows exclude entry and exit effects.

Commands: doctor, dev, analyze:music, stills, render, check, package. Configure PYTHON, FFMPEG, FFPROBE and BROWSER_EXECUTABLE if automatic discovery fails. Music features must be regenerated after crop/fps/music changes. Partial render ranges are inclusive absolute episode frame indices.

The --demo creator option copies isolated wave/branch diagnostics and a synthesized test track; these are not scientific scenes or production defaults. Existing projects retain their own engine; old walk/distribution scenes are not included here.

Blender is optional. Selected media must record source frame, fps, frames and scientific benefit/cost. Do not silently substitute missing assets. Technical checks do not replace scientific review, continuous viewing or listening.


## Creative planning

After setting episode/scene/caption/event IDs, run npm run plan:shots. Complete creative-plan.json: question, mechanism, insight, emotional connection and ending; per-shot action, viewer change, emotional beat and transition. No copied time fields. Existing JSON or docs reading copy is preserved. Run npm run check:creative to validate coverage, references, approved script and event windows; the updated reading copy is qa/creative-plan.md. These commands work before authoring renderers. Other commands remain compatible without the plan. Manual scientific, aesthetic and listening judgments are never automatically approved.

## Music analysis and directing

Run npm run analyze:track -- --input MUSIC --output NEW_DIRECTORY before the storyboard is complete, then inspect its report and optional listening page. After choosing the project crop, run analyze:music, plan:music and check:music. Write chosen bindings into episode.musicDirection; events remain the sole timeline. ctx.accent(eventId) supplies deterministic preparation, hit and reveal envelopes; the subject renderer determines the actual action. Candidates remain unconfirmed until actual listening.

Both entrypoints share tools/music_pipeline.py. Exact PCM, fps, normalized duration, source label, code and Python/NumPy versions key the optional analysis cache under public/generated/.analysis-cache. Changed event/SFX work may reuse unchanged music features, but different crops, decodes or gains do not share results. Generated audio, caches and listening previews are private outputs, not source assets.
