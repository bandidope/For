/*
  📂 COMANDO:.rmbg.bg.ftbg
  👤 CREADOR: Whois Yallico
  ⚡ CANAL: For Three
*/

import fetch from 'node-fetch'
import FormData from 'form-data'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const API_KEY = 'r1sud8kN7RvE53pRKb63tcUL'

async function getImageBuffer(m, conn) {
  let q = m.quoted? m.quoted : m
  if (!q.message) return null
  
  let type = Object.keys(q.message)[0]
  if (type === 'viewOnceMessageV2' || type === 'viewOnceMessage') {
    type = Object.keys(q.message[type].message)[0]
  }
  if (type === 'ephemeralMessage') {
    type = Object.keys(q.message[type].message)[0]
  }
  
  let msg = q.message[type]
  if (!msg.mimetype?.startsWith('image')) return null
  
  const stream = await downloadContentFromMessage(msg, 'image')
  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  return Buffer.concat(chunks)
}

const handler = async (m, { conn }) => {
  await m.react('🔄')
  let imgBuffer = await getImageBuffer(m, conn)
  if (!imgBuffer) return conn.reply(m.chat, `📸 *Responde a una imagen con:*.rmbg`, m)

  try {
    const form = new FormData()
    form.append('image_file', imgBuffer, { filename: 'image.jpg' })
    form.append('size', 'auto')
    form.append('bg_color', 'transparent')

    const res = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': API_KEY },
      body: form
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`API Error: ${res.status}`)
    }
    
    const buffer = Buffer.from(await res.arrayBuffer())

    await conn.sendMessage(m.chat, {
      image: buffer,
      mimetype: 'image/png',
      caption: `╭─❒「 ✨ FOR THREE REMOVE BG 」
│
│ ✅ Fondo eliminado con éxito
│ 📊 Calidad: HD
│ 👤 Creador: Whois Yallico
╰─⬣`
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    await m.react('🔴')
    conn.reply(m.chat, `❌ Error: ${e.message}\n¿Te quedaste sin créditos?`, m)
  }
}

handler.help = ['rmbg']
handler.tags = ['tools']
handler.command = /^(rmbg|bg|ftbg)$/i
handler.limit = true
export default handler