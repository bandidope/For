let handler = async (m, { conn, command, args, isAdmin, isOwner }) => {
  let chat = m.chat
  let cmd = command.toLowerCase()
  let dias = ['lunes','martes','miercoles','jueves','viernes','sabado']

  // 1. CREAR DB POR GRUPO - ESTA ES LA CLAVE
  global.db.data.dias = global.db.data.dias || {}
  if (!global.db.data.dias) {
    global.db.data.dias = {
      lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: []
    }
  }
  let db = global.db.data.dias

  // 2. SETDIA -> ANOTAR CON TEXTO
  if (cmd.startsWith('set')) {
    if (!isAdmin &&!isOwner) return m.reply('❌ Solo admins')
    let dia = cmd.replace('set','')
    if (!dias.includes(dia)) return m.reply('Dia invalido')

    let mentions = m.mentionedJid
    if (!mentions || mentions.length === 0) return m.reply(`Ejemplo:.set${dia} Texto | @usuario1 @usuario2`)

    // Sacar texto antes del |
    let textoCustom = ''
    let fullText = args.join(' ')
    if (fullText.includes('|')) {
      textoCustom = fullText.split('|')[0].trim()
    }

    let nuevos = mentions.filter(x =>!db[dia].includes(x))
    if (nuevos.length === 0) return m.reply(`> Ya estaban todos en ${dia.toUpperCase()}`)

    db[dia].push(...nuevos)
    await global.db.write()

    let nombres = nuevos.map(jid => '@' + jid.split('@')[0]).join(' ')
    let titulo = textoCustom? `*${textoCustom}*` : `✅ Agregado a *${dia.toUpperCase()}*`
    return m.reply(`${titulo}:\n${nombres}`, null, {mentions: nuevos})
  }

  // 3. RESETDIA -> BORRAR
  if (cmd.startsWith('reset')) {
    if (!isAdmin &&!isOwner) return m.reply('❌ Solo admins')
    let dia = cmd.replace('reset','')
    if (!dias.includes(dia)) return m.reply('Dia invalido')

    let total = db[dia].length
    db[dia] = []
    await global.db.write()
    return m.reply(`🗑️ *${dia.toUpperCase()}* borrado. Se eliminaron ${total} personas.`)
  }

  // 4. DIA -> VER CON TEXTO + FOTO DEL GRUPO
  if (dias.includes(cmd)) {
    let dia = cmd
    if (db[dia].length === 0) return m.reply(`*${dia.toUpperCase()}*\n> Vacío`)

    let nombreGrupo = await conn.getName(chat).catch(_ => 'Grupo')
    let pp = await conn.profilePictureUrl(chat, 'image').catch(_ => null)

    let texto = `📅 *${dia.toUpperCase()}* [${db[dia].length}]\n*Grupo:* ${nombreGrupo}\n\n`
    texto += db[dia].map((jid, i) => `${i+1}. @${jid.split('@')[0]}`).join('\n')

    if (pp) {
      return conn.sendMessage(chat, { image: { url: pp }, caption: texto, mentions: db[dia] })
    } else {
      return conn.reply(chat, texto, m, {mentions: db[dia]})
    }
  }
}

handler.help = [
  'setlunes Texto | @tag',
  'setmartes Texto | @tag',
  'setmiercoles Texto | @tag',
  'setjueves Texto | @tag',
  'setviernes Texto | @tag',
  'setsabado Texto | @tag'
]
handler.tags = ['sorteos staff']
handler.command = /^(setlunes|setmartes|setmiercoles|setjueves|setviernes|setsabado|resetlunes|resetmartes|resetmiercoles|resetjueves|resetviernes|resetsabado|lunes|martes|miercoles|jueves|viernes|sabado)$/i
handler.group = true
handler.admin = true
export default handler