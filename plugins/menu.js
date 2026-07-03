import { join } from 'path'
import { readFileSync, existsSync } from 'fs'

let handler = async (m, { conn, usedPrefix, args }) => {
  let taguser = '@' + m.sender.split('@')[0]

  const imgUrl = 'https://files.evogb.win/7Rs2Rz.jpg'

  // [1] AGRUPAR CATEGORIAS
  let plugins = Object.values(global.plugins).filter(p => p.help &&!p.disabled)
  let groups = {}
  for (let p of plugins) {
    let tags = p.tags || ['otros']
    for (let tag of tags) {
      if (!groups[tag]) groups[tag] = []
      groups[tag].push(...[].concat(p.help))
    }
  }
  let categories = Object.keys(groups).sort()
  let sub = (args[0] || '').toLowerCase()

  // [NIVEL 3].MENU CATEGORIA
  if (categories.includes(sub)) {
    let txt = `*🤖 [ ${sub.toUpperCase()} ]*\n\n👤 ${taguser} | ${groups[sub].length} cmds\n`
    for (let v of groups[sub]) txt += `> 🌀 ${usedPrefix}${v}\n`
    txt += `\n_Usa ${usedPrefix}menu para volver_`
    return conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: m })
  }

  // [NIVEL 2].MENU CMDS -> LISTA
  if (sub === 'cmds') {
    let sections = [{
      title: `📂 Categorías [${categories.length}]`,
      rows: categories.map(tag => ({
        header: `🗂️ ${tag.toUpperCase()}`,
        title: `${groups[tag].length} comandos`,
        id: `${usedPrefix}menu ${tag}`
      }))
    }]

    return await conn.sendMessage(m.chat, {
      text: `🤖 *For Three Bot*\n\n👋 Hola ${taguser}\nElige una categoría:`,
      footer: 'For Three Bot v3 🌀',
      title: "📜 Menú Interactivo",
      buttonText: "VER CATEGORÍAS",
      sections,
      mentions: [m.sender]
    }, { quoted: m })
  }

  // [NIVEL 1].MENU -> FOTO + BOTON INTERACTIVO FIX
  let caption = `*🤖 [ For Three Bot ]* 🤖\n\n`
  caption += `👤 Usuario: ${taguser}\n⚙️ Prefijo: [ ${usedPrefix} ]\n`
  caption += `📦 Plugins: ${plugins.length}\n📂 Categorías: ${categories.length}\n\n`
  caption += `> Sistema Automatizado v3 🌀`

  await conn.sendMessage(m.chat, {
    image: { url: imgUrl }, // <-- FIX: URL directo, sin prepareMessageMedia
    caption,
    footer: 'For Three Bot 🌀',
    mentions: [m.sender],
    buttons: [
      {buttonId: `${usedPrefix}menu cmds`, buttonText: {displayText: '📜 VER COMANDOS'}, type: 1}
    ],
    headerType: 4
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help|menú)$/i
export default handler