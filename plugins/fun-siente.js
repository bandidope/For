let juegos = {} // Memoria del juego por grupo

let handler = async (m, { conn, command }) => {
    let chat = m.chat

    // 1. COMANDO.TERMINAR
    if (command === 'terminar') {
        if (juegos[chat]) {
            let p1 = juegos[chat].p1
            let p2 = juegos[chat].p2
            delete juegos[chat]
            return conn.sendMessage(chat, { text: `🛑 *JUEGO TERMINADO*\n@${p1.split('@')[0]} y @${p2.split('@')[0]} ya no se sienten más 😅`, mentions: [p1, p2] })
        }
        return m.reply('No hay juego activo oe') // FIX: Antes no respondía nada
    }

    // 2. COMANDO.SIENTE - INICIAR JUEGO
    if (command === 'siente') {
        if (juegos[chat]) return m.reply('❌ Ya hay un juego activo. Usen.terminar pa acabar')

        let metadata = await conn.groupMetadata(chat)
        let miembros = metadata.participants
        .filter(p => p.id!== conn.user.jid && p.id!== m.sender) // FIX: QUITÉ EL &&!p.admin
        .map(p => p.id)

        if (miembros.length < 2) return m.reply('❌ Se necesitan mínimo 2 personas más en el grupo oe')

        let p1 = miembros[Math.floor(Math.random() * miembros.length)]
        let p2 = miembros.filter(v => v!== p1)[Math.floor(Math.random() * (miembros.length - 1))]

        juegos[chat] = {
            p1, p2,
            turno: p1,
            activo: true,
            msgId: null // FIX: Para que sí detecte la respuesta
        }

        let msg = await conn.sendMessage(chat, { text: `🔥 *JUGUEMOS AL QUE SE SIENTE* 🔥\n\n@${p1.split('@')[0]} vs @${p2.split('@')[0]}\n\n👉 Empieza @${p1.split('@')[0]}\nResponde a ESTE mensaje etiquetando a @${p2.split('@')[0]}\n\n.terminar = Acabar`, mentions: [p1, p2] })
        juegos[chat].msgId = msg.key.id // GUARDAMOS ID
        return
    }

    // 3. LÓGICA DE TURNO
    if (!juegos[chat] ||!juegos[chat].activo) return
    let game = juegos[chat]

    // FIX 2: Usar msgId en vez de fromMe. fromMe falla mucho en Baileys
    if (m.sender!== game.turno ||!m.quoted || m.quoted.id!== game.msgId) return

    let mencionado = m.mentionedJid[0]
    let otro = game.turno === game.p1? game.p2 : game.p1

    if (mencionado!== otro) return m.reply(`❌ Etiqueta a @${otro.split('@')[0]} pe`, null, { mentions: })

    // 4. CAMBIAR TURNO
    game.turno = otro
    await m.react('😏')

    let newMsg = await conn.sendMessage(chat, { text: `👉 Te toca @${otro.split('@')[0]}\nResponde a ESTE mensaje etiquetando a @${game.turno === game.p1? game.p2 : game.p1}`, mentions: [otro, game.turno === game.p1? game.p2 : game.p1] })
    game.msgId = newMsg.key.id // ACTUALIZAMOS ID
}

handler.help = ['siente', 'terminar']
handler.tags = ['fun']
handler.command = ['siente', 'terminar']
handler.group = true
export default handler