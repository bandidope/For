let handler = async (m, { conn, args, command, isAdmin, isOwner }) => {
    let chat = m.chat
    
    // INICIALIZAR DB POR GRUPO
    global.db.data.lista = global.db.data.lista || {}
    if (!global.db.data.lista) global.db.data.lista = {
        lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [], extra: []
    }

    let db = global.db.data.lista

    // HORA Y DIA DE LIMA
    let tz = 'America/Lima'
    let now = new Date()
    let dia = now.toLocaleString('es-PE', { timeZone: tz, weekday: 'long' }).toLowerCase()
    dia = dia.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quitar tildes
    let hora = now.toLocaleString('es-PE', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true })
    
    let esDomingo = dia === 'domingo'
    let diaGuardar = esDomingo ? 'extra' : dia

    // COMANDO .VER
    if (command === 'ver') {
        let nombreGrupo = await conn.getName(chat).catch(_ => 'Este grupo')
        let texto = `📋 *LISTA SEMANAL*\n*Grupo:* ${nombreGrupo}\n*Hoy:* ${esDomingo ? 'DOMINGO' : dia.toUpperCase()} | ${hora}\n\n`
        let total = 0
        
        for (let d of ['lunes','martes','miercoles','jueves','viernes','sabado','extra']) {
            total += db[d].length
            texto += `*${d.toUpperCase()}* [${db[d].length}]\n`
            if (db[d].length === 0) {
                texto += `> Vacío\n`
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

    // COMANDO .RESET SOLO ADMINS
    if (command === 'reset') {
        if (!isAdmin && !isOwner) return m.reply('❌ *Solo Admins pueden usar este comando*')
        
        if (args[0] === 'extra') {
            db.extra = []
            await global.db.write()
            return m.reply('🗑️ *EXTRA borrado por un Admin*')
        } else {
            for (let d of ['lunes','martes','miercoles','jueves','viernes','sabado']) db[d] = []
            await global.db.write()
            return m.reply('🗑️ *Lunes a Sábado borrado por un Admin*\nEXTRA sigue intacto.\nUsa `.reset extra` para borrarlo')
        }
    }

    // COMANDO .LISTA
    let juntar = args.join(' ')
    let sep = juntar.split('|').map(v => v.trim())
    let [nombre, numero, premio, extra] = sep

    if (!nombre || !numero || !premio) {
        return m.reply(`❌ *Formato incorrecto*

*USO:*
.lista Nombre | Numero | Premio
.lista Nombre | Numero | Premio | extra

*OTROS:*
.ver - Ver lista completa
.reset - Borrar lista *Solo Admins*`)
    }

    // DECIDIR DONDE GUARDAR
    let guardarEn = (extra && extra.toLowerCase() === 'extra') ? 'extra' : diaGuardar
    let tag = guardarEn === 'extra' ? (esDomingo ? '🛒' : '📦') : '✅'

    // GUARDAR
    db[guardarEn].push({
        nombre: nombre,
        numero: numero, 
        premio: premio,
        hora: hora,
        tag: tag
    })
    await global.db.write()

    let aviso = esDomingo ? '⚠️ *DOMINGO - Día de Ventas*\nSe guardó en EXTRA 🛒\n\n' : ''
    return m.reply(`${aviso}${tag} *ANOTADO EN ${guardarEn.toUpperCase()}* a las ${hora}\n\n*${nombre}* | ${numero} | ${premio}`)
}

handler.help = ['lista', 'ver', 'reset']
handler.tags = ['sorteos']
handler.command = /^(lista|ver|reset)$/i
handler.group = true
export default handler