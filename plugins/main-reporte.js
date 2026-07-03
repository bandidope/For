let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply(`*Uso:* ${usedPrefix}reporte [tu problema]\n*Ejemplo:* ${usedPrefix}reporte el .ping no funciona`)

    // Tu número de owner
    let owner = ['51936994155@s.whatsapp.net'] // Cambia por tu número con código de país

    let reporte = `╭━━━〔 *REPORTE NUEVO 🐛* 〕━━━⬣
┃
┃ *De:* @${m.sender.split('@')[0]}
┃ *Chat:* ${m.chat}
┃ *Hora:* ${new Date().toLocaleString('es-PE')}
┃
┃ *Problema:*
┃ ${text}
┃
╰━━━━━━━━━━━━⬣`

    // Le llega al owner
    for (let jid of owner) {
        conn.sendMessage(jid, { text: reporte, mentions: [m.sender] })
    }

    // Le responde al usuario
    m.reply(`✅ *Reporte enviado*\n\nGracias por avisar. Lo reviso lo antes posible 🌀`)
}

handler.help = ['reporte <texto>']
handler.tags = ['info']
handler.command = ['reporte', 'bug', 'error', 'falla']
export default handler