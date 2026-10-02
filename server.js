const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'umesh_education',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;
let databaseError = null;

async function initDatabase() {
  const candidatePool = mysql.createPool(dbConfig);
  try {
    const connection = await candidatePool.getConnection();
    try {
      await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(30) DEFAULT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_created_at (created_at)
      )
    `);
    } finally {
      connection.release();
    }
    pool = candidatePool;
    databaseError = null;
    console.log('MySQL connected and users table is ready.');
  } catch (error) {
    databaseError = error.code || error.message || String(error);
    await candidatePool.end().catch(() => {});
    console.error(
      `Database connection failed (${databaseError}). Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, and that MySQL is reachable.`
    );
  }
}

app.get('/api/health', async (req, res) => {
  if (!pool) {
    return res.status(503).json({
      success: false,
      message: 'MySQL is unavailable. Check the server configuration and startup logs.',
      code: databaseError || 'DATABASE_NOT_READY',
    });
  }

  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ success: true, message: 'MySQL is connected.', rows });
  } catch (error) {
    const code = error.code || error.message || String(error);
    console.error('Health check failed:', code);
    res.status(503).json({
      success: false,
      message: 'MySQL is unavailable. Check the server configuration and startup logs.',
      code,
    });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email, phone, message } = req.body || {};
  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim() : '';
  const cleanPhone = typeof phone === 'string' ? phone.trim() : '';
  const cleanMessage = typeof message === 'string' ? message.trim() : '';

  if (!cleanName || !cleanEmail) {
    return res.status(400).json({ success: false, message: 'Name and email are required.' });
  }

  if (cleanName.length > 100 || cleanEmail.length > 150 || cleanPhone.length > 30 || cleanMessage.length > 5000) {
    return res.status(400).json({ success: false, message: 'One or more fields exceed the allowed length.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
  }

  if (!pool) {
    return res.status(503).json({ success: false, message: 'Database not connected. Please configure MySQL first.' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [cleanName, cleanEmail, cleanPhone, cleanMessage]
    );

    res.status(201).json({
      success: true,
      message: 'User data saved successfully.',
      userId: result.insertId,
    });
  } catch (error) {
    console.error('Insert failed:', error.code || error.message);
    res.status(500).json({ success: false, message: 'Unable to save your inquiry right now.' });
  }
});

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  await initDatabase();
});
