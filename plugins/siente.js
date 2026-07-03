// Plugin: Que se Siente
// Autor: Tu
import { areJidsSameUser } from '@whiskeysockets/baileys'

const juegos = new Map()

const handler = async (m, { conn, command, args, usedPrefix }) => {
    const chat = m.chat
    let juego = juegos.get(chat)

    switch (command) {
        case 'siente': {
            if (juego) throw '❌ Ya hay una partida activa. Usa *' + usedPrefix + 'terminar*'

            const metadata = await conn.groupMetadata(chat)
            const miembros = metadata.participants
                .map(p => p.id)
                .filter(id => !areJidsSameUser(id, conn.user.id) && !areJidsSameUser(id, m.sender))

            if (miembros.length < 2) throw '❌ Necesitas mínimo 2 personas más en el grupo oe'

            // Mezclar y sacar 2 random
            const [p1, p2] = miembros.sort(() => Math.random() - 0.5).slice(0, 2)
            
            juegos.set(chat, { p1, p2, turno: p1 })

            const txt = `🔥 *¿QUÉ SE SIENTE?* 🔥\n
@${p1.split('@')[0]} vs @${p2.split('@')[0]}

*Reglas:* 
Cuando sea tu turno, etiqueta a la otra persona para pasar el turno.
El que no responda, pierde 😏

👉 *TURNO DE:* @${p1.split('@')[0]}`
            return conn.sendMessage(chat, { text: txt, mentions: [p1, p2] })
        }

        case 'terminar': {
            if (!juego) throw 'No hay partida activa'
            const { p1, p2 } = juego
            juegos.delete(chat)
            return conn.sendMessage(chat, { 
                text: `🛑 *PARTIDA TERMINADA*\n@${p1.split('@')[0]} y @${p2.split('@')[0]} se rindieron 😅`, 
                mentions: [p1, p2] 
            })
        }
    }

    // Si no es comando, es porque están jugando
    if (!juego) return
    if (!areJidsSameUser(m.sender, juego.turno)) return

    const otro = areJidsSameUser(juego.turno, juego.p1) ? juego.p2 : juego.p1
    const tag = m.mentionedJid?.[0]

    if (!tag || !areJidsSameUser(tag, otro)) {
        throw `❌ Es tu turno. Etiqueta a @${otro.split('@')[0]}` 
    }

    juego.turno = otro
    await m.react('😏')

    return conn.sendMessage(chat, { 
        text: `👉 *AHORA LE TOCA A:* @${otro.split('@')[0]}`, 
        mentions: [otro] 
    })
}

handler.help = ['siente', 'terminar']
handler.tags = ['fun'] // Cambia a 'fun' si tu menú usa esa tag
handler.command = /^(siente|terminar)$/i
handler.group = true
handler.admin = false
handler.botAdmin = false

export default handler