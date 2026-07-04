let handler = async (m, { conn, usedPrefix }) => {
  let taguser = '@' + m.sender.split('@')[0]
  const imgUrl = 'https://files.evogb.win/7Rs2Rz.jpg'

  let plugins = Object.values(global.plugins).filter(p =>!p.disabled && p.help)
  let groups = {}
  for (let p of plugins) {
    for (let tag of p.tags || ['main']) {
      if (!(tag in groups)) groups[tag] = []
      groups[tag].push(...[].concat(p.help))
    }
  }
  
  // Orden de categorías: VENTAS > SORTEOS > INFO > MAIN > El resto A-Z
  let orden = ['ventas bot', 'sorteos', 'info', 'main']
  let categories = Object.keys(groups)
  categories.sort((a, b) => {
    let ia = orden.indexOf(a.toLowerCase())
    let ib = orden.indexOf(b.toLowerCase())
    if (ia!== -1 && ib!== -1) return ia - ib // Los 2 están en el orden
    if (ia!== -1) return -1 // Solo a está en el orden = va primero
    if (ib!== -1) return 1 // Solo b está en el orden = va primero
    return a.localeCompare(b) // El resto A-Z
  })

  let menuTxt = `*🤖 [ FOR THREE BOT ]* 🤖\n\n`
  menuTxt += `👤 Usuario: ${taguser}\n⚙️ Prefijo: [ ${usedPrefix} ]\n`
  menuTxt += `📦 Total: ${plugins.length} | 📂 Cats: ${categories.length}\n\n`
  menuTxt += `🌀 Url Comprar : https://bandidope.github.io/For-Three-Bot`
  menuTxt += `━━━━━━━━━━━\n\n`
  
  for (let tag of categories) {
    menuTxt += `*🗂️ ${tag.toUpperCase()}* [${groups[tag].length}]\n`
    menuTxt += groups[tag].map(v => `> 🌀 ${usedPrefix}${v}`).join('\n')
    menuTxt += `\n\n━━━━━━━━━━━━━━━━━━━\n\n`
  }
  
  menuTxt += `👑 *Creador:* ${usedPrefix}creador\n`
  menuTxt += `> Sistema v3.1 🌀`

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