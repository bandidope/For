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
        '¿Crees en amor a primera vista o paso otra vez? 👀'
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
        'Tu IQ es tan bajo que se ahoga en un vaso de agua'
    ]
    let i = insultos[Math.floor(Math.random() * insultos.length)]
    return m.reply(`*INSULTO FOR THREE* 💀\n\n@${target.split('@')[0]} ${i}`, null, { mentions: [target] })
}

else if (command == 'bello') {
    let target = await getRandomUser()
    let porcentaje = Math.floor(Math.random() * 100)
    let texto = porcentaje > 90? 'Modelo de Victoria Secret' : porcentaje > 70? 'Bien guapo/a' : porcentaje > 50? 'Pasable' : 'Con esa cara apagas la luz'
    return m.reply(`*NIVEL DE BELLEZA* ✨\n\n@${target.split('@')[0]} tiene *${porcentaje}%* de belleza\n${texto}`, null, { mentions: [target] })
}

else if (command == 'feo') {
    let target = await getRandomUser()
    let porcentaje = Math.floor(Math.random() * 100)
    let texto = porcentaje > 80? 'Radioactivo' : porcentaje > 60? 'Mejor no prendas la cámara' : porcentaje > 40? 'Normalito' : 'Se salva'
    return m.reply(`*NIVEL DE FEALDAD* 💀\n\n@${target.split('@')[0]} tiene *${porcentaje}%* de feo\n${texto}`, null, { mentions: [target] })
}

else if (command == 'fiel') {
    let target = await getRandomUser()
    let porcentaje = Math.floor(Math.random() * 100)
    let texto = porcentaje > 80? 'Para casarse' : porcentaje > 50? 'Ahí nomás' : 'Te va a meter los cuernos'
    return m.reply(`*NIVEL DE FIDELIDAD* 💍\n\n@${target.split('@')[0]} es *${porcentaje}% FIEL*\n${texto}`, null, { mentions: [target] })
}

else if (command == 'activo') {
    let target = await getRandomUser()
    let porcentaje = Math.floor(Math.random() * 100)
    let texto = porcentaje > 80? 'No para ni durmiendo' : porcentaje > 50? 'Normal' : 'Puro modo zzz'
    return m.reply(`*NIVEL DE ACTIVIDAD* ⚡\n\n@${target.split('@')[0]} está *${porcentaje}% ACTIVO*\n${texto}`, null, { mentions: [target] })
}

else if (command == 'potencial') {
    let target = await getRandomUser()
    let porcentaje = Math.floor(Math.random() * 100)
    let texto = porcentaje > 80? 'Futuro millonario' : porcentaje > 50? 'Puede lograr algo' : 'F en el chat'
    return m.reply(`*POTENCIAL DE VIDA* 🚀\n\n@${target.split('@')[0]} tiene *${porcentaje}%* de potencial\n${texto}`, null, { mentions: [target] })
}

else if (command == 'naco') {
    let target = await getRandomUser()
    let porcentaje = Math.floor(Math.random() * 100)
    let texto = porcentaje > 80? 'Naco nivel dios: dice "haiga" y "naiden"' : porcentaje > 60? 'Bien naco' : porcentaje > 40? 'Medio naco' : 'Fino y elegante'
    return m.reply(`*NIVEL DE NACO* 🤠\n\n@${target.split('@')[0]} es *${porcentaje}% NACO*\n${texto}`, null, { mentions: [target] })
}

else if (command == 'pro') {
    let target = await getRandomUser()
    let porcentaje = Math.floor(Math.random() * 100)
    let texto = porcentaje > 80? 'Leyenda viviente' : porcentaje > 60? 'Bien pro' : porcentaje > 40? 'Más o menos' : 'Noob'
    return m.reply(`*NIVEL DE PRO* 🎮\n\n@${target.split('@')[0]} es *${porcentaje}% PRO*\n${texto}`, null, { mentions: [target] })
}

// ===== LOS NUEVOS =====
else if (command == 'inteligente') {
    let target = await getRandomUser()
    let porcentaje = Math.floor(Math.random() * 100)
    let texto = porcentaje > 80? 'Einstein reencarnado' : porcentaje > 60? 'Bien inteligente' : porcentaje > 40? 'Normal' : 'Le falta ácido fólico'
    return m.reply(`*NIVEL DE INTELIGENCIA* 🧠\n\n@${target.split('@')[0]} es *${porcentaje}% INTELIGENTE*\n${texto}`, null, { mentions: [target] })
}

else if (command == 'borracho') {
    let target = await getRandomUser()
    let porcentaje = Math.floor(Math.random() * 100)
    let texto = porcentaje > 80? 'Alcohólico profesional' : porcentaje > 60? 'Toma cada finde' : porcentaje > 40? 'Social nomás' : 'Ni una chela'
    return m.reply(`*NIVEL DE BORRACHO* 🍻\n\n@${target.split('@')[0]} es *${porcentaje}% BORRACHO*\n${texto}`, null, { mentions: [target] })
}

else if (command == 'enquesea') {
    let target = await getRandomUser()
    let cosas = ['Tiktoker', 'Gamer', 'Chismoso', 'Vago', 'Malandro', 'Simp', 'Ligador', 'Chef', 'Meme', 'Otaku']
    let cosa = cosas[Math.floor(Math.random() * cosas.length)]
    return m.reply(`*EN QUE SEA* 🤡\n\n@${target.split('@')[0]} es *${cosa} PROFESIONAL*\nCertificado por For Three 🌀`, null, { mentions: [target] })
}

else if (command == 'top3') {
    let miembros = (await conn.groupMetadata(m.chat)).participants.filter(v => v.id!= conn.user.jid)
    let randoms = []
    while(randoms.length < 3 && randoms.length < miembros.length) {
        let r = miembros[Math.floor(Math.random() * miembros.length)].id
        if(!randoms.includes(r)) randoms.push(r)
    }
    return m.reply(`*TOP 3 DEL GRUPO* 👑\n\n🥇 @${randoms[0]?.split('@')[0]}\n🥈 @${randoms[1]?.split('@')[0]}\n🥉 @${randoms[2]?.split('@')[0]}\n\nSegún mi análisis científico 🧠`, null, { mentions: randoms })
}

}
handler.help = ['vibra','suerte','coquetea','insulta','bello','feo','fiel','activo','potencial','naco','pro','inteligente','borracho','enquesea','top3']
handler.tags = ['fun']
handler.command = ['vibra','suerte','coquetea','insulta','bello','feo','fiel','activo','potencial','naco','pro','inteligente','borracho','enquesea','top3']
export default handler