# Umesh Educational Institute

A responsive static landing page for Umesh Educational Institute, with an optional MySQL-backed API for storing user details.

## Preview locally

Open `index.html` in a browser, or use VS Code's Live Server extension.

## Publish with GitHub Pages

1. Create a GitHub repository and push these files to its default branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the default branch and the `/ (root)` folder, then save.
5. Wait for GitHub Pages to publish the site; the Pages settings will show its URL.

## MySQL database setup

1. Provision a MySQL database with a hosting provider, or install MySQL locally. Free tiers and availability change; confirm the provider supports external connections and the MySQL protocol.
2. Run `db/schema.sql` in that database (or create the database and `users` table using the provider's console).
3. Copy `.env.example` to `.env` and set the database connection details. Keep `.env` private; it is excluded from Git.
4. Install dependencies and start the API server:

   npm install
   npm start

5. The API supports:
   - `GET /api/health`
   - `POST /api/users`

## Example `.env`

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=umesh_education
PORT=3000
```

## Connect the GitHub Pages form

GitHub Pages only hosts the static website; it cannot run the Node.js API or MySQL database. Deploy `server.js` to a Node.js host and configure that host's `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `PORT` environment variables. Set the deployed API origin in `api-config.js` as `window.UmeshInstituteConfig = { apiBaseUrl: "https://your-api-host.example" };`. Use HTTPS for the API when the site is served over HTTPS. Never place MySQL credentials in frontend files.

## Contact details

- WhatsApp: `+91 82755368`
- Email: `umeshcholleti2219@gmail.com`

Contact form submissions are sent to the API and stored in MySQL when the backend is deployed and configured. If the API is unavailable, the form falls back to opening an email draft.
