import figlet from 'figlet'
import { createCanvas, loadImage } from 'canvas'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'

// COMANDO ASCII
let ascii = async (m, { conn, text }) => {
    if (!text) return m.reply(`⚠️ *Falta el texto*\n\n📌 Ejemplo: .ascii Barboza\n*Fuentes:* standard, slant, big, block, doom`)
    
    await m.react('🎨')
    
    figlet.text(text, { font: 'slant' }, (err, data) => {
        if (err) return m.reply('❌ Error')
        conn.reply(m.chat, '```' + data + '```', m)
        m.react('✅')
    })
}

// COMANDO BLUE
let blue = async (m, { conn, usedPrefix }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image/.test(mime)) return m.reply(`⚠️ *Responde a una imagen*\n\n📌 Ejemplo: Responde imagen con ${usedPrefix}blue`)
    
    await m.react('💙')
    
    try {
        let img = await q.download()
        let image = await loadImage(img)
        
        const canvas = createCanvas(image.width, image.height)
        const ctx = canvas.getContext('2d')
        
        ctx.drawImage(image, 0, 0)
        
        // Filtro AZUL
        ctx.fillStyle = 'rgba(0, 102, 204, 0.35)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        let buffer = canvas.toBuffer('image/png')
        
        let sticker = new Sticker(buffer, {
            pack: 'Barboza Bot',
            author: 'Blue Filter',
            type: StickerTypes.FULL,
            quality: 70
        })
        
        await conn.sendSticker(m.chat, await sticker.toBuffer(), m)
        await m.react('✅')
        
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('❌ Error al procesar')
    }
}

let handler = async (m, { conn, command, ...args }) => {
    if (command === 'ascii' || command === 'art') return ascii(m, { conn, ...args })
    if (command === 'blue') return blue(m, { conn, ...args })
}

handler.help = ['ascii <texto>', 'blue']
handler.tags = ['tools', 'sticker']
handler.command = ['ascii', 'art', 'blue']
handler.limit = true
export default handler