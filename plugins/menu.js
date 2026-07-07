let handler = async (m, { conn, usedPrefix, command, args }) => {
  let categoria = args[0] // agarra 'fun', 'info', etc
  if(!categoria) return m.reply('Usa:.menu <categoria>')

  let plugins = Object.values(global.plugins).filter(p =>!p.disabled && p.help)
  let cmds = []

  for (let p of plugins) {
    let tags = p.tags || ['main']
    let helps = [].concat(p.help).filter(Boolean)
    if(tags.includes(categoria.toLowerCase())){
      cmds.push(...helps)
    }
  }

  if(cmds.length === 0) return m.reply(`❌ No hay comandos en la categoría *${categoria}*`)

  cmds = [...new Set(cmds)].sort()

  let nombres = {
    'fun': '🎮 JUEGOS Y DIVERSIÓN',
    'info': 'ℹ️ INFORMACIÓN',
    'main': '⚙️ PRINCIPAL',
    'sorteos': '🎁 SORTEOS',
    'ventas bot': '🛒 VENTAS BOT'
  }

  let titulo = nombres[categoria.toLowerCase()] || `🗂️ ${categoria.toUpperCase()}`

  let txt = `*${titulo}* [${cmds.length}]\n\n`
  txt += cmds.map(v => `> 🌀 ${usedPrefix}${v}`).join('\n')
  txt += `\n\n━━━━━━━━━━━\n> Usa: ${usedPrefix}comando`

  // Lista desplegable tipo ZEN-BOT
  const sections = [{
    title: titulo,
    rows: cmds.map(cmd => ({
      title: cmd,
      rowId: `${usedPrefix}${cmd}`,
      description: `Usar ${usedPrefix}${cmd}`
    }))
  }]

  await conn.sendList(m.chat, `Categoría: ${titulo}`, 'Toca para ver los comandos', 'FOR THREE BOT', 'ABRIR LISTA', sections, m)
}

handler.command = /^menu$/i
export default handler