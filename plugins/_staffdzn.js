let handler = async (m, { conn, command, args, isAdmin, isOwner }) => {
  let chat = m.chat
  let cmd = command.toLowerCase()
  let diasNums = {'1':'lunes','2':'martes','3':'miercoles','4':'jueves','5':'viernes','6':'sabado'}

  // ARREGLO PARA QUE NO TIRE ERROR
  global.db.data.dias = global.db.data.dias || {}
  if (!global.db.data.dias) global.db.data.dias = {}
  if (!global.db.data.dias.lunes) {
    global.db.data.dias = { lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [] }
  }
  let db = global.db.data.dias

  if (cmd.startsWith('set')) {
    if (!isAdmin &&!isOwner) return m.reply('❌ Solo admins')
    let dia = diasNums[cmd.replace('set','')]
    if (!dia) return m.reply('Usa.set1 al.set6')

    let mentions = m.mentionedJid
    if (!mentions?.length) return m.reply(`Ejemplo:.set1 @usuario`)

    let nuevos = mentions.filter(x =>!db[dia].includes(x))
    if (!nuevos.length) return m.reply(`> Ya estaban en ${dia.toUpperCase()}`)

    db[dia].push(...nuevos)
    await global.db.write()
    return m.reply(`✅ Agregado a *${dia.toUpperCase()}*`, null, {mentions: nuevos})
  }

  if (cmd.startsWith('del')) {
    if (!isAdmin &&!isOwner) return m.reply('❌ Solo admins')
    let dia = diasNums[cmd.replace('del','')]
    if (!dia) return m.reply('Usa.del1 al.del6')
    let total = db[dia].length
    if (!total) return m.reply(`*${dia.toUpperCase()}* ya está vacío`)
    db[dia] = []
    await global.db.write()
    return m.reply(`🗑️ *${dia.toUpperCase()}* borrado. ${total} eliminados`)
  }

  if (diasNums[cmd]) {
    let dia = diasNums[cmd]
    if (!db[dia].length) return m.reply(`*${dia.toUpperCase()}*\n> Vacío`)
    let texto = `📅 *${dia.toUpperCase()}* [${db[dia].length}]\n`
    texto += db[dia].map((jid, i) => `${i+1}. @${jid.split('@')[0]}`).join('\n')
    return conn.reply(chat, texto, m, {mentions: db[dia]})
  }
}
handler.command = /^(set[1-6]|del[1-6]|[1-6])$/i
handler.group = true
handler.admin = true
export default handler