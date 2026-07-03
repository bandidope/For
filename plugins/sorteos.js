// RULETA ULTRA SIMPLE - FOR THREE
const lista = new Map() // Guarda la lista por grupo

let handler = async (m, { conn, args, command, isAdmin }) => {
    if (!isAdmin) return m.reply('❌ Solo admins')

    let chat = m.chat
    if (!lista.has(chat)) lista.set(chat, [])
    let db = lista.get(chat)

    let texto = args.join(' ').trim()

    if (command === 'addrl') {
        if (!texto) return m.reply('Uso:.addrl Juan "Ana Lopez"')
        let nombres = [...new Set(texto.match(/"([^"]+)"|(\S+)/g).map(v => v.replace(/"/g, '')))]
        db.push(...nombres.filter(n =>!db.includes(n)))
        return m.reply(`✅ Agregados: ${nombres.join(', ')}\nTotal: ${db.length}\n\n${db.map((v,i)=>`${i+1}. ${v}`).join('\n')}`)
    }

    if (command === 'listrl') {
        if (db.length === 0) return m.reply('🧹 Vacío')
        return m.reply(`🎡 Participantes:\n\n${db.map((v,i)=>`${i+1}. ${v}`).join('\n')}`)
    }

    if (command === 'delrl') {
        if (!texto) return m.reply('Uso:.delrl Juan')
        let antes = db.length
        db = db.filter(v => v.toLowerCase()!== texto.toLowerCase())
        lista.set(chat, db)
        if (db.length === antes) return m.reply('⚠️ No estaba')
        return m.reply(`🗑️ Quitado: ${texto}\nRestantes: ${db.length}`)
    }

    if (command === 'spinrl') {
        if (db.length < 2) return m.reply('❌ Mínimo 2')
        await m.reply('🎡 Girando...')
        await new Promise(r => setTimeout(r, 2000))
        let ganador = db.splice(Math.floor(Math.random() * db.length), 1)[0]
        lista.set(chat, db)
        return m.reply(`🏆 GANADOR: *${ganador}*\nRestantes: ${db.length}`)
    }

    if (command === 'clearrl') {
        lista.set(chat, [])
        return m.reply('🧹 Borrado')
    }
}

handler.help = ['addrl', 'delrl', 'listrl', 'spinrl', 'clearrl']
handler.tags = ['sorteos']
handler.command = /^(addrl|delrl|listrl|spinrl|clearrl)$/i
handler.admin = true
export default handler