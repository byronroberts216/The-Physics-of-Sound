# Codex repository-local skills

Apple Design was installed with the official skills CLI, explicitly targeting Codex and omitting global installation:

```sh
npx skills add https://github.com/emilkowalski/skills --skill apple-design --agent codex --yes
```

Location: `.agents/skills/apple-design/SKILL.md`. Upstream: https://github.com/emilkowalski/skills/tree/main/skills/apple-design . Reviewed upstream commit: `2d228630ba1446365f614a108cb8252f1feda202`. The installed SKILL.md was compared byte-for-byte with the reviewed original. The upstream skill consists of a single file; it has no required package dependencies or supporting resources. The repository MIT license is retained alongside it. `skills-lock.json` records source and content hash.

The guidance is based on Apple's interface design and motion principles. Motion/Framer Motion examples are optional. Interface springs must not substitute for scientific equations. Its initial greeting rule applies when invoked without a specific question; invoke with a concrete design request so it can do useful work.

Codex discovers repository-local skills through `.agents/skills/<name>/SKILL.md`. For a relevant task, read that file and apply it; example: `Use $apple-design to review typography and reduced-motion behavior.` `pnpm check:skills` verifies the path, metadata, readability and AGENTS.md reference. This setup read and applied the typography/clarity guidance to the minimal foundation shell. Hot-loading a new native skill/tool into an already-running chat cannot be guaranteed; start a new task to verify the native skill picker after publication. The committed files, license and lock record persist through Git checkouts; prepared cloud snapshots also retain them. A fresh-task restoration has not yet been tested.

The future `acoustics-course-author` directory is a documented placeholder with no SKILL.md; it is intentionally not a discoverable authoring skill yet. Do not globally install skills or copy credentials into skill files.

## Course development update

The user has now authorized course creation. `acoustics-course-author/SKILL.md` is active, committed locally, and checked by `pnpm check:skills`. Apple Design was read and applied to system typography, spatial hierarchy, persistent navigation, immediate control feedback, light/dark modes, contrast and reduced-motion/transparency handling. Physics plots use scientific equations rather than interface springs. The old reserved-authoring description above documents the setup phase, not current status.
