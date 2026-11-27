# AGENTS.md

本檔是給 coding agent（Claude Code、Codex）在這個 repo 寫程式時的指引。

## 語言（Language）

- 與開發者的對話、PR 描述、issue 與留言用繁體中文。
- commit 與 PR 標題用英文 Conventional Commits、小寫開頭。
- 程式碼註解用繁體中文；識別字、指令、路徑、套件與 API 名稱維持原文。
- 本檔的「Behavioral Guidelines」（照抄上游）與 `next dev` 自動產生的 Next.js 區塊維持英文原文，不要翻譯。

## 指令（Commands）

```bash
pnpm dev          # 啟動開發伺服器（http://localhost:3000）
pnpm build        # production build
pnpm start        # 啟動 production 伺服器
pnpm lint         # 執行 ESLint
pnpm format       # 用 Prettier 格式化所有檔案
pnpm format:check # 檢查格式但不寫入
pnpm codegen      # 從 NestJS OpenAPI spec 重新產生 types/api.ts（需要 biru-api 在 :3001 執行中）
```

目前沒有設定測試。

pre-commit hook（Husky + lint-staged）會對 staged 的檔案跑 `pnpm format`、`pnpm lint` 與 `prettier --write`。不要用 `--no-verify` 跳過。

格式化一律在 `pnpm install --frozen-lockfile` 之後用 repo 自己的 Prettier（`pnpm format` 或 `pnpm exec prettier`），絕不用 `npx prettier`：沒有 `node_modules` 時它會下載最新版的 Prettier，格式可能和鎖定的版本不同。

連不到 `fonts.googleapis.com` 的環境（例如 sandbox）會讓 `next/font/google` build 失敗。把 `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` 指向一個 export `{ [url]: css }` 的 CommonJS 檔，`app/[locale]/layout.tsx` 的每個字型一筆：URL 照 `node_modules/next/dist/compiled/@next/font/dist/google/get-google-fonts-url.js` 組出來的寫（`https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap`，JP、KR、SC 同理），css 寫一個 `font-weight: 100 900` 的 `@font-face`，`src` 為 `url(<任一本機 .woff2 的絕對路徑>)`。只有 webpack build 會讀它（`next build --webpack`）；出現 `Missing mocked response for URL` 錯誤時，訊息會指出要補的 URL。

`pnpm codegen` 會用執行中的 API 整份重寫 `types/api.ts`，所以執行中的 biru-api 分支沒有的型別也會被刪掉，例如還沒 merge 進該分支的後端 PR 的型別。commit 前只留你的後端改動產生的 hunk，其餘還原。

從 `develop` 開分支，所有 PR 都開向 `develop`（GitHub 的預設分支）。絕不開向 `master`：只 merge 進 `master` 的 PR 永遠不會進到 `develop`，之後從 `develop` 開的分支會漏掉它，`master` merge 回來時也會衝突。因為 `develop` 是預設分支，PR 裡的 `Closes #n` 會在 PR merge 進 `develop` 時關閉 issue；只完成 issue 一部分的 PR 用 `Part of #n`。

## 環境變數（Environment Variables）

複製並設定 `.env`：

