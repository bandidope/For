let handler = async (m, { conn }) => {
    let quien = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0] : m.sender

    let frases = [
        `De acá @${quien.split('@')[0]} tiene novio y lo engaña con 3 más 🤡`,
        `De acá @${quien.split('@')[0]} dice que es fiel pero responde a todos en pv 👀`,
        `De acá @${quien.split('@')[0]} juró amor eterno y al día siguiente subió historia con otro 🥴`,
        `De acá @${quien.split('@')[0]} es el/la rey/reina del "solo somos amigos" 📌`,
        `De acá @${quien.split('@')[0]} tiene novio pero en tinder sale como soltero/a 💀`,
        `De acá @${quien.split('@')[0]} dice "no me gustas" pero stalkea 24/7 🕵️`,
        `De acá @${quien.split('@')[0]} manda "buenos días amor" a 5 personas distintas ☀️`,
        `De acá @${quien.split('@')[0]} bloquea al ex pero crea cuentas falsas para verlo 👻`,
        `De acá @${quien.split('@')[0]} dice que está ocupado pero visto a las 3am en línea 🌙`,
        `De acá @${quien.split('@')[0]} juró que no usa cuernos... los presta nomás 🐮`,
        `De acá @${quien.split('@')[0]} pone "en una relación" pero coquetea en comentarios 😏`,
        `De acá @${quien.split('@')[0]} dice "te amo" y 2 min después "jaja mentira" 💔`,
        `De acá @${quien.split('@')[0]} tiene novio y su mejor amigo es su plan B 🤝`,
        `De acá @${quien.split('@')[0]} dice que no le escribe... pero tiene 10 chats archivados 📂`,
        `De acá @${quien.split('@')[0]} prometió no mentir más... y falló en el minuto 1 🤥`,
        `De acá @${quien.split('@')[0]} dice "eres el único" mientras guarda contactos como "Taxi" 🚕`,
        `De acá @${quien.split('@')[0]} sube frases de lealtad pero vive de infidelidad 📖`,
        `De acá @${quien.split('@')[0]} dice "confía en mí" = "no revises mi cel" 📱`,
        `De acá @${quien.split('@')[0]} termina y a las 2 horas ya tiene reemplazo 🔄`,
        `De acá @${quien.split('@')[0]} dice "fue un error" pero lo repite cada finde 🍻`
    ]

    let random = frases[Math.floor(Math.random() * frases.length)]

    // TU IMAGEN
    let img = 'https://files.evogb.win/rSpmEd.jpg'

    let caption = `🔥 *QUEMADITA DEL DÍA* 🔥\n\n${random}\n\n> *Solecito Shopp Bot*`

    await conn.sendMessage(m.chat, {
        image: { url: img },
        caption: caption,
        mentions: [quien]
    }, { quoted: m })

    await m.react('💥')
}

handler.help = ['quemadas @tag']
handler.tags = ['fun']
handler.command = /^(quemadas)$/i
handler.group = true

export default handler