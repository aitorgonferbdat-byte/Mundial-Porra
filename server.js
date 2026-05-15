const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new Database('./mundial_porra.db');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nickname TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    match_results TEXT NOT NULL,
    champion TEXT NOT NULL,
    runner_up TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// API Routes

// User registration
app.post('/api/users/register', (req, res) => {
  const { name, nickname, email } = req.body;
  
  try {
    const stmt = db.prepare('INSERT INTO users (name, nickname, email) VALUES (?, ?, ?)');
    const result = stmt.run(name, nickname, email);
    res.json({ success: true, userId: result.lastInsertRowid });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ success: false, error: 'Nickname already exists' });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

// Submit prediction
app.post('/api/predictions/submit', async (req, res) => {
  const { userId, matchResults, champion, runnerUp } = req.body;
  
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    
    const stmt = db.prepare(
      'INSERT INTO predictions (user_id, match_results, champion, runner_up) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(userId, JSON.stringify(matchResults), champion, runnerUp);

    // Build Match Results HTML
    let groupsHtml = '';
    for (const group in matchResults.groups) {
      groupsHtml += `<div style="background: #f9f9f9; padding: 10px; border-radius: 5px;"><h4 style="margin: 0 0 5px; color: #d4af37;">Grupo ${group}</h4><ul style="font-size: 12px; margin: 0; padding-left: 20px;">`;
      matchResults.groups[group].forEach(m => {
        groupsHtml += `<li>${m.home} ${m.homeGoals} - ${m.awayGoals} ${m.away}</li>`;
      });
      groupsHtml += `</ul></div>`;
    }

    let knockoutHtml = '';
    const koRounds = [
      { key: 'roundOf32', name: 'Dieciseisavos' },
      { key: 'roundOf16', name: 'Octavos' },
      { key: 'quarterFinals', name: 'Cuartos' },
      { key: 'semiFinals', name: 'Semifinales' },
      { key: 'final', name: 'Final' }
    ];
    
    koRounds.forEach(round => {
      if (matchResults.knockout && matchResults.knockout[round.key]) {
        knockoutHtml += `<h4 style="margin: 15px 0 5px; color: #d4af37;">${round.name}</h4><ul style="font-size: 12px; margin: 0; padding-left: 20px;">`;
        matchResults.knockout[round.key].forEach(m => {
          let pen = m.penalties ? ` <i>(Pen: ${m.penalties})</i>` : '';
          knockoutHtml += `<li>${m.homeTeam || m.home} <b>${m.homeGoals !== null ? m.homeGoals : '-'}</b> vs <b>${m.awayGoals !== null ? m.awayGoals : '-'}</b> ${m.awayTeam || m.away}${pen} => <b>${m.winner}</b></li>`;
        });
        knockoutHtml += `</ul>`;
      }
    });

    // Send notification email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 800px; margin: 0 auto;">
        <h2 style="color: #d4af37;">🏆 Nueva Porra Recibida</h2>
        <p><strong>Participante:</strong> ${user.name} (@${user.nickname})</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 5px 0; font-size: 18px;">🥇 <strong>Campeón:</strong> ${champion}</p>
          <p style="margin: 5px 0; font-size: 18px;">🥈 <strong>Subcampeón:</strong> ${runnerUp}</p>
        </div>

        <h3 style="border-bottom: 2px solid #d4af37; padding-bottom: 5px;">Resultados de la Fase de Grupos</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
          ${groupsHtml}
        </div>

        <h3 style="border-bottom: 2px solid #d4af37; padding-bottom: 5px;">Resultados de Eliminatorias</h3>
        <div style="background: #fdfdfd; padding: 15px; border: 1px solid #eee; border-radius: 8px;">
          ${knockoutHtml}
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">Enviado automáticamente desde Mundial-Porra App.</p>
      </div>
    `;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(emailHtml);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Nueva Porra Mundial 2026: ${user.nickname}`,
      text: `¡Hola! ${user.name} (@${user.nickname}) ha enviado una nueva porra.\n\nCampeón: ${champion}\nSubcampeón: ${runnerUp}\n\nRevisa el panel para más detalles.`,
      html: emailHtml,
      attachments: [
        {
          filename: `porra_${user.nickname}.pdf`,
          content: pdfBuffer
        }
      ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.json({ success: true, predictionId: result.lastInsertRowid });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all predictions summary
app.get('/api/predictions/summary', (req, res) => {
  try {
    const predictions = db.prepare(`
      SELECT u.name, u.nickname, p.champion, p.runner_up, p.created_at
      FROM predictions p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `).all();
    res.json({ success: true, predictions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user prediction
app.get('/api/predictions/user/:userId', (req, res) => {
  try {
    const prediction = db.prepare(
      'SELECT * FROM predictions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1'
    ).get(req.params.userId);
    res.json({ success: true, prediction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
