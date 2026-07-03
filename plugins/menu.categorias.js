let handler = async (m, { conn, usedPrefix, args }) => {
  let taguser = '@' + m.sender.split('@')[0]
  const imgUrl = 'https://files.evogb.win/7Rs2Rz.jpg'

  // [1] JALAR TODAS LAS CATEGORIAS
  let plugins = Object.values(global.plugins).filter(p =>!p.disabled && p.help)
  let groups = {}
  for (let p of plugins) {
    for (let tag of p.tags || ['main']) {
      if (!(tag in groups)) groups[tag] = []
      groups[tag].push(...[].concat(p.help))
    }
  }
  let categories = Object.keys(groups).sort()
  let sub = (args[0] || '').toLowerCase()

  // [NIVEL 2].MENU CATEGORIA -> MUESTRA COMANDOS
  if (categories.includes(sub)) {
    let txt = `*🤖 [ ${sub.toUpperCase()} ]*\n\n👤 ${taguser} | ${groups[sub].length} cmds\n`
    txt += groups[sub].map(v => `> 🌀 ${usedPrefix}${v}`).join('\n')
    txt += `\n\n_Usa ${usedPrefix}menu para volver_`
    return conn.reply(m.chat, txt, m, { mentions: [m.sender] })
  }

  // [NIVEL 1].MENU -> FOTO + LUEGO LISTA
  let caption = `*🤖 [ For Three Bot ]* 🤖\n\n`
  caption += `👤 Usuario: ${taguser}\n⚙️ Prefijo: [ ${usedPrefix} ]\n`
  caption += `📦 Plugins: ${plugins.length}\n📂 Categorías: ${categories.length}\n\n`
  caption += `> Sistema Automatizado v3 🌀`

  // 1. Manda la FOTO con botón
  await conn.sendMessage(m.chat, {
    image: { url: imgUrl },
    caption,
    footer: 'For Three Bot 🌀',
    mentions: [m.sender],
    buttons: [
      {buttonId: `${usedPrefix}menu cmds`, buttonText: {displayText: '📜 VER COMANDOS'}, type: 1}
    ],
    headerType: 4
  }, { quoted: m })

  // 2. Espera 0.3s y manda la LISTA al toque
  await new Promise(resolve => setTimeout(resolve, 300))

  let sections = [{
    title: `📂 Elige una categoría [${categories.length}]`,
    rows: categories.map(tag => ({
      title: `🗂️ ${tag.toUpperCase()}`,
      rowId: `${usedPrefix}menu ${tag}`, // <-- Al tocar muestra comandos
      description: `${groups[tag].length} comandos`
    }))
  }]

  await conn.sendMessage(m.chat, {
    text: `👋 Hola ${taguser}\nElige una categoría:`,
    footer: 'For Three Bot v3 🌀',
    title: "📜 MENÚ DE COMANDOS",
    buttonText: "VER CATEGORÍAS",
    sections,
    mentions: [m.sender]
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help|menú)$/i
export default handler