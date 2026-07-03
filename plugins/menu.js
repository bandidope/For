let handler = async (m, { conn, usedPrefix }) => {
  let taguser = '@' + m.sender.split('@')[0]
  const imgUrl = 'https://files.evogb.win/7Rs2Rz.jpg'

  // [1] AGRUPAR TODO POR CATEGORIAS
  let plugins = Object.values(global.plugins).filter(p =>!p.disabled && p.help)
  let groups = {}
  for (let p of plugins) {
    for (let tag of p.tags || ['main']) {
      if (!(tag in groups)) groups[tag] = []
      groups[tag].push(...[].concat(p.help))
    }
  }
  let categories = Object.keys(groups).sort()

  // [2] ARMAR EL TEXTO CON TODAS LAS CATS
  let menuTxt = `*🤖 [ For Three Bot ]* 🤖\n\n`
  menuTxt += `👤 Usuario: ${taguser}\n⚙️ Prefijo: [ ${usedPrefix} ]\n`
  menuTxt += `📦 Total Plugins: ${plugins.length}\n📂 Categorías: ${categories.length}\n\n`
  menuTxt += `━━━━━━━━━━━━━━\n\n`
  
  for (let tag of categories) {
    menuTxt += `*🗂️ ${tag.toUpperCase()}* [${groups[tag].length}]\n`
    menuTxt += groups[tag].map(v => `> 🌀 ${usedPrefix}${v}`).join('\n')
    menuTxt += `\n\n━━━━━━━━━━━━━━\n\n`
  }
  
  menuTxt += `> Sistema v3 🌀 | Usa los comandos de arriba`

  // [3] MANDAR FOTO + BOTON CREADOR
  await conn.sendMessage(m.chat, {
    image: { url: imgUrl },
    caption: menuTxt,
    footer: 'For Three Bot 🌀',
    mentions: [m.sender],
    buttons: [
      {buttonId: `${usedPrefix}creador`, buttonText: {displayText: '👑 CREADOR'}, type: 1}
    ],
    headerType: 4
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help|menú)$/i
export default handler