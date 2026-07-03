let juegos = {}

let handler = async (m, { conn, command }) => {
    let chat = m.chat
    let juego = juegos

    // 1. INICIAR JUEGO
    if (command === 'siente') {
        if (juego) return m.reply('❌ Ya hay partida. Usa.terminar')

        let miembros = (await conn.groupMetadata(chat)).participants
       .map(p => p.id)
       .filter(id => id!== conn.user.jid && id!== m.sender)

        if (miembros.length < 2) return m.reply('❌ Necesito mínimo 2 personas más en el grupo')

        let [p1, p2] = miembros.sort(() => 0.5 - Math.random()).slice(0, 2)
        juegos = { p1, p2, turno: p1 }

        return conn.sendMessage(chat, {
            text: `🔥 *QUE SE SIENTE* 🔥\n\n@${p1.split('@')[0]} vs @${p2.split('@')[0]}\n\n👉 Le toca a @${p1.split('@')[0]}\nEtiqueta a @${p2.split('@')[0]}`,
            mentions: [p1, p2]
        })
    }

    // 2. TERMINAR
    if (command === 'terminar') {
        if (!juego) return m.reply('No hay partida activa')
        let { p1, p2 } = juego
        delete juegos
        return conn.sendMessage(chat, {
            text: `🛑 Partida terminada\n@${p1.split('@')[0]} y @${p2.split('@')[0]} se libraron 😅`,
            mentions: [p1, p2]
        })
    }

    // 3. JUGAR
    if (!juego) return
    if (m.sender!== juego.turno) return m.reply('❌ No es tu turno oe')

    let otro = juego.turno === juego.p1? juego.p2 : juego.p1
    let tag = m.mentionedJid[0]

    if (tag!== otro) return m.reply(`❌ Etiqueta a @${otro.split('@')[0]}`, null, { mentions: [otro] })

    juego.turno = otro
    await m.react('😏')

    return conn.sendMessage(chat, {
        text: `👉 Turno de @${otro.split('@')[0]}\nEtiqueta a @${juego.turno === juego.p1? juego.p2 : juego.p1}`,
        mentions: [otro, juego.turno === juego.p1? juego.p2 : juego.p1]
    })
}

handler.command = ['siente', 'terminar']
handler.group = true
export default handler