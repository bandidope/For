import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { sticker } from '../lib/sticker.js'
import { toBuffer } from 'wa-sticker-formatter'
import sharp from 'sharp' // Para convertir webp a png

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
            } catch {
                return m.reply('❌ Error al descargar')
            }

            let type = args[0] === 'circle' || args[0] === 'c'? StickerTypes.CIRCLE : StickerTypes.FULL
            try {
                let stiker = new Sticker(img, { pack: defaultPack, author: defaultAuthor, type: type, quality: 50 })
                let buffer = await stiker.toBuffer()
                await conn.sendFile(m.chat, buffer, 'sticker.webp', '', m, true)
            } catch {
                let stiker = await sticker(img, false, defaultPack, defaultAuthor)
                await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true)
            }
            break
        }

        case 'toimg': case 'img': {
            if (!m.quoted) return m.reply(`⚠️ *Responde a un sticker*`)
            if (!/webp/g.test(m.quoted.mimetype)) return m.reply(`⚠️ Solo stickers webp`)

            try {
                let media = await m.quoted.download()
                // CONVERTIR WEBP A PNG CON SHARP
                let pngBuffer = await sharp(media).png().toBuffer()
                await conn.sendFile(m.chat, pngBuffer, 'sticker.png', '✅ *Sticker convertido a imagen*', m)
            } catch (e) {
                console.error(e)
                m.reply('❌ Error al convertir. Instala: npm i sharp')
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
                let stiker = new Sticker(media, { pack: pack, author: author, type: StickerTypes.FULL, quality: 50 })
                let buffer = await stiker.toBuffer()
                await conn.sendFile(m.chat, buffer, 'sticker.webp', '', m, true)
            } catch {
                let stiker = await sticker(media, false, pack, author)
                await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true)
            }
            break
        }
    }
}

handler.help = ['s', 's circle', 'toimg', 'wm <pack> <author>']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker', 'toimg', 'img', 'wm', 'marca']
handler.limit = 5
export default handler