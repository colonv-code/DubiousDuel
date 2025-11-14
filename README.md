# DubiousDuel

For our awesome battle sim

How to make this work

1. Pull the repo
2. open repo up in vscode
3. Create .env.local with the following:
4. `MONGO_URI=<connection uri>`
5. new terminal > `cd backend`
6. `npm install` > `node server.js`
7. should get "API running on :3001". keep this terminal running
8. new terminal > `cd frontend`
9. `npm install` > `npm run dev`
10. dev server should start with vite. keep this terminal running
11. any updates to front end should be captured and updated to the dev server automatically on save. any updates to the backend, you need to restart the server (run `node server.js` in backend console again.)
