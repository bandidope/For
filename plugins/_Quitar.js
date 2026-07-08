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
  form.append('size', 'auto')

  const res = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': API_KEY },
    body: form
  })
  
  if (!res.ok) return m.reply(`❌ Error: ${res.status}`)
  const result = Buffer.from(await res.arrayBuffer())

  await conn.sendMessage(m.chat, {
    image: result,
    mimetype: 'image/png',
    caption: `╭─❒「 ✨ FOR THREE REMOVE BG 」\n│\n│ ✅ Fondo eliminado\n│ 👤 Creador: Whois Yallico\n╰─⬣`
  }, { quoted: m })
  
  await m.react('✅')
}

handler.command = /^(rmbg|bg|ftbg)$/i
handler.limit = true
export default handler