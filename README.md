# biru

## 主題色

```bash
# https://mui.com/material-ui/customization/color/

唇 霞染胭脂 pink[100] (#f8bbd0) 粉
大橘為重 暖陽淺橘 orange[100] (#ffe0b2) 橘
身側 羽柔暖棕 brown[200] (#bcaaa4) 淺棕
背毛 焦香摩卡 brown[700] (#5d4037) 深棕 // 需要試試 600
胸毛 凝霜素白 grey[50] (#fafafa) 白
法令紋 錦夜墨痕 grey[900] (#212121) 黑
眼 霧織灰藍 blueGrey[500] (#607d8b) 灰藍
```

## Next.js

```bash
# https://nextjs.org/docs/app/getting-started/installation

pnpm create next-app@latest biru --yes

Creating a new Next.js app in /Users/xuyuanshi/Desktop/biru.

Using pnpm.

Initializing project with template: app-tw

Installing dependencies:
- react
- react-dom
- next

Installing devDependencies:
- typescript
- @types/node
- @types/react
- @types/react-dom
- @tailwindcss/postcss
- tailwindcss
- eslint
- eslint-config-next

dependencies:
+ next 16.0.1
+ react 19.2.0
+ react-dom 19.2.0

devDependencies:
+ @tailwindcss/postcss 4.1.16
+ @types/node 20.19.24 (24.9.2 is available)
+ @types/react 19.2.2
+ @types/react-dom 19.2.2
+ eslint 9.38.0
+ eslint-config-next 16.0.1
+ tailwindcss 4.1.16
+ typescript 5.9.3

Done in 6.6s using pnpm v10.20.0

Generating route types...
✓ Route types generated successfully

Success! Created biru at /Users/xuyuanshi/Desktop/biru
```

## Prettier

```bash
# https://prettier.io/docs/install
pnpm add --save-dev --save-exact prettier
node --eval "fs.writeFileSync('.prettierrc','{}\n')"
node --eval "fs.writeFileSync('.prettierignore','# Ignore artifacts:\nbuild\ncoverage\n')"
pnpm exec prettier . --write
npx prettier . --check

# https://prettier.io/docs/configuration
# https://json.schemastore.org/prettierrc

# .prettierrc
{}
```

## Editor

```bash
# Visual Studio Code
# https://github.com/prettier/prettier-vscode
# https://marketplace.visualstudio.com/items?itemName=tombonnike.vscode-status-bar-format-toggle

# .vscode/settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always",
    "source.addMissingImports": "always",
    "source.organizeImports": "always"
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "editor.formatOnType": true
}

# https://nextjs.org/docs/app/guides/debugging

# .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev -- --inspect"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug client-side (Firefox)",
      "type": "firefox",
      "request": "launch",
      "url": "http://localhost:3000",
      "reAttach": true,
      "pathMappings": [
        {
          "url": "webpack://_N_E",
          "path": "${workspaceFolder}"
        }
      ]
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "runtimeArgs": ["--inspect"],
      "skipFiles": ["<node_internals>/**"],
      "serverReadyAction": {
        "action": "debugWithEdge",
        "killOnServerStop": true,
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "webRoot": "${workspaceFolder}"
      }
    }
  ]
}

# https://developer.chrome.com/docs/devtools/automatic-workspaces?hl=zh-tw
# https://developer.chrome.com/docs/devtools/workspaces?hl=zh-tw

# public/.well-known/appspecific/com.chrome.devtools.json
pwd
node -e "console.log(crypto.randomUUID())"

{
  "workspace": {
    "root": "/Users/yourname/path/to/your/project",
    "uuid": "a-random-version-4-uuid"
  }
}

# .gitignore

# chrome devtools workspace
public/.well-known/appspecific/com.chrome.devtools.json
```

## ESLint

```bash
# https://nextjs.org/docs/app/api-reference/config/eslint
pnpm add -D eslint-config-prettier

import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'

const eslintConfig = defineConfig([
  ...nextVitals,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig

# .lintstagedrc.js
const path = require('path')

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames
    .map((f) => `"${path.relative(process.cwd(), f)}"`)
    .join(' ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
```

## Git hooks

```bash
# https://prettier.io/docs/install#git-hooks
pnpm add --save-dev husky lint-staged
pnpm exec husky init
node --eval "fs.writeFileSync('.husky/pre-commit','pnpm exec lint-staged\n')"

{
  "lint-staged": {
    "**/*": "prettier --write --ignore-unknown"
  }
}
```

## Material UI

```bash
# https://mui.com/material-ui/getting-started/installation/
pnpm add @mui/material @emotion/react @emotion/styled
pnpm add @mui/icons-material

# https://mui.com/material-ui/integrations/nextjs/
pnpm add @mui/material-nextjs @emotion/cache

# https://mui.com/material-ui/customization/theme-components/
```

## notistack

```bash
# https://notistack.com/
pnpm add notistack
```

## Swiper

```bash
# https://swiperjs.com/get-started
pnpm add swiper
```

## SWR

```bash
# https://swr.vercel.app/docs/getting-started
pnpm add swr
```

## Zustand

```bash
# https://zustand.docs.pmnd.rs/getting-started/introduction
pnpm add zustand

# https://zustand.docs.pmnd.rs/guides/nextjs
```

## match

```bash
# https://nextjs.org/docs/app/building-your-application/routing/internationalization
pnpm add @formatjs/intl-localematcher
```

## negotiator

```bash
# https://nextjs.org/docs/app/building-your-application/routing/internationalization

# https://www.npmjs.com/package/negotiator
# https://github.com/jshttp/negotiator
pnpm add negotiator

# https://www.npmjs.com/package/@types/negotiator
# https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/negotiator
pnpm add -D @types/negotiator
```

## autosuggest-highlight

```bash
pnpm add autosuggest-highlight
pnpm add @types/autosuggest-highlight
```

## dayjs

```bash
# https://mui.com/x/react-date-pickers/quickstart/
pnpm add @mui/x-date-pickers

# https://day.js.org/
pnpm add dayjs
```

## libphonenumber-js

```bash
# https://www.npmjs.com/package/libphonenumber-js
# https://gitlab.com/catamphetamine/libphonenumber-js
pnpm add libphonenumber-js
```

## socket.io-client

```bash
# https://www.npmjs.com/package/socket.io-client
pnpm add socket.io-client
```

## Zod

```bash
# https://zod.dev/
pnpm add zod
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
