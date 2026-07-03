// COMANDOS ORIGINALES FOR THREE 🌀
let handler = async (m, { conn, usedPrefix, command, text }) => {

    // 1. .vibra - Detector de Vibra
    if (command == 'vibra') {
        let vibra = ['😈 Diabólico', '😇 Angelical', '🤓 Nerd', '😎 Pro', '🤡 Chistoso', '😴 Dormilón', '🥶 Serio', '🤠 Locaso']
        let res = vibra[Math.floor(Math.random() * vibra.length)]
        m.reply(`*ANALIZANDO TU VIBRA...* 🌀\n\n@${m.sender.split('@')[0]} eres: *${res}*`, null, { mentions: [m.sender] })
    }

    // 2. .frase - Frase del día de Whois
    if (command == 'frase') {
        let frases = [
            "El código sin café es como bot sin host",
            "Si no funciona, reinícialo. Si funciona, no lo toques",
            "Dormir es para los bots débiles",
            "Un bug al día mantiene al programador vivo",
            "Yapear es de pros"
        ]
        let frase = frases[Math.floor(Math.random() * frases.length)]
        m.reply(`*FRASE DE WHOIS* 👑\n\n"${frase}"`)
    }

    // 3. .suerte - Ruleta de Yape
    if (command == 'suerte') {
    let premios = [
        'Bot Personalizado 🌀',
        'Bot para Grupo VIP 👑', 
        'Comando a tu gusto ⚡',
        'Nada 😢 Suerte para la próxima'
    ]
    let premio = premios[Math.floor(Math.random() * premios.length)]
    m.reply(`*RULETA FOR THREE* 🎰\n\n@${m.sender.split('@')[0]} te tocó: *${premio}*\n\nSi ganaste algo escríbeme para reclamar: wa.me/51936994155`, null, { mentions: [m.sender] })
}

    // 4. .nota - Bloc de notas del bot
    if (command == 'nota') {
        global.notas = global.notas || {}
        if (!text) return m.reply(`*BLOC DE NOTAS* 📝\n\nUso:\n.nota guardar [texto]\n.nota ver\n.nota borrar`)
        
        let [tipo, ...txt] = text.split(' ')
        txt = txt.join(' ')
        
        if (tipo == 'guardar') {
            if (!txt) return m.reply('Escribe algo para guardar')
            global.notas[m.sender] = txt
            m.reply(`✅ Nota guardada: "${txt}"`)
        }
        if (tipo == 'ver') {
            let nota = global.notas[m.sender] || 'Vacía'
            m.reply(`📝 *Tu nota:*\n"${nota}"`)
        }
        if (tipo == 'borrar') { 
            delete global.notas[m.sender]
            m.reply(`🗑️ Nota borrada`) 
        }
    }


handler.help = ['vibra', 'frase', 'suerte', 'nota']
handler.tags = ['fun']
handler.command = ['vibra', 'frase', 'suerte', 'nota']
export default handler