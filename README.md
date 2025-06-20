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

```bash
# https://nextjs.org/docs/app/getting-started/installation
npx create-next-app@latest
✔ What is your project named? … biru
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a `src/` directory? … Yes
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to use Turbopack for `next dev`? … Yes
✔ Would you like to customize the import alias (`@/*` by default)? … No
Creating a new Next.js app in /Users/xuyuanshi/Desktop/biru.

Using npm.

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
- @eslint/eslintrc
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
  "editor.formatOnSave": true
}
```

## eslint

```bash
# https://nextjs.org/docs/app/api-reference/config/eslint
pnpm add --save-dev eslint-config-prettier

# eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc'
const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})
const eslintConfig = [
  ...compat.config({
    extends: ['next', 'prettier'],
  }),
]
export default eslintConfig
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

# https://nextjs.org/docs/app/api-reference/config/eslint
# .lintstagedrc.js
const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}

# eslint.config.mjs
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    files: ['.lintstagedrc.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
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

## dayjs

```bash
# https://day.js.org/
pnpm add dayjs
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
