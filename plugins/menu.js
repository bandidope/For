let handler = async (m, { conn, usedPrefix }) => {
  let taguser = '@' + m.sender.split('@')[0]
  const imgUrl = 'https://files.evogb.win/7Rs2Rz.jpg'

  let plugins = Object.values(global.plugins).filter(p => p.help &&!p.disabled)
  let groups = {}
  for (let p of plugins) {
    let tags = p.tags || ['otros']
    for (let tag of tags) if (!groups[tag]) groups[tag] = []
  }
  let categories = Object.keys(groups).length

  let caption = `*🤖 [ For Three Bot ]* 🤖\n\n`
  caption += `👤 Usuario: ${taguser}\n⚙️ Prefijo: [ ${usedPrefix} ]\n`
  caption += `📦 Plugins: ${plugins.length}\n📂 Categorías: ${categories}\n\n`
  caption += `> Sistema Automatizado v3 🌀`

  await conn.sendMessage(m.chat, {
    image: { url: imgUrl },
    caption,
    footer: 'For Three Bot 🌀',
    mentions: [m.sender],
    buttons: [
      {buttonId: `${usedPrefix}categorias`, buttonText: {displayText: '📜 VER COMANDOS'}, type: 1} // <-- Apunta a otro comando
    ],
    headerType: 4
  }, { quoted: m })
}
handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help|menú)$/i
export default handler
