let handler = async (m, { conn }) => {
    let who = m.mentionedJid[0] || m.sender
    let size = Math.floor(Math.random() * 100)
    let tipo = size > 80? 'Culote 🍑🍑' : size > 50? 'Buen culo 🍑' : 'Tabla de planchar'
    let texto = `🍑 *MEDIDOR DE CULO* 🍑\n\n@${who.split('@')[0]}\n${tipo}\n${size}%`
    conn.reply(m.chat, texto, m, { mentions: [who] })
}
handler.help = ['culo @tag']
handler.tags = ['+18']
handler.command = ['culo']
export default handler