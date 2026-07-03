console.log('================================')
console.log('PLUGIN SIENTE CARGADO CORRECTAMENTE')
console.log('================================')

let handler = async (m, { conn }) => {
    let chat = m.chat
    global.siente = global.siente || {} // 1. OBJETO POR CHAT
    
    if (!global.siente) { // 2. PREGUNTA POR CHAT
        let p = (await conn.groupMetadata(chat)).participants.map(v => v.id).filter(v => v!=conn.user.jid && v!=m.sender)
        if (p.length < 2) return m.reply('Faltan 2')
        p.sort(() => Math.random() - 0.5)
        global.siente = { p1: p[0], p2: p[1], t: p[0] } // 3. GUARDA POR CHAT
        let g = global.siente
        return conn.reply(chat, `🔥 @${g.p1.split`@`[0]} vs @${g.p2.split`@`[0]}\nTURNO: @${g.t.split`@`[0]}`, m, { mentions: [g.p1, g.p2] })
    }
    
    let g = global.siente // 4. LEE POR CHAT
    if (m.body == '.terminar') {
        delete global.siente // 5. BORRA POR CHAT
        return m.reply('Terminado')
    }
    if (m.sender!= g.t) return
    let o = g.t == g.p1? g.p2 : g.p1
    if (m.mentionedJid[0] == o) {
        g.t = o // 6. CAMBIA TURNO POR CHAT
        return conn.reply(chat, `🔥 @${g.p1.split`@`[0]} vs @${g.p2.split`@`[0]}\n👉 TURNO: @${g.t.split`@`[0]}`, m, { mentions: [g.p1, g.p2, g.t] }) // Le metí un 👉 pa que se note
    }
}
handler.help = ['siente']
handler.tags = ['fun'] 
handler.command = /^(siente|terminar)$/i
handler.group = true
export default handler