# Portfolio (Vite + React)

A minimal, 2000s-style portfolio template (text + emojis, optional pictures). Built with Vite + React.

## Quick start (local)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.
4. Edit source files in `src/` to customize your portfolio.

## Deployment

You can deploy the built site (in `dist/`) to any static hosting service. For GitHub Pages:

1. Install `gh-pages` package:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add deploy scripts to `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Run deployment:
   ```bash
   npm run deploy
   ```
