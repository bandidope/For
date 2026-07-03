// RULETA v3.3 CLEAN + CONTEO - FOR THREE 
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

let handler = async (m, { conn, args, command, isAdmin }) => {
    if (!isAdmin) return m.reply('❌ Solo admins')

    global.db.data.sorteos ||= {}
    global.db.data.sorteos[m.chat] ||= []
    let db = global.db.data.sorteos[m.chat]

    let texto = args.join(' ').trim()
    let nombres = texto ? [...new Set(texto.match(/"([^"]+)"|(\S+)/g)?.map(v => v.replace(/"/g, '')) || [])] : []

    switch (command) {
        case 'addrl': {
            if (!nombres.length) return m.reply('Uso:.addrl Juan "Ana Lopez"')
            let agregados = nombres.filter(n =>!db.includes(n))
            db.push(...agregados)
            return m.reply(`✅ +${agregados.length} | Total: ${db.length}\n\n${db.map((v,i)=>`${i+1}. ${v}`).join('\n')}`)
        }
        case 'listrl': {
            if (!db.length) return m.reply('🧹 Vacío')
            return m.reply(`🎡 *Participantes [${db.length}]*\n\n${db.map((v,i)=>`${i+1}. ${v}`).join('\n')}`)
        }
        case 'delrl': {
            if (!nombres.length) return m.reply('Uso:.delrl Juan Ana')
            let antes = db.length
            db = db.filter(v =>!nombres.some(n => n.toLowerCase() === v.toLowerCase()))
            return m.reply(`🗑️ -${antes - db.length} | Restantes: ${db.length}`)
        }
        case 'spinrl': {
            if (db.length < 2) return m.reply('❌ Mínimo 2')

            // SOLO CONTEO EPICO
            await m.reply(`🎡 *RULETA EN 3...*`)
            await delay(800)
            await m.reply(`*2...*`)
            await delay(800)
            await m.reply(`*1...*`)
            await delay(800)
            
            let ganador = db[Math.floor(Math.random() * db.length)]
            return m.reply(`🎯 *GIRA!*\n\n🏆 *GANADOR: ${ganador}*\n\nTotal: ${db.length}`)
        }
        case 'clearrl': {
            db.splice(0, db.length)
            return m.reply('🧹 Lista borrada')
        }
    }
}

handler.help = ['addrl', 'delrl', 'listrl', 'spinrl', 'clearrl']
handler.tags = ['sorteos']
handler.command = /^(addrl|delrl|listrl|spinrl|clearrl)$/i
handler.admin = true
export default handler