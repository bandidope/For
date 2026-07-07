/**
 * 📂 COMANDO: Uchiha YouTube MP3 Downloader
 * 📝 DESCRIPCIÓN: Extrae y descarga el audio de YouTube en MP3
 * 👤 CREADOR: Whois Yallico
 * ⚡ CANAL: For Three
 * 🔌 API: https://api.evogb.org
 */
import fetch from "node-fetch"

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const key = Buffer.from('c2FzdWtl', 'base64').toString('utf-8')

    if (!text) return conn.reply(m.chat, `*☁️ For Three - YT MP3*\n\n*Uso:* ${usedPrefix + command} [link] [128|320]\n*Ejemplo:* ${usedPrefix + command} https://youtu.be/xxx 320`, m)

    if (!text.match(/(youtu\.be\/|youtube\.com\/watch\?v=)/)) {
        return m.reply(`*❌ Link inválido*\nManda un link de YouTube válido`)
    }

    let args = text.trim().split(' ')
    let url = args[0]
    let quality = args[1] || '128'

    await m.react('⏳')
    let timeout = setTimeout(() => m.react('🕐'), 12000)

    try {
        let apiUrl = `https://api.evogb.org/dl/ytmp3?url=${encodeURIComponent(url)}&quality=${quality}&key=${key}`
        let resDl = await fetch(apiUrl)
        let jsonDl = await resDl.json()

        if (!jsonDl.status ||!jsonDl.data?.dl) throw jsonDl.message || 'Error al procesar'

        let { title, thumbnail, author, dl, quality: ql, duration } = jsonDl.data

        // FIX 1: Descargar el audio en buffer en vez de mandar el link
        await m.reply('*Descargando audio... espera*')
        let audioBuffer = await fetch(dl).then(v => v.buffer())

        clearTimeout(timeout)

        let info = `*☁️ For Three - Audio Descargado*\n\n📌 *Título:* ${title}\n👤 *Canal:* ${author?.name || 'Desconocido'}\n⏱️ *Duración:* ${duration? new Date(duration * 1000).toISOString().substr(11, 8) : 'N/A'}\n💿 *Calidad:* ${ql || quality + 'kbps'}\n\n👤 *Creador:* Whois Yallico\n⚡ *Canal:* For Three`

        // FIX 2: Mandar con thumbnail + audio/mp4
        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mp4', // <-- clave para que WA lo reproduzca
            fileName: `${title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: author?.name || 'YouTube',
                    thumbnailUrl: thumbnail,
                    mediaType: 2,
                    sourceUrl: url
                }
            }
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        clearTimeout(timeout)
        console.error(e)
        await m.react('❌')
        m.reply(`❌ Error: ${e}`)
    }
}

handler.help = ['ytmp3']
handler.tags = ['descargas']
handler.command = /^(ytmp3|yta|playmp3)$/i
handler.limit = true

export default handler