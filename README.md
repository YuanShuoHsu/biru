This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
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

# biru

```bash
# https://nextjs.org/docs/app/getting-started/installation
npx create-next-app@latest

What is your project named? biru
Would you like to use TypeScript? Yes
Would you like to use ESLint? Yes
Would you like to use Tailwind CSS? Yes
Would you like your code inside a `src/` directory? Yes
Would you like to use App Router? (recommended) Yes
Would you like to use Turbopack for `next dev`? Yes
Would you like to customize the import alias (`@/*` by default)? No
```

## Prettier

```bash
# https://prettier.io/docs/en/install.html
yarn add --dev --exact prettier
node --eval "fs.writeFileSync('.prettierrc','{}\n')"
node --eval "fs.writeFileSync('.prettierignore','# Ignore artifacts:\nbuild\ncoverage\n')"
npx prettier . --write
npx prettier . --check

# https://prettier.io/docs/en/configuration
# https://json.schemastore.org/prettierrc
```

## Set up your editor

```bash
# https://prettier.io/docs/en/watching-files
yarn add --dev onchange
```

## eslint

```bash
# https://nextjs.org/docs/pages/building-your-application/configuring/eslint
yarn add --dev eslint-config-prettier

# https://github.com/lydell/eslint-plugin-simple-import-sort
yarn add --dev eslint-plugin-simple-import-sort

# https://github.com/sweepline/eslint-plugin-unused-imports
yarn add --dev eslint-plugin-unused-imports
```

## Git hooks

```bash
# https://prettier.io/docs/en/install
yarn add --dev husky lint-staged
npx husky init
node --eval "fs.writeFileSync('.husky/pre-commit','npx lint-staged\n')"

# https://nextjs.org/docs/pages/building-your-application/configuring/eslint
# .lintstagedrc.js
```

## Zustand

```bash
# https://github.com/pmndrs/zustand
yarn add zustand
```
