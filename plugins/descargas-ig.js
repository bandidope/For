/**
 * 📂 COMANDO: Nexus Instagram Downloader V2
 * 👤 CREADOR: Whois Yallico
 * ⚡ CANAL: For Three
 */
import fetch from "node-fetch"

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const key = Buffer.from('c2FzdWtl', 'base64').toString('utf-8')
    
    if (!text) return m.reply(`*📸 NEXUS INSTAGRAM*\n\n*Uso:* ${usedPrefix + command} [link]`)
    if (!text.match(/instagram\.com/)) return m.reply('*❌ Link inválido*')

    await m.react('⏳')

    try {
        let apiUrl = `https://api.evogb.org/dl/ig?url=${encodeURIComponent(text)}&key=${key}`
        let res = await fetch(apiUrl, { timeout: 15000 })
        let txt = await res.text() // Primero leemos como texto

        // SI VIENE HTML = API CAÍDA
        if (txt.startsWith('<') || txt.includes('EVOGB')) {
            throw 'La API está caída o te bloquearon. Intenta en 5 min'
        }

        let json = JSON.parse(txt) // Ahora sí lo convertimos a JSON
        
        if (!json.status || !json.data?.dl) throw json.message || 'No se pudo descargar'

        let { title, author, dl } = json.data

        let caption = `*📸 NEXUS INSTAGRAM*\n\n` +
                      `📌 *Descripción:* ${title || 'Sin descripción'}\n` +
                      `👤 *Autor:* ${author || 'Desconocido'}\n` +
                      `👤 *Creador:* Whois Yallico\n` +
                      `⚡ *Canal:* For Three`

        await conn.sendMessage(m.chat, {
            video: { url: dl },
            caption: caption
        }, { quoted: m })

        await m.react('✅')
        
    } catch (e) {
        await m.react('❌')
        m.reply(`❌ Error: ${e}\n\n*Nota:* La API de evogb a veces se cae. Si sigue fallando prueba con .tt`)
    }
}

handler.help = ['instagram']
handler.tags = ['Descargas']
handler.command = /^(ig|instagram)$/i
handler.limit = true

export default handler