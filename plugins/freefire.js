// 1. INFO DE PERFIL FF - MODO MANUAL
let ff = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`*Ejemplo:* ${usedPrefix + command} 12345678\n*Pega tu ID de FF y te doy tips para subir de rango*`)
    m.reply(`*🎮 BUSCANDO ID: ${text}*\n\n❌ No pude conectar con Garena\n*Pero te puedo ayudar con:*\n• .nombref - Generar nombre\n• .arma - Arma random\n• .kd kills muertes - Calcular K/D\n• .bioff - Frases para bio`)
}

// 2. GENERADOR DE NOMBRES FF
let nombref = async (m, { conn }) => {
    let prefijos = ['『', '★', '乂', '亗', '×', '꧁', '༄', '『FF』']
    let nombres = ['Sniper', 'Pro', 'Killer', 'Demon', 'Ghost', 'Legend', 'God', 'King', 'Boss', 'Destroyer']
    let sufijos = ['YT', 'PRO', 'FF', '『』', 'ツ', '࿐', '亗']
    let nick = `${prefijos[Math.floor(Math.random() * prefijos.length)]}${nombres[Math.floor(Math.random() * nombres.length)]}${sufijos[Math.floor(Math.random() * sufijos.length)]}`
    m.reply(`*Nombres para FF:*\n\n1. ${nick}\n2. ${nick.replace('★', '乂')}\n3. ${nick.replace('『', '꧁').replace('』', '꧂')}\n\nCopia y pégalo en FF ✨`)
}

// 3. RUEDA DE ARMAS
let arma = async (m, { conn }) => {
    let armas = ['M1887 💥', 'M82B 🎯', 'AWM 🔫', 'MP40 ⚡', 'SCAR 🔥', 'AK47 💀', 'GROZA 👑', 'M4A1 😈', 'UMP 💣', 'P90 🚀']
    let arma = armas[Math.floor(Math.random() * armas.length)]
    m.reply(`🔫 *Tu arma es:* ${arma}\n\nUsala para rushear`)
}

// 4. GENERADOR DE CLAN
let clan = async (m, { conn }) => {
    let tags = ['『FF』', '『YT』', '『PRO』', '『TEAM』', '『GOD』']
    let nombres = ['Destroyers', 'Legends', 'Killers', 'Ghosts', 'Titans', 'Warriors', 'Squad']
    let clan = `${tags[Math.floor(Math.random() * tags.length)]}${nombres[Math.floor(Math.random() * nombres.length)]}`
    m.reply(`*Nombres para Clan:*\n\n1. ${clan}\n2. ${clan.replace('FF', 'YT')}\n3. ${clan.replace('『', '乂')}`)
}

// 5. FRASES PARA BIO
let bioff = async (m, { conn }) => {
    let bios = [
        'Solo vs Squad 😈 | 1 vs 4',
        'Noob hoy, Pro mañana 🔥',
        'Si no rusheas, no ganas',
        'M1887 en la mano y a romper 💥',
        'Cabeza o nada 🎯',
        'Dios primero, Booyah después 🙏'
    ]
    m.reply(`*Bios para FF:*\n\n${bios[0]}\n${bios[1]}\n${bios[2]}`)
}

// 6. CALCULAR K/D
let kd = async (m, { conn, args }) => {
    if (args.length < 2) return m.reply('*Ejemplo:* .kd 500 100')
    let kills = parseInt(args[0])
    let deaths = parseInt(args[1])
    let kd = (kills / deaths).toFixed(2)
    let nivel = kd > 3? 'Dios 😈' : kd > 2? 'Pro 🔥' : kd > 1? 'Bueno 👍' : 'Noob 😅'
    m.reply(`*📊 ESTADÍSTICAS*\n\n*Kills:* ${kills}\n*Muertes:* ${deaths}\n*K/D:* ${kd}\n*Nivel:* ${nivel}`)
}

let handler = async (m, { conn, command,...args }) => {
    if (command === 'ff') return ff(m, { conn,...args })
    if (command === 'nombref') return nombref(m, { conn,...args })
    if (command === 'arma') return arma(m, { conn,...args })
    if (command === 'clan') return clan(m, { conn,...args })
    if (command === 'bioff') return bioff(m, { conn,...args })
    if (command === 'kd') return kd(m, { conn,...args })
}

handler.help = ['ff', 'nombref', 'arma', 'clan', 'bioff', 'kd']
handler.tags = ['freefire']
handler.command = ['ff', 'nombref', 'arma', 'clan', 'bioff', 'kd']
export default handler