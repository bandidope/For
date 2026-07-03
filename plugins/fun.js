let handler = async (m, { conn, usedPrefix, command, text }) => {

if (command == 'vibra') {
    let vibra = ['😈 Diabólico', '😇 Angelical', '🤓 Nerd', '😎 Pro', '🤡 Chistoso', '😴 Dormilón']
    let res = vibra[Math.floor(Math.random() * vibra.length)]
    m.reply(`*ANALIZANDO TU VIBRA...* 🌀\n\n@${m.sender.split('@')[0]} eres: *${res}*`, null, { mentions: [m.sender] })
}

if (command == 'frase') {
    let frases = [
        "El código sin café es como bot sin host",
        "Si no funciona, reinícialo. Si funciona, no lo toques",
        "Dormir es para los bots débiles"
    ]
    let frase = frases[Math.floor(Math.random() * frases.length)]
    m.reply(`*FRASE DE WHOIS* 👑\n\n"${frase}"`)
}

if (command == 'suerte') {
    let premios = ['Bot Personalizado 🌀', 'Bot para Grupo VIP 👑', 'Comando a tu gusto ⚡', 'Nada 😢 Suerte para la próxima']
    let premio = premios[Math.floor(Math.random() * premios.length)]
    m.reply(`*RULETA FOR THREE* 🎰\n\n@${m.sender.split('@')[0]} te tocó: *${premio}*\n\nSi ganaste algo escríbeme: wa.me/51936994155`, null, { mentions: [m.sender] })
}

if (command == 'nota') {
    global.notas = global.notas || {}
    if (!text) return m.reply(`*BLOC DE NOTAS* 📝\n.nota guardar [texto]\n.nota ver\n.nota borrar`)
    let [tipo,...txt] = text.split(' ')
    txt = txt.join(' ')
    if (tipo == 'guardar') { global.notas[m.sender] = txt; m.reply(`✅ Guardado: "${txt}"`) }
    if (tipo == 'ver') m.reply(`📝 Tu nota: "${global.notas[m.sender] || 'Vacía'}"`)
    if (tipo == 'borrar') { delete global.notas[m.sender]; m.reply(`🗑️ Borrado`) }
}

}
handler.help = ['vibra','frase','suerte','nota']
handler.tags = ['for-three']
handler.command = ['vibra','frase','suerte','nota']
export default handler