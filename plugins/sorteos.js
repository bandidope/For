const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const MARCA = 'For Three Bot 🌀'
const Emojis = ['🟥', '🟦', '🟩', '🟨', '🟪', '🟧', '🟫', '⬛']

const parseArgs = (texto) => {
    const regex = /"([^"]+)"|(\S+)/g;
    let match;
    let nombres = [];
    while ((match = regex.exec(texto))!== null) {
        nombres.push(match[1] || match[2]);
    }
    return [...new Set(nombres.filter(v => v))];
}

let handler = async (m, { conn, args, command, isAdmin }) => {
    if (!isAdmin) return m.reply(`❌ *Solo admins*\n${MARCA}`)

    // DB 100% segura dentro del handler
    if (!global.db.data) global.db.data = {}
    if (!global.db.data.sorteos) global.db.data.sorteos = {}
    let db = global.db.data.sorteos
    
    let chat = m.chat
    db[chat]??= []

    let texto = args.join(' ').trim()

    switch (command) {
        case 'addrl': {
            if (!texto) return m.reply(`ꕤ *Uso:*.addrl Juan "Pedro Lopez"\n${MARCA}`)
            let nombres = parseArgs(texto)
            let agregados = nombres.filter(n =>!db[chat].some(v => v.toLowerCase() === n.toLowerCase()))
            db[chat].push(...agregados)
            if (agregados.length === 0) return m.reply(`⚠️ Todos ya estaban\n${MARCA}`)
            let lista = db[chat].map((v,i) => `${Emojis[i % 8]} ${v}`).join('\n')
            m.reply(`✅ *Agregados:* ${agregados.join(', ')}\n\n╭━━〔 *🎡 SORTEOS* 〕━━┈⊷\n${lista}\n╰ *Total:* ${db[chat].length}\n\n${MARCA}`)
        }
        break
        case 'delrl': {
            if (!texto) return m.reply(`ꕤ *Uso:*.delrl Nombre\n${MARCA}`)
            let antes = db[chat].length
            db[chat] = db[chat].filter(v => v.toLowerCase()!== texto.toLowerCase())
            if (db[chat].length === antes) return m.reply(`⚠️ ${texto} no está\n${MARCA}`)
            m.reply(`🗑️ *Quitado:* ${texto}\n*Restantes:* ${db[chat].length}\n\n${MARCA}`)
        }
        break
        case 'listrl': {
            if (db[chat].length === 0) return m.reply(`🧹 Vacío\n${MARCA}`)
            let lista = db[chat].map((v,i) => `${Emojis[i % 8]} ${v}`).join('\n')
            m.reply(`╭━━〔 *🎡 PARTICIPANTES* 〕━━┈⊷\n${lista}\n╰ *Total:* ${db[chat].length}\n\n${MARCA}`)
        }
        break
        case 'spinrl': {
            if (db[chat].length < 2) return m.reply(`❌ *Mínimo 2*\n${MARCA}`)
            let ruletaVisual = db[chat].map((v,i) => `${Emojis[i % 8]} ${v}`).join('\n')
            await conn.reply(m.chat, `🎡 *Girando...*\n\n${ruletaVisual}\n\n${MARCA}`, m)
            await delay(2500)
            let idx = Math.floor(Math.random() * db[chat].length)
            let ganador = db[chat].splice(idx, 1)[0]
            m.reply(`╭━━〔 *🎯 GANADOR* 〕━━┈⊷\n┃\n┃ 🏆 *${ganador}*\n┃\n┃ Restantes: ${db[chat].length}\n╰━━━━━━━━━━┈⊷\n\n${MARCA}`)
        }
        break
        case 'clearrl': {
            db[chat] = []
            m.reply(`🧹 *Borrado.*\n\n${MARCA}`)
        }
        break
    }
}

handler.help = ['addrl', 'delrl', 'listrl', 'spinrl', 'clearrl']
handler.tags = ['sorteos'] // <-- CATEGORÍA
handler.command = /^(addrl|delrl|listrl|spinrl|clearrl)$/i
handler.admin = true
export default handler