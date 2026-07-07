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

    if (!text) return conn.reply(m.chat, `*☁️ For Three - YT MP3*\n\n*Uso:* ${usedPrefix + command} [link] [128|320]`, m)
    if (!text.match(/(youtu\.be\/|youtube\.com\/watch\?v=)/)) return m.reply(`*❌ Link inválido*`)

    let args = text.trim().split(' ')
    let url = args[0]
    let quality = args[1] || '128'

    await m.react('⏳')

    try {
        let apiUrl = `https://api.evogb.org/dl/ytmp3?url=${encodeURIComponent(url)}&quality=${quality}&key=${key}`
        let resDl = await fetch(apiUrl, { timeout: 15000 })
        let jsonDl = await resDl.json()

        if (!jsonDl.status ||!jsonDl.data?.dl) throw jsonDl.message || 'La API no devolvió link'

        let { title, thumbnail, author, dl, quality: ql, duration } = jsonDl.data

        let info = `*☁️ For Three - Audio Descargado*\n\n📌 *Título:* ${title}\n👤 *Canal:* ${author?.name || 'Desconocido'}\n💿 *Calidad:* ${ql || quality + 'kbps'}\n\n👤 *Creador:* Whois Yallico\n⚡ *Canal:* For Three`

        // INTENTAR DESCARGAR BUFFER CON TIMEOUT DE 20s
        let audioBuffer
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 20000) // 20s max
            
            let resAudio = await fetch(dl, { signal: controller.signal })
            clearTimeout(timeoutId)
            
            if (!resAudio.ok) throw 'Link caído'
            audioBuffer = await resAudio.buffer()
        } catch {
            // FALLBACK: Si no se pudo descargar, manda el link
            await m.react('⚠️')
            return m.reply(`${info}\n\n*⚠️ No se pudo enviar directo*\n*Link de descarga:* ${dl}`)
        }

        // Verificar que no pese +16MB
        if (audioBuffer.length > 16 * 1024 * 1024) {
            await m.react('⚠️')
            return m.reply(`${info}\n\n*⚠️ Audio muy pesado: ${(audioBuffer.length/1024/1024).toFixed(2)}MB*\n*Link de descarga:* ${dl}`)
        }

        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: author?.name || 'YouTube',
                    thumbnailUrl: thumbnail,
                    mediaType: 1,
                    sourceUrl: url
                }
            }
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
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