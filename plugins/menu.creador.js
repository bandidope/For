let handler = async (m, { conn, usedPrefix }) => {
  let taguser = '@' + m.sender.split('@')[0]
  
  let txt = `*👑 [ CREADOR - FOR THREE BOT ]* 👑\n\n`
  txt += `━━━━━━━━━━\n`
  txt += `👤 *Nombre:* Yallico\n`
  txt += `📱 *WhatsApp:* wa.me/51936994155\n`
  txt += `👥 *Grupo Oficial:* https://chat.whatsapp.com/LjPhgjqCM934QEzYz3vrVk\n`
  txt += `━━━━━━━━━━━━━━━━━━\n\n`
  txt += `> No hagas spam al creador 😅\n`
  txt += `> Solicitado por: ${taguser}`
  
  let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;Yallico;;;\nFN:Yallico\nitem1.TEL;waid=51936994155:+51 936 994 155\nitem1.X-ABLabel:Creador For Three\nitem2.URL;type=Grupo:https://chat.whatsapp.com/LjPhgjqCM934QEzYz3vrVk\nEND:VCARD`
  
  await conn.sendMessage(m.chat, { 
    contacts: { 
      displayName: 'Yallico', 
      contacts: [{ vcard }] 
    },
    text: txt,
    mentions: [m.sender]
  }, { quoted: m })
}

handler.help = ['creador', 'owner', 'dueño']
handler.tags = ['info'] // <-- AQUÍ ESTÁ EL CAMBIO BRO
handler.command = /^(creador|owner|dueño|propietario)$/i
export default handler