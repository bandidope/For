import { join } from 'path'
import { readFileSync, existsSync } from 'fs'

let handler = async (m, { conn, usedPrefix, args }) => {
  let taguser = '@' + m.sender.split('@')[0]

  // [0] TU IMAGEN FIJA
  const imgUrl = 'https://files.evogb.win/7Rs2Rz.jpg' 
  const imgPath = join(process.cwd(), 'storage', 'img', 'catalogo.png')
  const img = existsSync(imgPath)? readFileSync(imgPath) : { url: imgUrl }

  // [1] AGRUPAR TODOS LOS PLUGINS POR CATEGORIA
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

  // [NIVEL 3].MENU CATEGORIA -> LISTA COMANDOS
  if (categories.includes(sub)) {
    let txt = `*🤖 [ ${sub.toUpperCase()} ]*\n\n`
    txt += `👤 Usuario: ${taguser}\n`
    txt += `📦 Total: ${groups[sub].length} comandos\n`
    for (let v of groups[sub]) {
      txt += `> 🌀 ${usedPrefix}${v}\n`
    }
    txt += `\n_Usa ${usedPrefix}menu para volver_`
    return conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: m })
  }

  // [NIVEL 2].MENU CMDS -> LISTA DE CATEGORIAS
  if (sub === 'cmds') {
    let sections = [{
      title: `📂 Elige una categoría [${categories.length}]`,
      rows: categories.map(tag => ({
        title: `🗂️ ${tag.toUpperCase()}`,
        rowId: `${usedPrefix}menu ${tag}`, // <-- CLAVE: Ejecuta.menu main
        description: `${groups[tag].length} comandos`
      }))
    }]

    return await conn.sendMessage(m.chat, {
      text: `🤖 *For Three Bot*\n\n👋 Hola ${taguser}\nToca una categoría para ver sus comandos:`,
      footer: 'For Three Bot v3 🌀',
      title: "📜 Menú Interactivo",
      buttonText: "VER CATEGORÍAS",
      sections,
      mentions: [m.sender]
    }, { quoted: m })
  }

  // [NIVEL 1].MENU -> FOTO + BOTON
  let caption = `*🤖 [ For Three Bot ]* 🤖\n\n`
  caption += `👤 Usuario: ${taguser}\n`
  caption += `⚙️ Prefijo: [ ${usedPrefix} ]\n`
  caption += `📦 Plugins: ${plugins.length}\n`
  caption += `📂 Categorías: ${categories.length}\n\n`
  caption += `> Sistema Automatizado v3 🌀`

  await conn.sendMessage(m.chat, {
    image: img,
    caption,
    mentions: [m.sender],
    footer: 'For Three Bot 🌀',
    buttons: [
      {buttonId: `${usedPrefix}menu cmds`, buttonText: {displayText: '📜 VER COMANDOS'}, type: 1}
    ],
    headerType: 4 // <-- 4 = imagen + botones. Esto es lo que faltaba
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help|menú)$/i // <-- Agarra.menu.menu cmds.menu main etc
export default handler