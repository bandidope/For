let handler = async (m, { conn, usedPrefix, text }) => {
  let taguser = '@' + m.sender.split('@')[0]

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
  let sub = text.toLowerCase()

  // [NIVEL 2].CATEGORIAS NOMBRE -> MUESTRA COMANDOS
  if (categories.includes(sub)) {
    let txt = `*🤖 [ ${sub.toUpperCase()} ]*\n\n👤 ${taguser} | ${groups[sub].length} cmds\n\n`
    for (let v of groups[sub]) txt += `> 🌀 ${usedPrefix}${v}\n`
    txt += `\n_Usa ${usedPrefix}categorias para volver_`
    return conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: m })
  }

  // [NIVEL 1].CATEGORIAS -> LISTA 100% FUNCIONAL
  let sections = [{
    title: `📂 Elige una categoría [${categories.length}]`,
    rows: categories.map(tag => ({
      title: `🗂️ ${tag.toUpperCase()}`,
      rowId: `${usedPrefix}categorias ${tag}`, // <-- Al tocar ejecuta.categorias main
      description: `${groups[tag].length} comandos`
    }))
  }]

  await conn.sendMessage(m.chat, {
    text: `🤖 *For Three Bot*\n\n👋 Hola ${taguser}\nToca una categoría para ver sus comandos:`,
    footer: 'For Three Bot v3 🌀',
    title: "📜 Menú de Comandos",
    buttonText: "VER CATEGORÍAS",
    sections,
    mentions: [m.sender]
  }, { quoted: m })
}

handler.help = ['categorias']
handler.tags = ['main']
handler.command = /^(categorias|cmds)$/i // <-- Agarra.categorias.categorias main
export default handler