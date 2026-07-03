// LISTA v1.2 - CON AVISO DOMINGO - FOR THREE CLEAN
const TZ = 'America/Lima'
const IMG_FALLBACK = 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png'
const DIAS = ['lunes','martes','miercoles','jueves','viernes','sabado']
const ALL = [...DIAS, 'extra']
const TAG = {lunes:'✅',martes:'✅',miercoles:'✅',jueves:'✅',viernes:'✅',sabado:'✅',extra:'📦',domingo:'🛒'}

const getDB = (chatId) => {
  global.db.data.listaV2 ||= {}
  global.db.data.listaV2[chatId] ||= Object.fromEntries(ALL.map(d => [d, []]))
  return global.db.data.listaV2[chatId]
}

const hoyInfo = () => {
  let d = new Date().toLocaleString('es-PE', { timeZone: TZ, weekday: 'long' }).toLowerCase()
  d = d.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  let esDomingo = d === 'domingo'
  return {
    diaDB: esDomingo? 'extra' : d,
    esDomingo
  }
}

let handler = async (m, { conn, args, isAdmin, isOwner }) => {
  let db = getDB(m.chat)
  let op = args[0]?.toLowerCase()
  let { diaDB, esDomingo } = hoyInfo()

  if (!op) return m.reply(
`📋 *LISTA BOT* | Hoy: *${esDomingo? 'DOMINGO' : diaDB.toUpperCase()}*
.lista add Nombre | Numero | Premio [| extra]
.lista ver
.lista reset -> Borra L-S
.lista reset extra -> Borra EXTRA`
  )

  // VER
  if (op === 'ver') {
    let txt = `📋 *LISTA SEMANAL*\n»————————«\n`
    for (let d of ALL) {
      txt += `\n*${d.toUpperCase()}* [${db[d].length}]\n`
      txt += db[d].length? db[d].map(x => `# ${x.n} | ${x.num} | ${x.p} ${x.tag}`).join('\n') : `> Vacío`
    }
    let img = IMG_FALLBACK
    try { img = await conn.profilePictureUrl(m.chat, 'image') } catch {}
    return conn.sendMessage(m.chat, { image: { url: img }, caption: txt }, { quoted: m }).catch(() => m.reply(txt))
  }

  // RESET = BORRAR
  if (op === 'reset') {
    if (!isAdmin &&!isOwner) return m.reply('❌ Solo admins')
    let target = args[1] === 'extra'? ['extra'] : DIAS
    target.forEach(d => db[d] = [])
    await global.db.write().catch(()=>{})
    return m.reply(`🗑️ Reset: *${target.join(', ').toUpperCase()}*`)
  }

  // ADD = ANOTAR CON AVISO SI ES DOMINGO
  if (op === 'add') {
    let raw = args.slice(1).join(' ')
    if (!raw.includes('|')) return m.reply('Formato:.lista add Nombre | Numero | Premio [| extra]')
    let [n, num, p, forzado] = raw.split('|').map(v => v.trim())
    if (!n ||!num ||!p) return m.reply('Faltan datos')

    let dia = forzado?.toLowerCase() === 'extra'? 'extra' : diaDB
    let tag = dia === 'extra'? (esDomingo? TAG.domingo : TAG.extra) : TAG[dia]

    db[dia].push({ n, num, p, tag })
    await global.db.write().catch(()=>{})

    let aviso = esDomingo? `⚠️ *Es DOMINGO - Día de Ventas*\nSe guardó en EXTRA automático 🛒\n\n` : ''
    return m.reply(`${aviso}${tag} *${dia.toUpperCase()}*\n# ${n} | ${num} | ${p}`)
  }
}

handler.help = ['lista']
handler.tags = ['main']
handler.command = /^lista$/i
handler.group = true
handler.admin = true
export default handler