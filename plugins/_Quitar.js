import fetch from 'node-fetch'
import FormData from 'form-data'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const API_KEY = 'r1sud8kN7RvE53pRKb63tcUL'

const handler = async (m, { conn }) => {
  let q = m.quoted || m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) return m.reply(`📸 *Responde a una imagen con:*.rmbg`)
  if (!/image/.test(mime)) return m.reply(`📸 *Solo imágenes JPG/PNG*`)

  await m.react('🔄')
  const stream = await downloadContentFromMessage(q, 'image')
  let buffer = Buffer.from([])
  for await (let chunk of stream) buffer = Buffer.concat([buffer, chunk])

  const form = new FormData()
  form.append('image_file', buffer, { filename: 'image.jpg' })
  form.append('size', '4k') // HD para que no deje bordes feos
  form.append('bg_color', 'transparent') // Forzar transparente
  form.append('channels', 'rgba') // Canal alfa real
  form.append('semitransparency', 'true') // Para bordes suaves

  const res = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': API_KEY },
    body: form
  })
  
  if (!res.ok) {
    const error = await res.text()
    return m.reply(`❌ Error: ${error}`)
  }
  
  const result = Buffer.from(await res.arrayBuffer())

  await conn.sendMessage(m.chat, {
    document: result,
    mimetype: 'image/png',
    fileName: 'ForThree-RemoveBG-HD.png',
    caption: `╭─❒「 ✨ FOR THREE REMOVE BG HD」
│
│ ✅ Fondo eliminado en 4K
│ 📦 Sin compresión
│ 👤 Creador: Whois Yallico
╰─⬣`
  }, { quoted: m })
  
  await m.react('✅')
}

handler.command = /^(rmbg|bg|ftbg)$/i
handler.limit = true
export default handler