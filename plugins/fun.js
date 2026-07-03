let handler = async (m, { conn, usedPrefix, command, text }) => {

// ANTI-SPAM 3 SEG
if (global.cooldown == undefined) global.cooldown = {}
if (global.cooldown[m.sender] && Date.now() - global.cooldown[m.sender] < 3000)
    return m.reply('Espera 3 segundos 🌀')
global.cooldown[m.sender] = Date.now()

if (command == 'vibra') {
    let vibra = ['😈 Diabólico', '😇 Angelical', '🤓 Nerd PRO', '😎 Crack', '🤡 Rey del humor', '😴 Zzz', '🥶 Serio', '💀 Tóxico']
    let res = vibra[Math.floor(Math.random() * vibra.length)]
    return m.reply(`*ANALIZANDO TU VIBRA...* 🌀\n\n@${m.sender.split('@')[0]} eres: *${res}*\nNivel: ${Math.floor(Math.random()*100)}%`, null, { mentions: [m.sender] })
}

else if (command == 'frase') {
    let frases = [
        "El código sin café es como bot sin host",
        "Si no funciona, reinícialo. Si funciona, no lo toques",
        "Dormir es para los bots débiles",
        "Un bug al día mantiene al programador vivo",
        "Yapear es de pros 👑",
        "FOR THREE no falla, el que falla es el host"
    ]
    let frase = frases[Math.floor(Math.random() * frases.length)]
    return m.reply(`*FRASE DE WHOIS* 👑\n\n"${frase}"`)
}

else if (command == 'suerte') {
    let premios = [
        'Bot Personalizado 🌀', 'Bot para Grupo VIP 👑', 'Comando a tu gusto ⚡',
        '10 soles al yape 💸', 'Nada 😢 Suerte para la próxima'
    ]
    let premio = premios[Math.floor(Math.random() * premios.length)]
    return m.reply(`*RULETA FOR THREE* 🎰\n\n@${m.sender.split('@')[0]} te tocó: *${premio}*\n\nSi ganaste algo escríbeme: wa.me/51936994155`, null, { mentions: [m.sender] })
}

else if (command == 'coquetea') {
    let piropos = ['Eres más lindo que mi código sin bugs 😏', 'Si fueras error, yo te debugueo toda la noche', 'Tu número o te hago spam con piropos']
    let p = piropos[Math.floor(Math.random() * piropos.length)]
    return m.reply(`*COQUETEO FOR THREE* 💘\n\n@${m.sender.split('@')[0]} ${p}`, null, { mentions: [m.sender] })
}

else if (command == 'insulta') {
    let insultos = ['Eres más lento que internet de claro', 'Tu cerebro tiene menos ram que mi bot', 'Hasta el bot de al lado programa mejor']
    let i = insultos[Math.floor(Math.random() * insultos.length)]
    return m.reply(`*INSULTO FOR THREE* 💀\n\n@${m.sender.split('@')[0]} ${i}`, null, { mentions: [m.sender] })
}

}
handler.help = ['vibra','frase','suerte','coquetea','insulta']
handler.tags = ['fun']
handler.command = ['vibra','frase','suerte','coquetea','insulta']
export default handler