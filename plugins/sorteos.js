// RULETA v3.0 CASINO - FOR THREE 
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

let handler = async (m, { conn, args, command, isAdmin }) => {
    if (!isAdmin) return m.reply('❌ Solo admins')

    // DB Blindada
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
            if (!agregados.length) return m.reply('⚠️ Todos ya estaban')
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
            if (db.length === antes) return m.reply('⚠️ Ninguno estaba')
            return m.reply(`🗑️ -${antes - db.length} | Restantes: ${db.length}`)
        }
        case 'spinrl': {
            if (db.length < 2) return m.reply('❌ Mínimo 2')

            // ANIMACIÓN PRO CASINO
            let msg = await conn.sendMessage(m.chat, { text: `🎡 *GIRANDO LA RULETA...*` }, { quoted: m })
            let frames = 15 // Cuántas vueltas da
            for (let i = 0; i < frames; i++) {
                let shuffle = [...db].sort(() => 0.5 - Math.random()).slice(0, 5).join(' | ')
                await conn.editMessage(m.chat, msg.key, { text: `🎡 *GIRANDO...*\n\n${shuffle}` })
                await delay(120 + i * 15) // Se va frenando poco a poco
            }
            
            let ganador = db[Math.floor(Math.random() * db.length)] // No se borra
            return await conn.editMessage(m.chat, msg.key, { text: `🎯 *SE DETUVO*\n\n🏆 *GANADOR: ${ganador}*\n\nTotal: ${db.length}` })
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