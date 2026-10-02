# Umesh Educational Institute

A responsive static landing page for Umesh Educational Institute. Contact inquiries can be stored in a Google Sheets response sheet through Google Apps Script, or in MySQL through the optional API.

The home page presents three learning pillars—Academic Education, Career & Competitive Preparation, and Career Guidance & Development—with pathways from Classes 1–10 through graduation, exam preparation, job readiness, and skills. Pathway buttons scroll to the inquiry form and select that program automatically.

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

## Google Sheets response storage

This saves entries from the website form into a private Google spreadsheet in a Google Forms-style response table. It does not create a Google Form.

1. Create a Google Sheet for inquiries and open **Extensions → Apps Script**.
2. Replace the Apps Script editor contents with `google-apps-script/Code.gs` and save.
3. Choose **Deploy → New deployment → Web app**. Set **Execute as** to your account and **Who has access** to **Anyone**, then deploy and authorize it. Anyone who obtains this public endpoint can submit rows; do not use it for passwords, payment details, or other sensitive information.
4. Copy the deployed Web App URL ending in `/exec` into `googleSheetsUrl` in `api-config.js`.
5. Publish the site. New inquiries will appear in the spreadsheet's `Inquiries` tab.

The spreadsheet itself can remain private. The public Apps Script endpoint accepts only inquiry submissions; it does not expose spreadsheet read access.

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

GitHub Pages only hosts the static website; it cannot run the Node.js API or MySQL database. For MySQL, deploy `server.js` to a Node.js host and configure that host's `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `PORT` environment variables. Set `apiBaseUrl` in `api-config.js` to the deployed API origin. If `googleSheetsUrl` is configured, the form uses Google Sheets; otherwise it uses the MySQL API. Use HTTPS for deployed APIs. Never place MySQL credentials in frontend files.

## Contact details

- WhatsApp: `+91 82755368`
- Email: `umeshcholleti2219@gmail.com`

The contact form collects name, email, optional phone number, program of interest, and inquiry message. It does not request passwords. With Google Apps Script configured, submissions are written to the private spreadsheet; the program is stored in its own column. The MySQL API records the selected program with the inquiry message. If the API is unavailable, the site falls back to an email draft.

## Test responsive layout

Open `index.html` locally and resize the browser to desktop, tablet, and phone widths, or use browser developer tools' responsive-device mode. Check that the three pillars become two columns on tablet and one column on phones, the navigation opens with its menu button, and each pathway CTA selects the matching program in the contact form.
