import { join } from 'path'
import { readFileSync, existsSync } from 'fs'

let handler = async (m, { conn, usedPrefix, args }) => {
  let taguser = '@' + m.sender.split('@')[0]

  const imgUrl = 'https://files.evogb.win/7Rs2Rz.jpg'
  const imgPath = join(process.cwd(), 'storage', 'img', 'catalogo.png')
  const imgBuffer = existsSync(imgPath)? readFileSync(imgPath) : null

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
    let txt = `*🤖 [ ${sub.toUpperCase()} ]*\n\n👤 ${taguser} | ${groups[sub].length} cmds\n\n`
    for (let v of groups[sub]) txt += `> 🌀 ${usedPrefix}${v}\n`
    txt += `\n_Usa ${usedPrefix}menu para volver_`
    return conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: m })
  }

  // [NIVEL 2].MENU CMDS -> LISTA INTERACTIVA
  if (sub === 'cmds') {
    let sections = [{
      title: `📂 Categorías [${categories.length}]`,
      rows: categories.map(tag => ({
        header: `🗂️ ${tag.toUpperCase()}`,
        title: `${groups[tag].length} comandos`,
        id: `${usedPrefix}menu ${tag}` // <-- Esto es lo que ejecuta al tocar
      }))
    }]

    const interactiveMessage = {
      body: { text: `🤖 *For Three Bot*\n\n👋 Hola ${taguser}\nElige una categoría:` },
      footer: { text: 'For Three Bot v3 🌀' },
      header: {
        title: "📜 Menú Interactivo",
        hasMediaAttachment: false
      },
      nativeFlowMessage: {
        buttons: [{
          name: "single_select",
          buttonParamsJson: JSON.stringify({
            title: "VER CATEGORÍAS",
            sections
          })
        }],
      },
      mentions: [m.sender]
    }
    return await conn.sendMessage(m.chat, interactiveMessage, { quoted: m })
  }

  // [NIVEL 1].MENU -> FOTO + BOTON INTERACTIVO
  let caption = `*🤖 [ For Three Bot ]* 🤖\n\n`
  caption += `👤 Usuario: ${taguser}\n⚙️ Prefijo: [ ${usedPrefix} ]\n`
  caption += `📦 Plugins: ${plugins.length}\n📂 Categorías: ${categories.length}\n\n`
  caption += `> Sistema Automatizado v3 🌀`

  const interactiveButtons = {
    body: { text: caption },
    footer: { text: 'For Three Bot 🌀' },
    header: {
      title: "",
      hasMediaAttachment: true,
      imageMessage: imgBuffer? await conn.prepareMessageMedia(imgBuffer, 'imageMessage') : { url: imgUrl }
    },
    nativeFlowMessage: {
      buttons: [{
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "📜 VER COMANDOS",
          id: `${usedPrefix}menu cmds` // <-- CLAVE: Ejecuta esto al tocar
        })
      }],
    },
    mentions: [m.sender]
  }

  await conn.sendMessage(m.chat, interactiveButtons, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help|menú)$/i // Agarra.menu cmds etc
export default handler