let handler = async (m, { conn, command, args, isAdmin, isOwner }) => {
  let chat = m.chat // ID del grupo
  let cmd = command.toLowerCase()
  let dias = ['lunes','martes','miercoles','jueves','viernes','sabado']

  // INICIALIZAR DB POR GRUPO
  global.db.data.dias = global.db.data.dias || {}
  if (!global.db.data.dias) global.db.data.dias = {}
  if (!global.db.data.dias.lunes) global.db.data.dias = { lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [] }
  let db = global.db.data.dias // <- AQUI ESTA EL TRUCO

  if (dias.includes(cmd)) {
    let dia = cmd
    let sub = args[0]?.toLowerCase()

    // 1. AGREGAR:.lunes @tag
    if (m.mentionedJid?.length) {
      if (!isAdmin &&!isOwner) return m.reply('❌ Solo admins')
      let nuevos = m.mentionedJid.filter(x =>!db[dia].includes(x))
      if (!nuevos.length) return m.reply(`> Ya estaban en ${dia.toUpperCase()}`)

      db[dia].push(...nuevos)
      await global.db.write()
      return m.reply(`✅ Agregado a *${dia.toUpperCase()}*`, null, {mentions: nuevos})
    }

    // 2. VER:.lunes ver
    if (sub === 'ver') {
      if (!db[dia].length) return m.reply(`*${dia.toUpperCase()}*\n> Vacío en este grupo`)

      let nombreGrupo = await conn.getName(chat).catch(_ => 'Grupo')
      let pp
      try { pp = await conn.profilePictureUrl(chat, 'image') }
      catch { pp = 'https://i.imgur.com/2zOom2o.jpeg' }

      let texto = `📅 *${dia.toUpperCase()}* [${db[dia].length}]\n*Grupo:* ${nombreGrupo}\n\n`
      texto += db[dia].map((jid, i) => `${i+1}. @${jid.split('@')[0]}`).join('\n')

      return conn.sendMessage(chat, { image: { url: pp }, caption: texto, mentions: db[dia] })
    }

    // 3. ELIMINAR:.lunes eliminar
    if (sub === 'eliminar') {
      if (!isAdmin &&!isOwner) return m.reply('❌ Solo admins')
      if (!db[dia].length) return m.reply(`*${dia.toUpperCase()}* ya está vacío`)

      let borrados = db[dia]
      db[dia] = []
      await global.db.write()

      let nombreGrupo = await conn.getName(chat).catch(_ => 'Grupo')
      let pp
      try { pp = await conn.profilePictureUrl(chat, 'image') }
      catch { pp = 'https://i.imgur.com/2zOom2o.jpeg' }

      let texto = `🗑️ *${dia.toUpperCase()} BORRADO*\n*Grupo:* ${nombreGrupo}\n*Se eliminaron:* ${borrados.length} personas\n`
      texto += borrados.map((jid, i) => `${i+1}. @${jid.split('@')[0]}`).join('\n')

      return conn.sendMessage(chat, { image: { url: pp }, caption: texto, mentions: borrados })
    }

    return m.reply(`Usa:\n.${dia} @tag → Agregar\n.${dia} ver → Ver\n.${dia} eliminar → Borrar`)
  }
}

handler.command = /^(lunes|martes|miercoles|jueves|viernes|sabado)$/i
handler.group = true
handler.admin = true
export default handler