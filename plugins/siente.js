console.log('================================')
console.log('PLUGIN SIENTE CARGADO CORRECTAMENTE')
console.log('================================')

let handler = async (m, { conn }) => {
    let chat = m.chat
    global.siente = global.siente || {}
    
    if (!global.siente[chat]) {
        let p = (await conn.groupMetadata(chat)).participants.map(v => v.id).filter(v => v!=conn.user.jid && v!=m.sender)
        if (p.length < 2) return m.reply('Faltan 2')
        p.sort(() => Math.random() - 0.5)
        global.siente[chat] = { p1: p[0], p2: p[1], t: p[0] }
        let g = global.siente[chat]
        return conn.reply(chat, `🔥 @${g.p1.split`@`[0]} vs @${g.p2.split`@`[0]}\nTURNO: @${g.t.split`@`[0]}`, m, { mentions: [g.p1, g.p2] })
    }
    
    let g = global.siente[chat]
    if (m.body == '.terminar') {
        delete global.siente[chat]
        return m.reply('Terminado')
    }
    if (m.sender!= g.t) return
    let o = g.t == g.p1? g.p2 : g.p1
    if (m.mentionedJid[0] == o) {
        g.t = o
        return conn.reply(chat, `🔥 @${g.p1.split`@`[0]} vs @${g.p2.split`@`[0]}\nTURNO: @${g.t.split`@`[0]}`, m, { mentions: [g.p1, g.p2, g.t] })
    }
}
handler.help = ['siente']
handler.tags = ['fun'] 
handler.command = /^(siente|terminar)$/i
handler.group = true
export default handler