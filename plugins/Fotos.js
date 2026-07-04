let handler = async (m, { conn }) => {
    // PEGA TUS URLS DE IMAGENES AQUÍ
    let listaFotos = [
        'https://files.evogb.win/u64RXK.jpg',
        'https://files.evogb.win/YQ8R6d.jpg',
        'https://files.evogb.win/aG0Lq4.jpg',
        'https://files.evogb.win/xs8FB1.jpg',
        'https://files.evogb.win/G4H0Xd.jpg', // también acepta.png.jpeg
        'https://files.evogb.win/bI4VEX.jpg',
        'https://files.evogb.win/0Tkofc.jpg',
'https://files.evogb.win/TE9Vug.jpg',
'https://files.evogb.win/pOIyQt.jpg',
'https://files.evogb.win/TchFeA.jpg',
'https://files.evogb.win/1rX7Bp.jpg',
"https://files.evogb.win/fpVAyC.jpg"
    ]

    // Inicializar DB
    global.db.data = global.db.data || {}
    global.db.data.users = global.db.data.users || {}
    global.db.data.users[m.sender] = global.db.data.users[m.sender] || {}

    let i = global.db.data.users[m.sender].fotoIndex || 0

    if (i >= listaFotos.length) i = 0 // reinicia cuando acaba

    await conn.sendMessage(m.chat, {
        image: { url: listaFotos[i] },
        caption: `*Foto ${i + 1} de ${listaFotos.length}*\n\nEscribe *.fotos* para ver la siguiente ▶️`
    }, { quoted: m })

    global.db.data.users[m.sender].fotoIndex = i + 1
}

handler.help = ['Fotos ( Chicas )']
handler.tags = ['+18']
handler.command = /^(Fotos)$/i

export default handler