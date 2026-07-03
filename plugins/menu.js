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
  
  // [2] ORDENAR: VENTAS BOT PRIMERO, LUEGO EL RESTO A-Z
  let categories = Object.keys(groups)
  categories.sort((a, b) => {
    if (a.toLowerCase() === 'ventas bot') return -1 // <-- Manda ventas bot arriba
    if (b.toLowerCase() === 'ventas bot') return 1
    return a.localeCompare(b) // <-- El resto normal A-Z
  })

  // [3] ARMAR EL TEXTO
  let menuTxt = `*🤖 [ For Three Bot ]* 🤖\n\n`
  menuTxt += `👤 Usuario: ${taguser}\n⚙️ Prefijo: [ ${usedPrefix} ]\n`
  menuTxt += `📦 Total Plugins: ${plugins.length}\n📂 Categorías: ${categories.length}\n\n`
  menuTxt += `━━━━━━━━━━━━━━\n\n`
  
  for (let tag of categories) {
    menuTxt += `*🗂️ ${tag.toUpperCase()}* [${groups[tag].length}]\n`
    menuTxt += groups[tag].map(v => `> 🌀 ${usedPrefix}${v}`).join('\n')
    menuTxt += `\n\n━━━━━━━━━━━━━━\n\n`
  }
  
  menuTxt += `👑 *Creador:* ${usedPrefix}creador\n`
  menuTxt += `> Sistema v3 🌀`

  // [4] MANDAR FOTO + TEXTO
  await conn.sendMessage(m.chat, {
    image: { url: imgUrl },
    caption: menuTxt,
    mentions: [m.sender]
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help|menú)$/i
export default handler