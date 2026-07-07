let handler = async (m, { conn }) => {
  const imgUrl = 'https://files.evogb.win/7Rs2Rz.jpg'
  let taguser = '@' + m.sender.split('@')[0]

  let plugins = Object.values(global.plugins).filter(p =>!p.disabled && p.help)
  let totalCmds = plugins.reduce((acc, p) => acc + [].concat(p.help).length, 0)

  let txt = `
*🤖 [ FOR THREE BOT v3.2 ]* 🤖

👤 Usuario: ${taguser}
📦 Total Comandos: ${totalCmds}
⚙️ Prefijo: [. ]

*Elige una categoría* 👇
`.trim()

  let buttons = [
    { buttonId: '.punto menu fun', buttonText: { displayText: '🎮 JUEGOS FUN' }, type: 1 },
    { buttonId: '.punto menu info', buttonText: { displayText: 'ℹ️ INFO' }, type: 1 },
    { buttonId: '.punto menu main', buttonText: { displayText: '⚙️ MAIN' }, type: 1 },
    { buttonId: '.punto menu sorteos', buttonText: { displayText: '🎁 SORTEOS' }, type: 1 },
    { buttonId: '.punto menu ventas bot', buttonText: { displayText: '🛒 VENTAS' }, type: 1 }
  ]

  await conn.sendMessage(m.chat, {
    image: { url: imgUrl },
    caption: txt,
    footer: 'Toca el botón de la categoría',
    buttons: buttons,
    headerType: 4,
    mentions: [m.sender]
  }, { quoted: m })
}

handler.command = /^(punto\s?menu|pm)$/i //.punto menu o.pm
handler.tags = ['main']
handler.help = ['menu']
export default handler