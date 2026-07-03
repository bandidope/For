console.log('================================')
console.log('PLUGIN SIENTE CARGADO CORRECTAMENTE')
console.log('================================')

global.juegos = global.juegos || {}

let handler = async (m, { conn, command }) => {
    console.log('COMANDO SIENTE EJECUTADO POR:', m.sender) // Si ves esto, ya jaló
    
    let chat = m.chat
    if (command == 'siente') {
        if (chat in global.juegos) return conn.reply(m.chat, '❌ Ya hay partida', m)
        let members = (await conn.groupMetadata(chat)).participants.map(v => v.id).filter(v => v!== conn.user.jid && v!== m.sender)
        if (members.length < 2) return conn.reply(m.chat, '❌ Faltan 2', m)
        let [p1, p2] = members.sort(() => Math.random() - 0.5)
        global.juegos = { p1, p2, turno: p1 }
        return conn.sendMessage(chat, { text: `TURNO: @${p1.split`@`[0]}`, mentions: [p1,p2] }, { quoted: m })
    }
    if (command == 'terminar') {
        delete global.juegos
        return m.reply('Terminado')
    }
    if (!(chat in global.juegos)) return
    let j = global.juegos
    if (m.sender!== j.turno) return
    let otro = j.turno == j.p1? j.p2 : j.p1
    if (m.mentionedJid?.[0] == otro) {
        j.turno = otro
        return conn.sendMessage(chat, { text: `TURNO: @${otro.split`@`[0]}`, mentions: [j.p1, j.p2] }, { quoted: m })
    }
}
handler.command = ['siente','terminar']
handler.group = true
module.exports = handler