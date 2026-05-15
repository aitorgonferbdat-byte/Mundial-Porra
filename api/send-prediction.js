const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { user, matchResults, champion, runnerUp } = req.body;

  if (!user || !matchResults || !champion || !runnerUp) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Build Groups HTML
    let groupsHtml = '';
    if (matchResults.groups) {
      for (const group in matchResults.groups) {
        groupsHtml += `<div style="background: #f9f9f9; padding: 10px; border-radius: 5px;"><h4 style="margin: 0 0 5px; color: #d4af37;">Grupo ${group}</h4><ul style="font-size: 12px; margin: 0; padding-left: 20px;">`;
        matchResults.groups[group].forEach(m => {
          groupsHtml += `<li>${m.home} ${m.homeGoals} - ${m.awayGoals} ${m.away}</li>`;
        });
        groupsHtml += `</ul></div>`;
      }
    }

    // Build Knockout HTML
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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Nueva Porra Mundial 2026: ${user.nickname}`,
      text: `¡Hola! ${user.name} (@${user.nickname}) ha enviado una nueva porra.\n\nCampeón: ${champion}\nSubcampeón: ${runnerUp}\n\nRevisa el panel para más detalles.`,
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Predicción enviada por email correctamente' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ success: false, error: 'Error al enviar el email: ' + error.message });
  }
};
