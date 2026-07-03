let juegos = {} // Memoria del juego por grupo

let handler = async (m, { conn, command }) => {
    let chat = m.chat

    // 1. COMANDO.TERMINAR - Cualquiera de los 2 puede usarlo
    if (command === 'terminar') {
        if (juegos[chat]) {
            let p1 = juegos[chat].p1
            let p2 = juegos[chat].p2
            delete juegos[chat]
            return m.reply(`🛑 *JUEGO TERMINADO*\n@${p1.split('@')[0]} y @${p2.split('@')[0]} ya no se sienten más 😅`, { mentions: [p1, p2] })
        }
        return // Si no hay juego, no hace nada
    }

    // 2. COMANDO.SIENTE - INICIAR JUEGO
    if (command === 'siente') {
        if (juegos[chat]) return m.reply('❌ Ya hay un juego activo. Usen.terminar pa' + ' acabar')

        let miembros = (await conn.groupMetadata(chat)).participants
          .filter(p => p.id!== conn.user.jid && p.id!== m.sender) // Sin bot y sin el que inicia
          .map(p => p.id)

        if (miembros.length < 2) return m.reply('❌ Se necesitan mínimo 2 personas más en el grupo oe')

        let p1 = miembros[Math.floor(Math.random() * miembros.length)]
        let p2 = miembros.filter(v => v!== p1)[Math.floor(Math.random() * (miembros.length - 1))]

        juegos[chat] = {
            p1, p2,
            turno: p1, // Empieza p1
            activo: true
        }

        return m.reply(`🔥 *JUGUEMOS AL QUE SE SIENTE* 🔥\n\n@${p1.split('@')[0]} vs @${p2.split('@')[0]}\n\n👉 Empieza @${p1.split('@')[0]}\nResponde a este mensaje etiquetando a @${p2.split('@')[0]}\n\nTip: Pongan.terminar pa' acabar`, { mentions: [p1, p2] })
    }

    // 3. LÓGICA DE TURNO - SOLO SI HAY JUEGO
    if (!juegos[chat] ||!juegos[chat].activo) return

    let game = juegos[chat]

    // Solo juega si es tu turno y respondes al bot
    if (m.sender!== game.turno ||!m.quoted ||!m.quoted.fromMe) return

    let mencionado = m.mentionedJid[0]
    let otro = game.turno === game.p1? game.p2 : game.p1

    if (mencionado!== otro) return m.reply(`❌ Etiqueta a @${otro.split('@')[0]} pe`, { mentions: [otro] })

    // 4. CAMBIAR TURNO
    game.turno = otro
    await m.react('😏')

    return m.reply(`👉 Te toca @${otro.split('@')[0]}\nResponde a este mensaje etiquetando a @${game.turno === game.p1? game.p2 : game.p1}`, { mentions: [otro, game.turno === game.p1? game.p2 : game.p1] })
}

handler.help = ['siente', 'terminar']
handler.tags = ['fun']
handler.command = ['siente', 'terminar'] // <- Acepta los 2 comandos
handler.group = true
export default handler