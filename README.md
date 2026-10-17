# teaz_pro_ui

Shared Vue 3 components and theme tokens for every Teaz app
(`@teeetime/teaz-pro-ui`). Started as the reusable parts of
`teaz_pro_portal`. House rules (sharp corners, Lucide icons, tokens only)
are in `teaz_pro/docs/STYLE_GUIDE.md`.

## Install

Distributed straight from GitHub, pinned to a tag:

```sh
npm install github:TeeeTime/teaz_pro_ui#v0.2.0
```

npm clones the repo and runs `prepare` (= `npm run build`), so `dist/` is
not committed. That needs `git` wherever `npm install` runs, e.g. in a
Docker build stage: `RUN apk add --no-cache git` on `node:*-alpine`.

## Use

```css
/* src/assets/main.css */
@import '@teeetime/teaz-pro-ui/themes.css'; /* color/shape tokens, required */
@import '@teeetime/teaz-pro-ui/base.css';   /* house reset + body styles, optional */
```

```ts
// src/main.ts
import './assets/main.css'
import '@teeetime/teaz-pro-ui/style.css' // component styles
```

```vue
<script setup lang="ts">
import { TopBar, GridLayout, GridItem, AppTile, useTheme } from '@teeetime/teaz-pro-ui'

useTheme() // applies the saved/system theme to <html data-theme>
</script>

<template>
  <TopBar user-name="Jane Doe"><span>My App</span></TopBar>
  <GridLayout :columns="4">
    <GridItem clickable aria-label="Docs">
      <AppTile icon="docs" name="Docs" compact />
    </GridItem>
  </GridLayout>
</template>
```

## Contents

| Export | What |
| ------ | ---- |
| `GridLayout`, `GridItem` | Square-cell, container-query-driven grid. Details: [`src/components/grid/README.md`](src/components/grid/README.md). |
| `TopBar` | App header: left slot for branding, avatar menu with built-in theme cycling, emits `select`. |
| `Icon` | `<Icon name="box" />`, name-based lookup over `@lucide/vue`. Add icons in `src/components/icons/Icon.vue`. |
| `AppTile`, `AgendaTile`, `StatSparklineTile`, `StatusListTile`, `SearchFieldTile` | Presentational tile contents for a `GridItem`. |
| `useTheme()`, `THEMES`, `THEME_LABELS` | Shared theme state (`light` / `dark` / `dark-blue`), persisted in `localStorage`. |
| `AppStat`, `AgendaEvent`, `StatusRow`, `*Props` | Types. |
| `themes.css`, `base.css`, `style.css` | Tokens, base styles, compiled component styles. |

`src/styles/themes.css` is a copy of `teaz_pro/tokens/themes.css`. Change
the tokens there, copy the file here, then release a new version.

## Develop

```sh
npm install
npm run build       # dist/index.js, dist/style.css, dist/*.d.ts
npm run type-check
```

To try changes in an app before releasing, from the app's `frontend/`:
`npm install ../../teaz_pro_ui` (switch back to the GitHub spec afterwards).

## Release

1. Bump `version` in `package.json`, commit.
2. `git tag v<version> && git push --follow-tags`
3. In each app: update the `#v<version>` in its `package.json`, `npm install`.
