let handler = async (m, { conn, args, isAdmin, isOwner }) => {
  let chat = m.chat

  // 1. CREAR DB A LA FUERZA SI FALTA ALGO
  global.db.data.lista ||= {}
  global.db.data.lista ||= {
    lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [], extra: []
  }
  let db = global.db.data.lista

  let tz = 'America/Lima'
  let dia = new Date().toLocaleString('es-PE', { timeZone: tz, weekday: 'long' }).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  let esDomingo = dia === 'domingo'

  let op = args[0]?.toLowerCase()

  if (!op) return m.reply(`*LISTA BOT*\nHoy: *${esDomingo? 'DOMINGO' : dia.toUpperCase()}*\n\n.lista add N | # | Premio\n.lista ver\n.lista reset`)

  if (op === 'ver') {
    let texto = `📋 *LISTA SEMANAL*\n\n`
    for (let d of ['lunes','martes','miercoles','jueves','viernes','sabado','extra']) {
      texto += `*${d.toUpperCase()}* [${db[d].length}]\n`
      texto += db[d].length? db[d].map(i => `# ${i.n} | ${i.num} | ${i.p} ${i.tag}`).join('\n') + '\n\n' : '> Vacío\n'
    }
    return m.reply(texto.trim())
  }

  if (op === 'reset') {
    if (!isAdmin &&!isOwner) return m.reply('❌ Solo admins')
    args[1] === 'extra'? db.extra = [] : ['lunes','martes','miercoles','jueves','viernes','sabado'].forEach(d => db[d] = [])
    global.db.write()
    return m.reply(args[1] === 'extra'? '🗑️ EXTRA borrado' : '🗑️ Semana borrada')
  }

  if (op === 'add') {
    let [n, num, p, ex] = args.slice(1).join(' ').split('|').map(v => v.trim())
    if (!n ||!num ||!p) return m.reply('Mal:.lista add N | # | P')
    let g = ex?.toLowerCase() === 'extra'? 'extra' : (esDomingo? 'extra' : dia)
    let t = g === 'extra'? (esDomingo? '🛒' : '📦') : '✅'
    db[g].push({n, num, p, tag: t})
    global.db.write()
    return m.reply(`${esDomingo? '⚠️ DOMINGO\n' : ''}${t} *${g.toUpperCase()}*\n# ${n} | ${num} | ${p}`)
  }
}

handler.command = ['lista']
handler.group = true
handler.admin = true
export default handler