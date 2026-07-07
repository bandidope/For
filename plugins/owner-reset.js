let handler = async (m, { conn }) => {
    await m.react('🔄')
    await m.reply('🤖 *[ For Three Bot ]* 🤖\n\n> *Reiniciando sistema, por favor espere...*')
    process.send('reset')
}

handler.help = ['reiniciar']
handler.tags = ['owner']
handler.command = ['reiniciar']
handler.rowner = true

export default handler
