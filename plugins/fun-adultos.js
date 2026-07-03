let handler = async (m, { conn, usedPrefix, command }) => {
    let who = m.mentionedJid[0] || m.sender

    if (command == 'violar') {
        if (!m.mentionedJid[0]) return m.reply(`Menciona a quien 😈\nEjemplo: ${usedPrefix}violar @tag`)
        let lugares = ['en el baño', 'en la cocina', 'en el parque', 'en el cuarto', 'en el carro', 'en la ducha']
        let lugar = lugares[Math.floor(Math.random() * lugares.length)]
        let texto = `😈 @${m.sender.split('@')[0]} violó a @${who.split('@')[0]} ${lugar}`
        return conn.reply(m.chat, texto, m, { mentions: [m.sender, who] })
    }

    if (command == 'follar') {
        if (!m.mentionedJid[0]) return m.reply(`Menciona a alguien 😏\nEjemplo: ${usedPrefix}follar @tag`)
        if (who == m.sender) return m.reply('Automamada no cuenta')
        let pos = ['perrito', 'misionero', 'vaquera', '69', 'de ladito', 'contra la pared']
        let posicion = pos[Math.floor(Math.random() * pos.length)]
        let texto = `🔥 @${m.sender.split('@')[0]} se está follando a @${who.split('@')[0]} en posición *${posicion}* 🔥`
        return conn.reply(m.chat, texto, m, { mentions: [m.sender, who] })
    }

    if (command == 'nalgada') {
        if (!m.mentionedJid[0]) return m.reply(`Menciona a quien nalguear 🍑\nEjemplo: ${usedPrefix}nalgada @tag`)
        let texto = `👋 *PAM!* @${m.sender.split('@')[0]} le dio una nalgada a @${who.split('@')[0]}`
        return conn.reply(m.chat, texto, m, { mentions: [m.sender, who] })
    }

    if (command == 'lamer') {
        if (!m.mentionedJid[0]) return m.reply(`Menciona a quien lamer 👅\nEjemplo: ${usedPrefix}lamer @tag`)
        let partes = ['el cuello', 'las orejas', 'la panza', 'los pies', 'todo el cuerpo']
        let parte = partes[Math.floor(Math.random() * partes.length)]
        let texto = `👅 @${m.sender.split('@')[0]} le está lamiendo ${parte} a @${who.split('@')[0]}`
        return conn.reply(m.chat, texto, m, { mentions: [m.sender, who] })
    }

    if (command == 'chupar') {
        if (!m.mentionedJid[0]) return m.reply(`Menciona a quien 😏\nEjemplo: ${usedPrefix}chupar @tag`)
        let texto = `😏 @${m.sender.split('@')[0]} le está chupando a @${who.split('@')[0]}`
        return conn.reply(m.chat, texto, m, { mentions: [m.sender, who] })
    }

    if (command == 'mamar') {
        if (!m.mentionedJid[0]) return m.reply(`Menciona a quien 😈\nEjemplo: ${usedPrefix}mamar @tag`)
        let texto = `🤤 @${m.sender.split('@')[0]} le está mamando a @${who.split('@')[0]}`
        return conn.reply(m.chat, texto, m, { mentions: [m.sender, who] })
    }

    if (command == 'tetas') {
        let size = Math.floor(Math.random() * 100)
        let copa = size > 80? 'Copa G 🍒🍒' : size > 60? 'Copa D 🍒' : size > 40? 'Copa B' : 'Copa A'
        let texto = `🍒 *MEDIDOR DE TETAS* 🍒\n\n@${who.split('@')[0]}\nTamaño: ${size}%\n${copa}`
        return conn.reply(m.chat, texto, m, { mentions: [who] })
    }

    if (command == 'pene') {
        let size = Math.floor(Math.random() * 30) + 1
        let barra = '═'.repeat(size) + 'D'
        let texto = `📏 *MEDIDOR DE PENE* 📏\n\n@${who.split('@')[0]}\n8${barra}\n${size} cm`
        return conn.reply(m.chat, texto, m, { mentions: [who] })
    }

    if (command == 'culo') {
        let size = Math.floor(Math.random() * 100)
        let tipo = size > 80? 'Culote 🍑🍑' : size > 50? 'Buen culo 🍑' : 'Tabla de planchar'
        let texto = `🍑 *MEDIDOR DE CULO* 🍑\n\n@${who.split('@')[0]}\n${tipo}\n${size}%`
        return conn.reply(m.chat, texto, m, { mentions: [who] })
    }

    if (command == 'caliente') {
        let cal = Math.floor(Math.random() * 100)
        let barra = '🔥'.repeat(Math.floor(cal/10)) + '🧊'.repeat(10 - Math.floor(cal/10))
        let texto = `🥵 *NIVEL DE CALIENTE* 🥵\n\n@${who.split('@')[0]}\n[${barra}] ${cal}%`
        return conn.reply(m.chat, texto, m, { mentions: [who] })
    }
}

handler.help = [
    'violar @tag',
    'follar @tag',
    'nalgada @tag',
    'lamer @tag',
    'chupar @tag',
    'mamar @tag',
    'tetas @tag',
    'pene @tag',
    'culo @tag',
    'caliente @tag'
]
handler.tags = ['fun']
handler.command = ['violar', 'follar', 'nalgada', 'lamer', 'chupar', 'mamar', 'tetas', 'pene', 'culo', 'caliente']
export default handler