let juegos = {} // FIX: Objeto por chat, no null global

let handler = async (m, { conn, command }) => {
    let chat = m.chat

    if (command === 'siente') {
        if (juegos) return m.reply('❌ Ya hay juego. Usa.terminar') // FIX: juegos
        let members = (await conn.groupMetadata(chat)).participants.map(p => p.id).filter(id => id!== conn.user.jid && id!== m.sender)
        if (members.length < 2) return m.reply('❌ Faltan 2 personas mínimo')
        let p1 = members[Math.floor(Math.random() * members.length)]
        let p2 = members.filter(v => v!== p1)[0]
        juegos = { p1, p2, turno: p1 } // FIX: juegos
        return conn.sendMessage(chat, { text: `🔥 *JUGUEMOS AL QUE SE SIENTE* 🔥\n\n@${p1.split('@')[0]} vs @${p2.split('@')[0]}\n\n👉 Turno: @${p1.split('@')[0]}\nEtiqueta a @${p2.split('@')[0]}`, mentions: [p1, p2] })
    }

    if (command === 'terminar') {
        if (!juegos) return m.reply('No hay juego') // FIX
        let p1 = juegos.p1
        let p2 = juegos.p2
        delete juegos // FIX: delete en vez de null
        return conn.sendMessage(chat, { text: `🛑 *JUEGO TERMINADO*\n@${p1.split('@')[0]} y @${p2.split('@')[0]} pararon 😅`, mentions: [p1, p2] })
    }

    if (!juegos) return // FIX
    let juego = juegos // FIX: lo meto en una var local para no repetir

    if (m.sender!== juego.turno) return m.reply('❌ No es tu turno oe')

    try {
        let mencionado = m.mentionedJid[0]
        let otro = juego.turno === juego.p1? juego.p2 : juego.p1

        if (!mencionado || mencionado!== otro) return m.reply(`❌ Etiqueta bien a @${otro.split('@')[0]} pe`, null, { mentions: })

        juego.turno = otro
        await m.react('😏')

        return conn.sendMessage(chat, { text: `👉 Ahora te toca @${otro.split('@')[0]}\nEtiqueta a @${juego.turno === juego.p1? juego.p2 : juego.p1}`, mentions: [otro, juego.turno === juego.p1? juego.p2 : juego.p1] })

    } catch (e) {
        return m.reply('❌ Tienes que etiquetar a alguien pe')
    }
}

handler.command = ['siente', 'terminar']
handler.group = true
export default handler