- `NEXT_PUBLIC_NEXT_URL` – 前台 base URL（例如 `http://localhost:3000`）
- `NEXT_PUBLIC_NEST_URL` – NestJS 後端 URL（例如 `http://localhost:3001`）
- `NEXT_PUBLIC_MAINTENANCE` – 維護模式旗標
- `NEXT_PUBLIC_ADMIN_URL` – biru-admin 的 URL（接受組織邀請後的導向目標）
- `NEXT_PUBLIC_IMAGE_HOST` – 圖片儲存公開 URL 的 host（biru-api 的 `S3_PUBLIC_URL`，例如 `<project_ref>.supabase.co`）；`next/image` 只載入其 `/storage/v1/object/public/` 路徑下的遠端圖片。未設定則一律不允許
- `CLIENT_IP_FORWARD_SECRET` – 與 biru-api 相同的值；只在伺服器端用，絕不加 `NEXT_PUBLIC_`。伺服器端的 API 呼叫會連同訪客 IP 一起送出它（`utils/clientIp.ts`），讓 API 依每位訪客限流，而不是依 Next 伺服器。每個沒有快取的伺服器端呼叫都要帶 `clientIpHeaders()`；`"use cache"` 函式讀不到 request header，就不帶
- `NEXT_PUBLIC_SENTRY_DSN` – Sentry 專案 DSN；有設定時才回報瀏覽器與伺服器錯誤（`instrumentation.ts`、`instrumentation-client.ts`）
- `NEXT_PUBLIC_SENTRY_ENVIRONMENT` – Sentry 的 `environment` 標籤（例如 `production`、`stage`）
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` – Web Push 的 VAPID 公鑰，與 biru-api 同名變數相同；未設定代表瀏覽器永遠不會訂閱推播（`utils/alerts.ts`）

瀏覽器的呼叫直接打 `NEXT_PUBLIC_NEST_URL`：`utils/fetcher.ts` 會替相對路徑 `/api/...` 加上前綴並送出 `credentials: "include"`，它也是 better-auth client 的 `baseURL`；繞過這兩者的瀏覽器請求必須做同樣的事。session 與 site cookie 能送到 API host 與本 app 的伺服器端請求，只是因為 biru-api 把它們設在共用的上層網域（biru-api AGENTS.md「Global Setup」）。`next.config.ts` 只 rewrite 點餐 QR URL、候位 QR `/api/organizations/:organizationSlug/waitlist/qr`（印出來的 QR code，其相對導向必須落在本 app）與 `/api/images/*`（API 回傳的相對圖片 URL）。相對的 better-auth `callbackURL`／`redirectTo` 是相對於 API 解析，不是本 app；只有在 biru-api 的信件會把它轉成本 app 的 `redirectTo` query 時（註冊、驗證與重設密碼信）才傳相對路徑。

## 架構（Architecture）

### 技術棧（Tech Stack）

- **Next.js 16**（App Router）+ **React 19** + **TypeScript**（strict mode）
- **Material UI v9** 搭配 Emotion 做樣式；**Tailwind CSS v4** 做 utility
- **Zustand v5** 做全域狀態，**SWR v2** 做資料抓取
- **next-intl v4** 做 i18n（5 個語系：預設 `zh-TW`，以及 `en`、`ja`、`ko`、`zh-CN`）
- **React Hook Form** + **Zod v4** 做表單與驗證
- **better-auth** 做身分驗證
- **Socket.io** client 做即時更新
- **pnpm** 為套件管理工具

### 路由結構（Routing Structure）

所有頁面都在 `app/[locale]/` 底下。兩層巢狀 route group 包住所有面向使用者的頁面：

- `(app)` — 加上 AppBar、TemporaryDrawer 與全域對話框
- `(dashboard)` — 加上 **parallel routes**（`@breadcrumb`、`@subheader`、`@toolbar`），在 dashboard layout 中以具名 slot 渲染

點餐流程的路徑：

```
app/[locale]/(app)/(dashboard)/order/[mode]/[organizationSlug]/(stepper)/
```

路由參數型別定義在 `types/routeParams.ts`（`locale`、`mode`、`organizationSlug`）。`(stepper)` 目錄是共用 layout 的 route group，不影響 URL。

**在 `(dashboard)` 裡新增路由時**，`@subheader` 與 `@toolbar` 已經有回傳 `null` 的 `[...segments]` catch-all，`@breadcrumb/default.tsx` 也會從 `hooks/useRoutes.ts` 組出麵包屑，所以新路由除非真的有 subheader／toolbar，否則不需要 slot 檔案，但必須註冊在 `hooks/useRoutes.ts`（若屬於 drawer，也要加進 `components/TemporaryDrawer/NestedList` 或 `hooks/useNavChildren.ts`）。

整個 app 使用的**頁面檔案慣例**：

- `page.tsx` — 精簡的 Next.js page，把 params／資料傳給內容元件
- `index.tsx` — 實際的頁面內容元件
- `definitions.ts` — Zod schema 與推導出的表單型別（只在表單頁）

### 狀態管理模式（State Management Pattern）

Zustand 採用 **vanilla store + Context provider** 模式以支援 SSR：

1. store 建在 `stores/`，是接受初始狀態的 factory 函式（例如 `createCartStore(initialState)`）
2. `providers/` 裡的 provider 建立各個 store 實例，並透過 Context 提供
3. 元件透過自訂 hook 存取 store（例如 `useCartStore`、`useAuthStore`）
4. 購物車 store 用 `persist` middleware 與 `localStorage` 同步

所有 provider 組合在 `components/AppProviders`，掛在根 `app/[locale]/layout.tsx`。

### i18n 模式（i18n Pattern）

- 語系是 URL 的第一段：`/{locale}/path`
- 翻譯檔：`messages/{locale}/*.json`，彙整在 `messages/index.ts`
- 用 `i18n/navigation.ts`（包裝 next-intl）取得會帶語系的 `Link`、`useRouter`、`usePathname`
- 多語系資料結構用 `Record<Locale, string>` 存翻譯內容
- 伺服器端設定：`i18n/request.ts`；語系路由設定：`i18n/routing.ts`

### 資料抓取（Data Fetching）

- SWR 搭配 `utils/fetcher.ts` 的自訂 `fetcher`，同時處理 JSON 與文字回應
- 資料只在切換頁面時才會變的頁面，直接用 SSR props，不用 SWR；SWR（搭配伺服器預抓的 `fallback`）只用在會一直開著等即時更新的頁面
- `providers/SWRProvider.tsx` 設定全域 SWR 選項，並透過 notistack 處理錯誤

### 身分驗證（Authentication）

- `lib/auth-client.ts` 設定 better-auth client 與自訂的使用者欄位
- auth 狀態在伺服器端透過 `AuthStoreProvider` 的 `initialSession` 初始化
- middleware 在 `proxy.ts`，以具名 export（`proxy` 函式 + `config`）提供；處理 i18n 路由、維護模式導向，以及會員帳號頁（`/auth/{coupons,orders,points,settings}`）的登入檢查

### 主要工具位置（Key Utility Locations）

| 用途                     | 位置                                                                           |
| ------------------------ | ------------------------------------------------------------------------------ |
| URL／路徑產生            | `utils/href.ts`、`hooks/useHref.ts`                                            |
| 菜單資料 helper          | `utils/menus.ts`（品項查找、庫存計算）                                         |
| 金額格式化               | `hooks/useFormatMoney.ts`（唯一的格式化工具，不要另加 util 或直接呼叫 `Intl`） |
| 點餐模式 + 桌號          | `hooks/useOrderModeLabel.ts`（單一合併標籤）                                   |
| 點餐 QR session          | `utils/orderQrSession.ts`（只在伺服器端，每個 request 快取）                   |
| Auth 工具                | `utils/auth.ts`                                                                |
| 錯誤擷取                 | `utils/errors.ts`                                                              |
| 國家資料                 | `utils/countries.ts`、`constants/countries.ts`                                 |
| 只在 client 端的 UI 切換 | `utils/useSsr.ts`（只給主題切換用，絕不用它在 hydration 時把內容清空）         |
| 後端 API 型別            | `types/api.ts`（由 openapi-typescript 自動產生，不要編輯）                     |

### 元件慣例（Component Conventions）

- 每個元件放在自己的目錄，入口為 `index.tsx`
- 所有 UI 元素都用 MUI 元件，以 `styled()` 設定樣式（不用 `sx`）；Tailwind 只用在根 layout
- 表單照這個模式：Zod schema → React Hook Form（用 `register`，非原生 input 則用 `useWatch` + `setValue` + `formState.errors`；避免 `Controller`）→ MUI input，格式化欄位用 `components/TextMaskCustom`（react-imask）。只為表單服務的非同步工作（例如先建立上層資料）放在它的 submit handler，由 `isSubmitting` 或對話框的 `confirmLoading` 涵蓋，不另加 loading state。對話框的確認按鈕永遠不 disable：無效或不完整的輸入在送出時由 schema 擋下，顯示為欄位錯誤。新密碼欄位透過 `hooks/usePasswordValidation.ts` 的規則清單顯示錯誤，而不是 schema 的訊息，所以在它們的 schema 加規則時也要加到那裡。
- 淺色／深色切換：`ThemeSwitcher` 用 `document.startViewTransition` + `flushSync` 讓整頁淡入淡出，`ThemeProvider` 保留 `disableTransitionOnChange`，`theme.ts` 在 view transition 進行時關掉 CSS transition。不要為主題切換加 `color`／`background-color`／`border-color`／`fill`／`box-shadow` 的 transition；transition 只用在互動狀態（hover、open、expanded、active step）。React 的 `<ViewTransition>` 取代不了這個做法：它會取消根層的淡入淡出，讓 body 與 portal 出去的 Dialog、Menu、Drawer 瞬間切換。若導覽改用 Next.js `viewTransition` 或 React `<ViewTransition>`，要把主題淡入淡出移到 React 底下，因為兩個 view transition 會互相中斷。
- 電話驗證用 `libphonenumber-js`
- Snackbar／toast 通知用 `notistack`（`useSnackbar`）；SWR 錯誤已由 `SWRProvider` 全域 toast
- 建立在 better-auth 上的身分驗證與帳號 UI（登入、註冊、雙重驗證、帳號與安全設定），流程與版面取自 better-auth 自己的 demo（better-auth repo 的 `demo/nextjs`），demo 沒有的再參考 Better Auth UI：功能放在哪張卡片、有哪些步驟與狀態。用本 repo 的 MUI 元件與上述慣例實作（`FormCard`、dialog store、React Hook Form + Zod、next-intl）；絕不安裝 Better Auth UI，也不複製它的 markup 或翻譯。

## biru-admin 同步（biru-admin Sync）

鏡像 repo（後台）：`/Users/yuanshuohsu/Desktop/biru-admin`。完成任何檔案改動後，一定要同步到 biru-admin 才算完成。

只有兩個 repo 都用到的檔案才鏡像：只有一邊用到的檔案不在另一邊建立；改到的檔案在鏡像沒有對應副本時不用同步，除非這次任務讓鏡像也要用到它。

每個改到的檔案，讀兩邊的版本後決定：

1. **Superset 檔案**（後台有額外內容，只移植改到的 hunk，絕不覆寫整個檔案）：
   `messages/*/common.json`、`types/api.ts`

2. **其他所有鏡像檔案** — 若 biru-admin 有同路徑的檔案，判斷內容不同是因為它只是 biru 的舊版（可以直接 `cp`），還是有刻意的後台差異（只移植 hunk）。

3. **同路徑、不同檔案** — `utils/menus.ts`、`utils/orders.ts`、`utils/banners.ts`、`utils/openingHours.ts`、`utils/storePhotos.ts`、`types/banners.ts`、`types/storePhotos.ts` 是後台各自的實作；只手動合併相關的改動，絕不 `cp`。

4. **改名或刪除的檔案** — 在 biru-admin 做同樣的操作（改目錄名、刪檔案）。

不確定差異是否刻意時，先讀 biru-admin 的檔案再決定。

## 程式碼註解（Code Comments）

**預設：不寫註解。** 只有在少了它會導致改錯時才寫，內容是程式碼本身表達不出來的後果或前提：

- `// 店家角色尚未選到店家時不打 API，否則會落到平台管理員專用端點`（會 403）
- `// palette 色位名不能含小寫 "mode"，否則 MUI 產不出 CSS 變數`（框架陷阱）

