import fs from 'fs'
import path from 'path'

let dir = './database/listas' // carpeta nueva
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

let handler = async (m, { conn, args, command, isAdmin, isOwner }) => {
    let chat = m.chat
    let file = path.join(dir, `${chat}.json`) // 1 ARCHIVO POR GRUPO

    // LEER DB DEL GRUPO
    let db = { lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [], extra: [] }
    if (fs.existsSync(file)) {
        db = JSON.parse(fs.readFileSync(file))
    }

    // GUARDAR FUNCIÓN
    const save = () => fs.writeFileSync(file, JSON.stringify(db, null, 2))

    // HORA Y DIA LIMA
    let tz = 'America/Lima'
    let now = new Date()
    let dia = now.toLocaleString('es-PE', { timeZone: tz, weekday: 'long' }).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    let hora = now.toLocaleString('es-PE', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true })
    let esDomingo = dia === 'domingo'
    let diaGuardar = esDomingo? 'extra' : dia

    //.VER CON FOTO
    if (command === 'ver') {
        let nombreGrupo = await conn.getName(chat).catch(_ => 'Grupo')

        // DETECTAR FOTO DEL GRUPO
        let pp
        try { pp = await conn.profilePictureUrl(chat, 'image') }
        catch { pp = null }

        let texto = `📋 *LISTA SEMANAL*\n*Grupo:* ${nombreGrupo}\n*Hoy:* ${esDomingo? 'DOMINGO' : dia.toUpperCase()} | ${hora}\n\n`
        let total = 0
        for (let d of ['lunes','martes','miercoles','jueves','viernes','sabado','extra']) {
            total += db[d].length
            texto += `*${d.toUpperCase()}* [${db[d].length}]\n`
            if (db[d].length > 0) {
                texto += db[d].map(i => `${i.tag} ${i.nombre} | ${i.numero} | ${i.premio} | _${i.hora}_`).join('\n') + '\n\n'
            } else {
                texto += `> Vacío\n`
            }
        }
        texto += `*TOTAL ANOTADOS: ${total}*`

        // ENVIAR CON FOTO SI HAY
        if (pp) {
            return conn.sendMessage(chat, { image: { url: pp }, caption: texto.trim() })
        } else {
            return m.reply(texto.trim())
        }
    }

    //.RESET SOLO ADMINS
    if (command === 'reset') {
        if (!isAdmin &&!isOwner) return m.reply('❌ *Solo Admins*')
        if (args[0] === 'extra') {
            db.extra = []
        } else {
            ['lunes','martes','miercoles','jueves','viernes','sabado'].forEach(d => db[d] = [])
        }
        save()
        return m.reply(args[0] === 'extra'? '🗑️ *EXTRA borrado*' : '🗑️ *Semana borrada*. EXTRA sigue')
    }

    //.LISTA
    let [nombre, numero, premio, extra] = args.join(' ').split('|').map(v => v?.trim())
    if (!nombre ||!numero ||!premio) return m.reply(`❌ *Formato:*\n.lista Nombre | Numero | Premio\n.lista Nombre | Numero | Premio | extra\n.ver\n.reset`)

    let guardarEn = extra?.toLowerCase() === 'extra'? 'extra' : diaGuardar
    let tag = guardarEn === 'extra'? (esDomingo? '🛒' : '📦') : '✅'

    db[guardarEn].push({ nombre, numero, premio, hora, tag })
    save()

    return m.reply(`${esDomingo? '⚠️ *DOMINGO*\nSe guardó en EXTRA 🛒\n\n' : ''}${tag} *ANOTADO EN ${guardarEn.toUpperCase()}* a las ${hora}\n\n*${nombre}* | ${numero} | ${premio}`)
}

handler.command = /^(lista|ver|reset)$/i
handler.group = true
export default handler