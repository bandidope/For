let juegos = global.juegos || (global.juegos = {})

let handler = async (m, { conn, usedPrefix, command }) => {
    let chat = m.chat

    if (/^siente$/i.test(command)) {
        if (chat in juegos) return conn.reply(m.chat, `❌ Ya hay partida. Usa ${usedPrefix}terminar`, m)
        let members = (await conn.groupMetadata(chat)).participants.map(v => v.id).filter(v => v!== conn.user.jid && v!== m.sender)
        if (members.length < 2) return conn.reply(m.chat, '❌ Mínimo 2 personas más oe', m)
        members.sort(() => Math.random() - 0.5)
        let [p1, p2] = members
        juegos = { p1, p2, turno: p1 }
        return conn.sendMessage(chat, { text: `🔥 ¿QUÉ SE SIENTE? 🔥\n\n@${p1.split`@`[0]} vs @${p2.split`@`[0]}\n\n👉 TURNO: @${p1.split`@`[0]}`, mentions: [p1, p2] }, { quoted: m })
    }

    if (/^terminar$/i.test(command)) {
        if (!(chat in juegos)) return conn.reply(m.chat, 'No hay partida', m)
        let { p1, p2 } = juegos
        delete juegos
        return conn.sendMessage(chat, { text: `🛑 TERMINADO\n@${p1.split`@`[0]} y @${p2.split`@`[0]}`, mentions: [p1, p2] }, { quoted: m })
    }

    if (!(chat in juegos)) return
    let j = juegos
    if (m.sender!== j.turno) return
    let otro = j.turno == j.p1? j.p2 : j.p1
    if (m.mentionedJid && m.mentionedJid[0] == otro) {
        j.turno = otro
        await conn.sendMessage(m.chat, { react: { text: '😏', key: m.key } })
        return conn.sendMessage(chat, { text: `🔥 ¿QUÉ SE SIENTE? 🔥\n\n@${j.p1.split`@`[0]} vs @${j.p2.split`@`[0]}\n\n👉 TURNO: @${otro.split`@`[0]}`, mentions: [j.p1, j.p2, otro] }, { quoted: m })
    }
}

handler.help = ['siente', 'terminar']
handler.tags = ['fun']
handler.command = ['siente', 'terminar'] // ARRAY, no regex. Así lo lee tu handler.js
handler.group = true

module.exports = handler // CLAVE: CommonJS, no ESM