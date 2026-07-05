import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, usedPrefix, command, args }) => {
    let q = m.quoted? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''

    let defaultPack = 'For Three Bot'
    let defaultAuthor = 'Whois'

    switch (command) {
        case 's': case 'sticker': case 'stiker': {
            if (!/webp|image|video|gif/g.test(mime))
                return m.reply(`⚠️ *Responde a una imagen, video o gif*\n\n📌 Ejemplo: ${usedPrefix}s`)

            if (/video/g.test(mime) && (q.msg || q).seconds > 10)
                return m.reply(`⚠️ *El video es muy largo*\nMáximo 10 segundos`)

            let img
            try {
                img = await q.download()
                if (!img) return m.reply('❌ Error al descargar')
            } catch {
                return m.reply('❌ Error al descargar')
            }

            let type = args[0] === 'circle' || args[0] === 'c'? StickerTypes.CIRCLE : StickerTypes.FULL

            // Intentar con wa-sticker-formatter
            try {
                let stiker = new Sticker(img, {
                    pack: defaultPack,
                    author: defaultAuthor,
                    type: type,
                    quality: 50
                })
                let buffer = await stiker.toBuffer()
                await conn.sendFile(m.chat, buffer, 'sticker.webp', '', m, true)
            } catch (e) {
                // Fallback con tu lib
                try {
                    let stiker = await sticker(img, false, defaultPack, defaultAuthor)
                    await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true)
                } catch {
                    m.reply('❌ Error al crear sticker. La imagen puede ser muy pesada')
                }
            }
            break
        }

        case 'wm': case 'marca': {
            if (!m.quoted) return m.reply(`⚠️ *Responde a un sticker*`)
            if (!/webp/g.test(m.quoted.mimetype)) return m.reply(`⚠️ Solo stickers webp`)

            let pack = args[0] || defaultPack
            let author = args[1] || defaultAuthor

            try {
                let media = await m.quoted.download()
                let stiker = new Sticker(media, {
                    pack: pack,
                    author: author,
                    type: StickerTypes.FULL,
                    quality: 50
                })
                let buffer = await stiker.toBuffer()
                await conn.sendFile(m.chat, buffer, 'sticker.webp', '', m, true)
            } catch {
                try {
                    let stiker = await sticker(media, false, pack, author)
                    await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true)
                } catch {
                    m.reply('❌ Error al cambiar marca de agua')
                }
            }
            break
        }
    }
}

handler.help = ['s', 's circle', 'wm <pack> <author>']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker', 'wm', 'marca']
handler.limit = 5
export default handler