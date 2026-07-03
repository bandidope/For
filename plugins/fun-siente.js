let salas = {} // 1 sala por grupo

let handler = async (m, { conn, command }) => {
    let chat = m.chat

    // 1..TERMINAR - Cancela lobby o juego
    if (command === 'terminar') {
        if (salas) {
            let p1 = salas.p1 || 'Nadie'
            let p2 = salas.p2 || 'Nadie'
            delete salas
            return m.reply(`🛑 *Sala eliminada*. ${p1 === 'Nadie'? 'Nadie alcanzó a jugar 😅' : `@${p1.split('@')[0]} y @${p2.split('@')[0]} ya pararon`}`, null, { mentions: salas? [p1, p2].filter(Boolean) : [] })
        }
        return m.reply('No hay sala activa oe')
    }

    // 2..SIENTE - CREAR LOBBY
    if (command === 'siente') {
        if (salas) return m.reply('❌ Ya hay una sala activa. Usa.sala pa ver o.terminar pa borrar')

        salas = {
            inscritos: [], // Aquí se guardan los que ponen.anotar
            estado: 'lobby' // lobby | jugando
        }
        return m.reply(`🔥 *LOBBY: JUGUEMOS AL QUE SE SIENTE* 🔥\n\nAnótense con:.anotar\nMínimo 2 personas.\nCuando estén listos el admin pone:.empezar\n.sala = Ver inscritos`)
    }

    // 3..ANOTAR - Apuntarse
    if (command === 'anotar') {
        if (!salas || salas.estado!== 'lobby') return m.reply('❌ No hay lobby activo. Crea uno con.siente')
        if (salas.inscritos.includes(m.sender)) return m.reply('✅ Ya estás anotado pe')

        salas.inscritos.push(m.sender)
        return m.reply(`✅ @${m.sender.split('@')[0]} anotado. Total: *${salas.inscritos.length}*`, null, { mentions: [m.sender] })
    }

    // 4..SALA - Ver lista
    if (command === 'sala') {
        if (!salas) return m.reply('❌ No hay sala activa')
        let lista = salas.inscritos.length? salas.inscritos.map((v,i) => `${i+1}. @${v.split('@')[0]}`).join('\n') : '> Vacío'
        return m.reply(`*📋 SALA DE JUEGO*\nEstado: *${salas.estado}*\n\n${lista}`, null, { mentions: salas.inscritos })
    }

    // 5..EMPEZAR - Iniciar con los anotados
    if (command === 'empezar') {
        if (!salas || salas.estado!== 'lobby') return m.reply('❌ No hay lobby activo')
        if (salas.inscritos.length < 2) return m.reply('❌ Se necesitan mínimo 2 personas anotadas oe')

        // Elige 2 random de los inscritos
        let p1 = salas.inscritos[Math.floor(Math.random() * salas.inscritos.length)]
        let p2 = salas.inscritos.filter(v => v!== p1)[Math.floor(Math.random() * (salas.inscritos.length - 1))]

        salas = { // Reiniciamos la sala solo con los 2 que juegan
            p1, p2,
            turno: p1,
            estado: 'jugando',
            inscritos: salas.inscritos // Guardamos la lista por si acaso
        }

        return conn.sendMessage(chat, { text: `🎮 *EMPEZÓ EL JUEGO* 🎮\n\n@${p1.split('@')[0]} vs @${p2.split('@')[0]}\n\n👉 Empieza @${p1.split('@')[0]}\nResponde a este mensaje etiquetando a @${p2.split('@')[0]}\n\nTip: Pongan.terminar pa' acabar`, mentions: [p1, p2] })
    }

    // 6. LÓGICA DE TURNO - SOLO SI ESTADO = JUGANDO
    if (!salas || salas.estado!== 'jugando') return
    let game = salas

    if (m.sender!== game.turno ||!m.quoted ||!m.quoted.fromMe) return // Solo el del turno y respondiendo al bot

    let mencionado = m.mentionedJid[0]
    let otro = game.turno === game.p1? game.p2 : game.p1

    if (mencionado!== otro) return conn.sendMessage(chat, { text: `❌ Etiqueta a @${otro.split('@')[0]} pe`, mentions: [] })

    // 7. CAMBIAR TURNO
    game.turno = otro
    await m.react('😏')

    return conn.sendMessage(chat, { text: `👉 Te toca @${otro.split('@')[0]}\nResponde a este mensaje etiquetando a @${game.turno === game.p1? game.p2 : game.p1}`, mentions: [otro, game.turno === game.p1? game.p2 : game.p1] })
}

handler.help = ['siente', 'anotar', 'sala', 'empezar', 'terminar']
handler.tags = ['fun']
handler.command = ['siente', 'anotar', 'sala', 'empezar', 'terminar']
handler.group = true
export default handler