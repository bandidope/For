let handler = async (m, { conn }) => {
    let user = m.sender
    let name = conn.getName(user)
    let tag = '@' + user.split('@')[0]
    let nivel = Math.floor(Math.random() * 100) + 1
    let xp = Math.floor(Math.random() * 5000)
    let monedas = Math.floor(Math.random() * 10000)

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
┃ *Título:* ${rango}
┃ *Nivel:* ${nivel} ⭐
┃ *XP:* ${xp}/5000
┃ *Coins:* ${monedas} 💎
┃ *País:* Perú 🇵🇪
┃
╰━━━━━━━━━━╯

${rango.includes('Rey')? '👑 Todos inclínense ante su majestad' : 'Sigue subiendo para ser Rey/Reyna'}`

    // Foto
    let pp
    try {
        pp = await conn.profilePictureUrl(m.isGroup? m.chat : user, 'image')
    } catch {
        pp = 'https://i.imgur.com/2dzxI5A.png'
    }

    await conn.sendMessage(m.chat, { 
        image: { url: pp }, 
        caption: txt, 
        mentions: // FIX: aquí va el arreglo
    })
}

handler.help = ['perfil']
handler.tags = ['main']
handler.command = /^perfil|profile|p$/i
export default handler