const juegos = new Map() // Map es más estable que {}

let handler = async (m, { conn, command }) => {
    let chat = m.chat
    let juego = juegos.get(chat)

    if (command === 'siente') {
        if (juego) return m.reply('❌ Ya hay partida. Usa.terminar')

        let miembros = (await conn.groupMetadata(chat)).participants
         .map(p => p.id)
         .filter(id =>!id.includes(conn.user.jid) && id!== m.sender)

        if (miembros.length < 2) return m.reply('❌ Mínimo 2 personas más oe')

        let [p1, p2] = miembros.sort(() => 0.5 - Math.random()).slice(0, 2)
        juegos.set(chat, { p1, p2, turno: p1 })

        return conn.sendMessage(chat, {
            text: `🔥 *QUE SE SIENTE* 🔥\n\n@${p1.split('@')[0]} vs @${p2.split('@')[0]}\n\n👉 Turno: @${p1.split('@')[0]}\nEtiqueta a @${p2.split('@')[0]}`,
            mentions: [p1, p2]
        })
    }

    if (command === 'terminar') {
        if (!juego) return m.reply('No hay partida')
        juegos.delete(chat)
        return m.reply(`🛑 Partida terminada`)
    }

    if (!juego) return
    if (m.sender!== juego.turno) return

    let otro = juego.turno === juego.p1? juego.p2 : juego.p1

    if (!m.mentionedJid?.[0] || m.mentionedJid[0]!== otro) {
        return m.reply(`❌ Etiqueta a @${otro.split('@')[0]}`, null, { mentions: })
    }

    juegos.set(chat, {...juego, turno: otro })
    await m.react('😏')

    return conn.sendMessage(chat, {
        text: `👉 Turno: @${otro.split('@')[0]}\nEtiqueta a @${juego.turno === juego.p1? juego.p2 : juego.p1}`,
        mentions: [otro, juego.turno === juego.p1? juego.p2 : juego.p1]
    })
}

handler.command = ['siente', 'terminar']
handler.group = true
export default handler