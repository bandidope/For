let menuCache = { txt: '', time: 0 } // Cache para que no laggee

let handler = async (m, { conn, usedPrefix }) => {
  let taguser = '@' + m.sender.split('@')[0]
  const imgUrl = 'https://files.evogb.win/7Rs2Rz.jpg'
  const now = Date.now()

  // Si el cache tiene menos de 2 min, lo reutilizamos. Antes era 10min
  if (menuCache.txt && (now - menuCache.time) < 120000) {
    return conn.sendMessage(m.chat, {
      image: { url: imgUrl },
      caption: menuCache.txt,
      mentions: [m.sender]
    }, { quoted: m })
  }

  try {
    let plugins = Object.values(global.plugins).filter(p =>!p.disabled && p.help)
    let groups = {}
    let totalCmds = 0

    for (let p of plugins) {
      let tags = p.tags || ['main']
      let helps = [].concat(p.help).filter(Boolean) // Evita null/undefined
      totalCmds += helps.length

      for (let tag of tags) {
        if (!groups[tag]) groups[tag] = new Set() // Set evita duplicados
        helps.forEach(cmd => groups[tag].add(cmd))
      }
    }

    // Orden de categorías: VENTAS > SORTEOS > INFO > MAIN > FUN > El resto A-Z
    let orden = ['ventas bot', 'sorteos', 'info', 'main', 'fun']
    let categories = Object.keys(groups)
    categories.sort((a, b) => {
      let ia = orden.indexOf(a.toLowerCase())
      let ib = orden.indexOf(b.toLowerCase())
      if (ia!== -1 && ib!== -1) return ia - ib
      if (ia!== -1) return -1
      if (ib!== -1) return 1
      return a.localeCompare(b)
    })

    let uptime = process.uptime()
    let h = Math.floor(uptime / 3600)
    let m_ = Math.floor(uptime % 3600 / 60)

    let menuTxt = `*🤖 [ FOR THREE BOT v3.2 ]* 🤖\n\n`
    menuTxt += `👤 Usuario: ${taguser}\n`
    menuTxt += `⚙️ Prefijo: [ ${usedPrefix} ]\n`
    menuTxt += `⏱️ Activo: ${h}h ${m_}m\n`
    menuTxt += `📦 Comandos: ${totalCmds} | 📂 Categorías: ${categories.length}\n`
    menuTxt += `🛒 Comprar Bot: https://bandidope.github.io/For-Three-Bot\n`
    menuTxt += `━━━━━━━━━━━\n\n`

    for (let tag of categories) {
      let cmds = [...groups[tag]].sort() // Ordena A-Z dentro de cada categoría
      let tagName = tag === 'fun'? '🎮 JUEGOS Y DIVERSIÓN' : tag.toUpperCase() // Nombre bonito para fun
      menuTxt += `*🗂️ ${tagName}* [${cmds.length}]\n`
      menuTxt += cmds.map(v => `> 🌀 ${usedPrefix}${v}`).join('\n')
      menuTxt += `\n\n━━━━━━━━━━━\n\n`
    }

    menuTxt += `👑 *Creador:* ${usedPrefix}creador\n`
    menuTxt += `> Sistema v3.2 🌀 | ${new Date().toLocaleDateString('es-PE')}`

    // Guardar en cache
    menuCache = { txt: menuTxt, time: now }

    await conn.sendMessage(m.chat, {
      image: { url: imgUrl },
      caption: menuTxt,
      mentions: [m.sender]
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply(`❌ Error al generar el menú: ${e.message}`)
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help|menú)$/i
handler.limit = false
export default handler