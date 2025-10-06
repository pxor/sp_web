## ⚙️ Requirements

* **pnpm** (recommended package manager)
* **Node.js**:
  This project follows engine constraints from `@sveltejs/vite-plugin-svelte@6.2.1 (svelte@5.39.8, vite@7.1.9)`.

If your Node is too old, installs will fail with an error like:

```
ERR_PNPM_UNSUPPORTED_ENGINE

Your Node version is incompatible with "@sveltejs/vite-plugin-svelte@6.2.1(svelte@5.39.8)(vite@7.1.9)".

Expected version: ^20.19 || ^22.12 || >=24
Got: v20.15.1
```

### Install pnpm

```bash
# Corepack (Node 18+):
corepack enable
corepack prepare pnpm@latest --activate

# Or via npm:
npm i -g pnpm
```

### Update Node (pick one)

```bash
# nvm
nvm install 22
nvm use 22

# Volta
volta install node@22

# Nix (one-off shell)
nix shell nixpkgs#nodejs_22 nixpkgs#pnpm
```

---

## 🚀 Quick Start

```bash
# install deps
pnpm install

# start dev server
pnpm dev
# http://localhost:5173

# build for production
pnpm build

# preview production build
pnpm preview
```

---

## 🔐 Environment (SMTP for contact form)

Create a **`.env`** file in the project root (do **not** commit it):

```dotenv
# Gmail SMTP (use a Google App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=nedislav@gmail.com
SMTP_PASS=<YOUR_16_CHAR_GMAIL_APP_PASSWORD>

# From must be your Gmail or a verified alias
SMTP_FROM="Shape Your Balance <nedislav@gmail.com>"

# Recipient (your inbox)
SMTP_TO=nedislav@gmail.com
```

> In your server code, dotenv is loaded via `import 'dotenv/config'`.

**Get an App Password:** Google Account → Security → 2-Step Verification → **App passwords** → create one → paste into `SMTP_PASS`.

---

## 📂 Project Scripts

* `pnpm dev` — run dev server
* `pnpm build` — build production assets
* `pnpm preview` — preview the build locally
