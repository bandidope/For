/**
 * 📂 COMANDO: Nexus TikTok Downloader
 * 📝 DESCRIPCIÓN: Descarga videos de TikTok sin marca de agua
 * 👤 CREADOR: Whois Yallico
 * ⚡ CANAL: For Three
 * 🔌 API: https://api.evogb.org
 */
import fetch from "node-fetch"

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const key = Buffer.from('c2FzdWtl', 'base64').toString('utf-8')
    
    if (!text) {
        return conn.reply(m.chat, `*📱 NEXUS TIKTOK*\n\n*Uso:* ${usedPrefix + command} [link]\n*Ejemplo:* ${usedPrefix + command} https://www.tiktok.com/@user/video/123`, m)
    }
    
    if (!text.match(/tiktok\.com/)) {
        return m.reply('*❌ Link inválido*\nManda un link de TikTok válido')
    }

    await m.react('⏳')
    let timeout = setTimeout(() => m.react('🕐'), 10000)

    try {
        let apiUrl = `https://api.evogb.org/dl/tiktok?url=${encodeURIComponent(text)}&key=${key}`
        let res = await fetch(apiUrl, { timeout: 15000 })
        let json = await res.json()
        
        // Reintento si falla
        if (!json.status || !json.data?.dl) {
            await new Promise(r => setTimeout(r, 2000))
            res = await fetch(apiUrl)
            json = await res.json()
            if (!json.status) throw json.message || 'No se pudo descargar'
        }

        let { title, author, dl, cover, duration } = json.data
        clearTimeout(timeout)

        let caption = `*📱 TIKTOK*\n\n` +
                      `📌 *Título:* ${title}\n` +
                      `👤 *Autor:* ${author}\n` +
                      `⏱️ *Duración:* ${duration}s\n` +
                      `👤 *Creador:* Whois Yallico\n` +
                      `⚡ *Canal:* For Three`

        // Enviar video sin marca de agua
        await conn.sendMessage(m.chat, {
            video: { url: dl },
            caption: caption,
            fileName: `tiktok_${author}.mp4`,
            mimetype: 'video/mp4'
        }, { quoted: m })

        await m.react('✅')
        
    } catch (e) {
        clearTimeout(timeout)
        console.error(e)
        await m.react('❌')
        m.reply(`❌ Error: ${e}`)
    }
}

handler.help = ['tiktok']
handler.tags = ['Descargas']
handler.command = /^(tiktok|tt|tiktokdl)$/i
handler.limit = true

export default handler