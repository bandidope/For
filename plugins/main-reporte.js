let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply(`*Uso:* ${usedPrefix}reporte [tu problema]\n*Ejemplo:* ${usedPrefix}reporte el.menu no carga`)

    // Tu número de owner
    let owner = ['51936994155@s.whatsapp.net'] // Cambia por tu número

    let user = m.sender
    let name = await conn.getName(user) // Nombre del usuario
    let numero = user.split('@')[0] // Solo el número
    let chat = m.chat
    let grupo = chat.endsWith('@g.us')? await conn.groupMetadata(chat) : null
    let nombreGrupo = grupo? grupo.subject : 'Chat Privado'

    let reporte = `╭━━━〔 *REPORTE NUEVO 🐛* 〕━━━⬣
┃
┃ *Usuario:* ${name}
┃ *Número:* +${numero}
┃ *Link:* wa.me/${numero}
┃ *Grupo:* ${nombreGrupo}
┃ *Hora:* ${new Date().toLocaleString('es-PE')}
┃
┃ *Problema:*
┃ ${text}
┃
╰━━━━━━━━━━━━⬣`

    // Le llega al owner con mención
    for (let jid of owner) {
        conn.sendMessage(jid, { text: reporte, mentions: [user] })
    }

    // Le responde al usuario
    m.reply(`✅ *Reporte enviado*\n\nGracias ${name}, lo reviso y te aviso 🌀`)
}

handler.help = ['reporte <texto>']
handler.tags = ['main']
handler.command = ['reporte', 'bug', 'error', 'falla']
export default handler