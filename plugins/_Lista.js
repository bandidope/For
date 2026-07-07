let handler = async (m, { conn, args, command, isAdmin, isOwner }) => {
  let chat = m.chat // ID del grupo

  // 1. CREAR DB POR GRUPO - ARREGLO DEFINITIVO
  if (!global.db.data.lista) global.db.data.lista = {}
  if (!global.db.data.lista) global.db.data.lista = {
    lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [], extra: []
  }
  let db = global.db.data.lista

  // 2. SACAR DIA Y HORA DE LIMA
  let tz = 'America/Lima'
  let fecha = new Date()
  let dia = fecha.toLocaleString('es-PE', { timeZone: tz, weekday: 'long' }).toLowerCase()
  dia = dia.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  let hora = fecha.toLocaleString('es-PE', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true })
  let esDomingo = dia === 'domingo'
  let diaGuardar = esDomingo? 'extra' : dia

  // 3. COMANDO.ver
  if (command === 'ver') {
    let texto = `📋 *LISTA SEMANAL*\nHoy: *${esDomingo? 'DOMINGO' : dia.toUpperCase()}* | ${hora}\n\n`
    let total = 0
    for (let d of ['lunes','martes','miercoles','jueves','viernes','sabado','extra']) {
      total += db[d].length
      texto += `*${d.toUpperCase()}* [${db[d].length}]\n`
      if (db[d].length > 0) {
        for (let i of db[d]) {
          texto += `${i.tag} ${i.n} | ${i.num} | ${i.p} | _${i.hora}_\n`
        }
      } else {
        texto += `> Vacío\n`
      }
      texto += `\n`
    }
    texto += `*TOTAL ANOTADOS: ${total}*`
    return m.reply(texto.trim())
  }

  // 4. COMANDO.reset - SOLO ADMINS
  if (command === 'reset') {
    if (!isAdmin &&!isOwner) return m.reply('❌ *Solo Admins pueden borrar la lista*')

    if (args[0] === 'extra') {
      db.extra = []
      await global.db.write()
      return m.reply('🗑️ *EXTRA borrado por un Admin*')
    } else {
      for (let d of ['lunes','martes','miercoles','jueves','viernes','sabado']) db[d] = []
      await global.db.write()
      return m.reply('🗑️ *Lunes a Sabado borrado por un Admin*. EXTRA sigue intacto\nUsa `.reset extra` para borrar extra')
    }
  }

  // 5. COMANDO.lista
  let juntar = args.join(' ')
  let sep = juntar.split('|').map(v => v.trim())
  let [nombre, numero, premio, extra] = sep

  if (!nombre ||!numero ||!premio) return m.reply(`❌ *Formato mal*

*COMANDOS:*
.lista Nombre | Numero | Premio
.lista Nombre | Numero | Premio | extra
.ver
.reset *Solo Admins*`)

  let guardarEn = extra?.toLowerCase() === 'extra'? 'extra' : diaGuardar
  let tag = guardarEn === 'extra'? (esDomingo? '🛒' : '📦') : '✅'

  db[guardarEn].push({n: nombre, num: numero, p: premio, tag: tag, hora: hora})
  await global.db.write()

  let aviso = esDomingo? '⚠️ *DOMINGO - Dia de Ventas*\nSe guardo en EXTRA 🛒\n\n' : ''
  return m.reply(`${aviso}${tag} *ANOTADO EN ${guardarEn.toUpperCase()}* a las ${hora}\n\n# ${nombre} | ${numero} | ${premio}`)
}

handler.help = ['lista', 'ver', 'reset']
handler.tags = ['sorteos']
handler.command = /^(lista|ver|reset)$/i
handler.group = true
handler.admin = false
export default handler