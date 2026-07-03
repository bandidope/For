let handler = async (m, { conn, args, isAdmin, isOwner }) => {
  let chat = m.chat

  // DB por chat
  if (!global.db.data.lista) global.db.data.lista = {}
  if (!global.db.data.lista) global.db.data.lista = {
    lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [], extra: []
  }
  let db = global.db.data.lista

  let tz = 'America/Lima'
  let dia = new Date().toLocaleString('es-PE', { timeZone: tz, weekday: 'long' }).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  let esDomingo = dia === 'domingo'
  let diaGuardar = esDomingo? 'extra' : dia

  let op = args[0]?.toLowerCase()

  // 1. MENU
  if (!op) {
    return m.reply(`*LISTA BOT*
Hoy: *${esDomingo? 'DOMINGO' : dia.toUpperCase()}*

.lista add Nombre | Numero | Premio
.lista add Nombre | Numero | Premio | extra
.lista ver
.lista reset
.lista reset extra`)
  } 
  
  // 2. VER
  else if (op === 'ver') {
    let texto = `📋 *LISTA SEMANAL*\n\n`
    for (let d of ['lunes','martes','miercoles','jueves','viernes','sabado','extra']) {
      texto += `*${d.toUpperCase()}* [${db[d].length}]\n`
      texto += db[d].length > 0? db[d].map(i => `# ${i.n} | ${i.num} | ${i.p} ${i.tag}`).join('\n') + '\n\n' : '> Vacío\n'
    }
    try {
      let pp = await conn.profilePictureUrl(chat, 'image')
      return conn.sendFile(chat, pp, 'lista.jpg', texto.trim(), m)
    } catch {
      return m.reply(texto.trim())
    }
  }

  // 3. RESET
  else if (op === 'reset') {
    if (!isAdmin &&!isOwner) return m.reply('❌ Solo admins')
    if (args[1] === 'extra') {
      db.extra = []
    } else {
      for (let d of ['lunes','martes','miercoles','jueves','viernes','sabado']) db[d] = []
    }
    global.db.write()
    return m.reply(args[1] === 'extra'? '🗑️ EXTRA borrado' : '🗑️ Lunes a Sabado borrado. EXTRA sigue')
  }

  // 4. ADD
  else if (op === 'add') {
    let juntar = args.slice(1).join(' ')
    let sep = juntar.split('|').map(v => v.trim())
    let [nombre, numero, premio, extra] = sep
    if (!nombre ||!numero ||!premio) return m.reply('Formato mal. Usa:.lista add Nombre | Numero | Premio')

    let guardarEn = extra?.toLowerCase() === 'extra'? 'extra' : diaGuardar
    let tag = guardarEn === 'extra'? (esDomingo? '🛒' : '📦') : '✅'

    db[guardarEn].push({n: nombre, num: numero, p: premio, tag})
    global.db.write()

    let aviso = esDomingo? '⚠️ *DOMINGO - Dia de Ventas*\nSe guardo en EXTRA 🛒\n\n' : ''
    return m.reply(`${aviso}${tag} *${guardarEn.toUpperCase()}*\n# ${nombre} | ${numero} | ${premio}`)
  }
}

handler.command = ['lista']
handler.group = true
handler.admin = true 
export default handler