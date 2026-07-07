let handler = async (m, { conn }) => {
  const imgUrl = 'https://files.evogb.win/7Rs2Rz.jpg'
  let taguser = '@' + m.sender.split('@')[0]

  let txt = `
*🤖 [ FOR THREE BOT v3.2 ]* 🤖

👤 Usuario: ${taguser}
⚙️ Prefijo: [. ]

Toca el botón para ver todas las categorías 👇
`.trim()

  let buttons = [
    { buttonId: '.menu categorias', buttonText: { displayText: '📋 VER COMANDOS' }, type: 1 }
  ]

  await conn.sendMessage(m.chat, {
    image: { url: imgUrl },
    caption: txt,
    footer: 'FOR THREE BOT',
    buttons: buttons,
    headerType: 4,
    mentions: [m.sender]
  }, { quoted: m })
}

handler.command = /^(menu|menú|help)$/i //.menu
handler.tags = ['main']
handler.help = ['menu']
export default handler