let handler = async (m, { conn }) => {
    // AQUI TUS URLS - Reemplaza con tus videos SFW
    let listaVideos = [
        'https://files.evogb.win/enz3dO.mp4',
        'https://files.evogb.win/hbkzO5.mp4',
        'https://files.evogb.win/EGI45I.mp4',
        'https://files.evogb.win/sDft7k.mp4',
        'https://files.evogb.win/knTQU7.mp4',
        'https://files.evogb.win/vnERiq.mp4',
        'https://files.evogb.win/M3wCig.mp4'
    ]

    if (!global.db) global.db = { data: { users: {} } }
    global.db.data.users[m.sender] = global.db.data.users[m.sender] || {}
    let i = global.db.data.users[m.sender].videoIndex || 0

    if (i >= listaVideos.length) i = 0

    await conn.sendMessage(m.chat, {
        video: { url: listaVideos[i] },
        caption: `*Video ${i + 1} de ${listaVideos.length}*`,
        footer: 'Toca "Siguiente" ▶️',
        buttons: [
            { buttonId: '.videos', buttonText: { displayText: 'Siguiente ▶️' }, type: 1 }
        ]
    }, { quoted: m })

    global.db.data.users[m.sender].videoIndex = i + 1
}

handler.help = ['videos']
handler.tags = ['+18']
handler.command = /^(videos)$/i
export default handler