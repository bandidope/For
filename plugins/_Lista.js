let handler = async (m, { conn, args, command, isAdmin, isOwner }) => {
    let chat = m.chat
    
    // 1. INICIALIZAR DB POR GRUPO - FORMA SEGURA
    global.db.data.lista = global.db.data.lista || {}
    global.db.data.lista = global.db.data.lista || {
        lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [], extra: []
    }
    let db = global.db.data.lista

    // 2. HORA Y DIA DE LIMA
    let tz = 'America/Lima'
    let now = new Date()
    let dia = now.toLocaleString('es-PE', { timeZone: tz, weekday: 'long' }).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    let hora = now.toLocaleString('es-PE', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true })
    
    let esDomingo = dia === 'domingo'
    let diaGuardar = esDomingo ? 'extra' : dia

    // 3. COMANDO .VER
    if (command === 'ver') {
        let nombreGrupo = await conn.getName(chat).catch(_ => 'Este grupo')
        let texto = `📋 *LISTA SEMANAL*\n*Grupo:* ${nombreGrupo}\n*Hoy:* ${esDomingo ? 'DOMINGO' : dia.toUpperCase()} | ${hora}\n\n`
        let total = 0
        
        for (let d of ['lunes','martes','miercoles','jueves','viernes','sabado','extra']) {
            total += db[d].length
            texto += `*${d.toUpperCase()}* [${db[d].length}]\n`
            if (db[d].length === 0) {
                texto += `> Vacío\n\n`
            } else {
                for (let i of db[d]) {
                    texto += `${i.tag} ${i.nombre} | ${i.numero} | ${i.premio} | _${i.hora}_\n`
                }
                texto += `\n`
            }
        }
        texto += `*TOTAL ANOTADOS: ${total}*`
        return m.reply(texto.trim())
    }

    // 4. COMANDO .RESET SOLO ADMINS
    if (command === 'reset') {
        if (!isAdmin && !isOwner) return m.reply('❌ *Solo Admins pueden usar este comando*')
        
        if (args[0] === 'extra') {
            db.extra = []
        } else {
            for (let d of ['lunes','martes','miercoles','jueves','viernes','sabado']) db[d] = []
        }
        await global.db.write()
        return m.reply(args[0] === 'extra' ? '🗑️ *EXTRA borrado*' : '🗑️ *Lunes a Sábado borrado*. EXTRA sigue')
    }

    // 5. COMANDO .LISTA
    let juntar = args.join(' ')
    let sep = juntar.split('|').map(v => v.trim())
    let [nombre, numero, premio, extra] = sep

    if (!nombre || !numero || !premio) {
        return m.reply(`❌ *Formato incorrecto*\n\n.lista Nombre | Numero | Premio\n.lista Nombre | Numero | Premio | extra\n.ver\n.reset *Solo Admins*`)
    }

    let guardarEn = (extra && extra.toLowerCase() === 'extra') ? 'extra' : diaGuardar
    let tag = guardarEn === 'extra' ? (esDomingo ? '🛒' : '📦') : '✅'

    db[guardarEn].push({ nombre, numero, premio, hora, tag })
    await global.db.write()

    let aviso = esDomingo ? '⚠️ *DOMINGO - Día de Ventas*\nSe guardó en EXTRA 🛒\n\n' : ''
    return m.reply(`${aviso}${tag} *ANOTADO EN ${guardarEn.toUpperCase()}* a las ${hora}\n\n*${nombre}* | ${numero} | ${premio}`)
}

handler.help = ['lista', 'ver', 'reset']
handler.tags = ['sorteos']
handler.command = /^(lista|ver|reset)$/i
handler.group = true
export default handler