let handler = async (m, { conn, command, args, isAdmin, isOwner }) => {
  let chat = m.chat
  let cmd = command.toLowerCase()
  let dias = ['lunes','martes','miercoles','jueves','viernes','sabado']
  let diasNums = {'1':'lunes','2':'martes','3':'miercoles','4':'jueves','5':'viernes','6':'sabado'}

  // 1. CREAR DB POR GRUPO
  global.db.data.dias = global.db.data.dias || {}
  if (!global.db.data.dias) {
    global.db.data.dias = {
      lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: []
    }
  }
  let db = global.db.data.dias

  // 2. SET + NUMERO:.set1 @tag
  if (cmd.startsWith('set')) {
    if (!isAdmin &&!isOwner) return m.reply('❌ Solo admins')
    let num = cmd.replace('set','')
    let dia = diasNums[num]
    if (!dia) return m.reply('Dia invalido. Usa.set1 al.set6')

    let mentions = m.mentionedJid
    if (!mentions || mentions.length === 0) return m.reply(`Ejemplo:.set${num} @usuario1 @usuario2`)

    let nuevos = mentions.filter(x =>!db[dia].includes(x))
    if (nuevos.length === 0) return m.reply(`> Ya estaban todos en ${dia.toUpperCase()}`)

    db[dia].push(...nuevos)
    await global.db.write()

    let nombres = nuevos.map(jid => '@' + jid.split('@')[0]).join(' ')
    return m.reply(`✅ Agregado a *${dia.toUpperCase()}*:\n${nombres}`, null, {mentions: nuevos})
  }

  // 3. DEL + NUMERO:.del1
  if (cmd.startsWith('del')) {
    if (!isAdmin &&!isOwner) return m.reply('❌ Solo admins')
    let num = cmd.replace('del','')
    let dia = diasNums[num]
    if (!dia) return m.reply('Dia invalido. Usa.del1 al.del6')

    if (db[dia].length === 0) return m.reply(`*${dia.toUpperCase()}* ya está vacío`)

    let borrados = db[dia]
    let total = borrados.length
    db[dia] = []
    await global.db.write()

    let nombreGrupo = await conn.getName(chat).catch(_ => 'Grupo')
    let pp
    try { pp = await conn.profilePictureUrl(chat, 'image') }
    catch { pp = 'https://i.imgur.com/2zOom2o.jpeg' }

    let texto = `🗑️ *${dia.toUpperCase()} BORRADO*\n*Grupo:* ${nombreGrupo}\n*Se eliminaron:* ${total} personas\n`
    texto += borrados.map((jid, i) => `${i+1}. @${jid.split('@')[0]}`).join('\n')
    texto += `\n\n✅ Lista limpia`

    return conn.sendMessage(chat, { image: { url: pp }, caption: texto, mentions: borrados })
  }

  // 4. SOLO NUMERO:.1.2.3
  if (diasNums[cmd]) {
    let dia = diasNums[cmd]
    if (db[dia].length === 0) return m.reply(`*${dia.toUpperCase()}*\n> Vacío`)

    let nombreGrupo = await conn.getName(chat).catch(_ => 'Grupo')
    let pp
    try { pp = await conn.profilePictureUrl(chat, 'image') }
    catch { pp = 'https://i.imgur.com/2zOom2o.jpeg' }

    let texto = `📅 *${dia.toUpperCase()}* [${db[dia].length}]\n*Grupo:* ${nombreGrupo}\n\n`
    texto += db[dia].map((jid, i) => `${i+1}. @${jid.split('@')[0]}`).join('\n')

    return conn.sendMessage(chat, { image: { url: pp }, caption: texto, mentions: db[dia] })
  }
}

handler.help = [
  '.set1 @tag', '.set2 @tag', '.set3 @tag', '.set4 @tag', '.set5 @tag', '.set6 @tag',
  '.1', '.2', '.3', '.4', '.5', '.6',
  '.del1', '.del2', '.del3', '.del4', '.del5', '.del6'
]
handler.tags = ['sorteos staff']
handler.command = /^(set[1-6]|del[1-6]|[1-6])$/i
handler.group = true
handler.admin = true
export default handler