import { areJidsSameUser } from '@whiskeysockets/baileys'
const juegos = new Map()

let handler = async (m, { conn, command, usedPrefix }) => {
    const chat = m.chat
    let juego = juegos.get(chat)

    if (command === 'siente') {
        if (juego) return m.reply(`❌ Ya hay partida. Usa *${usedPrefix}terminar*`)

        const miembros = (await conn.groupMetadata(chat)).participants
           .map(p => p.id)
           .filter(id =>!areJidsSameUser(id, conn.user.id) &&!areJidsSameUser(id, m.sender))

        if (miembros.length < 2) return m.reply('❌ Necesitas mínimo 2 personas más oe')

        const [p1, p2] = miembros.sort(() => Math.random() - 0.5).slice(0, 2)
        juegos.set(chat, { p1, p2, turno: p1 })

        return conn.sendMessage(chat, {
            text: `🔥 *¿QUÉ SE SIENTE?* 🔥\n\n@${p1.split('@')[0]} vs @${p2.split('@')[0]}\n\n*Reglas:* Etiqueta a la otra persona en tu turno.\n\n👉 *TURNO DE:* @${p1.split('@')[0]}`,
            mentions: [p1, p2]
        })
    }

    if (command === 'terminar') {
        if (!juego) return m.reply('No hay partida activa')
        const { p1, p2 } = juego
        juegos.delete(chat)
        return conn.sendMessage(chat, { 
            text: `🛑 *PARTIDA TERMINADA*\n@${p1.split('@')[0]} y @${p2.split('@')[0]} se rindieron 😅`, 
            mentions: [p1, p2] 
        })
    }

    // Lógica de turnos
    if (!juego) return
    if (!areJidsSameUser(m.sender, juego.turno)) return m.reply(`❌ No es tu turno oe`)

    const otro = areJidsSameUser(juego.turno, juego.p1)? juego.p2 : juego.p1
    const tag = m.mentionedJid?.[0]

    if (!tag ||!areJidsSameUser(tag, otro)) {
        return m.reply(`❌ Etiqueta a @${otro.split('@')[0]}`, null, { mentions: })
    }

    juego.turno = otro
    await m.react('😏')

    return conn.sendMessage(chat, { 
        text: `👉 *AHORA LE TOCA A:* @${otro.split('@')[0]}\nEtiqueta a @${juego.turno === juego.p1? juego.p2 : juego.p1}`, 
        mentions: [otro, juego.turno === juego.p1? juego.p2 : juego.p1]
    })
}

handler.help = ['siente', 'terminar']
handler.tags = ['fun']
handler.command = /^(siente|terminar)$/i
handler.group = true

export default handler