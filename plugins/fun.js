let handler = async (m, { conn, usedPrefix, command, text }) => {

// ANTI-SPAM 3 SEG
if (global.cooldown == undefined) global.cooldown = {}
if (global.cooldown[m.sender] && Date.now() - global.cooldown[m.sender] < 3000)
    return m.reply('Espera 3 segundos 🌀')
global.cooldown[m.sender] = Date.now()

// Función para agarrar random
async function getRandomUser() {
    if (!m.isGroup) return m.sender
    let miembros = (await conn.groupMetadata(m.chat)).participants.filter(v => v.id!= conn.user.jid)
    if (miembros.length == 0) return m.sender
    return miembros[Math.floor(Math.random() * miembros.length)].id
}

if (command == 'vibra') {
    let target = await getRandomUser()
    let vibra = ['😈 Diabólico', '😇 Angelical', '🤓 Nerd PRO', '😎 Crack', '🤡 Rey del humor', '😴 Zzz', '🥶 Serio', '💀 Tóxico']
    let res = vibra[Math.floor(Math.random() * vibra.length)]
    return m.reply(`*ANALIZANDO TU VIBRA...* 🌀\n\n@${target.split('@')[0]} eres: *${res}*\nNivel: ${Math.floor(Math.random()*100)}%`, null, { mentions: [target] })
}

else if (command == 'suerte') {
    let target = await getRandomUser()
    let premios = [
        'Bot Personalizado 🌀', 'Bot para Grupo VIP 👑', 'Comando a tu gusto ⚡',
        '10 soles al yape 💸', 'Nada 😢 Suerte para la próxima'
    ]
    let premio = premios[Math.floor(Math.random() * premios.length)]
    return m.reply(`*RULETA FOR THREE* 🎰\n\n@${target.split('@')[0]} te tocó: *${premio}*\n\nSi ganaste algo escríbeme: wa.me/51936994155`, null, { mentions: [target] })
}

else if (command == 'coquetea') {
    let target = await getRandomUser()
    let piropos = [
        'Si la belleza fuera delito, tú tendrías cadena perpetua 😏',
        'No soy fotógrafo pero me imagino contigo en mi futuro',
        'Me caes bien... ¿y si nos caemos bien juntos? 💘',
        '¿Crees en amor a primera vista o paso otra vez? 👀',
        'Eres el error 404... porque no te encuentro en mi vida todavía'
    ]
    let p = piropos[Math.floor(Math.random() * piropos.length)]
    return m.reply(`*COQUETEO FOR THREE* 💘\n\n@${target.split('@')[0]} ${p}`, null, { mentions: [target] })
}

else if (command == 'insulta') {
    let target = await getRandomUser()
    let insultos = [
        'Tienes cara de que te abandonaron en el menú de configuración',
        'Si la estupidez doliera, andarías gritando todo el día',
        'Eres tan inútil que ni para estorbar sirves',
        'Tu IQ es tan bajo que se ahoga en un vaso de agua',
        'Pareces error de sistema: nadie te quiere y todos te reinician'
    ]
    let i = insultos[Math.floor(Math.random() * insultos.length)]
    return m.reply(`*INSULTO FOR THREE* 💀\n\n@${target.split('@')[0]} ${i}`, null, { mentions: [target] })
}

}
handler.help = ['vibra','suerte','coquetea','insulta']
handler.tags = ['for-three']
handler.command = ['vibra','suerte','coquetea','insulta']
export default handler