檢驗方式：把它刪掉，一個稱職的人會不會因此改錯？如果老實的答案只是「會比較難懂」，就刪掉。

**例外：官方文件連結是要的。** 程式碼照著官方文件某一頁寫時，不論是套件（Next.js、MUI、better-auth、Drizzle、NestJS…）、外部 API 規格（ECPay、data.gov.tw…）或法規（law.moj.gov.tw），在程式碼上方放該頁的 `// https://…` 連結；整個檔案都照它寫時放在檔案開頭。網站有分版本時指向已安裝的版本。既有連結要保留（除非開發者刪掉了）；程式碼不再照該頁寫時，在同一個改動修正或刪除連結。連結不計入下面「一兩個註解」的訊號。

絕不寫：

- 重述下一行，或重述欄位、常數名稱（在 `useLocale()` 上寫 `// 取得目前語系`）
- 我們對話中的推理，或為自己的取捨辯護
- private helper 的 JSDoc
- 描述程式碼目前在做什麼：下次改動後就會變成謊言

**一個改動加了超過一兩個註解，本身就是訊號**，代表程式碼表達得不夠。改命名或結構，不要旁白。

**絕不加回被刪掉的註解。** 即使某個註解通過上面的檢驗，只要開發者說過那裡不要註解，或那個註解之前被刪過，之後的改動就不能把它加回來；開發者的決定優先於本規則。有話要說就寫在回覆裡，不要寫在程式碼裡。

