let handler = async (m, { conn, usedPrefix, command, text }) => {
  let categoria = text.toLowerCase().trim() // agarra 'fun', 'info', etc

  let plugins = Object.values(global.plugins).filter(p =>!p.disabled && p.help)
  let cmds = []

  for (let p of plugins) {
    let tags = p.tags || ['main']
    let helps = [].concat(p.help).filter(Boolean)
    if(tags.includes(categoria)){
      cmds.push(...helps)
    }
  }

  if(cmds.length === 0) return m.reply(`❌ No hay comandos en *${categoria}*`)

  cmds = [...new Set(cmds)].sort()

  let nombres = {
    'fun': '🎮 JUEGOS Y DIVERSIÓN',
    'info': 'ℹ️ INFORMACIÓN',
    'main': '⚙️ PRINCIPAL',
    'sorteos': '🎁 SORTEOS',
    'ventas bot': '🛒 VENTAS BOT'
  }

  let titulo = nombres[categoria] || `🗂️ ${categoria.toUpperCase()}`

  let menuTxt = `*${titulo}* [${cmds.length}]\n\n`
  menuTxt += cmds.map(v => `> 🌀 ${usedPrefix}${v}`).join('\n')
  menuTxt += `\n\n━━━━━━━━━━━\n> Volver:.punto menu`

  const imgUrl = 'https://files.evogb.win/7Rs2Rz.jpg'

  await conn.sendMessage(m.chat, {
    image: { url: imgUrl },
    caption: menuTxt,
    mentions: [m.sender]
  }, { quoted: m })
}

handler.command = /^(punto\s?menu\s)(.+)$/i // detecta.punto menu fun
export default handler