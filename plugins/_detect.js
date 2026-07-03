let handler = m => m
handler.all = async function (m) {
    if (!m.messageStubType ||!m.isGroup) return 
    
    let who = m.messageStubParameters[0] + '@s.whatsapp.net'
    let actor = m.key.participant || m.participant 
    if (!actor) return // Si no hay actor, se sale. Pa evitar crash

    let chat = m.chat
    let user = who.split('@')[0]
    let admin = actor.split('@')[0]

    try {
        switch (m.messageStubType) {
            case 25: // PROMOTE
                await conn.reply(chat, `👑 @${admin} le dio *ADMIN* a @${user}`, m, { mentions: [actor, who] })
                break
            case 26: // DEMOTE 
                await conn.reply(chat, `💀 @${admin} le quitó *ADMIN* a @${user}`, m, { mentions: [actor, who] })
                break
            case 21: // SUBJECT
                let tema = m.messageStubParameters[0]
                await conn.reply(chat, `📢 @${admin} cambió el nombre a: *${tema}*`, m, { mentions: [actor] })
                break
            case 22: // ICON
                await conn.reply(chat, `🖼️ @${admin} cambió la foto del grupo`, m, { mentions: [actor] })
                break
        }
    } catch (e) {
        console.log(e)
    }
}
export default handler