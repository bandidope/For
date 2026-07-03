let handler = async (m, { conn, command, text }) => {
  let who = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0]
          : m.quoted? m.quoted.sender
          : m.sender;

  let name = await conn.getName(who);
  let userTarget = m.mentionedJid && m.mentionedJid[0]? `@${who.split('@')[0]}` : name;
  let porcentaje = Math.floor(Math.random() * 500) + 1;

  let respuestas = {
    'gay': `🏳️‍🌈 *RESULTADO:* ${porcentaje}% GAY`,
    'lesbiana': `🏳️‍🌈 *RESULTADO:* ${porcentaje}% LESBIANA`,
    'pajero': `😏💦 *RESULTADO:* ${porcentaje}% PAJERO`,
    'pajera': `😏💦 *RESULTADO:* ${porcentaje}% PAJERA`,
    'puto': `*RESULTADO:* ${porcentaje}% PUTO, MÁS INFO A SU PRIVADO 🔥🥵 XD`,
    'puta': `*RESULTADO:* ${porcentaje}% PUTA, MÁS INFO A SU PRIVADO 🔥🥵 XD`,
    'manco': `*RESULTADO:* ${porcentaje}% MANCO 💩`,
    'manca': `*RESULTADO:* ${porcentaje}% MANCA 💩`,
    'rata': `*RESULTADO:* ${porcentaje}% RATA 🐁 COME QUESO 🧀`,
    'prostituto': `*RESULTADO:* ${porcentaje}% PROSTITUTO 🫦👅, ¿QUIÉN QUIERE DE SUS SERVICIOS? XD`,
    'prostituta': `*RESULTADO:* ${porcentaje}% PROSTITUTA 🫦👅, ¿QUIÉN QUIERE DE SUS SERVICIOS? XD`
  }

  let respuestaFinal = respuestas[command.toLowerCase()];
  if (!respuestaFinal) return;

  // [BARRA DE CARGA]
  const frames = [
    `_*Analizando a ${userTarget}...*_\n\n[░░░░░░] 0%`,
    `_*Analizando a ${userTarget}...*_\n\n[▓░░░░░] 16%`,
    `_*Analizando a ${userTarget}...*_\n\n[▓░░░░] 33%`,
    `_*Analizando a ${userTarget}...*_\n\n[▓░░░] 50%`,
    `_*Analizando a ${userTarget}...*_\n\n[▓▓▓░░] 66%`,
    `_*Analizando a ${userTarget}...*_\n\n[▓▓▓▓▓░] 83%`,
    `_*Analizando a ${userTarget}...*_\n\n[▓▓▓▓▓▓] 100%`
  ];

  let msg = await conn.sendMessage(m.chat, { text: frames[0], mentions: [who] }, { quoted: m });

  for (let i = 1; i < frames.length; i++) {
    await new Promise(r => setTimeout(r, 500)); // 0.5s entre cada frame
    await conn.sendMessage(m.chat, { text: frames[i], edit: msg.key });
  }

  await new Promise(r => setTimeout(r, 700));
  await conn.sendMessage(m.chat, {
    text: `_*${userTarget}* ${respuestaFinal}*`,
    mentions: [who],
    edit: msg.key
  });
}

handler.help = ['gay', 'lesbiana', 'pajero', 'pajera', 'puto', 'puta', 'manco', 'manca', 'rata', 'prostituta', 'prostituto'].map((v) => v + " *@user*")
handler.tags = ['fun']
handler.command = /^(gay|lesbiana|pajero|pajera|puto|puta|manco|manca|rata|prostituta|prostituto)$/i

export default handler