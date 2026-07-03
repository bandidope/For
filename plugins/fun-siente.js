let juegos = {} // Memoria por grupo

let handler = async (m, { conn, command }) => {
    let chat = m.chat

    if (command === 'terminar') {
        if (juegos) {
            let p1 = juegos.p1
            let p2 = juegos.p2
            juegos = null
            return conn.sendMessage(chat, { text: `🛑 *JUEGO TERMINADO*\n@${p1.split('@')[0]} y @${p2.split('@')[0]} ya no se sienten más 😅`, mentions: [p1, p2] })
        }
        return m.reply('No hay juego activo oe')
    }

    if (command === 'siente') {
        if (juegos) return m.reply('❌ Ya hay un juego activo. Usen.terminar')

        let metadata = await conn.groupMetadata(chat)
        let miembros = metadata.participants
       .filter(p => p.id!== conn.user.jid && p.id!== m.sender) // Solo quité al bot y al que inició
       .map(p => p.id)

        if (miembros.length < 2) return m.reply('❌ Se necesitan mínimo 2 personas más en el grupo oe')

        let p1 = miembros[Math.floor(Math.random() * miembros.length)]
        let p2 = miembros.filter(v => v!== p1)[Math.floor(Math.random() * (miembros.length - 1))]

        juegos = { p1, p2, turno: p1, msgId: null }

        let msg = await conn.sendMessage(chat, { text: `🔥 *JUGUEMOS AL QUE SE SIENTE* 🔥\n\n@${p1.split('@')[0]} vs @${p2.split('@')[0]}\n\n👉 Empieza @${p1.split('@')[0]}\nResponde a ESTE mensaje etiquetando a @${p2.split('@')[0]}`, mentions: [p1, p2] })
        juegos.msgId = msg.key.id // 1. GUARDAMOS EL ID DEL BOT
        return
    }

    if (!juegos) return
    let game = juegos

    // 2. FIX CLAVE: Solo valida turno + que responda al ID exacto del bot
    if (m.sender!== game.turno) return // No es tu turno
    if (!m.quoted || m.quoted.id!== game.msgId) return // No respondiste al bot

    let mencionado = m.mentionedJid[0]
    let otro = game.turno === game.p1? game.p2 : game.p1

    if (mencionado!== otro) return m.reply(`❌ Etiqueta a @${otro.split('@')[0]} pe`, null, { mentions: })

    game.turno = otro
    await m.react('😏')

    let newMsg = await conn.sendMessage(chat, { text: `👉 Te toca @${otro.split('@')[0]}\nResponde a ESTE mensaje etiquetando a @${game.turno === game.p1? game.p2 : game.p1}`, mentions: [otro, game.turno === game.p1? game.p2 : game.p1] })
    game.msgId = newMsg.key.id // 3. ACTUALIZAMOS ID CADA TURNO
}

handler.command = ['siente', 'terminar']
handler.group = true
export default handler