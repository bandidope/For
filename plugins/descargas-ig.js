/**
 * 📂 COMANDO: Nexus Instagram Downloader
 * 📝 DESCRIPCIÓN: Descarga Reels, Posts y Videos de Instagram
 * 👤 CREADOR: Whois Yallico
 * ⚡ CANAL: For Three
 * 🔌 API: https://api.evogb.org
 */
import fetch from "node-fetch"

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const key = Buffer.from('c2FzdWtl', 'base64').toString('utf-8')
    
    if (!text) {
        return conn.reply(m.chat, `*📸 NEXUS INSTAGRAM*\n\n*Uso:* ${usedPrefix + command} [link]\n*Ejemplo:* ${usedPrefix + command} https://www.instagram.com/reel/ABC123`, m)
    }
    
    if (!text.match(/instagram\.com/)) {
        return m.reply('*❌ Link inválido*\nManda un link de Reel, Post o Video de IG')
    }

    await m.react('⏳')
    let timeout = setTimeout(() => m.react('🕐'), 10000)

    try {
        let apiUrl = `https://api.evogb.org/dl/ig?url=${encodeURIComponent(text)}&key=${key}`
        let res = await fetch(apiUrl, { timeout: 15000 })
        let json = await res.json()
        
        // Reintento si falla
        if (!json.status || !json.data?.dl) {
            await new Promise(r => setTimeout(r, 2000))
            res = await fetch(apiUrl)
            json = await res.json()
            if (!json.status) throw json.message || 'No se pudo descargar'
        }

        let { title, author, dl, thumbnail } = json.data
        clearTimeout(timeout)

        let caption = `*📸 NEXUS INSTAGRAM*\n\n` +
                      `📌 *Descripción:* ${title || 'Sin descripción'}\n` +
                      `👤 *Autor:* ${author || 'Desconocido'}\n` +
                      `👤 *Creador:* Whois Yallico\n` +
                      `⚡ *Canal:* For Three`

        // Enviar video de IG
        await conn.sendMessage(m.chat, {
            video: { url: dl },
            caption: caption,
            fileName: `instagram_${author}.mp4`,
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

handler.help = ['instagram']
handler.tags = ['Descargas']
handler.command = /^(ig|instagram|igdl)$/i
handler.limit = true

export default handler