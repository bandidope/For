/**
 * 📂 COMANDO: Nexus MediaFire Downloader
 * 📝 DESCRIPCIÓN: Descarga directa y procesamiento de archivos desde MediaFire
 * 👤 DESARROLLADOR: Whois Yallico
 * ⚡ PROYECTO: For Three
 */
import fetch from "node-fetch"

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const key = Buffer.from('c2FzdWtl', 'base64').toString('utf-8')
    
    if (!text) return conn.reply(m.chat, `*📥 Nexus MediaFire*\n\n*Formato:* ${usedPrefix + command} [link]\n*Ejemplo:* ${usedPrefix + command} https://www.mediafire.com/file/xxx`, m)

    if (!text.match(/https?:\/\/.*mediafire\.com\/.+/i)) {
        return m.reply(`*❌ Link inválido*\nSolo acepto links de MediaFire`)
    }

    await m.react('📥')
    let timeout = setTimeout(() => m.react('🕐'), 10000)

    try {
        let apiUrl = `https://api.evogb.org/dl/mediafire?url=${encodeURIComponent(text)}&key=${key}`
        let response = await fetch(apiUrl)
        let result = await response.json()
        
        if (!result.status || !result.data) {
            // Reintento
            await new Promise(r => setTimeout(r, 2000))
            response = await fetch(apiUrl)
            result = await response.json()
            if (!result.status || !result.data) throw result.message || 'Archivo no encontrado'
        }

        let { name, size, date, dl } = result.data
        let ext = name.split('.').pop().toLowerCase()
        let sizeNum = parseFloat(size)

        clearTimeout(timeout)

        // Si pesa más de 1.8GB mejor manda link porque WA no lo aguanta
        if (sizeNum > 1800) {
            let caption = `*📂 ARCHIVO MUY PESADO*\n\n` +
                          `🏷 *Nombre:* ${name}\n` +
                          `⚖ *Tamaño:* ${size}\n` +
                          `📅 *Fecha:* ${date}\n\n` +
                          `*Link directo:* ${dl}\n\n` +
                          `👤 *Creador:* Whois Yallico | ⚡ *For Three*`
            return m.reply(caption)
        }

        let caption = `*📂 ARCHIVO RECUPERADO*\n\n` +
                      `🏷 *Nombre:* ${name}\n` +
                      `⚖ *Tamaño:* ${size}\n` +
                      `📅 *Fecha:* ${date}\n` +
                      `👤 *Creador:* Whois Yallico\n` +
                      `⚡ *For Three*\n\n` +
                      `> _Enviando desde Nexus Engine..._`

        // Detectar tipo para enviar mejor
        if (/mp4|mkv|mov|avi/.test(ext)) {
            await conn.sendMessage(m.chat, { video: { url: dl }, caption, fileName: name }, { quoted: m })
        } else if (/jpg|jpeg|png|webp/.test(ext)) {
            await conn.sendMessage(m.chat, { image: { url: dl }, caption, fileName: name }, { quoted: m })
        } else if (/mp3|ogg|m4a/.test(ext)) {
            await conn.sendMessage(m.chat, { audio: { url: dl }, mimetype: 'audio/mp4', fileName: name }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, { document: { url: dl }, fileName: name, caption }, { quoted: m })
        }
        
        await m.react('✅')
        
    } catch (e) {
        clearTimeout(timeout)
        console.error(e)
        await m.react('❌')
        m.reply(`❌ Error: ${e}`)
    }
}

handler.help = ['mediafire']
handler.tags = ['descargas']
handler.command = /^(mediafire|mf|mediafiredl)$/i
handler.limit = true

export default handler