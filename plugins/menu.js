let handler = async (m, { conn, usedPrefix }) => {
  const imgUrl = 'https://files.evogb.win/7Rs2Rz.jpg'
  let taguser = '@' + m.sender.split('@')[0]
  const linkVentas = 'https://forthreepro.github.io/For-Three-Bot'

  let plugins = Object.values(global.plugins).filter(p =>!p.disabled && p.help)
  let categories = {}
  let totalCmds = 0

  for (let plugin of plugins) {
    let tags = plugin.tags || ['sin categoria']
    let helps = [].concat(plugin.help).filter(Boolean)
    totalCmds += helps.length
    tags.forEach(tag => {
      if (!categories[tag]) categories[tag] = []
      categories[tag].push(...helps)
    })
  }

  // NOMBRES PERSONALIZADOS DE CATEGORÍAS
  const nombreCategorias = {
    'fun': '🎮 ZONA GAMER',
    'info': 'ℹ️ CENTRO DE INFORMACIÓN',
    'main': '⚙️ SISTEMA PRINCIPAL',
    'sorteos': '🎁 SORTEOS PREMIUM',
    'ventas bot': '🛒 TIENDA OFICIAL',
    'group': '👥 CONTROL DE GRUPOS',
    'downloader': '📥 DOWNLOADER PRO',
    'rg': '👤 REGISTRO VIP',
    'anime': '🎌 MUNDO ANIME',
    'admin': '👑 PANEL ADMINISTRADOR',
    'search': '🔍 BUSCADOR GLOBAL',
    'sticker': '🏷️ FABRICA DE STICKERS',
    'tools': '🛠️ HERRAMIENTAS',
    'económia': '💰 BANCO CENTRAL',
    'nsfw': '🔞 ZONA 18+',
    'sin categoria': '📦 OTROS COMANDOS'
  }

  let uptime = process.uptime()
  let h = Math.floor(uptime / 3600)
  let m_ = Math.floor(uptime % 3600 / 60)

  let txt = `
✧･ﾟ: *✧･ﾟ:* FOR THREE BOT *:･ﾟ✧*:･ﾟ✧
           𝘃3.2 𝗖𝗥𝗬𝗦𝗧𝗔𝗟 𝗘𝗗𝗜𝗧𝗜𝗢𝗡

╭─── ʚ 𝗜𝗡𝗙𝗢 𝗗𝗘𝗟 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 ɞ ───╮
│ 👤 ${taguser}
│ ⚡ Prefijo: 『 ${usedPrefix} 』
│ ⏱️ Activo: ${h}h ${m_}m
│ 📦 Comandos: ${totalCmds}
│ 📂 Categorías: ${Object.keys(categories).length}
╰───────────────────────────────╯

`.trim() + '\n\n'

  let sortedCats = Object.keys(categories).sort()

  for (let cat of sortedCats) {
    let cmds = [...new Set(categories[cat])].sort()
    let titulo = nombreCategorias[cat] || `✦ ${cat.toUpperCase()}`

    txt += `╭─❒ ${titulo} [${cmds.length}]\n`
    cmds.forEach(cmd => {
      txt += `│ ✦ ${usedPrefix}${cmd}\n`
    })
    txt += `╰─────────────────────\n\n`
  }

  txt += `✧━━━━━━━━━━━✧
╭─❒ 🛒 ¿QUIERES TU BOT?
│ Adquiere ForThreeBot Pro
│ ${linkVentas}
╰─────────────────

   © 2026 FOR THREE BOT
   Crystal Edition
✧━━━━━━━━━━━━━━━━━━━✧`

  await conn.sendMessage(m.chat, {
    image: { url: imgUrl },
    caption: txt,
    mentions: [m.sender]
  }, { quoted: m })
}

handler.command = /^(menu|menú|help)$/i
handler.tags = ['main']
handler.help = ['menu']
export default handler