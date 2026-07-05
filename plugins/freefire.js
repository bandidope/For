import axios from 'axios'

// 1. INFO DE PERFIL FF - Busca por ID
let ff = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`*Ejemplo:* ${usedPrefix + command} 12345678\n*Nota:* Necesitas el ID de FF`)
    try {
        await m.react('🎮')
        // API publica de FF
        let { data } = await axios.get(`https://ff.garena.com/api/profile/${text}`)
        m.reply(`*🎮 PERFIL FREE FIRE*\n\n*ID:* ${data.id}\n*Nick:* ${data.name}\n*Nivel:* ${data.level}\n*Rango:* ${data.rank}\n*Likes:* ${data.likes}\n*Región:* ${data.region}`)
    } catch {
        m.reply('❌ ID no encontrado o perfil privado')
    }
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
    let armas = ['M1887', 'M82B', 'AWM', 'MP40', 'SCAR', 'AK47', 'GROZA', 'M4A1', 'UMP', 'P90']
    let arma = armas[Math.floor(Math.random() * armas.length)]
    m.reply(`🔫 *Tu arma es:* ${arma}\n\nUsala para rushear 😈`)
}

// 4. GENERADOR DE CLAN
let clan = async (m, { conn }) => {
    let tags = ['『FF』', '『YT』', '『PRO』', '『TEAM』', '『GOD』']
    let nombres = ['Destroyers', 'Legends', 'Killers', 'Ghosts', 'Titans', 'Warriors', 'Squad']
    let clan = `${tags[Math.floor(Math.random() * tags.length)]}${nombres[Math.floor(Math.random() * nombres.length)]}`
    m.reply(`*Nombres para Clan:*\n\n1. ${clan}\n2. ${clan.replace('FF', 'YT')}\n3. ${clan.replace('『', '【').replace('』', '】')}`)
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
    let bio = bios[Math.floor(Math.random() * bios.length)]
    m.reply(`*Bios para FF:*\n\n${bio}\n\n${bios[Math.floor(Math.random() * bios.length)]}\n\n${bios[Math.floor(Math.random() * bios.length)]}`)
}

// 6. CALCULAR K/D
let kd = async (m, { conn, args }) => {
    if (args.length < 2) return m.reply('*Ejemplo:* .kd kills muertes\n*Ejemplo:* .kd 500 100')
    let kills = parseInt(args[0])
    let deaths = parseInt(args[1])
    let kd = (kills / deaths).toFixed(2)
    let nivel = kd > 3? 'Dios 😈' : kd > 2? 'Pro 🔥' : kd > 1? 'Bueno 👍' : 'Noob 😅'
    m.reply(`*📊 ESTADÍSTICAS*\n\n*Kills:* ${kills}\n*Muertes:* ${deaths}\n*K/D:* ${kd}\n*Nivel:* ${nivel}`)
}

// 7. EVENTO FF
let evento = async (m, { conn }) => {
    try {
        let { data } = await axios.get('https://api.codetabs.com/v1/proxy?quest=https://ff.garena.com/api/events')
        m.reply(`*🎁 EVENTOS ACTIVOS FF*\n\nRevisa en el juego la pestaña de Eventos\n*Tip:* Recoge diamantes gratis todos los días`)
    } catch {
        m.reply('Revisa los eventos en el juego bro. Los eventos cambian cada semana 🎁')
    }
}

let handler = async (m, { conn, command,...args }) => {
    if (command === 'ff') return ff(m, { conn,...args })
    if (command === 'nombref') return nombref(m, { conn,...args })
    if (command === 'arma') return arma(m, { conn,...args })
    if (command === 'clan') return clan(m, { conn,...args })
    if (command === 'bioff') return bioff(m, { conn,...args })
    if (command === 'kd') return kd(m, { conn,...args })
    if (command === 'evento') return evento(m, { conn,...args })
}

handler.help = ['ff', 'nombref', 'arma', 'clan', 'bioff', 'kd', 'evento']
handler.tags = ['freefire']
handler.command = ['ff', 'nombref', 'arma', 'clan', 'bioff', 'kd', 'evento']
export default handler