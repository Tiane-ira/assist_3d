# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                 # Dev: Electron hot-reload (vue-cli-service electron:serve)
npm run win               # Build: Windows NSIS installer (requires NODE_OPTIONS=--openssl-legacy-provider)
npm run mac               # Build: macOS DMG
npm run icon              # Generate electron app icons from public/icon.png
```

Node >= 18 required.

## Architecture

This is a **Vue 2.6 + Electron 28** desktop app for 福利彩票3D (China Welfare Lottery 3D) number filtering and analysis.

### Process model

- **Main process** (`src/background.js`): Electron window management, `electron-store` persistence, IPC handlers, and the **core lottery filtering engine** (`codesFilter` and all `checkXxx` functions). Filtering runs in the main process via `ipcMain.handle("filterCodes", ...)` to avoid blocking the renderer.
- **Preload** (`src/preload.js`): Bridges main↔renderer via `contextBridge`. Exposes `window.electron` with: `setConfig`, `getConfig`, `copy2Clipboard`, `filterCodes`, `openWindow`.
- **Renderer** (`src/main.js` → `src/App.vue`): Vue 2 + Vuex + Vue Router + Element UI.

### Data flow pipeline

The main layout (`src/views/layout/index.vue`) is a split two-column pipeline:

1. **NumChecker** (`src/components/NumChecker/`) — Select base numbers for lottery. Two tabs:
   - `GroupCheck`: Group-style selection (组选) — pick digits 0-9 and 组三/组六/豹子/顺子/半顺/杂六 types
   - `DirectCheck`: Direct-position selection (直选) — pick digits for 百位/十位/个位 independently, plus same type filters
2. **RuleOption** (`src/components/RuleOption/`) — Add/remove filter rules. Each rule has a dialog UI for configuring checks. Rules are stored in `$store.state.checkRules` as an array of rule objects with `{id, title, label, type, ignore, isOrder, checks}`.
3. **ResultOperator** (`src/components/ResultOperator/`) — "获取结果" button triggers the full pipeline:
   - Generates candidate codes via `getNumGroup()` or `getNumDirect()` from `src/utils/code.js`
   - Removes 杀号 codes
   - Sends candidates + rules to main process via `window.electron.filterCodes()`
   - Commits results to Vuex (`CHANGE_RESULT_LIST`, `CHANGE_CODES_RESULT`)
4. **ResultShow** (`src/components/ResultShow/`) — Displays filtered results in an Element UI table with code properties (和值/跨度/大中小/012路/三码差/三码合), copy buttons, and a group→direct transposed view.

### Key files

| File | Purpose |
|------|---------|
| `src/background.js` (~1140 lines) | Electron main process + entire filter computation engine |
| `src/utils/code.js` | Number generation helpers: `getNumGroup`, `getNumDirect`, `group2Direct`, `direct2Group`, `getNumObjByCodes` |
| `src/config.js` | Constant data: `allNum`, `allJiOu`, `allDzx`, `all012l`, `allMCSM`, `allHmxt`, `allJodw`, `allSmc` |
| `src/store/index.js` | Vuex store: number lists, rule lists, result state, config save/load/apply |
| `src/utils/config.js` | Thin wrapper over `window.electron.getConfig/setConfig` for config list persistence |
| `src/preload.js` | IPC bridge — all renderer↔main communication is defined here |

### Rule types

**Normal rules** (label → internal key): 奇偶(`jo`), 和值(`hz`), 跨度(`kd`), 两码合(`lmh`), 任意两码差(`rylmc`), 最小/中间/最大两码合(`zxlmh`/`zjlmh`/`zdlmh`), 最大/中间/最小值(`zdz`/`zjz`/`zxz`), 大中小(`dzx`), 012路(`012l`), 合值(`hz2`), 码差三码(`mcsm`), 号码形态(`hmxt`), 奇偶定位(`jodw`), 直选三码差(`zxsmc`).

Normal rules support `isOrder` (排序, controls whether rules are evaluated in sequence or cross-combined) and `ignore` (容错, controls error tolerance).

**Complex rules**: 胆码组(`dmz`), 断组(`dz`), 大中小数(`dzxs`), 大中小两码合(`dzxlmh`), 大中小两码差(`dzxlmc`), 复式条件(`fstj`), 二次定位(`ecdw`), 杀号(`sh`). These do not support ordering or error tolerance.

The filtering engine has two modes controlled by `orderType`: sequential (顺序排列, `getCalcGroups`) and cross-combined (交叉排列, `getCalcGroups2`).

### Navigation and child windows

- `/` — Main layout (the primary view)
- `/convert` — Conversion tools opened as a child Electron window (组转直, 直转组, 差集, 交集)
- `/tableShow` — Table display tool opened as a child Electron window

Both child windows are spawned by `window.electron.openWindow()` using hash routing.

### State persistence

Config lists (condition sets) are persisted via `electron-store` with key `"configList"`. The store loads configs on mount (`loadConfig` action) and saves/loads via `src/utils/config.js`.