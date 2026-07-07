/**
 * 📂 COMANDO: Nexus Logo Maker
 * 👤 CREADOR: Whois Yallico
 * ⚡ CANAL: For Three
 */
import fetch from "node-fetch"

let handler = async (m, { conn, text }) => {
    const key = Buffer.from('c2FzdWtl', 'base64').toString('utf-8')
    if (!text) return m.reply(`*🎨 NEXUS LOGO MAKER*\n\n*Uso:* .logo For Three Gaming`)
    
    await m.react('⏳')
    try {
        let res = await fetch(`https://api.evogb.org/ai/logo?text=${encodeURIComponent(text)}&key=${key}`)
        let json = await res.json()
        if (!json.status) throw json.message
        
        await conn.sendFile(m.chat, json.data.result, 'logo.png', `*🎨 NEXUS LOGO*\n\n*Texto:* ${text}\n👤 *Creador:* Whois Yallico\n⚡ *For Three*`, m)
        await m.react('✅')
    } catch (e) {
        await m.react('❌')
        m.reply(`❌ ${e}`)
    }
}
handler.command = /^(logo)$/i
handler.limit = true
export default handler