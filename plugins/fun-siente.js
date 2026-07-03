let salas = null // Lo puse en null para controlarlo mejor

let handler = async (m, { conn, command, isAdmin }) => {
    let chat = m.chat

    // 1..TERMINAR - Solo admin puede terminar juego activo
    if (command === 'terminar') {
        if (salas && salas.estado === 'jugando' &&!isAdmin) return m.reply('❌ Solo un admin puede terminar el juego oe')
        if (salas) {
            salas = null // FIX: null en vez de delete
            return m.reply('🛑 *Sala eliminada*')
        }
        return m.reply('No hay sala activa oe')
    }

    // 2..SIENTE - CREAR LOBBY
    if (command === 'siente') {
        if (salas && salas.estado) return m.reply('❌ Ya hay una sala activa. Usa.sala pa ver o.terminar pa borrar') // FIX: salas && salas.estado
        salas = { inscritos: [], estado: 'lobby', msgId: null }
        return m.reply(`🔥 *LOBBY: JUGUEMOS AL QUE SE SIENTE* 🔥\n\nAnótense con:.anotar\nMínimo 2 personas.\nCuando estén listos un admin pone:.empezar\n.sala = Ver inscritos`)
    }

    // 3..ANOTAR
    if (command === 'anotar') {
        if (!salas || salas.estado!== 'lobby') return m.reply('❌ No hay lobby activo. Crea uno con.siente')
        if (salas.inscritos.includes(m.sender)) return m.reply('✅ Ya estás anotado pe')
        salas.inscritos.push(m.sender)
        return m.reply(`✅ @${m.sender.split('@')[0]} anotado. Total: *${salas.inscritos.length}*`, null, { mentions: [m.sender] })
    }

    // 4..SALA
    if (command === 'sala') {
        if (!salas) return m.reply('❌ No hay sala activa')
        let lista = salas.inscritos.length? salas.inscritos.map((v,i) => `${i+1}. @${v.split('@')[0]}`).join('\n') : '> Vacío'
        return m.reply(`*📋 SALA DE JUEGO*\nEstado: *${salas.estado}*\n\n${lista}`, null, { mentions: salas.inscritos })
    }

    // 5..EMPEZAR - Solo admin
    if (command === 'empezar') {
        if (!isAdmin) return m.reply('❌ Solo un admin puede iniciar el juego oe')
        if (!salas || salas.estado!== 'lobby') return m.reply('❌ No hay lobby activo')
        if (salas.inscritos.length < 2) return m.reply('❌ Se necesitan mínimo 2 personas anotadas oe')

        let p1 = salas.inscritos[Math.floor(Math.random() * salas.inscritos.length)]
        let p2 = salas.inscritos.filter(v => v!== p1)[Math.floor(Math.random() * (salas.inscritos.length - 1))]

        salas = { p1, p2, turno: p1, estado: 'jugando', msgId: null, inscritos: salas.inscritos }

        let msg = await conn.sendMessage(chat, { text: `🎮 *EMPEZÓ EL JUEGO* 🎮\n\n@${p1.split('@')[0]} vs @${p2.split('@')[0]}\n\n👉 Empieza @${p1.split('@')[0]}\nResponde a ESTE mensaje etiquetando a @${p2.split('@')[0]}\n\n.terminar = Solo admin`, mentions: [p1, p2] })
        salas.msgId = msg.key.id
        return
    }

    // 6. LÓGICA DE TURNO
    if (!salas || salas.estado!== 'jugando') return
    let game = salas

    if (m.sender!== game.turno) return
    if (!m.quoted || m.quoted.id!== game.msgId) return // Solo respondiendo al bot

    let mencionado = m.mentionedJid[0]
    let otro = game.turno === game.p1? game.p2 : game.p1

    if (mencionado!== otro) return m.reply(`❌ Etiqueta a @${otro.split('@')[0]} pe`, null, { mentions: })

    game.turno = otro
    await m.react('😏')

    let newMsg = await conn.sendMessage(chat, { text: `👉 Te toca @${otro.split('@')[0]}\nResponde a ESTE mensaje etiquetando a @${game.turno === game.p1? game.p2 : game.p1}`, mentions: [otro, game.turno === game.p1? game.p2 : game.p1] })
    game.msgId = newMsg.key.id
}

handler.help = ['siente', 'anotar', 'sala', 'empezar', 'terminar']
handler.tags = ['fun']
handler.command = ['siente', 'anotar', 'sala', 'empezar', 'terminar']
handler.group = true
export default handler