改動讓既有註解變得不正確時，在同一個改動修正或刪除它；過時的註解比沒有更糟。不要把識別字寫死在註解裡，改名後就會變成錯誤資訊。

## 實作方式（Implementation Approach）

**預設：直接做，不要問（act, don't ask）。** 只有答案會改變資料模型、API 契約，或需要不可逆或對外的動作（共用資料庫的 migration、部署、push）時才問。其他不明確之處，自己決定並繼續，然後在回覆列出所做的假設，讓開發者事後修正。這一條優先於下方引用準則的「If uncertain, ask」。

依以下順序決定：

1. **已安裝版本的官方文件**：先查 `package.json`／`node_modules` 的版本，絕不憑記憶。Next.js（`node_modules/next/dist/docs/`、next-devtools MCP）、MUI（mui-mcp）、better-auth、Drizzle、NestJS、next-intl、SWR、Zod 等。用文件示範的寫法，不用繞路；絕不用文件標為 deprecated 的 API。
2. **本 repo 的既有模式**：文件沒定死時，照 codebase 現有的做法。照抄前先確認它沒有你正在修的缺陷；有的話那部分不要抄，並在 PR 點名那份複本，讓它也被修掉。
3. **最主流的選項**：前兩者都決定不了時。

## Behavioral Guidelines

Vendored from <https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md> (headings demoted one level). Don't add rules here — put project rules in the sections above, so this stays diffable against upstream.

Behavioral guidelines to reduce common LLM coding mistakes.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
