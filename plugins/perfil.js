let handler = async (m, { conn }) => {
    let who = m.sender
    let name = conn.getName(who)
    let tag = '@' + who.split('@')[0]
    let nivel = Math.floor(Math.random() * 100) + 1
    let xp = Math.floor(Math.random() * 5000)
    let monedas = Math.floor(Math.random() * 10000)

    // Detectar país por número
    let num = who.split('@')[0]
    let pais = 'Desconocido 🌎'
    if (num.startsWith('51')) pais = 'Perú 🇵🇪'
    else if (num.startsWith('52')) pais = 'México 🇲🇽'
    else if (num.startsWith('57')) pais = 'Colombia 🇨🇴'
    else if (num.startsWith('54')) pais = 'Argentina 🇦🇷'
    else if (num.startsWith('56')) pais = 'Chile 🇨🇱'
    else if (num.startsWith('58')) pais = 'Venezuela 🇻🇪'
    else if (num.startsWith('1')) pais = 'EEUU/Canadá 🇺🇸'
    else if (num.startsWith('34')) pais = 'España 🇪🇸'
    else if (num.startsWith('55')) pais = 'Brasil 🇧🇷'

    // Rey/Reyna
    let esMujer = /a$|ina$|y$/i.test(name.split(' ')[0])
    let rango = ''
    if (nivel < 10) rango = 'Mongol@ 💀'
    else if (nivel < 30) rango = 'Tarad@ 🤡'
    else if (nivel < 60) rango = 'Bot 🤖'
    else if (nivel < 85) rango = 'Pro 🔥'
    else if (nivel < 95) rango = 'El más Bot del grupo 👑'
    else rango = esMujer? 'Reyna del grupo 👑' : 'Rey del grupo 👑'

    let txt = `╭━━〔 *PERFIL REAL* 〕━━╮
┃
┃ *Usuario:* ${name}
┃ *Tag:* ${tag}
┃ *País:* ${pais}
┃ *Título:* ${rango}
┃ *Nivel:* ${nivel} ⭐
┃ *XP:* ${xp}/5000
┃ *Coins:* ${monedas} 💎
┃
╰━━━━━━━━━━╯

${rango.includes('Rey')? '👑 Todos inclínense ante su majestad' : 'Sigue subiendo para ser Rey/Reyna'}`

    // PRIORIDAD: 1. Foto usuario 2. Foto grupo 3. Default
    let pp
    try {
        pp = await conn.profilePictureUrl(who, 'image') // Intenta foto del usuario
    } catch {
        try {
            if (m.isGroup) {
                pp = await conn.profilePictureUrl(m.chat, 'image') // Si falla usa foto del grupo
            } else {
                pp = 'https://i.imgur.com/2dzxI5A.png' // Default
            }
        } catch {
            pp = 'https://i.imgur.com/2dzxI5A.png' // Default
        }
    }

    await conn.sendFile(m.chat, pp, 'perfil.jpg', txt, m)
}

handler.help = ['perfil']
handler.tags = ['main']
handler.command = ['perfil', 'profile', 'p']
export default handler