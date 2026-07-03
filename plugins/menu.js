import { join } from 'path'
import { readFileSync, existsSync } from 'fs'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  let taguser = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : m.sender
  const imgUrl = 'https://files.evogb.win/7Rs2Rz.jpg'
  const imgPath = join(process.cwd(), 'storage', 'img', 'catalogo.png')
  const img = existsSync(imgPath)? readFileSync(imgPath) : null

  // [1] AGRUPAR TODO POR CATEGORÍAS
  let help = Object.values(global.plugins).filter(p => p.help &&!p.disabled)
  let groups = {}
  for (let plugin of help) {
    let category = plugin.tags? plugin.tags[0] : 'otros'
    if (!groups[category]) groups[category] = []
    groups[category].push(...[].concat(plugin.help))
  }
  const categories = Object.keys(groups).sort()

  const args = text.trim().split(/ +/)
  const sub = args[0]?.toLowerCase()

  // [NIVEL 3] SI ES.menu CATEGORIA -> SUELTA SOLO COMANDOS
  if (sub && categories.includes(sub)) {
    let catMenu = `🤖 *[ ${sub.toUpperCase()} ]* 🤖\n\n`
    catMenu += `👤 *Usuario:* @${taguser.split('@')[0]} | Total: ${groups[sub].length}\n\n`
    for (let cmd of groups[sub]) {
      catMenu += `│ 🌀 ${usedPrefix}${cmd}\n`
    }
    catMenu += `\n*───────────────────*\n↩️ Escribe ${usedPrefix}menu para volver`

    return await conn.sendMessage(m.chat, { text: catMenu, mentions: [taguser] }, { quoted: m })
  }

  // [NIVEL 2] SI ES.menu CMDS -> SUELTA LISTA CON TODAS LAS CATEGORÍAS
  if (sub === 'cmds') {
    const sections = [{
      title: `📂 Categorías Disponibles [${categories.length}]`,
      rows: categories.map(cat => ({
        title: `🗂️ ${cat.toUpperCase()}`,
        description: `${groups[cat].length} comandos`,
        rowId: `${usedPrefix}menu ${cat}` // <-- Al tocar manda esto
      }))
    }]

    const listMessage = {
      text: `🤖 *[ For Three Bot ]*\n\n👤 Hola @${taguser.split('@')[0]}\nElige una categoría para ver sus comandos:`,
      footer: 'For Three Bot 🌀',
      title: '📜 Menú de Comandos',
      buttonText: 'VER CATEGORÍAS',
      sections,
      mentions: [taguser]
    }
    return await conn.sendMessage(m.chat, listMessage, { quoted: m })
  }

  // [NIVEL 1].MENU -> FOTO + INFO + 1 BOTÓN
  let menuText = `🤖 *[ For Three Bot ]* 🤖\n\n`
  menuText += `👤 *Usuario:* @${taguser.split('@')[0]}\n`
  menuText += `⚙️ *Prefijo:* [ ${usedPrefix} ]\n`
  menuText += `📦 *Plugins:* ${help.length}\n`
  menuText += `📂 *Categorías:* ${categories.length}\n\n`
  menuText += `> *Sistema Automatizado v3* 🌀`

  const buttons = [{
    buttonId: `${usedPrefix}menu cmds`,
    buttonText: { displayText: '📜 VER COMANDOS' },
    type: 1
  }]

  const buttonMessage = {
    image: { url: imgUrl },
    caption: menuText,
    footer: 'For Three Bot 🌀',
    mentions: [taguser],
    buttons: buttons,
    headerType: 4
  }

  try {
    await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
  } catch {
    await conn.sendMessage(m.chat, {
      image: img, caption: menuText, buttons, footer: 'For Three Bot 🌀', mentions: [taguser]
    }, { quoted: m })
  }
}

handler.help = ['menu', 'help', 'menú']
handler.tags = ['main']
handler.command = /^(menu|help|menú)$/i

export default handler