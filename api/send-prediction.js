const nodemailer = require('nodemailer');

const ISO_CODES = {
  'Qatar': 'qa', 'Ecuador': 'ec', 'Senegal': 'sn', 'Netherlands': 'nl',
  'England': 'gb-eng', 'Iran': 'ir', 'USA': 'us', 'Wales': 'gb-wls',
  'Argentina': 'ar', 'Saudi Arabia': 'sa', 'Mexico': 'mx', 'Poland': 'pl',
  'France': 'fr', 'Australia': 'au', 'Denmark': 'dk', 'Tunisia': 'tn',
  'Spain': 'es', 'Costa Rica': 'cr', 'Germany': 'de', 'Japan': 'jp',
  'Belgium': 'be', 'Canada': 'ca', 'Morocco': 'ma', 'Croatia': 'hr',
  'Brazil': 'br', 'Serbia': 'rs', 'Switzerland': 'ch', 'Cameroon': 'cm',
  'Portugal': 'pt', 'Ghana': 'gh', 'Uruguay': 'uy', 'South Korea': 'kr',
  'Italy': 'it', 'New Zealand': 'nz', 'Paraguay': 'py', 'Slovakia': 'sk',
  'Colombia': 'co', 'Greece': 'gr', 'Ivory Coast': 'ci', 'Sweden': 'se',
  'Chile': 'cl', 'Nigeria': 'ng', 'Algeria': 'dz', 'Russia': 'ru', 'Egypt': 'eg'
};

const getFlagUrl = (team) => {
  const code = ISO_CODES[team];
  return code ? `https://flagcdn.com/w40/${code.toLowerCase()}.png` : '';
};

const getFlagImg = (team) => {
  const url = getFlagUrl(team);
  return url ? `<img src="${url}" width="20" height="13" style="vertical-align: middle; margin: 0 5px; border: 1px solid #ddd;" />` : '';
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método no permitido' });

  const { user, matchResults, champion, runnerUp } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let groupsHtml = '';
    if (matchResults.groups) {
      for (const group in matchResults.groups) {
        groupsHtml += `<div style="background: #f9f9f9; padding: 10px; border-radius: 5px; margin-bottom: 10px; border: 1px solid #eee;">
          <h4 style="margin: 0 0 8px; color: #d4af37; border-bottom: 1px solid #ddd; padding-bottom: 3px;">Grupo ${group}</h4>
          <ul style="font-size: 13px; margin: 0; padding-left: 0; list-style: none;">`;
        matchResults.groups[group].forEach(m => {
          groupsHtml += `<li style="margin-bottom: 4px;">
            ${getFlagImg(m.home)} ${m.home} <b>${m.homeGoals}</b> - <b>${m.awayGoals}</b> ${m.away} ${getFlagImg(m.away)}
          </li>`;
        });
        groupsHtml += `</ul></div>`;
      }
    }

    let knockoutHtml = '';
    const koRounds = [
      { key: 'roundOf32', name: 'Dieciseisavos' },
      { key: 'roundOf16', name: 'Octavos' },
      { key: 'quarterFinals', name: 'Cuartos' },
      { key: 'semiFinals', name: 'Semifinales' },
      { key: 'final', name: 'Gran Final' }
    ];

    koRounds.forEach(round => {
      if (matchResults.knockout && matchResults.knockout[round.key]) {
        knockoutHtml += `<h4 style="margin: 20px 0 10px; color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 5px;">${round.name}</h4>
          <ul style="font-size: 13px; margin: 0; padding-left: 0; list-style: none;">`;
        matchResults.knockout[round.key].forEach(m => {
          const home = m.homeTeam || m.home;
          const away = m.awayTeam || m.away;
          let pen = m.penalties ? ` <i style="color: #666;">(Penaltis: ${m.penalties})</i>` : '';
          knockoutHtml += `<li style="margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px dashed #eee;">
            ${getFlagImg(home)} ${home} <b>${m.homeGoals !== null ? m.homeGoals : '-'}</b> vs <b>${m.awayGoals !== null ? m.awayGoals : '-'}</b> ${away} ${getFlagImg(away)} 
            <br/><span style="color: #2c7a7b; font-weight: bold;">Ganador: ${getFlagImg(m.winner)} ${m.winner}</span>${pen}
          </li>`;
        });
        knockoutHtml += `</ul>`;
      }
    });

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; max-width: 700px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #d4af37; margin-bottom: 5px;">🏆 Porra Mundial 2026</h1>
          <p style="color: #666; font-style: italic;">Confirmación de participación</p>
        </div>
        
        <div style="background: #fff8e1; padding: 15px; border-radius: 8px; border-left: 5px solid #d4af37; margin-bottom: 25px;">
          <p style="margin: 0;"><strong>Participante:</strong> ${user.name} (@${user.nickname})</p>
          <p style="margin: 5px 0 0;"><strong>Email:</strong> ${user.email}</p>
        </div>
        
        <div style="background: #2d3748; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0 0 15px; font-size: 20px; color: #f6ad55;">🥇 Predicción del Podio</h2>
          <div style="font-size: 22px; margin-bottom: 10px;">
            <span style="font-size: 30px;">🥇</span> <strong>Campeón:</strong> ${getFlagImg(champion)} <span style="color: #ecc94b;">${champion}</span>
          </div>
          <div style="font-size: 20px;">
            <span style="font-size: 25px;">🥈</span> <strong>Subcampeón:</strong> ${getFlagImg(runnerUp)} <span style="color: #cbd5e0;">${runnerUp}</span>
          </div>
        </div>

        <h3 style="color: #2d3748; border-bottom: 2px solid #eee; padding-bottom: 10px;">📊 Fase de Grupos</h3>
        <div style="display: grid; gap: 10px;">
          ${groupsHtml}
        </div>

        <h3 style="color: #2d3748; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px;">🔥 Fase Final</h3>
        <div>
          ${knockoutHtml}
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center;">
          Este es un correo automático enviado desde la App Mundial-Porra 2026.<br/>
          &copy; 2026 Mundial-Porra App - Todos los derechos reservados.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Mundial Porra 2026" <${process.env.EMAIL_USER}>`,
      to: `${user.email}, ${process.env.ADMIN_EMAIL}`,
      subject: `✅ Porra Confirmada: ${user.nickname} - Mundial 2026`,
      html: emailHtml
    });

    return res.status(200).json({ success: true, message: 'Email enviado' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
