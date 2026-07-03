let handler = async (m, { conn }) => {
    let chat = m.chat
    let participants = (await conn.groupMetadata(chat)).participants.filter(v => v.id!= conn.user.jid)
    if (participants.length < 2) return m.reply('❌ Se necesitan mínimo 2 personas')
    
    // 1. 2 RANDOM
    let p = participants.sort(() => Math.random() - 0.5).slice(0, 2)
    let u1 = p[0].id
    let u2 = p[1].id
    let porsen = Math.floor(Math.random() * 101)
    
    // 2. TUS 3 LINKS
    let imgLow = 'https://files.evogb.win/y6zhwo.jpg' // 1% - 40%
    let imgMid = 'https://files.evogb.win/4ZeVJX.jpg' // 41% - 80% 
    let imgHigh = 'https://files.evogb.win/b71Ax5.jpg' // 81% - 100%
    let imgDefault = 'https://files.evogb.win/y6zhwo.jpg' // Si todo falla usa el 1ro
    
    let frase = porsen <= 40? 'F, solo amigos 😂' : porsen <= 80? 'Sí hay chance 😏' : 'Almas gemelas 🔥'
    let img = porsen <= 40? imgLow : porsen <= 80? imgMid : imgHigh

    let txt = `💘 *SHIP CALCULATOR* 💘\n\n@${u1.split`@`[0]} + @${u2.split`@`[0]}\n\n*Compatibilidad: ${porsen}%*\n${frase}`
    
    try {
        await conn.sendMessage(chat, { image: { url: img }, caption: txt, mentions: [u1, u2] })
    } catch {
        await conn.sendMessage(chat, { image: { url: imgDefault }, caption: txt + '\n\n⚠️ La imagen falló, pero aquí está el resultado.', mentions: [u1, u2] })
    }
}
handler.help = ['ship']
handler.tags = ['fun']
handler.command = /^(ship)$/i
handler.group = true
export default handler