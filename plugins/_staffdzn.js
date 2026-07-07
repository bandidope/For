let handler = async (m, { conn, command, args, isAdmin, isOwner }) => {
  let chat = m.chat
  let cmd = command.toLowerCase()
  let dias = ['lunes','martes','miercoles','jueves','viernes','sabado']

  // DB POR GRUPO
  global.db.data.dias = global.db.data.dias || {}
  if (!global.db.data.dias) global.db.data.dias = {}
  if (!global.db.data.dias.lunes) {
    global.db.data.dias = { lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [] }
  }
  let db = global.db.data.dias

  // 1. AGREGAR:.lunes @tag @tag
  if (dias.includes(cmd)) {
    if (!isAdmin &&!isOwner) return m.reply('❌ Solo admins')
    let dia = cmd
    let mentions = m.mentionedJid
    if (!mentions?.length) return m.reply(`Ejemplo:.${dia} @usuario1 @usuario2`)

    let nuevos = mentions.filter(x =>!db[dia].includes(x))
    if (!nuevos.length) return m.reply(`> Ya estaban todos en ${dia.toUpperCase()}`)

    db[dia].push(...nuevos)
    await global.db.write()
    return m.reply(`✅ Agregado a *${dia.toUpperCase()}*`, null, {mentions: nuevos})
  }

  // 2. VER:.ver lunes
  if (cmd === 'ver') {
    let dia = args[0]?.toLowerCase()
    if (!dias.includes(dia)) return m.reply(`Usa:.ver lunes\nDias: ${dias.join(', ')}`)
    if (!db[dia].length) return m.reply(`*${dia.toUpperCase()}*\n> Vacío`)

    let nombreGrupo = await conn.getName(chat).catch(_ => 'Grupo')
    let pp
    try { pp = await conn.profilePictureUrl(chat, 'image') }
    catch { pp = 'https://i.imgur.com/2zOom2o.jpeg' }

    let texto = `📅 *${dia.toUpperCase()}* [${db[dia].length}]\n*Grupo:* ${nombreGrupo}\n\n`
    texto += db[dia].map((jid, i) => `${i+1}. @${jid.split('@')[0]}`).join('\n')

    return conn.sendMessage(chat, { image: { url: pp }, caption: texto, mentions: db[dia] })
  }

  // 3. ELIMINAR:.eliminar lunes
  if (cmd === 'eliminar') {
    if (!isAdmin &&!isOwner) return m.reply('❌ Solo admins')
    let dia = args[0]?.toLowerCase()
    if (!dias.includes(dia)) return m.reply(`Usa:.eliminar lunes\nDias: ${dias.join(', ')}`)
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
}

handler.help = ['.lunes @tag', '.ver lunes', '.eliminar lunes']
handler.tags = ['sorteos staff']
handler.command = /^(lunes|martes|miercoles|jueves|viernes|sabado|ver|eliminar)$/i
handler.group = true
handler.admin = true
export default handler