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

else if (command == 'suerte') {
    let premios = [
        'Bot Personalizado 🌀', 'Bot para Grupo VIP 👑',
        ''Nada 😢 Suerte para la próxima'
    ]
    let premio = premios[Math.floor(Math.random() * premios.length)]
    return m.reply(`*RULETA FOR THREE* 🎰\n\n@${m.sender.split('@')[0]} te tocó: *${premio}*\n\nSi ganaste algo escríbeme: wa.me/51936994155`, null, { mentions: [m.sender] })
}

else if (command == 'coquetea') {
    let piropos = [
        'Si la belleza fuera delito, tú tendrías cadena perpetua 😏',
        'No soy fotógrafo pero me imagino contigo en mi futuro',
        'Me caes bien... ¿y si nos caemos bien juntos? 💘',
        '¿Crees en amor a primera vista o paso otra vez? 👀',
        'Eres el error 404... porque no te encuentro en mi vida todavía'
    ]
    let p = piropos[Math.floor(Math.random() * piropos.length)]
    return m.reply(`*COQUETEO FOR THREE* 💘\n\n@${m.sender.split('@')[0]} ${p}`, null, { mentions: [m.sender] })
}

else if (command == 'insulta') {
    let insultos = [
        'Tienes cara de que te abandonaron en el menú de configuración',
        'Si la estupidez doliera, andarías gritando todo el día',
        'Eres tan inútil que ni para estorbar sirves',
        'Tu IQ es tan bajo que se ahoga en un vaso de agua',
        'Pareces error de sistema: nadie te quiere y todos te reinician'
    ]
    let i = insultos[Math.floor(Math.random() * insultos.length)]
    return m.reply(`*INSULTO FOR THREE* 💀\n\n@${m.sender.split('@')[0]} ${i}`, null, { mentions: [m.sender] })
}

}
handler.help = ['vibra','suerte','coquetea','insulta']
handler.tags = ['for-three']
handler.command = ['vibra','suerte','coquetea','insulta']
export default handler