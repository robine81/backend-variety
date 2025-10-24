Deployment instructions for Render / Railway

Quick summary
- This backend is a standard Node/Express app. You can deploy it as a Docker service (recommended) or use the platform's Node support.
- The frontend will remain on Netlify (serene-swan-2b9f44.netlify.app) and should call the backend URL once deployed.

Environment variables (set these in Render / Railway / host settings)
- DATABASE_URL: your Aiven connection string (e.g. mysql://user:pass@host:port/defaultdb?ssl-mode=REQUIRED)
- NODE_ENV=production
- ORIGINS or ORIGIN: set to the Netlify URL so CORS allows requests. Example: ORIGINS=https://serene-swan-2b9f44.netlify.app
- JWT_SECRET (and any other secrets your app currently uses)

Render deployment (example)
1. In Render dashboard, create a new Web Service.
2. Connect to the GitHub repo `robine81/backend-variety` and choose the `Migration_update` branch (or `main`).
3. Select Docker as the environment and point to the `Dockerfile` at repo root, or allow Render to run `npm start`.
4. Add the environment variables above.
5. Deploy.

Railway / Heroku
- For Railway you can add a new project and link the GitHub repo; Railway will detect Node and you can set the start command `npm start`.
- On Heroku you can use the included `Procfile` so `npm start` will be used.

Notes about DB connections on server hosts
- The app uses Sequelize and the `config/database.js` file. The connection will reuse the Sequelize instance across requests.
- For production, set proper SSL cert handling (do not set DB_SSL_ALLOW_SELF_SIGNED=true in production).
