const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
require('dotenv').config();

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const user = {
      name: 'Santiago de Prueba',
      nickname: 'santi_test_full',
      email: 'santiago@ejemplo.com'
    };

    const TEAMS = {
      A: ['Qatar 🇶🇦', 'Ecuador 🇪🇨', 'Senegal 🇸🇳', 'Netherlands 🇳🇱'],
      B: ['England 🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Iran 🇮🇷', 'USA 🇺🇸', 'Wales 🏴󠁧󠁢󠁷󠁬󠁳󠁿'],
      C: ['Argentina 🇦🇷', 'Saudi Arabia 🇸🇦', 'Mexico 🇲🇽', 'Poland 🇵🇱'],
      D: ['France 🇫🇷', 'Australia 🇦🇺', 'Denmark 🇩🇰', 'Tunisia 🇹🇳'],
      E: ['Spain 🇪🇸', 'Costa Rica 🇨🇷', 'Germany 🇩🇪', 'Japan 🇯🇵'],
      F: ['Belgium 🇧🇪', 'Canada 🇨🇦', 'Morocco 🇲🇦', 'Croatia 🇭🇷'],
      G: ['Brazil 🇧🇷', 'Serbia 🇷🇸', 'Switzerland 🇨🇭', 'Cameroon 🇨🇲'],
      H: ['Portugal 🇵🇹', 'Ghana 🇬🇭', 'Uruguay 🇺🇾', 'South Korea 🇰🇷'],
      I: ['Italy 🇮🇹', 'New Zealand 🇳🇿', 'Paraguay 🇵🇾', 'Slovakia 🇸🇰'],
      J: ['Japan 🇯🇵', 'Colombia 🇨🇴', 'Greece 🇬🇷', 'Ivory Coast 🇨🇮'],
      K: ['Sweden 🇸🇪', 'Chile 🇨🇱', 'Nigeria 🇳🇬', 'Algeria 🇩🇿'],
      L: ['Croatia 🇭🇷', 'Russia 🇷🇺', 'Egypt 🇪🇬', 'Uruguay 🇺🇾']
    };

    const matchResults = {
      groups: {},
      knockout: {
        roundOf32: [],
        roundOf16: [],
        quarterFinals: [],
        semiFinals: [],
        final: []
      }
    };

    // Keep track of who advanced
    const allAdvancingTeams = [];

    // Generate 12 groups
    Object.keys(TEAMS).forEach(g => {
      const t = TEAMS[g];
      matchResults.groups[g] = [
        { home: t[0], away: t[1], homeGoals: 2, awayGoals: 1 },
        { home: t[2], away: t[3], homeGoals: 0, awayGoals: 0 },
        { home: t[0], away: t[2], homeGoals: 3, awayGoals: 0 },
        { home: t[1], away: t[3], homeGoals: 1, awayGoals: 1 },
        { home: t[3], away: t[0], homeGoals: 0, awayGoals: 2 },
        { home: t[1], away: t[2], homeGoals: 2, awayGoals: 2 },
      ];
      // Push group winners / runners-up conceptually
      allAdvancingTeams.push(t[0], t[1]);
    });
    
    // We need 32 teams for round of 32. allAdvancingTeams has 24. We'll duplicate some just for the simulation.
    while(allAdvancingTeams.length < 32) {
      allAdvancingTeams.push(TEAMS['A'][2], TEAMS['B'][2], TEAMS['C'][2], TEAMS['D'][2], TEAMS['E'][2], TEAMS['F'][2], TEAMS['G'][2], TEAMS['H'][2]);
    }

    const r32Teams = allAdvancingTeams.slice(0, 32);
    const r16Teams = [];
    // Knockouts - Round of 32
    for(let i=0; i<16; i++) {
      const home = r32Teams[i*2];
      const away = r32Teams[i*2+1];
      const winner = home;
      r16Teams.push(winner);
      matchResults.knockout.roundOf32.push({ home, away, homeGoals: 2, awayGoals: 1, winner });
    }

    const qfTeams = [];
    // Round of 16
    for(let i=0; i<8; i++) {
      const home = r16Teams[i*2];
      const away = r16Teams[i*2+1];
      const winner = home;
      qfTeams.push(winner);
      matchResults.knockout.roundOf16.push({ home, away, homeGoals: 1, awayGoals: 0, winner });
    }

    const sfTeams = [];
    // Quarter Finals
    for(let i=0; i<4; i++) {
      const home = qfTeams[i*2];
      const away = qfTeams[i*2+1];
      const winner = home;
      sfTeams.push(winner);
      matchResults.knockout.quarterFinals.push({ home, away, homeGoals: 3, awayGoals: 2, winner });
    }

    const fTeams = [];
    // Semi Finals
    for(let i=0; i<2; i++) {
      const home = sfTeams[i*2];
      const away = sfTeams[i*2+1];
      const winner = home;
      fTeams.push(winner);
      matchResults.knockout.semiFinals.push({ home, away, homeGoals: 1, awayGoals: 1, penalties: '4-3', winner });
    }

    // Final
    const champion = fTeams[0];
    const runnerUp = fTeams[1];
    matchResults.knockout.final.push({ home: fTeams[0], away: fTeams[1], homeGoals: 2, awayGoals: 1, winner: champion });

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

    console.log('Generando PDF...');
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(emailHtml);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    console.log('Enviando correo...');
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "Nueva Porra Completa: " + user.nickname,
      text: "¡Hola! " + user.name + " (@" + user.nickname + ") ha enviado una nueva porra.\n\nCampeón: " + champion + "\nSubcampeón: " + runnerUp + "\n\nRevisa el panel para más detalles.",
      html: emailHtml,
      attachments: [
        {
          filename: 'porra_' + user.nickname + '.pdf',
          content: pdfBuffer
        }
      ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error enviando el correo:', error);
      } else {
        console.log('Correo simulado enviado exitosamente:', info.response);
      }
    });

  } catch (err) {
    console.error('Error:', err);
  }
})();
