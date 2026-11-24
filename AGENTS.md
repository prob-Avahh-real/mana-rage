# mana-rage · 法力出气室

基于万智牌的**拆牌发泄沙盒**。单文件 HTML 内核 + 自研轻量引擎，默认构建**移动端（Android APK）+ 智能硬件输入（戒指/手杖）**。

## 用途 / Target

- **移动端**：Capacitor 打包 Android APK（`android/`）
- **智能硬件**：戒指（DeviceOrientation）与手杖（DeviceMotion）映射游戏/格斗动作
- **桌面兜底**：双击 `index.html` 即可玩（单文件、零依赖、离线）

## 命令

- 运行 / 调试：浏览器打开 `index.html`（加 `?selftest=1` 看引擎单测面板）
- 引擎单测：`npm test`（node --test，从 `index.html` 抽 `<script>` 跑 CORE）
- 出网页产物：`npm run build`（复制到 `www/index.html`）
- 出 APK：`./build.sh`（等价 `npm install && npx cap add android && npx cap sync && (cd android && ./gradlew assembleDebug)`）
  - 需要 Android SDK（`ANDROID_HOME`）与 JDK 17；产物：`android/app/build/outputs/apk/debug/app-debug.apk`
  - 本机已验证：JDK 17 `/opt/homebrew/Cellar/openjdk@17/…`，SDK `/opt/homebrew/share/android-commandlinetools`（platform 34 + build-tools 34），APK ≈ 3.7 MB，含 `assets/public/index.html`

## 架构

`index.html` 内部分层（单文件但严格分区）：

- **CORE**（零 DOM / 零 localStorage，可 node 单测）：卡牌生成器、`RageEngine`、`createArena`（彩蛋格斗）、`createWearableInput`
- **CONFIG**：`CARD_TYPES / RARITIES / WORD_BANKS / BOSSES(+gaze) / SITUATIONS / UPGRADES / TUNING / EGG / WEARABLE_DEFAULTS`
- **VIEW / INPUT / AUDIO**：渲染、指针+键盘+穿戴输入、WebAudio 合成音效

扩展只需加策略/配置，主循环不动。

主题配色：`PALETTES`（10 套，`applyPalette` 写入 body 的 CSS 变量 `--gold/--gold2/--ember/--rage/--bg1/--bg2/--plate1`），每局开局与重开各随机刷一次，不再固定色系。新增色系只要往 `PALETTES` 加一条。

## 智能硬件映射（阈值对齐 `active/air-shared/wearable-input.js`）

| 输入 | 对局中 | 彩蛋格斗中 |
|------|--------|-----------|
| 戒指抖动 | 宣泄（满怒）否则连锤 | 必杀 |
| 戒指上倾 | 摸鱼（摸牌） | — |
| 戒指倾斜 | — | 格挡 |
| 手杖敲击 | 拳击（锤老板） | 拳击 |
| 手杖挥舞 | 撕牌换怒气 | 踢腿 |

iOS 13+ 需点 HUD 的「🖐️ 戒指·手杖」按钮授权（用户手势）。

## 键盘操作（可全程纯键盘）

| 场景 | 键 |
|------|----|
| 选宣泄技 | `↑/↓` 或 `1/2/3` 选择 · `Enter` 确认 |
| 手牌 | `←/→` 选牌 · `Enter`/`↑` 打出 · `↓`/`X` 撕碎 · `1–8` 打出 · `Shift+数字` 撕碎 |
| 对局其它 | `Space` 拳击(连按连锤) · `Z` 摸鱼 · `R` 宣泄 |
| 全局 | `G` 女凝 · `M` 音效 · `B` 戒指/手杖 · `?` 帮助 · `Esc` 关闭 · `Tab` 切换焦点 |
| 彩蛋格斗 | `J` 拳 · `K` 腿 · `L`/`Space` 格挡 · `U` 必杀 · `Enter`/`F` 处决 |
| 结算 | `Enter` 再来一局 |

键位按上下文分流（弹窗 → 格斗 → 对局），同一键在不同状态下含义不同。

## 调试后门

- `?selftest=1` 引擎单测面板
- `?egg=1` 直接进入彩蛋真人快打
- `?gaze=1` 女凝模式
- `window.__wearableGesture('tap'|'swing'|'shake'|'tilt', {dir})` 手动触发穿戴手势
