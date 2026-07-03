let handler = async (m, { conn, args, isAdmin, isOwner }) => {
  let chat = m.chat
  let user = m.sender

  // 1. CREAR DB SI NO EXISTE
  if (!global.db.data.lista) global.db.data.lista = {}
  if (!global.db.data.lista[chat]) global.db.data.lista[chat] = {
    lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [], extra: []
  }
  let db = global.db.data.lista[chat]

  // 2. SACAR DIA DE LIMA
  let tz = 'America/Lima'
  let dia = new Date().toLocaleString('es-PE', { timeZone: tz, weekday: 'long' }).toLowerCase()
  dia = dia.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  let esDomingo = dia === 'domingo'
  let diaGuardar = esDomingo? 'extra' : dia

  let op = args[0]

  // 3. MENU
  if (!op) return m.reply(`*LISTA BOT*
Hoy: *${esDomingo? 'DOMINGO' : dia.toUpperCase()}*

.lista add Nombre | Numero | Premio
.lista add Nombre | Numero | Premio | extra
.lista ver
.lista reset
.lista reset extra`)

  // 4. VER LISTA
  if (op === 'ver') {
    let texto = `📋 *LISTA SEMANAL*\n\n`
    for (let d of ['lunes','martes','miercoles','jueves','viernes','sabado','extra']) {
      texto += `*${d.toUpperCase()}* [${db[d].length}]\n`
      if (db[d].length > 0) {
        for (let i of db[d]) {
          texto += `# ${i.n} | ${i.num} | ${i.p} ${i.tag}\n`
        }
      } else {
        texto += `> Vacío\n`
      }
      texto += `\n`
    }
    return m.reply(texto.trim())
  }

  // 5. RESET/BORRAR
  if (op === 'reset') {
    if (!isAdmin &&!isOwner) return m.reply('❌ Solo admins')
    if (args[1] === 'extra') {
      db.extra = []
      m.reply('🗑️ EXTRA borrado')
    } else {
      for (let d of ['lunes','martes','miercoles','jueves','viernes','sabado']) db[d] = []
      m.reply('🗑️ Lunes a Sabado borrado. EXTRA sigue')
    }
    global.db.write()
    return
  }

  // 6. ADD/ANOTAR
  if (op === 'add') {
    let juntar = args.slice(1).join(' ')
    let sep = juntar.split('|').map(v => v.trim())
    let [nombre, numero, premio, extra] = sep

    if (!nombre ||!numero ||!premio) return m.reply('Formato mal. Usa:.lista add Nombre | Numero | Premio')

    let guardarEn = extra?.toLowerCase() === 'extra'? 'extra' : diaGuardar
    let tag = guardarEn === 'extra'? (esDomingo? '🛒' : '📦') : '✅'

    db[guardarEn].push({n: nombre, num: numero, p: premio, tag: tag})
    global.db.write()

    let aviso = esDomingo? '⚠️ *DOMINGO - Dia de Ventas*\nSe guardo en EXTRA 🛒\n\n' : ''
    return m.reply(`${aviso}${tag} *${guardarEn.toUpperCase()}*\n# ${nombre} | ${numero} | ${premio}`)
  }
}

handler.command = ['lista']
handler.group = true
handler.admin = true
export default handler