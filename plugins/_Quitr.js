/**
 * 📂 COMANDO: Lux Remove BG
 * 👤 CREADOR: Whois Yallico
 * ⚡ CANAL: For Three
 */
import fetch from "node-fetch"
import FormData from "form-data"

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    if (!(q.msg || q).mimetype?.startsWith('image')) {
        return m.reply(`*💎 LUX REMOVE BG*\n\nResponde a una imagen con .luxremovebg`)
    }

    await m.react('⏳')
    
    try {
        let img = await q.download()
        let form = new FormData()
        form.append('image', img, { filename: 'image.jpg' })

        let res = await fetch('https://luxinfinity.vercel.app/api/removebg', {
            method: 'POST',
            body: form,
            headers: form.getHeaders()
        })
        
        let json = await res.json()
        if (!json.result) throw 'Error al procesar'

        await conn.sendFile(m.chat, json.result, 'luxnobg.png', `*💎 LUX REMOVE BG*\n\n✅ Fondo eliminado\n👤 *Creador:* Whois Yallico`, m)
        await m.react('✅')
        
    } catch (e) {
        await m.react('❌')
        m.reply(`❌ Error: ${e}`)
    }
}

handler.command = /^(luxremovebg|bg)$/i
handler.limit = true
export default handler