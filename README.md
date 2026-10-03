# Romanshu Portfolio

The site is split into a static frontend and a small Node.js hosting backend:

- `index.html` — page markup and deployment entry point
- `frontend/css/styles.css` — responsive styles
- `frontend/js/script.js` — interactions and portfolio content
- `backend/server.js` — serves the frontend and exposes `/api/health`

## Run locally

Install Node.js 18 or newer, then run:

```sh
cd backend
npm start
```

Open `http://localhost:3000`. The server serves the root `index.html` and the
`frontend` asset directory from the same origin, so it can be deployed as a
single Node.js web service. The project cards currently use the demo content in `frontend/js/script.js`; the
optional portfolio API integration can be enabled by setting
`window.PORTFOLIO_API_BASE` to the URL of an API that provides `/api/projects`.
